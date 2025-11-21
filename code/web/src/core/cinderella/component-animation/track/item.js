/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 一个状态
 */
export default class Item {
    /**'
     * 
     * time
     * 
     * 单位毫秒
     * 
     */
    time = 0; // 开始时间

    /**
     * 值
     */
    t = new XThree.Vector3();
    r = new XThree.Quaternion();
    s = new XThree.Vector3(1, 1, 1);

    /**
     * 
     * 克隆一个新的对象
     * 
     * @returns 
     */
    clone() {
        const data = new Item();
        data.copyFrom(this);
        return data;
    }

    /**
     * 
     * 拷贝
     * 
     * @param {*} status 
     */
    copyFrom(status) {
        this.time = status.time;
        this.t.copy(status.t);
        this.r.copy(status.r);
        this.s.copy(status.s);
    }

    /**
     * 
     * 从元素中获取
     * 
     * @param {*} object 
     */
    copyFromObject(object) {
        this.t.copy(object.position);
        this.r.copy(object.quaternion);
        this.s.copy(object.scale);
    }

    /**
     * 
     * 设置到object
     * 
     * @param {*} object 
     */
    setToObject(object) {
        object.position.copy(this.t);
        object.quaternion.copy(this.r);
        object.scale.copy(this.s);
    }
}