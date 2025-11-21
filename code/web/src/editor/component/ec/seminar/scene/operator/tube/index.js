/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import OcctLoader   from '@editor/arena/occt-loader';
import Base         from '../base';

/**
 * Torus  
 */
export default class Torus extends Base {
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
     * 启动
     */
    start() {
        super.start();
        OcctLoader().then(() => this.#onLoadOcctSuccess());
    }

    /**
     * 几何内核加载成功
     */
    #onLoadOcctSuccess() {

    }
}
