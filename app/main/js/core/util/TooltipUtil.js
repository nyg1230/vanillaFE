/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class Tooltip {
	#target;
	#content;
	#option;
	#tooltip;
	#events = {};

	constructor(p) {
		const { target, content, option } = { ...p };
		this.#target = target;
		this.#content = content;
		this.#option = option;
		this.#tooltip = this.getTooltip();
		this.setTooltip();
	}

	get clsName() {
		return `tooltip-wrapper`;
	}

	get styles () {
		return `<style>
					.hidden {
						display: none;
					}
				
					:root {
						--background-color: #000000;
						--opacity: 0.9;
					}
				
					.tooltip-wrapper {
						position: fixed;
						user-select: none;
						width: fit-content;
						height: auto;
						background-color: var(--background-color);
						opacity: var(--opacity);
						color: #FFFFFF;
						font-size: 12px;
						font-weight: 600;
						border-radius: 8px;
						padding: 8px 4px;
					}
				
					.tooltip-wrapper::after {
						opacity: var(--opacity);
						--border-size: 4px;
						border-top: var(--border-size) solid var(--background-color);
						border-left: var(--border-size) solid transparent;
						border-right: var(--border-size) solid transparent;
						border-bottom: 0px solid transparent;
						content: "";
						position: absolute;
						top: 100%;
						left: calc(50% - var(--border-size));
					}
				</style>`;
	}

	getTooltip() {
		this.#tooltip = util.DomUtil.querySelector(document, `.${this.clsName}`);

		if (!this.#tooltip) {
			const html = `
				<div class="${this.clsName} hidden">
					${this.styles}
					<div class="tooltip">
						<div class="content"></div>
					</div>
				</div>`;
			
			const elem = util.DomUtil.querySelector(document, "body");
			elem && util.DomUtil.insertAdjacentHTML(elem, html);
			this.#tooltip = util.DomUtil.querySelector(document, `.${this.clsName}`);
		}

		return this.#tooltip;
	}

	setContent(e) {
		const tContent = util.DomUtil.querySelector(this.#tooltip, ".content");

		this.setContent = (e) => {
			const content = util.CommonUtil.isFunction(this.#content) ? this.#content.call(this.#target, e) : this.#content;

			util.DomUtil.enableClass(this.#tooltip, "hidden", !content);
			this.clearContent();

			if (content) {
				util.DomUtil.insertAdjacentHTML(tContent, content);
				this.setPosition(e, this.#target, this.#tooltip);
			}
		}
	}

	clearContent() {
		const tContent = util.DomUtil.querySelector(this.#tooltip, ".content");
		tContent.innerHTML = "";
	}

	setTooltip() {
		const mouseMove = this.onMouseMove.bind(this);
		const mouseMoveOption = {};
		util.EventUtil.bindEvent(this.#target, NMConst.eventName.MOUSE_MOVE, mouseMove, mouseMoveOption);
		this.#events[NMConst.eventName.MOUSE_MOVE] = {
			fn: mouseMove,
			option: mouseMoveOption
		};

		const mouseOut = this.onMouseOut.bind(this);
		const mouseOutOption = {};
		util.EventUtil.bindEvent(this.#target, NMConst.eventName.MOUSE_OUT, mouseOut, mouseOutOption);
		this.#events[NMConst.eventName.MOUSE_OUT] = {
			fn: mouseOut,
			option: mouseOutOption
		};
	}
	
	clearEventAll() {
		Object.keys(this.#events).forEach((eventName) => {
			this.clearEvent(eventName);
		})
	}

	clearEvent(eventName) {
		const info = this.#events[eventName];
		const { fn, option } = { ...info };
		util.EventUtil.unbindEvent(this.#target, eventName, fn, option);

		delete this.#events[eventName];
	}

	reset() {
		this.clearEventAll();
		this.setTooltip();
	}

	setPosition(e) {
		const { clientX: x, clientY: y } = e;
		const tRect = util.StyleUtil.getBoundingClientRect(this.#tooltip);

		const { width, height } = tRect;
		const top = y - height - 10;
		const left = x - width / 2;
		this.#tooltip.style.top = `${top}px`;
		this.#tooltip.style.left = `${left}px`;
	}

	onMouseOut() {
		util.DomUtil.enableClass(this.#tooltip, "hidden", true);
		this.clearContent();
	}

	onMouseMove(e) {
		this.setContent(e);
	}

	destroy() {
		this.clearEventAll();
		this.#tooltip.remove();
	}
}

export default {
	setTooltip(target, content, option = {}) {
		const tooltip = new Tooltip({ target, content, option });
		return tooltip;
	}
};
