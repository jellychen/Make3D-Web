/* eslint-disable no-unused-vars */

import isArray from 'lodash/isArray';
import XThree  from '@xthree/basic';
import Base    from '../base';
import Picker  from '@core/cinderella/core/picker';

/**
 * 
 * mouse move 拾取器
 * 
 * 用来
 * 
 */
export default class PlaneDetector extends Base {
    /**
     * 面侦测 渲染器
     */
    #plane_detector_renderer;

    /**
     * Picker 
     */
    #picker = new Picker();

    /**
     * 事件回调
     */
    #on_pointer_move  = event => this.#onPointerMove (event);
    #on_pointer_leave = event => this.#onPointerLeave(event);
    #on_click         = event => this.#onClick(event);

    /**
     * XY 平面
     */
    #plane_xy;
    #plane = new XThree.Plane();

    /**
     * 临时
     */
    #_vec3_0 = new XThree.Vector3(0, 0, 1);
    #_vec3_1 = new XThree.Vector3(0, 0, 1);

    /**
     * 标记是不是拾取到
     */
    #picked = false;

    /**
     * 记录上一次拾取的位置和法线
     */
    #p = new XThree.Vector3();
    #n = new XThree.Vector3();

    /**
     * 点击后就终止面侦测
     */
    #enable_dispose_when_pointer_click = false;

    /**
     * 获取
     */
    get picked() {
        return this.#picked;
    }

    /**
     * 获取
     */
    get postion() {
        return this.#p;
    }

    /**
     * 获取
     */
    get normal() {
        return this.#n;
    }

    /**
     * 获取拾取到的面
     */
    get plane() {
        return this.#plane;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(coordinator);
        this.#plane_detector_renderer = this.plane_detector;
        this.#plane_detector_renderer.setEnable(false);
        this.#plane_xy = new XThree.Plane(new XThree.Vector3(0, 0, 1), 0);
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {boolean} enable 
     */
    setEnable(enable) {
        if (true === enable) {
            this.interactive.addEventListener('pointermove',     this.#on_pointer_move );
            this.interactive.addEventListener('pointerleave',    this.#on_pointer_leave);
            this.interactive.addEventListener('click',           this.#on_click);
        } else {
            this.interactive.removeEventListener('pointermove',  this.#on_pointer_move );
            this.interactive.removeEventListener('pointerleave', this.#on_pointer_leave);
            this.interactive.removeEventListener('click',        this.#on_click);
        }
        this.cinderella_conf_context.setEnablePlaneDetector(enable);
    }

    /**
     * 
     * @param {*} enable 
     */
    setDisposeWhenClick(enable) {
        this.#enable_dispose_when_pointer_click = enable == true;
    }

    /**
     * 
     * 鼠标滑动
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        // 拾取
        const r = this.interactive.getBoundingClientRect();
        const x = this.toNDC_X(event.x - r.left);
        const y = this.toNDC_Y(event.y - r.top );
        this.#picker.setPickInfo(x, y, this.camera);

        // 拾取到的数据
        let find     = false;
        let position = undefined;
        let normal   = undefined;

        // 执行拾取
        do {
            // 从场景中拾取
            let selected = this.#picker.pick(this.scene);
            if (!selected || !isArray(selected) || 0 === selected.length) {
                selected = undefined;
            } else {
                selected = selected[0];
                find = true;
                position = selected.point;
                normal = selected.face.normal.normalize();
                break;
            }

            // 如果没有拾取到，和XY平面拾取
            if (this.#picker.ray.intersectPlane(this.#plane_xy, this.#_vec3_0)) {
                find = true;
                position = this.#_vec3_0;
                normal = this.#_vec3_1.set(0, 0, 1);
            }

        } while(0);

        // 记录数据
        if (find) {
            this.#picked = true;
            this.#p.copy(position);
            this.#n.copy(normal);
            this.#plane.setFromNormalAndCoplanarPoint(this.#n, this.#p);
        } else {
            this.#picked = false;
        }

        // 需要下一帧渲染
        let data_changed = false;

        // 调整渲染
        if (!find) {
            if (this.#plane_detector_renderer.enable) {
                this.#plane_detector_renderer.setEnable(false);
                data_changed = true;
            }
        } else {
            if (!this.#plane_detector_renderer.enable) {
                this.#plane_detector_renderer.setEnable(true);
                data_changed = true;
            }
            if (!this.#plane_detector_renderer.position.equals(position) ||
                !this.#plane_detector_renderer.z_dir.equals(normal)) {
                this.#plane_detector_renderer.setPositionInfo(position, normal);
                data_changed = true;
            }
        }

        // 如果发生数据变化
        if (data_changed) {
            // 发送事件
            this.dispatchEvent('changed', {
                position,
                normal,
            });
            
            // 执行下一帧渲染
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 鼠标移出
     * 
     * @param {*} event 
     */
    #onPointerLeave(event) {
        if (this.#plane_detector_renderer.enable) {
            this.#plane_detector_renderer.setEnable(false);
            this.renderNextFrame();
        }
    }
    
    /**
     * 
     * 鼠标点击
     * 
     * @param {*} event 
     */
    #onClick(event) {
        if (this.#enable_dispose_when_pointer_click) {
            this.setEnable(false);
            this.#picker.dispose();

            // 发送事件
            this.dispatchEvent('finish');
        }
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
        this.setEnable(false);
        this.#picker.dispose();
    }
}
