/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import XThree     from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Scene.prototype, {
    /**
     * 对所有的孩子进行折叠
     */
    collapseAllChildren(include_scene = false) {
        this.traverse(e => {
            if (!include_scene && (e instanceof XThree.Scene)) {
                return;
            }
            
            if (isFunction(e.setFolded)) {
                e.setFolded(true);
            }
        }, false);
    },
});
