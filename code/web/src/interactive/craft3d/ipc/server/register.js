/* eslint-disable no-unused-vars */

import * as Electron     from 'electron';

import _test             from './_test';
import _start_new_editor from './_start_new_editor';
import _goto_dashboard   from './_goto_dashboard';

/**
 * 挂接
 */
export default function() {
    _test            (Electron.ipcMain)
    _start_new_editor(Electron.ipcMain)
    _goto_dashboard  (Electron.ipcMain)
}
