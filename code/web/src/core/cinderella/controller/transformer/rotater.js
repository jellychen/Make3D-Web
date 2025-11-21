/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';

/**
 * 定义的常量
 */
const _axix_rotate_tube_radius = 0.08;
const _axix_rotate_radius      = 6;
const _axis_x_color            = 0xFE5B5D;
const _axis_y_color            = 0x36E2B3;
const _axis_z_color            = 0x239CFF;
const _axis_ball_0_radius      = 0.6;
const _axis_ball_1_radius      = 0.8;
const _axis_ball_0_color       = 0xFFFFFF;
const _axis_ball_0_line_color  = 0xFFFFFF;
const _axis_ball_1_color       = 0x8D54FF;
const _axis_ball_1_line_color  = 0x8D54FF;

/**
 * 旋转
 */
export default class Rotater extends XThree.Group {
    /**
     * 请求重绘函数
     */
    #request_animation_frame = () => {};

    /**
     * 网格
     */
    #mesh_torus;

    /**
     * 网格
     */
    #mesh_ball_0;
    #mesh_ball_0_line_segment;
    #mesh_ball_1;
    #mesh_ball_1_line_segment;

    /**
     * 
     * 0 x轴
     * 1 y轴
     * 2 z轴
     * 
     */
    #axis = 0;

    /**
     * 临时
     */
    #vec0 = new XThree.Vector3();
    #vec1 = new XThree.Vector3();

    /**
     * 
     * 构造函数
     * 
     * @param {function} request_animation_frame 
     * @param {Number} axis 旋转的轴
     * 
     * 0 == axis x 轴
     * 1 == axis y 轴
     * 2 == axis z 轴
     * 
     */
    constructor(request_animation_frame, axis = 0) {
        super();
        this.#request_animation_frame = request_animation_frame;
        this.#axis = axis;
        this.#buildTorus(axis);
        this.#buildBall();
        this.#buildBallLingSegment(axis);
    }

