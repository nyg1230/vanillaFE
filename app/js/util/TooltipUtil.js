import * as util from "./Utils.js"

const tooltipClassName = "global-tooltip";
export default {
	setTooltip(target, content, options = {}) {
		!this.tooltip && (this.tooltip = getTooltip());

		const onMouseMove = (e) => {};

		const onMouseOver = (e) => {
			target.addEventListener("mouseout", onMouseOut)
			target.addEventListener("mousemove", onMouseMove)
		};

		const onMouseOut = (e) => {
			target.removeEventListener("mouseout", onMouseOut)
			target.removeEventListener("mousemove", onMouseMove)
		};

		target.addEventListener("mouseover", onMouseOver);
	}
};

const getTooltip = () => {
	let tooltip = util.DomUtil.querySelector(document, `.${tooltipClassName}`);

	if (!tooltip) {
		const html = `
			<div class="${tooltipClassName}">
				<div class="tooltip-wrapper">
					<div class="tooltip"></div>
				</div>
			</div>`;
		
		const elem = util.DomUtil.querySelector(document, "");
		elem && util.DomUtil.insertAdjacentHTML(elem, html);
		tooltip = util.DomUtil.querySelector(elem, `.${tooltipClassName}`);
	}

	return tooltip;
};
