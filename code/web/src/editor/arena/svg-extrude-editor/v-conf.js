/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isNumber              from 'lodash/isNumber';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import SvgExtrudeConf        from '@core/cinderella/mesh/svg.extrude.conf';
import                            './cell';
import Html                  from './v-conf-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-svg-extrude-editor-conf';

/**
 * 配置
 */
export default class Conf extends Element {
    /**
     * 宿主
     */
    #host_editor;

    /**
     * 元素
     */
    #container;
    #add_scene;
    #convert_polygon_add_scene;

    /**
     * 元素
     */
    #curve_segments;
    #depth;
    #bevel_segments;
    #bevel_thickness;
    #bevel_size;
    #bevel_offset;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.setEnableCustomizeMenu(false);
        this.observerBubblesEvent();
        this.createContentFromTpl(tpl);
    }
    
    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#curve_segments            = this.getChild('#curve-segments');
        this.#depth                     = this.getChild('#depth');
        this.#bevel_segments            = this.getChild('#bevel-segments');
        this.#bevel_thickness           = this.getChild('#bevel-thickness');
        this.#bevel_size                = this.getChild('#bevel-size');
        this.#bevel_offset              = this.getChild('#bevel-offset');
        this.#add_scene                 = this.getChild('#add-scene');
        this.#convert_polygon_add_scene = this.getChild('#convert-polygon-add-scene');
        this.setDataDefault();
        this.#add_scene.onclick                 = () => this.#host_editor.addToScene();
        this.#convert_polygon_add_scene.onclick = () => this.#host_editor.convertPolygonAddToScene();
    }

    /**
     * 
     * 设置宿主
     * 
     * @param {*} host_editor 
     */
    setHostEditor(host_editor) {
        this.#host_editor = host_editor;
    }

    /**
     * 
     * 设置默认数据
     * 
     */
    setDataDefault() {
        this.setData({
            curveSegments  : 8,
            depth          : 0.2,
            bevelThickness : 0.02,
            bevelSize      : 0.02,
            bevelOffset    : 0,
            bevelSegments  : 6,
        });
    }

    /**
     * 
     * 设置显示的数据
     * 
     * @param {*} data 
     */
    setData(data) {
        if (isNumber(data.curve_segments)) {
            this.#curve_segments.setValue(data.curve_segments);
        }

        if (isNumber(data.curveSegments)) {
            this.#curve_segments.setValue(data.curveSegments);
        }

        if (isNumber(data.depth)) {
            this.#depth.setValue(data.depth);
        }

        if (isNumber(data.bevel_segments)) {
            this.#bevel_segments.setValue(data.bevel_segments);
        }

        if (isNumber(data.bevelSegments)) {
            this.#bevel_segments.setValue(data.bevelSegments);
        }

        if (isNumber(data.bevel_thickness)) {
            this.#bevel_thickness.setValue(data.bevel_thickness);
        }

        if (isNumber(data.bevelThickness)) {
            this.#bevel_thickness.setValue(data.bevelThickness);
        }

        if (isNumber(data.bevel_size)) {
            this.#bevel_size.setValue(data.bevel_size);
        }

        if (isNumber(data.bevelSize)) {
            this.#bevel_size.setValue(data.bevelSize);
        }

        if (isNumber(data.bevel_offset)) {
            this.#bevel_offset.setValue(data.bevel_offset);
        }

        if (isNumber(data.bevelOffset)) {
            this.#bevel_offset.setValue(data.bevelOffset);
        }
    }

    /**
     * 
     * 接收孩子的冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        event.stopPropagation();
        const conf = new SvgExtrudeConf();
        conf.curveSegments  = this.#curve_segments.getValue();
        conf.depth          = this.#depth.getValue();
        conf.bevelThickness = this.#bevel_thickness.getValue();
        conf.bevelSize      = this.#bevel_size.getValue();
        conf.bevelOffset    = this.#bevel_offset.getValue();
        conf.bevelSegments  = this.#bevel_segments.getValue();
        conf.bevelEnabled   = conf.bevelSegments > 0 && conf.bevelThickness > 0;
        this.#host_editor.updateConf(conf);
    }
}

CustomElementRegister(tagName, Conf);
