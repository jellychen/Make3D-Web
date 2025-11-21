/* eslint-disable no-unused-vars */

import RemoteWasmLoader from '@common/misc/remote-wasm-loader';

// 多线程版本
import UrlMc0           from '@assets/wasm/houdini-core';
import UrlMc_WASM       from '@assets/wasm/houdini-core.wasm';

/**
 * 
 * 异步加载函数
 * 
 * @param {Function} callback 
 */
export default function(callback, threading = true) {
    callback = callback || (() => {});
    if (threading) {
        RemoteWasmLoader(
            UrlMc0, 
            undefined, 
            UrlMc_WASM, 
            (success, module)=> {
                if (success) {
                    callback(true , module);
                } else {
                    callback(false, module);
                }
            });
    } else {
        throw new Error("not support single thread");
    }
}
