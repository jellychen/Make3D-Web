/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * 调试使用
 */
export default class DebugCanvasImageData {
    /**
     * 画布
     */
    #canvas;
    #canvas_context;

    /**
     * 尺寸
     */
    #w = 0;
    #h = 0;

    /**
     * 像素数据
     */
    #data;
    #pixel_data_buffer;

    /**
     * 
     * 构造函数
     * 
     * @param {Number} w 
     * @param {Number} h 
     */
    constructor(w, h) {
        this.#w              = w;
        this.#h              = h;
        this.#canvas         = new OffscreenCanvas(w, h);
        this.#canvas_context = this.#canvas.getContext("2d");
    }

    /**
     * 
     * 获取数据
     * 
     * @returns 
     */
    beginPixelEdit() {
        this.#data = this.#canvas_context.getImageData(0, 0, this.#w, this.#h);
        this.#pixel_data_buffer = this.#data.data;
    }

    /**
     * 
     * 设置像素的值
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     * @param {Number} a 
     */
    setPixel(x, y, r = 255, g = 255, b = 255, a = 255) {
        let offset = 4 * (y * this.#w + x);
        this.#pixel_data_buffer[offset    ] = r; 
        this.#pixel_data_buffer[offset + 1] = g; 
        this.#pixel_data_buffer[offset + 2] = b; 
        this.#pixel_data_buffer[offset + 3] = a; 
    }

    /**
     * 写入数据
     */
    commit() {
        this.#canvas_context.putImageData(this.#data, 0, 0);
        this.#data = undefined;
        this.#pixel_data_buffer = undefined;
    }

    /**
     * 
     * 保存文件
     * 
     * @param {String} name 
     */
    SaveCanvasAsPng(name = "image.png") {
        this.#canvas.convertToBlob().then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            link.click();
        });
    }
}
