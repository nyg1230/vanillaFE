/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
import router from "js/core/router/NMRouter.js";
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
                width: fit-content;
                display: block;
                padding: 8px 16px;
                background-color: var(--almond-peach);
            }

            .input-area {
                display: grid;
                grid-template-columns: auto auto;
                grid-column-gap: 2px;
                grid-row-gap: 4px;
                padding-bottom: 4px;
                row-gap: 2px;
                column-gap: 4px;

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
                padding-bottom: 4px;
            }

            .more-area {
                display: flex;
                justify-content: center;
                gap: 4px;
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
                            <nm-input nm-prop="account" class=""></nm-input>
                        </div>
                        <div class="title">
                            <nm-label class="" value="password"></nm-label>
                        </div>
                        <div class="input">
                            <nm-input nm-prop="password" type="password" class=""></nm-input>
                        </div>
                    </div>
                    <div class="button-area">
                        <nm-button class="signin" value="signin"></nm-button>
                    </div>
                    <div class="more-area">
                        <nm-button class="find-info" value="find.info"></nm-button>
                        <nm-button class="signup" value="signup"></nm-button>
                    </div>
                </div>`;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
        this.bindEvent(this, NMConst.eventName.KEY_UP, this.onKeyUp)
    }

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "nm-button"),
                callback: (btn) => {
                    if (util.DomUtil.hasClass(btn, "signin")) {
                        this.signIn();
                    } else if (util.DomUtil.hasClass(btn, "signup")) {
                        this.goSignUp();
                    }
                }
            }
        ]);
    }

    onKeyUp(e) {
        const { keyCode } = e;

        if (keyCode === 13) {
            this.signIn();
        }
    }

    goSignUp() {
        router.pushState("main/login/signup");
    }

    signIn() {
        const info = NMUserModel.get();
        signInIntent.doSignIn();
    }

    onModelChange(e) {
        const { detail } = e;
        const { name, property, data } = detail;

        if (name === NMUserModel.name) {
            if (property === "login") {
                const { data: info, state } = { ...data };
                console.log(data, state);
                if (state) {
                    NMUserModel.clear();
                    NMUserModel.set("user", data);
                    router.init();
                } else {
                    alert(JSON.stringify(info));
                }
            }
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

    destroy() {
        super.destroy();
    }
}

define(NMSignIn);