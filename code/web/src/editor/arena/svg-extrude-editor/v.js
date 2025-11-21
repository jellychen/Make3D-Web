/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isString              from 'lodash/isString';
import isNumber              from 'lodash/isNumber';
import Animation             from '@common/misc/animation';
import SvgLoader             from '@core/cinderella/mesh/svg.loader';
import SvgExtrudeConf        from '@core/cinderella/mesh/svg.extrude.conf';
import OBJ_ExportDownload    from '@core/cinderella/export/obj-download';
import STL_ExportDownload    from '@core/cinderella/export/stl-download';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Renderer              from './renderer';
import CloseAlert            from './v-close-alert';
import Error                 from './v-error';
import BoundConstraint       from './bound-constraint';
import Conf                  from './v-conf';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-svg-extrude-editor';

/**
 * SVG 挤出器
 */
export default class Editor extends Element {
    /**
     * 协调器
     */
    coordinator;

    /**
     * 元素
     */
    container;
    content;
    close;
    canvas;
    conf;

    /**
     * 尺寸发生变化
     */
    canvas_resize_observer;

    /**
     * 加载失败
     */
    parse_svg_data_error = false;

    /**
     * 渲染器
     */
    renderer;

    /**
     * 渲染的元素
     */
    svg_mesh_group;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} svg_str 
     */
    constructor(coordinator, svg_str) {
        super(tagName);
        this.coordinator = coordinator;
        this.setEnableCustomizeMenu(true);
        this.createContentFromTpl(tpl);
        this.#loadSvgStr(svg_str);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.container     = this.getChild('#container');
        this.content       = this.getChild('#content');
        this.close         = this.getChild('#close');
        this.canvas        = this.getChild('#canvas');
        this.conf          = this.getChild('#conf');
        this.renderer      = new Renderer(this.canvas);
        this.close.onclick = event => this.#onClickClose(event);
        this.conf.setHostEditor(this);
    }

    /**
     * 插入到Dom
     */
    connectedCallback() {
        super.connectedCallback();
        
        Animation.Try(this.container, {
            translateY: [-60, 0],
            opacity   : [0, 1],
            duration  : 400,
            easing    : 'easeOutCubic',
        });

        this.canvas_resize_observer = new ResizeObserver(entries => this.#onResize());
        this.canvas_resize_observer.observe(this.canvas);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (undefined != this.canvas_resize_observer) {
            this.canvas_resize_observer.unobserve(this.canvas);
            this.canvas_resize_observer.disconnect();
            this.canvas_resize_observer = undefined;
        }
    }

    /**
     * 
     * 点击关闭
     * 
     * @param {*} event 
     */
    #onClickClose(event) {
        if (this.parse_svg_data_error) {
            this.dismiss();
        } else {
            const alert = new CloseAlert();
            alert.onclick_close = () => this.dismiss();
            this.container.appendChild(alert);
        }
    }

    /**
     * 显示错误信息
     */
    #showError() {
        const error = new Error();
        error.onclose = () => this.dismiss();
        this.content.appendChild(error);
    }

    /**
     * 
     * 加载SVG字符串
     * 
     * @param {*} str 
     */
    #loadSvgStr(str) {
        let group; 
        try {
            group = SvgLoader(str);
        } catch(e) {
            console.error(e);
        }

        if (!group) {
            this.parse_svg_data_error = true;
            this.#showError();
            return;
        }

        BoundConstraint.Adjustment(group);

        this.renderer.setRenderObject(group);
        this.svg_mesh_group = group;
        this.svg_mesh_group.setName('SVG', this);
    }

    /**
     * 
     * 更新
     * 
     * @param {*} conf 
     */
    updateConf(conf) {
        if (this.svg_mesh_group && this.svg_mesh_group.isGroup) {
            for (const mesh of this.svg_mesh_group.children) {
                if (isFunction(mesh.update)) {
                    try {
                        mesh.update(conf);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            BoundConstraint.Adjustment(this.svg_mesh_group);
            this.renderer.render();
        }
    }

    /**
     * 当尺寸发生变化的时候
     */
    #onResize() {
        const ratio = window.devicePixelRatio || 1;
        const w = this.canvas.offsetWidth;
        const h = this.canvas.offsetHeight;
        this.canvas.width  = ratio * w;
        this.canvas.height = ratio * h;
        this.renderer.resize(ratio, w, h);
    }

    /**
     * 销毁
     */
    dismiss() {
        if (this.svg_mesh_group) {
            this.svg_mesh_group.disposeAndAllChildren();
            this.svg_mesh_group = undefined;
        }

        Animation.Try(this, {
            opacity   : [1, 0],
            duration  : 400,
            easing    : 'easeOutCubic',
        });

        Animation.Try(this.container, {
            translateY: [0, -60],
            opacity   : [1, 0],
            duration  : 400,
            easing    : 'easeOutCubic',
            onComplete: () => {
                this.renderer.dispose();
                this.remove();
            }
        });
    }
}

CustomElementRegister(tagName, Editor);
