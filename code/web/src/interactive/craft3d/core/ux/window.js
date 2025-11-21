/* eslint-disable no-unused-vars */

import * as Electron from 'electron'

/**
 * 代表一个窗口
 * 
 * api: https://www.electronjs.org/docs/latest/api/base-window
 * 
 */
export default class Window extends Electron.BrowserWindow {
    /**
     * 构造函数
     * 
     * @param {*} conf 
     */
    constructor(conf = {}) {
        super({...conf, show: false});
        this.on  ('crashed',        () => this.onCrashed());
        this.on  ('show',           () => this.onShow());
        this.on  ('hide',           () => this.onHide());
        this.on  ('focus',          () => this.onFocus());
        this.on  ('blur',           () => this.onBlur());
        this.on  ('minimize',       () => this.onMinimize());
        this.on  ('restore',        () => this.onRestore());
        this.on  ('maximize',       () => this.onMaximize());
        this.on  ('unmaximize',     () => this.onUnmaximize());
        this.on  ('resize',         () => this.onResize());
        this.on  ('move',           () => this.onMove());
        this.on  ('moved',          () => this.onMoved());
        this.on  ('close',          () => this.onWillClose());
        this.on  ('closed',         () => this.onClosed());

        this.webContents.on('render-process-gone', () => this.onRenderProcessGone());
        this.webContents.on('crashed',             () => this.onCrashed());
        this.once('ready-to-show',                 () => this.show());
        this.onCreate();
    }

    /**
     * 生命周期
     */
    onCreate            () {}
    onShow              () {}
    onHide              () {}
    onFocus             () {}
    onBlur              () {}
    onMinimize          () {}
    onRestore           () {} // 从最小化恢复时触发
    onMaximize          () {} // 窗口最大化时触发
    onUnmaximize        () {} // 从最大化恢复时触发
    onResize            () {} // 窗口尺寸变化时触发
    onMove              () {}
    onMoved             () {}
    onWillClose         () {}
    onClosed            () {}

    onCrashed           () {}
    onRenderProcessGone () {}

    /**
     * 
     * 从根路径中加载界面
     * 
     * @param {*} file 
     * @returns 
     */
    setContentFromFile(file) {
        return this.loadFile(file);
    }
}
