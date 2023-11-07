/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMAside extends NMComponent {
    static get observedAttributes() {
        return [];
    }

    static get name() {
        return "nm-aside";
    }

    get clsName() {
        return NMAside.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                height: 100%;
            }

            .banner {
                border: 1px solid var(--plein-air);
                height: 600px;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(image/banner/banner_vertical.png);
            }
            `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <div class="banner"></div>
                </div>`;
    }
}

define(NMAside);
