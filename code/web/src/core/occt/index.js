/* eslint-disable no-unused-vars */

// import GlobalScope      from '@common/global-scope';
// import RemoteWasmLoader from '@common/misc/remote-wasm-loader';

// // 多线程版本
// import UrlMc0           from '@assets/wasm/occt-core';
// import UrlMc_WASM       from '@assets/wasm/occt-core.wasm';

// /**
//  * 
//  * 异步加载
//  * 
//  * @param {*} threading 
//  * @returns 
//  */
// export default async function(threading = true) {
//     if (GlobalScope.OCCT && GlobalScope.OCCT.Module) {
//         return GlobalScope.OCCT.Module;
//     }

//     return new Promise((resolve, reject) => {
//         if (threading) {
//             RemoteWasmLoader(UrlMc0, undefined, UrlMc_WASM, (success, module)=> {
//                 if (success) {
//                     GlobalScope.OCCT = GlobalScope.OCCT || {};
//                     GlobalScope.OCCT.Module = module;
//                     resolve(module);
//                 } else {
//                     reject();
//                     console.error('load occt wasm fail');
//                 }
//             });
//         } else {
//             throw new Error("not support single thread");
//         }
//     });
// }

export default async function(threading = true) {
    throw new Error("occt is not support");
}
