/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree    from '@xthree/basic';
import Constants from './core/constants';

/**
 * 临时变量
 */
const _vec2_0 = new XThree.Vector2();
const _vec2_1 = new XThree.Vector2();

/**
 * 控制，移动相机的焦点位置
 */
export default class IsolateCameraTargetMoveable {
    /**
     * 捆绑的DOM元素
     */
    #attached_interactive;
    #keyboard_watcher;

    /**
     * 部件
     */
    #isolate;
    #personal_cameraman;
    #orbit;
    #orbit_target_plane;

    /**
     * 射线
     */
    #ray_caster = new XThree.Raycaster();

    /**
     * 用来计算
     */
    #intersect_0 = new XThree.Vector3(1, 1, 1);
    #intersect_1 = new XThree.Vector3(1, 1, 1);

    /**
     * 响应事件
     */
    #respond_event = false;

    /**
     * 
     * 构造函数
     * 
     * @param {*} isolate 
     * @param {*} interactive 
     */
    constructor(isolate, interactive) {
        this.#attached_interactive = interactive;
        this.#keyboard_watcher     = isolate.getKeyboardWatcher();
        this.#isolate              = isolate;
        this.#personal_cameraman   = isolate.getPersonalCameraman();
        this.#orbit                = isolate.getOrbit();
        this.#orbit_target_plane   = new XThree.Plane();
    }

    /**
     * 
     *  判断交互事件是不是符合要求
     * 
     * @param {*} event 
     */
    #isInteractiveEventAgree(event) {
        // 鼠标中建
        if (4 === event.buttons) {
            return true;
        }

        // 空格键 + 鼠标左键
        if (this.#keyboard_watcher.space && 1 === event.buttons) {
            return true;
        }

        return false;
    }

    /**
     * 
     * 鼠标按下的事件
     * 
     * @param {*} event 
     * @returns 
     */
    dispathPointerDown(event) {
        if (!this.#isInteractiveEventAgree(event)) {
            return false;
        }

        this.#respond_event = true;
        let r = this.#attached_interactive.getBoundingClientRect();
        let half_w = r.width  / 2.0;
        let half_h = r.height / 2.0;
        let ndc_x  = (event.x - r.left - half_w) / half_w;
        let ndc_y  = (half_h - event.y + r.top ) / half_h;
        this.#update(ndc_x, ndc_y);

        return true;
    } 

    /**
     * 
     * 鼠标移动的事件
     * 
     * @param {*} event 
     */
    dispathPointerMove(event) {
        if (!this.#respond_event) {
            return;
        }
        
        let r      = this.#attached_interactive.getBoundingClientRect();
        let half_w = r.width  / 2.0;
        let half_h = r.height / 2.0;
        let ndc_x  = (event.x - r.left - half_w) / half_w;
        let ndc_y  = (half_h - event.y + r.top ) / half_h;
        _vec2_0.x  = ndc_x;
        _vec2_0.y  = ndc_y;

        this.#ray_caster.setFromCamera(_vec2_0, this.#personal_cameraman.camera);
        this.#ray_caster.ray.intersectPlane(this.#orbit_target_plane, this.#intersect_1);
        let offset_x = this.#intersect_0.x - this.#intersect_1.x;
        let offset_y = this.#intersect_0.y - this.#intersect_1.y;
        let offset_z = this.#intersect_0.z - this.#intersect_1.z;
        if (offset_x != 0 || offset_y != 0 || offset_z != 0) {
            this.#orbit.offsetTarget(offset_x, offset_y, offset_z);
            this.requestAnimationFrame();
        }
        
        this.#update(ndc_x, ndc_y);
    }

    /**
     * 
     * 鼠标抬起事件
     * 
     * @param {*} event 
     */
    dispathPointerUp(event) {
        this.#respond_event = false;
    }

    /**
     * 
     * 鼠标放弃事件
     * 
     * @param {*} event 
     */
    dispathPointerCancel(event) {
        this.dispathPointerUp(event);
    }

    /**
     * 更新目标面
     */
    #update(ndc_x, ndc_y) {
        _vec2_0.x = ndc_x;
        _vec2_0.y = ndc_y;
        this.#orbit.getTargetPlane(this.#orbit_target_plane);
        this.#ray_caster.setFromCamera(_vec2_0, this.#personal_cameraman.camera);
        this.#ray_caster.ray.intersectPlane(this.#orbit_target_plane, this.#intersect_0);
    }

    /**
     * 请求下一帧重绘
     */
    requestAnimationFrame() {
        this.#isolate.requestAnimationFrame();
    }
}
