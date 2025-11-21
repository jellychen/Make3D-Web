/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 控制阴影
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 投射阴影
     * 
     * @returns 
     */
    isCastShadow() {
        return this.castShadow;
    },

    /**
     * 
     * 是否接收阴影
     * 
     * @returns 
     */
    isReceiveShadow() {
        return this.receiveShadow;
    },

    /**
     * 
     * 设置投射阴影
     * 
     * @param {*} cast 
     * @param {*} and_all_children 
     */
    setCastShadow(cast, and_all_children) {
        if (and_all_children) {
            this.traverse(object => {
                object.castShadow = cast;
            }, true);
        } else {
            this.castShadow = cast;
        }
    },

    /**
     * 
     * 接收阴影
     * 
     * @param {*} receive 
     * @param {*} and_all_children 
     */
    receiveShadow(receive, and_all_children) {
        if (and_all_children) {
            this.traverse(object => {
                object.receiveShadow = receive;
            }, true);
        } else {
            this.receiveShadow = receive;
        }
    },
});
