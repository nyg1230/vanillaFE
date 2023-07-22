import { NMView, define } from "../NMView.js";
import * as element from "../../element/elements.js"

export default class NMMain extends NMView {
    static get name() {
        return "nm-main";
    }

    get clsName() {
        return NMMain.name;
    }

    get styles() {
        return ``;
    }

    get template() {
        return `
        <div class="${this.name}">
            <nm-input value="1"></nm-input>
            <nm-input value="2"></nm-input>
        </div>
        `
    }
}

define(NMMain);