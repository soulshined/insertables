import StorageAPI from "/js/storage-api.js";
import ContextMenuModal from "./contextmenu-modal.js";
import { UIService } from "../ui-service.js";

export default class FavoriteInsertable extends HTMLElement {

    constructor(insertable) {
        super();

        this.draggable = true;
        this.setAttribute('title', insertable.body);

        this.innerHTML = insertable.title;

        this.addEventListener('dragstart', function (ev) {
            this.classList.add('dragging');
            ev.dataTransfer.setData("text/plain", insertable.body);
        })

        this.addEventListener('dragend', function (ev) {
            this.classList.remove('dragging');
        })

        this.addEventListener('contextmenu', async e => {
            e.preventDefault();

            const cntxmenu = new ContextMenuModal(insertable.title);
            cntxmenu.addButton(`Unfavorite`, () => {
                StorageAPI.toggleFavorite(insertable.url, insertable.id)
                    .then(() => {
                        cntxmenu.remove();
                        e.target.closest('favorite-insertable').remove();
                    })
                    .catch(() => {
                        cntxmenu.remove();
                        e.target.closest('favorite-insertable').remove();
                    });
            })
            cntxmenu.ondelete(() => {
                StorageAPI.removeInsertable(insertable.url, insertable.id)
                    .then(() => {
                        cntxmenu.remove();
                        UIService.updateActiveTab();
                        UIService.updateAllTab();
                    });

            })
            document.body.appendChild(cntxmenu);
        })
    }

}

window.customElements.define('favorite-insertable', FavoriteInsertable);