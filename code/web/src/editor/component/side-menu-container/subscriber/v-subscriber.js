/* eslint-disable no-unused-vars */

import SubscriberPanel from './v-subscriber-panel';

/**
 * 
 * 显示订阅的框
 * 
 * @param {*} ref_element 
 * @param {*} placement 
 * @returns 
 */
export default function ShowSubscriber(ref_element, placement) {
    const panel = new SubscriberPanel();
    panel.position(ref_element, 'right-start');
    document.body.appendChild(panel);
    return panel;
}
