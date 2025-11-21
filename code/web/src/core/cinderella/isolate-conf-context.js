/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import IsolateConf from './isolate-conf';
import Stack       from './isolate-conf-context-stack';

/**
 * 快捷设置
 */
export default class IsolateConfContext {
    /**
     * 元素
     */
    #isolate;

    /**
     * 渲染相关
     */
    #renderer;
    #renderer_pipeline;

    /**
     * 获取场景
     */
    get scene() {
        return this.#renderer_pipeline.scene;
    }

    /**
     * 获取坐标系
     */
    get coordinate() {
        return this.#renderer_pipeline.coordinate;
    }

    /**
     * 获取游标
     */
    get cursor() {
        return this.#renderer_pipeline.cursor;
    }

    /**
     * 获取游标
     */
    get localizer() {
        return this.#renderer_pipeline.localizer;
    }

    /**
     * 获取选择框
     */
    get selectbox() {
        return this.#renderer_pipeline.selectbox;
    }

    /**
     * 获取拖动柄
     */
    get haft() {
        return this.#renderer_pipeline.haft;
    }

    /**
     * 获取变换组件
     */
    get transformer() {
        return this.#renderer_pipeline.transformer;
    }

    /**
     * 获取面侦测
     */
    get plane_detector() {
        return this.#renderer_pipeline.plane_detector;
    }

    /**
     * 获取覆盖层
     */
    get overlapped() {
        return this.#renderer_pipeline.overlapped;
    }

    /**
     * 获取相机预览
     */
    get camera_preview() {
        return this.#renderer_pipeline.camera_preview;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} isolate 
     * @param {*} renderer 
     * @param {*} renderer_pipeline 
     */
    constructor(isolate, renderer, renderer_pipeline) {
        this.#isolate  = isolate;
        this.#renderer = renderer;
        this.#renderer_pipeline = renderer_pipeline;
    }

    /**
     * 
     * 备份配置选项
     * 
     * @returns 
     */
    makeConfSnapshot() {
        return new IsolateConf(this.#renderer_pipeline);
    }

    /**
     * 
     * 设置场景渲染
     * 
     * @param {boolean} enable 
     */
    setEnableRenderScene(enable) {
        this.#renderer_pipeline.setEnableRenderScene(enable);
    }

    /**
     * 
     * 设置是否支持灯光
     * 
     * @param {*} enable 
     */
    setEnableLights(enable) {
        this.#renderer_pipeline.setEnableLights(enable);
    }

    /**
     * 
     * 场景阴影
     * 
     * @param {boolean} enable 
     */
    setEnableSceneShadow(enable) {
        this.#renderer_pipeline.setEnableSceneShadow(enable);
    }

    /**
     * 
     * 渲染游标
     * 
     * @param {boolean} enable 
     */
    setEnableCursor(enable) {
        this.#renderer_pipeline.setEnableCursor(true === enable);
    }

    /**
     * 
     * 渲染游标
     * 
     * @param {*} enable 
     */
    setEnableLocalizer(enable) {
        this.#renderer_pipeline.setEnableLocalizer(true === enable);
    }

    /**
     * 
     * 设置坐标轴
     * 
     * @param {boolean} enable 
     */
    setEnableCoordinate(enable) {
        this.#renderer_pipeline.setEnableCoordinate(enable);
    }

    /**
     * 
     * 设置描边
     * 
     * @param {boolean} enable 
     */
    setEnableOutline(enable) {
        this.#renderer_pipeline.setEnableOutline(enable);
    }

    /**
     * 
     * 设置描边高亮
     * 
     * @param {boolean} enable 
     */
    setEnableOutlineHighlight(enable) {
        this.#renderer_pipeline.setEnableOutlineHighlight(enable);
    }

    /**
     * 
     * 设置边缘增强
     * 
     * @param {boolean} enable 
     */
    setEnableEdgeEnhancement(enable) {
        this.#renderer_pipeline.setEnableEdgeEnhancement(enable);
    }

    /**
     * 
     * 设置变幻组件
     * 
     * @param {*} enable 
     */
    setEnableTransformerGlobal(enable) {
        this.#renderer_pipeline.setEnableTransformerGlobal(enable);
    }

    /**
     * 
     * 设置变幻组件
     * 
     * @param {boolean} enable 
     */
    setEnableTransformer(enable) {
        this.#renderer_pipeline.setEnableTransformer(enable);
    }

    /**
     * 
     * 设置
     * 
     * @param {Boolean} enable 
     */
    setEnableHaft(enable) {
        this.#renderer_pipeline.setEnableHaft(enable);
    }

    /**
     * 
     * 设置
     * 
     * @param {Boolean} enable 
     */
    setEnablePlaneDetector(enable) {
        this.#renderer_pipeline.setEnablePlaneDetector(enable);
    }

    /**
     * 
     * 设置选择框
     * 
     * @param {Boolean} enable 
     */
    setEnableSelectBox(enable) {
        this.#renderer_pipeline.setEnableSelectBox(enable);
    }

    /**
     * 默认设置
     */
    setResetDefault() {
        this.reset();
    }

    /**
     * 关闭全部
     */
    setDisableAll() {
        this.setEnableRenderScene(false);
        this.setEnableSceneShadow(false);
        this.setEnableCursor(false);
        this.setEnableLocalizer(false);
        this.setEnableCoordinate(false);
        this.setEnableOutline(false);
        this.setEnableOutlineHighlight(false);
        this.setEnableEdgeEnhancement(false);
        this.setEnableTransformer(false);
        this.setEnableHaft(false);
        this.setEnablePlaneDetector(false);
        this.setEnableSelectBox(false);
    }

    /**
     * 全部关闭
     */
    reset() {
        this.setEnableRenderScene(true);
        this.setEnableSceneShadow(false);
        this.setEnableCursor(true);
        this.setEnableLocalizer(false);
        this.setEnableCoordinate(true);
        this.setEnableOutline(false);
        this.setEnableOutlineHighlight(false);
        this.setEnableEdgeEnhancement(false);
        this.setEnableTransformer(false);
        this.setEnableHaft(false);
        this.setEnablePlaneDetector(false);
        this.setEnableSelectBox(false);
    }

    /**
     * 存储当前
     */
    save() {
        Stack.Default().save(this.makeConfSnapshot());
    }

    /**
     * 回滚
     */
    restore() {
        Stack.Default().restore();
    }
}
