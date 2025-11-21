/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mesh
 */
export default class Mesh extends XThree.Mesh {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.setMarkAuxiliary(true);
    }
}
