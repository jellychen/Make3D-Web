
/**
 * 方位信息
 */
export default class Orientation {
    /**
     * 球形坐标
     */
    spherical_camera_a = 0; // 弧度
    spherical_camera_b = 0; // 弧度

    /**
     * 相机距离target的距离
     */
    distance           = 0;

    /**
     * 看向位置
     */
    target_x           = 0;
    target_y           = 0;
    target_z           = 0;

    /**
     * 
     * 深度拷贝
     * 
     * @returns 
     */
    clone() {
        const info              = new Orientation();
        info.distance           = this.distance;
        info.target_x           = this.target_x;
        info.target_y           = this.target_y;
        info.target_z           = this.target_z;
        info.spherical_camera_a = this.spherical_camera_a;
        info.spherical_camera_b = this.spherical_camera_b;
        return info;
    }
}
