/* eslint-disable no-unused-vars */

import localforage from "@/common/misc/local-forage";

/**
 * 构建专门用来存储 envmap 的数据了
 */
const db = localforage.createInstance({
    name: 'db.envmap'
});
db.setDriver([localforage.WEBSQL, localforage.INDEXEDDB]);

/**
 * 对外的接口
 */
export default {
    /**
     * 
     * 删除
     * 
     * @param {*} name 
     */
    removeItem: (name) => {
        db.removeItem(name);
    },

    /**
     * 
     * 设置
     * 
     * @param {*} name 
     * @param {*} image_blob 
     */
    setItem: (name, image_blob) => {
        db.setItem(name, image_blob);
    },

    /**
     * 
     * 获取
     * 
     * @param {*} name 
     * @param {*} callback 
     */
    getItem: (name, callback) => {
        db.getItem(name).then(callback);
    },

    /**
     * 
     * 获取
     * 
     * @param {*} callback 
     */
    getAllItemsKey: (callback) => {
        db.keys().then(callback);
    },

    /**
     * 清理
     */
    clear() {
        db.clear();
    }
}

