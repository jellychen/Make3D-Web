/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Mesh.prototype, {
    /**
     * 
     * 拷贝几何
     * 
     * @param {*} deep 
     * @returns 
     */
    cloneGeometry(deep = true) {
        if (!this.geometry) {
            return;
        }

        if (deep) {
            return this.geometry.clone();
        } else {
            return this.geometry.__$$_add_ref__();
        }
    },

    /**
     * 
     * 拷贝材质
     * 
     * @param {*} deep 
     * @returns 
     */
    cloneMaterial(deep = true) {
        if (this.material instanceof XThree.Material) {
            return this.material.clone(deep);
        }
    },

    /**
     * 
     * 克隆
     * 
     * @param {*} deep 
     * @returns 
     */
    clone(deep = true) {
        const mesh    = new XThree.Mesh();
        mesh.geometry = this.cloneGeometry(deep);   // 拷贝几何
        mesh.material = this.cloneMaterial(deep);   // 拷贝材质
        mesh.position.copy(this.position);          // 拷贝位置
        mesh.rotation.copy(this.rotation);
        mesh.scale   .copy(this.scale   );
        return mesh;
    }
});
