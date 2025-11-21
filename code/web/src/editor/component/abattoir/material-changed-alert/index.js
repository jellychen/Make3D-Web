/* eslint-disable no-unused-vars */

import MaterialChangedAlert from './v';

/**
 * 
 * 用来显示当前的预览的材质变化
 * 
 * @param {*} on_dismiss_callback 
 * @param {*} mode  
 * 
 *          0 => raster
 *          1 => raster performance
 *          2 => ray tracer
 * 
 * @returns 
 */
export default function(on_dismiss_callback, mode = 0) {
    const alert = new MaterialChangedAlert();
    alert.ondismiss = on_dismiss_callback;
    switch (mode) {
    case 0:
    case 'raster':
        alert.showMaterialRaster();
        break;

    case 1:
    case 'performance':
        alert.showMaterialPerformance();
        break;

    case 2:
    case 'tracer':
    case 'rt':
        alert.showMaterialRt();
        break;
    }
    return alert;
}