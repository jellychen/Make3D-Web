/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-abattoir-information';

/**
 * 用来显示网格信息
 */
export default class AbattoirInformation extends Element {
    /**
     * 核心协调器
     */
    #coordinator;
    #coordinator_selected_container;

    /**
     * 元素
     */
    #container;
    #name;
    #uuid;
    #vertices_count;
    #triangles_count;
    #editable;

    /**
     * 事件回调
     */
    #on_scene_selected_changed = () => this.#onSceneSelectedChanged();

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 初始化
     */
    onCreate() {
        super.onCreate();
        this.#container       = this.getChild('#container');
        this.#name            = this.getChild('#name');
        this.#uuid            = this.getChild('#uuid');
        this.#vertices_count  = this.getChild('#vertex');
        this.#triangles_count = this.getChild('#triangle');
        this.#editable        = this.getChild('#editable');
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
        this.#coordinator.addEventListener('selected.changed', this.#on_scene_selected_changed);
        this.#coordinator_selected_container = this.#coordinator.selected_container;
        this.#update();
    }

    /**
     * 
     * 是否显示
     * 
     * @param {boolean} show 
     */
    #show(show) {
        if (show) {
            this.style.display = 'flex';
        } else {
            this.style.display = 'none';
        }
    }

    /**
     * 选择器 选择的元素变化
     */
    #onSceneSelectedChanged() {
        this.#update();
    }

    /**
     * 更新
     */
    #update() {
        const count = this.#coordinator_selected_container.count();
        if (count != 1) {
            this.#show(false);
        } else {
            this.#show(true);

            // 通知选择变化
            const object = this.#coordinator_selected_container.getOneValue();
            if (!object) {
                throw new Error("getOneValue error");
            }

            // 数据展示
            try {
                this.#name.setData(object.name);
                this.#uuid.setData(object.uuid);
                this.#vertices_count.setData(`${object.verticesCount()}`);
                this.#triangles_count.setData(`${object.facesCount()}`);
            } catch(e) {
                console.error(e);
            }
        }
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#coordinator) {
            this.#coordinator.removeEventListener('selected.changed', this.#on_scene_selected_changed);
        }
    }
}

CustomElementRegister(tagName, AbattoirInformation);
