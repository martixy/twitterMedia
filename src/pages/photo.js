import Downloader from '../Downloader'
import config from '../../config/config';

const statusRegex = /twitter\.com\/[^\/]+\/status\/(\d+)$/;

class PhotoPage {
    constructor(prev) {
        this.downloader = new Downloader();
        this.underlyingPage = null; // The logic here is iffy. I.e. it can probably end up with a bad value.
    }

    async load(prevPage) {
        let self = this;

        if (prevPage && !prevPage.match(/status\/\d+\/photo/)) {
            this.underlyingPage = prevPage;
        }

        let img = await getImage();
        let bigUrl = new URL(img.src);
        let fileFormat = bigUrl.searchParams.get('format');
        bigUrl.searchParams.set('name', 'orig');

        let isHotload = false;
        let isStatus = false;
        let postData = null;
        if (this.underlyingPage === null) {
            //TODO: An idea is to fetch a page with the data and parse it (e.g. /status). But fetching don't work because fucking of course - react. SSR is for chumps.
            //Only option is to load another tab with the status, which will run react's shite front-end scripts and send the data over from there. But meh. *Maybe* later.
            console.warn("This script cannot reliably handle page loads like this. This usually happens after a reload. I think they're done with the service worker? The underlying page isn't kept in localstorage or cookies or something. It also isn't loaded yet in many cases.");
            isHotload = true;
        }
        if (isHotload) {
            postData = getPostDataWithSpan();
            if (!postData.err) isStatus = true;
            else postData = getPostDataWithTime(img);
        } else {
            // Logic on how to parse the time of the post depending on what type of page it is.
            // 2 types of posts - where the time is in a <time> tag, or a <span> tag.
            // <time>s contain UTC datetimes and are easy to find in the post. <span>s contain stringy datetimes we need to parse and need to be enumerated till we find the right one.
            // S = isStatus, T = isTweet, H = hasChild, C = isChild
            // !S = <time>
            // S T = <time>
            // S !T !H = <span>
            // S !T H !C = <time>
            // S !T !H C = <span>
            // WolframAlpha is your friend.

            // console.log(this.underlyingPage);
            const statusMatch = this.underlyingPage.match(statusRegex);
            isStatus = statusMatch !== null;

            let isTweetThread = document.querySelector('section>div[aria-label="Timeline: Tweet"') !== null;
            let hasChild = !isTweetThread && document.querySelector('section>div[aria-label="Timeline: Conversation"]>div>div>div:nth-child(2)>div>article') !== null;
            let isThreadChild = hasChild && window.location.pathname.match(/status\/(\d+)/)[1] === statusMatch[1];
            if (isStatus && !isTweetThread && (!hasChild || isThreadChild)) {
                console.info('span post');
                postData = getPostDataWithSpan(isThreadChild);
            } else {
                console.info('time post');
                postData = getPostDataWithTime(img);
            }
        }
        // console.log(isHotload);
        // console.log(postData);
        if (!isHotload && postData.err) throw new Error('Something in twitter changed, not finding main post for ' + (isStatus ? 'STATUS' : 'FEED') + ' page.');
        updateTab(bigUrl.href, postData); // Sync on every load. This allows you to sync the constructed name with image pages, which don't have any way of constructing a meaningful name.
        // Technically a minor improvement is to save only one instance of a given url and only have the one with the most data, but meh. Too edge casey.


        this.downloader.bindKeys([
            {
                keys: config.keyBindings.download,
                method(ev) {
                    let name = window.prompt("Image title?", bigUrl.pathname.substring(7));
                    if (!name) name = bigUrl.pathname.substring(7);
                    let filename = `${postData.username}-tw-${postData.date}-${postData.id}-${postData.photoNum}-${name.replace(/ /g, '_')}.${fileFormat}`;
                    self.downloader.downloadImage(bigUrl.href, filename);
                }
            },
            {
                keys: config.keyBindings.newTab,
                method(ev) {
                    self.downloader.openInNewTab(bigUrl.href);
                }
            }
        ])

    }

