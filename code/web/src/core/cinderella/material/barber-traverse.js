/* eslint-disable no-unused-vars */

import isUndefined  from "lodash/isUndefined";
import isArray      from "lodash/isArray";
import PbrConverter from './barber-pbr-converter';

/**
 * 
 * 对所有的object和孩子的材质都执行检测
 * 
 * @param {*} object 
 * @returns 
 */
export default function BarberTraverse(object) {
    const will_disposed_materials = new Set();
    object.traverse(element => {
        if (isUndefined(element.material)) {
            return;
        }

        let material = element.material;
        if (isArray(material) && material.length > 0) {
            const pbr = PbrConverter(material[0]);
            for (const item of material) {
                if (pbr == item) {
                    continue
                } else {
                    will_disposed_materials.add(item);
                }
            }
            element.material = pbr;
        } else {
            const pbr = PbrConverter(material);
            if (material != pbr) {
                will_disposed_materials.add(material);
            }
            element.material = pbr;
        }
    }, true);

    //
    // 删除不必要的材质
    //
    for (const material of will_disposed_materials) {
        material.dispose();
    }

    return object;
}
