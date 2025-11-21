
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-collapsible-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-scene-tree-collapsible';

/**
 * 折叠按钮
 */
export default class TreeCollapsible extends Element {
    /**
     * 元素
     */
    #icon;
    #on_status_changed_callback;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#icon = this.getChild('#icon');
        this.onclick = (event) => {
            this.setFolded(!this.isFolded());
            event.stopPropagation();
        };
    }

    /**
     * 
     * 判断当前的状态是不是折叠
     * 
     * @returns 
     */
    isFolded() {
        return 'true' === this.#icon.getAttribute('folded');
    }

    /**
     * 
     * 设置折叠的状态
     * 
     * @param {Boolean} folded 
     */
    setFolded(folded) {
        const current = this.isFolded();
        if (folded === current) {
            return;
        }

        if (true === folded) {
            this.#icon.setAttribute('folded', 'true');
        } else {
            this.#icon.setAttribute('folded', 'false');
        }

        // 调用回调
        if (this.#on_status_changed_callback) {
            this.#on_status_changed_callback(folded);
        }

        // 发送事件
        this.dispatchUserDefineEvent('changed', {
            folded: folded
        });
    }

    /**
     * 判断当前的状态是不是折叠
     */
    get folded() {
        return this.isFolded();
    }

    /**
     * 设置折叠的状态
     */
    set folded(value) {
        this.setFolded(value);
    }

    /**
     * 获取状态回调
     */
    get onstatuschanged() {
        return this.#on_status_changed_callback;
    }

    /**
     * 设置状态回调
     */
    set onstatuschanged(callback) {
        this.#on_status_changed_callback = callback;
    }
}

CustomElementRegister(tagName, TreeCollapsible);
