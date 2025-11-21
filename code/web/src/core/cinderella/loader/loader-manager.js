/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 *
 */
const data_container = new Map();

/**
 *
 */
let uid = 0;

/**
 * 单个本地文件加载管理器
 */
class LoaderManager extends XThree.LoadingManager {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.setURLModifier((url) => {
            if (data_container.has(url)) {
                return data_container.get(url);
            }
            return url;
        });
    }

    /**
     * 
     * 设置内置值
     * 
     * @param {*} data 
     * @returns 
     */
    addData(data) {
        uid++;
        const token = '' + uid;
        data_container.set(token, URL.createObjectURL(data));
        return token;
    }

    /**
     * 
     * 销毁数据
     * 
     * @param {*} token 
     */
    dispose(token) {
        if (!data_container.has(token)) {
            return;
        }
        URL.revokeObjectURL(data_container.get(token));
        data_container.delete(token);
    }
}

export default new LoaderManager();
