import { View, define } from "core/js/customElement/View";

class NMSide extends View {
    static get observedAttributes() { return []; }

    static get TAG_NAME() {
        return "nm-side";
    }

    get template() {
        return {
            tag: "div",
            attrs: {
                class: this.$name,
                part: this.$name
            },
            children: [
                { tag: "slot", }
            ]
        }
    }

    get styles() {
        return `
            .${this.$name} {
                --width: 300px;
                --translate: -100%;
                width: var(--width);
                height: 100%;

                background-color: yellowgreen;
                transform: translateX(var(--translate));
                transition-duration: 1000ms;

                &.active {
                    --translate: 0%;
                }
            }
        `;
    }
}

define(NMSide);

export { NMSide, define };
