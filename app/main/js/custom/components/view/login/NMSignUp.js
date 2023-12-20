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
                    gap: 4px;
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
                            <nm-button value="double.check" name="doubleCheck"></nm-button>
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
                            <nm-label class="subtitle medium" value="nickname"></nm-label>
                        </div>
                        <div class="enter-area">
                            <nm-input nm-prop="nickname"></nm-input>
                        </div>
                        <div class="name-area">
                            <nm-label class="subtitle medium" value="sex"></nm-label>
                        </div>
                        <div class="enter-area">
                            <nm-radio type="radio" nm-prop="sex" class="radio"></nm-radio>
                        </div>
                        <div class="name-area">
                            <nm-label class="subtitle medium" value="email"></nm-label>
                        </div>
                        <div class="enter-area">
                            <nm-input nm-prop="e-account"></nm-input>
                            @
                            <nm-input nm-prop="e-domain"></nm-input>
                        </div>
                    </div>
                    <div class="button-area">
                        <nm-button name="register" value="signup"></nm-button>
                        <nm-button name="back" value="back"></nm-button>
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
                    const name = btn.name;
                    if (name === "register") {
                        this.register();
                    } else if (name === "back") {
                        this.goSignIn();
                    } else if (name === "doubleCheck") {
                        this.doubleCheck();
                    }
                }
            }
        ]);
    }

    afterRender() {
        super.afterRender()
        const radio = util.DomUtil.querySelector(this, ".radio");
        radio.$data = [
            { title: "male", value: "m" },
            { title: "female", value: "f" }
        ];
    }

    register() {
        this.vaildCheck() && signUpIntent.register();
    }

    goSignIn() {
        router.pushState("main/login/signin");
    }

    vaildCheck() {
        const data = NMUserModel.get("signup") || {};
        let vaild = false;

        if (!data.doubleCheck) {
            alert("u need double check");
        } else if (!data.pwd) {
            alert("pwd is not valid");
        } else if (!data.pwdCheck) {
            alert("pwd is not same");
        } else if (!data.nickname) {
            alert("nickname is not valid");
        } else if (!data.sex) {
            alert("sex is not check");
        } else {
            vaild = true;
        }

        return vaild;
    }

    doubleCheck() {
        const data = NMUserModel.get("signup");
        const { account } = { ...data };

        if (util.CommonUtil.isEmpty(account)) {
            alert("account is empty");
        } else {
            signUpIntent.doubleCheck();
        }
    }

    onModelChange(e) {
        const { detail } = e;
        const { name, property, data } = { ...detail };

        if (name === NMUserModel.name) {
            if (property === "account") {
                signUpIntent.setInfo("doubleCheck", false);
            } else if (property === "duplicate") {
                if (data) {
                    alert("is duplicate");
                } else {
                    alert("enable account")
                }

                signUpIntent.setInfo("doubleCheck", !data);
            }
        }
    }

    onValueChange(e) {
        const { detail } = e;
        const { property, type, value } = detail;

        if (property === "account") {
            signUpIntent.setInfo("account", value);
        } else if (property === "password") {
            signUpIntent.setInfo("pwd", value);
        } else if (property === "e-account") {
            signUpIntent.setInfo(["email", "account"], value);
        } else if (property === "e-domain") {
            signUpIntent.setInfo(["email", "domain"], value);
        } else if (property === "password.check") {
            signUpIntent.checkPassword(value);
        } else if (property === "sex") {
            signUpIntent.setInfo("sex", value);
        } else if (property === "nickname") {
            signUpIntent.setInfo("nickname", value);
        }
    }
}

define(NMSignUp);