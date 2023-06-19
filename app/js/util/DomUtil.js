import * as util from "./Utils.js";

const DomUtil = {
	querySelector(target, selector) {
		target = target.shadowRoot ?? target;
		const result = target.querySelector(selector);
		return result;
	},
	querySelectorAll(target, selector) {
		target = target.shadowRoot ?? target;
		const result = target.querySelectorAll(selector);
		return result;
	},
	insertAdjacentHTML(target, html, position = "beforeend") {
		target.insertAdjacentHTML(position, html);
	},
	addClass(target, cls) {
		cls = util.CommonUtil.isString(cls) ? cls.split(" ") : cls;

		cls.forEach((c) => {
			target.classList.add(c);
		});
	},
	removeClass(target, cls) {
		cls = util.CommonUtil.isString(cls) ? cls.split(" ") : cls;

		cls.forEach((c) => {
			target.classList.remove(c);
		})
	},
	enableClass(target, cls, bool = true) {
		if (bool === true) {
			this.addClass(target, cls);
		} else {
			this.removeClass(target, cls);
		}
	}
};

export default DomUtil;
