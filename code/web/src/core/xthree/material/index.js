
import WebGL_Aspect_Color               from './aspect-color';
import WebGL_Aspect_Color_Not_Smooth    from './aspect-color-not-smooth';
import WebGL_Copy                       from './copy';
import WebGL_Coordinate                 from './coordinate';
import WebGL_MASK_COLOR_SOLID           from './mask-color-solid';
import WebGL_MASK_COLOR                 from './mask-color';
import WebGL_EDGE_ENHANCEMENT           from './edge-enhancement';
import WebGL_SOBEL                      from './sobel';
import WebGL_CIRCLEPATTERN              from './circle-pattern';
import WebGL_RAIL_FADEOUT_COLOR         from './rail-fadeout-color';

import WebGPU_Aspect_Color              from './webgpu/aspect-color';
import WebGPU_Aspect_Color_Not_Smooth   from './webgpu/aspect-color-not-smooth';
import WebGPU_Copy                      from './webgpu/copy';
import WebGPU_Coordinate                from './webgpu/coordinate';
import WebGPU_MASK_COLOR_SOLID          from './webgpu/mask-color-solid';
import WebGPU_MASK_COLOR                from './webgpu/mask-color';
import WebGPU_RAIL_FADEOUT_COLOR        from './webgpu/rail-fadeout-color';
import WebGPU_SOBEL                     from './webgpu/sobel';
import WebGPU_EDGE_ENHANCEMENT          from './webgpu/edge-enhancement';
import WebGPU_CIRCLEPATTERN             from './webgpu/circle-pattern';

// 导出
export default new class {
    /**
     * 构造函数
     */
    constructor() {
        this.setDefaultWebGL();
    }

    /**
     * 使用Webgl
     */
    setDefaultWebGL() {
        this.AspectColor          = WebGL_Aspect_Color;
        this.AspectColorNotSmooth = WebGL_Aspect_Color_Not_Smooth;
        this.MaskColorSolid       = WebGL_MASK_COLOR_SOLID;
        this.MaskColor            = WebGL_MASK_COLOR;
        this.Copy                 = WebGL_Copy;
        this.Coordinate           = WebGL_Coordinate;
        this.EdgeEnhancement      = WebGL_EDGE_ENHANCEMENT;
        this.SOBEL                = WebGL_SOBEL;
        this.CirclePattern        = WebGL_CIRCLEPATTERN;
        this.RailFadeoutColor     = WebGL_RAIL_FADEOUT_COLOR;
    }

    /**
     * 默认使用WebGPU
     */
    setDefaultWebGPU() {
        this.AspectColor          = WebGPU_Aspect_Color;
        this.AspectColorNotSmooth = WebGPU_Aspect_Color_Not_Smooth;
        this.MaskColorSolid       = WebGPU_MASK_COLOR_SOLID;
        this.MaskColor            = WebGPU_MASK_COLOR;
        this.Copy                 = WebGPU_Copy;
        this.Coordinate           = WebGPU_Coordinate;
        this.EdgeEnhancement      = WebGPU_EDGE_ENHANCEMENT;
        this.SOBEL                = WebGPU_SOBEL;
        this.CirclePattern        = WebGPU_CIRCLEPATTERN;
        this.RailFadeoutColor     = WebGPU_RAIL_FADEOUT_COLOR;
    }
};