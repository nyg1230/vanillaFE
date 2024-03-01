import * as util from "core/js/util/utils";
import { Component } from "core/js/customElement/Component";

let _renderer;
const store = util.StoreUtil.set("template", {}, true);

const TemplateUtil = {
    getRenderer() {
        !_renderer && (_renderer = renderer.obj);
        return _renderer;
    },
    getTemplate(component) {
        // const name = component.$name;
        // let template = store.get(name);
        
        // if (!template) {
        //     const renderer = this.getRenderer();
        //     template = renderer.getTemplate(component);
        //     store.set(name, template, false, false);
        // } else {
        //     console.log(template)
        // }
        window.qqq = store;
        const renderer = this.getRenderer();
        const template = renderer._create(component);

        return template;
    }
};

const renderer = {
    obj: {
        _create(component) {
            const { $name: name, template } = component;
            let mapper = store.get(name);

            if (!mapper) {
                mapper = this.createMapper(template);
                store.set(name, mapper);
            }

            const result = this.setElement(mapper);

            return result;
        },
        createMapper(template, path = "0") {
            const { tag, attr = {}, children = [] } = template;

            const mapper = {
                subscribe: {},
                tree: {
                    [path]: {
                        element: tag
                    }
                }
            };

            if (util.CommonUtil.isNotEmpty(children)) {
                const target = [];
                mapper.tree[path].children = target;

                children.forEach((childTemplate, cPath) => {
                    const childMapper = this.createMapper(childTemplate, `${path}|${cPath}`);
                    target.push(childMapper);
                });
            }

            return mapper;
        },
        setElement(mapper) {
            const newMapper = util.CommonUtil.deepCopy(mapper);

            const frag = document.createDocumentFragment();

            const { subscribe, tree } = newMapper;
            const [root] = [...Object.values(tree)];
            const { element, children } = root;

            if (util.CommonUtil.isString(element)) {
                root.element = document.createElement(element);
            }

            frag.appendChild(root.element);

            if (util.CommonUtil.isNotEmpty(children)) {
                children.forEach((childMapper) => {
                    const { frag } = this.setElement(childMapper);
                    root.element.appendChild(frag);
                });
            }

            return {
                frag,
                mapper: newMapper
            }
        },
        getTemplate(component) {
            const { template, $oid } = component;
            const reuslt = this.create(template);

            return reuslt;
        },
        create(template, path = 0, rootMapper) {
            window.qqq = store;
            const { tag, attr = {}, children = [] } = { ...template };

            const frag = document.createDocumentFragment();
            let element;

            if (util.CommonUtil.isString(tag)) {
                element = document.createElement(tag);
            }
            frag.appendChild(element);

            const mapper = {
                attr: {},
                [path]: {
                    element: tag,
                    children: []
                }
            };
            const _mapper = rootMapper || mapper;

            if (util.CommonUtil.isNotEmpty(attr)) {
                Object.entries(attr).forEach(([k, v]) => {
                    let value;
                    if (util.CommonUtil.isFunction(v)) {
                        value = v();

                        !_mapper.attr[k] && (_mapper.attr[k] = []);
                        _mapper.attr[k].push([path, v]);
                    } else {
                        value = v
                    }

                    element.setAttribute(k, value)
                });
            }

            const isComponent = element instanceof Component;

            children.forEach((childTemplate, cIdx) => {
                const child = this.create(childTemplate, `${path}|${cIdx}`, isComponent ? mapper : rootMapper);
                const { frag: cFrag, mapper: cMapper } = { ...child };
                element.appendChild(cFrag);
            
                mapper[path].children[cIdx] = cMapper;
            });

            return { frag, mapper };
        },
        getFragment() {}
    }
};

export default TemplateUtil;