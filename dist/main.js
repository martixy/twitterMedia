!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e){e.exports=JSON.parse('{"keyBindings":{"download":["q",{"key":"NumpadDecimal","type":"code"}],"newTab":"e"}}')},function(e,t,n){(function(n){var o,r,a;r=[],void 0===(a="function"==typeof(o=function(){"use strict";function t(e,t,n){var o=new XMLHttpRequest;o.open("GET",e),o.responseType="blob",o.onload=function(){i(o.response,t,n)},o.onerror=function(){console.error("could not download file")},o.send()}function o(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function r(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(n){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var a="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof n&&n.global===n?n:void 0,i=a.saveAs||("object"!=typeof window||window!==a?function(){}:"download"in HTMLAnchorElement.prototype?function(e,n,i){var s=a.URL||a.webkitURL,l=document.createElement("a");n=n||e.name||"download",l.download=n,l.rel="noopener","string"==typeof e?(l.href=e,l.origin===location.origin?r(l):o(l.href)?t(e,n,i):r(l,l.target="_blank")):(l.href=s.createObjectURL(e),setTimeout((function(){s.revokeObjectURL(l.href)}),4e4),setTimeout((function(){r(l)}),0))}:"msSaveOrOpenBlob"in navigator?function(e,n,a){if(n=n||e.name||"download","string"!=typeof e)navigator.msSaveOrOpenBlob(function(e,t){return void 0===t?t={autoBom:!1}:"object"!=typeof t&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e}(e,a),n);else if(o(e))t(e,n,a);else{var i=document.createElement("a");i.href=e,i.target="_blank",setTimeout((function(){r(i)}))}}:function(e,n,o,r){if((r=r||open("","_blank"))&&(r.document.title=r.document.body.innerText="downloading..."),"string"==typeof e)return t(e,n,o);var i="application/octet-stream"===e.type,s=/constructor/i.test(a.HTMLElement)||a.safari,l=/CriOS\/[\d]+/.test(navigator.userAgent);if((l||i&&s)&&"object"==typeof FileReader){var u=new FileReader;u.onloadend=function(){var e=u.result;e=l?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),r?r.location.href=e:location=e,r=null},u.readAsDataURL(e)}else{var c=a.URL||a.webkitURL,d=c.createObjectURL(e);r?r.location=d:location.href=d,r=null,setTimeout((function(){c.revokeObjectURL(d)}),4e4)}});a.saveAs=i.saveAs=i,e.exports=i})?o.apply(t,r):o)||(e.exports=a)}).call(this,n(3))},function(e,t,n){var o;!function(){"use strict";function r(e,t,n){this.object=e,this.method=t,this.args=n.length>1?n.slice(1):[]}function a(e){if(!(this instanceof a))return new a(e);this.obj=e}r.brototype=r.prototype={butWhenIdo:function(e,t){if(this.method instanceof Function){var n=this.method.apply(this.object,this.args);n&&(e||function(){}).call(t||this.object,n)}return t},hereComeTheErrors:function(e){if(this.method instanceof Function)try{this.method.apply(this.object,this.args)}catch(t){e(t)}else e(this.method+" is not a function.")},errorsAreComing:function(){this.hereComeTheErrors.apply(this,arguments)}},a.TOTALLY=!0,a.NOWAY=!1,a.brototype=a.prototype={isThatEvenAThing:function(){return void 0!==this.obj},doYouEven:function(e,t,n){t instanceof Function||(n=t);var o=a(n||{});e instanceof Array||(e=[e]);var r=this;if(e.every((function(e){return a(r.iCanHaz(e)).isThatEvenAThing()===a.TOTALLY}))){if(o.iDontAlways("forSure").butWhenIdo(),t)for(var i=0;i<e.length;i++)t(r.obj[e[i]],e[i]);return a.TOTALLY}return o.iDontAlways("sorryBro").butWhenIdo(),a.NOWAY},iCanHaz:function(e){if(Array.isArray(e)){var t,n,o=[];for(t in e)n=this.iCanHaz(e[t]),o.push(n);return o}for(var r=e.split("."),i=this.obj,s=0;s<r.length;s++)if(null==i||a(i=i[r[s]]).isThatEvenAThing()===a.NOWAY)return;return i},comeAtMe:function(e){var t,n,o=a(e),r=o.giveMeProps(),i=this instanceof a?this.obj:a.prototype;for(t=0;t<r.length;t++)n=r[t],o.hasRespect(n)&&(i[n]=e[n])},giveMeProps:function(){var e,t=[];if(Object.keys)t=Object.keys(this.obj);else for(e in this.obj)this.obj.hasRespect(e)&&t.push(e);return t},hasRespect:function(e){return this.obj.hasOwnProperty(e)},iDontAlways:function(e){var t=this.iCanHaz(e);return new r(this.obj,t,arguments)},braceYourself:function(e){var t=this.iCanHaz(e);return new r(this.obj,t,arguments)},makeItHappen:function(e,t){for(var n=this.obj,o=e.split("."),r=0;r<o.length-1;++r)void 0===n[o[r]]&&(n[o[r]]={}),n=n[o[r]];n[o[o.length-1]]=void 0===t?{}:t}},void 0===(o=function(){return a}.call(t,n,t,e))||(e.exports=o),"undefined"!=typeof angular&&angular.module("brototype",[]).factory("Bro",(function(){return a}))}()},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";n.r(t);var o=n(2),a=n.n(o);function i(e){return"Unidentified"===e.key?"Unidentified":`${e.type}:${e.key}:`+(e.altKey?"t":"f")+(e.ctrlKey?"t":"f")+(e.metaKey?"t":"f")+(e.shiftKey?"t":"f")}const s={Escape:"Escape","`":"Backquote","[":"BracketLeft","]":"BracketRight",";":"Semicolon","'":"Quote","\\":"Backslash",",":"Comma",".":["Period","NumpadDecimal"],"/":["Slash","NumpadDivide"],"-":["Minus","NumpadSubtract"],"*":"NumpadMultiply","+":"NumpadAdd","=":"Equal"," ":"Space",Control:["ControlLeft","ControlRight"],Shift:["ShiftLeft","ShiftRight"],Alt:["AltLeft","AltRight"],Meta:["MetaLeft","MetaRight"],Enter:["Enter","NumpadEnter"],nEnter:"NumpadEnter","n.":"NumpadDecimal","n+":"NumpadAdd","n-":"NumpadSubtract","n*":"NumpadMultiply","n/":"NumpadDivide"},l=Object.values(s).flat();var u=class{constructor(){this.bindings={},this.modifiers={altKey:!1,ctrlKey:!1,metaKey:!1,shiftKey:!1},this.eventTypes={keydown:[],keypress:[],keyup:[]},this.keyRouterBound=this.keyRouter.bind(this)}registerKey(e,t,n){if(!this.eventTypes.hasOwnProperty(e))return void console.warn("Key Handler: Cannot handle event type: "+e);const o=i(t=this.normalizeKey(t));return a()(this.bindings).makeItHappen(`${o}.${e}`,n),0===this.eventTypes[e].length&&(document.addEventListener(e,this.keyRouterBound),console.info("KeyHandler: Adding listener on "+e)),this.eventTypes[e].includes(o)||this.eventTypes[e].push(o),t}unregisterKey(e,t,n=null){if(!this.eventTypes.hasOwnProperty(e))return void console.warn("Key Handler: Cannot handle event type: "+e);const o=i(t=this.normalizeKey(t));let r=this.eventTypes[e].indexOf(o);return~r&&this.eventTypes[e].splice(r,1),0===this.eventTypes[e].length&&(document.removeEventListener(e,this.keyRouterBound),console.info("KeyHandler: Removing listener on "+e)),delete this.bindings[o][e],t}getRegisteredKeys(){let e={};for(let t in this.bindings){e[t]={},e[t].key=this.resolveKey(t);let n=[];for(let[e,o]of Object.entries(this.eventTypes))~o.findIndex(e=>e===t)&&n.push(e);e[t].eventType=n}return e}hasKey(e){const t=i(e=this.normalizeKey(e));return this.bindings.hasOwnProperty(t)}getHandler(e,t=null){const n=i(e=this.normalizeKey(e));return t&&this.eventTypes.hasOwnProperty(t)?this.bindings[n][t]:this.bindings[n]}keyRouter(e){const t=function(e){return["code","key"].reduce((t,n)=>(t[n]=`${n}:${e[n]}:`+(e.altKey?"t":"f")+(e.ctrlKey?"t":"f")+(e.metaKey?"t":"f")+(e.shiftKey?"t":"f"),t),{})}(e);for(let[n,o]of Object.entries(t))this.bindings.hasOwnProperty(o)&&this.bindings[o].hasOwnProperty(e.type)&&this.bindings[o][e.type](e)}normalizeKey(e){if("string"==typeof e){let n=(t=e)in s?s[t]:null!=t.match(/^n\d$/)?"Numpad"+t[1]:null!=t.match(/^\d$/)?["Numpad"+t,"Digit"+t]:null!=t.match(/[a-zA-Z]/)?"Key"+t.toUpperCase():null!=t.match(/^Key[A-Z]$/)||l.includes(t)?t:void 0;return void 0!==n?{key:n,type:"code",...this.modifiers}:{key:e,type:"key",...this.modifiers}}var t;if(!e.hasOwnProperty("key"))return{key:"Unidentified"};let n={key:e.key,...this.modifiers};if(e.type&&["code","key"].includes(e.type)){if("keyCode"===e.type)throw new Error("keyCode is a deprecated feature and unsupported by this program");n.type=e.type}else n.type="key";for(let t in this.modifiers)e.hasOwnProperty(t)&&(n[t]=e[t]);return n}resolveKey(e){let t=e.split(":"),n={type:t[0],key:t[1]};for(let e in this.modifiers)n[e]="t"===t[2][0];return n}},c=n(1),d=n.n(c);var h=class{constructor(){this.keyHandler=new u,this.keyBindings=[]}openInNewTab(e){GM_openInTab(e,{active:!0,insert:!0,setParent:!0})}downloadImage(e,t,n){if(n={timeout:5e3,async:!1,...n},"native"===GM_info.downloadMode){if(n.async)return console.log("download: GM_download_async"),function(e,t,n){return n={saveAs:!0,timeout:5e3,onprogress:()=>{},...n},t=m(t),new Promise((function(o,r){GM_download({url:e,name:t,saveAs:n.saveAs,timeout:n.timeout,ontimeout(){r({type:"timeout",error:{url:e,name:t,timeout:n.timeout}})},onerror(e,t){r({type:"error",error:e,details:t})},onload:o,onprogress:n.onprogress})}))}(e,t,n);console.log("download: GM_download"),function(e,t,n){t=m(t),n={saveAs:!0,ontimeout:()=>console.log("Timeout!"),onerror(o){"not_whitelisted"===o.error?(console.log("Error: Buggy Tampermonkey, falling back to old downloader."),f(e,t,n)):(alert("Error! (see console)"),console.error(o))},onload:()=>{},onprogress:()=>{},...n},GM_download({url:e,name:t,saveAs:n.saveAs,timeout:n.timeout,ontimeout:n.ontimeout,onerror:n.onerror,onload:n.onload,onprogress:n.onprogress})}(e,t,n)}else{if(n.async)return console.log("download: fallback async"),function(e,t,n){return n={...{onerror(e){alert("Error: "+r.statusText)},ontimeout(){alert("Timeout!")},timeout:1e4},...n},t=m(t),new Promise((function(o,r){GM_xmlhttpRequest({method:"GET",url:e,responseType:"blob",timeout:n.timeout,onload:function(e){d()(e.response,t),o(e)},ontimeout(){r({type:"timeout",error:n.timeout})},onerror(e,t){r({type:"error",error:e,details:t})}})}))}(e,t,n);console.log("download: fallback"),f(e,t,n)}}bindKeys(e){this.keyBindings=e;for(let e of this.keyBindings){Array.isArray(e.keys)||(e.keys=[e.keys]);for(let t of e.keys)this.keyHandler.registerKey("keydown",t,e.method.bind(this))}}unbindKeys(){for(let e of this.keyBindings){Array.isArray(e.keys)||(e.keys=[e.keys]);for(let t of e.keys)this.keyHandler.unregisterKey("keydown",t,e.method.bind(this))}}};function f(e,t,n){n={...{onerror(e){alert("Error: "+r.statusText)},ontimeout(){alert("Timeout!")},timeout:1e4},...n},t=m(t),GM_xmlhttpRequest({method:"GET",url:e,responseType:"blob",timeout:n.timeout,onload:function(e){d()(e.response,t)},onerror:n.onerror,ontimeout:n.ontimeout})}function m(e){{const t=/\\|\/|\?|:|\*|"|\||<|>/g;return e.replace(t,"_")}}var p=n(0);const y=/twitter\.com\/[^\/]+\/status\/(\d+)/;var g=class{constructor(e){this.downloader=new h,this.underlyingPage=null,this.cachedName=null}async load(e){let t=this;e&&!e.match(/status\/\d+\/photo/)&&(this.underlyingPage=e);let n=await new Promise((e,t)=>{let n,o=setInterval(()=>{let t,r=document.querySelector("div[aria-modal='true']");if(null!==r.querySelector("ul")){let e=window.location.pathname.match(/.*?(.)$/)[1];t=r.querySelector(`li:nth-child(${e}) div[aria-label] img`)}else t=r.querySelector("div[aria-label] img");t&&(clearInterval(o),clearTimeout(n),e(t))},200);n=setTimeout(()=>{clearInterval(o),t("Couldn't find image.")},2e3)}),o=new URL(n.src),r=o.searchParams.get("format");o.searchParams.set("name","orig");let a=!1,i=!1,s=null;if(null===this.underlyingPage&&(console.warn("This script cannot reliably handle page loads like this. This usually happens after a reload. I think they're done with the service worker? The underlying page isn't kept in localstorage or cookies or something. It also isn't loaded yet in many cases."),a=!0),a)await function(e){return new Promise((t,n)=>{setTimeout(()=>{t()},e)})}(200),s=b(),s.err?s=k(n):i=!0;else{const e=this.underlyingPage.match(y);i=null!==e;let t=i&&window.location.pathname.match(/status\/(\d+)/)[1]===e[1],o=new URL(this.underlyingPage).searchParams.get("s");o&&parseInt(o)>=10&&parseInt(o);t?(console.info("span post"),s=b()):(console.info("time post"),s=k(n))}if(!a&&s.err)throw new Error("Something in twitter changed, not finding main post for "+(i?"STATUS":"FEED")+" page.");w(o.href,s),this.downloader.bindKeys([{keys:p.keyBindings.download,method(e){let n=o.pathname.substring(7);t.cachedName&&(n=t.cachedName);let a=window.prompt("Image title?",n);a?(t.cachedName=a,w(o.href,s,a)):a=o.pathname.substring(7);let i=`${s.username}-tw-${s.date}-${s.id}-${s.photoNum}-${a.replace(/ /g,"_")}.${r}`;t.downloader.downloadImage(o.href,i)}},{keys:p.keyBindings.newTab,method(e){let n=o.searchParams.get("format");o.searchParams.delete("format"),o.pathname+="."+n,t.downloader.openInNewTab(o.href)}}])}unload(){this.downloader.unbindKeys()}};function w(e,t,n=null){GM_getTab(o=>{o.url=e,o.data=t,n&&(o.name=n),GM_saveTab(o)})}function v(e){let t=e.match(/(\D{3}) (\d{1,2}), (\d{4})/);return t?new Date(t[0]):null}function b(e=!1){let t,n;try{let e=document.querySelectorAll("div[aria-label='Timeline: Conversation']>div>div"),n=e[1].querySelector("article");n||(n=e[0].querySelector("article"));let o=n.querySelectorAll("div>div>div[dir='auto']>a>span");for(const e of o)if(t=v(e.textContent))break;t?t=t.getFullYear().toString()+(t.getMonth()+1).toString().padStart(2,"0")+t.getDate().toString().padStart(2,"0"):(t="nodate",console.warn("Couldn't parse date. Maybe something in twitter changed? Or my logic sucks."))}catch(e){n=e}let[,o,r,a]=T();return{username:o,date:t,id:r,photoNum:a,err:n}}function k(e){let t,n;try{const n=document.querySelectorAll("time");let o,r=new URL(e.src);e:for(const e of n){let t=e.closest("article").querySelectorAll("img[alt]");for(const n of t){if(new URL(n.src).pathname===r.pathname){o=e;break e}}}t=new Date(o.dateTime),t=t.getFullYear().toString()+(t.getMonth()+1).toString().padStart(2,"0")+t.getDate().toString().padStart(2,"0")}catch(e){t="nodate",n=e}let[,o,r,a]=T();return{username:o,date:t,id:r,photoNum:a,err:n}}function T(){let e=window.location.pathname.match(/\/(\w+)\/status\/(\d+)\/photo\/(\d)/);if(!e)throw new Error("Whoops! Couldn't parse the url to make a name.");return e}const P=/.*\/([\w-]+)\.(\w+)/;var A=class{constructor(){this.downloader=new h,this.urlVariant=null}async load(){let e=this,t=new URL(window.location);if("orig"!==t.searchParams.get("name"))return t.searchParams.set("name","orig"),void(window.location.href=t);t.searchParams.get("format")?this.urlVariant="query":this.urlVariant="pathname";let n=null,o=setInterval(async()=>{n=await S(e.urlVariant),n&&clearInterval(o)},500);this.downloader.bindKeys([{keys:p.keyBindings.download,async method(o){let r=null;try{r=await S(e.urlVariant)}catch(e){n?r=n:console.warn("No parent tab, unable to make compose meaningful name.")}let a=null,i=t.pathname.match(P);r&&r.name?a=r.name:(a=r?"":"tw_","query"===e.urlVariant&&(a+=window.location.pathname.substring(7)),"pathname"===e.urlVariant&&(a+=i[1]));let s=null;"query"===e.urlVariant&&(s=t.searchParams.get("format")),"pathname"===e.urlVariant&&(s=i[2]);let l=window.prompt("Image title?",a);l||(l=a);let u=`${l}.${s}`;r&&(u=`${r.data.username}-tw-${r.data.date}-${r.data.id}-${r.data.photoNum}-${l.replace(/ /g,"_")}.${s}`),e.downloader.downloadImage(window.location.href,u)}}])}unload(){}};function S(e){return new Promise((t,n)=>{GM_getTabs(o=>{for(const n in o)if("url"in o[n]){if("query"===e&&o[n].url===window.location.href){t(o[n]);break}if("pathname"===e){let e=new URL(o[n].url);const r=e.pathname.substring(7),a=e.searchParams.get("format"),i=e.searchParams.get("name"),s=new URL(window.location),l=s.pathname.match(P);if(!l)throw new Error("Failed to match image filename from URL. Expected to be at url with pathname like '/media/asdf.jpg'.");const u=l[1],c=l[2],d=s.searchParams.get("name");if(u===r&&c===a&&d===i){t(o[n]);break}}}n("No parent tab found.")})})}var E=class{constructor(){}async load(){await new Promise((e,t)=>{if(null!==document.querySelector("article"))return void e(!0);let n=setInterval(()=>{null!==document.querySelector("article")&&(clearInterval(n),e(!0))},100)});let e=document.querySelector("article a");if(!e)throw new Error("Could not redirect to arist page.");{let t=window.location.pathname.replace(/\/i\/web(.*)/,new URL(e.href).pathname+"$1");window.location.pathname=t}}unload(){}};var R=class{constructor(){this.currentPage,this.currentPageHandler,this.prevPage=null,this.routes=[{name:"photo",test:()=>window.location.href.includes("status")&&window.location.href.includes("photo"),handler:g},{name:"media",test:()=>window.location.href.startsWith("https://pbs.twimg.com/media"),handler:A},{name:"web-status",test:()=>window.location.pathname.startsWith("/i/web/status/"),handler:E}],this.handlerRegistry={},this.route=this.route.bind(this)}route(){if(this.currentPage=window.location.href,this.prevPage!==this.currentPage){this.currentPageHandler&&(this.currentPageHandler.unload(),this.currentPageHandler=null);for(let e of this.routes)if(e.test()){console.log(e.name),this.currentPageHandler=this.getOrCreatePageHandler(e),this.currentPageHandler.load(this.prevPage);break}this.prevPage=this.currentPage}}getOrCreatePageHandler(e,...t){return this.handlerRegistry[e.name]||(this.handlerRegistry[e.name]=new e.handler(...t)),this.handlerRegistry[e.name]}};!function(){console.clear(),console.log("twitter script loaded");const e=new R;e.route(),setInterval(e.route,400)}()}]);