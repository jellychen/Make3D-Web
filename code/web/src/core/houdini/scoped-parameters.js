/* eslint-disable no-unused-vars */

import isInteger   from 'lodash/isInteger';
import isUndefined from 'lodash/isUndefined';
import GlobalScope from '@common/global-scope';

// 共享的参数
let ParametersScoped;

// 导出
export default {
    /**
     * 安装初始化
     */
    __setup_ifneed__() {
        if (isUndefined(ParametersScoped)) {
            ParametersScoped = GlobalScope.Chameleon.ParametersScoped.Default();
        }
        return ParametersScoped;
    },

    /**
     * 获取
     */
    getF32Arr() {
        return ParametersScoped.arr_f32();
    },

    /**
     * 
     * 设置 Vec2
     * 
     * @param {Number} slot 
     * @param {*} vec2 
     */
    setVec2(slot, vec2) {
        return this.setVec2_XY(slot, vec2.x, vec2.y);
    },

    /**
     * 
     * 设置 Vec2
     * 
     * @param {Number} slot 
     * @param {Number} x 
     * @param {Number} y 
     */
    setVec2_XY(slot, x, y) {
        if (!isInteger(slot)) {
            return false;
        } else {
            const buffer = ParametersScoped.vec2(slot);
            buffer[0] = x;
            buffer[1] = y;
            return true;
        }
    },

    /**
     * 
     * 获取
     * 
     * @param {Number} slot 
     * @param {*} out_vec2 
     */
    getVec2(slot, out_vec2) {
        if (!isInteger(slot)) {
            return false;
        } else {
            const buffer = ParametersScoped.vec2(slot);
            out_vec2.x = buffer[0];
            out_vec2.y = buffer[1];
            return true;
        }
    },

    /**
     * 
     * 设置 Vec3
     * 
     * @param {Number} slot 
     * @param {*} vec3 
     */
    setVec3(slot, vec3) {
        return this.setVec3_XYZ(slot, vec3.x, vec3.y, vec3.z);
    },

    /**
     * 
     * 设置 Vec3
     * 
     * @param {Number} slot 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setVec3_XYZ(slot, x, y, z) {
        if (!isInteger(slot)) {
            return false;
        } else {
            const buffer = ParametersScoped.vec3(slot);
            buffer[0] = x;
            buffer[1] = y;
            buffer[2] = z;
            return true;
        }
    },

    /**
     * 
     * 获取
     * 
     * @param {Number} slot 
     * @param {*} out_vec3 
     */
    getVec3(slot, out_vec3) {
        if (!isInteger(slot)) {
            return false;
        } else {
            const buffer = ParametersScoped.vec3(slot);
            out_vec3.x = buffer[0];
            out_vec3.y = buffer[1];
            out_vec3.z = buffer[2];
            return true;
        }
    },

    /**
     * 
     * 设置 Vec4
     * 
     * @param {Number} slot 
     * @param {*} vec4 
     */
    setVec4(slot, vec4) {
        return this.setVec4_XYZW(slot, vec4.x, vec4.y, vec4.z, vec4.w);
    },

    /**
     * 
     * 设置 Vec4
     * 
     * @param {Number} slot 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} w 
     */
    setVec4_XYZW(slot, x, y, z, w) {
        if (!isInteger(slot)) {
            return false;
        } else {
            const buffer = ParametersScoped.vec4(slot);
            buffer[0] = x;
            buffer[1] = y;
            buffer[2] = z;
            buffer[3] = w;
            return true;
        }
    },

    /**
     * 
     * 获取
     * 
     * @param {Number} slot 
     * @param {*} out_vec4
     */
    getVec4(slot, out_vec4) {
        if (!isInteger(slot)) {
            return false;
        } else {
            const buffer = ParametersScoped.vec4(slot);
            out_vec4.x = buffer[0];
            out_vec4.y = buffer[1];
            out_vec4.z = buffer[2];
            out_vec4.w = buffer[3];
            return true;
        }
    },

    /**
     * 
     * 设置 mat3
     * 
     * @param {Number} slot 
     * @param {*} mat3
     */
    setMat3(slot, mat3) {
        if (!isInteger(slot)) {
            return false;
        } else {
            ParametersScoped.mat3(slot).set(mat3.elements);
            return true;
        }
    },

    /**
     * 
     * 设置 mat4
     * 
     * @param {Number} slot 
     * @param {*} mat4 
     * @returns 
     */
    setMat4(slot, mat4) {
        if (!isInteger(slot)) {
            return false;
        } else {
            ParametersScoped.mat4(slot).set(mat4.elements);
            return true;
        }
    },

    /**
     * 
     * 设置
     * 
     * @param {*} v3 
     * @returns 
     */
    setLocation(v3) {
        const buffer = ParametersScoped.location();
        buffer[0] = v3.x;
        buffer[1] = v3.y;
        buffer[2] = v3.z;
        return true;
    },

    /**
     * 
     * 获取值
     * 
     * @param {*} v3 
     */
    getLocation(v3) {
        const buffer = ParametersScoped.location();
        v3.x = buffer[0];
        v3.y = buffer[1];
        v3.z = buffer[2];
        return true;
    },

    /**
     * 
     * 设置 mat4
     * 
     * @param {*} mat4 
     * @returns 
     */
    setMatrix(mat4) {
        ParametersScoped.m().set(mat4.elements);
        return true;
    },

    /**
     * 
     * 设置 mat4
     * 
     * @param {*} mat4 
     * @returns 
     */
    setV(mat4) {
        ParametersScoped.v().set(mat4.elements);
        return true;
    },

    /**
     * 
     * 设置 mat4
     * 
     * @param {*} mat4 
     * @returns 
     */
    setP(mat4) {
        ParametersScoped.p().set(mat4.elements);
        return true;
    },

    /**
     * 
     * 设置 mat4
     * 
     * @param {*} mat4 
     * @returns 
     */
    setVP(mat4) {
        ParametersScoped.vp().set(mat4.elements);
        return true;
    },

    /**
     * 
     * 设置视椎体的远近
     * 
     * @param {Number} near 
     * @param {Number} far 
     * @returns 
     */
    setFrustumNearAndFar(near, far) {
        const buffer = ParametersScoped.camera_frustum_near_far();
        buffer[0] = near;
        buffer[1] = far;
        return true;
    },

    /**
     * 
     * 设置相机的位置
     * 
     * @param {*} vec3 
     */
    setCameraLocation(vec3) {
        const buffer = ParametersScoped.camera_location();
        buffer[0] = vec3.x;
        buffer[1] = vec3.y;
        buffer[2] = vec3.z;
        return true;
    },

    /**
     * 
     * 设置相机看向的点
     * 
     * @param {*} vec3 
     */
    setCameraLookatTarget(vec3) {
        const buffer = ParametersScoped.camera_lookat_target();
        buffer[0] = vec3.x;
        buffer[1] = vec3.y;
        buffer[2] = vec3.z;
        return true;
    },

    /**
     * 
     * 设置 视口尺寸
     * 
     * @param {*} w 
     * @param {*} h 
     * @param {*} pixel_ratio 
     * @returns 
     */
    setViewportSize(w, h, pixel_ratio = 1) {
        const buffer = ParametersScoped.viewport_size();
        buffer[0] = w;
        buffer[1] = h;
        buffer[2] = pixel_ratio;
        return true;
    },

    /**
     * 
     * 设置盒子
     * 
     * @param {*} x0 
     * @param {*} y0 
     * @param {*} x1 
     * @param {*} y1 
     * @returns 
     */
    setBox(x0, y0, x1, y1) {
        const buffer = ParametersScoped.box();
        buffer[0] = x0;
        buffer[1] = y0;
        buffer[2] = x1;
        buffer[3] = y1;
        return true;
    },

    /**
     * 
     * 设置
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    setPointer(x, y) {
        const buffer = ParametersScoped.pointer();
        buffer[0] = x;
        buffer[1] = y;
        return true;
    },

    /**
     * 
     * 设置射线
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @returns 
     */
    setRayOrigin(x, y, z) {
        const buffer = ParametersScoped.ray_origin();
        buffer[0] = x;
        buffer[1] = y;
        buffer[2] = z;
        return true;
    },

    /**
     * 
     * 设置射线
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @returns 
     */
    setRayDir(x, y, z) {
        const buffer = ParametersScoped.ray_dir();
        buffer[0] = x;
        buffer[1] = y;
        buffer[2] = z;
        return true;
    },

    /**
     * 
     * 设置摄像
     * 
     * @param {*} ray 
     */
    setRay(ray) {
        const o = ray.origin;
        const d = ray.direction;
        this.setRayOrigin(o.x, o.y, o.z);
        this.setRayDir   (d.x, d.y, d.z);
    },
}
