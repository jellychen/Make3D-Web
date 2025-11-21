/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree                   from '@xthree/basic';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils';
import Constants                from './constants';

/**
 * 定义的常量
 */
const _axis_around_slack               = 1.0;
const _axis_radius                     = 0.1;
const _axis_len_negative               = 1;
const _axis_len_positive               = 10;
const _axis_arrow_radius_a             = 0.5;
const _axis_arrow_radius_b             = 0.1;
const _axis_arrow_len                  = 1.5;
const _axis_scale_ball_radius          = 0.65;
const _axis_scale_ball_around_slack    = 0.6 * 1.5;
const _axis_scale_ball_offset          = 7;
const _axis_x_color                    = 0xFE5B5D;
const _axis_y_color                    = 0x36E2B3;
const _axis_z_color                    = 0x239CFF;
const _axis_x_highlight_color          = 0x602405;
const _axis_y_highlight_color          = 0x026f41;
const _axis_z_highlight_color          = 0x03575f;
const _axix_rotate_tube_radius         = 0.1;
const _axix_rotate_radius              = 7;

const _plane_translate_radius          = 0.8;
const _plane_translate_around_slack    = 0.8 * 1.5;
const _plane_translate_offset          = 1.8;
const _plane_translate_highlight_color = 0xF1F1F1;

/**
 * 网格
 */
export default class Mesh extends XThree.Group {
    /**
     * 高亮的操作
     */
    #highlight_operator = new Array(12);

    /**
     * 显示
     */
    #show_scale    = true;
    #show_rotation = true;

    /**
     * 
     */
    #request_animation_frame = () => {};

    /**
     * 
     * 构造函数
     * 
     * @param {function} request_animation_frame 
     */
    constructor(request_animation_frame) {
        super();
        this.build();
        this.#highlight_operator[Constants.AXIS_X_TRANSLATE] = highlight => { this.setTranslateX_Highlight(highlight);       };
        this.#highlight_operator[Constants.AXIS_Y_TRANSLATE] = highlight => { this.setTranslateY_Highlight(highlight);       };
        this.#highlight_operator[Constants.AXIS_Z_TRANSLATE] = highlight => { this.setTranslateZ_Highlight(highlight);       };
        this.#highlight_operator[Constants.AXIS_X_SCALE    ] = highlight => { this.setScaleX_Highlight    (highlight);       };
        this.#highlight_operator[Constants.AXIS_Y_SCALE    ] = highlight => { this.setScaleY_Highlight    (highlight);       };
        this.#highlight_operator[Constants.AXIS_Z_SCALE    ] = highlight => { this.setScaleZ_Highlight    (highlight);       };
        this.#highlight_operator[Constants.AXIS_X_ROTATE   ] = highlight => { this.setRotateX_Highlight   (highlight);       };
        this.#highlight_operator[Constants.AXIS_Y_ROTATE   ] = highlight => { this.setRotateY_Highlight   (highlight);       };
        this.#highlight_operator[Constants.AXIS_Z_ROTATE   ] = highlight => { this.setRotateZ_Highlight   (highlight);       };
        this.#highlight_operator[Constants.PLANE_XY        ] = highlight => { this.setTranslatePlaneXY_Highlight(highlight); };
        this.#highlight_operator[Constants.PLANE_XZ        ] = highlight => { this.setTranslatePlaneXZ_Highlight(highlight); };
        this.#highlight_operator[Constants.PLANE_YZ        ] = highlight => { this.setTranslatePlaneYZ_Highlight(highlight); };
    }

    /**
     * 
     * 构建
     * 
     */
    build() {
        this.#buildMeshTranslate(this);
        this.#buildMeshTranslatePlane(this);
        this.#buildMeshScale(this);
        this.#buildMeshRotate(this);
    }

