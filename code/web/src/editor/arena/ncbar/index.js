/* eslint-disable no-unused-vars */

/// #if BUILD_FOR === 'electron'

import NCBar from "./v";

/**
 * 单例
 */
let __ncbar_container;
let __ncbar;

/**
 * 对外输出
 */
export default {
    /**
     * 
     * 获取Bar
     * 
     * @returns 
     */
    ncbar() {
        return __ncbar;
    },

    /**
     * 
     * 安装
     * 
     * @returns 
     */
    setup: function() {
        if (__ncbar) {
            return true;
        }

        __ncbar_container = document.body.querySelector('#nc-area-container');
        if (!__ncbar_container) {
            return false;
        } else {
            //
            // 'darwin'
            // 'win32'
            // 'linux'
            //
            __ncbar_container.setAttribute('platform', process.platform);
            __ncbar = new NCBar();
            __ncbar_container.appendChild(__ncbar);
        }

        return true;
    },    
}

/// #endif