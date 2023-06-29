import CanvasUtil from "../util/CanvasUtil";
import PieChart from "../chart/PieChart";

export default class CanvasTest {
    #container;

    constructor() {
        const body = document.querySelector("body");
        const div = document.createElement("div");
        div.id = "canvas";
        this.#container = div;

        body.append(this.#container);
        console.log("Canvas Test~");

        const pieChart = new PieChart(this.#container, null, {
            attr: {
                width: 600,
                height: 400,
                style: "border: solid 1px gray;"
            }
        });
        pieChart.setChartData([
            { name: "amy", value: 600 },
            { name: "ban", value: 1500 },
            { name: "charly", value: 800 },
            { name: "deny", value: 1234 },
            { name: "emma", value: 1000 },
        ])
    }
}