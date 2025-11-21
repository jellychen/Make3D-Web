
import XThree from '@xthree/basic';

/**
 * ndc空间的平面
 */
export default class FullScreenRect extends XThree.BufferGeometry {
    /**
     * 单例
     */
    static #default_instance = undefined;

    /**
     * 构造函数
     */
    constructor() {
        super();

        // 顶点
        const v = new Float32Array(12);
        v[ 0]   = -1.0;
        v[ 1]   = +1.0;
        v[ 2]   = +0.0;
        v[ 3]   = -1.0;
        v[ 4]   = -1.0;
        v[ 5]   = +0.0;
        v[ 6]   = +1.0;
        v[ 7]   = -1.0;
        v[ 8]   = +0.0;
        v[ 9]   = +1.0;
        v[10]   = +1.0;
        v[11]   = +0.0;
        
        // UV
        const u = new Float32Array(8);
        u[0]    = 0;
        u[1]    = 1;
        u[2]    = 0;
        u[3]    = 0;
        u[4]    = 1;
        u[5]    = 0;
        u[6]    = 1;
        u[7]    = 1;

        // 索引
        const i = new Uint16Array(6);
        i[0]    = 0;
        i[1]    = 1;
        i[2]    = 2;
        i[3]    = 0;
        i[4]    = 2;
        i[5]    = 3;
        
        this.setAttribute('position', new XThree.BufferAttribute(v, 3));
        this.setAttribute('uv', new XThree.BufferAttribute(u, 2));
        this.setIndex(new XThree.BufferAttribute(i, 1));
    }

    /**
     * 获取单例
     */
    static getInstance() {
        if (!this.#default_instance) {
            this.#default_instance = new FullScreenRect();
        }
        return this.#default_instance;
    }
}
