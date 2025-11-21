/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 用来记录插入数据
 */
export default class SelectedContainer {
    /**
     * 协调器
     */
    coordinator;

    /**
     * 核心渲染器
     */
    cinderella;
    cinderella_outline_scene_subtree;
    cinderella_renderer_pipeline;

    /**
     * 场景
     */
    scene;

    /**
     * 数据
     */
    set;

    /**
     * 临时变量
     */
    vec3_0 = new XThree.Vector3();
    vec3_1 = new XThree.Vector3();
    vec3_2 = new XThree.Vector3();

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} scene 
     */
    constructor(coordinator, scene) {
        this.coordinator                      = coordinator;
        this.cinderella                       = this.coordinator.cinderella;
        this.cinderella_renderer_pipeline     = this.cinderella.renderer_pipeline;
        this.cinderella_outline_scene_subtree = this.cinderella_renderer_pipeline.outline_scene_subtree;
        this.set                              = this.cinderella_renderer_pipeline.outline_scene_subtree.data;
        this.scene                            = scene;
    }
}
