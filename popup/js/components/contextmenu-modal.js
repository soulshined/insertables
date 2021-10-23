import AbstractModal from "/js/components/modal.js";

export default class ContextMenuModal extends AbstractModal {

    constructor(title = '') {
        super();

        this.body = `<button type="button" class="red" id="contextmenu-option-delete">DELETE</button>`;
        this.header = title;
    }

    set deleteLabel(val) {
        this.querySelector('#contextmenu-option-delete').innerHTML = val;
    }

    ondelete(callback) {
        this.querySelector('#contextmenu-option-delete').addEventListener('click', callback);
    }

    addButton(label, onclick) {
        const button = new TagBuilder('button').attr('type', 'button').classes('outline')
            .innerHTML(label)
            .on('click', () => onclick());
        this.querySelector('.body').prepend(button.build());
    }

}

window.customElements.define('contextmenu-modal', ContextMenuModal);