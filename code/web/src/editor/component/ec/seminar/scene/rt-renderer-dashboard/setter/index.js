/* eslint-disable no-unused-vars */

import Header from "./v-setter-header";
import Setter from "./v";

/**
 * 
 * 显示设置器
 * 
 * @param {*} coordinator 
 * @param {*} renderer_view 
 * @param {*} dashboard 
 * @returns 
 */
export default function Show(coordinator, renderer_view, dashboard) {
    const header = new Header();
    const setter = new Setter(renderer_view, dashboard, coordinator);
    const container = coordinator.moderator.scene.showModal();
    if (!container) {
        throw new Error("showModal error");
    }
    container.setHeader(header);
    container.setContent(setter);
    return setter;
}