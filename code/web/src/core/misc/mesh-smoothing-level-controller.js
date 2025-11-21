/* eslint-disable no-unused-vars */

import GlobalScope from '@common/global-scope';

/**
 *
 * 功能说明
 * 
 * Mesh 对角度阈值超过指定的阈值进行拆边
 * 这样可以确保平滑着色的时候对硬边的保护
 * 
 * 本类就是实现这个阈值的调节
 * 
 */
export default class MeshSmoothingLevelController {
    /**
     * 网格
     */
    #mesh;

    /**
     * 网格的soup
     */
    #soup;

    /**
     * 临时
     */
    #geo_buffer_vertices;
    #geo_buffer_indices;

    /**
     * 折角， 弧度制
     */
    #crease_angle = 0;

    /**
     * 获取
     */
    get mesh() {
        return this.#mesh;
    }

    /**
     * 获取
     */
    get soup() {
        return this.#soup;
    }

    /**
     * 获取
     */
    get crease_angle() {
        return this.#crease_angle;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} mesh 
     */
    constructor(mesh) {
        if (!mesh || !mesh.isEditableMesh) {
            throw new Error("mesh must be isEditableMesh");
        }

        this.#mesh         = mesh;
        this.#soup         = mesh.getEditableSoup();
        this.#crease_angle = mesh.crease_angle;
        if (!this.#soup) {
            throw new Error("mesh getEditableSoup fail");
        }
    }

    /**
     * 
     * 执行平滑
     * 
     * @param {*} crease_angle 
     */
    smoothing(crease_angle = Math.PI / 12) {
        if (crease_angle < 0 || this.#crease_angle == crease_angle) {
            return false;
        } else {
            this.#crease_angle = crease_angle;
        }

        //
        // 如果是首次执行平滑
        // 先从Soup中三角化后拿到基模的GEO信息, 后续在基模上进行调整
        //
        if (!this.#geo_buffer_vertices || !this.#geo_buffer_indices) {
            const Chameleon = GlobalScope.Chameleon;
            const {
                GeoSolidSoupTriangulator,
            } = Chameleon;
            this.#geo_buffer_vertices = this.#soup.vertices().slice();
            this.#geo_buffer_indices  = GeoSolidSoupTriangulator.ConvenientPerform(this.#soup.getPtr()).slice();
        }

        this.#mesh.crease_angle = this.#crease_angle;
        this.#mesh.rebuildNewEmptyGeometry();
        this.#mesh.setGeoVertices(this.#geo_buffer_vertices, true);
        this.#mesh.setGeoIndices32(this.#geo_buffer_indices, true);
        this.#mesh.computeVertexNormalsAndReserveAcuteAngle(crease_angle);
        this.#mesh.geoChanged();

        return true;
    }

    /**
     * 销毁
     */
    dispose() {
        ;
    }
}
