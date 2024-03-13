import { View, define } from "core/js/customElement/View";

class NMBody extends View {
    static get observedAttributes() { return []; }

    static get TAG_NAME() {
        return "nm-body";
    }

    get template() {
        return {
            tag: "div",
            attrs: {
                class: this.$name,
                part: this.$name,
            }
        }
    }

    get styles() {
        return ``;
    }
}

define(NMBody);

export { NMBody, define };
