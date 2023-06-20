import * as util from "./Utils.js"

const tooltipClassName = "tooltip-wrapper";

class Tooltip {
	#target;
	#content;
	#option;
	#tooltip;

	constructor(p) {
		const { target, content, option } = { ...p };
		this.#target = target;
		this.#content = content;
		this.#option = option;
		this.#tooltip = this.getTooltip();
	}

	get clsName() {
		return `tooltip-wrapper`;
	}

	get styles () {
		return ``;
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
			this.#tooltip = util.DomUtil.querySelector(document, `.tooltip`);
		}

		return this.#tooltip;
	}

	setContent(e) {
		const tContent = util.DomUtil.querySelector(this.#tooltip, ".content");

		const setContent = (e) => {
			const content = util.CommonUtil.isFunction(this.#content) ? content(e) : this.#content;

			util.DomUtil.enableClass(this.#tooltip, "hidden", !content);
			clearContent();

			if (content) {
				util.DomUtil.insertAdjacentHTML(tContent, content);
				setPosition(e, target, this.#tooltip);
			}
		}
		return setContent;
	}

	setTooltip() {
		this.#target.addEventListener("mouseover", this.onMouseOver);
	}
	
	clearTooltip() {}

	reset() {
		this.#target.removeEventListener("mouseout", this.onMouseOut);
		this.#target.removeEventListener("mousemove", this.onMouseMove);
		this.#target.removeEventListener("mouseover", this.onMouseOver);

		this.#target.addEventListener("mouseover", this.onMouseOver);
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
		this.#target.removeEventListener("mouseout", this.onMouseOut)
		this.#target.removeEventListener("mousemove", this.onMouseMove)
	}

	onMouseOver() {
		this.#target.addEventListener("mouseout", this.onMouseOut);
		this.#target.addEventListener("mousemove", this.onMouseMove);
	}

	onMouseMove(e) {
		this.setContent(e);
	}
}

export default {
	setTooltip(target, content, options = {}) {
		!this.tooltip && (this.tooltip = getTooltip());

		const tooltip = getTooltip();
		const tContent = util.DomUtil.querySelector(tooltip, ".content");

		const setContent = (e) => {
			const detail = util.CommonUtil.isFunction(content) ? content(e) : content;

			util.DomUtil.enableClass(tooltip, "hidden", !detail);
			clearContent();

			if (detail) {
				util.DomUtil.insertAdjacentHTML(tContent, detail);
				setPosition(e, target, tooltip);
			}
		}

		const clearContent = (e) => {
			tContent.innerHTML = "";
		}

		const onMouseMove = (e) => {
			setContent(e);
		};

		const onMouseOver = (e) => {
			target.addEventListener("mouseout", onMouseOut);
			target.addEventListener("mousemove", onMouseMove);
		};

		const onMouseOut = (e) => {
			// clearContent();
			target.removeEventListener("mouseout", onMouseOut);
			target.removeEventListener("mousemove", onMouseMove);
		};

		target.addEventListener("mouseover", onMouseOver);
	},
	reset() {

	}
};

const tooltipStyle = `
<style>
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

const getTooltip = () => {
	let tooltip = util.DomUtil.querySelector(document, `.${tooltipClassName}`);

	if (!tooltip) {
		const html = `
			<div class="${tooltipClassName} hidden">
				${tooltipStyle}
				<div class="tooltip">
					<div class="content"></div>
				</div>
			</div>`;
		
		const elem = util.DomUtil.querySelector(document, "body");
		elem && util.DomUtil.insertAdjacentHTML(elem, html);
		tooltip = util.DomUtil.querySelector(document, `.tooltip`);
	}

	return tooltip;
};


const setPosition = (e, target, tooltip) => {
	const { clientX: x, clientY: y } = e;


	const tRect = util.StyleUtil.getBoundingClientRect(tooltip);

	const { width, height } = tRect;
	const top = y - height - 10;
	const left = x - width / 2;
	tooltip.style.top = `${top}px`;
	tooltip.style.left = `${left}px`;
}