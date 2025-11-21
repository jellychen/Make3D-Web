/* eslint-disable no-unused-vars */

import isUndefined    from 'lodash/isUndefined';
import isTypedArray   from 'lodash/isTypedArray';
import isNumber       from 'lodash/isNumber';
import isString       from 'lodash/isString';
import isArrayBuffer  from 'lodash/isArrayBuffer';
import isFunction     from 'lodash/isFunction';
import JSZIP          from 'jszip';
import ByteBuffer     from 'bytebuffer';
import BlobDownloader from '@common/misc/blob-downloader';

/**
 * 临时
 */
const _empty_arraybuffer = new ArrayBuffer();

/**
 * 写入
 */
export default class Writer {
    /**
     * 数据
     */
    #buffer;

    /**
     * 构造函数
     */
    constructor(buffer) {
        if (isUndefined(buffer)) {
            this.#buffer = new ByteBuffer();
        } else {
            this.#buffer = buffer;
        }
    }

    /**
     * 
     * 转 Arraybuffer
     * 
     * @param {*} copy 
     * @returns 
     */
    toArrayBuffer(copy = false) {
        return this.#buffer.toArrayBuffer(copy);
    }

    /**
     * 
     * 插入
     * 
     * @param {*} value 
     */
    append_Byte(value) {
        if (!isNumber(value)) {
            throw new Error('value is not number');
        }
        this.#buffer.writeByte(value);
        return this;
    }

    /**
     * 
     * 插入32位数
     * 
     * @param {*} value 
     * @returns 
     */
    append_I32(value) {
        if (!isNumber(value)) {
            throw new Error('value is not number');
        }
        this.#buffer.writeInt32(value);
        return this;
    }

    /**
     * 
     * 插入32浮点数
     * 
     * @param {*} value 
     * @returns 
     */
    append_F32(value) {
        if (!isNumber(value)) {
            throw new Error('value is not number');
        }
        this.#buffer.writeFloat32(value);
        return this;
    }

    /**
     * 
     * 插入字符串
     * 
     * @param {*} str 
     * @param {*} with_length 
     * @returns 
     */
    append_Str(str, with_length = true) {
        if (!isString(str)) {
            str = '';
        }

        if (with_length) {
            this.#buffer.writeInt32(ByteBuffer.calculateUTF8Bytes(str));
        }
        this.#buffer.writeUTF8String(str);
        return this;
    }

    /**
     * 
     * 插入Arraybuffer
     * 
     * @param {*} buf 
     * @param {*} with_length 
     * @returns 
     */
    append_Buf(buf, with_length = true) {
        if (isUndefined(buf)) {
            buf = _empty_arraybuffer;
        } else if (buf instanceof ArrayBuffer) {
            buf = new Uint8Array(buf);
        } else if (!isTypedArray(buf)) {
            throw new Error('buf is not TypedArray');
        } else if (!(buf instanceof Uint8Array)) {
            buf = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength); 
        }

        if (with_length) {
            this.#buffer.writeInt32(buf.byteLength);
        }
        this.#buffer.append(buf);
        return this;
    }

    /**
     * 
     * 异步压缩创建
     * 
     * @param {*} callback 
     */
    generateZipBlobAsync(callback) {
        const len = this.#buffer.offset;
        const buf = this.#buffer.buffer.slice(0, len);
        const zip = new JSZIP();
        zip.file('content-buffer', buf);
        zip.generateAsync({ type: 'blob' })
           .then(content => {
                if (isFunction(callback)) {
                    callback(content);
                }
            });
    }

    /**
     * 
     * 打包并下载
     * 
     * @param {*} name 
     * @param {*} finish_callback 
     */
    generateZipBlobAsyncAndDownloader(name="", finish_callback = undefined) {
        this.generateZipBlobAsync(blob => {
            BlobDownloader(blob, name);
            if (isFunction(finish_callback)) {
                finish_callback();
            }
        })
    }
}
