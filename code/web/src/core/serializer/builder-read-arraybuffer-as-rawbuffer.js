/* eslint-disable no-unused-vars */

import XThree       from '@xthree/basic';
import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import Constants    from './constants';
import Builder      from './builder';

/**
 * Mixin
 */
Object.assign(Builder.prototype, {
    /**
     * 
     * 读取
     * 
     * @returns 
     */
    readArrayBufferAsRawBuffer() {
        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            RawBuffer,
        } = Chameleon;

        // 读取
        const buffer = this.read_Buf(false);
        if (!buffer || !(buffer instanceof ArrayBuffer)) {
            return;
        }

        if (0 == buffer.byteLength) {
            return;
        }

        // 创建
        const raw_buffer = new RawBuffer(buffer.byteLength);
        const raw_buffer_content = raw_buffer.arraybuffer();
        raw_buffer_content.set(new Uint8Array(buffer));
        return raw_buffer;
    },
});
