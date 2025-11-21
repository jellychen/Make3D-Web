/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';
import GlobalScope      from '@common/global-scope';
import LAA              from '../../renderable/line-segments-antialias';
import Constants        from './constants';

/**
 * 用来承载 辅助的显示信息
 */
export default class Renderable extends XThree.Group {
    /**
     * 核心的协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #e0 = new LAA();        // 用来显示辅助线
    #p0 = new XThreeRenderable.PointRound(); // 用来显示辅助点
    #p1 = new XThreeRenderable.PointRound(); // 用来显示辅助点

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
        this.add(this.#p0);
        this.add(this.#p1);

        // 配置显示效果
        this.#e0.visible = false;
        this.#e0.renderOrder = 10;
        this.#e0.setEnableWriteDepth(false);
        this.#e0.setEnableDepthTest(false);
        this.#e0.setColor(Constants.EDGE_COLOR);
        this.#p0.visible = false;
        this.#p0.renderOrder = 11;
        this.#p0.setEnableWriteDepth(false);
        this.#p0.setEnableDepthTest(false);
        this.#p0.setColor(Constants.POINT_COLOR);
        this.#p0.setSize(Constants.POINT_SIZE);
        this.#p0.setFeather(1.0);
        this.#p1.visible = false;
        this.#p1.renderOrder = 12;
        this.#p1.setEnableWriteDepth(false);
        this.#p1.setEnableDepthTest(false);
        this.#p1.setColor(Constants.POINT_COLOR);
        this.#p1.setSize(Constants.POINT_SIZE);
        this.#p1.setFeather(1.0);
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
     * 隐藏全部
     */
    hiddenAll() {
        this.#e0.visible = false;
        this.#p0.visible = false;
        this.#p1.visible = false;
        this.renderNextFrame();
    }

    /**
     * 
     * 显示/隐藏 线段
     * 
     * @param {boolean} show 
     */
    setShowEdges(show) {
        show = true == show;
        if (this.#e0.visible == show) {
            return;
        } else {
            this.#e0.visible = show;
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
        if (this.#e0.visible) {
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 显示/隐藏 点
     * 
     * @param {boolean} show 
     */
    setShowPoints_0(show) {
        show = true == show;
        if (this.#p0.visible == show) {
            return;
        } else {
            this.#p0.visible = show;
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 设置点
     * 
     * @param {Float32Array} points 
     */
    setPoints_0(points) {
        this.#p0.setPoints(points, true);
        if (this.#p0.visible) {
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 显示/隐藏 点
     * 
     * @param {boolean} show 
     */
    setShowPoints_1(show) {
        show = true == show;
        if (this.#p1.visible == show) {
            return;
        } else {
            this.#p1.visible = show;
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 设置点
     * 
     * @param {Float32Array} points 
     */
    setPoints_1(points) {
        this.#p1.setPoints(points, true);
        if (this.#p1.visible) {
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
        this.#p0.dispose();
        this.#p1.dispose();
    }
}
