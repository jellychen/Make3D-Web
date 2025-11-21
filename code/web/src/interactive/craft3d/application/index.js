/* eslint-disable no-unused-vars */

import * as Electron     from 'electron';
import Interactive       from '@@/interactive';
import IpcServerRegister from '@@/ipc/server/register';

/**
 * 便利
 */
const APP = Electron.app;

/**
 * 入口
 */
export default class Application {
    /**
     * 构造函数
     */
    constructor() {
        APP.whenReady().then(       () => this.#onReady());
        APP.on('second-instance',   () => this.#onSecondInstance( ));
        APP.on('window-all-closed', () => this.#onWindowAllClosed());
    }

    /**
     * 启动
     */
    start() {

    }

    /**
     * 一切就绪的时候
     */
    #onReady() {
        IpcServerRegister();
        Interactive.startNewEditor();
    }

    /**
     * 第二个实例
     */
    #onSecondInstance() {
        Interactive.startNewEditor();
    }

    /**
     * 当所有的窗口都关闭的
     */
    #onWindowAllClosed() {
        APP.quit();
    }
}
