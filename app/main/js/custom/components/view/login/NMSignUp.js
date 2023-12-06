/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
import router from "js/core/router/NMRouter.js";
/* component */
/* model */
import NMUserModel from "js/custom/model/user/NMUserModel.js";
/* intent */
import signUpIntent from "js/custom/intent/sign/NMSignUpIntent.js"
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMSignUp extends NMView {
    modelList = [NMUserModel];

    static get name() {
        return "nm-sign-up";
    }

    get clsName() {
        return NMSignUp.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                width: fit-content;
                display: block;
                padding: 8px 16px;
                background-color: var(--gray-lilac);
            }

            .title-area {
                padding-bottom: 12px;
            }

            .register-area {
                display: grid;
                grid-template-columns: auto auto;
                padding-bottom: 12px;
                column-gap: 4px;
                row-gap: 2px;

                & .enter-area {
                    display: flex;
                }
            }

            .button-area {
                display: flex;
                justify-content: center;
                gap: 4px;
            }

            nm-input::part(nm-input) {
                --width: 150px;
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <div class="title-area">
                        <nm-label class="title large" value="signup" range=""></nm-label>
                    </div>
                    <div class="register-area">
                        <div class="name-area">
                            <nm-label class="subtitle medium" value="account"></nm-label>
                        </div>
                        <div class="enter-area">
                            <nm-input nm-prop="account"></nm-input>
                        </div>
                        <div class="name-area">
                            <nm-label class="subtitle medium" value="password"></nm-label>
                        </div>                                           
                        <div class="enter-area">
                            <nm-input type="password" nm-prop="password"></nm-input>
                        </div>
                        <div class="name-area">
                            <nm-label class="subtitle medium" value="password.check"></nm-label>
                        </div>
                        <div class="enter-area">
                            <nm-input type="password" nm-prop="password.check"></nm-input>
                        </div>
                        <div class="name-area">
                            <nm-label class="subtitle medium" value="email"></nm-label>
                        </div>
                        <div class="enter-area">
                            <nm-input nm-prop="e-account"></nm-input>
                            @
                            <nm-input nm-prop="e-domain"></nm-input>
                        </div>
                        <div></div>
                        
                    </div>
                    <div class="button-area">
                        <nm-button class="register" value="signup"></nm-button>
                        <nm-button class="back" value="back"></nm-button>
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
                    if (util.DomUtil.hasClass(btn, "register")) {
                        this.register();
                    } else if (util.DomUtil.hasClass(btn, "back")) {
                        this.goSignIn();
                    }
                }
            }
        ]);
    }

    register() {
        signUpIntent.register();
    }

    goSignIn() {
        router.pushState("main/login/signin");
    }

    onValueChange(e) {
        const { detail } = e;
        const { property, type, value } = detail;

        if (property === "account") {
            signUpIntent.setInfo("account", value);
        } else if (property === "password") {
            signUpIntent.setInfo("password", value);
        } else if (property === "e-account") {
            signUpIntent.setInfo(["email", "account"], value);
        } else if (property === "e-domain") {
            signUpIntent.setInfo(["email", "doamin"], value);
        } else if (property === "password.check") {
            signUpIntent.checkPassword(value);
        }
    }
}

define(NMSignUp);