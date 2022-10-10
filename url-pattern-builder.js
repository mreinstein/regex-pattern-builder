import clamp           from 'https://cdn.skypack.dev/clamp';
import html            from 'https://cdn.skypack.dev/snabby';
import urlList         from './url-list.js';
import { buildRegex } from './build-regex.js';


const css = `
 button:disabled {
    filter: grayscale(0.85);
}`;


function init (options={}) {
    return {
        urls: urlList.init({ urls: options.urls || [ ] }),
        lastError: '',
        state: 'editing', // editing | submitting
        matchPatterns: options.matchPatterns || [ ],
    };
}


function destroy (model) { }


function view (model, update) {
    const _generate = async function () {

        const unique = { };
        model.urls.map((u) => {
            const pageid = u.string.substring(u.selectionStart, u.selectionEnd);
            const result = buildRegex(u.string, pageid);
            unique[result] = true;
        });

        model.matchPatterns = Object.keys(unique);
        update();
    };


    return html`<div>
        <style>${css}</style>
        <h1>
            Select string to extract.
        </h1>

        <p> Select the portion of each URL that should be extracted.</p>

        <p> Providing more example URLS improves the result accuracy.</p>

        ${urlList.view(model.urls, update)}

        <div style="padding: 10px 0px;">
            <p @style:display=${model.urls.length < 2 ? '' : 'none'}
               style="border: 1px solid #ef2222; background-color: #ffd2c8; border-radius: 4px; padding: 10px;">
                You must provide at least 2 example URLs for the website to generate a pattern.

                Adding additional examples is encouraged, as it will make the matching logic more reliable.
            </p>

            <div style="display:flex; flex-direction: row; border-top: 1px solid #eaeaea; padding-top: 10px;">
                <button @attrs:disabled=${model.state === 'submitting' || model.urls.length < 2}
                    @on:click=${_generate}
                    style="transition: filter 0.22s ease-in;">generate pattern</button>

                <div style="padding: 16px; align-items: center; border: 1px solid #ef2222; background-color: #ffd2c8; border-radius: 4px; padding: 10px; margin-left: 16px;"
                     @style:display=${model.lastError ? '' : 'none'}
                     @props:textContent=${model.lastError}></div>

                <div style="padding: 16px; color: #27a743; background-color: #97e697; margin-left: 16px; border: 1px solid #27a743; border-radius: 4px;"
                     @style:display=${(model.state === 'editing' && model.matchPatterns.length) ? '' : 'none'}
                     title="generated patterns (regex): ${model.matchPatterns.join('  ,  ')}">
                    Success! Generated regular expressions matching all example URLs:
                    <ul>
                    ${model.matchPatterns.map((mp) => {
                        return html`<li style="font-weight: bold;">${mp}</li>`
                    })}
                    </ul>
                    
                </div>  
            </div>
            
        </div>
    </div>`;
}


export default { init, destroy, view };
