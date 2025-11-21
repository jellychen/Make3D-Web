/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";

/**
 * 一组
 */
export default class Group {
    /**
     * 操作池子
     */
    arr = [];
    
    /**
     * 
     * 添加
     * 
     * @param {*} operation 
     */
    push(operation) {
        if (operation) {
            this.arr.push(operation);
        }
    }

    /**
     * 回撤
     */
    rollback() {
        for (const item of this.arr.reverse()) {
            if (item) {
                if (isFunction(item.rollback)) {
                    try {
                        item.rollback();
                    } catch(e) {
                        console.error(e);
                    }
                }
            }
        }
    }
}