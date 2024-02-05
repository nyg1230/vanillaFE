import * as util from "js/core/util/utils.js";

const corrValue = [10, 20, 30];

const ColorUtil = {
    getPalette(name) {
        const p = palette[name] ?? palette["rainbow"];
        return p;
    },
    getPaletteColor(name, idx) {
        const p = ColorUtil.getPalette(name);
        const len = p.length;
        const num = util.CommonUtil.floor(idx / len, 0);
        const mod = util.CommonUtil.modulo(idx, len);

        let color = p[mod].replace("#", "");
        const reg = new RegExp(`.{${color.length / 3}}`, "g");
        const tmp = color.match(reg);

        color = "";
        tmp.forEach((v, idx) => {
            v = v.length === 1 ? `${v}${v}` : v;
            const dec = parseInt(v, 16);
            const corr = corrValue[idx];
            const result = util.CommonUtil.modulo(dec - corr * num, 256);
            color += result.toString(16).padStart(2, "0");
        });

        return `#${color}`;
    }
};

const palette = {
    rainbow: ["#F00", "#FF8C00", "#FF0", "#008000", "#00F", "#4B0082", "#800080"],
    pantone: ["#1E4477", "#325B63", "#848283", "#F4F9FF", "E0D0DB"],
    2023: ["#BE3455", "#EFD1C6", "#ECD5B8", "#D4CACD", "#BFAF92", "#B7A990", "#B4B5A5", "#BFCAD6"],
    2024: ["#CA848A", "#FFBE98", "#964F4C", "#A78C7B", "#D8C8BD", "#85677B", "#C5A253"]
}

export default ColorUtil;
