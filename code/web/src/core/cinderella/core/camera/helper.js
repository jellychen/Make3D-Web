/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 相机辅助
 */
export default class Helper extends XThree.CameraHelper {
    /**
     * 
     * 构造函数
     * 
     * @param {*} camera 
     */
    constructor(camera) {
        super(camera);
    }

    /**
     * 渲染之前先更新
     */
    update() {
        super.update();
    }

    /**
     * 从场景中移除并销毁
     */
    removeFromParentAndDispose() {
        this.removeFromParent();
        this.dispose();
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
