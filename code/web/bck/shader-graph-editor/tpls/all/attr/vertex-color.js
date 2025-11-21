/* eslint-disable no-unused-vars */

export default {
    name    : 'Vertex Color',
    board   : '',
    in      : [
    ],
    out     : [
        'vec4',
    ],

    createNode(container, ref_node) {
        const node = container.createNode('vertex_color');
        return node;
    }
}
