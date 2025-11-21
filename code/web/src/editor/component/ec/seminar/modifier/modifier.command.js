/* eslint-disable no-unused-vars */

import isString    from 'lodash/isString';
import isObject    from 'lodash/isObject';
import Modifier    from './modifier';
import OperCreator from './operator/creator';

/**
 * Mixin
 */
Object.assign(Modifier.prototype, {
    /**
     * 
     * 接收到外部命令
     * 
     * @param {info} object 
     */
    onRecvCommand(info = undefined) {
        if (!isObject(info) || !isString(info.type)) {
            return;
        }
        this.disposeManipulator();
        this.manipulator = OperCreator(info.type, this, this.object);
    }
});