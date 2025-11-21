/* eslint-disable no-unused-vars */

import LicenseContent from './v';
import OpenWindow     from '@ux/controller/window';

/**
 * 打开授权的窗口
 */
export default function() {
    return OpenWindow({
        title_data : "License",
        style      : "normal",
        content    : new LicenseContent(),
    });
}

