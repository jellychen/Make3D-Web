/* eslint-disable no-unused-vars */

/**
 * 上下文
 */
export default class Context {
    /**
     * 宿主
     */
    #host;
    #container;
    #renderer;

    /**
     * 获取
     */
    get nodes() {
        return this.#container;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} renderer 
     */
    constructor(host, renderer) {
        this.#host = host;
        this.#container = this.#host.nodes;
        this.#renderer = renderer;
    }

    /**
     * 安装缩放器
     */
    setupZoomer() {
        this.#host.setupZoomer();
    }

    /**
     * 放弃缩放器
     */
    disposeZoomer() {
        this.#host.disposeZoomer();
    }

    /**
     * 重新绘制
     */
    render() {
        this.#renderer.render();
    }
}
