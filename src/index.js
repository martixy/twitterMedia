import Router from './Router'

//For development, because twitter spams with a ton of failed source maps, and I want a clear console.
// setTimeout(main, 2000);
main();

function main() {
    console.clear();
    console.log("twitter script loaded");
    const router = new Router();
    router.route();
    setInterval(router.route, 400); // router be light enough to run frequently, besides handlers be async too
}
