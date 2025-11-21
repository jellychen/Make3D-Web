/* eslint-disable no-unused-vars */

import Presenter from './v';

/**
 * 
 * 显示
 * 
 * @param {*} coordinator 
 * @param {*} parent 
 * @param {*} connector 
 * @returns 
 */
export default function show(coordinator, connector) {
    const slots = coordinator.abattoir.upper_slots;
    const panel = new Presenter(connector);
    slots.setVisible(true);
    slots.content.appendChild(panel);
    return panel;
}
