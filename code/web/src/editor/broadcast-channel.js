/* eslint-disable no-unused-vars */

import isString        from 'lodash/isString';
import EventDispatcher from '@common/misc/event-dispatcher';

/**
 * 完成跨页面通讯
 */
class Channel extends EventDispatcher {
    /**
     * 通讯通道
     */
    #broadcast_channel = undefined;

    /**
     * 构造函数
     */
    constructor() {
        super();

        // 构建通讯通道
        if (window.BroadcastChannel) {
            this.#broadcast_channel = new BroadcastChannel('broadcast');
            this.#broadcast_channel.onmessage = (event) => {
                this.#onRecvMessage(event);
            };
        }
    }

    /**
     * 
     * 发送数据
     * 
     * @param {string} type 
     * @param {object} data 
     */
    postMessage(type, data) {
        // 类型检查
        if (!this.#broadcast_channel) {
            return false;
        }

        // 类型检查
        if (!isString(type)) {
            return false;
        }

        data = data || {};

        // 发送数据
        this.#broadcast_channel.postMessage({
            type: type,
            data: data
        });

        return true;
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#broadcast_channel) {
            this.#broadcast_channel.close();
            this.#broadcast_channel = undefined;
        }
    }

   /**
    * 
    * 接受到消息
    * 
    * @param {*} event 
    */
    #onRecvMessage(event) {
        event = event || {};

        // 类型
        if (!isString(event.type)) {
            return;
        }

        // 广播事件
        this.dispatch(event.type, event.data || {});
    }
}

export default new Channel();
