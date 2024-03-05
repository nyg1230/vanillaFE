import { View, define } from "core/js/customElement/View";

class NMMain extends View {
    static get observedAttributes() { return []; }

    static get TAG_NAME() {
        return "nm-main";
    }

    get template() {
        return {
            tag: "div",
            attrs: {
                class: (v = "") => `${this.$name} ${v}`,
                part: this.$name,
                value: v => v
            },
            children: [
                { tag: "slot", }
            ]
        }
    }

    get styles() {
        return `
            .${this.$name} {
                height: 100%;
            }
        `;
    }
}

define(NMMain);

export { NMMain, define };
