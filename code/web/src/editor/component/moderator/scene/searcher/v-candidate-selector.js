/* eslint-disable no-unused-vars */

import isArray                            from 'lodash/isArray';
import isFunction                         from 'lodash/isFunction';
import ComputePosition                    from '@common/misc/compute-position';
import CustomElementRegister              from '@ux/base/custom-element-register';
import Element                            from '@ux/base/element';
import ElementDomCreator                  from '@ux/base/element-dom-creator';
import SceneSearcherCandidateSelectorCell from './v-candidate-cell';
import Html                               from './v-candidate-selector.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-r-scene-searcher-candidate';

/**
 * 搜索候选词
 */
export default class SceneSearcherCandidateSelector extends Element {
    /**
     * 元素
     */
    #container;

    /**
     * 选中
     */
    #selected_index = -1;

    /**
     * 事件回调
     */
    #on_dismiss = (event) => this.#onDismiss(event);

    /**
     * 回调
     */
    onselected = undefined;
    ondismiss  = undefined;
    

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
        this.#container = this.getChild('#container');
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerup", this.#on_dismiss);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerup", this.#on_dismiss);
    }

    /**
     * 
     * 设置数据
     * 
     * @param {array} data 
     */
    setCandidate(data) {
        if (!isArray(data)) {
            return;
        }

        let children = this.#container.childNodes;
        while (children.length > 0) {
            children[0].remove();
        }

        this.#selected_index = -1;

        for (let i of data) {
            let cell = new SceneSearcherCandidateSelectorCell(this);
            cell.setData(i);
            this.#container.appendChild(cell);
        }
    }

    /**
     * 
     * 动态摆放
     * 
     * @param {*} reference_element 
     * @param {*} placement 
     * @param {*} offset 
     */
    place(reference_element, placement = "bottom-start", offset = 5) {
        if (reference_element) {
            ComputePosition(reference_element, this, placement, offset);
        }
    }

    /**
     * 选下一个或者上一个
     */
    setSelectNextOrLast(next_last = true) {
        let children = this.#container.childNodes;
        let children_count = children.length;
        if (this.#selected_index >= 0) {
            if (1 == children_count) {
                return;
            }

            let child = children[this.#selected_index];
            if (isFunction(child.setSelected)) {
                child.setSelected(false);
            }
        }

        if (next_last) {
            this.#selected_index = (this.#selected_index + 1 + children_count) % children_count;
        } else {
            this.#selected_index = (this.#selected_index - 1 + children_count) % children_count;
        }

        let child = children[this.#selected_index];
        if (isFunction(child.setSelected)) {
            child.setSelected(true);
        }
    }

    /**
     * 
     * 用来标记是不是被选中
     * 
     * @returns 
     */
    hasSelected() {
        return this.#selected_index >= 0;
    }

    /**
     * 获取选择的用户数据
     */
    getSelectedUserData() {
        let children = this.#container.childNodes;
        let children_count = children.length;
        if (this.#selected_index < 0 || this.#selected_index >= children_count) {
            return undefined;
        }
        
        let child = children[this.#selected_index];
        if (isFunction(child.getUserData)) {
            return child.getUserData();
        }
    }

    /**
     * 
     * Cell 旋转
     * 
     * @param {*} cell_user_data 
     */
    onCellSelected(cell_user_data) {
        if (isFunction(this.onselected)) {
            this.onselected(cell_user_data);
        }

        this.remove();
        
        if (isFunction(this.ondismiss)) {
            this.ondismiss();
        }
    }

    /**
     * 
     * 点击其他地方, 菜单消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        this.remove();
        if (isFunction(this.ondismiss)) {
            this.ondismiss();
        }
    }
}

CustomElementRegister(tagName, SceneSearcherCandidateSelector);
