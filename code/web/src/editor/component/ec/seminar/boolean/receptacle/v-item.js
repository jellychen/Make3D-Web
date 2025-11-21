/* eslint-disable no-unused-vars */

import isString                 from 'lodash/isString';
import isFunction               from 'lodash/isFunction';
import Animation                from '@common/misc/animation';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import Html                     from './v-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-boolean-receptacle-item';

/**
 * 项
 */
export default class Item extends Element {
    /**
     * 宿主
     */
    #host;

    /**
     * 元素
     */
    #container;
    #uuid;
    #name;
    #remove;
    #line_up;
    #line_bottom;

    /**
     * 对象弱引用
     */
    #weakref_node;

    /**
     * 线的状态
     */
    #line_status; // up bottom

    /**
     * 获取
     */
    get object() {
        if (this.#weakref_node) {
            return this.#weakref_node.deref();
        }
        return undefined;
    }

    /**
     * 获取
     */
    get uuid() {
        return this.#uuid;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     */
    constructor(host) {
        super(tagName);
        this.#host = host;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container   = this.getChild('#container');
        this.#name        = this.getChild('#name');
        this.#remove      = this.getChild('#remove');
        this.#line_up     = this.getChild('#line-up');
        this.#line_bottom = this.getChild('#line-bottom');
        this.#remove.addEventListener('click', (event) => this.#onClickRemove(event));
    }

    /**
     * 当UI首次添加到DOM执行动画
     */
    connectedCallback() {
        super.connectedCallback();

        // 执行加载的动画
        this.style.opacity = 0;
        Animation.FadeIn(this);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * 
     * 设置
     * 
     * @param {*} object 
     */
    setObject(object) {
        this.#weakref_node = object.getWeakRef();
    }

    /**
     * 
     * 设置名称
     * 
     * @param {String} name 
     */
    setName(name) {
        if (!isString(name)) {
            return;
        }
        this.#name.textContent = name;
    }

    /**
     * 
     * 设置UUID
     * 
     * @param {String} uuid 
     */
    setUUID(uuid) {
        this.#uuid = uuid;
    }

    /**
     * 
     * 设置是否允许 Hover
     * 
     * @param {boolean} enable 
     */
    setEnableHover(enable) {
        if (enable) {
            this.#container.setAttribute('can-hover', 'true');
        } else {
            this.#container.setAttribute('can-hover', 'false');
        }
    }

    /**
     * 
     * 显示上线
     * 
     * @param {*} show 
     */
    setShowLineUp(show) {
        if (show) {
            if ('up' == this.#line_status) {
                return;
            } else {
                this.#line_status = 'up';
            }
            this.#line_up    .style.display = 'block';
            this.#line_bottom.style.display = 'none';
        } else {
            this.setHideLine();
        }
    }

    /**
     * 
     * 显示上线
     * 
     * @param {boolean} show 
     */
    setShowLineBottom(show) {
        if (show) {
            if ('bottom' == this.#line_status) {
                return;
            } else {
                this.#line_status = 'bottom';
            }
            
            this.#line_up    .style.display = 'none';
            this.#line_bottom.style.display = 'block';
        } else {
            this.setHideLine();
        }
    }

    /**
     * 隐藏线
     */
    setHideLine() {
        if (!this.#line_status) {
            return;
        } else {
            this.#line_status = undefined;
            this.#line_up    .style.display = 'none';
            this.#line_bottom.style.display = 'none';
        }
    }

    /**
     * 
     * 判断点是不是命中
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    isPointIn(x, y) {
        const client_rect = this.getBoundingClientRect();
        if (x < client_rect.left  ) return false;
        if (x > client_rect.right ) return false;
        if (y < client_rect.top   ) return false;
        if (y > client_rect.bottom) return false;
        return true;
    }

    /**
     * 
     * 点击移除函数
     * 
     * @param {*} event 
     */
    #onClickRemove(event) {
        Animation.Try(
            this,
            {
                opacity: 0,
                duration: 300,
                easing: 'easeOutCubic',
                onComplete: () => {
                    this.remove();
                    if (this.#host && isFunction(this.#host.onItemRemoved)) {
                        this.#host.onItemRemoved(this, this.object);
                    }
                }
            });
    }
}

CustomElementRegister(tagName, Item);
