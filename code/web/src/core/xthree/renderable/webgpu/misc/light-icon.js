/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree       from 'three/webgpu';
import * as tsl          from 'three/tsl';
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
export default class LightIcon extends XThree.Sprite {
    /**
     * 构造函数
     */
    constructor() {
        super();
        const buffer  = new Float32Array([0, 0, 0]);
        const attri   = new XThree.InstancedBufferAttribute(buffer, 3);
        this.count    = 1;
        this.material = new LightIconMaterial();
        this.material.positionNode = tsl.instancedBufferAttribute(attri);
        this.material.setPointSize(DEFAULT_POINT_SIZE);
        this.material.setR0(DEFAULT_R0);
        this.material.setR1(DEFAULT_R1);
        this.material.setGap(DEFAULT_GAP);
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
        this.dispose();
        this.material.dispose();
    }
}
