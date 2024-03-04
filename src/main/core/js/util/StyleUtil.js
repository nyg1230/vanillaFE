import styles from "core/css/main.css";

// const globalStyle = new CSSStyleSheet();
// globalStyle.replace(styles);

const StyleUtil = {
    setGlobalStyle(target) {
        try {
            target.adoptedStyleSheets.push(globalStyle);
        } catch {}
    },

    toStyleSheet(text) {
        let sheet;

        try {
            sheet = new CSSStyleSheet();
            sheet.replace(text);
        } catch {}

        return sheet;
    }
};

const globalStyle = StyleUtil.toStyleSheet(styles);

export default StyleUtil;
