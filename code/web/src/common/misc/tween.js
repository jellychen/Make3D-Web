/* eslint-disable no-unused-vars */

import isUndefined from 'lodash/isUndefined';
import TweenFuncs  from 'tween-functions';

/**
 * 执行函数
 */
export default class Tween {
    /**
     * 函数
     */
    #func_type;
    #func;

    /**
     * 获取类型
     */
    get type() {
        return this.#func_type;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} type 
     */
    constructor(type = 'linear') {
        this.setType(type);
    }

    /**
     * 
     * 设置动画类型
     * 
     * @param {*} type 
     */
    setType(type) {
        switch(type) {

            // Linear
        case 'linear'           : 
        case 'linear-in'        : 
        case 'linear-out'       : 
        case 'linear-inout'     : 
            this.#func          = TweenFuncs.linear;
            break;
    
            // Quadratic
        case 'quadratic-in'     : 
            this.#func          = TweenFuncs.easeInQuad;            break;
        case 'quadratic-out'    : 
            this.#func          = TweenFuncs.easeOutQuad;           break;
        case 'quadratic-inout'  : 
            this.#func          = TweenFuncs.easeInOutQuad;         break;
    
            // Cubic
        case 'cubic-in'         : 
            this.#func          = TweenFuncs.easeInCubic;           break;
        case 'cubic-out'        : 
            this.#func          = TweenFuncs.easeOutCubic;          break;
        case 'cubic-inout'      : 
            this.#func          = TweenFuncs.easeInOutCubic;        break;
    
            // Quartic
        case 'quartic-in'       : 
            this.#func          = TweenFuncs.easeInQuart;           break;
        case 'quartic-out'      : 
            this.#func          = TweenFuncs.easeOutQuart;          break;
        case 'quartic-inout'    : 
            this.#func          = TweenFuncs.easeInOutQuart;        break;
    
            // Quintic
        case 'quintic-in'       : 
            this.#func          = TweenFuncs.easeInQuint;           break;
        case 'quintic-out'      : 
            this.#func          = TweenFuncs.easeOutQuint;          break;
        case 'quintic-inout'    : 
            this.#func          = TweenFuncs.easeInOutQuint;        break;
    
            // Sinusoidal
        case 'sinusoidal-in'    : 
            this.#func          = TweenFuncs.easeInSine;            break;
        case 'sinusoidal-out'   : 
            this.#func          = TweenFuncs.easeOutSine;           break;
        case 'sinusoidal-inout' : 
            this.#func          = TweenFuncs.easeInOutSine;         break;
    
            // Exponential
        case 'exponential-in'   : 
            this.#func          = TweenFuncs.easeInExpo;            break;
        case 'exponential-out'  : 
            this.#func          = TweenFuncs.easeOutExpo;           break;
        case 'exponential-inout': 
            this.#func          = TweenFuncs.easeInOutExpo;         break;
    
            // Circular
        case 'circular-in'      : 
            this.#func          = TweenFuncs.easeInCirc;            break;
        case 'circular-out'     : 
            this.#func          = TweenFuncs.easeOutCirc;           break;
        case 'circular-inout'   : 
            this.#func          = TweenFuncs.easeInOutCirc;         break;
    
            // Elastic
        case 'elastic-in'       : 
            this.#func          = TweenFuncs.easeInElastic;         break;
        case 'elastic-out'      : 
            this.#func          = TweenFuncs.easeOutElastic;        break;
        case 'elastic-inout'    : 
            this.#func          = TweenFuncs.easeInOutElastic;      break;
    
            // Back
        case 'back-in'          : 
            this.#func          = TweenFuncs.easeInBack;            break;
        case 'back-out'         : 
            this.#func          = TweenFuncs.easeOutBack;           break;
        case 'back-inout'       : 
            this.#func          = TweenFuncs.easeInOutBack;         break;
    
            // Bounce
        case 'bounce-in'        : 
            this.#func          = TweenFuncs.easeInBounce;          break;
        case 'bounce-out'       : 
            this.#func          = TweenFuncs.easeOutBounce;         break;
        case 'bounce-inout'     : 
            this.#func          = TweenFuncs.easeInOutBounce;       break;
        }

        if (isUndefined(this.#func)) {
            throw new Error('type is error');
        } else {
            this.#func_type     = type;
        }
    }

    /**
     * 
     * 计算
     * 
     * @param {*} current 
     * @param {*} begin 
     * @param {*} end 
     * @param {*} duration 
     * @returns 
     */
    calc(current, begin, end, duration) {
        return this.#func(current, begin, end, duration);
    }
}
