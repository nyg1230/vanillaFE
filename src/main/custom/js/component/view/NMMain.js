import { Component, define } from "core/js/customElement/Component";

export default class NMMain extends Component {
    static get observedAttributes() { return ["value", "class"]; }

    static get TAG_NAME() {
        return "nm-main";
    }

    get $$options() {
        return {
            test: true,
            qqq: { q: 1, w: [1,2,3,] }
        }
    }

    get template() {
        !window.eee && (window.eee = this);
        return {
            tag: "div",
            attrs: {
                class: (v = "") => `${this.$name} ${v}`,
                part: this.$name,
                value: v => v
            },
            children: [
                { tag: "nm-label" },
                { tag: "nm-input" },
                {
                    tag: "div",
                    attrs: {
                        class: v => v,
                        value: v => v
                    },
                    children: [
                        {
                            tag: "nm-input",
                            attrs: {
                                class: (v = "") => v,
                                value: v => v
                            }
                        }
                    ]
                }
            ]
        }
    }
}

define(NMMain);
