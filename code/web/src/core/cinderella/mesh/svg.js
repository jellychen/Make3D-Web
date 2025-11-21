
import XThree          from '@xthree/basic';
import DefaultMaterial from './svg.default.material';
import Conf            from './svg.extrude.conf';

/**
 * SVG 网络
 */
export default class SvgMesh extends XThree.Mesh {
    /**
     * SVG网格
     */
    get isSvgMesh() {
        return true;
    }

    /**
     * 获取
     */
    get shape() {
        return this.#shape;
    }

    /**
     * 获取
     */
    get extrude_conf() {
        return this.#extrude_conf;
    }

    /**
     * 数据
     */
    #shape;
    #extrude_conf;

    /**
     * 
     * 构造函数
     * 
     * @param {*} shape 
     * @param {*} conf 
     */
    constructor(shape, conf) {
        super();
        this.#shape = shape;
        this.material = DefaultMaterial();
        this.update(conf);
    }

    /**
     * 
     * 挤压
     * 
     * @param {*} shape 
     * @param {*} conf 
     * @returns 
     */
    extrude(shape, conf) {
        return new XThree.ExtrudeGeometry(shape, conf);
    }

    /**
     * 
     * 构造
     * 
     * @param {*} conf 
     */
    update(conf) {
        if (conf) {
            this.#extrude_conf = conf.clone();
        } else {
            this.#extrude_conf = new Conf();
        }
        
        if (this.geometry) {
            this.geometry.dispose();
        }
        
        this.geometry = this.extrude(this.#shape, this.#extrude_conf);
    }
}
