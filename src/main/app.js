import NMMain from "./custom/js/component/view/NMMain";
import elements from "core/js/customElement/element/elements"

window.onload = (e) => {
    const body = document.querySelector("body");

    const main = new NMMain();

    body.appendChild(main);
}
