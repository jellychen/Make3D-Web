/* eslint-disable no-unused-vars */

import isString           from 'lodash/isString';
import isFunction         from 'lodash/isFunction';
import Flip               from './flip';
import Cubization         from './cubization';
import Sphericize         from './sphericize';
import NormalOffset       from './normal-offset';
import Subdivision        from './subdivision';
import Substantialization from './substantialization';
import Smooth             from './smooth';
import Taper              from './taper';
import Contort            from './contort';
import Noise              from './noise';
import QuadRemesh         from './quadremesh';
import VoxelRemesh        from './voxelremesh';

/**
 * 
 * @param {*} type 
 * @param {*} host 
 * @param {*} object 
 * @returns 
 */
export default function Creator(type, host, object) {
    if (!isString(type)) {
        return null;
    }

    // 构建
    let ecc = undefined;
    if ('flip'                    === type) ecc = Flip;
    else if ('normal-offset'      === type) ecc = NormalOffset;
    else if ('cubization'         === type) ecc = Cubization;
    else if ('sphericize'         === type) ecc = Sphericize;
    else if ('subdivision'        === type) ecc = Subdivision;
    else if ('smooth'             === type) ecc = Smooth;
    else if ('taper'              === type) ecc = Taper;
    else if ('contort'            === type) ecc = Contort;
    else if ('noise'              === type) ecc = Noise;
    else if ('substantialization' === type) ecc = Substantialization;
    else if ('quadremesh'         === type) ecc = QuadRemesh;
    else if ('voxelremesh'        === type) ecc = VoxelRemesh;
    else {
        return null;
    }

    // 调用start函数
    const ec = new ecc(host, host.coordinator, object)
    if (ec && isFunction(ec.start)) {
        ec.start();
    }

    return ec;
}
