import Sortable from '../node_modules/sortablejs';
// Cherrypick extra plugins
import { Swap } from '../node_modules/sortablejs';

export default function makeSwappable() {
    Sortable.mount(new Swap());
    new Sortable(options, {
        swap: true // Enable swap plugin
    });
    var el = document.getElementById('options');
    var sortable = Sortable.create(el);
}