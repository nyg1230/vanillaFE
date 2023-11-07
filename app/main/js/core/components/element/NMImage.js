/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMImage extends NMComponent {
    #maxErrorCount = 3;
    #errorCount = 0;
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
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;

                & .image {
                    width: 100%;
                    height: 100%;
                }
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <img class="image"></img>
                </div>`;
    }

    addEvent() {}

    onError(e) {
        if (++this.#errorCount > this.#maxErrorCount) {
            this.#img.removeAttribute("src");
            this.#errorCount = 0;
        } else {
            util.EventUtil.dispatchEvent(this, NMConst.eventName.IMAGE_ERROR);
        }
    }

    afterRender() {
        this.#img = util.DomUtil.querySelector(this, ".image");
        this.#img.onerror = this.onError.bind(this);
        this.src && this.setImageUrl();
    }

    setImageUrl() {
        this.#img && this.#img.setAttribute("src", this.src)
    }

    onChangeAttr(name, old, value) {
        if (name === "src") {
            this.setImageUrl();
        }
    }
}

define(NMImage);
