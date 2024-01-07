/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMMenu extends NMComponent {
    static get staticAttrs() {
        return ["nm-prop"];
    }

    static get name() {
        return "nm-menu";
    }

    get clsName() {
        return NMMenu.name;
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
        </div>`;
    }

    get wrapper() {
        return util.DomUtil.querySelector(this, `.${this.clsName}`);
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
    }

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, NMMenuItem.name),
                callback: (item) => {
                    const { value } = item.$data;
                    util.EventUtil.dispatchEvent(this, NMConst.eventName.SELECT_MENU, { property: this["nm-prop"], value });

                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        ]);
    }

    setData(data) {
        this.clear();

        data.forEach((d) => {
            const menuItem = new NMMenuItem();
            this.wrapper.appendChild(menuItem);
            menuItem.$data = d;
        })
    }

    setActive(bool) {
        util.DomUtil.enableClass(this, "active", bool);
    }

    clear() {
        util.DomUtil.removeAllChild(this.wrapper);
    }
}

class NMMenuItem extends NMComponent {
    #subMenu;

    static get name() {
        return "nm-menu-item";
    }

    get clsName() {
        return NMMenuItem.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                display: flex;
                align-items: center;
                cursor: pointer;
                background-color: var(--bg-color);
                color: var(--color);
                border-radius: 4px;
                gap: 4px;
                
                &:hover {
                    --bg-color: var(--honey-peach);
                    --color: var(--sun-dried-tomato);
                }
            }

            ${NMMenu.name} {
                display: block;
                overflow: hidden;
                // transition: 1500ms;
                max-height: 0px;
                
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
        this.bindEvent(this, NMConst.eventName.MOUSE_OVER, this.onMouseOver);
        this.bindEvent(this, NMConst.eventName.MOUSE_OUT, this.onMouseOut);
    }

    onMouseOver(e) {
        if (this.#subMenu) {
            this.#subMenu.setActive(true);
        }
    }

    onMouseOut(e) {
        if (this.#subMenu) {
            this.#subMenu.setActive(false);
        }
    }

    setData() {
        this.clear();
        this.setIcon();
        this.setLabel();
        this.setChild();
    }

    setIcon() {
        const { icon, size } = { ...this.$data };

        if (icon) {
            const html = `<nm-icon icon="${icon}" size="${size}"></nm-icon>`;
            util.DomUtil.insertAdjacentHTML(this.wrapper, html);
        }
    }

    setLabel() {
        const { title, range } = { ...this.$data };

        if (title) {
            const html = `<nm-label value="${title}" range="${range}"></nm-icon>`;
            util.DomUtil.insertAdjacentHTML(this.wrapper, html);
        }
    }

    setChild() {
        const { child } = { ...this.$data };

        if (util.CommonUtil.isArray(child)) {
            const subMenu = new NMMenu();
            this.#subMenu = subMenu;
            this.#subMenu.setActive(false);
            this.wrapper.appendChild(this.#subMenu);
            this.#subMenu.$data = child;
        }
    }

    clear() {
        this.#subMenu = null;
        util.DomUtil.removeAllChild(this);
    }
}

define(NMMenu);
define(NMMenuItem);

export { NMMenu };
