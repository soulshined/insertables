import AddInsertableModal from "./components/add-insertable-modal.js";
import browserApi from "/js/browser-api.js";
import "/js/polyfills.js";
import StorageAPI from "/js/storage-api.js";
import { UIService } from "./ui-service.js";

const addInsertableBtn = document.querySelector('button[name="add"]');

async function main() {
    const insertables = await StorageAPI.get();

    addInsertableBtn.addEventListener('click', async () => {
        addInsertableBtn.disabled = true;
        const tab = await browserApi.getActiveTab();
        const modal = new AddInsertableModal(insertables, tab);
        document.body.appendChild(modal);
        document.querySelector('.modal input[name="title"]').focus();
        modal.addEventListener('removed', async () => {
            addInsertableBtn.disabled = false;
            await UIService.updateAllTab();
        })
    })

    await UIService.updateAllTab(insertables);
    const tab = await browserApi.getActiveTab();
    await UIService.updateActiveTab(tab, insertables);

    browserApi.onUpdated((tab) => UIService.updateActiveTab(tab));
};

main();