
import XThree          from '@xthree/basic';
import DefaultMaterial from './editable.default.material';

//
// 顶点
//
const v = new Float32Array(12);
v[ 0]   = -1.0;
v[ 1]   = +1.0;
v[ 2]   = +0.0;
v[ 3]   = -1.0;
v[ 4]   = -1.0;
v[ 5]   = +0.0;
v[ 6]   = +1.0;
v[ 7]   = -1.0;
v[ 8]   = +0.0;
v[ 9]   = +1.0;
v[10]   = +1.0;
v[11]   = +0.0;

//
// UV
//
const u = new Float32Array(8);
u[0]    = 0;
u[1]    = 1;
u[2]    = 0;
u[3]    = 0;
u[4]    = 1;
u[5]    = 0;
u[6]    = 1;
u[7]    = 1;

//
// 索引
//
const i = new Uint16Array(6);
i[0]    = 0;
i[1]    = 1;
i[2]    = 2;
i[3]    = 0;
i[4]    = 2;
i[5]    = 3;

/**
 * 只是用来查看图片的
 */
export default class ImageView extends XThree.Mesh {
    /**
     * 标记是可编辑网格
     */
    get isImageViewMesh() {
        return true;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(new XThree.BufferGeometry(), DefaultMaterial());
        this.geometry.setAttr('position', v, 3, true);
        this.geometry.setAttr('uv'      , u, 2, true);
        this.geometry.setIndices32(i, true);

        this.material = new XThree.MeshPhysicalMaterial();
        this.material.setColor(0xFFFFFF);
        this.material.setRoughness(0.9);
        this.material.setMetalness(0.1);

        this.computeVertexNormalsAndReserveAcuteAngle();
        this.geoChanged();
    }

    /**
     * 
     * 设置纹理
     * 
     * @param {*} texture 
     */
    setTexture(texture) {
        this.material.setColorTexture(texture);

        // 调整一下
        const SCALE = 5;
        if (texture && texture.image) {
            const w = texture.image.width;
            const h = texture.image.height;
            this.geometry.scale(w / h * SCALE, SCALE, 1);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose(true, true);
    }
}

