
import isFunction from 'lodash/isFunction';
import XThree     from '@xthree/basic';

/**
 * 备份
 */
const _origin_dispose = XThree.BufferGeometry.prototype.dispose;

/**
 * Mixin
 */
Object.assign(XThree.BufferGeometry.prototype, {
    /**
     * 销毁
     */
    dispose() {
        if (isFunction(this.disposeBoundsTree)) {
            this.disposeBoundsTree();
        }
        
        if (isFunction(_origin_dispose)) {
            _origin_dispose.call(this);
        }
    },
});
