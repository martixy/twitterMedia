import Downloader from '../Downloader'
import config from '../../config/config'

const QUERY = "query";
const PATHNAME = "pathname";
const rePATH = /.*\/(\w+)\.(\w+)/;

class MediaPage {
    constructor() {
        this.downloader = new Downloader();
        this.urlVariant = null;
    }

    async load() {
        let self = this;
        let url = new URL(window.location);
        if (url.searchParams.get('name') !== 'orig') {
            url.searchParams.set('name', 'orig');
            window.location.href = url;
            return;
        }
        // let urlMatch = window.location.href.match(/(https:\/\/pbs\.twimg\.com\/media\/([^?]*)\?.*name=)(.*)/);
        if (url.searchParams.get('format')) {
            this.urlVariant = QUERY; // media/asdf?format=jpg&name=orig
        } else {
            this.urlVariant = PATHNAME; // media/asdf.jpg?name=orig
        }


        let cachedParent = null;
        let pokeForParent = setInterval(async () => {
            cachedParent = await getParentTab(self.urlVariant);
            if (cachedParent) clearInterval(pokeForParent);
        }, 500);

        this.downloader.bindKeys([
            {
                keys: config.keyBindings.download,
                async method(ev) {
                    let parent = null;
                    try {
                        parent = await getParentTab(self.urlVariant);
                        // console.log(parent);
                    } catch (error) {
                        if (cachedParent) parent = cachedParent;
                        else console.warn("No parent tab, unable to make compose meaningful name.");
                    }

                    let placeholder = null;
                    let urlMatch = url.pathname.match(rePATH);
                    if (parent && parent.name) {
                        placeholder = parent.name
                    } else {
                        placeholder = parent ? "" : "tw_";
                        if (self.urlVariant === QUERY) {
                            placeholder += window.location.pathname.substring(7);
                        }
                        if (self.urlVariant === PATHNAME) {
                            placeholder += urlMatch[1];
                        }
                    }

                    let ext = null;
                    if (self.urlVariant === QUERY) {
                        ext = url.searchParams.get('format');
                    }
                    if (self.urlVariant === PATHNAME) {
                        ext = urlMatch[2];
                    }
                    let name = window.prompt("Image title?", placeholder);
                    if (!name) name = placeholder;
                    let filename = `${name}.${ext}`;
                    if (parent) {
                        filename = `${parent.data.username}-tw-${parent.data.date}-${parent.data.id}-${parent.data.photoNum}-${name.replace(/ /g, '_')}.${ext}`;
                    }
                    self.downloader.downloadImage(window.location.href, filename);
                }
            }
        ]);
    }

    unload() {
        // This unloads when the page closes. :)
    }
}

export default MediaPage

//===========================================================================================================
//===========================================================================================================

function getParentTab(urlVariant) {
    return new Promise((resolve, reject) => {
        GM_getTabs(allTabs => {
            // console.log(allTabs);
            for (const tabId in allTabs) {
                if ('url' in allTabs[tabId]) {
                    if (urlVariant === QUERY) {
                        // Variant 1: /media/asdf?format=jpg&name=orig
                        if (allTabs[tabId].url === window.location.href) {
                            resolve(allTabs[tabId]);
                            break;
                        }
                    }
                    if (urlVariant === PATHNAME) {
                        // Variant 2: /media/asdf.jpg?name=orig
                        let maybeParent = new URL(allTabs[tabId].url);
                        const maybeName = maybeParent.pathname.substring(7);
                        const maybeFormat = maybeParent.searchParams.get('format');
                        const maybeSize = maybeParent.searchParams.get('name');

                        const url = new URL(window.location);
                        const urlMatch = url.pathname.match(rePATH);
                        if (!urlMatch) throw new Error("Failed to match image filename from URL. Expected to be at url with pathname like '/media/asdf.jpg'.");
                        const name = urlMatch[1];
                        const format = urlMatch[2];
                        const size = url.searchParams.get('name');

                        if (name === maybeName && format === maybeFormat && size === maybeSize) {
                            resolve(allTabs[tabId]);
                            break;
                        }
                    }

                }
            }
            reject('No parent tab found.');
        })
    })
}
