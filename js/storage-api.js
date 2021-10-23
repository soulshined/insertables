import InsertableSorter from "./model/sorter.js";

class Storage {

    async get() {
       return Promise.resolve(
            browser.storage.local.get()
                .then(insertables => Object.assign({ global: [] }, insertables))
                .catch(e => {
                    console.log('error getting', e);
                    return { global: [] }
                })
        );
    }

    async getInsertable(id) {
        const all = await this.get();
        const insertables = Object.values(all).flat();
        return insertables.find(i => i.id === id);
    }

    async addManyInsertables(insertables) {
        const all = await this.get();

        insertables.forEach(insertable => {
            if (all[insertable.url] === undefined)
                all[insertable.url] = []

            all[insertable.url].push(insertable);
        })

        for (const key of Object.keys(all))
            all[key].sort(InsertableSorter.sortByTitle);

        return Promise.resolve(browser.storage.local.set(all));
    }

    async addInsertable(insertable) {
        const all = await this.get();

        if (all[insertable.url] === undefined)
            all[insertable.url] = []

        all[insertable.url].push(insertable);
        all[insertable.url].sort(InsertableSorter.sortByTitle);
        return Promise.resolve(browser.storage.local.set(all));
    }

    async removeURL(url) {
        return Promise.resolve(browser.storage.local.remove(url));
    }

    async removeInsertable(url, id) {
        const all = await this.get();
        const index = Object.values(all[url]).findIndex(i => i.id === id);
        if (index === -1) return;

        all[url].splice(index, 1);
        return Promise.resolve(browser.storage.local.set(all));
    }

    async toggleFavorite(url, id) {
        const all = await this.get();
        const index = Object.values(all[url]).findIndex(i => i.id === id);
        if (index === -1) return;

        all[url][index].isFavorite = !all[url][index].isFavorite;
        return Promise.resolve(browser.storage.local.set(all));
    }

    async clear() {
        await browser.storage.local.clear();
    }

}

const StorageAPI = new Storage();
export default StorageAPI;