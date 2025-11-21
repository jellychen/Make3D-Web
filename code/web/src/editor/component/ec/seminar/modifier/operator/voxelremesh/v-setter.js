/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import BaseSetter            from '../base-setter';
import Boundbox              from './v-boundbox';
import SegmentsCount         from './v-voxel-segments';
import CountPanel            from './v-count-panel';
import Tips                  from './v-tips';
import Html                  from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-voxelremesh-setter';

/**
 * 设置器
 */
export default class Setter extends BaseSetter {
    /**
     * 宿主
     */
    #host;

    /**
     * 元素
     */
    #boundbox;
    #segments;
    #band;
    #remesh;
    #commit;

    /**
     * 数据变动回调
     */
    #rebuild_callback;
    #commit_callback;

    /**
     * 获取
     */
    get segments_count() {
        return this.#segments.segments_count;
    }

    /**
     * 获取
     */
    get band() {
        return this.#band.getValue();
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} rebuild_callback 
     * @param {*} commit_callback 
     */
    constructor(host, rebuild_callback, commit_callback) {
        super(tagName);
        this.#host = host;
        
        if (isFunction(rebuild_callback)) {
            this.#rebuild_callback = rebuild_callback;
        }

        if (isFunction(commit_callback)) {
            this.#commit_callback = commit_callback;
        }

        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#boundbox       = this.getChild('#boundbox');
        this.#segments       = this.getChild('#segments');
        this.#band           = this.getChild('#band');
        this.#remesh         = this.getChild('#rebuild');
        this.#commit         = this.getChild('#commit');
        this.#remesh.onclick = event => this.#onClickRebuild(event);
        this.#commit.onclick = event => this.#onClickCommit(event);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    setBoundbox(x, y, z) {
        this.#boundbox.setBoundbox(x, y, z);
    }

    /**
     * 
     * 点击重建
     * 
     * @param {*} event 
     */
    #onClickRebuild(event) {
        if (isFunction(this.#rebuild_callback)) {
            try {
                this.#rebuild_callback();
            } catch(e) {
                console.error(e);
            }
        }
    }

    /**
     * 
     * 点击提交
     * 
     * @param {*} event 
     */
    #onClickCommit(event) {
        if (isFunction(this.#commit_callback)) {
            try {
                this.#commit_callback();
            } catch(e) {
                console.error(e);
            }
        }
    }
}

CustomElementRegister(tagName, Setter);
