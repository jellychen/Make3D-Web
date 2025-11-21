
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-backdrop-blur';

/**
 * 背景透明
 */
export default class BackdropBlur extends Element {
    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.stopPointerEventPropagation(true);
    }
}

CustomElementRegister(tagName, BackdropBlur);
