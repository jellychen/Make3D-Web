/* eslint-disable no-unused-vars */

import isString           from 'lodash/isString';
import isFunction         from 'lodash/isFunction';
import GlobalScope        from '@common/global-scope';
import ManipulatorCreator from './operator/creator';

/**
 * 协助器
 */
export default class Assistor {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 宿主
     */
    #host;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * Wasm内核
     */
    #chameleon = GlobalScope.chameleon;

    /**
     * 渲染器
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * 场景
     */
    #scene;

    /**
     * manipulator 
     */
    #manipulator;

    /**
     * 访问器
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 访问器
     */
    get host() {
        return this.#host;
    }

    /**
     * 访问器
     */
    get chameleon() {
        return this.#chameleon;
    }

    /**
     * 访问器
     */
    get selected_container() {
        return this.#selected_container;
    }

    /**
     * 访问器
     */
    get cinderella() {
        return this.#cinderella;
    }

    /**
     * 访问器
     */
    get cinderella_conf_context() {
        return this.#cinderella_conf_context;
    }

    /**
     * 访问器
     */
    get scene() {
        return this.#scene;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} host 
     */
    constructor(coordinator, host) {
        this.#selected_container = coordinator.selected_container;
        this.#coordinator = coordinator;
        this.#host = host;
        this.#cinderella = coordinator.cinderella;
        this.#cinderella_conf_context = this.#cinderella.getConfContext();
        this.#scene = this.#cinderella.getScene();
    }

    /**
     * 
     * 添加元素
     * 
     * @param {*} ec                     编辑控制器
     * @param {string} type              类型
     * @param {*} _argument              参数
     * @returns 
     */
    add(ec, type, _argument) {
        if (!isString(type)) {
            return;
        }

        // 销毁旧的
        this.disposeManipulator();

        // 启动新的
        this.#manipulator = this.#createManipulator(ec, type);
        if (this.#manipulator && isFunction(this.#manipulator.start)) {
            this.#manipulator.start(_argument);
        }
    }

    /**
     * 重置
     */
    reset() {
        this.disposeManipulator();
    }

    /**
     * 
     * 创建 Manipulator
     * 
     * @param {*} ec 
     * @param {*} type 
     */
    #createManipulator(ec, type) {
        return ManipulatorCreator(ec, type, this.#coordinator, this);
    }

    /**
     * 
     * 判断是否具有控制器
     * 
     * @returns 
     */
    hasCurrentManipulator() {
        return !!this.#manipulator;
    }

    /**
     * 
     * 重置修改器到默认值
     * 
     * 返回false表示不需要重置
     * 
     * @returns 
     */
    resetManipulatorToDefault() {
        if (this.#manipulator) {
            return this.#manipulator.resetToDefault()
        } else {
            return false;
        }
    }

    /**
     * 销毁
     */
    disposeManipulator() {
        if (this.#manipulator) {
            this.#manipulator.dispose();
            this.#manipulator = undefined;
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.disposeManipulator();
    }
}
