/* eslint-disable no-unused-vars */

import isString    from 'lodash/isString';
import isObject    from 'lodash/isObject';
import ShowCabinet from '@editor/arena/cabinet';
import Scene       from './scene';

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 
     * 接收到外部命令
     * 
     * @param {Object} object 
     */
    onRecvCommand(object = undefined) {
        if (isObject(object) && isString(object.type)) {
            if ('cabinet' === object.type) {
                ShowCabinet();
            } else {
                this.assistor.add(this, object.type, object);
            }
        } else {
            this.assistor.reset();
        }
    }
});
