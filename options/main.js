import Insertable from "../js/model/insertable.js";
import uuid from "../js/uuid.js";
import StorageAPI from "/js/storage-api.js";

const result = document.getElementById('result');

document.getElementById("export-data").addEventListener('click', async () => {
    const insertables = await StorageAPI.get();

    const a = document.createElement("a");
    a.href = 'data:application/json;charset=utf-8,' + JSON.stringify(insertables);
    a.setAttribute("download", `insertables-${new Date().getTime()}.json`);
    a.click();
})

document.forms.import.onsubmit = e => {
    e.preventDefault();
    if (['import-data', 'merge-data'].includes(e.submitter.id)) {
        const { submitter } = e,
              reader = new FileReader();
        reader.onerror = e => {
            console.log('error', e);
        }
        reader.onabort = e => {
            console.log('abort', e);
        }
        reader.onloadend = async e => {
            console.log('load end', e.target.result);
            const insertables = buildIterablesJSONFromText(e.target.result);
            console.log('importing...', insertables);
            if (insertables !== false) {
                if (submitter.id === 'import-data')
                    StorageAPI.clear();

                await StorageAPI.addManyInsertables(insertables);
                showAlert('Successfully ' + (submitter.id === 'import-data' ? 'imported' : 'merged'));
            }
        }
        reader.readAsText(document.getElementById('import-file-data').files[0]);
    }
}

function buildIterablesJSONFromText(text) {
    if (text === null) {
        showAlert('text is null', true);
        return false;
    };

    try {
        text = JSON.parse(text);
    } catch (error) {
        showAlert('File is not properly formed json');
        return false;
    }

    if (text.constructor !== Object) {
        showAlert('Insertables JSON is not a valid object', true);
        return false;
    }

    const iterables = [];

    for (const [key, value] of Object.entries(text)) {
        if (value.constructor !== Array) {
            showAlert(`Invalid value type for key ${key}, expecting array of insertables`, true);
            return false;
        };

        if (value.length === 0) continue;

        value.forEach(v => {
            const required = ['url', 'title', 'body', 'id'];

            if (required.every(e => v[e] !== undefined)) {
                const i = new Insertable(v['url'], v['title'], v['body']);
                i.id = uuid();
                i.url = v['url'];
                i.isFavorite = v['isFavorite'] || false;
                iterables.push(i);
            }
            else console.error(`Value does not have required insertable properties: ${value}`)
        })
    }

    return iterables;
}

function showAlert(msg, fail = false) {
    result.classList.remove('error', 'success');
    result.classList.add(fail ? 'error' : 'success');
    result.innerHTML = `${msg}<br>`;
}