import * as util from "core/js/util/utils";

let _renderer;
const store = util.StoreUtil.set("template", {}, true);

const TemplateUtil = {
    getRenderer() {
        !_renderer && (_renderer = renderer.obj);
        return _renderer;
    },
    getTemplate(component) {
        const name = component.$name;
        let template = store.get(name);
        
        if (!template) {
            const renderer = this.getRenderer();
            template = renderer.getTemplate(component.template);
            store.set(name, template, false, false);
        }

        return template;
    }
};

const renderer = {
    obj: {
        getTemplate() {
            const pathMapper = {};
            const tagMapper = {};

            this.create();

            return {
                mapper: {
                    path: pathMapper,
                    tag: tagMapper
                },
                html: ""
            };
        },
        create() {
            console.log(this)
        }
    }
};

export default TemplateUtil;