import { View, define } from "core/js/customElement/View";

class NMHeader extends View {
    static get observedAttributes() { return []; }

    static get TAG_NAME() {
        return "nm-header";
    }

    get template() {
        return {
            tag: "div",
            attrs: {
                class: this.$name,
                part: this.$name
            },
            children: [
                { tag: "slot", }
            ]
        }
    }

    get styles() {
        return `
            .${this.$name} {
                width: 100%;
                height: 100%;
            }
        `;
    }
}

define(NMHeader);

export { NMHeader, define };
