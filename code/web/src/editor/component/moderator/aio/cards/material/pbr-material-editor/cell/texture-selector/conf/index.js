/* eslint-disable no-unused-vars */

import ComputePosition from '@common/misc/compute-position';
import TextureConf     from './v';

/**
 * 
 * 打开
 * 
 * @param {*} texture 
 * @param {*} on_changed 
 * @param {*} reference_element 
 * @returns 
 */
function OpenTexureConf(texture, on_changed, reference_element) {
    if (!texture) {
        return;
    }

    const conf = new TextureConf(texture, on_changed);
    document.body.appendChild(conf);
    ComputePosition(reference_element, conf, 'auto', 5);
    return conf;
}

export default OpenTexureConf;
