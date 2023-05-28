import CanvasUtil from "../util/CanvasUtil";

export default class CanvasTest {
    #container;

    constructor() {
        const body = document.querySelector("body");
        const div = document.createElement("div");
        div.id = "canvas";
        this.#container = div;

        body.append(this.#container);
        console.log("Canvas Test~");

        const canvas = CanvasUtil.init(this.#container, {
            attr: {
                width: 700,
                height: 400,
                style: "border: solid 1px gray;"
            }
        });
        window.qqq = canvas;
    }
}