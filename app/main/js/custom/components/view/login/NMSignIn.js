/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* intent */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMSignIn extends NMView {
    modelList = [];

    static get name() {
        return "nm-sign-in";
    }

    get clsName() {
        return NMSignIn.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                padding: 8px 16px;
                background-color: var(--gray-lilac);
            }

            .input-area {
                display: grid;
                grid-template-columns: auto auto;
                grid-column-gap: 2px;
                grid-row-gap: 4px;

                & .title {
                }

                & .input {
                }

                & nm-input::part(nm-input) {
                    --width: 150px;
                }
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <div class="header-area">
                        <nm-label class="title large" value="signin"></nm-label>
                    </div>
                    <div class="input-area">
                        <div class="title">
                            <nm-label class="" value="account"></nm-label>
                        </div>
                        <div class="input">
                            <nm-input class=""></nm-input>
                        </div>
                        <div class="title">
                            <nm-label class="" value="password"></nm-label>
                        </div>
                        <div class="input">
                            <nm-input type="password" class=""></nm-input>
                        </div>
                    </div>
                    <div class="button-area">
                        <nm-button value="test"></nm-button>
                    </div>
                    <div class="mpre-area">
                        <nm-button value="find.info"></nm-button>
                        <nm-button value="signup"></nm-button>
                    </div>
                </div>`;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
    }

    onClick(e) {
        console.log(e);
    }
}

define(NMSignIn);