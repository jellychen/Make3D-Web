
/**
 * 元素构建
 */
export default class ElementDomCreator {
    /**
     * 元素
     */
    #html;
    #css;
    #cached_tpl;

    /**
     * 
     * 创建构建器
     * 
     * @param {*} html 
     * @param {*} css 
     * @returns 
     */
    static createTpl(html, css) {
        const creator = new ElementDomCreator();
        creator.#html = html;
        creator.#css  = css;
        return creator;
    }

    /**
     * 获取Dom元素
     */
    __dom__() {
        if (undefined == this.#cached_tpl) {
            let tpl = document.createElement('template');
            let str = undefined;
            if (undefined != this.#css) {
                const css_str = this.#css.toString();
                str = `<style>${css_str}</style>` + this.#html;
            } else {
                str = this.#html;
            }
            tpl.innerHTML = str;
            
            this.#html       = undefined;
            this.#css        = undefined;
            this.#cached_tpl = tpl;
        }
        return this.#cached_tpl.content;
    }
}
