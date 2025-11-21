/* eslint-disable no-unused-vars */

/**
 * 容器
 */
export default class AssociateContainer {
    /**
     * 数据
     */
    #array        = [];
    #is_disposing = false;

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 添加容器
     * 
     * @param {*} camera 
     */
    add(camera) {
        this.#array.push(camera);
    }

    /**
     * 
     * 删除指定的相机
     * 
     * @param {*} camera 
     */
    del(camera) {
        if (this.#is_disposing || !camera) {
            return;
        }

        const index = this.#array.indexOf(camera);
        if (index !== -1) {
            this.#array.splice(index, 1);
        }
    }

    /**
     * 
     * 获取全部的相机
     * 
     * @returns 
     */
    all() {
        return this.#array;
    }

    /**
     * 销毁
     */
    dispose() {
        this.#is_disposing = true;
        for (const camera of this.#array) {
            camera.dispose();
        }
        this.#is_disposing = false;
        this.#array = [];
        
    }
}
