/* eslint-disable no-undef */

import Coordinate from './renderable/coordinate';
import Curves     from './renderable/curves';
import Points     from './renderable/points';
import Segments   from './renderable/segments';
import SelectBox  from './renderable/select-box';

/**
 * 渲染
 */
export default class ColosseumRenderer {
    /**
     * 截面
     */
    #curve_data;

    /**
     * 绘制元素
     */
    #coordinate        = new Coordinate();
    #curves            = new Curves    ('#FFFFFF'   );
    #points_selected   = new Points    ('#005DF2', 4);
    #points_unselected = new Points    ('#755FE2', 4);
    #handle_segments   = new Segments  ('#059554', 1);

    /**
     * 交换渲染元素
     */
    #i_points          = new Points    ('#006DF2', 4);
    #i_curves          = new Curves    ('#3ecf8e', 2);
    #i_select_box      = new SelectBox ('#FF0000'   );

    /**
     * 记录
     */
    #point_hover_x = undefined;
    #point_hover_y = undefined;

    /**
     * 需要更新
     */
    need_update = true;

    /**
     * 获取
     */
    get i_points() {
        return this.#i_points;
    }

    /**
     * 获取
     */
    get select_box() {
        return this.#i_select_box;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} curve 
     */
    constructor(curve) {
        this.#curve_data = curve;
        this.#curves  .setCurves(curve);
        this.#i_curves.setCurves(curve);

        this.#i_points.visible     = false;
        this.#i_curves.visible     = false;
        this.#i_select_box.visible = false;
    }

    /**
     * 
     * 设置显示的hover 点
     * 
     * @param {*} enable 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    setInteractPoint(enable, x, y) {
        let changed = false;
        if (enable) {
            if (this.#i_points.visible) {
                ;
            } else {
                changed = true;
                this.#i_points.visible = true;
            }

            if (this.#point_hover_x != x || this.#point_hover_y != y) {
                changed = true;
                this.#point_hover_x = x;
                this.#point_hover_y = y;
                this.#i_points.setPoints([x, y]);
            }
        } else if (this.#i_points.visible) {
            changed = true;
            this.#i_points.visible = false;
        }
        return changed;
    }

    /**
     * 
     * 设置显示的hover的曲线
     * 
     * @param {*} enable 
     * @param {*} index 
     * @returns 
     */
    setInteractCurve(enable, index) {
        let changed = false;
        if (enable) {
            if (this.#i_curves.visible) {
                ;
            } else {
                changed = true;
                this.#i_curves.visible = true;
            }

            if (this.#i_curves.curves_index != index) {
                changed = true;
                this.#i_curves.setCurve(this.#curve_data, index);
            }
        } else if (this.#i_curves.visible) {
            changed = true;
            this.#i_curves.visible = false;
        }
        return changed;
    }

    /**
     * 
     * 更新缩放系数
     * 
     * @param {*} scale 
     */
    updateScale(scale) {
        this.#coordinate.scale        = scale;
        this.#curves.scale            = scale;
        this.#points_selected.scale   = scale;
        this.#points_unselected.scale = scale;
        this.#handle_segments.scale   = scale;
        this.#i_points.scale          = scale;
        this.#i_curves.scale          = scale;
        this.#i_select_box.scale      = scale;
    }

    /**
     * 更新数据
     */
    update() {
        this.need_update = false;
        this.#points_selected  .setPoints(this.#curve_data.selectedPoints());
        this.#points_unselected.setPoints(this.#curve_data.unselectedPoints());
        this.#handle_segments.setSegments(this.#curve_data.handleSegments());
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     */
    draw(renderer) {
        if (this.need_update) {
            this.update();
        }
        
        this.#coordinate       .draw(renderer);
        this.#curves           .draw(renderer);
        this.#handle_segments  .draw(renderer);
        this.#points_unselected.draw(renderer);
        this.#points_selected  .draw(renderer);
        this.#i_curves         .draw(renderer);
        this.#i_points         .draw(renderer);
        this.#i_select_box     .draw(renderer);
    }
}

