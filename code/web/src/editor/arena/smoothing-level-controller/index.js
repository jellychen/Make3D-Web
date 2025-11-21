/* eslint-disable no-unused-vars */

import ComputePosition          from '@common/misc/compute-position';
import SmoothingLevelController from './v';

/**
 * 
 * 显示调整
 * 
 * @param {*} coordinator 
 * @param {*} mesh 
 * @param {*} parent 
 * @param {*} ref_element 
 * @returns 
 */
export default function(coordinator, mesh, parent, ref_element) {
    if (!coordinator || !mesh || !mesh.isEditableMesh) {
        return false;
    }

    const controller = new SmoothingLevelController(coordinator);
    controller.setupMesh(mesh);
    if (parent) {
        parent.appendChild(controller);
    } else {
        document.body.appendChild(controller);
    }
    ComputePosition(ref_element, controller, 'top');
    return controller;
}