/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import XThree     from '@xthree/basic';

/**
 * 基础
 */
export default class Base extends XThree.Group {
    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * 从指定的元素中获取matrix
     * 
     * @param {*} object 
     * @param {boolean} update 
     */
    copyMatrixFromObject(object, update = false) {
        if (update) {
            object.updateWorldMatrix(true, false);
        }
        this.setMatrix(object.matrixWorld);
    }

    /**
     * 
     * 设置变换矩阵
     * 
     * @param {*} mat4 
     */
    setMatrix(mat4) {
        this.matrix.identity();
        this.applyMatrix4(mat4);
    }

    /**
     * 
     * 渲染之前准备
     * 
     * @param {*} renderer_pipeline 
     * @param {*} renderer 
     * @param {*} camera 
     */
    onFrameBegin(renderer_pipeline, renderer, camera) {
        ;
    }

    /**
     * 请求重绘
     */
    requestAnimationFrameIfNeed() {
        if (this.parent && isFunction(this.parent.requestAnimationFrameIfNeed)) {
            this.parent.requestAnimationFrameIfNeed();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        ;
    }
}