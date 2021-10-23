import StorageAPI from "/js/storage-api.js";
import { UIService } from "../ui-service.js";
import ContextMenuModal from "./contextmenu-modal.js";

export default class InsertableLI extends HTMLElement {

    constructor(insertable) {
        super();

        this.draggable = true;
        this.setAttribute('data-id', insertable.id);
        this.setAttribute('title', insertable.body);

        this.innerHTML = `<div class="title">${insertable.title}</div><div class="body">${insertable.body}</div>`;

        this.addEventListener('dragstart', function (ev) {
            this.classList.add('dragging');
            ev.dataTransfer.setData("text/plain", insertable.body);
        })

        this.addEventListener('dragend', function (ev) {
            this.classList.remove('dragging');
        })

        this.addEventListener('contextmenu', async e => {
            e.preventDefault();

            const i = await StorageAPI.getInsertable(insertable.id);
            const cntxmenu = new ContextMenuModal(i.title);

            if (i.url !== 'global')
                cntxmenu.addButton(`${i.isFavorite ? 'Unf' : 'F'}avorite`, () => {
                    StorageAPI.toggleFavorite(i.url, i.id)
                        .then(() => {
                            cntxmenu.remove();
                            UIService.updateActiveTab();
                        })
                        .catch(() => {
                            cntxmenu.remove();
                            UIService.updateActiveTab();
                        });
                })
            cntxmenu.ondelete(() => {
                StorageAPI.removeInsertable(i.url, i.id)
                    .then(() => {
                        cntxmenu.remove();
                        e.target.closest('li-insertable').remove();
                        UIService.updateActiveTab();
                    });

            })
            document.body.appendChild(cntxmenu);
        })
    }

}

window.customElements.define('li-insertable', InsertableLI);