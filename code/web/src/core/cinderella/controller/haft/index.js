/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree    from '@xthree/basic';
import Constants from './constants';
import Mesh      from './mesh';
import Rail      from './rail';
import Picker    from './picker';

/**
 * 临时变量
 */
const _vec3_0     = new XThree.Vector3();
const _vec3_1     = new XThree.Vector3();
const _vec4       = new XThree.Vector4();
const _position   = new XThree.Vector3();
const _scale      = new XThree.Vector3();
const _quaternion = new XThree.Quaternion();

/**
 * 拖动手柄
 */
export default class Haft extends XThree.Group {
    /**
     * 请求重绘函数
     */
    #request_animation_frame = () => {};

    /**
     * 事件
     */
    #attached_interactive;
    #personal_cameraman;

    /**
     * 可用性
     */
    #enable                = false;

    /**
     * 主动监听事件
     */
    #enable_event_owner    = true;

    /**
     * 是否在监听事件
     */
    #is_listening_event    = false;

    /**
     * 射线拾取
     */
    #ray_caster            = new XThree.Raycaster();
    #ray                   = new XThree.Ray();
    #pointer               = new XThree.Vector2();

    /**
     * 从世界坐标系转化到本地坐标系
     */
    #world_to_local_matrix = new XThree.Matrix4();

    /**
     * 鼠标
     */
    #is_hover              = false;

    /**
     * 网格
     */
    #mesh;
    #mesh_scale            = 1.0;

    /**
     * 路径指引
     */
    #rail;

    /**
     * 拾取
     */
    #picker                = new Picker();

    /**
     * 监听的事件回调
     */
    #on_pointer_down;
    #on_pointer_move;
    #on_pointer_up;
    #on_pointer_cancel;

    /**
     * 表示当前的组件是不是接管了
     */
    #is_take_over          = false;

