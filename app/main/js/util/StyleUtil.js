import * as util from "./utils.js";
import styles from "css/common.css";

const styleSheet = new CSSStyleSheet();
styleSheet.replace(styles);

const StyleUtil = {
    setGlobalStyles(component) {
        component.adoptedStyleSheets.push(styleSheet);
    },
    getBoundingClientRect(dom) {
        let rect;
        if (!dom) {
        } else {
            rect = dom.getBoundingClientRect();
        }

        return rect;
    },
    getHexColorToDecimal(hex) {
        hex = hex.replace(/^\#/, "");
        const [r0, r1, g0, g1, b0, b1] = [...hex];
        const r = parseInt(`${r0}${r1}`, 16);
        const g = parseInt(`${g0}${g1}`, 16);
        const b = parseInt(`${b0}${b1}`, 16);
        const rgb = `${r}, ${g}, ${b}`;
        return rgb
    }
}

export default StyleUtil;
