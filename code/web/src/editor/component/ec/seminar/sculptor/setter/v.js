/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowMatcapSelector    from '@editor/component/abattoir/matcap-selector';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-sculptor-setter';

/**
 * 雕刻参数
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
    #matcap;
    #matcap_setter;
    #show_coordinate;
    #show_edges;
    #show_only;
    #positive;
    #radius;
    #intensity;

    /**
     * 发生变化回调
     */
    on_setting_changed = () => {};

    /**
     * 获取
     */
    get showCoordinate() {
        return this.#show_coordinate.checked;
    }

    /**
     * 获取
     */
    get showOnly() {
        return this.#show_only.checked;
    }

    /**
     * 获取
     */
    get showEdges() {
        return this.#show_edges.checked;
    }

    /**
     * 获取
     */
    get positive() {
        return this.#positive.checked;
    }

    /**
     * 获取
     */
    get radius() {
        return this.#radius.value;
    }

    /**
     * 获取
     */
    get intensity() {
        return this.#intensity.value * 0.2;
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
        this.#matcap          = this.getChild('#matcap');
        this.#matcap_setter   = this.getChild('#matcap-setter');
        this.#show_coordinate = this.getChild('#show-coordinate');
        this.#show_edges      = this.getChild('#show-edges');
        this.#show_only       = this.getChild('#show-only');
        this.#positive        = this.getChild('#positive');
        this.#radius          = this.getChild('#radius');
        this.#intensity       = this.getChild('#intensity');
        this.#matcap_setter.onclick                       = event => this.#onClickMatcapSetter(event     );
        this.#show_coordinate.addEventListener('changed',   event => this.#onShowCoordinateChanged(event));
        this.#show_edges.addEventListener('changed',        event => this.#onShowEdgesChanged(event)     );
        this.#show_only.addEventListener('changed',         event => this.#onShowOnlyChanged(event      ));
        this.#positive.addEventListener('changed',          event => this.#onPositiveChanged(event      ));
        this.#radius.addEventListener('changed',            event => this.#onRadiusChanged(event        ));
        this.#intensity.addEventListener('changed',         event => this.#onIntensityChanged(event     ));
    }

    /**
     * 
     * 点击 Matcap 设置按钮
     * 
     * @param {*} event 
     */
    #onClickMatcapSetter(event) {
        ShowMatcapSelector(this.#matcap_setter, 10, (thumb_url, url) => {
            if (url) {
                this.#matcap.setUrl(thumb_url);
            } else {
                this.#matcap.setUrl('');
            }
        });
    }

    /**
     * 
     * 是否显示坐标轴
     * 
     * @param {*} event 
     */
    #onShowCoordinateChanged(event) {
        if (isFunction(this.on_setting_changed)) {
            this.on_setting_changed();
        }
    }

    /**
     * 
     * 显示是不是边框
     * 
     * @param {*} event 
     */
    #onShowEdgesChanged(event) {
        if (isFunction(this.on_setting_changed)) {
            this.on_setting_changed();
        }
    }

    /**
     * 
     * 是否独显
     * 
     * @param {*} event 
     */
    #onShowOnlyChanged(event) {
        if (isFunction(this.on_setting_changed)) {
            this.on_setting_changed();
        }
    }

    /**
     * 
     * 正向
     * 
     * @param {*} event 
     */
    #onPositiveChanged(event) {
        if (isFunction(this.on_setting_changed)) {
            this.on_setting_changed();
        }
    }

    /**
     * 
     * 半径发生变化
     * 
     * @param {*} event 
     */
    #onRadiusChanged(event) {
        if (isFunction(this.on_setting_changed)) {
            this.on_setting_changed();
        }
    }

    /**
     * 
     * 能量发生了变化
     * 
     * @param {*} event 
     */
    #onIntensityChanged(event) {
        if (isFunction(this.on_setting_changed)) {
            this.on_setting_changed();
        }
    }
}

CustomElementRegister(tagName, Setter);