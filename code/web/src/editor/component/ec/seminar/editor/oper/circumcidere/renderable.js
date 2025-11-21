/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isFunction   from 'lodash/isFunction';
import XThree       from '@xthree/basic';
import GlobalScope  from '@common/global-scope';
import LAA          from '../../renderable/line-segments-antialias';
import Constants    from './constants';

/**
 * 用来承载 辅助的显示信息
 */
export default class Renderable extends XThree.Group {
    /**
     * 核心的协调器
     */
    #coordinator;

    /**
     *  元素
     */
    #e0 = new LAA(); // 用来显示辅助线
    #e1 = new LAA(); // 用来显示辅助线
    
    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super();
        this.#coordinator = coordinator;

        // 构建结构
        this.add(this.#e0);
        this.add(this.#e1);

        // 配置显示效果
        this.#e0.visible = false;
        this.#e0.renderOrder = 10;
        this.#e0.setPolygonOffset(true, -3, -3);
        this.#e0.setColor(Constants.COLOR_EDGES_FRONT);
        this.#e0.setEnableWriteDepth(true);
        this.#e0.setEnableDepthTest(true, XThree.LessEqualDepth);
        this.#e1.visible = false;
        this.#e1.renderOrder = 10;
        this.#e1.setPolygonOffset(true, -3, -3);
        this.#e1.setColor(Constants.COLOR_EDGES_BACK);
        this.#e1.setEnableWriteDepth(true);
        this.#e1.setEnableDepthTest(true, XThree.GreaterDepth);
    }

    /**
     * 
     * 渲染之前准备
     * 
     * @param {*} renderer_pipeline 
     * @param {*} renderer 
     * @param {*} camera 
     */
    onFrameBegin(renderer_pipeline, renderer, camera) {
        ;
    }

    /**
     * 
     * 渲染结束
     * 
     * @param {*} renderer_pipeline 
     * @param {*} renderer 
     * @param {*} camera 
     */
    onFrameEnd(renderer_pipeline, renderer, camera) {
        ;
    }

    /**
     * 
     * 设置是否高亮显示
     * 
     * @param {boolean} highlight 
     */
    setShowHighlight(highlight) {
        highlight =  true == highlight;
        if (!highlight) {
            this.#e0.setColor(Constants.COLOR_EDGES_FRONT);
            this.#e1.setColor(Constants.COLOR_EDGES_BACK );
        } else {
            this.#e0.setColor(Constants.COLOR_EDGES_FRONT_HIGHLIGHT);
            this.#e1.setColor(Constants.COLOR_EDGES_BACK_HIGHLIGHT );
        }

        if (this.#e0.visible || this.#e1.visible) {
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 显示/隐藏
     * 
     * @param {boolean} show 
     */
    setShowEdges(show) {
        show = true == show;
        if (this.#e0.visible == show && this.#e1.visible == show) {
            return;
        } else {
            this.#e0.visible = show;
            this.#e1.visible = show;
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 设置线段的点
     * 
     * @param {Float32Array} points 
     */
    setEdgesSegments(points) {
        this.#e0.setSegments(points);
        this.#e1.setSegments(points);
        if (this.#e0.visible || this.#e0.visible) {
            this.renderNextFrame();
        }
    }

    /**
     * 下一帧渲染
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        this.#e0.dispose();
        this.#e1.dispose();
    }
}
