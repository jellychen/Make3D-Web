/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

export default class IsolateConf {
    /**
     * 渲染器
     */
    #rp;

    /**
     * 开关配置
     */
    #enable_render_scene      = true ; // 开启在编模型的独立显示
    #enable_lights            = true ; // 是否开启灯光支持
    #enable_shadow            = true ; // 开启阴影 
    #enable_coordinate        = true ; // 绘制坐标
    #enable_cursor            = false; // 渲染游标
    #enable_localizer         = false; // 渲染游标
    #enable_plane_detector    = false; // 面侦测
    #enable_outline_highlight = false; // 绘制高亮描边
    #enable_outline           = false; // 绘制描边
    #enable_edge_enhancement  = false; // 边缘增强
    #enable_postprocess       = true ; // 后处理开关
    #enable_transformer       = false; // 变换组件
    #enable_haft              = false; // 拖动
    #enable_select_box        = false; // 框选

    /**
     * 
     * 构造函数
     * 
     * @param {*} renderer_pipeline 
     */
    constructor(renderer_pipeline) {
        this.#rp = renderer_pipeline;
        this.capture();
    }

    /**
     * 捕获
     */
    capture() {
        this.#enable_render_scene      = this.#rp.isEnableRenderScene();
        this.#enable_lights            = this.#rp.isEnableLights();
        this.#enable_shadow            = this.#rp.isEnableSceneShadow();
        this.#enable_coordinate        = this.#rp.isEnableCoordinate();
        this.#enable_cursor            = this.#rp.isEnableCursor();
        this.#enable_localizer         = this.#rp.isEnableLocalizer();
        this.#enable_plane_detector    = this.#rp.isEnablePlaneDetector();
        this.#enable_outline_highlight = this.#rp.isEnableOutlineHighlight();
        this.#enable_outline           = this.#rp.isEnableOutline();
        this.#enable_edge_enhancement  = this.#rp.isEnableEdgeEnhancement();
        this.#enable_postprocess       = this.#rp.isEnablePostprocess();
        this.#enable_transformer       = this.#rp.isEnableTransformerGlobal();
        this.#enable_haft              = this.#rp.isEnableHaft();
        this.#enable_select_box        = this.#rp.isEnableSelectBox();
    }

    /**
     * 设置
     */
    makeCurrent() {
        this.#rp.setEnableRenderScene(this.#enable_render_scene);
        this.#rp.setEnableLights(this.#enable_lights);
        this.#rp.setEnableSceneShadow(this.#enable_shadow);
        this.#rp.setEnableCoordinate(this.#enable_coordinate);
        this.#rp.setEnableCursor(this.#enable_cursor);
        this.#rp.setEnableLocalizer(this.#enable_localizer);
        this.#rp.setEnablePlaneDetector(this.#enable_plane_detector);
        this.#rp.setEnableOutlineHighlight(this.#enable_outline_highlight);
        this.#rp.setEnableOutline(this.#enable_outline);
        this.#rp.setEnableEdgeEnhancement(this.#enable_edge_enhancement);
        this.#rp.setEnablePostprocess(this.#enable_postprocess);
        this.#rp.setEnableTransformerGlobal(this.#enable_transformer);
        this.#rp.setEnableHaft(this.#enable_haft);
        this.#rp.setEnableSelectBox(this.#enable_select_box);
    }
}
