/* eslint-disable no-unused-vars */

import isNumber from 'lodash/isNumber';
import TreeCell from './v-cell';

/**
 * 定义常量
 */
const cells_max_count = 200;

/**
 * 用来复用Cell
 */
export default class RecycleCellsContainer {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 池子
     */
    #max_count = cells_max_count;
    #container = [];

    /**
     * 构造函数
     */
    constructor(max_count = cells_max_count) {
        if (isNumber(max_count)) {
            this.#max_count = parseInt(max_count);
        }
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 
     * 获取
     * 
     * @param {*} context 
     * @returns 
     */
    obtain(context) {
        if (0 == this.#container.length) {
            return new TreeCell(context, this.#coordinator);
        }
        return this.#container.pop();
    }

    /**
     * 
     * 复用一个Cell
     * 
     * @param {*} cell 
     * @param {Boolean} need_remove 
     * @returns 
     */
    recycle(cell, need_remove = false) {
        if (need_remove) {
            cell.remove();
        }

        if (this.#container.length >= this.#max_count) {
            return;
        }

        if (cell instanceof TreeCell) {
            cell.reset();
            this.#container.push(cell);
        }
    }
}
