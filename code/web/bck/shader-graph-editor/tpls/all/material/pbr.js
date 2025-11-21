/* eslint-disable no-unused-vars */

export default {
    name    : 'PBR Material',
    board   : '',
    in      : [
        'diffuse'               ,
        'opacity'               ,
        'emissive'              ,
        'roughness'             ,
        'metalness'             ,
        'ior'                   ,
        'specular-intensity'    ,
        'specular-color'        ,
        'clearcoat'             ,
        'clearcoat-roughness'   ,
        'dispersion'            ,
        'iridescence'           ,
        'iridescence-ior'       ,
        'iridescence-thickness' ,
        'sheen-color'           ,
        'sheen-roughness'       ,
        'anisotropy-vector'     ,
        'alpha-test'            ,
        'transmission'          ,
        'thickness'             ,
        'attenuation-distance'  ,
        'attenuation-color'     ,
    ],
    out     : [
    ],

    createNode(container, ref_node) {
        const node = container.createNode('pbr');
        return node;
    }
}
