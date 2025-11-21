/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-editor-setter';

/**
 * 编辑环境下设置
 */
export default class Setter extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 宿主
     */
    #host;

    /**
     * 控件
     */
    #fold;
    #content;
    #show_coordinate;               // 显示坐标轴
    #show_only;                     // 独显
    #see_through_selection;         // 透视旋转
    #view_subdivision;              // 视觉细分
    #add_base_subdivision;          // 增加基础细分

    /**
     * 默认值
     */
    #show_coordinate_data       = true;
    #show_only_data             = false;
    #see_through_selection_data = false;
    #view_subdivision_data      = 0;

    /**
     * 当前有没有被折叠
     */
    #content_fold = false;

    /**
     * 获取
     */
    get show_coordinate() {
        return this.#show_coordinate_data;
    }

    /**
     * 获取
     */
    get show_only() {
        return this.#show_only_data;
    }

    /**
     * 获取
     */
    get see_through_selection() {
        return this.#see_through_selection;
    }

    /**
     * 获取
     */
    get view_subdivision() {
        return this.#view_subdivision;
    }

    /**
     * 获取
     */
    get historical_recorder() {
        return this.#host.historical_recorder;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} host 
     */
    constructor(coordinator, host) {
        super(tagName);
        this.#coordinator = coordinator;
        this.#host = host;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#fold                  = this.getChild('#fold');
        this.#content               = this.getChild('#content');
        this.#show_coordinate       = this.getChild('#show-coordinate');
        this.#show_only             = this.getChild('#show-only');
        this.#see_through_selection = this.getChild('#see-through-selection');
        this.#view_subdivision      = this.getChild('#view-subdivision');
        this.#add_base_subdivision  = this.getChild('#add-base-subdivision');

        // 初始化
        this.#show_coordinate.checked = true;
        this.#show_only.checked = false;
        this.#see_through_selection.checked = false;

        // 关注事件
        this.#show_coordinate.addEventListener('changed',       event => this.#onShowCoordinateChanged(event     ));
        this.#show_only.addEventListener('changed',             event => this.#onShowOnlyChanged(event           ));
        this.#see_through_selection.addEventListener('changed', event => this.#onSeeThroughSelectionChanged(event));
        this.#view_subdivision.addEventListener('changed',      event => this.#onViewSubdivisionChanged(event    ));
        this.#add_base_subdivision.addEventListener('click',    event => this.#onClickAddBaseSubdivision(event   ));
        this.#fold.addEventListener('click',                    event => this.#onClickFold(event                 ));
    }

    /**
     * 
     * 设置
     * 
     * @param {*} show 
     */
    setShowCoordinate(show) {
        this.#show_coordinate_data = show;
        this.#show_coordinate.setChecked(show);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} only 
     */
    setShowOnly(only) {
        this.#show_only_data = only;
        this.#show_only.setChecked(only);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} through 
     */
    setSelectorSeeThrough(through) {
        this.#see_through_selection_data = through;
        this.#see_through_selection.setChecked(through);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} level 
     */
    setViewSubdivisionLevel(level) {
        level = parseInt(level);
        this.#view_subdivision_data = level;
        this.#view_subdivision.setValue(level);
    }

    /**
     * 点击折叠
     */
    #onClickFold() {
        if (this.#content_fold) {
            this.#content_fold = false;
            this.#fold.setSrc('ui/down.svg');
            this.#content.style.height = 'auto';
        } else {
            this.#content_fold = true;
            this.#fold.setSrc('ui/up.svg');
            this.#content.style.height = '0';
        }
    }

    /**
     * 
     * 视口细分变化
     * 
     * @param {*} event 
     */
    #onViewSubdivisionChanged(event) {
        const value = event.value;
        if (this.#view_subdivision_data == value) {
            ;
        } else {
            this.historical_recorder.setViewSubdivision(this.#view_subdivision_data);
            this.#view_subdivision_data = value;
            this.#host.setSubdivisionLevel(value);
        }
    }

    /**
     * 
     * 点击添加基础细分
     * 
     * @param {*} event 
     */
    #onClickAddBaseSubdivision(event) {
        if (this.#view_subdivision_data == 0) {
            ;
        } else {
            this.historical_recorder.setViewSubdivision(this.#view_subdivision_data);
            this.#view_subdivision_data  = 0;
            this.#view_subdivision.value = 0;
            this.#host.setSubdivisionLevel(0);
        }
        this.#host.addBaseSubdivision();
    }

    /**
     * 
     * 是否显示坐标轴
     * 
     * @param {*} event 
     */
    #onShowCoordinateChanged(event) {
        const checked = event.checked;
        if (this.#show_coordinate_data == checked) {
            ;
        } else {
            this.historical_recorder.showCoordinate(this.#show_coordinate_data);
            this.#show_coordinate_data = checked;
            this.#host.setShowCoordinate(checked)
        }
    }

    /**
     * 
     * 是否独显
     * 
     * @param {*} event 
     */
    #onShowOnlyChanged(event) {
        const checked = event.checked;
        if (this.#show_only_data == checked) {
            ;
        } else {
            this.historical_recorder.showOnly(this.#show_only_data);
            this.#show_only_data = checked;
            this.#host.setShowOnly(checked);
        }
    }

    /**
     * 
     * 是否透视选择
     * 
     * @param {*} event 
     */
    #onSeeThroughSelectionChanged(event) {
        const checked = event.checked;
        if (this.#see_through_selection_data == checked) {
            ;
        } else {
            this.historical_recorder.setXrayMode(this.#see_through_selection_data);
            this.#see_through_selection_data = checked;
            this.#host.setSelectorSeeThrough(checked);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Try(this, {
            opacity   : [1, 0],
            translateY: [0, 50],
            duration  : 500,
            easing    : 'easeOutCubic',
            onComplete: () => {
                this.remove();
            }
        });
    }
}

CustomElementRegister(tagName, Setter);
