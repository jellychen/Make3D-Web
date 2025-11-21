/* eslint-disable no-undef */

import isString                 from 'lodash/isString';

// 字体
import hei                      from './fonts/bin/hei.ttf';
import uisdc_title_black_bold   from './fonts/bin/UisdcTitleBlack-Bold.ttf';


/**
 * 存储
 */
const container = new Array();

//
// 黑体
//
container.push({typeface: 'UISDC-Title', url : uisdc_title_black_bold});

/**
 * 导出
 */
export default new class {
    /**
     * 
     * 获取默认的字体
     * 
     * @returns 
     */
    defaultFont() {
        return container[0];
    }

    /**
     * 
     * 获取指定的字体
     * 
     * @param {string} tyepface 
     * @returns 
     */
    get(tyepface) {
        if (!isString(tyepface)) {
            return;
        }

        for (const v of container) {
            if (v.tyepface == tyepface) {
                return v;
            }
        }
    }
}
