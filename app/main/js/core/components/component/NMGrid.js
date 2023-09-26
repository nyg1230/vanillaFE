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

export default class NMGrid extends NMComponent {
	#header;
	#data;
	#option;

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
			<div class="header">
				<slot name="header"></slot>
			</div>
			<div class="body">
				<slot name="body"></slot>
			</div>
			<div class="footer">
				<slot name="footer"></slot>
			</div>
		</div>`
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

		const header = util.DomUtil.createElement("div", { class: "row header", slot: "header" });
		fragment.appendChild(header);

		columns.forEach((column, idx) => {
			const { key, name, sort } = { ...column };
			const div = util.DomUtil.createElement("div", { class: `ellipsis item item-${idx}` });
			const label = util.DomUtil.createElement("nm-label", { class: "ellipsis", value: name || key })
			div.appendChild(label);
			if (sort) {
				const icon = util.DomUtil.createElement("div", { class: `icon` });
				icon.textContent = "icon";
				div.appendChild(icon);
			}
			header.appendChild(div);
		});

		this.appendChild(fragment);
	}

	renderRows(list = []) {
		const fragment = document.createDocumentFragment();
		const { columns = [] } = { ...this.#data };

		list.forEach((d) => {
			const row = util.DomUtil.createElement("div", { class: "row content", slot: "body" });

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

	clear() {}
}

define(NMGrid);