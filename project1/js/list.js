import Sortable, { Swap } from '../node_modules/sortablejs/modular/sortable.core.esm.js';   
// Cherrypick extra plugins

window.makeSwappable = () => {
    console.log("running swappable");
    Sortable.mount(new Swap());
    new Sortable(options, {
        swap: true, // Enable swap plugin
        onEnd(evt) {
            console.log(evt.to);
            ch.postMessage(Array.from(evt.to));
            console.log(Array.from(evt.to));
        }
    });
    var el = document.getElementById('options');
    var sortable = Sortable.create(el);

    console.log(sortable);
    console.log("made swappable");
}