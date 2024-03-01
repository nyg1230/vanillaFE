import { Component, define } from "core/js/customElement/Component";

class NMLabel extends Component {
    static get observedAttributes() { return ["value", "class"]; }

    static get TAG_NAME() { return "nm-label"; }

    get template() {
        !window.www && (window.www = this);
        return {
            tag: "div",
            attr: {
                class: (v = "") => `${this.$name} ${v}`,
                value: (v = "") => v,
                part: this.$name
            },
            children: [
                { tag: "slot" }
            ]
        }
    };
}

define(NMLabel);

export default { NMLabel, define };
