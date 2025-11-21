
// 一些默认的参数
export default {
    T_METADATA                  :   1,  // 元数据
    T_SCENE                     :  10,  // 场景
    T_GROUP                     :  11,  // 集合
    T_MESH                      :  12,  // 不可编辑网格
    T_MESH_EDITABLE             :  13,  // 可编辑

    T_CHILDREN_BEGIN            :  14,  // 孩子开始
    T_CHILDREN_END              :  15,  // 孩子结束

    T_LIGHT                     : 100,  // 灯光
    T_LIGHT_DIR                 : 101,
    T_LIGHT_POINT               : 102,
    T_LIGHT_SPOT                : 103,
    T_LIGHT_END                 : 199,  // 灯光结束

    T_GEO                       : 200,  // 几何数据
    T_GEO_NONE                  : 201,  // 表示没有几何数据
    T_GEO_0_INDEXED             : 210,  // 索引几何
    T_GEO_0_NON_INDEXED         : 211,  // 非索引几何
    T_GEO_0_INDEX_U16           : 212,  // 索引是 Uint16Array
    T_GEO_0_INDEX_U32           : 213,  // 索引是 Uint32Array
    T_GEO_0_VERTEX              : 214,
    T_GEO_0_COLOR               : 215,
    T_GEO_0_UV                  : 216,
    T_GEO_0_NORMAL              : 217,
    T_GEO_1_FACE_INDICES        : 220,
    T_GEO_1_FACE_VERTICES_COUNT : 221,
    T_GEO_1_VERTEX              : 222,
    T_GEO_1_VERTEX_COLOR        : 223,
    T_GEO_1_UV_0                : 224,  // 点UV
    T_GEO_1_UV_1                : 225,  // 面UV
    T_GEO_1_NORMAL              : 226,
    T_GEO_END                   : 299,  // 表示几何结束

    T_MATERIAL                  : 300,  // 材质
    T_MATERIAL_NONE             : 301,  // 表示没有材质数据
    T_MATERIAL_END              : 399,  // 表示材质结束

    T_TEXTURE                   : 400,  // 纹理
    T_TEXTURE_DATABASE          : 401,  // 纹理仓库
    T_TEXTURE_DATABASE_END      : 499,  // 纹理仓库结束
}
