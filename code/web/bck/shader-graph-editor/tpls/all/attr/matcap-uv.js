/* eslint-disable no-unused-vars */

export default {
    name    : 'Matcap UV',
    board   : '',
    in      : [
    ],
    out     : [
        'vec2',
    ],

    createNode(container, ref_node) {
        const node = container.createNode('matcap_uv');
        return node;
    }
}
