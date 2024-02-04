/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

// resize 작업 필요

class NMCarousel extends NMComponent {
    #template;
    #move;
    #increase = 0;

    static get name() {
        return "nm-carousel";
    }

    get clsName() {
        return NMCarousel.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-columns: min-content auto min-content;

                & .skip {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background-color: var(--bg-color, var(--pantone-orchid-ice));
                    cursor: pointer;

                    &:hover {
                        --bg-color: var(--honey-peach);
                    }
                }
                
                & .wrapper {
                    background-color: var(--pantone-bright-white);
                    overflow: hidden;
                    
                    & .container {
                        display: flex;
                        gap: 8px;
                        padding: 4px 12px;
                        width: fit-content;
                        transform: translateX(var(--x-move, 0));
                        transition: 1000ms ease-out;
                    }
                }
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <div class="prev skip">
                <nm-icon class="" icon="chevron-left" size="26"></nm-icon>
            </div>
            <div class="wrapper">
                <div class="container">
                    <slot></slot>
                </div>
            </div>
            <div class="next skip">
                <nm-icon class="" icon="chevron-right" size="26"></nm-icon>
            </div>
        </div>`;
    }

    set $add(data) {
        this.#addData(data);
    }

    get #wrapper() {
        return util.DomUtil.querySelector(this, ".wrapper");
    }

    get #container() {
        return util.DomUtil.querySelector(this, ".container");
    }

    afterRender() { 
        const template = util.DomUtil.querySelector(this, "template", false);
        this.#template = template;
        template.remove();
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.MOUSE_DOWN, this.onMouseDown);
        this.bindEvent(this, NMConst.eventName.MOUSE_UP, this.onMouseUp);
        this.bindEvent(this, NMConst.eventName.REMOVE, this.onRemove);
    }

    onMouseDown(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "next", "class"),
                callback: () => {
                    this.#move = true;
                    this.moveContainer(true);
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "prev", "class"),
                callback: () => {
                    this.#move = true;
                    this.moveContainer(false);
                }
            }
        ]);
    }

    onMouseUp(e) {
        this.#move = false;
    }

    onRemove(e)  {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, NMHorse.name),
                callback: (horse) => {
                    const idx = this.$data.findIndex((d) => d === horse.$data);

                    if (idx > -1) {
                        this.$data.splice(idx, 1);
                        horse.remove();
                    }

                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        ]);
    }

    moveContainer(bool) {
        if (!this.#move) return;

        const wRect = util.StyleUtil.getBoundingClientRect(this.#wrapper);
        const cRect = util.StyleUtil.getBoundingClientRect(this.#container);
        const { left: wl, right: wr, width: ww } = wRect;
        const { left: cl, right: cr, width: cw } = cRect;

        let isOver;
        let gap;
        const increase = +100;
        if (bool) {
            gap = cr - wr;
            isOver = gap > 0;

            if (gap < increase) {
                this.#increase = ww - cw;
            } else {
                this.#increase -= increase;
            }
        } else {
            gap = wl - cl;
            isOver = gap > 0;

            if (gap < increase) {
                this.#increase = 0;
            } else {
                this.#increase += increase;
            }
        }

        if (isOver) {
            this.#container.style = `--x-move: ${this.#increase}px;`;
            util.CommonUtil.debounce(this, "moveContainer", [bool], 0);
        }
    }

    #addData(data) {
        if (!util.CommonUtil.isArray(data)) {
            data = [data];
        }

        data.forEach((d) => {
            const horse = this.#getHorse(d);
            this.$data.push(d);
            this.appendChild(horse);
        });
    }

    setData(data = []) {
        const frag = document.createDocumentFragment();

        data.forEach((d) => {
            const horse = this.#getHorse(d);
            frag.appendChild(horse);
        });

        this.appendChild(frag);
    }

    #getHorse(data) {
        const horse = new NMHorse();
        const node = document.importNode(this.#template.content, true);
        horse.appendChild(node);
        horse.$data = data;

        return horse;
    }

    destroy() {
        this.#template = null;
        super.destroy();
    }
}

class NMHorse extends NMComponent {
    static get name() {
        return "nm-horse";
    }

    get clsName() {
        return NMHorse.name;
    }

    get styles() {
        return ``;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <slot></slot>
        </div>`;
    }

    afterRender() {
        util.EventUtil.dispatchEvent(this, NMConst.eventName.ADD_CHILD_COMP, { target: this });
    }

    setData(data) {
        this.setPropertyData(data, false);
    }
}

define(NMCarousel);
define(NMHorse);

export { NMCarousel };
