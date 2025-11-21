
/**
 * 一些定义常量
 */
export default {
    // 未知
    NONE                         : -1,

    // 轴
    AXIS_X                       : 0,
    AXIS_Y                       : 1,
    AXIS_Z                       : 2,

    // 轴相关
    AXIS_X_TRANSLATE             : 0,                // 沿着X轴偏移
    AXIS_Y_TRANSLATE             : 1,                // 沿着Y轴偏移
    AXIS_Z_TRANSLATE             : 2,                // 沿着Z轴偏移
    AXIS_X_SCALE                 : 3,                // 沿着X轴缩放
    AXIS_Y_SCALE                 : 4,                // 沿着Y轴缩放
    AXIS_Z_SCALE                 : 5,                // 沿着Z轴缩放
    AXIS_X_ROTATE                : 6,                // 沿着X轴旋转
    AXIS_Y_ROTATE                : 7,                // 沿着Y轴偏移
    AXIS_Z_ROTATE                : 8,                // 沿着Z轴偏移

    // 面相关
    PLANE_XY                     : 9 ,               // XY平面
    PLANE_XZ                     : 10,               // XZ平面
    PLANE_YZ                     : 11,               // YZ平面

    // 轴的颜色
    COLOR_X                      : 0xFE5B5D,
    COLOR_Y                      : 0x36E2B3,
    COLOR_Z                      : 0x239CFF,

    // 坐标相关参数
    POS_TRANSLATE_AXIS_LEN       : 10,               // 轴的长度，包含箭头
    POS_TRANSLATE_AXIS_AROUND    : 2 ,               // 靠近轴幅度
    POS_SCALE_BALL_OFFSET        : 6 ,               // 缩放球在轴上的偏移
    POS_SCALE_BALL_RADIUS        : 2 ,               // 缩放球的半径
    POS_ROTATE_RADIUS            : 6 ,               // 旋转的半径
    POS_ROTATE_AROUND            : 2 ,               // 旋转碰撞的幅度

    // 设计标准尺寸
    FLAUNT_CAMERA_DISTANCE       : 96,               //
    FLAUNT_CAMERA_FOV            : 45,               //
    FLAUNT_CAMERA_NEAR           : 0.1,              //
    FLAUNT_CAMERA_VIEWPORT_HEIGHT: 800,              //
    FLAUNT_CAMERA_ORTHO_SCALE    : 10.2,             //
};
