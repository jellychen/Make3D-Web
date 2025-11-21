/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import * as ani   from 'animejs';

/**
 * 动画的封装
 */
export default class Animation {
    /**
     * 
     * 执行
     * 
     * @param {*} element 
     * @param {*} attr 
     */
    static Try(element, attr) {
        ani.animate(element, attr);
    }

    /**
     * 
     * 逐渐显示
     * 
     * @param {*} element 
     * @param {*} complete_callback 
     * @returns 
     */
    static FadeIn(element, complete_callback) {
        ani.animate(element, {
            opacity   : [0, 1],
            duration  : 300,
            easing    : 'easeOutCubic',
            onComplete: () => {
                if (isFunction(complete_callback)) {
                    try {
                        complete_callback();
                    } catch(e) {
                        console.error(e);
                    }
                }
            }
        });
    }

    /**
     * 
     * 动画移除
     * 
     * @param {*} element 
     * @param {*} complete_callback 
     * @returns 
     */
    static Remove(element, complete_callback) {
        ani.animate(element, {
            opacity   : 0,
            duration  : 300,
            easing    : 'easeOutCubic',
            onComplete: () => {
                if (isFunction(complete_callback)) {
                    try {
                        complete_callback();
                    } catch(e) {
                        console.error(e);
                    }
                }
                element.remove();
            }
        });
    }

    /**
     * 
     * 弹出
     * 
     * @param {*} element 
     * @param {*} complete_callback 
     */
    static Pump(element, complete_callback) {
        this.Try(element, {
            keyframes: [
                { scale: 0.5, opacity: 0, duration: 0   },
                { scale: 1.2, opacity: 1, duration: 150 },
                { scale: 1.0, opacity: 1, duration: 100 } 
            ],
            easing    : 'easeOutElastic(1, .5)',
            onComplete: () => {
                if (isFunction(complete_callback)) {
                    try {
                        complete_callback();
                    } catch(e) {
                        console.error(e);
                    }
                }
            }
        });
    }
}
