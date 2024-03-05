import * as util from "core/js/util/utils";
import { Component } from "core/js/customElement/Component";

let _renderer;
const store = util.StoreUtil.set("template", {}, true);

const TemplateUtil = {
    getRenderer() {
        !_renderer && (_renderer = renderer.obj);
        return _renderer;
    },
    getMapper(component) {
        const renderer = this.getRenderer();
        const { $name: name, template } = component;
        let mapper = store.get(name);

        if (!mapper) {
            mapper = this.createMapper(template);
            store.set(name, mapper);
        }

        const _mapper = util.CommonUtil.deepCopy(mapper);
        return renderer.setElement(_mapper);
    },
    createMapper(template, createElement = false) {
        const renderer = this.getRenderer();
        const mapper = renderer.createMapper(template);
        let result;

        if (createElement === true) {
            result = renderer.setElement(mapper);
        } else {
            result = mapper;
        }

        return result
    }
};

const renderer = {
    obj: {
        create(component) {
            const { $name: name, template } = component;
            let mapper = store.get(name);

            if (!mapper) {
                mapper = this.createMapper(template);
                store.set(name, mapper);
            }

            const result = this.setElement(util.CommonUtil.deepCopy(mapper));

            return result;
        },
        createMapper(template, path = "0", subscribe) {
            const { tag, attrs = {}, children = [], proxy, template: _template } = template;

            const mapper = {
                subscribe: {
                    attrs: {},
                    proxy: {}
                },
                attrs: attrs,
                tree: {
                    [path]: {
                        element: tag
                    }
                },
                template: _template
            };

            if (util.CommonUtil.isNotEmpty(children)) {
                const target = [];
                mapper.tree[path].children = target;

                const rootSubscribe = subscribe || mapper.subscribe;

                children.forEach((childTemplate, cPath) => {
                    const childPath = `${path}|${cPath}`;
                    if (util.CommonUtil.isNotEmpty(proxy)) {
                        rootSubscribe.proxy[childPath] = proxy;
                    }
                    const childMapper = this.createMapper(childTemplate, childPath, rootSubscribe);
                    target.push(childMapper);
                });
            }

            return mapper;
        },
        setElement(mapper, rootSubscribe) {
            const frag = document.createDocumentFragment();

            const { subscribe, attrs, tree, template } = mapper;
            const [treeRoot] = Object.entries(tree);
            const [path, root] = treeRoot;
            const { element, children } = root;
            delete mapper.attrs;
            let elem;

            if (util.CommonUtil.isString(element)) {
                elem = document.createElement(element);
            } else {
                elem = new element();
            }

            root.element = elem;
            elem.$template = template;

            const targetSubscribe = rootSubscribe || subscribe;
            const proxyKey = util.CommonUtil.find(targetSubscribe, ["proxy", path]);

            if (proxyKey) {
                delete targetSubscribe.proxy[path];
                
                const targetList = util.CommonUtil.find(targetSubscribe, ["proxy", proxyKey]);
                if (targetList) {
                    targetList.push(elem);
                } else {
                    targetSubscribe.proxy[proxyKey] = [elem];
                }
            }

            const isComponenet = elem instanceof Component;

            if (util.CommonUtil.isNotEmpty(attrs) && !isComponenet) {

                Object.entries(attrs).forEach(([k, v]) => {
                    let attr;
                    if (util.CommonUtil.isFunction(v)) {
                        attr = v();

                        let list;
                        if (!util.CommonUtil.find(targetSubscribe, ["attrs", k])) {
                            util.CommonUtil.deepMerge(targetSubscribe, { attrs: { [`${k}`]: [] } });
                        }
                        list = util.CommonUtil.find(targetSubscribe, ["attrs", k]);

                        list.push([elem, v]);
                    } else {
                        attr = v;
                    }
                    elem.setAttribute(k, attr);
                });
            }

            root.element = elem;
            frag.appendChild(elem);

            if (util.CommonUtil.isNotEmpty(children)) {
                children.forEach((childMapper) => {
                    const { frag } = this.setElement(childMapper, isComponenet ? null : rootSubscribe || subscribe);
                    elem.appendChild(frag);
                });
            }

            return {
                frag,
                mapper: mapper
            }
        }
    }
};

export default TemplateUtil;