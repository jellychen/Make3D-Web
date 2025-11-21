/* eslint-disable no-unused-vars */

import AnimationData         from '@core/cinderella/component-animation/track/item';
import AnimationDataCluster  from '@core/cinderella/component-animation/track/item-cluster';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Context               from './context';
import TimerAnimation        from './timer-animation';
import                            './components/controller/v';
import                            './components/keyframe-container';
import                            './components/ruler/v';
import                            './components/cursor/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard';

/**
 * 动画编辑器
 */
export default class AnimationDashboard extends Element {
    /**
     * 协调器
     */
    #coordinator;
    #coordinator_selected_container;

    /**
     * 导航条
     */
    #nav;

    /**
     * 管理器
     */
    #ec;

    /**
     * 操作的对象
     */
    #object;

    /**
     * 上下
     */
    #context = new Context();

    /**
     * 元素
     */
    #container;
    #ruler;
    #board;
    #cursor;
    #controller;

    /**
     * 动画控制
     */
    #timer_animation = new TimerAnimation(this.#context);

    /**
     * 回调函数
     */
    #on_obejct_transform_changed = event => this.#onObjectTransformChanged(event);

    /**
     * 记录进入编辑器前的数据，在退出编辑器后回滚回去
     */
    #animation_data_init = new AnimationData();

    /**
     * 动画数据
     */
    #animation_data_cluster;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator                    = coordinator;
        this.#coordinator_selected_container = coordinator.selected_container;
        this.#nav                            = coordinator.nav;
        this.#ec                             = coordinator.ec;

        // 检测 1
        if (this.#coordinator_selected_container.count() != 1) {
            throw new Error("Selected Container error");
        } else {
            this.#object = this.#coordinator_selected_container.getOneValue();
        }

        // 检测 2
        if (!this.#ec || this.#ec.getType() !== 'scene') {
            throw new Error("Ec error");
        } else {
            this.#nav.setEnable(false);
            this.#ec.setEnableSelector(false);
        }

        // 监听元素的位置发生变化
        this.#object.observerTransformChanged();
        this.#object.addEventListener('transform-changed', this.#on_obejct_transform_changed);
        this.#animation_data_init.copyFromObject(this.#object);

        // 监听动画状态
        this.#timer_animation.on_start = () => {
            this.#controller.setPlayingMode(true);
            this.#board.setPlayingMode(true);
        };

        this.#timer_animation.on_end   = () => {
            this.#controller.setPlayingMode(false);
            this.#board.setPlayingMode(false);
        };

        // 初始化
        this.createContentFromTpl(tpl);
        this.#context.getBoundingClientRect    = (           ) => this.#container.getBoundingClientRect();
        this.#context.getRelatedObject3D       = (           ) => this.#object;
        this.#context.makeSureTimeVisible      = (time, limit) => this.makeSureTimeVisible(time, limit);
        this.#context.makeAnimationNeedUpdate  = (           ) => this.#animation_data_cluster = undefined;
        this.#context.resetToFront             = (           ) => this.updateCursorTime(0);
        this.#context.updateCursorTime         = (time       ) => this.updateCursorTime(time);
        this.#context.updateAnimationAtTime    = (time       ) => this.updateAnimationAtTime(time);
        this.#context.startAnimation           = (           ) => this.startAnimation();
        this.#context.stopAnimation            = (           ) => this.stopAnimation();
        this.#context.addNewMarkerAtCursorTime = (           ) => this.addMarkerAtCursorTime();
        this.#context.selectMarker             = (marker     ) => this.#board.selectMarker(marker);
        this.#context.updateRange              = (start, end ) => this.#controller.setRange(start, end);
        this.#context.updateSceneTransformer   = (now        ) => this.#coordinator.updateTransformer(now);
        this.#context.renderNextFrame          = (           ) => this.#coordinator.renderNextFrame();
        this.#context.close                    = (           ) => this.dispose();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container   = this.getChild('#container');
        this.#ruler       = this.getChild('#ruler');
        this.#board       = this.getChild('#board');
        this.#cursor      = this.getChild('#cursor');
        this.#controller  = this.getChild('#controller');
        const offset_time = this.#ruler.getOffsetTime();
        const span        = this.#ruler.getSpan();
        this.#cursor      .setContext(this.#context);
        this.#board       .setContext(this.#context);
        this.#controller  .setContext(this.#context);
        this.#board       .setSpanAndOffsetTime(span, offset_time);
        this.#cursor      .setSpanAndOffsetTime(span, offset_time);
        this.#ruler       .onChanged = (span, offset_time) => {
            this.#board .setSpanAndOffsetTime(span, offset_time);
            this.#cursor.setSpanAndOffsetTime(span, offset_time);
        };
    }

    /**
     * 
     * 元素的
     * 
     * @param {*} event 
     */
    #onObjectTransformChanged(event) {
        this.#board.objectTransformChanged(this.#object);
    }

    /**
     * 
     * 统计动画数据
     * 
     * @returns 
     */
    #buildAnimationDataCluster() {
        if (this.#animation_data_cluster) {
            return;
        } else {
            this.#animation_data_cluster = this.#board.buildAnimationDataCluster();
        }
    }

    /**
     * 
     * 更新游标的时间
     * 
     * 单位是秒
     * 
     * @param {*} time 
     */
    updateCursorTime(time) {
        this.#cursor.setTime(time, true);
    }

    /**
     * 
     * 确保时间可见性
     * 
     * @param {*} time 
     * @param {*} limit 
     */
    makeSureTimeVisible(time, limit) {
        this.#ruler.makeSureTimeVisible(time, limit);
    }

    /**
     * 
     * 在游标指定的时间添加
     * 
     * @returns 
     */
    addMarkerAtCursorTime() {
        return this.#board.addNewMarkerAtTime(this.#cursor.time);
    }

    /**
     * 
     * 更新动画到指定的时间
     * 
     * @param {*} time 
     */
    updateAnimationAtTime(time) {
        this.#buildAnimationDataCluster();
        this.#animation_data_cluster.interpolate(time, this.#object);
        this.#coordinator.updateTransformer(false);
        this.#coordinator.renderNextFrame();
    }

    /**
     * 开始动画
     */
    startAnimation() {
        this.#animation_data_cluster = this.#board.buildAnimationDataCluster();
        if (this.#animation_data_cluster.arr.length == 0) {
            return;
        }
        this.#timer_animation.setTweenType(this.#controller.curve);
        this.#timer_animation.setLoopType(this.#controller.loop_type);
        this.#timer_animation.time_range_a = this.#animation_data_cluster.begin_time;
        this.#timer_animation.time_range_b = this.#animation_data_cluster.end_time;
        this.#timer_animation.start();
    }

    /**
     * 终止动画
     */
    stopAnimation() {
        this.#timer_animation.stop();
    }

    /**
     * 将要被移除
     */
    willRemoved() {
        this.#nav.setEnable(true);
        this.#ec.setEnableSelector(true);
        this.#object.removeEventListener('transform-changed', this.#on_obejct_transform_changed);
        this.#object.unobserverTransformChanged();
        this.#animation_data_init.setToObject(this.#object);
        this.#context.renderNextFrame();
        this.#context.updateSceneTransformer(false);
        this.#timer_animation.stop();
    }

    /**
     * 销毁
     * 
     * 会间接调用 willRemoved
     * 
     */
    dispose() {
        this.#coordinator.abattoir.dashboard.clear();
    }
}

CustomElementRegister(tagName, AnimationDashboard);