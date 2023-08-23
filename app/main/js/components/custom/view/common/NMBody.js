/* inherit */
import { NMView, define } from "main/components/core/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
import NMHeader from "main/components/custom/component/common/NMHeader.js";
import NMNav from "main/components/custom/component/common/NMNav.js";
import NMAside from "main/components/custom/component/common/NMAside.js";
import NMFooter from "main/components/custom/component/common/NMFooter.js";
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";


export default class NMBody extends NMView {
    modelList = [];

    static get name() {
        return "nm-body-view";
    }

    get clsName() {
        return NMBody.name;
    }

    /**
     * 미디어 쿼리로 그리드 영역 설정하기
     * 그리드 관련 함수로 영역 잡아주기
     */
    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-areas: 
                    "h h h h h"
                    ". n s a ."
                    "f f f f f";
            }

            nm-header {
                grid-area: h;
            }

            nm-nav {
                grid-area: n;
            }

            section {
                grid-area: s;
            }

            nm-aside {
                grid-area: a;
            }

            nm-footer {
                grid-area: f;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <nm-header></nm-header>
            <nm-nav></nm-nav>
            <section>
                <slot></slot>
            </section>
            <nm-aside></nm-aside>
            <nm-footer></nm-footer>
        </div>
        `;
    }

    addEvent() {
        window.qqq = this;
    }

    afterRender() {}
}

define(NMBody);