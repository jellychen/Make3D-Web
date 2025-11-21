
/**
 * 交互代理，用来解耦和Html元素直接耦合
 */
export default class InteractiveIsolate {
    /**
     * Dom 元素
     */
    #canvas;

    /**
     * 获取宽度
     */
    get width() {
        return this.#canvas.offsetWidth;
    }

    /**
     * 获取宽度
     */
    get offsetWidth() {
        return this.#canvas.offsetWidth;
    }

    /**
     * 获取
     */
    get clientWidth() {
        return this.#canvas.clientWidth;
    }

    /**
     * 获取高度
     */
    get height() {
        return this.#canvas.offsetHeight;
    }

    /**
     * 获取高度
     */
    get offsetHeight() {
        return this.#canvas.offsetHeight;
    }

    /**
     * 获取
     */
    get clientHeight() {
        return this.#canvas.clientHeight;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} canvas 
     */
    constructor(canvas) {
        this.#canvas = canvas;
    }

    /**
     * 获取对应的画布
     */
    get canvas() {
        return this.#canvas;
    }

    /**
     * 
     * 添加事件监听，转发
     * 
     * @param  {...any} args 
     */
    addEventListener(...args) {
        this.#canvas.removeEventListener(...args);
        this.#canvas.addEventListener(...args);
    }

    /**
     * 
     * 移除事件监听，转发
     * 
     * @param  {...any} args 
     */
    removeEventListener(...args) {
        this.#canvas.removeEventListener(...args);
    }

    /**
     * 
     * 捕获事件，转发
     * 
     * @param  {...any} args 
     */
    setPointerCapture(...args) {
        this.#canvas.setPointerCapture(...args);
    }

    /**
     * 
     * 释放捕获，转发
     * 
     * @param  {...any} args 
     */
    releasePointerCapture(...args) {
        this.#canvas.releasePointerCapture(...args);
    }

    /**
     * 获取包围盒
     */
    getBoundingClientRect() {
        return this.#canvas.getBoundingClientRect();
    }
}
