import Tab from "./model/tab.js";

if (!window.browser) {
    window.browser = {
        storage: {
            local: {
                get: function () {
                    return Promise.resolve([]);
                },
                set: function () {
                    return Promise.resolve([]);
                }
            }
        },
        tabs: {
            query: function () {
                return Promise.resolve([])
            },
            onUpdated: {
                addListener: function () {
                    return Promise.resolve([])
                }
            }
        }
    }
}

class Browser {

    async getActiveTab() {
        return Promise.resolve(
            browser.tabs.query({ active: true, currentWindow: true })
                .then(tabs => {
                    if (tabs.length > 1 || tabs.length === 0) return;

                    return new Tab(tabs[0]);
                })
                .catch(e => {
                    console.log(e);
                    return undefined
                })
        );

    }

    onUpdated(callback) {
        browser.tabs.onUpdated.addListener((id, changeInfo, tab) => callback(new Tab(tab)));
    }

}

const BrowserAPI = new Browser();
export default BrowserAPI;