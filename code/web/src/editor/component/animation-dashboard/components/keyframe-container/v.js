/* eslint-disable no-unused-vars */

import CallOnce              from '@common/misc/callonce';
import AnimationData         from '@core/cinderella/component-animation/track/item';
import AnimationDataCluster  from '@core/cinderella/component-animation/track/item-cluster';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Marker                from './v-marker';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-keyframe-board';

/**
 * 容器
 */
export default class KeyframeContainer extends Element {
    /**
     * 上下文
     */
    #context;

    /**
     * 元素
     */
    #container;
    #markers;
    #watting;
    #range_line;

    /**
     * 步长
     */
    #span;
    #offset_time;

    /**
     * 当前选中的标记
     */
    #current_selected_marker;

    /**
     * 获取
     */
    get context() {
        return this.#context;
    }

    /**
     * 获取
     */
    get span() {
        return this.#span;
    }

    /**
     * 获取
     */
    get offset_time() {
        return this.#offset_time;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container  = this.getChild('#container');
        this.#markers    = this.getChild('#markers');
        this.#range_line = this.getChild('#range-line');
        this.#watting    = this.getChild('#waitting');
    }

    /**
     * 
     * 设置上下文
     * 
     * @param {*} context 
     */
    setContext(context) {
        this.#context = context;
    }

    /**
     * 
     * 设置播放模式
     * 
     * @param {*} set 
     */
    setPlayingMode(set) {
        if (set) {
            this.stopPointerEventPropagation(true);
            this.style.opacity = 0.2;
            this.style.pointerEvents = 'none';
            this.selectMarker(undefined);
        } else {
            this.style.opacity = 1;
            this.style.pointerEvents = 'auto';
            this.stopPointerEventPropagation(false);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} span 
     * @param {*} offset_time 
     */
    setSpanAndOffsetTime(span, offset_time) {
        this.#offset_time = offset_time;
        this.#span        = span;
        this.updateAllMarker();
    }

    /**
     * 
     * 判断指定时间有没有标记
     * 
     * @param {*} time 
     * @returns 
     */
    getMarker(time) {
        for (const child of this.#markers.childNodes) {
            if (!(child instanceof Marker)) {
                continue;
            }

            if (Math.abs(time - child.time) < 0.01) {
                return child;
            }
        }
        return undefined;
    }

    /**
     * 
     * 在指定的事件添加
     * 
     * @param {*} time 
     * @returns 
     */
    addNewMarkerAtTime(time) {
        const object = this.#context.getRelatedObject3D();
        let marker = this.getMarker(time);
        if (!marker) {
            marker = new Marker(this);
            marker.time = time;
            marker.animation_data.copyFromObject(object);
            this.#markers.appendChild(marker);
            this.updateRangeLine();
            this.#context.makeAnimationNeedUpdate();
        }
        return marker;
    }

    /**
     * 移除一个标记
     */
    removeMarker(marker) {
        if (this.#current_selected_marker == marker) {
            this.#current_selected_marker = undefined;
        }

        if (marker && marker.parentNode == this.#markers) {
            marker.remove();
            this.updateRangeLine();
            this.#context.makeAnimationNeedUpdate();
        }
    }

    /**
     * 
     * 更新其中一个标记
     * 
     * @param {*} marker 
     */
    update(marker) {
        if (marker instanceof Marker) {
            return marker.updatePosition();
        }
    }

    /**
     * 更新全部的标记
     */
    updateAllMarker() {
        let min      = +Infinity;
        let max      = -Infinity;
        let min_time = +Infinity;
        let max_time = -Infinity;
        for (const child of this.#markers.childNodes) {
            if (!(child instanceof Marker)) {
                continue;
            }
            const position = this.update(child);
            if (position > max) max = position;
            if (position < min) min = position;

            const time = child.time;
            if (time > max_time) max_time = time;
            if (time < min_time) min_time = time;
        }

        if (max <= min) {
            this.#range_line.style.display = 'none';
        } else {
            this.#range_line.style.display = 'block';
            this.#range_line.style.left    = `${min}px`;
            this.#range_line.style.width   = `${max - min}px`;
        }

        const start = (0.0 - this.#offset_time) * this.#span;
        if (max < min || min <= start) {
            this.#watting.style.display    = 'none';
        } else {
            this.#watting.style.display    = 'block';
            this.#watting.style.left       = `${start}px`;
            this.#watting.style.width      = `${min - start}px`;
        }

        if (this.#context && min_time <= max_time) {
            this.#context.updateRange(min_time, max_time);
        }
    }

    /**
     * 更新区域线段
     */
    updateRangeLine() {
        if (this.#markers.childNodes.length <= 1) {
            this.#range_line.style.display = 'none';
        } else {
            this.updateAllMarker();
        }
    }

    /**
     * 
     * 选择指定的标记
     * 
     * @param {*} marker 
     */
    selectMarker(marker) {
        if (this.#current_selected_marker == marker) {
            return;
        }

        if (this.#current_selected_marker) {
            this.#current_selected_marker.setSelected(false);
            this.#current_selected_marker = undefined;
        }
        
        if (marker && marker.parentNode == this.#markers) {
            marker.animation_data.setToObject(this.#context.getRelatedObject3D());
            this.#context.updateCursorTime(marker.time);
            this.#current_selected_marker = marker;
            this.#current_selected_marker.setSelected(true);
            this.#context.updateSceneTransformer(false);
            this.#context.renderNextFrame();
        }
    }

    /**
     * 
     * 关注的元素的矩阵发生了变化
     * 
     * @param {*} object 
     */
    objectTransformChanged(object) {
        if (object && this.#current_selected_marker) {
            this.#current_selected_marker.animation_data.copyFromObject(object);
        }
    }

    /**
     * 
     * 收集时间轴的数据，构建cluster
     * 
     * @returns 
     */
    buildAnimationDataCluster() {
        const cluster = new AnimationDataCluster();
        for (const child of this.#markers.childNodes) {
            if (!(child instanceof Marker)) {
                continue;
            }

            // notice:
            //  这里就不拷贝了
            cluster.arr.push(child.animation_data);
        }
        cluster.sort();
        return cluster;
    }
}

CustomElementRegister(tagName, KeyframeContainer);
