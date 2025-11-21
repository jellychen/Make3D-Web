/* eslint-disable no-unused-vars */

import ShowSvgExtrudeEditor from '@editor/arena/svg-extrude-editor';
import Base                 from '../base';
import Creator              from './v-creator';

/**
 * SVG
 */
export default class SVG extends Base {
    /**
     * 创建面板
     */
    #creator;

    /**
     * 
     * 构造函数
     * 
     * @param {*} ec 
     * @param {*} coordinator 
     * @param {*} assistor 
     */
    constructor(ec, coordinator, assistor) {
        super(ec, coordinator, assistor);
    }

    /**
     * 
     * 启动
     * 
     * @param {*} data 
     */
    start(data) {
        super.start();
        this.#creator = new Creator(this);
        this.#creator.on_dimiss = () => this.#creator = undefined;
        this.#creator.on_create = str => ShowSvgExtrudeEditor(this.coordinator, str);
        this.#creator.show(data.from, "auto", 10);
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
