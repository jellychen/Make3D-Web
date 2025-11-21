/* eslint-disable no-unused-vars */

import isObject from "lodash/isObject";
import isString from "lodash/isString";
import Notifier from '@common/misc/notifier';

const broadcaster = {
    /**
     * 
     * 发送数据
     * 
     * @param {*} type 
     * @param {*} content 
     */
    send(type, content) {
        Notifier.dispatch(type, content);
    },
};

/**
 * tab之间的通讯
 */
const tabs_broadcast_channel = new BroadcastChannel('broadcast');
tabs_broadcast_channel.onmessage = (event) => {
    if (!isObject(event.data)) {
        return;
    }
    
    const data = event.data;
    if (!isString(data.type)) {
        return;
    }

    broadcaster.send(data.type, data.content);
};

export default broadcaster;
