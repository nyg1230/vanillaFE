/* inherit */
import { View, define } from "core/js/customElement/View";

/* component */
import { NMHeader } from "custom/js/component/view/common/NMHeader";
import { NMSide } from "custom/js/component/view/common/NMSide";

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
            },
            children: [
                { tag: "nm-header", attrs: { class: "header" } },
                { tag: "nm-side", attrs: { class: "side" } },
                { tag: "nm-footer", attrs: { class: "footer" } },
                {
                    tag: "div",
                    attrs: { class: "container" },
                    children: [{ tag: "slot" }]
                }
            ]
        }
    }

    get styles() {
        return `
            .${this.$name} {
                height: 100%;
                display: grid;
                grid-template:
                    "h h h h h"
                    "c c c c c"
                    "f f f f f";
                grid-template-rows: fit-contents auto 30px;
            }

            .header {
                grid-area: h;
                border: 1px solid red;
            }

            .footer {
                grid-area: f;
                border: 1px solid blue;
            }

            .side {
                position: fixed;
                height: 100%;
            }

            .container {
                grid-area: c;
                border: 1px solid green;
            }
        `;
    }
}

define(NMBody);

export { NMBody, define };
