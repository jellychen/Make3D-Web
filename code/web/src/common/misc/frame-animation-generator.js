
import isFunction  from "lodash/isFunction";
import isUndefined from "lodash/isUndefined";

/**
 * 异步的生成器调用，不会卡主界面
 */
export default class FrameAnimationGenerator {
    /**
     * 生成器
     */
    #generator;

    /**
     * 回调事件
     */
    #frame_animation_id;

    /**
     * 回调函数
     */
    #callback;
    #callback_finish;

    /**
     * 
     * 构造函数
     * 
     * @param {*} generator 
     * @param {*} callback 
     * @param {*} finish_callback 
     */
    constructor(generator, callback, finish_callback) {
        this.#generator = generator;
        this.#callback  = callback;
        this.#callback_finish = finish_callback;
    }

    /**
     * 启动
     */
    start() {
        if (!isUndefined(this.#frame_animation_id)) {
            throw new Error("loop is start");
        } else {
            this.#frame_animation_id = requestAnimationFrame(() => { 
                this.#on_animation_callback();
            });
        }
    }

    /**
     * 销毁
     */
    cancel() {
        if (!isUndefined(this.#frame_animation_id)) {
            cancelAnimationFrame(this.#frame_animation_id);
            this.#frame_animation_id = undefined;
        }
    }

    /**
     * 
     * 动画回调
     * 
     * @returns 
     */
    #on_animation_callback() {
        this.#frame_animation_id = requestAnimationFrame(() => { 
            this.#on_animation_callback();
        });

        // 为了性能让每一帧多做点事
        const current_t0 = performance.now();
        while (true) {
            const next = this.#generator.next();
            if (next.done) {
                if (isFunction(this.#callback_finish)) {
                    this.#callback_finish();
                }
                cancelAnimationFrame(this.#frame_animation_id);
                this.#frame_animation_id = undefined;
                break;
            } else if (isFunction(this.#callback)) {
                this.#callback(next.value);
            }

            // 为了性能
            // 如果大于 15ms 就跳出
            if (performance.now() - current_t0 > 10) {
                break;
            }
        }
    }
}