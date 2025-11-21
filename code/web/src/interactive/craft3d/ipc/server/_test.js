/* eslint-disable no-unused-vars */

/**
 * icp
 */
export default function(ipc) {
    ipc.handle('test', () => {
        return 'test';
    });
}