/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

// 临时数据
const box0 = new XThree.Box3();
const box1 = new XThree.Box3();
const box2 = new XThree.Box3();
const v2_0 = new XThree.Vector2();
const v2_1 = new XThree.Vector2();
const v3_0 = new XThree.Vector3();
const v3_1 = new XThree.Vector3();

/**
 * 对元素的区域做限制
 */
export default class BoundConstraint {
    /**
     * 
     * 统一整理
     * 
     * @param {*} root 
     */
    static Adjustment(root) {
        if (!root || !root.isGroup) {
            return;
        }

        root.position.set(0, 0, 0);
        root.updateWorldMatrix(false, false);
        box0.makeEmpty();
        for (const mesh of root.children) {
            box1.setFromObject(mesh);
            if (!box1.isEmpty()) {
                box0.union(box1);
            }
        }

        if (box0.isEmpty()) {
            return;
        }

        box0.getCenter(v3_0);
        root.position.set(-v3_0.x, -v3_0.y, 0);
        root.updateWorldMatrix(false, false);
    }
}
