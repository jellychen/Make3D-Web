/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 获取
 */
export default class LayersAdapter {
    /**
     * 请求回调
     */
    #request_animation = () => { };

    /**
     * three 的 layers
     */
    #layers = new XThree.Layers();

    /**
     * 获取mask
     */
    get mask() {
        return this.#layers.mask;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {Function} request_animation 
     */
    constructor(request_animation) {
        this.#request_animation = request_animation;
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} channel 
     * @returns 
     */
    set(channel) {
        const mask = this.#layers.mask;
        this.#layers.set(channel);
        if (mask !== this.#layers.mask) {
            this.#request_animation();
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} channel 
     * @returns 
     */
    enable(channel) {
        const mask = this.#layers.mask;
        this.#layers.enable(channel);
        if (mask !== this.#layers.mask) {
            this.#request_animation();
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @returns 
     */
    enableAll() {
        const mask = this.#layers.mask;
        this.#layers.enableAll();
        if (mask !== this.#layers.mask) {
            this.#request_animation();
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} channel 
     * @returns 
     */
    toggle(channel) {
        const mask = this.#layers.mask;
        this.#layers.toggle(channel);
        if (mask !== this.#layers.mask) {
            this.#request_animation();
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} channel 
     * @returns 
     */
    disable(channel) {
        const mask = this.#layers.mask;
        this.#layers.disable(channel);
        if (mask !== this.#layers.mask) {
            this.#request_animation();
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @returns 
     */
    disableAll() {
        const mask = this.#layers.mask;
        this.#layers.disableAll();
        if (mask === this.#layers.mask) {
            this.#request_animation();
        }
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} layers 
     */
    test(layers) {
        return this.#layers.test(layers);
    }

    /**
     * 
     * 函数转发
     * 
     * @param {*} channel 
     * @returns 
     */
    isEnabled(channel) {
        return this.#layers.isEnabled(channel);
    }
}
