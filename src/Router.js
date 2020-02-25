import PhotoPage from './pages/photo'
import MediaPage from './pages/media'
import WebStatusPage from './pages/webStatus'

// Hm... factory function instead?
// Both this approach and binding incur the performance hit of creating a new function for each instance, but it's also kind of unavoidable.
/**
 * E.g. Router() {
 * let state
 * return { route() {} }
 * }
 */
class Router {
    constructor() {
        this.currentPage;
        this.currentPageHandler;
        this.prevPage = null;
        this.routes = [
            {
                name: 'photo',
                test: () => window.location.href.includes("status") && window.location.href.includes("photo"),
                handler: PhotoPage //Dependency injection?
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

        this.route = this.route.bind(this);
        //This kind of makes a lot of sense when considering the prototype model of JS. The prototype route is just a function. It doesn't have a concept of "this".
        //For it to use "this" it kind of has to be tied to a specific instance of the "class". Which is precisely what this does.
        //Idea: Lazy binding via proxy? Trap property access.
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