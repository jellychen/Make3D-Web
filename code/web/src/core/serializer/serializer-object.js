/* eslint-disable no-unused-vars */

import Constants  from './constants';
import Serializer from './serializer';

/**
 * Mixin
 */
Object.assign(Serializer.prototype, {
    /**
     * 
     * 存储场景
     * 
     * @param {*} object
     */
    *storeObject(object) {
        // 如果是辅助对象直接跳出
        if (object.userData.__is_auxiliary__) {
            return;
        }

        // 场景
        if (object.isScene) {
            yield* this.storeScene(object);
        }

        // Group
        else if (object.isGroup) {
            yield* this.storeGroup(object);
        }

        // 站位
        else if (object.is_placeholder) {
            yield* this.storePlaceholder(object);
        }

        // 灯光
        else if (object.isLight) {
            this.storeLight(object.isLight);
        }

        // 可编辑网格
        else if (object.isEditableMesh) {
            yield* this.storeMeshEditable(object);
        }

        // Mesh
        else if (object.isMesh) {
            yield* this.storeMesh(object);
        }

        // 
        else if (object.isObject3D) {
            yield* this.storeGroup(object);
        }

        // error
        else {
            throw new Error("data error");
        }

        yield object;

        return this;
    },
});
