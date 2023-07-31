import { NMComponent, define } from "main/component/NMComponent.js";

export default class NMInput extends NMComponent {
    static get observedAttributes() {
        return ["value"];
    }

    static get name() {
        return "nm-input";
    }

    get clsName() {
        return NMInput.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                --width: 50px;
                display: block;
                width: var(--width);

                &:hover {
                    background-color: red;
                }

                &input {
                    width: var(--width);
                }
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <input type="text" part="input"/>
        </div>`;
    }
}

define(NMInput);
