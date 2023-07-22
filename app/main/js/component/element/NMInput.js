import { NMComponent, define } from "../NMComponent.js";

export default class NMInput extends NMComponent {
    static get name() {
        return "nm-input";
    }

    get clsName() {
        return NMInput.name;
    }

    get styles() {
        return `
            * {
                color: red;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}> part="${this.clsName}"
            <input type="text" />
        </div>`;
    }
}

define(NMInput);
