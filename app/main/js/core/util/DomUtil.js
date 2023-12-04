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

	querySelector(target, selector, root = true) {
		target = root !== true ? target : target.shadowRoot ?? target;
		const result = target.querySelector(selector);
		return result;
	},

	querySelectorAll(target, selector, root = true) {
		target = root !== true ? target : target.shadowRoot ?? target;
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
	},

	hasClass(target, cls = [], every = false) {
		let bool = false;
		const classList = target.classList;
		if (!util.CommonUtil.isArray(cls)) {
			cls = [cls];
		}

		if (!classList) {
		} else if (every) {
			bool = cls.every((a) => classList.contains(a));
		} else {
			bool = cls.some((a) => classList.contains(a));
		}

		return bool;
	},

	removeAllChild(target) {
		let child = target && target.firstChild;

		
		while (child) {
			target.removeChild(child);
			child = target.firstChild;
		}
	}
};

export default DomUtil;
