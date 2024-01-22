/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMTagBox extends NMComponent {
    $edit = false;

    static get staticAttrs() {
        return ["editable"];
    }

    static get name() {
        return "nm-tag-box";
    }

    get clsName() {
        return NMTagBox.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                border-radius: 2px;
                background-color: #FFF;
                border: 1px solid black;
                padding: 4px 12px;
                cursor: pointer;
                min-height: 30px;
                overflow: hidden;
                overflow-y: scroll;
            }

            .tag-area {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 4px;
            }

            .input-area {
                display: inline;
                min-width: 0px;
                width: fit-content;
                line-height: 18px;
            }

            [contenteditable] {
                outline: 0px solid transparent;
                caret-color: auto;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <div class="tag-area">
                <slot></slot>
                <div class="input-area"></div>
            </div>
        </div>`;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.KEY_UP, this.onKeyup);
        this.bindEvent(this, NMConst.eventName.KEY_DOWN, this.onKeydown);
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
        this.bindEvent(document.body, NMConst.eventName.MOUSE_DOWN, (e) => {
            const div = util.DomUtil.querySelector(this, ".input-area");
            div.removeAttribute("contenteditable");
        });
    }

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, NMTag.name),
                callback: (tag) => {
                    const icon = util.EventUtil.getDomFromEvent(e, "remove", "class");
                    icon && this.removeTag(tag);
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, NMTagBox.name),
                callback: () => {
                    if (util.CommonUtil.toBoolean(this.editable)) {
                        const div = util.DomUtil.querySelector(this, ".input-area");
                        div.setAttribute("contenteditable", true);
                        window.setTimeout(() => div.focus());

                    }
                }
            }
        ]);
    }

    onKeydown(e) {
        const { keyCode, originalTarget } = e;

        if (keyCode === 13) {
            const txt = originalTarget.textContent;

            if (util.CommonUtil.isNotEmpty(txt)) {
                this.addTag(txt);
                util.DomUtil.removeAllChild(originalTarget);
            }

            e.preventDefault();
            e.stopPropagation();
        }
    }

    afterRender() {
        if (!util.CommonUtil.isArray(this.$data)) {
            this.$data = [];
        }
    }

    setData(data = []) {
        this.clear();
        const frag = document.createDocumentFragment();

        data.forEach((d) => {
            const tag = this.getTag(d);
            frag.appendChild(tag);
        });

        this.appendChild(frag);
    }

    getTag(data) {
        const tag = new NMTag({ removable: this.editable });
        tag.$data = data;
        
        return tag;
    }

    addTag(value) {
        value = value.trim();
        const data = { tag: value };

        const idx = this.$data.findIndex((d) => d.tag === value);

        if (idx < 0) {
            this.$data.push(data);
            const tag = this.getTag(data);
            this.appendChild(tag);
            util.EventUtil.dispatchEvent(this, NMConst.eventName.ADD_TAG, { target: tag });
        }
    }

    removeTag(tag) {
        const idx = this.$data.findIndex((d) => d === tag.$data);

        if (idx > -1) {
            this.$data.splice(idx, 1);
            tag.remove();
            util.EventUtil.dispatchEvent(this, NMConst.eventName.REMOVE_TAG, { target: tag });
        }
    }

    clear() {
        util.DomUtil.removeAllChild(this);
    }
}

class NMTag extends NMComponent {
    static get name() {
        return "nm-tag";
    }

    get clsName() {
        return NMTag.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                display: flex;
                align-items: center;
                border-radius: 4px;
                background-color: var(--bg-color, #DEDEDE);
                color: var(--color, #000);
                padding: 2px 4px;
                height: 20px;
                font-size: 14px;
                font-weight: 400;

                &:hover {
                    & nm-icon {
                        --display: block;
                    }
                }
            }

            nm-icon {
                cursor: pointer;
                display: var(--display, none);
            }
        `;
    }

    get template() {
        return () => `
        <div class="${this.clsName}" part="${this.clsName}">
            # <slot></slot> ${this.removable ? `<nm-icon class="remove" icon="close" size="16"></nm-icon>` : ""}
        </div>`;
    }

    afterRender() {
    }

    setData(data) {
        this.innerHTML = data.tag;
    }
}

define(NMTagBox);
define(NMTag);

export { NMTagBox }
