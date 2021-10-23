import StorageAPI from "/js/storage-api.js";
import InsertableLI from "./components/li-insertable.js";
import InsertableDetails from "./components/details-insertable.js";
import FavoriteInsertable from "./components/favorite-insertable.js";
import BrowserAPI from "/js/browser-api.js";
import InsertableSorter from "/js/model/sorter.js";
import Switcher from "./components/switcher.js";

const nav = document.getElementById('nav'),
    navContent = document.querySelector('#nav + div'),
    all = document.querySelector('section');

class UIServiceHandler {

    async refreshSwitchers() {
        document.querySelectorAll('[data-switcher]').forEach(switcher => new Switcher(switcher));
    }

    async updateAllTab(insertables) {
        if (!insertables)
            insertables = await StorageAPI.get();

        const openDetailURLs = [...document.querySelectorAll('#insertables details[open=""]')].map(d => `#insertables details[data-url="${d.getAttribute('data-url')}"]`);
        const { scrollTop } = all;

        while (all.hasChildNodes())
            all.removeChild(all.firstChild);

        for (const key of Object.keys(insertables).sort(InsertableSorter.sortAlphabetically)) {
            const thisInsertables = insertables[key].map(value => new InsertableLI(value));
            const func = key === 'global' ? 'prepend' : 'appendChild';
            all[func](new InsertableDetails(key, thisInsertables).build());
        }

        openDetailURLs.forEach(d => document.querySelector(d).open = true);
        all.scrollTop = scrollTop;
    }

    async updateActiveTab(tab, insertables) {
        if (!tab) {
            tab = await BrowserAPI.getActiveTab();
            if (!tab) {
                UIService.refreshSwitchers();
                return;
            }
        };

        if (!insertables)
            insertables = await StorageAPI.get();

        const activeTab = document.getElementById('active-insertables');
        if (activeTab) {
            document.querySelector('#nav').firstChild.remove();
            activeTab.remove();
        }

        for (const [key, values] of Object.entries(insertables)) {
            const href = tab.url.href.endsWith('/') ? tab.url.href.substring(0, tab.url.href.length - 1) : tab.url.href;

            if (href === key && values.length > 0) {
                const thisInsertables = values.map(value => new InsertableLI(value));
                const icon = new SpanBuilder().classes('icon', 'page-icon');
                if (tab.favIconUrl)
                    icon.classes('favIcon').style({
                        background: `url(${tab.favIconUrl}) center center no-repeat`,
                        'background-size': '25px 25px'
                    })

                nav.prepend(
                    new TagBuilder('li').append(
                        icon,
                        new SpanBuilder().innerText('ACTIVE TAB')
                    ).build()
                );

                const activeTabContent = new TagBuilder('div', 'active-insertables').append(
                    new InsertableDetails('global', insertables.global),
                    new TagBuilder('hr')
                );

                const favs = values.filter(v => v.isFavorite);
                if (favs.length > 0) {
                    activeTabContent.append(
                        new TagBuilder('div').classes('container').style({
                            'margin-bottom': '10px',
                            'border-bottom': '1px solid lightgrey',
                            'padding-bottom' : '10px'
                        }).append(
                            new TagBuilder('div').classes('lighter').innerText("Favorites"),
                            new TagBuilder('div').classes('favorites').append(
                                ...favs.map(f => new FavoriteInsertable(f))
                            )
                        )
                    )
                }

                activeTabContent.append(
                    new ListBuilder().classes('reset').append(...thisInsertables)
                );

                navContent.prepend(activeTabContent.build());
                break;
            }
        }

        UIService.refreshSwitchers();
    }
}

export const UIService = new UIServiceHandler();