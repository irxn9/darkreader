﻿module DarkReader.Chrome {
    /**
     * Basic Chrome extension with no settings and settings-view.
     * Extension uses CSS generator to process document.
     */
    export /*sealed*/ class StarterExtension extends Application<{}> {

        private generator: Generation.ICssGenerator<{}>;

        /**
         * Creates a basic chrome extension with no settings.
         * @param generator CSS-generator with no configuration.
         */
        constructor(generator: Generation.ICssGenerator<{}>) {
            super({});

            this.generator = generator;

            this.onSwitch.addHandler(this.onAppSwitch, this);
        }


        //--------------
        // Switch ON/OFF
        //--------------

        private onAppSwitch(isEnabled: boolean) {
            if (isEnabled) {
                //
                // Switch ON

                // Subscribe to tab updates
                this.addTabListener();

                // Set style for current tab
                chrome.tabs.getCurrent((t) => { this.addCssToTab(t) });

                // Set style for all tabs
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        this.addCssToTab(tab);
                    });
                });
            }
            else {
                //
                // Switch OFF

                // Unsubscribe from tab updates
                this.removeTabListener();

                // Remove style from current tab
                this.removeCssFromTab(null);

                // Remove style from all tabs
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        this.removeCssFromTab(tab);
                    });
                });
            }
        }


        //-------------------------
        // Working with chrome tabs
        //-------------------------

        private addTabListener() {
            chrome.tabs.onUpdated.addListener(this.tabUpdateListener);
        }

        private removeTabListener() {
            chrome.tabs.onUpdated.removeListener(this.tabUpdateListener);
        }

        private tabUpdateListener = (tabId: number, info: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
            //console.log('Tab: ' + tab.id + ', status: ' + info.status);

            if (info.status === 'loading') {
                //if (info.status === 'loading' || info.status === 'complete') {
                this.addCssToTab(tab);
            }
        }


        //----------------------
        // Add/remove css to tab
        //----------------------

        /**
         * Adds CSS to tab.
         * @param tab If null than current tab will be processed.
         */
        private addCssToTab(tab: chrome.tabs.Tab) {
            // Prevent throwing errors on specific chrome adresses
            if (tab && tab.url && (tab.url.indexOf('chrome') === 0)) {
                return;
            }

            if (tab) { // Somewhere null is called.
                var id = tab ? tab.id : null;
                var url = tab ? tab.url : null;
                chrome.tabs.executeScript(id, {
                    code: this.getCode_addCss(url),
                    runAt: 'document_start'
                });
            }
        }

        /**
         * Removes CSS from tab.
         * @param tab If null than current tab will be processed.
         */
        private removeCssFromTab(tab: chrome.tabs.Tab) {
            // Prevent throwing errors on specific chrome adresses
            if (tab && tab.url && (tab.url.indexOf('chrome') === 0)) {
                return;
            }

            var id = tab ? tab.id : null;
            chrome.tabs.executeScript(id, {
                code: this.getCode_removeCss()
            });
        }

        private getCode_addCss(url?: string) {
            var css: string;
            if (url) {
                css = this.generator.createSpecialCssCode(url, {});
            }
            if (!css) {
                css = this.generator.createCssCode({});
            }

            //var code = "alert('Add CSS');"
            var code =

                //"if (!observer) {" +
                //"var color = document.documentElement.style.backgroundColor;" +
                //"document.documentElement.style.backgroundColor = '#222';" +
                //"var observer = new MutationObserver(function (mutations) {" +
                //"mutations.forEach(function (mutation) {" +
                //"if (mutation.target.nodeName == 'BODY') {" +
                //"observer.disconnect();" +
                //"document.documentElement.style.backgroundColor = color || '';" +
                //"}" +
                //"});" +
                //"});" +
                //"}" +
                //"observer.observe(document, { childList: true, subtree: true });" +

                //"var prevStyle = document.getElementById('dark-reader-style'); " +
                //"if (!prevStyle) {" +
                //"var css = '" + css + "'; " +
                //"var style = document.createElement('style'); " +
                //"style.setAttribute('id', 'dark-reader-style'); " +
                //"style.type = 'text/css'; " +
                //"style.appendChild(document.createTextNode(css)); " +
                //"var head = document.getElementsByTagName('head')[0]; " +
                //"head.appendChild(style); " +
                //"} ";


                //"var color = document.documentElement.style.backgroundColor;" +
                //"document.documentElement.style.backgroundColor = '#222';" +

                "var prevStyle = document.getElementById('dark-reader-style'); " +
                "if (!prevStyle) {" +
                "var css = '" + css + "'; " +
                "var style = document.createElement('style'); " +
                "style.setAttribute('id', 'dark-reader-style'); " +
                "style.type = 'text/css'; " +
                "style.appendChild(document.createTextNode(css)); " +
                "var head = document.getElementsByTagName('head')[0]; " +
                "head.appendChild(style); " +
                "} ";
            //"} " +

            //"document.documentElement.style.backgroundColor = color || '';";


            //var color = document.documentElement.style.backgroundColor;
            //document.documentElement.style.backgroundColor = "black";
            //var observer = new MutationObserver(function (mutations) {
            //    mutations.forEach(function (mutation) {
            //        observer.disconnect();
            //        document.documentElement.style.backgroundColor = color || "";
            //    });
            //});
            //observer.observe(document.body, { childList: false, subtree: false });

            //var color = document.documentElement.style.backgroundColor;
            //document.documentElement.style.backgroundColor = "black";
            //var observer = new MutationObserver(function (mutations) {
            //    mutations.forEach(function (mutation) {
            //        if (mutation.target.nodeName == "BODY") {
            //            observer.disconnect();
            //            document.documentElement.style.backgroundColor = color || "";
            //        }
            //    });
            //});
            //observer.observe(document, { childList: true, subtree: true });

            //var prevStyle = document.getElementById('dark-reader-style');
            //if (prevStyle) return; // Style is already set, exit.
            //var css = 'Your style here';
            //var style = document.createElement('style');
            //style.setAttribute('id', 'dark-reader-style');
            //style.type = 'text/css';
            //style.appendChild(document.createTextNode(css));
            //var head = document.getElementsByTagName('head')[0];
            //head.appendChild(style);

            return code;
        }

        private getCode_removeCss() {
            //var code = "alert('Remove CSS');"
            var code =
                "var style = document.getElementById('dark-reader-style'); " +
                "style && style.parentNode.removeChild(style); ";

            //var style = document.getElementById('dark-reader-style');
            //style && style.parentNode.removeChild(style);

            return code;
        }
    }
}