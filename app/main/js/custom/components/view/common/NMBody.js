/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import NMHeader from "js/custom/components/component/common/NMHeader.js";
import NMNav from "js/custom/components/component/common/NMNav.js";
import NMAside from "js/custom/components/component/common/NMAside.js";
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";


export default class NMBody extends NMView {
    modelList = [];

    static get name() {
        return "nm-body";
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
				display: flex;
				flex-direction: column;
            }

			.container {
				--width: 1440px;
				max-width: var(--width);
                height: 100%;
                display: grid;
				grid-template-areas: "nav sec aside";
				grid-template-columns: minmax(0, 10vw) minmax(0, 60vw) minmax(0, 10vw);
				margin: 0 auto;
			}

			.side-bar {
				display: contents;
			}

			nm-header {
				position: sticky;
				height: fit-content;
				grid-area: header;
			}

			nm-nav {
				grid-area: nav;
			}

			section {
				grid-area: sec;
			}

			nm-aside {
				grid-area: aside;
			}

			nm-footer {
				grid-area: header;
			}
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <nm-header></nm-header>
			<div class="container">
				<div class="side-bar">
					<nm-nav></nm-nav>
					<nm-aside></nm-aside>
				</div>
				<section>
					<slot></slot>
				</section>
			</div>
        </div>
        `;
    }

    addEvent() {}

    afterRender() {}
}

define(NMBody);