    /**
     * 
     * 设置开启仅仅偏移
     * 
     * @param {*} only 
     */
    setOnlyTranslate(only = false) {
        if (only) {
            if (this.#show_rotation) {
                this.#show_rotation   = false;
                this.rotate_x.visible = false;
                this.rotate_y.visible = false;
                this.rotate_z.visible = false;
                this.#requestAnimationFrameIfNeed();
            }

            if (this.#show_scale) {
                this.#show_scale     = false;
                this.scale_x.visible = false;
                this.scale_y.visible = false;
                this.scale_z.visible = false;
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (!this.#show_rotation) {
                this.#show_rotation   = true;
                this.rotate_x.visible = true;
                this.rotate_y.visible = true;
                this.rotate_z.visible = true;
                this.#requestAnimationFrameIfNeed();
            }

            if (!this.#show_scale) {
                this.#show_scale     = true;
                this.scale_x.visible = true;
                this.scale_y.visible = true;
                this.scale_z.visible = true;
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 构建平移轴
     * 
     * @param {*} container 
     */
    #buildMeshTranslate(container) {
        const length = _axis_len_negative + _axis_len_positive;
        const offset = _axis_len_positive - length / 2.0;

        // 朝向 X 轴的
        {
            const geo_0 = new XThree.CylinderGeometry(_axis_radius, _axis_radius, length, 16);
            geo_0.applyMatrix4(new XThree.Matrix4().makeRotationZ(-Math.PI / 2.0));
            geo_0.applyMatrix4(new XThree.Matrix4().makeTranslation(offset, 0, 0));
            const geo_1 = new XThree.CylinderGeometry(_axis_arrow_radius_b, _axis_arrow_radius_a, _axis_arrow_len, 16);
            geo_1.applyMatrix4(new XThree.Matrix4().makeRotationZ(-Math.PI / 2.0));
            geo_1.applyMatrix4(new XThree.Matrix4().makeTranslation(_axis_len_positive, 0, 0));
            const geo = BufferGeometryUtils.mergeGeometries([geo_0, geo_1]);
            geo_0.dispose();
            geo_1.dispose();
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_x_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.translate_x = mesh;
        }

        // 朝向 Y 轴的
        {
            const geo_0 = new XThree.CylinderGeometry(_axis_radius, _axis_radius, length, 16);
            geo_0.applyMatrix4(new XThree.Matrix4().makeTranslation(0, offset, 0));
            const geo_1 = new XThree.CylinderGeometry(_axis_arrow_radius_b, _axis_arrow_radius_a, _axis_arrow_len, 16);
            geo_1.applyMatrix4(new XThree.Matrix4().makeTranslation(0, _axis_len_positive, 0));
            const geo = BufferGeometryUtils.mergeGeometries([geo_0, geo_1]);
            geo_0.dispose();
            geo_1.dispose();
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_y_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.translate_y = mesh;
        }

        // 朝向 Z 轴的
        {
            const geo_0 = new XThree.CylinderGeometry(_axis_radius, _axis_radius, length, 16);
            geo_0.applyMatrix4(new XThree.Matrix4().makeRotationX(+Math.PI / 2.0));
            geo_0.applyMatrix4(new XThree.Matrix4().makeTranslation(0, 0, offset));
            const geo_1 = new XThree.CylinderGeometry(_axis_arrow_radius_b, _axis_arrow_radius_a, _axis_arrow_len, 16);
            geo_1.applyMatrix4(new XThree.Matrix4().makeRotationX(+Math.PI / 2.0));
            geo_1.applyMatrix4(new XThree.Matrix4().makeTranslation(0, 0, _axis_len_positive));
            const geo = BufferGeometryUtils.mergeGeometries([geo_0, geo_1]);
            geo_0.dispose();
            geo_1.dispose();
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_z_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.translate_z = mesh;
        }
    }

    /**
     * 
     * 构建平移面
     * 
     * @param {*} container 
     */
    #buildMeshTranslatePlane(container) {
        const r = _plane_translate_radius;
        const o = _plane_translate_offset;

        // xy面
        {
            const geo = new XThree.CircleGeometry(r);
            geo.applyMatrix4(new XThree.Matrix4().makeTranslation(o, o, 0));
            const material = new XThree.MeshBasicMaterial();
            material.side = XThree.DoubleSide;
            material.color = new XThree.Color(_axis_z_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.translate_plane_xy = mesh;
        }

        // xz面
        {
            const geo = new XThree.CircleGeometry(r);
            geo.applyMatrix4(new XThree.Matrix4().makeTranslation(o, o, 0));
            geo.applyMatrix4(new XThree.Matrix4().makeRotationX(Math.PI / 2.0));
            const material = new XThree.MeshBasicMaterial();
            material.side = XThree.DoubleSide;
            material.color = new XThree.Color(_axis_y_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.translate_plane_xz = mesh;
        }

        // yz面
        {
            const geo = new XThree.CircleGeometry(r);
            geo.applyMatrix4(new XThree.Matrix4().makeTranslation(o, o, 0));
            geo.applyMatrix4(new XThree.Matrix4().makeRotationY(-Math.PI / 2.0));
            const material = new XThree.MeshBasicMaterial();
            material.side = XThree.DoubleSide;
            material.color = new XThree.Color(_axis_x_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.translate_plane_yz = mesh;
        }
    }

    /**
     * 
     * 构建缩放
     * 
     * @param {*} container 
     */
    #buildMeshScale(container) {
        // x轴
        {
            const geo = new XThree.SphereGeometry(_axis_scale_ball_radius, 16, 8);
            geo.applyMatrix4(new XThree.Matrix4().makeTranslation(_axis_scale_ball_offset, 0, 0));
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_x_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.scale_x = mesh;
        }

        // Y轴
        {
            const geo = new XThree.SphereGeometry(_axis_scale_ball_radius, 16, 8);
            geo.applyMatrix4(new XThree.Matrix4().makeTranslation(0, _axis_scale_ball_offset, 0));
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_y_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.scale_y = mesh;
        }

        // z轴
        {
            const geo = new XThree.SphereGeometry(_axis_scale_ball_radius, 16, 8);
            geo.applyMatrix4(new XThree.Matrix4().makeTranslation(0, 0, _axis_scale_ball_offset));
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_z_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.scale_z = mesh;
        }
    }

    /**
     * 
     * 构建旋转轴
     * 
     * @param {*} container 
     */
    #buildMeshRotate(container) {
        const r = _axix_rotate_radius;
        const t = _axix_rotate_tube_radius;

        // x 轴
        {
            const geo = new XThree.TorusGeometry(r, t, 16, 48, Math.PI / 2);
            geo.applyMatrix4(new XThree.Matrix4().makeRotationY(-Math.PI / 2.0));
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_x_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.rotate_x = mesh;
        }

        // y 轴
        {
            const geo = new XThree.TorusGeometry(r, t, 16, 48, Math.PI / 2);
            geo.applyMatrix4(new XThree.Matrix4().makeRotationX(+Math.PI / 2.0));
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_y_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.rotate_y = mesh;
        }

        // z 轴
        {
            const geo = new XThree.TorusGeometry(r, t, 16, 48, Math.PI / 2);
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_z_color);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            container.add(mesh);
            this.rotate_z = mesh;
        }
    }

    /**
     * 
     * 销毁单个Mesh
     * 
     * @param {*} mesh 
     */
    #disposeMesh(mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
    }

    /**
     * 
     * 计算距离
     * 
     * @param {Number} x0 
     * @param {Number} y0 
     * @param {Number} x1 
     * @param {Number} y1 
     */
    #calcDistance(x0, y0, x1, y1) {
        const a = x0 - x1;
        const b = y0 - y1;
        return Math.sqrt(a * a + b * b);
    }

