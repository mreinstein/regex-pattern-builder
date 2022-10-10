import clamp           from 'https://cdn.skypack.dev/clamp';
import html            from 'https://cdn.skypack.dev/snabby';
import selectSubstring from './select-substring.js';


const css = `
    button {
        background-color: dodgerblue;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
`;


function init (options={}) {
    return options.urls || [ ];
}


function destroy (model) { }


function exampleUrlView (model, idx, update) {
    const s = model[idx];

    const _edit = function (idx) {
        const result = prompt('enter the updated url:', s.string);

        if (result !== null) {
            s.string = result;
            s.selectionStart = clamp(s.selectionStart, 0, s.string.length-2);
            s.selectionEnd = clamp(s.selectionEnd, s.selectionStart+1, s.string.length-1);
            update();
        }
    };

    const _remove = function (idx) {
        model.splice(idx, 1);
        update();
    };

    return html`<div style="border-top: 1px solid #eaeaea; display: flex;">
        <div>
            <button style="background-color: transparent; fill: dodgerblue;"
                    @on:click=${() => _edit(idx)}>

<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M18 13.45l2-2.023v4.573h-2v-2.55zm-11-5.45h1.743l1.978-2h-3.721v2zm1.361 3.216l11.103-11.216 4.536 4.534-11.102 11.218-5.898 1.248 1.361-5.784zm1.306 3.176l2.23-.472 9.281-9.378-1.707-1.707-9.293 9.388-.511 2.169zm3.333 7.608v-2h-6v2h6zm-8-2h-3v-2h-2v4h5v-2zm13-2v2h-3v2h5v-4h-2zm-18-2h2v-4h-2v4zm2-6v-2h3v-2h-5v4h2z"/></svg>
                    </button>
            <button style="background-color: transparent; fill: red;"
                    @on:click=${() => _remove(idx)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg>
                    </button>
        </div>
        ${selectSubstring.view(s, update)}
    </div>`;
}


function view (model, update) {
    const _addUrlExample = function () {
        model.push(selectSubstring.init({
            string: 'https://example.com/test/product.1234.html',
            selectionStart: 33,
            selectionEnd: 36
        }));
        update();
    };

    return html`<div>
        <style>${css}</style>
        <button @on:click=${_addUrlExample}
                style="margin-bottom: 12px; ">add url example</button>
        <div>
            ${model.map((u, idx) => exampleUrlView(model, idx, update))}
        </div>
    </div>`;
}


export default { init, destroy, view }
