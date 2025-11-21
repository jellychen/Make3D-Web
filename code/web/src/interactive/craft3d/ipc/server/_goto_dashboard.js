/* eslint-disable no-unused-vars */

import Interactive from '@@/interactive';

/**
 * icp
 */
export default function(ipc) {
    ipc.handle('goto-dashboard', () => {
        Interactive.gotoDashboard();
        return true;
    });
}