
import XThree from '@xthree/basic';

/**
 * 临时使用
 */
const _empty_u16_array = new Uint16Array();
const _empty_u32_array = new Uint32Array();

/**
 * Mixin
 */
Object.assign(XThree.BufferGeometry.prototype, {
    /**
     * 
     * 设置索引数据
     * 
     * @param {Uint16Array} indices
     * @param {boolean} copy 
     * @returns  
     */
    setIndices16(indices, copy = false) {
        if (indices && !(indices instanceof Uint16Array)) {
            throw new Error("buffer is not Uint16Array");
        }

        if (indices) {
            if (copy) {
                indices = indices.slice();
            }
        } else {
            indices = _empty_u16_array;
        }

        this.setIndex(new XThree.BufferAttribute(indices, 1));
        return this;
    },

    /**
     * 
     * 设置索引数据
     * 
     * @param {Uint32Array} indices
     * @param {boolean} copy 
     * @returns  
     */
    setIndices32(indices, copy = false) {
        if (indices && !(indices instanceof Uint32Array)) {
            throw new Error("buffer is not Uint32Array");
        }

        if (indices) {
            if (copy) {
                indices = indices.slice();
            }
        } else {
            indices = _empty_u32_array;
        }
        
        this.setIndex(new XThree.BufferAttribute(indices, 1));
        return this;
    },
});
