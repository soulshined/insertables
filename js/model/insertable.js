import uuid from "../uuid.js";

export default class Insertable {

    constructor(url, title, body) {
        this.isFavorite = false;
        this.id = uuid();

        url = url.trim();
        this.url = url.endsWith('/') ? url.substring(0, url.length - 1) : url;

        if (this.url.toLowerCase() === "<all_urls>")
            this.url = 'global';

        this.title = title.trim();
        this.body = body;
    }

}