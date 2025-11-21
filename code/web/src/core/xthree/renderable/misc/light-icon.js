/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree       from 'three';
import LightIconMaterial from './light-icon-material';

/**
 * 基础参数
 */
const DEFAULT_POINT_SIZE = 46;
const DEFAULT_R0         = 12;
const DEFAULT_R1         = 4 ;
const DEFAULT_GAP        = 3 ;

/**
 * light icon
 */
export default class LightIcon extends XThree.Points {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.geometry.setAttribute('position', new XThree.Float32BufferAttribute([0, 0, 0], 3));
        this.material = new LightIconMaterial();
        this.material.setPointSize(DEFAULT_POINT_SIZE);
        this.material.setR0(DEFAULT_R0);
        this.material.setR1(DEFAULT_R1);
        this.material.setGap(DEFAULT_GAP);
        this.material.transparent = true;
    }

    /**
     * 
     * 设置显示的颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.material.setColor(color);
    }

    /**
     * 
     * 设置点的尺寸
     * 
     * @param {Number} size 
     */
    setPointSize(size) {
        this.material.setPointSize(size);
    }

    /**
     * 
     * 设置大圆的尺寸
     * 
     * @param {*} r 
     */
    setR0(r) {
        this.material.setR0(r);
    }

    /**
     * 
     * 设置小圆的尺寸
     * 
     * @param {*} r 
     */
    setR1(r) {
        this.material.setR1(r);
    }

    /**
     * 
     * 设置距离
     * 
     * @param {*} gap 
     */
    setGap(gap) {
        this.material.setGap(gap);
    }

    /**
     * 销毁
     */
    dispose() {
        this.material.dispose();
        this.geometry.dispose();
    }
}