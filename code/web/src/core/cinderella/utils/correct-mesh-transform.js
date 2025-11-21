/* eslint-disable no-unused-vars */

import isFunction       from 'lodash/isFunction';
import XThree           from '@xthree/basic';
import ParametersScoped from '@core/houdini/scoped-parameters';

/**
 * 临时变量
 */
const _vec3_0 = new XThree.Vector3();
const _mat4_0 = new XThree.Matrix4();

/**
 * 
 * 修复变换器
 * 
 * @param {*} mesh 
 */
export default function(mesh) {
    const geometry = mesh.geometry;
    if (!geometry) {
        return;
    }

    geometry.computeBoundingBox();
    const aabb = geometry.boundingBox;
    if (!aabb) {
        return;
    }
    aabb.getCenter(_vec3_0);

    // 执行变换
    const x = _vec3_0.x;
    const y = _vec3_0.y;
    const z = _vec3_0.z;
    if (x == 0 && y == 0 && z == 0) {
        return;
    } else {
        _mat4_0.makeTranslation(-x, -y, -z);

        if (isFunction(mesh.getEditableSoup)) {
            const soup = mesh.getEditableSoup();
            if (soup) {
                ParametersScoped.setMat4(0, _mat4_0);
                soup.transform_PS0();
            }
        }
        
        mesh.geoApplyMat4(_mat4_0);
        mesh.position.x += x;
        mesh.position.y += y;
        mesh.position.z += z;
        mesh.getMatrixWorld(true);
    }
}