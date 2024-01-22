/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMIcon extends NMComponent {
    #icon;

    static get defineProperty() {
        return { icon: "", size: "18" };
    }

    static get name() {
        return "nm-icon";
    }

    get clsName() {
        return NMIcon.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                display: flex;

                svg {
                }
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                </div>`;
    }

    get wrapper() {
        return util.DomUtil.querySelector(this, `.${this.clsName}`);
    }

    onChangeAttr(name, old, value) {
        if (name === "icon") {
            this.setIcon();
        } else if (name === "size") {
            this.setSize();
        }
    }

    async getIcon() {
        return await util.FetchUtil.getIcon(this.icon);
    }

    async setIcon() {
        this.clear();
        const icon = await this.getIcon();

        if (icon) {
            if (icon === NMConst.param.WAIT) {
                this.invoke(`${this.icon}`, false, { fn: "setIcon" }, true );
            } else {
                this.wrapper.innerHTML = icon.outerHTML;
                this.#icon = util.DomUtil.querySelector(this, "svg");
                this.setSize();
            }
        }
    }

    setSize() {
        if (this.#icon) {
            const size = util.CommonUtil.falsy(this.size) ? NMIcon.defineProperty.size : this.size;
            this.#icon.setAttribute("width", size);
            this.#icon.setAttribute("height", size);
        }
    }

    clear() {
        util.DomUtil.removeAllChild(this);
        this.#icon = null;
    }
}

define(NMIcon);

export { NMIcon };
