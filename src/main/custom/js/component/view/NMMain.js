import { Component, define } from "core/js/customElement/Component";

export default class NMMain extends Component {
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
        return {
            tag: "div",
            attr: {
                class: (v = "") => `${this.$name} ${v}`,
                part: this.$name
            },
            children: [
                { tag: "nm-label" },
                { tag: "nm-input" },
                {
                    tag: "div",
                    children: [
                        {
                            tag: "nm-input",
                            attr: {
                                class: (v = "") => v
                            }
                        }
                    ]
                }
            ]
        }
    }
}

define(NMMain);
