/* eslint-disable no-unused-vars */

import GlobalScope from '@common/global-scope';

/**
 * 
 * 从 geometry 获取 tris
 * 
 * position 一定有
 * indices  未必有
 * 
 * @param {*} geo 
 */
export default function(geo) {
    const position = geo.getAttribute('position');
    if (!position) {
        return null;
    }
    
    // 获取数据
    const v_count = position.count;
    if (v_count == 0) {
        return null;
    }

    // 索引数据
    const indices = geo.getIndex();
    const i_count = indices ? indices.count : 0;
    
    // 获取感兴趣的类
    const Chameleon = GlobalScope.Chameleon;
    const {
        GeoSolidTris,
    } = Chameleon;

    //
    // 创建
    //
    const tris = GeoSolidTris.MakeSharedArguments(v_count, i_count);

    //
    // position.array
    //
    tris.vertices().set(position.array);

    //
    // indices .array
    //
    if (i_count > 0) {
        let buffer = indices.array;
        if (!(buffer instanceof Uint16Array)) {
            buffer = Uint32Array.from(buffer);
        } else if (!(buffer instanceof Uint32Array)) {
            throw new Error("buffer is invalid");
        }
        tris.indices().set(buffer);
    }

    return tris;
}
