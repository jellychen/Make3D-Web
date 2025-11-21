
import '@common';
import '@assets';
import '@assets/import.css';

import './app-ux-require';
import './arena/v';

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
        setTimeout(() => {
            location.href = '/';
        }, 6000);
    }
}

new APP().start();
