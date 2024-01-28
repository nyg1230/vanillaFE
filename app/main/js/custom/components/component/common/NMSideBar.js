/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
import router from "js/core/router/NMRouter.js";
/* component */
/* model */
/* intent */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMSideBar extends NMComponent {
    static get name() {
        return "nm-side-bar";
    }

    get clsName() {
        return NMSideBar.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                --bg-color: var(--grapemist );
                background-color: var(--bg-color);
                position: fixed;
                transition-duration: 1000ms;
                height: 100%;
                padding: 20px 12px;

                &.active {
                    transform: translateX(0%);
                }
                
                &:not(.active) {
                    transform: translateX(-100%);
                }
            }

            .guide-area {
                position: fixed;
                top: 50%;
                left: 100%;
                translate: 0% -50%; 
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <div>
                        <nm-label class="title large" value="menu"></nm-label>
                        <nm-menu class="common" nm-prop="common"></nm-menu>
                        <hr/>
                        <nm-label class="title large" value="account.book" range="account"></nm-label>
                        <nm-menu class="account" nm-prop="account"></nm-menu>
                        <hr/>
                    </div>
                    <div class="guide-area">
                        <nm-icon class="guide-icon" icon="arrow-right-circle" size="30"></nm-icon>
                    </div>
                </div>`;
    }

    get wrapper() {
        return util.DomUtil.querySelector(this, `.${this.clsName}`);
    }

    afterRender() {
        const cmnMenu = util.DomUtil.querySelector(this, ".common");
        cmnMenu && (cmnMenu.$data = [
            { icon: "home", title: "home", range: "", value: "main/body/home" },
        ]);

        const accountMenu = util.DomUtil.querySelector(this, "nm-menu.account");
        accountMenu && (accountMenu.$data = [
            { icon: "home", title: "view.calendar", range: "account", value: "main/body/account/calendar" },
            { icon: "home", title: "view.list", range: "account", value: "main/body/account/list" },
            { icon: "home", title: "add.account", range: "account", value: "main/body/account/add" },
            // { icon: "home", title: "home", range: "", value: "home" },
            // { icon: "home", title: "home", range: "", value: "home" },
        ]);
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.MOUSE_OVER, this.onMouseOver);
        this.bindEvent(this, NMConst.eventName.MOUSE_OUT, this.onMouseOut);
        this.bindEvent(this, NMConst.eventName.SELECT_MENU, this.onSelectMenu);
    }

    onMouseOver(e) {
        this.setActive(true);
        this.setIcon("arrow-left-circle");
    }

    onMouseOut(e) {
        this.setActive(false);
        this.setIcon("arrow-right-circle");
    }

    onSelectMenu(e) {
        const { detail } = e;
        const { property, value } = detail;

        if (util.CommonUtil.isNotEmpty(value)) {
            router.pushState(value);
        }
        console.log(property, value);
    }

    setActive(active) {
        util.DomUtil.enableClass(this.wrapper, "active", active);
    }

    setIcon(icon) {
        const guide = util.DomUtil.querySelector(this, ".guide-icon");
        guide && (guide.icon = icon);
    }
}

define(NMSideBar);
