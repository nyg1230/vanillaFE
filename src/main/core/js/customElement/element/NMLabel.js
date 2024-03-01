import { Component, define } from "core/js/customElement/Component";

class NMLabel extends Component {
    static get TAG_NAME() { return "nm-label"; }

    get template() {
        return {
            tag: "div",
            attr: {
                className: this.$name,
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
