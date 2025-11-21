/* eslint-disable no-unused-vars */

import Path   from 'node:path';
import Window from "@@/core/ux/window";

/**
 * 编辑页面
 */
export default class EditorWindow extends Window {
    /**
     * 构造函数
     */
    constructor() {
        super({
            darkTheme      : true,
            width          : 1360,
            height         : 800,
            minWidth       : 1280,  // ✅ 最小宽度
            minHeight      : 760,   // ✅ 最小高度
            backgroundColor: '#1e1e1e',
            frame          : false,
            transparent    : false,
            titleBarStyle  : 'hidden',

            titleBarOverlay: {
                color      : '#ffffff',
                symbolColor: '#74b1be'
            },

            webPreferences: {
                preload         : Path.join(__dirname, 'editor-preload.js'),
                nodeIntegration : true,
                contextIsolation: false,
            }
        });
    }

    /**
     * 准备构造
     */
    onCreate() {
        super.onCreate();
        this.setContentFromFile('editor.html');
    }
}
