/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree    from '@xthree/basic';
import Constants from './constants';
import Rotater   from './rotater';

/**
 * 轴
 */
const _axis_x = new XThree.Vector3(1, 0, 0);
const _axis_y = new XThree.Vector3(0, 1, 0);
const _axis_z = new XThree.Vector3(0, 0, 1);

/**
 * 旋转组件
 */
export default class RotaterContainer extends XThree.Group {
    /**
     * 请求重绘函数
     */
    #request_animation_frame = () => {};

    /**
     * 各种绕轴
     */
    #rotater_x; // 绕X轴
    #rotater_y; // 绕Y轴
    #rotater_z; // 绕Z轴

    /**
     * 显示的轴
     */
    #axis = 0;

    /**
     * 临时变量
     */
    #vec_0 = new XThree.Vector3(0, 0, 0);
    #vec_1 = new XThree.Vector3(0, 0, 0);
    #corss = new XThree.Vector3(0, 0, 0);

    /**
     * #vec_0 和 #vec_1 夹角弧度
     */
    #vec_1_vec_0_angle = 0;

    /**
     * 获取夹角 弧度制
     */
    get angle() {
        return this.#vec_1_vec_0_angle;
    }

    /**
     * 获取夹角 角度制
     */
    get degrees() {
        return 180 * this.#vec_1_vec_0_angle / Math.PI;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {function} request_animation_frame 
     */
    constructor(request_animation_frame) {
        super();
        this.#rotater_x = new Rotater(request_animation_frame, 0);
        this.#rotater_y = new Rotater(request_animation_frame, 1);
        this.#rotater_z = new Rotater(request_animation_frame, 2);
        this.#request_animation_frame = request_animation_frame;
    }

    /**
     * 
     * 显示绕轴 X
     * 
     * @param {*} show 
     */
    setShowRotaterX(show) {
        if (show) {
            if (!this.#rotater_x.parent) {
                this.add(this.#rotater_x);
                this.#requestAnimationFrameIfNeed();
            }
            this.#axis = 0;
        } else {
            if (this.#rotater_x.parent) {
                this.#rotater_x.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示绕轴 Y
     * 
     * @param {*} show 
     */
    setShowRotaterY(show) {
        if (show) {
            if (!this.#rotater_y.parent) {
                this.add(this.#rotater_y);
                this.#requestAnimationFrameIfNeed();
            }
            this.#axis = 1;
        } else {
            if (this.#rotater_y.parent) {
                this.#rotater_y.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示绕轴 Z
     * 
     * @param {*} show 
     */
    setShowRotaterZ(show) {
        if (show) {
            if (!this.#rotater_z.parent) {
                this.add(this.#rotater_z);
                this.#requestAnimationFrameIfNeed();
            }
            this.#axis = 2;
        } else {
            if (this.#rotater_z.parent) {
                this.#rotater_z.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 显示全部
     */
    setShowAll() {
        this.setShowRotaterX(true);
        this.setShowRotaterY(true);
        this.setShowRotaterZ(true);
    }

    /**
     * 隐藏全部
     */
    setAllHidden() {
        this.setShowRotaterX(false);
        this.setShowRotaterY(false);
        this.setShowRotaterZ(false);
    }

    /**
     * 
     * 设置启动之初的交点
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    setStart(x, y, z) {
        this.#vec_0.set(x, y, z).normalize();
        this.#vec_1_vec_0_angle = 0;
        
        if (this.#rotater_x.parent) this.#rotater_x.setStart(x, y, z);
        if (this.#rotater_y.parent) this.#rotater_y.setStart(x, y, z);
        if (this.#rotater_z.parent) this.#rotater_z.setStart(x, y, z);
    }

    /**
     * 
     * 设置当前的鼠标的交点
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    setCurrent(x, y, z) {
        // 计算旋转角度，逆时针
        this.#vec_1.set(x, y, z).normalize();
        this.#vec_1_vec_0_angle = Math.acos(this.#vec_1.dot(this.#vec_0));
        this.#corss.crossVectors(this.#vec_1, this.#vec_0);

        if (0 == this.#axis) {
            // 绕 x 轴
            if (this.#corss.dot(_axis_x) > 0) {
                this.#vec_1_vec_0_angle = Math.PI * 2 - this.#vec_1_vec_0_angle;
            }
        } else if (1 == this.#axis) {
            // 绕 y 轴
            if (this.#corss.dot(_axis_y) > 0) {
                this.#vec_1_vec_0_angle = Math.PI * 2 - this.#vec_1_vec_0_angle;
            }
        } else if (2 == this.#axis) {
            // 绕 z 轴
            if (this.#corss.dot(_axis_z) > 0) {
                this.#vec_1_vec_0_angle = Math.PI * 2 - this.#vec_1_vec_0_angle;
            }
        }

        // 通知子元素更新
        if (this.#rotater_x.parent) this.#rotater_x.setCurrent(x, y, z);
        if (this.#rotater_y.parent) this.#rotater_y.setCurrent(x, y, z);
        if (this.#rotater_z.parent) this.#rotater_z.setCurrent(x, y, z);
    }

    /**
     * 
     * 尺寸发生变化
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        this.#rotater_x.resize(pixel_ratio, width, height);
        this.#rotater_y.resize(pixel_ratio, width, height);
        this.#rotater_z.resize(pixel_ratio, width, height);
    }

    /**
     * 请求重绘
     */
    #requestAnimationFrameIfNeed() {
        if (this.#request_animation_frame) {
            this.#request_animation_frame();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.#rotater_x.dispose();
        this.#rotater_y.dispose();
        this.#rotater_z.dispose();
    }
}
