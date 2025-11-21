
import WebGL_LinePath               from './line/line-path';
import WebGL_LinePathBuffer         from './line/line-path-buffer';
import WebGL_LineSegmentsColor      from './line/line-segments-color';
import WebGL_LineSegmentsDash       from './line/line-segments-dash';
import WebGL_LineSegmentsImmediate  from './line/line-segments-immediate';
import WebGL_LineSegments           from './line/line-segments';
import WebGL_PointRound             from './point/point-round';
import WebGL_Box                    from './box/box';
import WebGL_LightIcon              from './misc/light-icon';

import WebGPU_LinePath              from './webgpu/line/line-path';
import WebGPU_LinePathBuffer        from './webgpu/line/line-path-buffer';
import WebGPU_LineSegmentsColor     from './webgpu/line/line-segments-color';
import WebGPU_LineSegmentsDash      from './webgpu/line/line-segments-dash';
import WebGPU_LineSegmentsImmediate from './webgpu/line/line-segments-immediate';
import WebGPU_LineSegments          from './webgpu/line/line-segments';
import WebGPU_PointRound            from './webgpu/point/point-round';
import WebGPU_Box                   from './webgpu/box/box';
import WebGPU_LightIcon             from './webgpu/misc/light-icon';

/**
 * 输出
 */
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
        this.LinePath                   = WebGL_LinePath;
        this.LinePathBuffer             = WebGL_LinePathBuffer;
        this.LineSegmentsColor          = WebGL_LineSegmentsColor;
        this.LineSegmentsDash           = WebGL_LineSegmentsDash;
        this.LineSegmentsImmediate      = WebGL_LineSegmentsImmediate;
        this.LineSegments               = WebGL_LineSegments;
        this.PointRound                 = WebGL_PointRound;
        this.Box                        = WebGL_Box;
        this.LightIcon                  = WebGL_LightIcon;
    }

    /**
     * 默认使用WebGPU
     */
    setDefaultWebGPU() {
        this.LinePath                   = WebGPU_LinePath;
        this.LinePathBuffer             = WebGPU_LinePathBuffer;
        this.LineSegmentsColor          = WebGPU_LineSegmentsColor;
        this.LineSegmentsDash           = WebGPU_LineSegmentsDash;
        this.LineSegmentsImmediate      = WebGPU_LineSegmentsImmediate;
        this.LineSegments               = WebGPU_LineSegments;
        this.PointRound                 = WebGPU_PointRound;
        this.Box                        = WebGPU_Box;
        this.LightIcon                  = WebGPU_LightIcon;
    }
}