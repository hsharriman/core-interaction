import Sortable from 'sortablejs';
// Cherrypick extra plugins
import Sortable, { Swap } from 'sortablejs';

export function makeSwappable() {
    Sortable.mount(new Swap());
    new Sortable(swapDemo, {
        swap: true, // Enable swap plugin
        swapClass: 'highlight', // The class applied to the hovered swap item
        animation: 150
    });
    var el = document.getElementById('options');
    var sortable = Sortable.create(el);
}