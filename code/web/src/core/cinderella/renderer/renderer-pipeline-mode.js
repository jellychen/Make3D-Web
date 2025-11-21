
/**
 * 用来便捷的设置渲染流水的模式
 */
export default class RendererPipelineMode {
    /**
     * 管线
     */
    #renderer_pipeline;
    
    /**
     * scene
     */
    #scene;

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     * @param {*} pipeline 
     */
    constructor(scene, pipeline) {
        this.#scene             = scene;
        this.#renderer_pipeline = pipeline;
    }

    /**
     * 设置性能模式
     */
    setMode_Performance() {
        this.#scene.setEnablePerformanceMode(true);                 // 使用性能材质
        this.#renderer_pipeline.setEnableSceneShadow(false);        // 关闭阴影
        this.#renderer_pipeline.setEnableEdgeEnhancement(true);     // 开启边缘增强
        this.#renderer_pipeline.setEnablePostprocess(false);        // 关闭后处理
    }

    /**
     * 设置普通模式，只有在这种模式下才有阴影
     */
    setMode_Normal() {
        this.#scene.setEnablePerformanceMode(false);                // 使用性能材质
        this.#renderer_pipeline.setEnableSceneShadow(true);         // 开启阴影
        this.#renderer_pipeline.setEnableEdgeEnhancement(false);    // 关闭边缘增强
        this.#renderer_pipeline.setEnablePostprocess(true);         // 允许后处理
    }

    /**
     * 设置编辑模式
     */
    setMode_Editing() {
        this.#scene.setEnablePerformanceMode(true);                 // 使用性能材质
        this.#renderer_pipeline.setEnableSceneShadow(false);        // 关闭阴影
        this.#renderer_pipeline.setEnableEdgeEnhancement(false);    // 开启边缘增强
        this.#renderer_pipeline.setEnablePostprocess(false);        // 关闭后处理
    }
}
