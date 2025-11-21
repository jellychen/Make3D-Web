/* eslint-disable no-unused-vars */

import XThree                from '@xthree/basic';
import EventAdapterContainer from '../../event/adapter-container';

/**
 * 
 * Mixin
 * 
 * 事件
 * 
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 获取事件适配器
     * 
     * @param {*} created_if_empty 
     * @returns 
     */
    getEventAdapterContainer(created_if_empty = false) {
        if (!this.userData.event_adapters && created_if_empty) {
            this.userData.event_adapters = new EventAdapterContainer(this);
        }
        return this.userData.event_adapters;
    },
});