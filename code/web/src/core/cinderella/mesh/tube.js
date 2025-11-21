
import XThree          from '@xthree/basic';
import DefaultMaterial from './tube.default.material';
import Path            from './tube.data.path';
import Section         from './tube.data.section';

/**
 * 管道网格
 */
export default class TubeMesh extends XThree.Mesh {
    /**
     * 标记是管道网格
     */
    get isTubeMesh() {
        return true;
    }

    /**
     * 截面数据
     */
    #section = new Section();

    /**
     * 曲线数据
     */
    #path = new Path();

    /**
     * 获取
     */
    get section() {
        return this.#section;
    }

    /**
     * 获取
     */
    get path() {
        return this.#path;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(new XThree.BufferGeometry(), DefaultMaterial());
        this.castShadow    = true;
        this.receiveShadow = true;
    }

    /**
     * 
     * webgpu setAttr 只能在绘制前只执行一次
     * 
     * 构建新的几何
     * 
     */
    rebuildNewEmptyGeometry() {
        this.geometry = new XThree.BufferGeometry();
    }

    /**
     * 
     * 设置顶点
     * 
     * 三个一组
     * 
     * @param {Float32Array} buffer 
     * @param {boolean} copy 
     * @returns
     */
    setGeoVertices(buffer, copy = false) {
        this.geometry.setAttr('position', buffer, 3, copy);
        return this;
    }

    /**
     * 
     * 设置顶点法线
     * 
     * 三个一组
     * 
     * @param {Float32Array} buffer 
     * @param {boolean} copy 
     * @returns
     */
    setGeoVerticesNormal(buffer, copy = false) {
        this.geometry.setAttr('normal', buffer, 3, copy);
        return this;
    }

    /**
     * 
     * 设置顶点颜色
     * 
     * 三个一组
     * 
     * @param {Float32Array} buffer
     * @param {boolean} copy 
     * @returns 
     */
    setGeoVerticesColor(buffer, copy = false) {
        this.geometry.setAttr('color', buffer, 3, copy);
        return this;
    }

    /**
     * 
     * 设置顶点UV
     * 
     * 两个一组
     * 
     * @param {Float32Array} buffer
     * @param {boolean} copy 
     * @returns 
     */
    setGeoVerticesUV(buffer, copy = false) {
        this.geometry.setAttr('uv', buffer, 2, copy);
        return this;
    }

    /**
     * 
     * 设置索引
     * 
     * @param {Uint16Array} indices
     * @param {boolean} copy 
     * @returns 
     */
    setGeoIndices16(indices, copy = false) {
        this.geometry.setIndices16(indices, copy);
        return this;
    }

    /**
     * 
     * 设置索引
     * 
     * @param {Uint32Array} indices 
     * @param {boolean} copy 
     * @returns 
     */
    setGeoIndices32(indices, copy = false) {
        this.geometry.setIndices32(indices, copy);
        return this;
    }

    /**
     * 
     * 删除几何体内的法线属性
     * 
     * @returns 
     */
    removeGeoVerticesNormal() {
        this.geometry.deleteAttr('normal');
        return this;
    }

    /**
     * 
     * 克隆
     * 
     * @param {*} deep 
     * @returns 
     */
    clone(deep = true) {
        const mesh = new TubeMesh(false);
        mesh.geometry = this.cloneGeometry(deep);
        mesh.material = this.cloneMaterial(deep);
        mesh.position.copy(this.position);
        mesh.rotation.copy(this.rotation);
        mesh.scale   .copy(this.scale);
        mesh.#path    = this.#path.clone();
        mesh.#section = this.#section.clone();
        return mesh;
    }
}
