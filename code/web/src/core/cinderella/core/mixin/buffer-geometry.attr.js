
import XThree from '@xthree/basic';

/**
 * 临时使用
 */
const _empty_f32_array = new Float32Array();

/**
 * Mixin
 */
Object.assign(XThree.BufferGeometry.prototype, {
    /**
     * 
     * 删除指定的属性
     * 
     * 
     * @param {*} slot position / normal / color / uv
     * @returns 
     */
    deleteAttr(slot) {
        this.deleteAttribute(slot);
        return this;
    },

    /**
     * 
     * 设置几何体的属性数据, 会触发拷贝操作
     * 
     * @param {string} slot 'position'-3 | 'normal'-3 | 'color'-3 |'uv'-2
     * @param {Float32Array} buffer 
     * @param {Number} item_size 
     * @param {boolean} copy 
     * @returns 
     */
    setAttr(slot, buffer, item_size, copy = false) {
        if (buffer && !(buffer instanceof Float32Array)) {
            throw new Error("buffer is not Float32Array");
        }

        if (buffer) {
            if (copy) {
                buffer = buffer.slice();
            }
        } else {
            buffer = _empty_f32_array;
        }

        this.setAttribute(slot, new XThree.BufferAttribute(buffer, item_size));
        return this;
    },
});
