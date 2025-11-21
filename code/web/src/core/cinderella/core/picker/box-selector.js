/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://threejs.org/examples/misc_boxselection.html

import BoxSelector_Impls from './box-selector-impls';

/**
 * 框选工具
 */
export default class BoxSelector extends BoxSelector_Impls {
    /**
     * 框选
     */
    #collection;

    /**
     * 获取
     */
    get data() {
        return this.#collection;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} camera 
     * @param {*} scene 
     */
    constructor(camera, scene) {
        super(camera, scene);
    }

    /**
     * 
     * 设置相机
     * 
     * @param {*} camera 
     */
    setCamera(camera) {
        this.camera = camera;
    }

    /**
     * 
     * 设置场景
     * 
     * @param {*} scene 
     */
    setScene(scene) {
        this.scene = scene;
    }

    /**
     * 
     * 设置选中区域，XY 是NDC坐标
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setSelectBoxA(x, y) {
        this.startPoint.set(x, y, 0.5);
    }

    /**
     * 
     * 设置选中区域，XY 是NDC坐标
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setSelectBoxB(x, y) {
        this.endPoint.set(x, y, 0.5);
    }

    /**
     * 
     * 执行选择
     * 
     * @returns 
     */
    select() {
        this.#collection = super.select();
        return this.#collection;
    }

    /**
     * 放弃数据
     */
    dispose() {
        this.collection.length = 0;
        this.instances = {};
    }
}
