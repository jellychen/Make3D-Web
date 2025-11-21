
import isFunction  from 'lodash/isFunction';
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 获取当前编辑器类型
     * 
     * @returns 
     */
    ecType() {
        return this.ec ? this.ec.getType() : undefined;
    },

    /**
     * 
     * 是否是场景
     * 
     * @returns 
     */
    isEcScene() {
        return this.ecType() == 'scene';
    },

    /**
     * 
     * 是否是布尔运算的场景
     * 
     * @returns 
     */
    isEcBoolean() {
        return this.ecType() == 'boolean';
    },

    /**
     * 
     * 获取
     * 
     * @returns 
     */
    getHistoricalRecorder() {
        return this.ec ? this.ec.getHistoricalRecorder() : undefined;
    },

    /**
     * 
     * 发送命令给 EC
     * 
     * @param {*} object 
     */
    sendCommandToEc(object = undefined) {
        if (this.ec && isFunction(this.ec.onRecvCommand)) {
            this.ec.onRecvCommand(object);
        }
    }
});
