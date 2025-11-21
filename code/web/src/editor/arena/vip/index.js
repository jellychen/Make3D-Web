/* eslint-disable no-unused-vars */

import VIP from "./v";

/**
 * 
 * 显示和延迟销毁
 * 
 * @param {*} defer_dismiss 
 * @returns 
 */
export default function(defer_dismiss = 3000) {
    const vip = new VIP();
    document.body.appendChild(vip);
    setTimeout(() => vip.dismiss(), defer_dismiss);
    return vip;
}
