/* eslint-disable no-unused-vars */

import isFunction            from "lodash/isFunction";
import AnimationPenddingList from './animation-pendding-list';

/**
 * 动画
 */
export default class Container {
    /**
     * host
     */
    #host;

    /**
     * 等待的队列
     */
    #pendding_list = new AnimationPenddingList(this);

    /**
     * 当前在执行的动画
     */
    #playing_animations = [];
    #playing_animations_reserve = [];

    /**
     * 获取宿主
     */
    get host() {
        return this.#host;
    }

    /**
     * 获取等待列表
     */
    get pendding_list() {
        return this.#pendding_list;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} object_3d 
     */
    constructor(object_3d) {
        this.#host = object_3d;
    }

    /**
     * 
     * 投递一个动画
     * 
     * @param {*} animation_clip 
     * @param {*} no_defer 
     * @returns 
     */
    post(animation_clip, no_defer = false) {
        if (!animation_clip) {
            return;
        }

        if (!no_defer) {
            const time_begin = animation_clip.time_begin;
            if (time_begin > 0) {
                this.#pendding_list.defer(time_begin * 1000, animation_clip);
            }
            return;
        }

        if (isFunction(animation_clip.attach)) {
            try {
                animation_clip.attach(this.#host);
            } catch (e) {
                console.error(e);
            }
        }

        // 添加到当前的执行的队列中
        this.#playing_animations.push(animation_clip);
        this.#host.requestRenderNextFrame();
    }

    /**
     * 
     * 清理掉当前全部在执行的动画
     * 
     * 包括清理掉在等待队列中，和正在执行的
     * 
     * !!! 不可以在动画的过程中执行
     * 
     */
    clear() {
        this.#pendding_list.clear();
        this.#playing_animations         = [];
        this.#playing_animations_reserve = [];
    }

    /**
     * 
     * tick
     * 
     * 返回true，表示需要继续渲染
     * 
     * 如果一个动画 is_playing == false 会从动画中剔除
     * 
     * @param {*} object 
     * @param {*} time 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     * @returns 
     */
    tick(object, time, renderer, scene, camera) {
        while (this.#playing_animations.length > 0) {
            const animation = this.#playing_animations.pop();
            if (isFunction(animation.tick)) {
                try {
                    animation.tick(object, time, renderer, scene, camera);
                } catch (e) {
                    console.error(e);
                }

                if (animation.is_playing) {
                    this.#playing_animations_reserve.push(animation);
                } else if (isFunction(animation.detach)) {
                    try {
                        animation.detach();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }

        this.#playing_animations = this.#playing_animations_reserve;
        this.#playing_animations_reserve = [];
        if (this.#playing_animations.length > 0) {
            this.#host.requestRenderNextFrame();
        }
    }
}
