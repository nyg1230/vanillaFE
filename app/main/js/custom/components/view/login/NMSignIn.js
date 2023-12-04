/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
import NMUserModel from "js/custom/model/user/NMUserModel.js";
/* intent */
import signInIntent from "js/custom/intent/sign/NMSignInIntent.js"
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMSignIn extends NMView {
    modelList = [NMUserModel];

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

            .button-area {
                display: flex;
                justify-content: center;
            }

            .mpre-area {
                display: flex;
                justify-content: center;
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
                            <nm-input name="account" class=""></nm-input>
                        </div>
                        <div class="title">
                            <nm-label class="" value="password"></nm-label>
                        </div>
                        <div class="input">
                            <nm-input name="password" type="password" class=""></nm-input>
                        </div>
                    </div>
                    <div class="button-area">
                        <nm-button class="signin" value="signin"></nm-button>
                    </div>
                    <div class="mpre-area">
                        <nm-button class="find-info" value="find.info"></nm-button>
                        <nm-button class="signup" value="signup"></nm-button>
                    </div>
                </div>`;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
    }

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "nm-button"),
                callback: (btn) => {
                    if (util.DomUtil.hasClass(btn, "signin")) {
                        this.signIn();
                    }
                }
            }
        ]);
    }

    signIn() {
        const info = NMUserModel.get();
        console.log(info);
        signInIntent.doSignIn();
    }

    onModelChange(e) {
        const { detail } = e;
        const { name, property, value } = detail;

        if (NMUserModel.name === name) {
            console.log(e);
        }
    }

    onValueChange(e) {
        const { detail } = e;

        const { property, type, value } = detail;

        if (property === "account") {
            signInIntent.setAccount(value);
        } else if (property === "password") {
            signInIntent.setPassword(value);
        }
    }
}

define(NMSignIn);