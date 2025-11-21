/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree      from '@xthree/basic';
import BoxSelector from './box-selector';
import CpuPicker   from './picker';

/**
 * 临时变量
 */
const _vec2 = new XThree.Vector2();

/**
 * 拾取算法
 */
export default class Picker {
    /**
     * 射线拾取
     */
    #ray_caster   = new XThree.Raycaster();

    /**
     * cpu 点拾取
     */
    #cpu          = new CpuPicker();

    /**
     * 框选
     */
    #box_selector = new BoxSelector();

    /**
     * 获取
     */
    get ray_caster() {
        return this.#ray_caster;
    }

    /**
     * 获取
     */
    get ray() {
        return this.#ray_caster.ray;
    }

    /**
     * 构造函数
     */
    constructor() { }

    /**
     * 
     * 设置相机
     * 
     * @param {*} camera 
     */
    setCamera(camera) {
        this.#box_selector.setCamera(camera);
    }

    /**
     * 
     * 设置拾取的参数
     * 
     * @param {*} ndc_x 
     * @param {*} ndc_y 
     * @param {*} camera 
     * @param {*} isolate 
     */
    setPickInfo(ndc_x, ndc_y, camera, isolate, ui_x, ui_y) {
        _vec2.x = ndc_x;
        _vec2.y = ndc_y;
        this.#ray_caster.setFromCamera(_vec2, camera);
        this.#ray_caster.isolate  = isolate;
        this.#ray_caster.hit_ui_x = ui_x;
        this.#ray_caster.hit_ui_y = ui_y;
        this.#cpu.setRaycaster(this.#ray_caster);
    }

    /**
     * 
     * 设置选中区域，XY 是NDC坐标
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setSelectBoxA(x, y) {
        this.#box_selector.setSelectBoxA(x, y);
    }

    /**
     * 
     * 设置选中区域，XY 是NDC坐标
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setSelectBoxB(x, y) {
        this.#box_selector.setSelectBoxB(x, y);
    }

    /**
     * 
     * 射线提取，跳过不可见的元素
     * 
     * @param {*} object 对象
     * @param {*} recursive 
     * @param {*} intersects 
     */
    pick(object, recursive = true, intersects = []) {
        return this.#cpu.intersect(object, recursive, intersects);
    }

    /**
     * 
     * 盒子选择器
     * 
     * @param {*} object 
     */
    pickBoxSelect(object) {
        this.#box_selector.setScene(object);
        this.#box_selector.select();
        return this.#box_selector.data;
    }

    /**
     * 销毁数据
     */
    dispose() {
        this.#box_selector.dispose();
    }
}
