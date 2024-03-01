import { Component, define } from "core/js/customElement/Component";

class NMInput extends Component {
    static get TAG_NAME() { return "nm-input"; }

    get template() {
        return {
            tag: "div",
            attr: {
                class: this.$name,
                part: this.$name
            },
            children: [
                { tag: "input" }
            ]
        }
    };
}

define(NMInput);

export default { NMInput, define };
