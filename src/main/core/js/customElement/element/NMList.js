import { Component, define } from "core/js/customElement/Component";
import * as util from "core/js/util/utils";

class NMList extends Component {
    #rows = [];

    static get observedAttributes() { return []; }

    static get TAG_NAME() { return "nm-list"; }


    get template() {
        return {
            tag: "div",
            attrs: {
                class: this.$name,
                part: this.$name
            },
            children: [
                {
                    tag: "slot"
                }
            ]
        }
    };

    initProxy() {
        return {
            list: ["test"],
            test: {
                aaa: 123,
                bbb: [123, { aa: 1, b: [123, 123]}]
            }
        };
    }

    afterRender() {
        !window.zzz && (window.zzz = this);
    }

    setData(data) {
        const tmp = document.createDocumentFragment();

        data.forEach((d) => {
            const row = util.TemplateUtil.createMapper(this.$template, true);
            const { frag } = { ...row };

            tmp.appendChild(frag);
            this.#rows.push(row);
        });

        this.appendChild(tmp);
    }
}

class NMRow extends Component {
    static get TAG_NAME() { return "nm-row"; }

    get template() {
        return {
            tag: "div",
            attrs: {
                class: this.$name,
                part: this.$name
            },
            children: [
                { tag: "slot" }
            ]
        }
    }
}

define(NMList);
define(NMRow)

export default { NMList, NMRow, define };
