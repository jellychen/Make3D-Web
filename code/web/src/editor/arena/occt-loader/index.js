/* eslint-disable no-unused-vars */

import GlobalScope from '@common/global-scope';
import OCCT        from '@core/occt';
import LoaderView  from './v';

/**
 * 
 * 异步加载OCCT内核
 * 
 * @returns 
 */
export default async function() {
    //
    // 如果已经加载过了
    // 直接返回
    //
    if (GlobalScope.OCCT && GlobalScope.OCCT.Module) {
        return GlobalScope.OCCT.Module;
    }

    // 显示加载框
    const start_time = performance.now();
    const view = new LoaderView();
    document.body.appendChild(view);

    // 异步加载
    try {
        await OCCT(window.crossOriginIsolated);
    } catch(e) {
        console.error(e);
    }

    //
    // 取消加载框
    // 防止出现闪烁，小于1秒，延迟销毁
    //
    const current = performance.now();
    const elapsed = current - start_time;
    if (elapsed > 1500) {
        view.dispose();
    } else {
        setTimeout(view.dispose(), 1500 - elapsed);
    }

    if (GlobalScope.OCCT && GlobalScope.OCCT.Module) {
        return GlobalScope.OCCT.Module;
    }
}
