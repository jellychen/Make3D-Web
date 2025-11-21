/* eslint-disable no-unused-vars */

import Interactive from '@@/interactive';

/**
 * icp
 */
export default function(ipc) {
    ipc.handle('start-new-editor', () => {
        Interactive.startNewEditor();
        return true;
    });
}