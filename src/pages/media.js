import Downloader from '../Downloader'
import config from '../../config/config'

class MediaPage {
    constructor() {
        this.downloader = new Downloader();
    }

    async load() {
        let self = this;
        let url = window.location.href.match(/(https:\/\/pbs\.twimg\.com\/media\/.*name=)(.*)/);
        if (url !== null && url[2] !== 'orig') {
            window.location.href = url[1] + 'orig';
            return;
        }

        let cachedParent = null;
        let pokeForParent = setInterval(async () => {
            cachedParent = await getParentTab();
            if (cachedParent) clearInterval(pokeForParent);
        }, 500);

        this.downloader.bindKeys([
            {
                keys: config.keyBindings.download,
                async method(ev) {
                    let parent = null;
                    try {
                        parent = await getParentTab();
                        // console.log(parent);
                    } catch (error) {
                        if (cachedParent) parent = cachedParent;
                        else console.warn("No parent tab, unable to make compose meaningful name.");
                    }

                    url = new URL(window.location.href);
                    let ext = url.searchParams.get('format');
                    let tw_name = (parent ? "" : "tw_") + window.location.pathname.substring(7);
                    let name = window.prompt("Image title?", tw_name);
                    if (!name) name = tw_name;
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

function getParentTab() {
    return new Promise((resolve, reject) => {
        GM_getTabs(allTabs => {
            // console.log(allTabs);
            for (const tabId in allTabs) {
                if ('url' in allTabs[tabId] && allTabs[tabId].url === window.location.href) {
                    resolve(allTabs[tabId]);
                    break;
                }
            }
            reject('No parent tab found.');
        })
    })
}
