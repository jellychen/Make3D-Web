/* eslint-disable no-unused-vars */

import Subscriber from './v';

/**
 * 
 * 打开窗口
 * 
 * @param {*} data 
 * @param {*} parent_node 
 */
export default function(data, parent_node = undefined) {
    data = data || {};

    // 构建窗口
    const subscriber = new Subscriber();

    if (data.screen_center) {
        subscriber.moveToScreenCenter();
    }

    // 显示
    subscriber.show(true, document.body);

    return subscriber;
}