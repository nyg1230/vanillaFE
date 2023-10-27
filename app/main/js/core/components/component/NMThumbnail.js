/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const noThumbnailUrl = util.CommonUtil.find(NMConst, "env.thumbnail.noThumbnail", "");

export default class NMThumbnail extends NMComponent {
    static get observedAttributes() {
        return ["src"];
    }

    static get name () {
        return "nm-thumbnail";
    }

    get clsName() {
        return NMThumbnail.name;
    }

    get src() {
        return this.getAttribute("src");
    }

    set src(src) {
        return this.setAttribute("src", src);
    }

    get image() {
        return util.DomUtil.querySelector(this, ".thumbnail");
    }

    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <nm-image class="thumbnail"></nm-image>
        </div>`
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.IMAGE_ERROR, this.onImageError);
    }

    afterRender() {
        this.src && this.setThumbnailSrc();
    }

    onImageError(e) {
        this.image.setAttribute("src", noThumbnailUrl);
    }

    onChangeAttr(name, old, value) {
        if (name === "src") {
            console.log("onChangeAttr")
            this.setThumbnailSrc();
        }
    }

    setThumbnailSrc() {
        this.image && this.image.setAttribute("src", this.src);
    }
}

define(NMThumbnail);
