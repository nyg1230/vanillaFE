/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import NMMenu from "js/core/components/component/NMMenu.js"
/* constant */
import NMConst from "js/core/constant/NMConstant";

export default class NMNav extends NMComponent {
    static get observedAttributes() {
        return [];
    }

    static get name() {
        return "nm-nav";
    }

    get clsName() {
        return NMNav.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                border: 1px solid blue;
            }


        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <div class="avatar">
                        <nm-image src="test"></nm-image>
                    </div>
                    <div class="link"></div>
                    <div class="menu">
                        <nm-menu class="category-menu"></nm-menu>
                    </div>
                </div>`;
    }

    afterRender() {
        const catMenu = util.DomUtil.querySelector(this, ".category-menu");
        const data = [
            {
                value: "home",
                range: "common"
            },
            {
                value: "category",
                range: "common",
                data: [
                    { value: "canvas", range: "" },
                    { value: "js", range: "" },
                    { value: "chart", range: "" }
                ]
            }
        ];
        catMenu.setData(data);

        console.log(NMConst.env.profile.url);
    }
}

define(NMNav);
