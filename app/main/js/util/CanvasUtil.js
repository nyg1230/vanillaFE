/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */

const canvas = util.DomUtil.createElement("canvas");
const ctx = canvas.getContext("2d");

const publicCanvas = util.DomUtil.createElement("canvas");
const publicCtx = publicCanvas.getContext("2d");

const CanvasUtil = {
    line(coordinateList = [], param) {
        const { type = "stroke" } = { ...param };
        return {
            coordinateList,
            type,
            draw: function(ctx) {
                const { coordinateList, type } = { ...this };
                if (util.CommonUtil.length(coordinateList) < 1) return;

                const [first, ...remain] = [...coordinateList];
                const [fx, fy, fStyles] = [...first];
                ctx.save();

                ctx.beginPath();
                CanvasUtil.setStyle(ctx, fStyles);
                ctx.moveTo(fx, fy);

                remain.forEach((coor) => {
                    const [x, y, styles] = [...coor];
                    CanvasUtil.setStyle(ctx, styles);
                    ctx.lineTo(x, y);
                });
                ctx.closePath();
                
                type === "stroke" ? ctx.stroke() : ctx.fill();
                ctx.restore();
            }
        }
    },
    rect(x, y, width, height, param) {
        const { type = "fill", style, option } = { ...param };
        return {
            x,
            y,
            width,
            height,
            type,
            style,
            option,
            draw: function(ctx, ratio = 1, addStyles = {}) {
                const { x, y: _y, width, height: _height, style } = { ...this };
                const fn = type === "fill" ? ctx.fillRect : ctx.strokeRect;
                ctx.save();

                CanvasUtil.setStyle(ctx, style);
                const height = _height * ratio;
                y = _y + _height - height
                fn.call(ctx, x, y, width, height);

                ctx.restore();
            }
        }
    },
    arc(x, y, r, startAngle, endAngle, param) {
        const { type = "fill", style, option } = { ...param };
        return {
            x,
            y,
            r,
            startAngle,
            endAngle,
            type,
            style,
            draw: function(ctx, ratio = 1, addParam) {
                const { x, y, r, startAngle, endAngle, type, style } = { ...this };
                const { style: addStyle, option: addOption } = { ...addParam };
                const fn = type !== "fill" ? ctx.stroke : ctx.fill;
                const gap = endAngle - startAngle;
                const mewgeStyle = util.CommonUtil.shallowMerge(style, addStyle);

                ctx.save();
                CanvasUtil.setStyle(ctx, mewgeStyle);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.arc(x, y, r, startAngle, startAngle + gap * ratio);
                fn.call(ctx);
                ctx.closePath();

                ctx.restore();
            }
        };
    },
    circle(x, y, r, param) {
        return CanvasUtil.arc(x, y, r, 0, Math.PI * 2, param);
    },
    text(x, y, str, param) {
        const { type = "fill", style, option } = { ...param };
        return {
            x,
            y,
            type,
            text: str,
            style,
            option,
            getSize: function(ctx, isTransection = false) {
                isTransection === true && ctx.save();
                const mtx = ctx.measureText(this.text);
                const { width, actualBoundingBoxAscent: ba, actualBoundingBoxDescent: bd } = mtx;
                isTransection === true && ctx.restore();
                return {
                    width,
                    height: ba + bd
                };
            },
            draw: function(ctx, param) {
                const { style: addStyle, option: addOption } = { ...param };
                let { x, y, text, style, option } = { ...this };
                option = { ...option, ...addOption };
                const { rotate, position = "lc" } = { ...option };
                const fn = type !== "fill" ? ctx.strokeText : ctx.fillText;

                ctx.save();
                const [horison = "c", vertical = "c"] = [...position];
                
                let baseline;
                if (vertical === "t") {
                    baseline = "bottom";
                } else if (vertical === "b") {
                    baseline = "top";
                } else {
                    baseline = "middle";
                }

                if (rotate) {
                    const radian = rotate / 180 * Math.PI;
                    CanvasUtil.rotate(ctx, x, y, radian);
                }
                CanvasUtil.setStyle(ctx, { ...style, ...addStyle, textBaseline: baseline });
                const size = this.getSize(ctx);
                const { width } = { ...size };

                if (horison === "l") {
                    x -= width;
                } else if (horison === "c") {
                    x -= width / 2;
                }

                fn.call(ctx, text, x, y);

                ctx.restore();
            }
        }
    },
    getTextSize(text, param) {
        publicCtx.save();
        const { style, option } = { ...param };
        const { rotate } = { ...option };
        
        if (rotate) {
            const radian = rotate / 180 * Math.PI;
            CanvasUtil.rotate(publicCtx, 0, 0, radian);
        }

        this.setStyle(publicCtx, style);
        const mtx = publicCtx.measureText(text);
        const { width, actualBoundingBoxAscent: ba, actualBoundingBoxDescent: bd } = mtx;
        publicCtx.restore();
        return {
            width,
            height: ba + bd
        };
    },
    setStyle(ctx, styles) {
        if (util.CommonUtil.isObject(styles)) {
            Object.entries(styles).forEach(([k, v]) => {
                ctx[k] = v;
            });
        }
    },
    rotate(ctx, x, y, radian) {
        ctx.translate(x, y);
        ctx.rotate(radian);
        ctx.translate(-x, -y);
    },
    clear(canvas) {
        const canvasRect = util.StyleUtil.getBoundingClientRect(canvas);
		const { width, height } = canvasRect;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, width, height);        
    }
}

export default CanvasUtil;
