
import Notifier       from './misc/notifier';
import Log            from './misc/logger';
import Idel           from './misc/idle';
import AssginRefCount from './misc/ref-count';

/**
 * 代表一个全局作用域，用来了浏览器的Window隔离
 */
export default {
    log:                            Log,
    idel:                           Idel,
    assginRefCount:                 AssginRefCount,
    notifier:                       Notifier,

    // wasm 内核
    chameleon:                      undefined, // 内核
    Chameleon:                      undefined, // 内核
    ChameleonScopedParameters:      undefined, // 内核参数共享

    // 留给UX扩展
    alertBox:                       undefined,
    toast:                          undefined, 
    createWindow:                   undefined,
    createTipsManager:              undefined,
    showVipSubscriber:              undefined,
}
