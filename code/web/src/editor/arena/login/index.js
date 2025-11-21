/* eslint-disable no-unused-vars */

import GlobalScope from '@common/global-scope';
import LoginWindow from './v';

/**
 * 
 * 打开登录窗口
 * 
 */
function OpenLoginModalWindow() {
    const window = new LoginWindow();
    window.show(document.body);
    return window;
}

GlobalScope.openLoginModalWindow = OpenLoginModalWindow;

export default OpenLoginModalWindow;
