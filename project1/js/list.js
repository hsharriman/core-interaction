import Sortable, { Swap } from '../node_modules/sortablejs/modular/sortable.core.esm.js';   
// Cherrypick extra plugins

window.makeSwappable = () => {
    console.log("running swappable");
    Sortable.mount(new Swap());
    new Sortable(options, {
        swap: true, // Enable swap plugin
        onEnd(evt) {
            var ul = evt.to;
            var arr = [];
            var items = ul.getElementsByTagName("li");
            for (var i = 0; i < items.length; ++i) {
                arr.push([items[i].id, i]); 
            }
            ch.postMessage(["section update", arr]);
            console.log(arr);
        }
    });
    var el = document.getElementById('options');
    var sortable = Sortable.create(el);

    console.log(sortable);
    console.log("made swappable");
}