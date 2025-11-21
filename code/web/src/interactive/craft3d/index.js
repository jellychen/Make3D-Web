/* eslint-disable no-unused-vars */

import * as Electron from 'electron'
import APP           from './application';

//
// 单例
//
if (!Electron.app.requestSingleInstanceLock()) {
    Electron.app.quit();
}

//
// 启动
//
new APP().start();
