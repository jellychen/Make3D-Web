/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";

/**
 * 
 * 组建容器
 * 
 * 只要被绘制的元素，每次绘制的时候就会被调用
 * 
 */
export default class Container {
    /**
     * 组建池子
     */
    #components = [];

    /**
     * host
     */
    #host;

    /**
     * 获取宿主
     */
    get host() {
        return this.#host;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} object_3d 
     */
    constructor(object_3d) {
        if (!object_3d) {
            throw new Error("object_3d is undefined");
        }
        this.#host = object_3d;
    }

    /**
     * 
     * 是否存在
     * 
     * @param {*} component 
     * @returns 
     */
    has(component) {
        if (!component) {
            return false;
        } else {
            return -1 != this.#components.indexOf(component);
        }
    }

    /**
     * 
     * 添加
     * 
     * @param {*} component 
     * @returns 
     */
    add(component) {
        if (!component) {
            return;
        } else if (!this.has(component)) {
            if (isFunction(component.attach)) {
                try {
                    component.attach(this.#host);
                } catch (e) {
                    console.error(e);
                }
            }
            this.#components.push(component);
        }
    }

    /**
     * 
     * 添加
     * 
     * @param {*} component 
     * @returns 
     */
    attach(component) {
        return this.add(component);
    }

    /**
     * 
     * 移除
     * 
     * @param {*} component 
     */
    del(component) {
        if (!component) {
            return;
        } else {
            const index = this.#components.indexOf(component);
            if (index < 0) {
                return;
            }

            if (isFunction(component.detatch)) {
                try {
                    component.detatch();
                } catch (e) {
                    console.error(e);
                }
            }
            this.#components.splice(index, 1);
        }
    }

    /**
     * 
     * 移除
     * 
     * @param {*} component 
     * @returns 
     */
    detach(component) {
        return this.del(component);
    }

    /**
     * 清理
     */
    clear() {
        for (const component of this.#components) {
            if (isFunction(component.detatch)) {
                try {
                    component.detatch();
                } catch (e) {
                    console.error(e);
                }
            }
        }
        this.#components.length = 0;

    }

    /**
     * 
     * tick, 返回true，表示
     * 
     * @param {*} object 
     * @param {*} time 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     */
    tick(object, time, renderer, scene, camera) {
        for (const component of this.#components) {
            if (isFunction(component.tick)) {
                try {
                    component.tick(object, time, renderer, scene, camera);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
}
