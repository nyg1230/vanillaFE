import NMMain from "./custom/js/component/view/NMMain";

window.onload = (e) => {
    const body = document.querySelector("body");

    const main = new NMMain();

    body.appendChild(main);
}
