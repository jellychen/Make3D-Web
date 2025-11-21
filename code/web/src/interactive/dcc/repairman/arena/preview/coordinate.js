/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://bgolus.medium.com/the-best-darn-grid-shader-yet-727f9278b9d8

import XThree         from '@xthree/basic';
import XThreeMaterial from '@xthree/material';

/**
 * 默认值
 */
const default_max_distance = 600;

/**
 * 临时
 */
const _vec3_0 = new XThree.Vector3();
const _vec3_1 = new XThree.Vector3();

/**
 * 显示坐标轴
 */
export default class Coordinate extends XThree.Mesh {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.geometry      = new XThree.PlaneGeometry(2, 2, 1, 1);
        this.material      = new XThreeMaterial.Coordinate();
        this.frustumCulled = false;
        this.reset();
    }

    /**
     * 调整成默认的设置
     */
    reset() {
        this.material.setDistance(default_max_distance);
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        camera.getWorldDirection(_vec3_0);
        const position = camera.position;
        const t        = -position.z / _vec3_0.z;
        const x        = position.x + t * _vec3_0.x;
        const y        = position.x + t * _vec3_0.y;
        this.material.setPoint(x, y);
        this.material.setScale(1.0 / window.devicePixelRatio || 1.0);
        renderer.render(this, camera);
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
