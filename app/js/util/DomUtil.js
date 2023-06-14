import * as util from "./Utils.js";

const DomUtil = {
	querySelector(target, selector) {
		target = target.shadowRoot ?? target;
		const result = target.querySelector(selector);
	},
	querySelectorAll(target, selector) {
		target = target.shadowRoot ?? target;
		const result = target.querySelectorAll(selector);
	},
	insertAdjacentHTML(target, html, position = "beforeend") {
		target.insertAdjacentHTML(position, html);
	},
	enableClass(target, cls, bool) {
		// cls = util.CommonUtil.isArray(cls) ? cls.join(" ")
	}
};

export default DomUtil;
g