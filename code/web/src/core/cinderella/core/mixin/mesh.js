/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Mesh.prototype, {
    /**
     * 
     * 设置网格的几何数据
     * 
     * @param {*} geometry 
     * @returns 
     */
    setGeometry(geometry) {
        if (this.geometry === geometry) {
            return this;
        }

        if (geometry) {
            geometry.__$$_add_ref__();
        }

        if (this.geometry) {
            this.geometry.__$$_del_ref__();
        }
        
        this.geometry = geometry;
        return this;
    },

    /**
     * 
     * 设置材质
     * 
     * @param {*} material 
     * @returns 
     */
    setMaterial(material) {
        if (material == this.material) {
            return this;
        }

        if (material) {
            material.__$$_add_ref__();
        }

        if (this.material) {
            this.material.__$$_del_ref__();
        }

        this.material = material;
        return this;
    },

    /**
     * 
     * 获取父亲节点
     * 
     * @returns 
     */
    getParent() {
        return this.parent;
    },

    /**
     * 
     * 获取当前的根节点
     * 
     * @returns 
     */
    getRoot() {
        if (!this.parent) {
            return this;
        }

        let parent = this.parent;
        while (parent) {
            if (parent.parent) {
                parent = parent.parent
            } else {
                break;
            }
        }
        return parent;
    },
});
