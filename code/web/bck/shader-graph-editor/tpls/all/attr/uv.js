/* eslint-disable no-unused-vars */

export default {
    name    : 'UV',
    board   : '',
    in      : [
    ],
    out     : [
        'vec2',
    ],

    createNode(container, ref_node) {
        const node = container.createNode('uv');
        return node;
    }
}
