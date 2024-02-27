import { Component, define } from "../../../../core/js/customeELement/Component";

export default class NMMain extends Component {
    static get TAG_NAME() {
        return "nm-main";
    }

    get $$options() {
        return {
            test: true,
            qqq: { q: 1, w: [1,2,3,] }
        }
    }
}

define(NMMain);
