
import XThree              from '@xthree/basic';
import RefCount            from '@common/misc/ref-count';
import EditableMesh_Bucket from './mesh/editable.bucket';

/**
 * Mixin
 */
[
    XThree.Texture, 
    XThree.BufferGeometry, 
    XThree.Material,

    EditableMesh_Bucket,

].forEach(element => {
    Object.assign(element.prototype, {
        /**
         * 获取引用计数
         */
        __$$_ref_count__() {
            if (!this.__$$$_ref_count_$$$___) {
                this.__$$$_ref_count_$$$___ = new RefCount(this, 1);
            }
            return this.__$$$_ref_count_$$$___;
        },

        /**
         * 
         * 判断有没有引用计数
         * 
         * @returns 
         */
        __$$_has_ref_count__() {
            return undefined != this.__$$$_ref_count_$$$___;
        },

        /**
         * 
         * 增加引用计数
         * 
         * @returns 
         */
        __$$_add_ref__() {
            this.__$$_ref_count__().addRef();
            return this;
        },

        /**
         * 
         * 减少引用计数
         * 
         * @returns 
         */
        __$$_del_ref__() {
            this.__$$_ref_count__().delRef();
            return this;
        },

        /**
         * 析构函数
         */
        __$$_destructor__() {
            this.dispose();
        },

        /**
         * 
         * __$$_add_ref__ 同名函数
         * 
         * @returns 
         */
        retain() {
            return this.__$$_add_ref__();
        },

        /**
         * 
         * __$$_del_ref__ 同名函数
         * 
         * @returns 
         */
        release() {
            return this.__$$_del_ref__();
        }
    });
})
