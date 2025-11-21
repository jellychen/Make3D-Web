/* eslint-disable no-unused-vars */

import Position              from '@common/misc/compute-visible-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowMoreMenu          from './v-more';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-uv';

/**
 * 菜单项
 */
export default class BizNavToolbarUV extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * c++ 元素
     */
    #connector;

    /**
     * 显示
     */
    #arena

    /**
     * UV 展示器
     */
    #presenter;

    /**
     * 元素
     */
    #unfold;
    #save;
    #more;
    #mark;
    #unmark;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} presenter 
     * @param {*} connector 
     * @param {*} arena 
     */
    constructor(coordinator, presenter, connector, arena) {
        super(tagName);
        this.#coordinator = coordinator;
        this.#presenter   = presenter;
        this.#connector   = connector;
        this.#arena       = arena;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#unfold = this.getChild('#unfold');
        this.#save   = this.getChild('#save');
        this.#more   = this.getChild('#more');
        this.#mark   = this.getChild('#mark');
        this.#unmark = this.getChild('#unmark');
        this.#unfold.onclick = () => this.#presenter.unfold();
        this.#save  .onclick = () => this.#presenter.saveAsPng();
        this.#mark  .onclick = event => this.#onClickMark(event);
        this.#unmark.onclick = event => this.#onClickUnmark(event);
        this.#more  .onclick = event => this.#onClickMore(event);
    }

    /**
     * 
     * 点击标记
     * 
     * @param {*} event 
     */
    #onClickMark(event) {
        if (this.#connector.add_current_selected_stitiched_edge()) {
            this.#arena.updateEdges();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 点击取消标记
     * 
     * @param {*} event 
     */
    #onClickUnmark(event) {
        if (this.#connector.del_current_selected_stitiched_edge()) {
            this.#arena.updateEdges();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 点击更多
     * 
     * @param {*} event 
     */
    #onClickMore(event) {
        ShowMoreMenu(this.#coordinator, this, this.#more);
    }

    /**
     * 
     * 在指定的位置显示菜单
     * 
     * @param {*} x 
     * @param {*} y 
     */
    showMore(x, y) {
        const menu = ShowMoreMenu(this.#coordinator, this);
        const w = document.body.clientWidth;
        const h = document.body.clientHeight;
        x = x || 0;
        y = y || 0;
        Position.ComputeVisiblePosition(menu, x, y, w, h);
    }

    /**
     * 取消全部的标记缝合边
     */
    unmarkAllStitchedEdges() {
        if (this.#connector && this.#connector.remove_all_stitched_edges()) {
            this.#arena.updateEdges();
            this.#arena.renderNextFrame();
        }
    }

    /**
     * 取消全部选择的边
     */
    unselectAllEdges() {
        if (this.#connector && this.#connector.unselected_all_edges()) {
            this.#arena.updateEdges();
            this.#arena.renderNextFrame();
        }
    }

    /**
     * 球面投影
     */
    UV_UnfoldSphere() {
        if (this.#connector && this.#connector.unfold_spherical()) {
            this.#presenter.update();
            this.#presenter.renderNextFrame();
        }
    }

    /**
     * 柱面投影
     */
    UV_UnfoldCylinder() {
        if (this.#connector && this.#connector.unfold_cylindrical()) {
            this.#presenter.update();
            this.#presenter.renderNextFrame();
        }
    }

    /**
     * 三平面投影
     */
    UV_UnfoldTriplanar() {
        if (this.#connector && this.#connector.unfold_triplanar()) {
            this.#presenter.update();
            this.#presenter.renderNextFrame();
        }
    }

    /**
     * 基于缝合边
     */
    UV_UnfoldStitchedEdges() {
        this.#presenter.unfold();
    }

    /**
     * 移除全部的UV数据
     */
    UV_Clear() {
        if (this.#connector && this.#connector.remove_uv_data()) {
            this.#presenter.update();
            this.#presenter.renderNextFrame();
        }
    }

    /**
     * 下一帧渲染
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }
}

CustomElementRegister(tagName, BizNavToolbarUV);
