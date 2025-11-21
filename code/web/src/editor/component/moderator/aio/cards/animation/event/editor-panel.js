/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import EventEditorCreator    from './editor/creator';
import EventsIcon            from './events-icon';
import ShowEventSelector     from './events-selector';
import Html                  from './editor-panel-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-animation-event-editor-panel';

/**
 * 编辑面板
 */
export default class EditorPanel extends Element {
    /**
     * 元素
     */
    #container;
    #l;
    #r;
    #more;

    /**
     * 事件类型
     */
    #type;

    /**
     * 编辑
     */
    #editor;

    /**
     * 获取
     */
    get type() {
        return this.#type;
    }

    /**
     * 获取
     */
    get editor() {
        return this.#editor;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.setType('key');
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#l         = this.getChild('#l');
        this.#r         = this.getChild('#r');
        this.#more      = this.getChild('#more');
        this.#more.onclick = () => {
            ShowEventSelector(token => {
                
            }, this.#more);
        };
    }

    /**
     * 设置空的编辑器
     */
    setEmptyEditor() {
        if (this.#editor) {
            this.#editor.remove();
            this.#editor = undefined;
        }
    }

    /**
     * 
     * 设置事件的类型
     * 
     * @param {*} type 
     * @param {*} user_data 
     */
    setType(type, user_data) {
        this.setEmptyEditor();
        switch(type) {
        case 'key':
        case 'keypress':
        case 'keydown':
        case 'keyup':
            this.#type = type;
            this.#editor = EventEditorCreator('key');
            this.#editor.updateUserData(user_data);
            this.#r.appendChild(this.#editor);
            break;

        case 'timer':
            this.#type = type;
            this.#editor = EventEditorCreator('key');
            this.#editor.updateUserData(user_data);
            this.#r.appendChild(this.#editor);
            break;

        case 'user-define':
            this.#type = type;
            this.#editor = EventEditorCreator('user-define');
            this.#editor.updateUserData(user_data);
            this.#r.appendChild(this.#editor);
            break;
        }
    }
}

CustomElementRegister(tagName, EditorPanel);
