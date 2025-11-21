/* eslint-disable no-unused-vars */

import isFunction                   from 'lodash/isFunction';
import Animation                    from '@common/misc/animation';
import CustomElementRegister        from '@ux/base/custom-element-register';
import Element                      from '@ux/base/element';
import ElementDomCreator            from '@ux/base/element-dom-creator';
import MeshSmoothingLevelController from '@core/misc/mesh-smoothing-level-controller';
import Html                         from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-smoothing-level-controller';

/**
 * 平滑等级控制
 */
export default class SmoothingLevelController extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 
     * 平滑
     * 
     * MeshSmoothingLevelController
     * 
     */
    #mslc;

    /**
     * 元素
     */
    #container;
    #numizer;

    /**
     * 事件回调
     */
    #on_dismiss = event => this.#onDismiss(event);

    /**
     * 事件回调
     */
    on_value_changed;
    on_closed;

    /**
     * 
     * 协调器
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.setEnableCustomizeMenu(true);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#numizer   = this.getChild('#numizer');
        this.#numizer.on_value_changed = () => this.#onNumizerChanged();
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.FadeIn(this.#container);
        document.addEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 
     * 安装
     * 
     * @param {*} mesh 
     */
    setupMesh(mesh) {
        if (!mesh || !mesh.isEditableMesh) {
            throw new Error("mesh must be isEditableMesh");
        }
        this.#mslc = new MeshSmoothingLevelController(mesh);
        this.#numizer.setValue(Math.A2D_(mesh.crease_angle));
    }

    /**
     * 值发生了变化
     */
    #onNumizerChanged() {
        let value = this.#numizer.value;
        if (value < 0) {
            value = 0;
        } else if (value > 60) {
            value = 60;
        }
        this.#numizer.setValue(value);

        // 执行重新生成
        if (this.#mslc.smoothing(Math.D2A_(value))) {
            this.#coordinator.renderNextFrame();
        }

        // 外部通知
        if (isFunction(this.on_value_changed)) {
            try {
                this.on_value_changed(value);
            } catch(e) {
                console.error(e);
            }
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.remove();
        if (this.#mslc) {
            this.#mslc.dispose();
        }
    }

    /**
     * 
     * 点击其他地方, 菜单消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        this.dispose();

        if (isFunction(this.on_closed)) {
            try {
                this.on_closed();
            } catch(e) {
                console.error(e);
            }
        }
    }
}

CustomElementRegister(tagName, SmoothingLevelController);
