import KeyHandler from './KeyHandler' //TODO: Possibly replace this with mousetrap
import saveAs from 'file-saver'

const DEBUG_cleanFilenames = true;

class Downloader {
    constructor() {
        this.keyHandler = new KeyHandler();
        this.keyBindings = [];
    }
    openInNewTab(url) {
        GM_openInTab(url, {
            active: true,
            insert: true,
            setParent: true,
        });
    }
    downloadImage(url, name, options) {
        let defaultOptions = {
            timeout: 5000,
            async: false
        };
        options = { ...defaultOptions, ...options };
        if (GM_info.downloadMode === 'native') { // Browser API does not remember folder!
            if (options.async) {
                console.log('download: GM_download_async');
                return GM_dl_async(url, name, options);
            }
            else {
                console.log('download: GM_download');
                GM_dl(url, name, options);
            }
        }
        else {
            if (options.async) {
                console.log('download: fallback async');
                return GM_download_emu_async(url, name, options);
            }
            else {
                console.log('download: fallback');
                GM_download_emu(url, name, options);
            }
        }
    }


    bindKeys(keyBindings) {
        this.keyBindings = keyBindings;
        for (let action of this.keyBindings) {
            if (!Array.isArray(action.keys))
                action.keys = [action.keys];
            for (let key of action.keys) {
                this.keyHandler.registerKey("keydown", key, action.method.bind(this));
            }
        }
    }
    unbindKeys() {
        for (let action of this.keyBindings) {
            if (!Array.isArray(action.keys))
                action.keys = [action.keys];
            for (let key of action.keys) {
                this.keyHandler.unregisterKey("keydown", key, action.method.bind(this));
            }
        }
    }
}






export default Downloader

//===========================================================================================================
//===========================================================================================================

// Notes on GM_download
// 1. Undocumented, but has "timeout" option
function GM_dl(url, name, options) {
    name = cleanFilename(name);
    let defaultOptions = {
        saveAs: true,
        ontimeout: () => console.log("Timeout!"),
        onerror(err) {
            if (err.error === 'not_whitelisted') {
                console.log("Error: Buggy Tampermonkey, falling back to old downloader.");
                GM_download_emu(url, name, options);
            } else {
                alert("Error! (see console)");
                console.error(err);
            }
        },
        onload: () => {},
        onprogress: () => {},
    };
    options = { ...defaultOptions, ...options };

    GM_download({
        url: url,
        name: name,
        saveAs: options.saveAs,
        timeout: options.timeout,
        ontimeout: options.ontimeout,
        onerror: options.onerror,
        onload: options.onload,
        onprogress: options.onprogress,
    });
}

function GM_dl_async(url, name, options) {
    let defaultOptions = {
        saveAs: true,
        timeout: 5000,
        onprogress: () => {},
    };
    options = { ...defaultOptions, ...options };
    name = cleanFilename(name);

    return new Promise(function(resolve, reject) {
        GM_download({
            url: url,
            name: name,
            saveAs: options.saveAs,
            timeout: options.timeout,
            ontimeout() {
                reject({type: 'timeout', error: {url, name, timeout: options.timeout}});
            },
            onerror(err, details) {
                reject({type: 'error', error: err, details: details})
            },
            onload: resolve,
            onprogress: options.onprogress,
        })
    })
}

//The normal download function does not preserve the directory(always asks to save in Downloads)
function GM_download_emu(url, name, options) {
    let defaultOptions = {
        onerror(err) { alert("Error: " + r.statusText); },
        ontimeout() { alert("Timeout!"); }
    };
    options = { ...defaultOptions, ...options };
    name = cleanFilename(name);

    const size = DeviationUtils.getImageDimensions();
    if (size !== null && size.total > 4e+6) {
        options.timeout = Math.ceil(size.total / 800);
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: "blob",
        timeout: options.timeout,
        onload: function(r) {
            saveAs(r.response, name);
        },
        onerror: options.onerror,
        ontimeout: options.ontimeout,
    });
};

function GM_download_emu_async(url, name, options) {
    let defaultOptions = {
        onerror(err) { alert("Error: " + r.statusText); },
        ontimeout() { alert("Timeout!"); }
    };
    options = { ...defaultOptions, ...options };
    name = cleanFilename(name);

    const size = DeviationUtils.getImageDimensions();
    if (size !== null && size.total > 4e+6) {
        options.timeout = Math.ceil(size.total / 800);
    }

    return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: "blob",
            timeout: options.timeout,
            onload: function(r) {
                saveAs(r.response, name);
                resolve(r);
            },
            ontimeout() {
                reject({type: 'timeout', error: options.timeout});
            },
            onerror(err, details) {
                reject({type: 'error', error: err, details: details})
            },
        });
    })
};

function cleanFilename(filename) {
    if (DEBUG_cleanFilenames) {
        const invalidFilenameCharactersRe = /\\|\/|\?|:|\*|"|\||<|>/g;
        return filename.replace(invalidFilenameCharactersRe, '_');
    } else {
        return filename;
    }
}
