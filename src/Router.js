import PhotoPage from './pages/photo'
import MediaPage from './pages/media'
import WebStatusPage from './pages/webStatus'

class Router {
    constructor() {
        this.currentPage;
        this.currentPageHandler;
        this.prevPage = null;
        this.routes = [
            {
                name: 'photo',
                test: () => window.location.href.includes("status") && window.location.href.includes("photo"),
                handler: PhotoPage
            },
            {
                name: 'media',
                test: () => window.location.href.startsWith("https://pbs.twimg.com/media"),
                handler: MediaPage
            },
            {
                name: 'web-status',
                test: () => window.location.pathname.startsWith("/i/web/status/"),
                handler: WebStatusPage
            }
        ];
        this.handlerRegistry = {};
    }

    route() {
        this.currentPage = getPageWithoutQueryHash();
        if (this.prevPage !== this.currentPage) {
            // console.log("Unloading", this.prevPage);
            if (this.currentPageHandler) {
                this.currentPageHandler.unload();
                this.currentPageHandler = null;
            }
        }
        else return;


        for (let route of this.routes) {
            if (route.test()) {
                console.log(route.name);
                // console.log("Loading", this.currentPage);
                this.currentPageHandler = this.getOrCreatePageHandler(route);
                this.currentPageHandler.load(this.prevPage); //Not the best, but it works.
                break;
            }
        }
        this.prevPage = this.currentPage;
        // console.log(window.location);
    }

    getOrCreatePageHandler(route, ...handlerArgs) {
        if (!this.handlerRegistry[route.name]) {
            this.handlerRegistry[route.name] = new route.handler(...handlerArgs);
        }
        return this.handlerRegistry[route.name];
    }
}



export default Router

//===========================================================================================================
//===========================================================================================================

function getPageWithoutQueryHash() {
    return window.location.origin + window.location.pathname;
}