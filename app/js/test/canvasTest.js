import CanvasUtil from "../util/CanvasUtil.js";
import PieChart from "../chart/PieChart.js";
import BarChart from "../chart/BarChart.js";

export default class CanvasTest {
    #container;

    constructor() {
        const body = document.querySelector("body");
        const div = document.createElement("div");
        div.id = "canvas";
        this.#container = div;

        body.append(this.#container);
        console.log("Canvas Test~");

        // const pieChart = new PieChart(this.#container, null, {
        //     attr: {
        //         width: 600,
        //         height: 400,
        //         style: "border: solid 1px gray;"
        //     }
        // });
        // pieChart.setChartData([
        //     { name: "amy", value: 200 },
        //     { name: "ban", value: 1500 },
        //     { name: "charly", value: 800 },
        //     { name: "deny", value: 1234 },
        //     { name: "emma", value: 1000 },
        // ]);

		const barChart = new BarChart(this.#container, null, {
			    attr: {
                width: 600,
                height: 400,
                style: "border: solid 1px gray;"
            }
		});
		const barData = [
			{ name: "amy", value: 200 },
            { name: "ban", value: 1500 },
            { name: "charly", value: 800 },
            { name: "deny", value: 1234 },
            { name: "emma", value: 1000 },
		]
		barChart.setChartData(barData);
    }
}