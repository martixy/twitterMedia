import Router from './Router'

//For development, because twitter spams with a ton of failed source maps, and I want a clear console.
// setTimeout(main, 2000);
main();

function main() {
    console.clear();
    console.log("twitter script loaded");
    const router = new Router();
    router.route();
    setInterval(router.route.bind(router), 400); // router be light enough to run frequently, although some of the handlers are async and some are not. :)
}
