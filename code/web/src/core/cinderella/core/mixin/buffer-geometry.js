
import XThree from '@xthree/basic';

/**
 * 临时变量
 */
const _mat4_0 = new XThree.Matrix4();

/**
 * Mixin
 */
Object.assign(XThree.BufferGeometry.prototype, {
    /**
     * 
     * 让法线有效
     * 
     * @returns 
     */
    makeVerticesNormalAvaliable() {
        if (!this.getAttribute('normal')) {
            this.computeVertexNormals();
        }
        return this;
    },

    /**
     * 
     * 重置包围盒
     * 
     * @param {*} calc 
     * @returns 
     */
    resetBoundingBox(calc = false) {
        if (calc) {
            this.computeBoundingBox();
        } else if (this.boundingBox) {
            this.boundingBox.makeEmpty();
        }
        return this;
    },

    /**
     * 
     * 获取当前几何的包围盒
     * 
     * @returns 
     */
    getBoundingBox() {
        if (!this.boundingBox || this.boundingBox.isEmpty()) {
            this.computeBoundingBox();
        }
        return this.boundingBox;
    },

    /**
     * 
     * 应用矩阵
     * 
     * @param {*} mat4 
     * @returns 
     */
    applyMat4(mat4) {
        _mat4_0.copy(mat4);
        this.applyMatrix4(_mat4_0);
        this.resetBoundingBox(false);
        return this;
    },
});
