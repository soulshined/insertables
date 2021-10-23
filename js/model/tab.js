export default class Tab {

    constructor(activeInfo) {
        this.id = activeInfo.id;
        this.active = activeInfo.active || false;
        this.height = activeInfo.height;
        this.title = activeInfo.title;
        this.url = new URL(activeInfo.url);
        this.windowId = activeInfo.windowId;
        this.favIconUrl = activeInfo.favIconUrl;
    }

}