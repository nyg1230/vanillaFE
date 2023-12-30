/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
import router from "js/core/router/NMRouter.js";
import UserContext from "js/config/user/UserContext.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMHeader extends NMComponent {
    static get observedAttributes() {
        return [];
    }

    static get name() {
        return "nm-header";
    }

    get clsName() {
        return NMHeader.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                display: flex;
                justify-content: space-between;
                --bg-color: var(--peach-fuzz);
                // --color: var(--sun-dried-tomato);
                background-color: var(--bg-color);
                color: var(--color);
                padding: 4px 8px;

                .left {
                    display: flex;
                }

                .right {
                    display: flex;
                    gap: 4px;
                }
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <div class="left">
                        <nm-icon icon="home" size="26"></nm-icon>
                    </div>
                    <div class="right">
                        <nm-label class="user-label" value="welcome-user"></nm-label>
                        <nm-pulldown class="menu" nm-prop="menu"></nm-pulldown>
                    </div>
                </div>`;
    }

    afterRender() {
        const label = util.DomUtil.querySelector(this, ".user-label");
        const user = UserContext.getUser();
        const { nickname } = { ...user };
        label.param = nickname;

        const userMenu = util.DomUtil.querySelector(this, ".menu");
        userMenu.$data = {
            title: "",
            range: "",
            icon: "user",
            size: 24,
            menu: [
                { icon: "profile", title: "my.profile", range: "", value: "myProfile" },
                { icon:"setting", title: "setting", range: "", children: [
                    { title: "test000", range: "", value: "t0" },
                    { title: "test999", range: "", value: "t9" }
                ] },
                { icon: "logout", title: "logout", range: "", value: "logout" }
            ]
        };
    }

    onValueChange(e) {
        const { detail } = e;
        const { property, value } = { ...detail };

        if (property === "menu") {
            if (value === "myProfile") {
            } else if (value === "logout") {
                this.logout();
            }
        }
    }

    logout() {
        util.store.removeLocalStorage(NMConst.header.token);
        router.init();
    }
}

define(NMHeader);
