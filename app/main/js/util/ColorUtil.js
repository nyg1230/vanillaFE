const ColorUtil = {
    getPalette(name) {
        const p = palette[name] ?? palette["rainbow"];
        return p;
    }
};

const palette = {
    rainbow: ["#F00", "#FF8C00", "#FF0", "#008000", "#00F", "#4B0082", "#800800"]
}

export default ColorUtil;
