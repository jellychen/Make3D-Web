
import XThree          from '@xthree/basic';
import DefaultMaterial from './editable.default.material';
import Bucket          from './editable.bucket';

/**
 * 可编辑网格
 */
export default class EditableMesh extends XThree.Mesh {
    /**
     * 用来保硬边的折角
     */
    crease_angle = Math.PI / 12;

    /**
     * 标记是可编辑网格
     */
    get isEditableMesh() {
        return true;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} default_data 
     */
    constructor(default_data = true) {
        if (default_data) {
            super(new XThree.BufferGeometry(), DefaultMaterial());
            this.userData.editable_bucket = new Bucket();
        } else {
            super();
        }
        this.castShadow    = true;
        this.receiveShadow = true;
    }

    /**
     * 断言
     */
    __assert_has_EditableBucket() {
        if (!this.userData.editable_bucket) {
            throw new Error("editable_bucket is null");
        }
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
     * 销毁 Soup
     */
    disposeEditableSoup() {
        this.__assert_has_EditableBucket();
        this.userData.editable_bucket.disposeSoup();
    }

    /**
     * 
     * 设置Soup
     * 
     * @param {*} soup 
     */
    setEditableSoup(soup) {
        this.__assert_has_EditableBucket();
        this.userData.editable_bucket.setSoup(soup);
    }

    /**
     * 
     * 获取Soup
     * 
     * @returns 
     */
    getEditableSoup() {
        const bucket = this.userData.editable_bucket;
        if (bucket) {
            return bucket.soup;
        }
    }

    /**
     *  
     * 克隆
     * 
     * @param {*} deep 
     * @returns 
     */
    clone(deep = true) {
        const mesh    = new EditableMesh(false);
        mesh.geometry = this.cloneGeometry(deep);
        mesh.material = this.cloneMaterial(deep);
        mesh.position.copy(this.position);
        mesh.rotation.copy(this.rotation);
        mesh.scale   .copy(this.scale   );
        if (this.userData.editable_bucket) {
            mesh.userData.editable_bucket = this.userData.editable_bucket.clone(deep);
        }
        return mesh;
    }

    /**
     * 
     * 如果是可编辑的，销毁
     * 
     * @returns 
     */
    disposeEditableBucketIfHas() {
        if (this.userData.editable_bucket) {
            this.userData.editable_bucket.__$$_del_ref__();
            this.userData.editable_bucket = undefined;
        }
        return this;
    }

    /**
     * 
     * 销毁
     * 
     * @param {*} geo 
     * @param {*} material 
     */
    dispose(geo = true, material = true) {
        super.dispose(geo, material);
        this.disposeEditableBucketIfHas();
    }
}
