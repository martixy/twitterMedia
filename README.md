# Twitter Image saver v0.2

Userscript to make it easy to save images from twitter.  
Way too many artists use twitter as a platform to post their art unfortunately. Have these people never heard of artstation or deviantArt?

## Usage
* You can configure the hotkeys via config.json.
* The default hotkeys are:  
`q` and `Numpad .`: Download an image  
`e`: Open image in new tab.

Both hotkeys work in magnified view. You can tell you're on the right page if the URL has `photo` in it.  
Only the download hotkey works in image pages (i.e. when open in a new tab)

When saving files the following naming convention is used:

Tweet URLs

```
https://twitter.com/nomaismar/status/1054235177914839041/photo/2
                    ^Handle          ^TweetId                  ^Number in sequence
```

Naming convention  
`<TwitterHandle>-tw-<ISODate>-<TweetId>-<Number>[-<Name>].<ext>`

TwitterHandle = The thing after the @  
ISODate = yyyymmdd  
TweetId = The internal/url ID of the tweet (see above), monotonically increasing  
Number = Number in sequence, I think up to 4 max?  
Name = [Optional] A free-text name, with "_" as spaces  

**IMPORTANT!** Sometimes the script can't get the date - this happens when you load a magnified view directly. To fix, just click on the image from the feed or from the individual tweet.  
(This happens because the script relies on the underlying page to get the date. If you load the magnified view directly that data is usually missing.)


## Installation

1. Clone repo, run "yarn/npm install"
2. Do your config (see config.json.dist).
3. Run "yarn/npm run build".
4. The next steps depend on the type of installation: Local or remote.

#### Local
**IMPORTANT!** Keep in mind that a local installation is only possible for chrome, because only chrome currently has a setting that allows extensions access to local file URLs. To enable access, go to the menu -> More tools -> Extensions and find your userscript manager (e.g. Tampermonkey. Are there any others even?), click on Details and toggle the setting "Allow access to file URLs".
With that out of the way:

5. Go to dist/ and open `local.user.js`. Copy its contents into a new userscript and save.
This is a one-time step, unless you change something about the build or somehow cause the file path of the script to change(e.g. renaming the project folder or whatever)
6. You are good to go. Script is now working.

#### Remote
5. Go to dist/. Copy the file `main.js` to some location available on the web.
6. Go to dist/ and open `local.user.js`. Change the last require line to the location you hosted the script on. Copy these contents into a new userscript and save.
7. You are good to go. Script is now working.

#### The old fashioned way
5. Go to dist/. Open both files there. Take everything from `main.js` and copy over to `local.user.js` (below everything there). Optional: You can delete or not the last require from the userscript metadata. Tampermonkey doesn't care.
6. Take your thusly smushed file and import into userscript manager via method of preference (i.e. copy-paste everything like it's 2006).
7. You are good to go. Script is now working.

#### The unnecessarily manual way
1. Make your own metadata. Good luck. (Take a look at `package.json`)
2. Copy the code from `dist/main.js` below that.
3. Put that in your script mannager.


## Development

Local development is the easiest option. However, there is one caveat - if you develop while webpack is watching the files, you will run into a problem where your script will refuse to run.  
Technical explanation:
* Twitter has very strict CSP, disallowing `unsave-eval` which is what webpack uses when watching files.
* Tampermonkey can usually deal with this, modifying the page's CSP to allow your scripts to run.
* But twitter has a service worker.
* Service worker responses can't be modified by extensions (i.e. the `webRequest.onHeadersReceived` callback doesn't even fire).

Workaround:  
When in dev/watch mode with webpack, open devtools, go to Application>Service Workers - check `Bypass for network`. Keep devtools open - the setting only works then.
