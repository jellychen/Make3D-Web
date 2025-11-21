/* eslint-disable no-unused-vars */

import isBoolean from 'lodash/isBoolean';
import isString  from 'lodash/isString';
import XThree    from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 设置名字
     * 
     * @param {*} name 
     * @param {*} reason 
     * @returns 
     */
    setName(name, reason) {
        if (!isString(name) || this.name === name) {
            return false;
        }

        this.notifyNameWillChanged(reason);
        this.name = name;
        this.notifyNameChanged(reason);
        return true;
    },

    /**
     * 
     * 设置可见性
     * 
     * @param {*} visible 
     * @param {*} reason 
     * @returns 
     */
    setVisible(visible, reason) {
        if (!isBoolean(visible) || this.visible === visible) {
            return false;
        }

        this.notifyVisibleWillChanged(reason);
        this.visible = visible;
        this.notifyVisibleChanged(reason);
        return true;
    }
});
