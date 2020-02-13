

class WebStatusPage {
    constructor() {
    }

    async load() {
        await forLoad();
        let artistLink = document.querySelector("article a");
        if (artistLink) {
            let newPathname = window.location.pathname.replace(/\/i\/web(.*)/, (new URL(artistLink.href)).pathname + "$1");
            window.location.pathname = newPathname;
        }
        else throw new Error('Could not redirect to arist page.')
    }

    unload() {
    }
}

export default WebStatusPage

function forLoad() {
    return new Promise((resolve, reject) => {
        if (document.querySelector("article") !== null) {
            resolve(true);
            return;
        }
        let timer = setInterval(() => {
            if (document.querySelector("article") !== null) {
                clearInterval(timer);
                resolve(true);
            }
        }, 100);
    })
}
