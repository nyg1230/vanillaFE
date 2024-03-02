import { Component, define } from "core/js/customElement/Component";

class NMLabel extends Component {
    static get observedAttributes() { return ["value", "class"]; }

    static get TAG_NAME() { return "nm-label"; }

    get template() {
        return {
            tag: "div",
            attrs: {
                class: (v = "") => `${this.$name} ${v}`,
                value: (v = "") => v,
                part: this.$name
            },
            children: [
                {
                    tag: "div",
                    children: [
                        {
                            tag: "div",
                            attrs: {
                                value: (v = "") => v
                            }
                        }
                    ]
                },
                { tag: "slot" }
            ]
        }
    };
}

define(NMLabel);

export default { NMLabel, define };
