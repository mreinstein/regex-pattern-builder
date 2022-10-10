import clamp from 'https://cdn.skypack.dev/clamp';
import html  from 'https://cdn.skypack.dev/snabby';


const css = `
    .draghandle {
        background-color: transparent;
        color: black;
    }
`;


function init (options={}) {
    return {
        string: options.string || '',
        selectionStart: options.selectionStart || 0,
        selectionEnd: options.selectionEnd || 0
    };
}


function view (model, update) {
    const spanifiedText = [ ];
    const spanifiedTextHidden = [ ];

    // @param string type  start or end
    const _down = function (type) {
        model.dragging = type;
        document.body.addEventListener('mouseup', _up);
        update();      
    };

    const _up = () => {
        model.dragging = undefined;
        document.body.removeEventListener('mouseup', _up);
        update();
    };

    const _enter = function (idx) {
        if (model.dragging === 'start')
            model.selectionStart = clamp(idx, 0, model.selectionEnd-1);
        else
            model.selectionEnd = clamp(idx, model.selectionStart+1, model.string.length-1);

        update();
    };


    const isSelected = function (i) {
        return i >= model.selectionStart && i <= model.selectionEnd;
    };

    for (let i=0; i < model.string.length; i++) {
        const ch = model.string.substring(i, i+1);
        spanifiedText.push(
            html`<span @style:color=${isSelected(i) ? 'white' : 'black'}
                       @style:background-color=${isSelected(i) ? 'rgb(255,64,129)' : 'white'}>${ch}</span>`
        );

        let _d;
        if (!model.dragging) {
            if (i === model.selectionStart)
                _d = () => _down('start');
            else if (i === model.selectionEnd)
                _d = () => _down('end');
        }

        let _e;

        if (model.dragging) {
            _e = () => _enter(i)
        }

        let _ch = ch;
        if (model.selectionStart === i || model.selectionEnd === i)
            _ch = html`<svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 8 16"
                            style="height: 16px; width: 8px; background-color: white; font-size: 10px; text-anchor: middle; user-select: none; user-drag: none;">
                            <path d="M 4 0  l 5 4 l 0 12  l -10 0  l 0 -12 Z" style="fill: dodgerblue; cursor: ew-resize;"></path>
        </svg>`;

        // TODO: fix the wrapping (svg drag handles affect the text wrapping and cause mis-alignment.)
        
        // TODO: make the dragging easier by attaching to global mouse move.

        spanifiedTextHidden.push(
            html`<span style="color: transparent;"
                       @on:mousedown=${_d}
                       @on:mouseenter=${_e}
                       @class:draghandle=${model.selectionStart === i || model.selectionEnd === i}>${_ch}</span>`
        );
    }

    return html`<div style="background-color: white; padding: 10px; font-family: monospace; font-size: 14px; min-height: 34px; word-break: break-word;">
        <style>${css}</style>
        <div>${spanifiedText}</div>
        <div style="user-select:none; padding-top: 2px;">${spanifiedTextHidden}</div>
    </div>`;
}


function destroy () {
    // TODO: remove mouseup event handler
}


export default { init, destroy, view }
