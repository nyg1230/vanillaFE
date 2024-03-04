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
                class: (v = "") => `${this.$name} ${v}`,
                part: this.$name,
                value: v => v
            },
            children: [
                { tag: "nm-header", },
                {
                    tag: "div",
                    attrs: {
                        class: "contents"
                    },
                    children: [
                        { tag: "slot" }
                    ]
                },
                { tag: "nm-side-bar", }
            ]
        }
    }

    get styles() {
        return `
            .${this.$name} {
                height: 100%;
            }

            nm-side-bar {
                height: 100%;
                position: absolute;
            }
        `;
    }
}

define(NMBody);

export { NMBody, define };
