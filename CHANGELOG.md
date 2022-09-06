# Changelog

## Legend
&emsp;`+`  New feature  
&emsp;`*`  Bugfix  
&emsp;`~`  Change  
&emsp;`-`  Removal  
&emsp;`!`  Security  
&emsp;`.`  Comment  

### v0.5.4 [20220906]
&emsp;`~`  Upgrade all packages  
&emsp;`*`  Fix date detection on span posts. Twitter finally seems to have fixed them to use <time> tags.  
&emsp;`*`  Minor refactor.  

### v0.5.3 [20210911]
&emsp;`~`  Upgrade all packages  
&emsp;`*`  Fix for changed twitter status URLs. Hopefully fix doesn't break anything else.  

### v0.5.2 [20200908]
&emsp;`*`  Fix edge case in post detection.  
&emsp;`~`  Changelog be more readable.  

### v0.5.1 [20200906]
&emsp;`*`  Fix small oversight in tweet detection. Oops.  

### v0.5 [20200906]
&emsp;`+`  Remembers file names between multi-images. No longer will you need to copy-paste the name when saving multiple images from the same set. Yay! This works even across tabs.  
&emsp;`~`  Update dependencies.  
&emsp;`~`  Revise the tweet detection logic. A lot simpler and less error-prone now. Also fixes some edge cases.  
&emsp;`~`  Add url variant handling for image pages. There's scripts that auto-redirect to the second variant. One example being the maxurl script. This script now also opens new tabs in the new variant. Prevents the uncessary redirect when you have both scripts enabled at the same time.  
&emsp;`*`  Fix date detection after change in twitter markup.  
&emsp;`*`  Fix image detection for images that possess accessibility labels.  
&emsp;`-`  Remove some old code from the Downloader that referenced utilities not part of this project.  

### v0.4 [20200410]
&emsp;`~`  Add handling for threaded posts.  
&emsp;`~`  Improve a couple regexes.

### v0.3 [20200225]
&emsp;`~`  Adapt the script to the new twitter layout. If I did it the lazy way the first time, I wouldn't have had to. Ah well.  
&emsp;`~`  Add mode arg to prod build command so webpack stops complaining.  
&emsp;`~`  Change how I bind the router, as I learn more about JS inheritance and the prototype model.  
&emsp;`*`  Removed a console.log I forgot  
&emsp;`*`  Fix a keybind issue for the downloader due to bad a type.  

### v0.2 [20200213]
&emsp;`+`  Added auto-redirect from `/i/web` pages to user pages (since the url contains so much data we want - easiest option; this might change later).  
&emsp;`*`  Fix a bunch of bugs surrounding how it finds the date on the page.  
&emsp;`*`  Fixed a bug with parsing the URL.  
&emsp;`~`  Added include for mobile twitter.  

### v0.1.1 [20200212]
&emsp;`*`  Forgot to handle multiple images per post. Oops.  
&emsp;`+`  Improved handling of message passed to media pages (now they no longer forget if their parent doesn't exist anymore)  

### v0.1 Initial version [20200211]
&emsp;`+` First release. See readme.
