/* common */
import * as util from "js/core/util/utils.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const DomUtil = {
	createElement(tagName, attrs = {}) {
		const tag = document.createElement(tagName)

		if (util.CommonUtil.isObject(attrs)) {
			Object.entries(attrs).forEach(([attr, value]) => {
				tag.setAttribute(attr, value);
			});
		}

		return tag;
	},

	domParser(str, mimeType) {
		let parsed;

		try {
			const parser = new DOMParser();
			parsed = parser.parseFromString(str, mimeType);
		} catch(e) {
			console.error(e);
		}

		return parsed;
	},

	textToDom(str) {
		const dom = this.domParser(str, NMConst.mimeType.TEXT__HTML);
		return dom;
	},

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
