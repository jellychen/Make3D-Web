/* eslint-disable no-unused-vars */

import AnimationData         from '@core/cinderella/component-animation/track/item';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import DeleteBtn             from './v-marker-delete';
import Html                  from './v-marker-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-keyframe-marker';

/**
 * 标签
 */
export default class Marker extends Element {
    /**
     * 宿主
     */
    #host;

    /**
     * 元素
     */
    #container;
    #icon;
    #time_panel;

    /**
     * 动画的时间
     */
    #time;

    /**
     * 鼠标按下的位置
     */
    #pointerdown_client_x;
    #pointerdown_time;

    /**
     * 是否选中
     */
    #selected = false;

    /**
     * 关闭按钮
     */
    #delete_btn;

    /**
     * 动画的数据
     */
    #animation_data = new AnimationData();

    /**
     * 获取时间
     */
    get time() {
        return this.#time;
    }

    /**
     * 设置当前的时间
     */
    set time(value) {
        this.setTime(parseFloat(value));
    }

    /**
     * 获取动画数据
     */
    get animation_data() {
        return this.#animation_data;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     */
    constructor(host) {
        super(tagName);
        this.#host = host;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container          = this.getChild('#container');
        this.#icon               = this.getChild('#icon');
        this.#time_panel         = this.getChild('#time-panel');
        this.#icon.onpointerdown = event => this.#onPointerDown(event);
        this.onclick             = event => this.#host.selectMarker(this);
    }

    /**
     * 
     * 获取当前可能存在的位置
     * 
     * @returns 
     */
    getPosition() {
        const offset_time = this.#host.offset_time;
        const span        = this.#host.span;
        return (this.time - offset_time) * span;
    }

    /**
     * 
     * 更新位置
     * 
     * @returns 
     */
    updatePosition() {
        const position = this.getPosition();
        this.style.left = `${position}px`;
        return position;
    }

    /**
     * 
     * 设置当前的位置
     * 
     * @param {*} time 
     * @param {*} update_position 
     * @returns 
     */
    setTime(time, update_position = true) {
        if (time < 0) {
            time = 0;
        }
        
        time = parseFloat(time.toFixed(2));
        if (this.time == time) {
            return;
        }

        this.#animation_data.time = time;
        this.#time = time;
        this.#time_panel.innerText = `${time}s`;
        if (update_position) {
            this.updatePosition();
            this.#host.updateRangeLine();
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.#icon.setPointerCapture(event.pointerId);
        this.style.zIndex          = parseInt(performance.now()) + 10000;
        this.#pointerdown_client_x = event.clientX;
        this.#pointerdown_time     = this.#time;
        this.#icon.onpointermove   = event => this.#onPointerMove(event);
        this.#icon.onpointerup     = event => this.#onPointerUp(event);
        this.#icon.onpointercancel = event => this.#onPointerCancel(event);
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        const current_x   = event.clientX;
        const offset      = current_x - this.#pointerdown_client_x;
        const offset_time = offset / this.#host.span;
        const time        = this.#pointerdown_time + offset_time;
        this.setTime(time);
        this.#host.context.updateCursorTime(time);
        this.#host.context.makeAnimationNeedUpdate();
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.#icon.onpointermove   = undefined;
        this.#icon.onpointerup     = undefined;
        this.#icon.onpointercancel = undefined;
        this.#icon.releasePointerCapture(event.pointerId);
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }

    /**
     * 点击了移除
     */
    #onClickDelete() {
        this.#host.removeMarker(this);
    }

    /**
     * 
     * 设置是否选中
     * 
     * @param {*} selected 
     * @returns 
     */
    setSelected(selected) {
        if (this.#selected == selected) {
            return;
        } else {
            this.#selected = selected;
        }

        if (this.#selected) {
            this.#icon.setAttribute("selected", "true");
            this.#delete_btn = new DeleteBtn();
            this.#delete_btn.onclick = () => this.#onClickDelete();
            this.#container.appendChild(this.#delete_btn);
        } else {
            this.#icon.removeAttribute("selected");
            if (this.#delete_btn) {
                this.#delete_btn.remove();
                this.#delete_btn = undefined;
            }
        }
    }
}

CustomElementRegister(tagName, Marker);
