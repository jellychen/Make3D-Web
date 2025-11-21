/* eslint-disable no-unused-vars */

import isUndefined from 'lodash/isUndefined';
import XThree      from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 开启监听
     */
    observerTransformChanged() {
        if (isUndefined(this.userData.tcoc)) {
            this.userData.tcoc = 1;
        } else {
            this.userData.tcoc++;
        }
        this.userData.has_tcoc = true;
    },

    /**
     * 取消监听
     */
    unobserverTransformChanged() {
        if (isUndefined(this.userData.tcoc)) {
            throw new Error("listener_count error");
        } else {
            this.userData.tcoc--;
            this.userData.has_tcoc = this.userData.tcoc > 0;
        }
    },

    /**
     * 
     * 发送事件，变换变换
     * 
     * @param {*} reason 
     * @param {*} force 
     * @returns 
     */
    notifyTransformWillChanged(reason, force = false) {
        if (!this.userData.has_tcoc && !force) {
            return;
        }

        this.dispatchEvent({ 
            reason : reason,
            type   : 'transform-will-changed' 
        });

        const scene = this.getScene();
        if (scene) {
            scene.onObjectTransformWillChanged(reason, this);
        }
    },

    /**
     * 
     * 发送事件，变换变换
     * 
     * @param {*} reason 
     * @param {*} force 
     * @returns 
     */
    notifyTransformChanged(reason, force = false) {
         if (!this.userData.has_tcoc && !force) {
            return;
        }
        
        this.dispatchEvent({
            reason : reason,
            type   : 'transform-changed' 
        });
        
        const scene = this.getScene();
        if (scene) {
            scene.onObjectTransformChanged(reason, this);
        }
    },
});
