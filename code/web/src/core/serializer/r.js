/* eslint-disable no-unused-vars */

import ByteBuffer  from 'bytebuffer';

/**
 * 临时
 */
const _empty_arraybuffer = new ArrayBuffer(0);

/**
 * 读取
 */
export default class Reader {
    /**
     * 数据
     */
    #buffer;

    /**
     * 
     * 构造函数
     * 
     * @param {*} arraybuffer 
     */
    constructor(arraybuffer) {
        this.#buffer = ByteBuffer.wrap(arraybuffer);
    }

    /**
     * 
     * 还剩多少数据
     * 
     * @returns 
     */
    remaining() {
        return this.#buffer.remaining();
    }

    /**
     * 
     * 标记偏移
     * 
     * @returns 
     */
    markOffset() {
        return this.#buffer.mark();
    }

    /**
     * 
     * 恢复偏移
     * 
     * @returns 
     */
    resetToMarkOffset() {
        return this.#buffer.reset();
    }

    /**
     * 
     * 跳过
     * 
     * @param {*} offset 
     * @returns 
     */
    skip(offset) {
        this.#buffer.skip(offset);
        return this;
    }

    /**
     * 
     * 读取
     * 
     * @returns 
     */
    read_Byte() {
        if (this.remaining() < 1) {
            throw new Error('data error');
        }
        return this.#buffer.readByte();
    }

    /**
     * 
     * 读取整数
     * 
     * @returns 
     */
    read_I32() {
        if (this.remaining() < 4) {
            throw new Error('data error');
        }
        return this.#buffer.readInt32();
    }

    /**
     * 
     * 读取浮点数
     * 
     * @returns 
     */
    read_F32() {
        if (this.remaining() < 4) {
            throw new Error('data error');
        }
        return this.#buffer.readFloat32();
    }

    /**
     * 
     * 读取字符串
     * 
     * @returns 
     */
    read_Str() {
        if (this.remaining() < 4) {
            throw new Error('data error');
        }

        const len = this.read_I32();
        if (0 == len) {
            return '';
        }

        if (this.remaining() < len) {
            throw new Error('data error');
        }
        return this.#buffer.readUTF8String(len);
    }

    /**
     * 
     * 读取一个Arraybuffer
     * 
     * @param {*} copy 
     * @returns 
     */
    read_Buf(copy = false) {
        if (this.remaining() < 4) {
            throw new Error('data error');
        }

        const len = this.read_I32();
        if (0 == len) {
            return _empty_arraybuffer;
        }

        if (this.remaining() < len) {
            throw new Error('data error');
        }

        const begin  = this.#buffer.offset;
        const end    = this.#buffer.offset + len;
        const buffer = this.#buffer.slice(begin, end).toArrayBuffer(copy);
        this.#buffer.skip(len);

        return buffer;
    }
}

