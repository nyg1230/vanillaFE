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
				display: flex;
				flex-direction: column;
            }

			.container {
				--width: 1440px;
				max-width: var(--width);
                height: 100%;
                display: grid;
				grid-template-areas: "nav sec aside";
				grid-template-columns: minmax(0, 10vw) minmax(0, 50vw) minmax(0, 10vw);
				margin: 0 auto;
			}

			.side-bar {
				display: contents;
			}

			nm-header {
				position: sticky;
				height: fit-content;
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

			@media screen and (max-width: 860px) {
				.container {
					--width: 800px;
					margin: 0 0;
					grid-template-areas:
						"nav"
						"sec"
						"aside";
					grid-template-columns: minmax(0, 100vw);
					grid-template-rows: minmax(0, fit-content);
				}
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