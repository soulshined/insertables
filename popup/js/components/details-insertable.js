import StorageAPI from "/js/storage-api.js";
import { UIService } from "../ui-service.js";
import ContextMenuModal from "./contextmenu-modal.js";

export default class InsertableDetails extends DetailsBuilder {
    constructor(key, insertables = []) {
        super(key);

        this.attr('data-url', key);
        this.on('toggle', ({ target }) => {
            if (target.open) {
                if (target.getAttribute('loaded') === null) {
                    target.closest('details').setAttribute('loaded', true);
                    target.closest('details').append(...insertables);
                }
            }
        });

        this.on('contextmenu', async e => {
            if (e.target.tagName === 'SUMMARY') {
                e.preventDefault();

                const cntxmenu = new ContextMenuModal(key);
                cntxmenu.deleteLabel = 'DELETE ALL';
                cntxmenu.ondelete(() => {
                    StorageAPI.removeURL(key)
                        .then(() => {
                            cntxmenu.remove();
                            if (key !== 'global')
                                e.target.closest('details').remove();
                            else {
                                e.target.closest('details').replaceWith(new InsertableDetails(key).build())
                            }
                            UIService.updateActiveTab();
                        });

                })
                document.body.appendChild(cntxmenu);
            }
        })

    }
}