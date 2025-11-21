/* eslint-disable no-unused-vars */

import * as BVH            from 'three-mesh-bvh';
import XThree              from '@xthree/basic';
import GeoToCreasedNormals from '../../utils/geo-to-creased-normals';

XThree.BufferGeometry.prototype.computeBoundsTree = BVH.computeBoundsTree;
XThree.BufferGeometry.prototype.disposeBoundsTree = BVH.disposeBoundsTree;
XThree.Mesh.prototype.raycast                     = BVH.acceleratedRaycast;

/**
 * 备份 dispose
 */
const _original_raycast = XThree.Mesh.prototype.raycast;

/**
 * Mixin
 */
Object.assign(XThree.Mesh.prototype, {
    /**
     * 
     * 获取顶点的数量
     * 
     * @returns 
     */
    verticesCount() {
        if (!this.geometry) {
            return 0;
        }

        const geo = this.geometry;
        if (geo instanceof XThree.BufferGeometry && geo.attributes.position) {
            return geo.attributes.position.count;
        }
        return 0;
    },

    /**
     * 
     * 获取面的数量
     * 
     * @returns 
     */
    facesCount() {
        if (!this.geometry) {
            return 0;
        }

        const geo = this.geometry;
        if (geo instanceof XThree.BufferGeometry && geo.attributes.position) {
            if (geo.index !== null) {
                return geo.index.count / 3;
            } else {
                return geo.attributes.position.count / 3;
            }
        }
        return 0;
    },

    /**
     * 构建BVH
     */
    buildBVH() {
        if (this.geometry && !this.geometry.bvh) {
            if (this.geometry.attributes.position) {
                this.geometry.computeBoundsTree();
            }
            this.geometry.bvh = true;
        }
        return this;
    },

    /**
     * 
     * 更新
     * 
     * @returns 
     */
    geoChanged() {
        this.geometry.bvh            = false;
        this.geometry.boundingBox    = null;
        this.geometry.boundingSphere = null;
        return this;
    },

    /**
     * 
     * 替换射线拾取
     * 
     * @param {*} raycaster 
     * @param {*} intersects 
     */
    raycast(raycaster, intersects) {
        if (this.geometry && !this.geometry.bvh) {
            this.buildBVH();
        }
        return BVH.acceleratedRaycast.call(this, raycaster, intersects);
    },

    /**
     * 
     * 计算点法线
     * 
     * @returns 
     */
    computeVertexNormals() {
        if (this.geometry) {
            this.geometry.computeVertexNormals();
        }
        return this;
    },

    /**
     * 
     * 计算点的法线 并保留硬边
     * 
     * @param {*} crease_angle 
     * @returns 
     */
    computeVertexNormalsAndReserveAcuteAngle(crease_angle = Math.PI / 12) {
        if (this.geometry) {
            const geometry = this.geometry;
            this.geometry = GeoToCreasedNormals(geometry, crease_angle);
            if (this.geometry != geometry) {
                geometry.dispose();
            }
        }
        return this;
    },

    /**
     * 
     * 几何变动
     * 
     * @param {*} mat4 
     */
    geoApplyMat4(mat4) {
        if (this.geometry) {
            this.geometry.applyMat4(mat4);
            this.geoChanged();
        }
        return this;
    }
});
