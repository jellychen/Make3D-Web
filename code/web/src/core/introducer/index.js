/* eslint-disable no-unused-vars */

import isNull       from 'lodash/isNull';
import isUndefined  from 'lodash/isUndefined';
import isArray      from 'lodash/isArray';
import LocalStorage from '@common/store/local-storage';
import Introducer   from "./v";
import Configure    from './configure';

/**
 * KEY
 */
const KEY = 'INTRODUCER';

/**
 * 
 * 显示
 * 
 * @param {*} force 
 * @returns 
 */
export default function ShowIntroducer(force = false) {
    const storage = LocalStorage.get(KEY);
    if (!force && !isUndefined(storage) && !isNull(storage)) {
        return;
    } else {
        LocalStorage.set(KEY, 'true');
    }
    
    const conf = Configure.conf;
    if (!isArray(conf) || conf.length == 0) {
        return;
    }

    requestAnimationFrame(() => {
        const introducer = new Introducer();
        introducer.setConf(conf);
        Configure.clear();
        document.body.appendChild(introducer);
    });
}
