import { NMComponent, define } from "../NMComponent.js";

class NMView extends NMComponent {
    static get name() {
        return "nm-view";
    }

    get name() {
        return NMView.name;
    }
}

define(NMView);

export {
    NMView,
    define
};
