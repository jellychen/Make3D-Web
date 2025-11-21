/**
 * 绘制
 */
export default class Renderer {
    /**
     * 绘图的元素
     */
    #canvas;
    #canvas_resize_observer;

    /**
     * 尺寸信息
     */
    #pixel_ratio = 1;
    #w = 0;
    #h = 0;

    /**
     * 绘制上下文
     */
    #dc;

    /**
     * 可以绘制的image
     */
    #image;

    /**
     * 获取Html元素
     */
    get htmlDomElement() {
        return this.#canvas;
    }

    /**
     * 构造函数
     */
    constructor() {
        this.#canvas = document.createElement('canvas');
        this.#canvas.width = 1;
        this.#canvas.height = 1;
        this.#dc = this.#canvas.getContext('2d');
        this.#canvas_resize_observer = new ResizeObserver(entries => {
            this.#onResize()
        });
        this.#canvas_resize_observer.observe(this.#canvas);
    }

    /**
     * 
     * 设置图片资源
     * 
     * @param {*} image 
     */
    setImage(image) {
        this.#image = image;
        this.update();
    }

    /**
     * 当尺寸发生变化的时候
     */
    #onResize() {
        const ratio = window.devicePixelRatio || 1;
        const w = this.#canvas.offsetWidth;
        const h = this.#canvas.offsetHeight;
        this.#canvas.width  = ratio * w;
        this.#canvas.height = ratio * h;
        this.#canvas.style.width  = `${w}px`;
        this.#canvas.style.height = `${h}px`;
        this.#pixel_ratio = ratio;
        this.#w = w;
        this.#h = h;
        this.#dc.reset();
        this.#dc.scale(ratio, ratio);

        // 重绘
        this.update();
    }

    /**
     * 更新
     */
    update() {
        this.immediateRender();
    }

    /**
     * 直接绘制
     */
    immediateRender() {
        // 清空
        this.#dc.clearRect(0, 0, this.#w, this.#h);

        // 绘制图像
        if (this.#image) {
            const w = this.#image.width;
            const h = this.#image.height;
            const p = this.#w / w;
            const q = this.#h / h;
            const s = Math.min(p, q);
            const new_w = w * s;
            const new_h = h * s;
            const x = (this.#w - new_w) * 0.5;
            const y = (this.#h - new_h) * 0.5;
            this.#dc.drawImage(this.#image, x, y, new_w, new_h);
        }
    }

    /**
     * 销毁
     * 
     * 不主动销毁也没有问题
     * 
     */
    dispose() {
        if (this.#canvas) {
            this.#canvas.remove();
        }

        if (undefined != this.#canvas_resize_observer) {
            this.#canvas_resize_observer.unobserve(this.#canvas);
            this.#canvas_resize_observer.disconnect();
            this.#canvas_resize_observer = undefined;
        }
    }
}
