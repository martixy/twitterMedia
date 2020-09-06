import Downloader from '../Downloader'
import config from '../../config/config';

const statusRegex = /twitter\.com\/[^\/]+\/status\/(\d+)$/;
const HOT_RELOAD_DELAY = 200; //Hot reloads are tricky, introduces a slight delay to allow the page to load. Might still fail.

class PhotoPage {
    constructor(prev) {
        this.downloader = new Downloader();
        this.underlyingPage = null; // The logic here is iffy. I.e. it can probably end up with a bad value.
        this.cachedName = null;
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
            await delay(HOT_RELOAD_DELAY)
            postData = getPostDataWithSpan();
            if (!postData.err) isStatus = true;
            else postData = getPostDataWithTime(img);
        } else {
            /**
             * New logic on how to parse the time of the post depending on what type of page it is:
             * 2 types of posts - where the time is in a <time> tag, or a <span> tag.
             *  1. <time>s contain UTC datetimes and are easy to find in the post.
             *  2. <span>s contain stringy datetimes we need to parse and need to be enumerated till we find the right one.
             * 
             * Twitter has 2 modes:
             *  1. Feed: Basically https://twitter.com/username. Someone's feed of tweets, or search results or whatever. An infinitely scrolling list of tweets (divs with articles inside).
             *  2. Conversation: Has 2 variants: "Tweet" or "Thread" (says on top), but the basic structure is the same. It's a conversation, with 1 main post and any number of replies, possibly a parent.
             * 
             * If it's a feed it usually say "Timeline: <username>'s Tweets" or "Timeline: <username>'s Photos" or "Timeline: Search timeline".
             * If it's a conversation (i.e. a single main tweet) it says "Timeline: Conversation" and usually includes /status/ in the URL.
             * 
             * Feeds (i.e. !isStatus) are always times.
             * For conversation you have 1 main tweet, which is the tweet the URL points to and any number of neighbouring tweets, or maybe 1 parent and any number below...
             * In any case, the main post always seems to be a <span> while the siblings always seem to be times.
             * 
             * S = isStatus, M = isMain
             * !S = <time>
             * S M = <span>
             * S !M = <time>
             */

            // console.log(this.underlyingPage);
            const statusMatch = this.underlyingPage.match(statusRegex);
            isStatus = statusMatch !== null;
            let isMain = isStatus && window.location.pathname.match(/status\/(\d+)/)[1] === statusMatch[1];

            if (isMain) {
                console.info('span post');
                postData = getPostDataWithSpan();
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
                    let placeholder = bigUrl.pathname.substring(7);
                    if (self.cachedName) placeholder = self.cachedName;
                    let name = window.prompt("Image title?", placeholder);
                    if (!name) name = bigUrl.pathname.substring(7);
                    else {
                        self.cachedName = name;
                        updateTab(bigUrl.href, postData, name);
                    }
                    let filename = `${postData.username}-tw-${postData.date}-${postData.id}-${postData.photoNum}-${name.replace(/ /g, '_')}.${fileFormat}`;
                    self.downloader.downloadImage(bigUrl.href, filename);
                }
            },
            {
                keys: config.keyBindings.newTab,
                method(ev) {
                    //Transform from /media/<name>?format=jpg&name=... to /media/<name>.jpg?name=...
                    //Prevents an unnecessary redirect if you have both maxurl and this script enabled.
                    let ext = bigUrl.searchParams.get('format');
                    bigUrl.searchParams.delete('format');
                    bigUrl.pathname += "."+ext;
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
            // A few bits here deserve a comment: Evidently twitter has certain accessibility options, for putting descriptive text on images for screen readers.
            // This is implemented via "aria-label". By default it's value is "Image" and I was selecting on that, but this is where the accessibility text goes.
            // Goes to show how few people think of accessibility if I only encountered this bug after months of using the script.
            if (isMulti) {
                let ordinal = window.location.pathname.match(/.*?(.)$/)[1];
                img = modal.querySelector(`li:nth-child(${ordinal}) div[aria-label] img`)
            } else {
                img = modal.querySelector("div[aria-label] img");
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

function updateTab(url, data, name = null) {
    GM_getTab(tab => {
        tab.url = url;
        tab.data = data;
        if (name) tab.name = name;
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
    const postSelector = "div[aria-label='Timeline: Conversation']>div>div";
    const dateTimeSelector = "div>div>div[dir='auto']>a>span";

    try {
        //Find out which element in our timeline is our main post.
        //Basically, if the second one is not empty, it's that, otherwise the 1st.
        let postContainers = document.querySelectorAll(postSelector);
        let mainPost = postContainers[1].querySelector("article");
        if (!mainPost) mainPost = postContainers[0].querySelector("article");
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
            console.warn("Couldn't parse date. Maybe something in twitter changed? Or my logic sucks.");
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
            let postImgs = article.querySelectorAll("img[alt]");
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

function delay(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, delay)
    });
}