    /**
     * 设置启动之初的交点
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    setStart(x, y, z) {
        if (0 == x && 0 == y && 0 == z) {
            return;
        }

        this.#vec0.set(x, y, z);
        this.#calcBallPosition(this.#vec0);
        x = this.#vec0.x;
        y = this.#vec0.y;
        z = this.#vec0.z;
        this.#showBall0(true);
        this.#setBall0_Position(x, y, z);
        this.#showBall0_LineSegment(true, x, y, z);
        this.#showBall1(true);
        this.#setBall1_Position(x, y, z);
        this.#showBall1_LineSegment(true, x, y, z);
    }

    /**
     * 
     * 设置当前的鼠标的交点
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    setCurrent(x, y, z) {
        if (0 == x && 0 == y && 0 == z) {
            return;
        }

        this.#showBall1(true);
        this.#vec0.set(x, y, z);
        this.#calcBallPosition(this.#vec0);

        x = this.#vec0.x;
        y = this.#vec0.y;
        z = this.#vec0.z;
        this.#setBall1_Position(x, y, z);
        this.#showBall1_LineSegment(true, x, y, z);
    }

    /**
     * 
     * XThree.Vector3
     * 
     * @param {XThree.Vector3} vec 
     * @returns 
     */
    #calcBallPosition(vec) {
        if (0 === this.#axis) {
            vec.x = 0;
        } else if (1 === this.#axis) {
            vec.y = 0;
        } else if (2 === this.#axis) {
            vec.z = 0;
        }
        vec.normalize().multiplyScalar(_axix_rotate_radius);
        return vec;
    }

    /**
     * 生成指示球
     */
    #buildBall() {
        // ball 0
        {
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_ball_0_color);
            const geo = new XThree.SphereGeometry(_axis_ball_0_radius, 12, 12);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            this.#mesh_ball_0 = mesh;
        }

        // ball 1
        {
            const material = new XThree.MeshBasicMaterial();
            material.color = new XThree.Color(_axis_ball_1_color);
            const geo = new XThree.SphereGeometry(_axis_ball_1_radius, 12, 12);
            const mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            this.#mesh_ball_1 = mesh;
        }
    }

    /**
     * 
     * 生成外部圆环轨道
     * 
     * @param {Number} axis 
     */
    #buildTorus(axis) {
        const material = new XThree.MeshBasicMaterial();
        const r = _axix_rotate_radius;
        const t = _axix_rotate_tube_radius;
        const geo = new XThree.TorusGeometry(r, t, 16, 48, Math.PI * 2);
        if (0 == axis) {
            // x 轴
            geo.applyMatrix4(new XThree.Matrix4().makeRotationY(-Math.PI / 2.0));
            material.color = new XThree.Color(_axis_x_color);
        } else if (1 == axis) {
            // y 轴
            geo.applyMatrix4(new XThree.Matrix4().makeRotationX(-Math.PI / 2.0));
            material.color = new XThree.Color(_axis_y_color);
        } else if (2 == axis) {
            // z 轴
            material.color = new XThree.Color(_axis_z_color);
        }
        
        const mesh = new XThree.Mesh();
        mesh.geometry = geo;
        mesh.material = material;
        this.#mesh_torus = mesh;
        this.add(mesh);
    }

    /**
     * 
     * 生成球的线
     * 
     * @param {Number} axis 
     */
    #buildBallLingSegment(axis) {
        this.#mesh_ball_0_line_segment = new XThreeRenderable.LineSegments();
        this.#mesh_ball_0_line_segment.setColor(_axis_ball_0_line_color);
        this.#mesh_ball_0_line_segment.setWidth(3);
        this.#mesh_ball_1_line_segment = new XThreeRenderable.LineSegments();
        this.#mesh_ball_1_line_segment.setColor(_axis_ball_1_line_color);
        this.#mesh_ball_1_line_segment.setWidth(3);
    }

    /**
     * 
     * 显示第一个球
     * 
     * @param {Boolean} show 
     */
    #showBall0(show) {
        if (show) {
            if (!this.#mesh_ball_0.parent) {
                this.add(this.#mesh_ball_0);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.#mesh_ball_0.parent) {
                this.#mesh_ball_0.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示 Ball0 链接圆心的轴
     * 
     * @param {Boolean} show 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    #showBall0_LineSegment(show, x, y, z) {
        if (show) {
            if (!this.#mesh_ball_0_line_segment.parent) {
                this.add(this.#mesh_ball_0_line_segment);
            }
            this.#mesh_ball_0_line_segment.setSegments([0, 0, 0, x, y, z]);
            this.#requestAnimationFrameIfNeed();
        } else {
            if (this.#mesh_ball_0_line_segment.parent) {
                this.#mesh_ball_0_line_segment.parent.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示第二个球
     * 
     * @param {boolean} show 
     */
    #showBall1(show) {
        if (show) {
            if (!this.#mesh_ball_1.parent) {
                this.add(this.#mesh_ball_1);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.#mesh_ball_1.parent) {
                this.#mesh_ball_1.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示 Ball1 链接圆心的轴
     * 
     * @param {Boolean} show 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    #showBall1_LineSegment(show, x, y, z) {
        if (show) {
            if (!this.#mesh_ball_1_line_segment.parent) {
                this.add(this.#mesh_ball_1_line_segment);
            }
            this.#mesh_ball_1_line_segment.setSegments([0, 0, 0, x, y, z]);
            this.#requestAnimationFrameIfNeed();
        } else {
            if (this.#mesh_ball_1_line_segment.parent) {
                this.#mesh_ball_1_line_segment.parent.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 设置 0 号球的位置
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    #setBall0_Position(x, y, z) {
        this.#mesh_ball_0.position.set(x, y, z);
        this.#requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 设置 1 号球的位置
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    #setBall1_Position(x, y, z) {
        this.#mesh_ball_1.position.set(x, y, z);
        this.#requestAnimationFrameIfNeed();
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
     * 
     * 尺寸发生变化
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        let w = pixel_ratio * width ;
        let h = pixel_ratio * height;
        this.#mesh_ball_0_line_segment.setResolution(w, h);
        this.#mesh_ball_1_line_segment.setResolution(w, h);
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#mesh_ball_0.parent) {
            this.#mesh_ball_0.removeFromParent();
            this.#requestAnimationFrameIfNeed();
        }

        if (this.#mesh_ball_1.parent) {
            this.#mesh_ball_1.removeFromParent();
            this.#requestAnimationFrameIfNeed();
        }

        this.#mesh_ball_0.geometry.dispose();
        this.#mesh_ball_0.material.dispose();
        this.#mesh_ball_1.geometry.dispose();
        this.#mesh_ball_1.material.dispose();
        this.#mesh_torus .geometry.dispose();
        this.#mesh_torus .material.dispose();
        
        if (this.#mesh_ball_0_line_segment.parent) {
            this.#mesh_ball_0_line_segment.removeFromParent();
            this.#requestAnimationFrameIfNeed();
        }

        if (this.#mesh_ball_1_line_segment.parent) {
            this.#mesh_ball_1_line_segment.removeFromParent();
            this.#requestAnimationFrameIfNeed();
        }

        this.#mesh_ball_0_line_segment.dispose();
        this.#mesh_ball_1_line_segment.dispose();
    }
}
