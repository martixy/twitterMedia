import Downloader from '../Downloader'
import config from '../../config/config';

const statusRegex = /https:\/\/twitter\.com\/[^\/]+\/status\/\d+$/;

const imageSelector = "div[aria-modal='true'] div[aria-label='Image'] img";

class PhotoPage {
    constructor(prev) {
        this.downloader = new Downloader();
    }

    async load(underlyingPage) {
        let self = this;

        let img = await getImage();
        let bigUrl = new URL(img.src);
        let fileFormat = bigUrl.searchParams.get('format');
        bigUrl.searchParams.set('name', 'orig');

        let isHotload = false;
        let isStatus = false;
        let postData = null;
        if (underlyingPage === null) {
            //TODO: An idea is to fetch a page with the data and parse it (e.g. /status). But fetching don't work because fucking of course - react. SSR is for chumps.
            //Only option is to load another tab with the status, which will run react's shite front-end scripts and send the data over from there. But meh. *Maybe* later.
            console.warn("This script cannot reliably handle page loads like this. This usually happens after a reload. I think they're done with the service worker? The underlying page isn't kept in localstorage or cookies or something. It also isn't loaded yet in many cases.");
            isHotload = true;
        }
        if (isHotload) {
            postData = getStatusPostData();
            if (!postData.err) isStatus = true;
            else postData = getFeedPostData(img);
        } else {
            isStatus = underlyingPage.match(statusRegex) !== null;
            if (isStatus) {
                postData = getStatusPostData();
            } else {
                postData = getFeedPostData(img);
            }
        }
        if (!isHotload && postData.err) throw new Error('Something in twitter changed, not finding main post for ' + (isStatus ? 'status' : 'feed') + ' page.');
        updateTab(bigUrl.href, postData); // Sync on every load. This allows you to sync the constructed name with image pages, which don't have any way of constructing a meaningful name.
        // Technically a minor improvement is to save only one instance of a given url and only ave the one with the most data, but meh. Too edge casey.
        // console.log(postData);


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
            let img = document.querySelector(imageSelector);
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
    if (dateStr) {
        return new Date(dateStr[0]);
    }
    throw new Error(`Could not parse post date: "${stupidDatetime}"`);
}

function getStatusPostData() {
    let date, err;
    try {
        const postSelector = "div[aria-label='Timeline: Conversation'] article";
        const dateTimeSelector = "div>div>div[dir='auto']>span>span";

        let mainPost = document.querySelector(postSelector);
        let spans = mainPost.querySelectorAll(dateTimeSelector);
        let datetime = spans[2].textContent;
        date = parseDate(datetime);
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

function getFeedPostData(matchedImage) {
    let date, err;
    try {
        const feed = document.querySelector('section');
        const haystack = feed.querySelectorAll("img[alt='Image']"); // Not an Array, so no .find() :(( Is "NodeList" instead
        let needle = new URL(matchedImage.src);
        let postImg;
        for (const hay of haystack) {
            let hayUrl = new URL(hay.src);
            if (hayUrl.pathname === needle.pathname) {
                postImg = hay;
                break;
            }
        }
        let post = postImg.closest('article');
        let time = post.querySelector('time');
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
    const statusUrlRe = /\/([a-zA-Z]+)\/status\/(\d+)\/photo\/(\d)/;
    let nameParts = window.location.pathname.match(statusUrlRe);
    if (!nameParts) throw new Error("Whoops! Couldn't parse the url to make a name.");
    return nameParts;
}