    /**
     * 鼠标按下的时候
     */
    #intersect_point_z     = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {Function} request_animation_frame 
     * @param {*} interactive 
     * @param {Boolean} enable_event_owner 
     */
    constructor(request_animation_frame, interactive, enable_event_owner = true) {
        super();
        this.#request_animation_frame = request_animation_frame;
        this.#attached_interactive    = interactive;
        this.#enable_event_owner      = enable_event_owner;

        // 构建Mesh
        const request_animation = () => this.#requestAnimationFrame();
        this.#mesh = new Mesh(request_animation);
        this.#rail = new Rail(request_animation);
        this.#mesh.add(this.#rail);
        this.add(this.#mesh);

        // 拾取
        this.#picker.setAxisBallRadius(this.#mesh.getAxisBallRadius());
        this.#picker.setAxisLen(this.#mesh.getAxisLen());
        this.#picker.setAxisRadius(this.#mesh.getAxisRadius());

        // 监听事件回调
        this.#on_pointer_down   = event => this.#onPointerDown(event);
        this.#on_pointer_move   = event => this.#onPointerMove(event);
        this.#on_pointer_up     = event => this.#onPointerUp(event);
        this.#on_pointer_cancel = event => this.#onPointerCancel(event);

        // 初始化状态
        this.setEnable(true);
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {Boolean} enable 
     */
    setEnable(enable) {
        if (enable === this.#enable) {
            return;
        }

        // 如果主动监听事件
        if (this.#enable_event_owner) {
            if (enable) {
                this.attach();
            } else {
                this.detach();
            }
        }

        this.#enable = enable;
        this.visible = enable;
        this.#requestAnimationFrame();
    }

    /**
     * 判断可用性
     */
    get enable() {
        return this.#enable;
    }

    /**
     * 添加对事件的监听
     */
    attach() {
        if (this.#is_listening_event) {
            return;
        } else {
            this.#is_listening_event = true;
            this.#attached_interactive.addEventListener('pointerdown',   this.#on_pointer_down);
            this.#attached_interactive.addEventListener('pointermove',   this.#on_pointer_move);
            this.#attached_interactive.addEventListener('pointerup',     this.#on_pointer_up);
            this.#attached_interactive.addEventListener('pointercancel', this.#on_pointer_cancel);
        }
    }

    /**
     * 取消对事件的监听
     */
    detach() {
        if (!this.#is_listening_event) {
            return;
        } else {
            this.#is_listening_event = false;
            this.#attached_interactive.removeEventListener('pointerdown',   this.#on_pointer_down);
            this.#attached_interactive.removeEventListener('pointermove',   this.#on_pointer_move);
            this.#attached_interactive.removeEventListener('pointerup',     this.#on_pointer_up);
            this.#attached_interactive.removeEventListener('pointercancel', this.#on_pointer_cancel);
        }
    }

    /**
     * 
     * 设置当前使用的相机
     * 
     * @param {*} cameraman 
     */
    setPersonalCameraman(cameraman) {
        this.#personal_cameraman = cameraman;
    }

    /**
     * 
     * 设置位置，会剔除中间的缩放因子
     * 
     * @param {XThree.Matrix4} mat4 
     */
    setMatrix(mat4) {
        mat4.decompose(_position, _quaternion, _scale);
        this.#mesh.position.copy(_position);
        this.#mesh.quaternion.copy(_quaternion);
        this.#requestAnimationFrame();
    }

    /**
     * 
     * 设置位置信息
     * 
     * @param {XThree.Vector3} position  位置
     * @param {XThree.Vector3} z_dir     朝向
     */
    setPositionInfo(position, z_dir) {
        _vec3_0.copy(z_dir).normalize();
        _vec3_1.x = 0;
        _vec3_1.y = 0;
        _vec3_1.z = 1;
        this.#mesh.position.copy(position);
        this.#mesh.quaternion.setFromUnitVectors(_vec3_1, _vec3_0);
        this.#requestAnimationFrame();
    }

    /**
     * 
     * 设置拾取的信息 ui 坐标系下
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setPickInfo(x, y) {
        const r      = this.#attached_interactive.getBoundingClientRect();
        const half_w = r.width / 2.0;
        const half_h = r.height / 2.0;
        x            = (x - r.left - half_w) / half_w;
        y            = (half_h - y + r.top) / half_h;
        this.setPickNdcInfo(x, y);
    }

    /**
     * 
     * 设置拾取的信息
     * 
     * @param {Number} ndc_x 
     * @param {Number} ndc_y 
     */
    setPickNdcInfo(ndc_x, ndc_y) {
        const camera    = this.#personal_cameraman.camera;
        this.#pointer.x = ndc_x;
        this.#pointer.y = ndc_y;
        this.#ray_caster.setFromCamera(this.#pointer, camera);
    }

    /**
     * 配置射线
     */
    setupRay() {
        this.#ray.copy(this.#ray_caster.ray);
        this.#ray.applyMatrix4(this.#world_to_local_matrix);
    }

    /**
     * 
     * 外部的事件分发，返回值表示成功响应事件，期待后续事件
     * 
     * @param {*} event 
     * @returns 
     */
    dispathPointerDown(event) {
        if (this.#enable) {
            return this.#onPointerDown(event);
        }
        return false;
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerMove(event) {
        if (this.#enable) {
            this.#onPointerMove(event);
        }
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerUp(event) {
        if (this.#enable) {
            this.#onPointerUp(event);
        }
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerCancel(event) {
        if (this.#enable) {
            this.#onPointerCancel(event);
        }
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        if (!this.visible) {
            return;
        }

        // 获取当前的Viewport
        renderer.getViewport(_vec4);

        // 透视相机
        if ("PerspectiveCamera" === camera.type) {
            _vec3_0.copy(this.#mesh.position).sub(camera.position);
            _vec3_1.copy(camera.target)      .sub(camera.position).normalize();
            const viewport_h = _vec4.w;
            const fov        = camera.fov;
            const near       = camera.near;
            const distance   = _vec3_0.dot(_vec3_1);
            this.#mesh_scale = 1.0;
            this.#mesh_scale *= distance / Constants.FLAUNT_CAMERA_DISTANCE;
            this.#mesh_scale *= Math.tan(Math.D2A_(fov) * 0.5) * near;
            this.#mesh_scale *= 1.0 / (Math.tan(Math.D2A_(Constants.FLAUNT_CAMERA_FOV) * 0.5) * Constants.FLAUNT_CAMERA_NEAR);
            this.#mesh_scale *= Constants.FLAUNT_CAMERA_VIEWPORT_HEIGHT / viewport_h;
        }

        // 正交相机
        else if ("OrthographicCamera" === camera.type) {
            const viewport_h = _vec4.w;
            const h          = camera.top - camera.bottom;
            this.#mesh_scale = h / viewport_h * Constants.FLAUNT_CAMERA_ORTHO_SCALE;
        }

        // 调整缩放
        this.#mesh.scale.set(this.#mesh_scale, this.#mesh_scale, this.#mesh_scale);

        // 记录
        this.#updateWorldToLocalMatrix();

        // 执行渲染
        renderer.render(this, camera);
    }

    /**
     * 
     * 鼠标按下的事件，返回值表示成功响应事件，期待后续事件
     * 
     * @param {*} event 
     * @returns 
     */
    #onPointerDown(event) {
        if (!this.#enable) {
            return false;
        } else {
            this.setPickInfo(event.x, event.y);
            this.setupRay();
            this.#is_hover = this.#picker.pick(this.#ray);
            this.#mesh.setHighlight(this.#is_hover);
            if (!this.#is_hover) {
                return false;
            }

            this.#is_take_over = true;
            if (this.#enable_event_owner) {
                this.#attached_interactive.setPointerCapture(event.pointerId);
            }
            this.#intersect_point_z = this.#picker.pickAxisZ(this.#ray);
            this.#rail.setShow(true);
            
            this.dispatchEvent({ type: 'begin'});

            return true;
        }
    }

    /**
     * 
     * 鼠标移动的事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        if (!this.#enable) {
            return;
        } else {
            this.setPickInfo(event.x, event.y);
            this.setupRay();
            if (false === this.#is_take_over) {
                this.#is_hover = this.#picker.pick(this.#ray);
                this.#mesh.setHighlight(this.#is_hover);
            } else {
                const z = this.#picker.pickAxisZ(this.#ray);
                if (null != z) {
                    let offset = z - this.#intersect_point_z;
                    if (offset != 0) {
                        offset *= this.#mesh_scale;
                        this.#mesh.translateZ(offset);
                        this.#updateWorldToLocalMatrix();
                        this.#requestAnimationFrame();
                        this.#dispatchEventTranslate(offset);
                    }
                }
            }
        }
    }

    /**
     * 
     * 鼠标抬起事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        if (!this.#enable) {
            return;
        } else {
            if (false === this.#is_take_over) {
                return;
            } else {
                this.#updateWorldToLocalMatrix();
                this.setPickInfo(event.x, event.y);
                this.setupRay();
                this.#mesh.setHighlight(this.#picker.pick(this.#ray));
                this.#is_take_over = false;
                this.#rail.setShow(false);

                this.dispatchEvent({ type: 'end'});
            }
        }
    }

    /**
     * 
     * 鼠标放弃事件
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }

    /**
     * 更新矩阵
     */
    #updateWorldToLocalMatrix() {
        this.#mesh.updateWorldMatrix(true, false);
        this.#world_to_local_matrix.copy(this.#mesh.matrixWorld);
        this.#world_to_local_matrix.invert();
    }

    /**
     * 请求一帧新的渲染
     */
    #requestAnimationFrame() {
        this.#request_animation_frame();
    }

    /**
     * 
     * 分发事件
     * 
     * @param {Number} z 
     */
    #dispatchEventTranslate(z) {
        this.dispatchEvent({
            type: 'translate',
            data: z
        });
    }

    /**
     * 销毁
     */
    dispose() {
        this.detach();
        this.#mesh.dispose();
        this.#rail.dispose();
    }
}
