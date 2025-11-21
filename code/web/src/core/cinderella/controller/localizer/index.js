/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';
import Mesh   from './mesh';

/**
 * 用来提供给雕刻工具的位置标记
 */
export default class Localizer extends XThree.Group {
    /**
     * 请求重绘
     */
    #request_animation_frame = () => {};

    /**
     * 分辨率
     */
    #resolution_w = 0;
    #resolution_h = 0;

    /**
     * 最多支持2个
     */
    #mesh_0 = new Mesh(false);
    #mesh_1 = new Mesh(true );

    /**
     * 获取
     */
    get A() {
        return this.#mesh_0;
    }

    /**
     * 获取
     */
    get B() {
        return this.#mesh_1;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} request_animation_frame 
     */
    constructor(request_animation_frame) {
        super();

        // 保存
        this.#request_animation_frame = request_animation_frame;

        // 添加网格
        this.add(this.#mesh_0);
        this.add(this.#mesh_1);
    }
    
    /**
     * 
     * 显示 A
     * 
     * @param {*} show 
     * @returns 
     */
    showA(show) {
        if (show) {
            if (!this.#mesh_0.parent) {
                this.add(this.#mesh_0);
                this.renderNextFrame();
            }
        } else {
            if (this.#mesh_0.parent) {
                this.remove(this.#mesh_0);
                this.renderNextFrame();
            }
        }
        return this;
    }

    /**
     * 
     * 显示 B
     * 
     * @param {*} show 
     * @returns 
     */
    showB(show) {
        if (show) {
            if (!this.#mesh_1.parent) {
                this.add(this.#mesh_1);
                this.renderNextFrame();
            }
        } else {
            if (this.#mesh_1.parent) {
                this.remove(this.#mesh_1);
                this.renderNextFrame();
            }
        }
        return this;
    }

    /**
     * 
     * 设置位置
     * 
     * @param {*} radius 
     * @param {*} position 
     * @param {*} z_dir 
     * @returns 
     */
    setPositionInfo_A(radius, position, z_dir) {
        this.#mesh_0.setRadius(radius);
        this.#mesh_0.setPositionInfo(position, z_dir);
        this.renderNextFrame();
        return this;
    }

    /**
     * 
     * 设置位置
     * 
     * @param {*} radius 
     * @param {*} position 
     * @param {*} z_dir 
     * @returns 
     */
    setPositionInfo_B(radius, position, z_dir) {
        this.#mesh_1.setRadius(radius);
        this.#mesh_1.setPositionInfo(position, z_dir);
        this.renderNextFrame();
        return this;
    }

    /**
     * 
     * 大小发生变动的时候
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        if (this.#resolution_w === width && this.#resolution_h === height) {
            return;
        } else {
            this.#resolution_w = width;
            this.#resolution_h = height;
            this.#mesh_0.setResolution(width, height);
            this.#mesh_1.setResolution(width, height);
        }
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        if (!this.visible) {
            return;
        }
        renderer.render(this, camera);
    }

    /**
     * 更新
     */
    renderNextFrame() {
        this.#request_animation_frame();
    }

    /**
     * 销毁
     */
    dispose() {
        this.#mesh_0.dispose(true, true);
        this.#mesh_1.dispose(true, true);
    }
}
