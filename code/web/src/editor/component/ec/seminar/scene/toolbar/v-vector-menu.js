/* eslint-disable no-unused-vars */

import DropSelector from '@ux/controller/drop-selector';

/**
 * 下拉菜单的数据
 */
const _drop_selector_data_ = [
    // 2d
    {
        icon: 'vector/2d.svg',
        token: '2d',
        text_token: "2d",
    },

    // 3d
    {
        icon: 'vector/3d.svg',
        token: '3d',
        text_token: "3d",
    },
];

/**
 * 
 * 弹出菜单
 * 
 * @param {*} coordinator 
 * @param {*} reference_element 
 */
export default function ShowMore(coordinator, reference_element) {
    DropSelector(
        _drop_selector_data_,
        (token) => {
            switch (token) {
                case '2d':
                    coordinator.nav.setEditorMode('vector.2d');
                    break;

                case '3d':
                    coordinator.nav.setEditorMode('vector.3d');
                    break;
                }
            },
            document.body,
            reference_element,
            "bottom-start",
            "normal",
            0);
}
