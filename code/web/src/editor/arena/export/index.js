/* eslint-disable no-unused-vars */

import Export from "./v";

/**
 * 
 * 打开
 * 
 * @param {*} coordinator 
 */
export default function(coordinator) {
    document.body.appendChild(new Export(coordinator));
}
