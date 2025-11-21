
window.__ux_webcomponent_open__ = true;

import '@common';
import '@assets';
import '@assets/import.css';
import '@ux';

import './arena/v';
import './component';

/**
 * 入口
 */
export default class APP {
    /**
     * 元素
     */
    #arean;

    /**
     * 构造函数
     */
    constructor() {
        this.#arean = document.createElement('x-biz-arena');
        while (document.body.hasChildNodes()) {
            document.body.removeChild(document.body.firstChild);
        }
        document.body.appendChild(this.#arean);
    }

    /**
     * 启动函数
     */
    start() {
        
    }
}

new APP().start();
