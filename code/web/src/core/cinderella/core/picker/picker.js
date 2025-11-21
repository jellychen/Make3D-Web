
import isFunction from "lodash/isFunction";

/**
 * 通过CPU进行拾取
 */
export default class Picker {
    /**
     * 成员
     */
    #raycaster;

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 设置射线
     * 
     * @param {*} raycaster 
     */
    setRaycaster(raycaster) {
        this.#raycaster = raycaster;
    }

    /**
     * 
     * 射线提取，跳过不可见的元素
     * 
     * @param {*} object 对象
     * @param {*} recursive 
     * @param {*} intersects 
     * @returns 
     */
    intersect(object, recursive = true, intersects = []) {
        if (object && isFunction(object.isSelectable)) {
            if (!object.isSelectable()) {
                return intersects;
            }
        }

        // 递归实现
        const raycaster = this.#raycaster;
        if (!object.pickignore && object.layers.test(raycaster.layers)) {
            object.raycast(raycaster, intersects);
        }

        if (recursive) {
            const children = object.children;
            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];
                if (!child.isVisible()) {
                    continue;
                } else {
                    this.intersect(children[i], true, intersects);
                }
            }
        }

        intersects.sort((a, b) => a.distance - b.distance);

        return intersects;
    }
}
