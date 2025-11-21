/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";
import XThree     from '@xthree/basic';

/**
 * 用来存放辅助对象
 */
export default class Collaborator extends XThree.Scene {
    /**
     * 用来触发下一帧重绘的接口
     */
    #request_animation_frame = () => {};

    /**
     * 
     * 构造函数
     * 
     * @param {*} request_animation_frame 
     */
    constructor(request_animation_frame) {
        super();
        this.#request_animation_frame = request_animation_frame;
    }

    /**
     *
     * 添加元素
     *
     * @param {*} object
     */
    attach(object) {
        if (object.parent) {
            throw new Error('object has parent');
        } else {
            this.add(object);
            return this;
        }
    }

    /**
     *
     * 移除制定的元素
     *
     * @param {*} object
     */
    detach(object) {
        if (object.parent != this) {
            throw new Error('object has diff parent');
        } else {
            object.removeFromParent();
            return this;
        }
    }

    /**
     *
     * 移除制定的元素并废弃
     *
     * @param {*} object
     */
    detachAndDispose(object) {
        if (object.parent == this) {
            object.removeFromParent();
            if (isFunction(object.dispose)) {
                object.dispose();
            }
        }
        return this;
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer_pipeline 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer_pipeline, renderer, camera) {
        // 渲染钱准备
        this.traverse(child => {
            if (isFunction(child.onFrameBegin)) {
                child.onFrameBegin(renderer_pipeline, renderer, camera);
            }
        }, true);

        // 执行渲染
        renderer.render(this, camera);

        // 渲染结束
        this.traverse(child => {
            if (isFunction(child.onFrameEnd)) {
                child.onFrameEnd(renderer_pipeline, renderer, camera);
            }
        }, true);
    }

    /**
     * 请求重绘
     */
    requestAnimationFrameIfNeed() {
        if (isFunction(this.#request_animation_frame)) {
            this.#request_animation_frame();
        }
    }
}
