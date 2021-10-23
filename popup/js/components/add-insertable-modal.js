import Insertable from "/js/model/insertable.js";
import storageApi from "/js/storage-api.js";
import { UIService } from "../ui-service.js";
import AbstractModal from "/js/components/modal.js";

export default class AddInsertableModal extends AbstractModal {

    constructor(insertables, tab) {
        super();
        const urls = Object.keys(insertables);

        let body = `<div class="form-group">
                                <label>URL Pattern:</label>
                                <input type="text" list="url-patterns" name="url" autofocus autocapitalize="none" autocomplete="off" spellcheck="false" required value="${tab ? tab.url : "<all_urls>"}" />
                            </div>
                            <datalist id="url-patterns" > `;

        urls.forEach(pattern => {
            body += `<option value="${pattern}">${pattern}</option>`
        })

        body += `</datalist>
                            <div class="form-group">
                                <label>Title:</label>
                                <input type="text" autocapitalize="none" autocomplete="off" spellcheck="false" name="title" required/>
                            </div>
                            <textarea rows="5" placeholder="content" autocapitalize="none" autocomplete="off" spellcheck="false" required minlength="1"></textarea>`;

        this.body = body;
        this.footer = `<button type="submit">SAVE</button>`;

        const saveBtn = this.querySelector('button');
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = this.querySelector('[name="url"]').value,
                title = this.querySelector('[name="title"]').value,
                body = this.querySelector('textarea').value;
            if (url.isNullOrWhitespace() || url.match(/\s/) || title.isNullOrWhitespace() || body.isNullOrWhitespace()) {
                this.querySelector('form').reportValidity();
                return;
            }

            storageApi.addInsertable(new Insertable(url, title, body))
                .then(() => {
                    UIService.updateAllTab();
                    UIService.updateActiveTab();
                    document.querySelector('add-insertable-modal').remove();
                    this.dispatchEvent(new CustomEvent('removed'));
                });
        })

    }

}

window.customElements.define('add-insertable-modal', AddInsertableModal);