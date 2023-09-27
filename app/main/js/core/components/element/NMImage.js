/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMImage extends NMComponent {
    #img;

    static get observedAttributes() {
        return ["src"];
    }

    static get name() {
        return "nm-image";
    }

    get clsName() {
        return NMImage.name;
    }

    get src() {
        return this.getAttribute("src");
    }

    set src(src) {
        return this.setAttribute("src", src);
    }

    get styles() {
        return ``;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <img class="image"></img>
                </div>`;
    }

    afterRender() {
        const img = util.DomUtil.querySelector(this, ".image");
        this.#img = img;
    }

    onChangeAttr(name, old, value) {
        if (name === "src") {
            // console.log(name, old, value);
            console.log(this.#img);
        }
    }
}

define(NMImage);
