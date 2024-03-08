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
                class: this.$name,
                part: this.$name,
            }
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

    initProxy() {
        window.qqq = this;
        return {
            test: 123,
            qqq: {
                asdf: [1, 2, 3]
            }
        }
    }
}

define(NMBody);

export { NMBody, define };
