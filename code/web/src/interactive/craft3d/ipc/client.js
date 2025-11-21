/* eslint-disable no-unused-vars */

import * as Electron from 'electron';

/**
 * 便利
 */
const IpcRenderer = Electron.ipcRenderer;

/**
 * 输出
 */
export default {
    /**
     * 安装
     */
    setup: () => {
        window.__doever__ = {
            test             : () => IpcRenderer.invoke('test'),
            start_new_editor : () => IpcRenderer.invoke('start-new-editor'),
        }
    }
}