    unload() {
        this.downloader.unbindKeys();
    }
}



export default PhotoPage


//===========================================================================================================
//===========================================================================================================

function getImage() {
    return new Promise((resolve, reject) => {
        let timeoutTimer;
        let imgTimer = setInterval(() => {
            let modal = document.querySelector("div[aria-modal='true']");
            let isMulti = modal.querySelector('ul') !== null;
            let img;
            if (isMulti) {
                let ordinal = window.location.pathname.match(/.*?(.)$/)[1];
                img = modal.querySelector(`li:nth-child(${ordinal}) div[aria-label='Image'] img`)
            } else {
                img = modal.querySelector("div[aria-label='Image'] img");
            }

            if (img) {
                clearInterval(imgTimer);
                clearTimeout(timeoutTimer);
                resolve(img);
            }
        }, 200);

        timeoutTimer = setTimeout(() => {
            clearInterval(imgTimer);
            reject("Couldn't find image.");
        }, 2000);
    });
}

function updateTab(url, data) {
    GM_getTab(tab => {
        tab.url = url;
        tab.data = data;
        GM_saveTab(tab);
    })
}

function parseDate(stupidDatetime) {
    const dateRegex = /(\D{3}) (\d{1,2}), (\d{4})/

    let dateStr = stupidDatetime.match(dateRegex);
    if (dateStr) return new Date(dateStr[0]);
    else return null;
}

function getPostDataWithSpan(isThreadChild = false) {
    let date, err;
    const postSelector = "div[aria-label='Timeline: Conversation'] article";
    const dateTimeSelector = "div>div>div[dir='auto']>span>span";

    try {
        let allPosts = document.querySelectorAll(postSelector);
        let mainPost;
        if (isThreadChild) mainPost = allPosts[1];
        else mainPost = allPosts[0];
        let spans = mainPost.querySelectorAll(dateTimeSelector);
        for (const maybeDate of spans) {
            if (date = parseDate(maybeDate.textContent)) {
                break;
            }
        }
        if (date) {
            date = date.getFullYear().toString()
                + (date.getMonth() + 1).toString().padStart(2, '0')
                + date.getDate().toString().padStart(2, '0');
        } else {
            date = 'nodate';
        }
    } catch (error) {
        err = error;
    }

    let [, username, id, photoNum] = getUrlData();

    return {
        username,
        date,
        id,
        photoNum,
        err
    }
}

function getPostDataWithTime(matchedImage) {
    let date, err;
    try {
        const times = document.querySelectorAll('time');
        let needle = new URL(matchedImage.src);
        let time;
        outer: //Daily opportunity to use obscure javascript features: Labels. js GOTO. Handle with care.
        for (const maybeTime of times) {
            let article = maybeTime.closest('article');
            let postImgs = article.querySelectorAll("img[alt='Image']");
            for (const img of postImgs) {
                let imgUrl = new URL(img.src);
                if (imgUrl.pathname === needle.pathname) {
                    time = maybeTime;
                    break outer;
                }
            }
        }

        date = new Date(time.dateTime);
        date = date.getFullYear().toString()
            + (date.getMonth() + 1).toString().padStart(2, '0')
            + date.getDate().toString().padStart(2, '0');
    } catch (error) {
        date = 'nodate';
        err = error;
    }

    let [, username, id, photoNum] = getUrlData();

    return {
        username,
        date,
        id,
        photoNum,
        err
    }
}

function getUrlData() {
    const statusUrlRe = /\/(\w+)\/status\/(\d+)\/photo\/(\d)/;
    let nameParts = window.location.pathname.match(statusUrlRe);
    if (!nameParts) throw new Error("Whoops! Couldn't parse the url to make a name.");
    return nameParts;
}
