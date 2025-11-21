/* eslint-disable no-unused-vars */

import XThree                   from '@xthree/basic';
import DefaultMatcapMaterial    from './default-matcap-material';
import DefaultHighlightMaterial from '@xthree/material/sculptor-default-surface';

/**
 * Surface
 */
export default class Surface extends XThree.Mesh {
    /**
     * 
     * 构造函数
     * 
     * @param {*} geometry 
     * @param {*} highlight 
     * @param {*} render_order 
     */
    constructor(geometry, highlight = false, render_order = 1) {
        super();

        // 渲染次序
        this.renderOrder = render_order;

        // 关闭踢出
        this.frustumCulled = false;

        // 几何
        this.geometry = geometry;

        // 调整材质参数
        if (highlight) {
            this.material = DefaultHighlightMaterial;
            this.material.polygonOffset       = true;
            this.material.polygonOffsetFactor = 1;
            this.material.polygonOffsetUnits  = 1;
            this.material.side = XThree.FrontSide;
        } else {
            this.material = DefaultMatcapMaterial.getMaterial();
            this.material.polygonOffset       = true;
            this.material.polygonOffsetFactor = 1;
            this.material.polygonOffsetUnits  = 3;
            this.material.side = XThree.DoubleSide;
        }
    }

    /**
     * 销毁
     */
    dispose() {

    }
}
