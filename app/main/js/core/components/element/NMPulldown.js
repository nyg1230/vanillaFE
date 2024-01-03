/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMPulldown extends NMComponent {
    #menu;
    #value;

    static get staticAttrs() {
        return ["nm-prop"];
    }

    static get name() {
        return "nm-pulldown";
    }

    get clsName() {
        return NMPulldown.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                border-radius: 4px;
                background-color: var(--bg-color);
                // color: var(--color);

                &.active {
                    --bg-color: var(--peach-fuzz);
                    cursor: pointer;
                }
            }

            nm-icon::part(nm-icon) {
            }

            ${NMPulldownMenu.name} {
                top: var(--t);
                left: var(--l);
                right: var(--r);
                bottom: var(--b);

                overflow: hidden;
                transition: 1500ms;
                max-height: 0px;

                position: fixed;

                &.active {
                    max-height: 100%;
                }
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
        </div>`;
    }

    get wrapper() {
        return util.DomUtil.querySelector(this, `.${this.clsName}`);
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
        this.bindEvent(this, NMConst.eventName.MOUSE_ENTER, this.onMouseEnter);
        this.bindEvent(this, NMConst.eventName.MOUSE_OUT, this.onMouseOut);
        this.bindEvent(this, NMConst.eventName.TOUCH_START, this.onMouseEnter);
        this.bindEvent(document.body, NMConst.eventName.TOUCH_START, this.onMouseOut);
    }

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, NMPulldownMenuItem.name),
                callback: (item) => {
                    const { value } = { ...item.$data };
                    const old = this.#value;
                    this.#value = value;
                    const p = { property: this["nm-prop"], value, target: this };
                    util.EventUtil.dispatchEvent(this, NMConst.eventName.VALUE_CHANGE, p);
                    this.setActiveMenu(false);
                }
            }
        ]);
    }

    onMouseEnter(e) {
        this.setActiveMenu(true);
        this.setPosition();

        e.preventDefault();
        e.stopPropagation();
    }

    onMouseOut() {
        this.setActiveMenu(false);
        // this.resetPosition();
    }

    setData(data) {
        this.clear();
        this.setIcon();
        this.setLabel();
        this.setMenu();
    }

    setIcon() {
        const { icon, size } = { ...this.$data };

        if (icon) {
            util.DomUtil.insertAdjacentHTML(this.wrapper, `<nm-icon icon="${icon}" size="${size}"></nm-icon>`);
        }
    }

    setLabel() {
        const { title, range } = { ...this.$data };

        if (title) {
            const html = `<nm-label class="" value="${title}" range="${range}"></nm-label>`;
            util.DomUtil.insertAdjacentHTML(this.wrapper, html);
        }
    }

    setMenu() {
        const { menu } = { ...this.$data };

        this.#menu = new NMPulldownMenu();
        this.wrapper.appendChild(this.#menu);
        this.#menu.$data = menu;
    }

    setPosition() {
        if (!this.#menu) return;
        this.#menu.style = ""

        const rect = util.StyleUtil.getBoundingClientRect(this);
        const bRect = util.StyleUtil.getBoundingClientRect(document.body);
        const mRect = util.StyleUtil.getBoundingClientRect(this.#menu);

        let style = "";

        if (mRect.width <= bRect.width) {
           if (mRect.right > bRect.right) {
                style += `--r: 0px;`;
           } 
        }

        if (mRect.height <= bRect.height) {
            if (mRect.bottom > bRect.bottom) {
                style += `--b: ${rect.top}`;
            }
        }

        style && (this.#menu.style = style);
    }

    resetPosition() {
        this.#menu && (this.#menu.style = "");
    }

    setActiveMenu(bool) {
        util.DomUtil.enableClass(this.wrapper, "active", bool);
        this.#menu && this.#menu.setActive(bool);
    }

    clear() {
        util.DomUtil.removeAllChild(this.wrapper);
        this.#menu = null;
    }
}

class NMPulldownMenu extends NMComponent {
    static get name() {
        return "nm-pulldown-menu";
    }

    get clsName() {
        return NMPulldownMenu.name;
    }

    get styles() {
        return `
            .${this.clsName} {
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <slot></slot>
        </div>`
    }

    setData(data = []) {
        data.forEach((d) => {
            const menuItem = new NMPulldownMenuItem();
            this.appendChild(menuItem);
            menuItem.$data = d;
        });
    }

    setActive(bool) {
        util.DomUtil.enableClass(this, "active", bool);
    }
}

class NMPulldownMenuItem extends NMComponent {
    static get name() {
        return "nm-pulldown-menu-item";
    }

    get clsName() {
        return NMPulldownMenu.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                display: flex;
                padding: 2px 4px;
                background-color: var(--bg-color);
                --bg-color: var(--pristine);
                --color: black;
                color: var(--color);
                border-radius: 2px;
                align-items: center;

                &:hover {
                    --bg-color: var(--peach-pink);
                    --color: var(--pantone-bright-white);
                }

                & nm-icon {
                    margin-right: 4px;
                }
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
        </div>`;
    }

    get wrapper() {
        return util.DomUtil.querySelector(this, `.${this.clsName}`);
    }

    setData(data) {
        const { icon, title, value, range } = { ...data };

        let html = "";
        icon && (html += this.getIcon(icon));
        html += this.getLabel(title, range);

        util.DomUtil.insertAdjacentHTML(this.wrapper, html);
    }

    getIcon(icon) {
        return `<nm-icon class="" icon="${icon}"></nm-icon>`;
    }

    getLabel(title, range) {
        return `<nm-label class="" value="${title}" range="${range}"></nm-label>`;
    }
}

define(NMPulldown);
define(NMPulldownMenu);
define(NMPulldownMenuItem);

export { NMPulldown };