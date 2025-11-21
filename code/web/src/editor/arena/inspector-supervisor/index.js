/* eslint-disable no-unused-vars */

import SomethingError from './v';
import DevtoolsDetect from 'devtools-detect';

/**
 * 显示错误
 */
function ShowError() {
    document.body.innerHTML = '';
    document.body.appendChild(new SomethingError());
}


/**
 * 防止关闭
 */
export default function InspectorSupervisor() {
    // if (DevtoolsDetect.isOpen) {
    //     ShowError();
    // }

    // window.addEventListener('devtoolschange', event => {
    //     if (event.detail.isOpen) {
    //         ShowError();
    //     }
    // });
}
