/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';

/**
 * 上下文
 */
export default class Context {
    /**
     * 回调函数
     */
    request_render_next_frame;

    /**
     * 材质发生了变化
     */
    on_changed;

    /**
     * 请求在下一帧进行重绘
     */
    requestRenderNextFrame() {
        if (!isFunction(this.request_render_next_frame)) {
            return;
        }
        this.request_render_next_frame();
    }

    /**
     * 
     * 材质发生了变化
     * 
     * @param {*} material 
     * @param {*} has_textures_changed 
     */
    triggerChanged(material, has_textures_changed = false) {
        if (isFunction(this.on_changed)) {
            this.on_changed(material, has_textures_changed);
        }
    }
}
