/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const defaultOption = {
	scroll: {
		type: "scroll"
	},
	pagination: {
		type: "pagination",
		page: {
			size: 10
		}
	}
};

const defaultWidth = 100;

/**
 * 2023-09-28
 * 무한 스크롤 및 pagination 추가 필요
 * row height 고려해보기.. css로 처리할 지 코드로 처리할지 고민
 * 다중행을 지원할 지 툴팁으로 처리할지 고민
 * 
 * renderRow header 나뉜 코드 통합 필요, params로 data 받아서 처리하게 끔 필요
 * 
 * haeder style 직접 수정한 부분 차후에 코드 재확인 필요
 * getBoundingClientRect로 인해 한번 더 확인할 필요가 있음
 */
export default class NMGrid extends NMComponent {
	#data;
	#option;
	#containers;
	#node;

	static get name() {
		return "nm-grid";
	}

	get clsName() {
		return NMGrid.name;
	}

	get styles() {
		return ``;
	}

	get template() {
		return `
		<div class="${this.clsName} container" part="${this.clsName}">
			<div class="data-container">
				<div class="header-container">
					<div class="header-content">
						<slot name="headers"></slot>
					</div>
				</div>
				<div class="body-container">
					<div class="body-content">
						<slot name="rows"></slot>
					</div>
				</div>
			</div>
			<div class="footer-container">
				<div class="footer-content">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>`
	}

	addEvent() {
	}

	afterRender() {
		this.#containers = {
			header: {
				container: util.DomUtil.querySelector(this, ".header-container"),
				content: util.DomUtil.querySelector(this, ".header-content"),
			},
			body: {
				container: util.DomUtil.querySelector(this, ".body-container"),
				content: util.DomUtil.querySelector(this, ".body-content")
			}
		};

		this.bindEvent(this.#containers.body.container, NMConst.eventName.SCROLL, this.onScroll);
	}

	onScroll(e) {
		const { target } = e;

		if (this.#containers.body.container === target) {
			this.setHeaderPosition();
		}
	}

	setHeaderPosition() {
		const rect = this.getBoundingClientRect();
		const {
			header: { content: hContent },
			body: { content: bContent }
		} = { ...this.#containers };
		const bRect = bContent.getBoundingClientRect();

		hContent.style.left = `${bRect.left - rect.left}px`;
	}

	setData(d) {
		this.clear();
		this.#data = d;

		const { data, option } = { ...this.#data };
		this.#data = data;
		
		const { type = "scroll" } = { ...option };
		this.#option = util.CommonUtil.shallowMerge(defaultOption[type], option);


		this.renderHeader();

		if (type === "scroll") {
			const { list } = { ...this.#data };
			this.renderRows(list);
		}
	}

	renderHeader() {
		const fragment = document.createDocumentFragment();
		const { columns = [] } = { ...this.#data };

		const header = util.DomUtil.createElement("div", { class: "row header", slot: "headers" });
		fragment.appendChild(header);

		const columnStyles = {};
		columns.forEach((column, idx) => {
			const { key, name, sort, width = defaultWidth } = { ...column };
			const div = util.DomUtil.createElement("div", { class: `ellipsis item item-${idx}` });
			const label = util.DomUtil.createElement("nm-label", { class: "ellipsis", value: name || key, tooltip: true })
			div.appendChild(label);
			if (sort) {
				const icon = util.DomUtil.createElement("div", { class: `icon` });
				icon.textContent = "icon";
				div.appendChild(icon);
			}

			columnStyles[`.item-${idx}`] = `--width: ${width}px;`;
			header.appendChild(div);
		});

		util.StyleUtil.setStyles(this, columnStyles);
		this.appendChild(fragment);
	}

	renderRows(list = [], stIdx = 0) {
		const fragment = document.createDocumentFragment();
		const { columns = [] } = { ...this.#data };

		list.forEach((d, idx) => {
			const row = util.DomUtil.createElement("div", { class: "row content", row: `${stIdx + idx}`, slot: "rows" });

			columns.forEach((column, idx) => {
				const { key } = { ...column };
				const value = d[key];
				const div = util.DomUtil.createElement("div", { class: `ellipsis item item-${idx}` });
				div.textContent = value;
				row.appendChild(div);
			});

			fragment.appendChild(row);
		});

		this.appendChild(fragment);
	}

	rednerFooter() {}

	clearRow() {
		const rows = this.querySelectorAll(`[row]`);
		console.log(rows);
		rows.forEach((el) => this.removeChild(el));
	}

	clear() {
		util.DomUtil.removeAllChild(this);
	}
}

define(NMGrid);