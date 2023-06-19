import * as util from "./Utils.js"

const tooltipClassName = "tooltip-wrapper";
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
			target.addEventListener("mouseout", onMouseOut)
			target.addEventListener("mousemove", onMouseMove)
		};

		const onMouseOut = (e) => {
			// clearContent();
			target.removeEventListener("mouseout", onMouseOut)
			target.removeEventListener("mousemove", onMouseMove)
		};

		target.addEventListener("mouseover", onMouseOver);
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