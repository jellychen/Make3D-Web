/* eslint-disable no-unused-vars */

import LauncherLoading from "./v";

/**
 * 
 * 打开
 * 
 * @returns 
 */
export default function() {
    const loading = new LauncherLoading();
    document.body.appendChild(loading);
    return loading;
}
