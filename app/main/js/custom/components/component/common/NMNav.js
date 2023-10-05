/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import NMMenu from "js/core/components/component/NMMenu.js"
import NMList from "js/core/components/component/NMList.js"
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

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

            .link-list {
                font-size: 12px;
                font-weight: 700;
                --row-padding: 0px 4px;
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <div class="avatar">
                        <nm-image src="test"></nm-image>
                    </div>
                    <div class="link">
                        <nm-list class="link-list">
                            <template>
                                <div class="row">
                                    <nm-label class="" type="text" data-value="name"></nm-label>
                                </div>
                            </template>
                        </nm-list>
                    </div>
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

        const linkList = util.DomUtil.querySelector(this, ".link-list");
        const linkDatas = Object.values(NMConst.env.profile.url);
        linkList && linkList.setData(linkDatas);
    }
}

define(NMNav);