    /**
     * 
     * 在XY平面进行拾取
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    pickOnPlaneXY(x, y, z) {
        if (x <= -_axis_around_slack || y <= -_axis_around_slack) {
            return Constants.NONE;
        }

        if (Math.hypot(x, y, z) >= _axis_len_positive + _axis_arrow_len) {
            return Constants.NONE;
        }

        // scale_ball
        if (this.#show_scale) {
            if (this.#calcDistance(_axis_scale_ball_offset, 0, x, y) < _axis_scale_ball_around_slack) {
                return Constants.AXIS_X_SCALE;
            }

            if (this.#calcDistance(0, _axis_scale_ball_offset, x, y) < _axis_scale_ball_around_slack) {
                return Constants.AXIS_Y_SCALE;
            }
        }

        // translate plane
        if (this.#calcDistance(_plane_translate_offset, _plane_translate_offset, x, y) < _plane_translate_around_slack) {
            return Constants.PLANE_XY;
        }

        // translate
        if (x <= _axis_len_positive + _axis_arrow_len + _axis_around_slack && y <= _axis_around_slack) {
            return Constants.AXIS_X_TRANSLATE;
        }

        if (y <= _axis_len_positive + _axis_arrow_len + _axis_around_slack && x <= _axis_around_slack) {
            return Constants.AXIS_Y_TRANSLATE;
        }

        // rotate
        if (this.#show_rotation) {
            const l = this.#calcDistance(0, 0, x, y);
            if (l < _axix_rotate_radius + 0.5 && l > _axix_rotate_radius - 0.5) {
                return Constants.AXIS_Z_ROTATE;
            }
        }

        return Constants.NONE;
    }

    /**
     * 
     * 在XZ平面进行拾取
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    pickOnPlaneXZ(x, y, z) {
        if (x <= -_axis_around_slack || z <= -_axis_around_slack) {
            return Constants.NONE;
        }

        if (Math.hypot(x, y, z) >= _axis_len_positive + _axis_arrow_len) {
            return Constants.NONE;
        }

        // scale_ball
        if (this.#show_scale) {
            if (this.#calcDistance(_axis_scale_ball_offset, 0, x, z) < _axis_scale_ball_around_slack) {
                return Constants.AXIS_X_SCALE;
            }

            if (this.#calcDistance(0, _axis_scale_ball_offset, x, z) < _axis_scale_ball_around_slack) {
                return Constants.AXIS_Z_SCALE;
            }
        }

        // translate plane
        if (this.#calcDistance(_plane_translate_offset, _plane_translate_offset, x, z) < _plane_translate_around_slack) {
            return Constants.PLANE_XZ;
        }

        // translate
        if (x <= _axis_len_positive + _axis_arrow_len + _axis_around_slack && z <= _axis_around_slack) {
            return Constants.AXIS_X_TRANSLATE;
        }

        if (z <= _axis_len_positive + _axis_arrow_len + _axis_around_slack && x <= _axis_around_slack) {
            return Constants.AXIS_Z_TRANSLATE;
        }

        // rotate
        if (this.#show_rotation) {
            const l = this.#calcDistance(0, 0, x, z);
            if (l < _axix_rotate_radius + 0.5 && l > _axix_rotate_radius - 0.5) {
                return Constants.AXIS_Y_ROTATE;
            }
        }

        return Constants.NONE;
    }

    /**
     * 
     * 在YZ平面进行拾取
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    pickOnPlaneYZ(x, y, z) {
        if (y <= -_axis_around_slack || z <= -_axis_around_slack) {
            return Constants.NONE;
        }

        if (Math.hypot(x, y, z) >= _axis_len_positive + _axis_arrow_len) {
            return Constants.NONE;
        }

        // scale_ball
        if (this.#show_scale) {
            if (this.#calcDistance(_axis_scale_ball_offset, 0, y, z) < _axis_scale_ball_around_slack) {
                return Constants.AXIS_Y_SCALE;
            }

            if (this.#calcDistance(0, _axis_scale_ball_offset, y, z) < _axis_scale_ball_around_slack) {
                return Constants.AXIS_Z_SCALE;
            }
        }

        // translate plane
        if (this.#calcDistance(_plane_translate_offset, _plane_translate_offset, y, z) < _plane_translate_around_slack) {
            return Constants.PLANE_YZ;
        }

        // translate
        if (y <= _axis_len_positive + _axis_arrow_len + _axis_around_slack && z <= _axis_around_slack) {
            return Constants.AXIS_Y_TRANSLATE;
        }

        if (z <= _axis_len_positive + _axis_arrow_len + _axis_around_slack && y <= _axis_around_slack) {
            return Constants.AXIS_Z_TRANSLATE;
        }

        // rotate
        if (this.#show_rotation) {
            const l = this.#calcDistance(0, 0, y, z);
            if (l < _axix_rotate_radius + 0.5 && l > _axix_rotate_radius - 0.5) {
                return Constants.AXIS_X_ROTATE;
            }
        }

        return Constants.NONE;
    }

    /**
     * 
     * 设置X轴高亮
     * 
     * @param {*} highlight 
     */
    setTranslateX_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.translate_x.material.color.setHex(_axis_x_highlight_color);
        } else {
            this.translate_x.material.color.setHex(_axis_x_color);
        }
    }

    /**
     * 
     * 设置Y轴高亮
     * 
     * @param {*} highlight 
     */
    setTranslateY_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.translate_y.material.color.setHex(_axis_y_highlight_color);
        } else {
            this.translate_y.material.color.setHex(_axis_y_color);
        }
    }

    /**
     * 
     * 设置Z轴高亮
     * 
     * @param {*} highlight 
     */
    setTranslateZ_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.translate_z.material.color.setHex(_axis_z_highlight_color);
        } else {
            this.translate_z.material.color.setHex(_axis_z_color);
        }
    }

    /**
     * 
     * 设置X轴缩放高亮
     * 
     * @param {*} highlight 
     */
    setScaleX_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.scale_x.material.color.setHex(_axis_x_highlight_color);
        } else {
            this.scale_x.material.color.setHex(_axis_x_color);
        }
    }

    /**
     * 
     * 设置Y轴缩放高亮
     * 
     * @param {*} highlight 
     */
    setScaleY_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.scale_y.material.color.setHex(_axis_y_highlight_color);
        } else {
            this.scale_y.material.color.setHex(_axis_y_color);
        }
    }

    /**
     * 
     * 设置Z轴缩放高亮
     * 
     * @param {*} highlight 
     */
    setScaleZ_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.scale_z.material.color.setHex(_axis_z_highlight_color);
        } else {
            this.scale_z.material.color.setHex(_axis_z_color);
        }
    }

    /**
     * 
     * 设置XY面高亮
     * 
     * @param {*} highlight 
     */
    setTranslatePlaneXY_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.translate_plane_xy.material.color.setHex(_plane_translate_highlight_color);
        } else {
            this.translate_plane_xy.material.color.setHex(_axis_z_color);
        }
    }

    /**
     * 
     * 设置XZ面高亮
     * 
     * @param {*} highlight 
     */
    setTranslatePlaneXZ_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.translate_plane_xz.material.color.setHex(_plane_translate_highlight_color);
        } else {
            this.translate_plane_xz.material.color.setHex(_axis_y_color);
        }
    }

    /**
     * 
     * 设置YZ面高亮
     * 
     * @param {*} highlight 
     */
    setTranslatePlaneYZ_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.translate_plane_yz.material.color.setHex(_plane_translate_highlight_color);
        } else {
            this.translate_plane_yz.material.color.setHex(_axis_x_color);
        }
    }

    /**
     * 
     * 设置绕X轴高亮
     * 
     * @param {*} highlight 
     */
    setRotateX_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.rotate_x.material.color.setHex(_axis_x_highlight_color);
        } else {
            this.rotate_x.material.color.setHex(_axis_x_color);
        }
    }

    /**
     * 
     * 设置绕X轴高亮
     * 
     * @param {*} highlight 
     */
    setRotateY_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.rotate_y.material.color.setHex(_axis_y_highlight_color);
        } else {
            this.rotate_y.material.color.setHex(_axis_y_color);
        }
    }

    /**
     * 
     * 设置绕X轴高亮
     * 
     * @param {*} highlight 
     */
    setRotateZ_Highlight(highlight) {
        highlight = true === highlight;
        if (highlight) {
            this.rotate_z.material.color.setHex(_axis_z_highlight_color);
        } else {
            this.rotate_z.material.color.setHex(_axis_z_color);
        }
    }

    /**
     * 
     * 设置指定的元素的高亮
     * 
     * @param {*} element_slot_index 
     * @param {*} highlight 
     */
    setHightlight(element_slot_index, highlight) {
        highlight = true === highlight;
        if (element_slot_index < 0 || element_slot_index >= this.#highlight_operator.length) {
            return;
        }
        this.#highlight_operator[element_slot_index](highlight);
    }

    /**
     * 所有元素都设置不高亮
     */
    setNoneHightlight() {
        this.setTranslateX_Highlight(false);
        this.setTranslateY_Highlight(false);
        this.setTranslateZ_Highlight(false);
        this.setScaleX_Highlight(false);
        this.setScaleY_Highlight(false);
        this.setScaleZ_Highlight(false);
        this.setTranslatePlaneXY_Highlight(false);
        this.setTranslatePlaneXZ_Highlight(false);
        this.setTranslatePlaneYZ_Highlight(false);
    }

    /**
     * 
     * 显示偏移轴 X
     * 
     * @param {boolean} show 
     */
    setShowTranslateX(show) {
        if (show) {
            if (!this.translate_x.parent) {
                this.add(this.translate_x);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.translate_x.parent) {
                this.translate_x.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示偏移轴 Y
     * 
     * @param {boolean} show 
     */
    setShowTranslateY(show) {
        if (show) {
            if (!this.translate_y.parent) {
                this.add(this.translate_y);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.translate_y.parent) {
                this.translate_y.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示偏移轴 Z
     * 
     * @param {boolean} show 
     */
    setShowTranslateZ(show) {
        if (show) {
            if (!this.translate_z.parent) {
                this.add(this.translate_z);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.translate_z.parent) {
                this.translate_z.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示偏移轴 
     * 
     * @param {boolean} show 
     */
    setShowTranslate(show) {
        this.setShowTranslateX(show);
        this.setShowTranslateY(show);
        this.setShowTranslateZ(show);
    }

    /**
     * 
     * 显示偏移面 XY
     * 
     * @param {boolean} show 
     */
    setShowTranslatePlaneXY(show) {
        if (show) {
            if (!this.translate_plane_xy.parent) {
                this.add(this.translate_plane_xy);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.translate_plane_xy.parent) {
                this.translate_plane_xy.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示偏移面 XZ
     * 
     * @param {boolean} show 
     */
    setShowTranslatePlaneXZ(show) {
        if (show) {
            if (!this.translate_plane_xz.parent) {
                this.add(this.translate_plane_xz);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.translate_plane_xz.parent) {
                this.translate_plane_xz.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示偏移面 YZ
     * 
     * @param {boolean} show 
     */
    setShowTranslatePlaneYZ(show) {
        if (show) {
            if (!this.translate_plane_yz.parent) {
                this.add(this.translate_plane_yz);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.translate_plane_yz.parent) {
                this.translate_plane_yz.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示偏移面
     * 
     * @param {boolean} show 
     */
    setShowTranslatePlane(show) {
        this.setShowTranslatePlaneXY(show);
        this.setShowTranslatePlaneXZ(show);
        this.setShowTranslatePlaneYZ(show);
    }

    /**
     * 
     * 显示缩放 X
     * 
     * @param {boolean} show 
     */
    setShowScaleX(show) {
        if (show) {
            if (!this.scale_x.parent) {
                this.add(this.scale_x);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.scale_x.parent) {
                this.scale_x.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示缩放 Y
     * 
     * @param {boolean} show 
     */
    setShowScaleY(show) {
        if (show) {
            if (!this.scale_y.parent) {
                this.add(this.scale_y);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.scale_y.parent) {
                this.scale_y.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示缩放 Y
     * 
     * @param {boolean} show 
     */
    setShowScaleZ(show) {
        if (show) {
            if (!this.scale_z.parent) {
                this.add(this.scale_z);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.scale_z.parent) {
                this.scale_z.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示缩放
     * 
     * @param {boolean} show 
     */
    setShowScale(show) {
        this.setShowScaleX(show);
        this.setShowScaleY(show);
        this.setShowScaleZ(show);
    }

    /**
     * 
     * 显示旋转 X
     * 
     * @param {boolean} show 
     */
    setShowRotateX(show) {
        if (show) {
            if (!this.rotate_x.parent) {
                this.add(this.rotate_x);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.rotate_x.parent) {
                this.rotate_x.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示旋转 Y
     * 
     * @param {boolean} show 
     */
    setShowRotateY(show) {
        if (show) {
            if (!this.rotate_y.parent) {
                this.add(this.rotate_y);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.rotate_y.parent) {
                this.rotate_y.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示旋转 Z
     * 
     * @param {boolean} show 
     */
    setShowRotateZ(show) {
        if (show) {
            if (!this.rotate_z.parent) {
                this.add(this.rotate_z);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.rotate_z.parent) {
                this.rotate_z.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示旋转
     * 
     * @param {boolean} show 
     */
    setShowRotate(show) {
        this.setShowRotateX(show);
        this.setShowRotateY(show);
        this.setShowRotateZ(show);
    }

    /**
     * 全部显示
     */
    setShowAll() {
        this.setShowTranslateX(true);
        this.setShowTranslateY(true);
        this.setShowTranslateZ(true);
        this.setShowTranslatePlaneXY(true);
        this.setShowTranslatePlaneXZ(true);
        this.setShowTranslatePlaneYZ(true);
        this.setShowScaleX(true);
        this.setShowScaleY(true);
        this.setShowScaleZ(true);
        this.setShowRotateX(true);
        this.setShowRotateY(true);
        this.setShowRotateZ(true);
    }

    /**
     * 设置全部不显示
     */
    setAllHidden() {
        this.setShowTranslateX(false);
        this.setShowTranslateY(false);
        this.setShowTranslateZ(false);
        this.setShowTranslatePlaneXY(false);
        this.setShowTranslatePlaneXZ(false);
        this.setShowTranslatePlaneYZ(false);
        this.setShowScaleX(false);
        this.setShowScaleY(false);
        this.setShowScaleZ(false);
        this.setShowRotateX(false);
        this.setShowRotateY(false);
        this.setShowRotateZ(false);
    }

    /**
     * 请求重绘
     */
    #requestAnimationFrameIfNeed() {
        if (this.#request_animation_frame) {
            this.#request_animation_frame();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.#disposeMesh(this.translate_x);
        this.#disposeMesh(this.translate_y);
        this.#disposeMesh(this.translate_z);
        this.#disposeMesh(this.translate_plane_xy);
        this.#disposeMesh(this.translate_plane_xz);
        this.#disposeMesh(this.translate_plane_yz);
        this.#disposeMesh(this.scale_x);
        this.#disposeMesh(this.scale_y);
        this.#disposeMesh(this.scale_z);
        this.#disposeMesh(this.rotate_x);
        this.#disposeMesh(this.rotate_y);
        this.#disposeMesh(this.rotate_z);
    }
}
