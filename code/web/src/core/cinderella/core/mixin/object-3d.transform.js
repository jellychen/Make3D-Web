/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 用来节省内存的临时变量
 */
const vec3_0 = new XThree.Vector3();
const vec3_1 = new XThree.Vector3();
const vec3_2 = new XThree.Vector3();
const mat4_0 = new XThree.Matrix4();

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 获取基点
     * 
     * @param {boolean} update 
     */
    getBasePoint(update = false) {
        if (update) {
            this.updateWorldMatrix(true, false);
        }
        vec3_0.set(0, 0, 0);
        return vec3_0.applyMatrix4(this.matrixWorld);
    },
 
    /**
     * 分解矩阵
     */
    decompose() {
        this.matrix.decompose(this.position, this.quaternion, this.scale);
    },
    
    /**
     * 
     * 获取模型坐标系
     * 
     * @param {*} compose 
     * @returns 
     */
    getMatrix(compose = false) {
        if (compose) {
            this.compose();
        }
        return this.matrix;
    },

    /**
     * 
     * 获取世界坐标系
     * 
     * @param {*} update 
     * @returns 
     */
    getMatrixWorld(update = false) {
        if (true === update) {
            this.updateWorldMatrix(true, false);
        }
        return this.matrixWorld;
    },

    /**
     * 
     * 获取父亲的世界坐标系
     * 
     * @param {*} update 
     * @returns 
     */
    getParentMatrixWorld(update = false) {
        let parent = this.parent;
        if (parent) {
            return parent.getMatrixWorld(update);
        }
        return mat4_0.identity();
    },

    /**
     * 重置偏移
     */
    resetTranslate() {
        this.position.set(0, 0, 0);
    },

    /**
     * 重置缩放
     */
    resetScale() {
        this.scale.set(1, 1, 1);
    },

    /**
     * 重置旋转
     */
    resetRotation() {
        this.rotation.set(0, 0, 0);
    },

    /**
     * 重置变换
     */
    resetTransform() {
        this.position.set(0, 0, 0);
        this.rotation.set(0, 0, 0);
        this.scale   .set(1, 1, 1);
    },

    /**
     * 
     * 从其他人那里拷贝
     * 
     * @param {*} other 
     */
    copyFromOther(other) {
        this.position.copy(other.position);
        this.rotation.copy(other.rotation);
        this.scale   .copy(other.scale   );
    },

    /**
     * 
     * 重置
     * 
     * @param {*} matrix 
     */
    resetMatrix(matrix) {
        matrix.decompose(this.position, this.quaternion, this.scale);
    },

    /**
     * 
     * 通过定点和朝向
     * 
     * @param {*} position 
     * @param {*} z_dir 
     */
    setPositionOrientation(position, z_dir) {
        this.matrix.identity();
        vec3_0.copy(z_dir).normalize();
        vec3_1.x = 0;
        vec3_1.y = 0;
        vec3_1.z = 1;
        this.position.copy(position);
        this.quaternion.setFromUnitVectors(vec3_1, vec3_0);
    },

    /**
     * 合成矩阵
     */
    compose() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        return this.matrix;
    },
});
