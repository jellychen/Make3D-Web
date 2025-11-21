/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import Constants        from './constants';
import Mesh             from './mesh';
import Rail             from './rail';
import RailAxis         from './rail-axis';
import RotaterContainer from './rotater-container';
import Picker           from './picker';
import Overlapped       from './overlapped';

/**
 * 临时变量
 */
const _vec3_x   = new XThree.Vector3();
const _vec3_y   = new XThree.Vector3();
const _vec3_z   = new XThree.Vector3();
const _vec3_0   = new XThree.Vector3();
const _vec3_1   = new XThree.Vector3();
const _vec3_2   = new XThree.Vector3();
const _vec3_3   = new XThree.Vector3();
const _vec3_4   = new XThree.Vector3();
const _vec3_5   = new XThree.Vector3();
const _vec4     = new XThree.Vector4();
const _position = new XThree.Vector3();
const _scale    = new XThree.Vector3();
const _mat_0    = new XThree.Matrix4();
const _mat_1    = new XThree.Matrix4();
const _quat_0   = new XThree.Quaternion();
const _quat_1   = new XThree.Quaternion();

/**
 * 变换的组件
 */
export default class Transformer extends XThree.Group {
    /**
     * 请求重绘函数
     */
    #request_animation_frame = () => {};

    /**
     * hover状态的变化
     */
    onhoverchanged;

    /**
     * 是否活跃
     */
    #is_active = false;

    /**
     * 标记是不是有效
     */
    #enable = false;

    /**
     * 主动监听事件
     */
    #enable_event_owner = true;

    /**
     * 
     */
    #attached_interactive;
    #personal_cameraman;

    /**
     * 从世界坐标系转化到本地坐标系
     */
    #world_to_local_matrix_0 = new XThree.Matrix4();
    #world_to_local_matrix_1 = new XThree.Matrix4();

    /**
     * 鼠标是不是拾取到了
     */
    #is_hover = false;
    
    /**
     * 射线拾取
     */
    #ray_caster = new XThree.Raycaster();
    #ray_picker;
    #ray        = new XThree.Ray();
    #pointer    = new XThree.Vector2();

    /**
     * 网格
     */
    #mesh_highlight_element = Constants.NONE;
    #mesh;
    #mesh_scale             = 1.0;

    /**
     * 路径 和 旋转
     */
    #rail;
    #rail_axis;
    #rotater_container;

    /**
     * 覆盖层
     */
    #overlapped;

    /**
     * 监听的事件回调
     */
    #on_pointer_down   = event => this.#onPointerDown(event);
    #on_pointer_move   = event => this.#onPointerMove(event);
    #on_pointer_up     = event => this.#onPointerUp(event);
    #on_pointer_cancel = event => this.#onPointerCancel(event);

    /**
     * 表示当前的组件是不是接管了
     */
    #is_take_over = false;

    /**
     * 鼠标按下时候的交点
     */
    #intersect_point_x = 0;
    #intersect_point_y = 0;
    #intersect_point_z = 0;

    /**
     * 临时变量
     */
    #vec3_0 = new XThree.Vector3();
    #vec3_1 = new XThree.Vector3();
    #vec4_0 = new XThree.Vector4();
    #vec4_1 = new XThree.Vector3();
    #mat4_0 = new XThree.Matrix4();

    /**
     * 
     * 构造函数
     * 
     * @param {*} request_animation_frame 
     * @param {*} interactive 
     * @param {boolean} enable_event_owner 
     */
    constructor(request_animation_frame, interactive, enable_event_owner = true) {
        super();
        this.#request_animation_frame = request_animation_frame;
        this.#attached_interactive = interactive;
        this.#enable_event_owner = enable_event_owner;

        // Mesh
        const request_animation = () => this.#requestAnimationFrame();
        this.#mesh = new Mesh(request_animation);
        this.#rail = new Rail(request_animation);
        this.#rail_axis = new RailAxis(this);
        this.#rotater_container = new RotaterContainer(request_animation);
        this.#overlapped = new Overlapped(request_animation);
        this.#mesh.add(this.#rotater_container);
        this.#mesh.add(this.#rail);
        this.add(this.#mesh);

        // Ray picker
        this.#ray_picker = new Picker(this, this.#mesh);

        // 初始化状态
        this.setEnable(true);
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {boolean} enable 
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
        
        this.#enable = true === enable;
        this.visible = true === enable;
        this.#requestAnimationFrame();
    }

    /**
     * 判断可用性
     */
    get enable() {
        return this.#enable;
    }

    /**
     * 是否活跃
     */
    get active() {
        return this.#is_active;
    }

    /**
     * 
     * 设置只支持拖动
     * 
     * @param {*} only 
     */
    setOnlyTranslate(only = false) {
        this.#mesh.setOnlyTranslate(only);
    }

    /**
     * 添加对事件的监听
     */
    attach() {
        this.#attached_interactive.addEventListener('pointerdown',   this.#on_pointer_down);
        this.#attached_interactive.addEventListener('pointermove',   this.#on_pointer_move);
        this.#attached_interactive.addEventListener('pointerup',     this.#on_pointer_up);
        this.#attached_interactive.addEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 取消对事件的监听
     */
    detach() {
        this.#attached_interactive.removeEventListener('pointerdown',   this.#on_pointer_down);
        this.#attached_interactive.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#attached_interactive.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#attached_interactive.removeEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 获取mesh
     * 
     * @returns 
     */
    getMesh() {
        return this.#mesh;
    }

    /**
     * 
     * 获取mesh的变换矩阵
     * 
     * @returns 
     */
    getMeshMatrix() {
        return this.#mesh.matrix;
    }

    /**
     * 
     * 获取世界矩阵
     * 
     * @param {boolean} update 
     * @returns 
     */
    getMeshMatrixWorld(update = false) {
        if (true === update) {
            this.#mesh.updateWorldMatrix(true, false);
        }
        return this.#mesh.matrixWorld;
    }

    /**
     * 
     * 获取中心
     * 
     * @param {*} update 
     */
    getCenter(update = false) {
        return this.#mesh.getBasePoint(update);
    }

    /**
     * 
     * 设置位置，会剔除中间的缩放因子
     * 
     * @param {XThree.Matrix4} mat4 
     */
    setMatrix(mat4) {
        mat4.decompose(_position, _quat_0, _scale);
        this.#mesh.position.copy(_position);
        this.#mesh.quaternion.copy(_quat_0);
        this.#requestAnimationFrame();
    }

    /**
     * 
     * 设置位置
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setPosition(x, y, z) {
        this.#mesh.position.set(x, y, z);
        this.#mesh.rotation.set(0, 0, 0);
    }

    /**
     * 
     * 设置位置
     * 
     * @param {*} v3 
     */
    setPositionVec3(v3) {
        this.setPosition(v3.x, v3.y, v3.z);
    }

    /**
     * 
     * 设置位置信息
     * 
     * @param {XThree.Vector3} position  位置
     * @param {XThree.Vector3} z_dir     朝向
     */
    setPositionInfo(position, z_dir) {
        // if (this.#enable) {
        //     this.#mesh.matrix.identity();
        //     this.#mesh.matrixAutoUpdate = true;
        //     _vec3_0.copy(z_dir).normalize();
        //     _vec3_1.x = 0;
        //     _vec3_1.y = 0;
        //     _vec3_1.z = 1;
        //     this.#mesh.position.copy(position);
        //     this.#mesh.quaternion.setFromUnitVectors(_vec3_1, _vec3_0);
        //     this.#requestAnimationFrame();
        // }
        this.setPositionInfo2(position, z_dir);
    }

    /**
     * 
     * 设置位置信息
     * 
     * @param {XThree.Vector3} position  位置
     * @param {XThree.Vector3} z_dir     朝向
     */
    setPositionInfo2(position, z_dir) {
        if (this.#enable) {
            const d = _vec3_0.copy(z_dir).normalize();
            const x = _vec3_x.set(1, 0, 0);
            const y = _vec3_y.set(0, 1, 0);
            const z = _vec3_z.set(0, 0, 1);

            // 计算X轴
            let x0 = _vec3_1.set(1, 0, 0);
            let x1 = _vec3_2;
            if (Math.abs(d.x) === 1) {
                x1.crossVectors(y , d);
            } else {
                x1.crossVectors(x0, d);
            }

            // 计算Y轴
            const y0 = _vec3_3.crossVectors(d, x1).normalize();

            // 构造变换矩阵
            this.#mesh.position.copy(position);
            _mat_0.set(
                x1.x, y0.x, d.x, 0,
                x1.y, y0.y, d.y, 0,
                x1.z, y0.z, d.z, 0,
                0   ,    0,   0, 1,
            );
            _mat_0.decompose(_vec3_0, this.#mesh.quaternion, _vec3_1);

            this.#requestAnimationFrame();
        }
    }

    /**
     * 
     * 绕Z轴旋转的弧度
     * 
     * @param {*} theta 
     */
    rotateOnZAxis(theta) {
        if (this.#enable) {
            _vec3_0.x = 0;
            _vec3_0.y = 0;
            _vec3_0.z = 1;
            _quat_0.setFromAxisAngle(_vec3_0, theta);
            this.#mesh.quaternion.multiply(_quat_0);
            this.#requestAnimationFrame();
        }
    }

    /**
     * 获取中心的位置
     */
    getCenterWorldPosition() {
        this.#mesh.updateWorldMatrix(true, false);
        this.#vec4_0.set(0, 0, 0, 1);
        this.#vec4_0.applyMatrix4(this.#mesh.matrixWorld);
        this.#vec4_0.divideScalar(this.#vec4_0.w);
        return this.#vec4_0;
    }

    /**
     * 
     * 获取中心坐标的NDC坐标
     * 
     * @param {Boolean} update_camera_matrix 
     * @param {Boolean} update_camera_projection 
     * @returns 
     */
    getCenterNDC(update_camera_matrix = false, update_camera_projection = false) {
        const camera = this.#personal_cameraman.camera;
        if (update_camera_matrix) {
            camera.updateMatrixWorld();
        }

        if (update_camera_projection) {
            camera.updateProjectionMatrix();
        }
        
        this.#mat4_0.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        this.#mesh.updateWorldMatrix( true, false );
        this.#vec4_0.set(0, 0, 0, 1);
        this.#vec4_0.applyMatrix4(this.#mesh.matrixWorld);
        this.#vec4_0.applyMatrix4(this.#mat4_0);
        this.#vec4_0.divideScalar(this.#vec4_0.w);
        return this.#vec4_0;
    }

    /**
     * 
     * 判断当前鼠标是不是hover
     * 
     * @returns Boolean
     */
    isHover() {
        return this.#is_hover;
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
     * 设置拾取的信息 ui 坐标系下
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setPickInfo(x, y) {
        const r = this.#attached_interactive.getBoundingClientRect();
        const half_w = r.width  / 2.0;
        const half_h = r.height / 2.0;
        x = (x - r.left - half_w) / half_w;
        y = (half_h - y + r.top ) / half_h;
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
        this.#ray.applyMatrix4(this.#world_to_local_matrix_0);
    }

    /**
     * 拾取，ray在局部坐标系
     */
    pick() {
        return this.#ray_picker.pick(this.#ray);
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
        this.#overlapped.resize(pixel_ratio, width, height);
        this.#rail_axis.resize(pixel_ratio, width, height);
        this.#rotater_container.resize(pixel_ratio, width, height);
    }

    /**
     * 
     * 外部的事件分发，返回值表示成功响应事件，期待后续事件
     * 
     * @param {*} event 
     * @returns Boolean
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
     * 更新旋转
     */
    #updateRotate() {
        if (Constants.AXIS_X_ROTATE == this.#mesh_highlight_element) {
            // x 轴
            this.#mesh.rotateX(this.#rotater_container.angle);
        } else if (Constants.AXIS_Y_ROTATE == this.#mesh_highlight_element) {
            // y 轴
            this.#mesh.rotateY(this.#rotater_container.angle);
        } else if (Constants.AXIS_Z_ROTATE == this.#mesh_highlight_element) {
            // z 轴
            this.#mesh.rotateZ(this.#rotater_container.angle);
        }
    }

    /**
     * 更新矩阵
     */
    #updateWorldToLocalMatrix() {
        this.#mesh.updateWorldMatrix(true, false);
        this.#world_to_local_matrix_0.copy(this.#mesh.matrixWorld);
        this.#world_to_local_matrix_0.invert();
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        // 获取当前的Viewport
        renderer.getViewport(_vec4);

        // 透视相机
        if ("PerspectiveCamera" === camera.type) {
            _vec3_0.copy(this.#mesh.position).sub(camera.position);
            _vec3_1.copy(camera.target)      .sub(camera.position).normalize();
            const viewport_h  = _vec4.w;
            const fov         = camera.fov;
            const near        = camera.near;
            const distance    = _vec3_0.dot(_vec3_1);
            this.#mesh_scale  = 1.0;
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
        
        // 执行渲染动作
        renderer.clearDepth();
        renderer.render(this, camera);

        // 绘制轴辅助
        this.#rail_axis.setPositionPoint(this.#mesh.position);
        this.#rail_axis.render(renderer, camera);

        // 渲染重叠层
        this.#overlapped.render(renderer);
    }

    /**
     * 
     * 鼠标按下的事件, 返回值表示成功响应事件，期待后续事件
     * 
     * @param {*} event 
     * @returns 
     */
    #onPointerDown(event) {
        if (!this.#enable || 1 !== event.buttons) {
            return false;
        }

        this.setPickInfo(event.x, event.y);
        this.setupRay();
        this.#setHoverElement(this.pick());
        if (!this.#is_hover) {
            return false;
        }

        this.#is_take_over = true;
        if (this.#enable_event_owner) {
            this.#attached_interactive.setPointerCapture(event.pointerId);
        }

        // 平移
        if (Constants.AXIS_X_TRANSLATE === this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'translate-begin'});
            this.#is_active = true;
            // x 轴
            this.#rail.setShowX(true);
            this.#intersect_point_x = this.#ray_picker.pickX(this.#ray);
        } else if (Constants.AXIS_Y_TRANSLATE === this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'translate-begin'});
            this.#is_active = true;
            // y 轴
            this.#rail.setShowY(true);
            this.#intersect_point_y = this.#ray_picker.pickY(this.#ray);
        } else if (Constants.AXIS_Z_TRANSLATE === this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'translate-begin'});
            this.#is_active = true;
            // z 轴
            this.#rail.setShowZ(true);
            this.#intersect_point_z = this.#ray_picker.pickZ(this.#ray);
        }

        // 面平移
        if (Constants.PLANE_XY === this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'translate-begin'});
            this.#is_active = true;
            // x y 轴
            this.#rail.setShowX(true);
            this.#rail.setShowY(true);
            this.#ray_picker.pickXY(this.#ray);
            this.#intersect_point_x = this.#ray_picker.point_1().x;
            this.#intersect_point_y = this.#ray_picker.point_1().y;
        } else if (Constants.PLANE_XZ === this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'translate-begin'});
            this.#is_active = true;
            // x z 轴
            this.#rail.setShowX(true);
            this.#rail.setShowZ(true);
            this.#ray_picker.pickXZ(this.#ray);
            this.#intersect_point_x = this.#ray_picker.point_1().x;
            this.#intersect_point_z = this.#ray_picker.point_1().z;
        } else if (Constants.PLANE_YZ === this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'translate-begin'});
            this.#is_active = true;
            // y z 轴
            this.#rail.setShowY(true);
            this.#rail.setShowZ(true);
            this.#ray_picker.pickYZ(this.#ray);
            this.#intersect_point_y = this.#ray_picker.point_1().y;
            this.#intersect_point_z = this.#ray_picker.point_1().z;
        }

        // 旋转
        if (Constants.AXIS_X_ROTATE == this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'rotate-begin'});
            this.#is_active = true;
            // x 轴
            this.#ray_picker.pickYZ(this.#ray);
            const x = this.#ray_picker.point_1().x;
            const y = this.#ray_picker.point_1().y;
            const z = this.#ray_picker.point_1().z;
            this.#rotater_container.setShowRotaterX(true);
            this.#rotater_container.setStart(x, y, z);
            this.#mesh.setAllHidden();
        } else if (Constants.AXIS_Y_ROTATE == this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'rotate-begin'});
            this.#is_active = true;
            // y 轴
            this.#ray_picker.pickXZ(this.#ray);
            const x = this.#ray_picker.point_1().x;
            const y = this.#ray_picker.point_1().y;
            const z = this.#ray_picker.point_1().z;
            this.#rotater_container.setShowRotaterY(true);
            this.#rotater_container.setStart(x, y, z);
            this.#mesh.setAllHidden();
        } else if (Constants.AXIS_Z_ROTATE == this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'rotate-begin'});
            this.#is_active = true;
            // z 轴
            this.#ray_picker.pickXY(this.#ray);
            const x = this.#ray_picker.point_1().x;
            const y = this.#ray_picker.point_1().y;
            const z = this.#ray_picker.point_1().z;
            this.#rotater_container.setShowRotaterZ(true);
            this.#rotater_container.setStart(x, y, z);
            this.#mesh.setAllHidden();
        }

        // 缩放
        if (Constants.AXIS_X_SCALE === this.#mesh_highlight_element) {
            this.#intersect_point_x = this.#ray_picker.pickX(this.#ray);
        } else if (Constants.AXIS_Y_SCALE === this.#mesh_highlight_element) {
            this.#intersect_point_y = this.#ray_picker.pickY(this.#ray);
        } else if (Constants.AXIS_Z_SCALE === this.#mesh_highlight_element) {
            this.#intersect_point_z = this.#ray_picker.pickZ(this.#ray);
        }

        // 缩放
        if (Constants.AXIS_X_SCALE === this.#mesh_highlight_element || 
            Constants.AXIS_Y_SCALE === this.#mesh_highlight_element ||
            Constants.AXIS_Z_SCALE === this.#mesh_highlight_element) {
            this.dispatchEvent({ type: 'scale-begin'});
            this.#is_active = true;
            this.#overlapped.setShowLineDash(true);
            const r = this.#attached_interactive.getBoundingClientRect();
            const w = this.#attached_interactive.clientWidth;
            const h = this.#attached_interactive.clientHeight;
            let x = event.x - r.left;
            let y = event.y - r.top;
            x = x - w / 2.0;
            y = h / 2.0 - y;
            this.#overlapped.setLineDashStartPoint(x, y);            
        }

        return true;
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
        }

        this.setPickInfo(event.x, event.y);
        this.setupRay();

        // 没有被接管
        if (false === this.#is_take_over) {
            this.#setHoverElement(this.pick());
            return;
        }

        // 显示轴轨迹指示器
        this.#rail_axis.setVisible(true);
    
        // 平移
        if (Constants.AXIS_X_TRANSLATE == this.#mesh_highlight_element) {
            const x = this.#ray_picker.pickX(this.#ray);
            let offset = x - this.#intersect_point_x;
            if (offset != 0) {
                offset *= this.#mesh_scale;
                this.#dispatchEventTranslate(offset, 0, 0);
                this.#mesh.translateX(offset);
                this.#updateWorldToLocalMatrix();
                this.#requestAnimationFrame();
            }
        } else if (Constants.AXIS_Y_TRANSLATE == this.#mesh_highlight_element) {
            const y = this.#ray_picker.pickY(this.#ray);
            let offset = y - this.#intersect_point_y;
            if (offset != 0) {
                offset *= this.#mesh_scale;
                this.#dispatchEventTranslate(0, offset, 0);
                this.#mesh.translateY(offset);
                this.#updateWorldToLocalMatrix();
                this.#requestAnimationFrame();
            }
        } else if (Constants.AXIS_Z_TRANSLATE == this.#mesh_highlight_element) {
            const z = this.#ray_picker.pickZ(this.#ray);
            let offset = z - this.#intersect_point_z;            
            if (offset != 0) {
                offset *= this.#mesh_scale;
                this.#dispatchEventTranslate(0, 0, offset);
                this.#mesh.translateZ(offset);
                this.#updateWorldToLocalMatrix();
                this.#requestAnimationFrame();
            }
        }

        // 缩放
        if (Constants.AXIS_X_SCALE == this.#mesh_highlight_element) {
            const x = this.#ray_picker.pickX(this.#ray);
            const offset = (x - this.#intersect_point_x);
            const scale = (Constants.POS_TRANSLATE_AXIS_LEN + offset) / Constants.POS_TRANSLATE_AXIS_LEN;
            if (scale != 1) {
                this.#dispatchEventScale(0, scale);
                this.#requestAnimationFrame();
            }
        } else if (Constants.AXIS_Y_SCALE == this.#mesh_highlight_element) {
            const y = this.#ray_picker.pickY(this.#ray);
            const offset = (y - this.#intersect_point_y);
            const scale = (Constants.POS_TRANSLATE_AXIS_LEN + offset) / Constants.POS_TRANSLATE_AXIS_LEN;
            if (scale != 1) {
                this.#dispatchEventScale(1, scale);
                this.#requestAnimationFrame();
            }
        } else if (Constants.AXIS_Z_SCALE == this.#mesh_highlight_element) {
            const z = this.#ray_picker.pickZ(this.#ray);
            const offset = (z - this.#intersect_point_z);
            const scale = (Constants.POS_TRANSLATE_AXIS_LEN + offset) / Constants.POS_TRANSLATE_AXIS_LEN;
            if (scale != 1) {
                this.#dispatchEventScale(2, scale);
                this.#requestAnimationFrame();
            }
        }

        // 面偏移
        if (Constants.PLANE_XY == this.#mesh_highlight_element) {
            if (this.#ray_picker.pickXY(this.#ray)) {
                const x = this.#ray_picker.point_1().x;
                const y = this.#ray_picker.point_1().y;
                const offset_x = x - this.#intersect_point_x;
                const offset_y = y - this.#intersect_point_y;
                if (offset_x != 0 && offset_y != 0) {
                    const x = offset_x * this.#mesh_scale;
                    const y = offset_y * this.#mesh_scale;
                    this.#dispatchEventTranslate(x, y, 0);
                    this.#mesh.translateX(x);
                    this.#mesh.translateY(y);
                    this.#updateWorldToLocalMatrix();
                    this.#requestAnimationFrame();
                }
            }
        } else if (Constants.PLANE_XZ == this.#mesh_highlight_element) {
            if (this.#ray_picker.pickXZ(this.#ray)) {
                const x = this.#ray_picker.point_1().x;
                const z = this.#ray_picker.point_1().z;
                const offset_x = x - this.#intersect_point_x;
                const offset_z = z - this.#intersect_point_z;
                if (offset_x != 0 && offset_z != 0) {
                    const x = offset_x * this.#mesh_scale;
                    const z = offset_z * this.#mesh_scale;
                    this.#dispatchEventTranslate(x, 0, z);
                    this.#mesh.translateX(x);
                    this.#mesh.translateZ(z);
                    this.#updateWorldToLocalMatrix();
                    this.#requestAnimationFrame();
                }
            }
        } else if (Constants.PLANE_YZ == this.#mesh_highlight_element) {
            if (this.#ray_picker.pickYZ(this.#ray)) {
                const y = this.#ray_picker.point_1().y;
                const z = this.#ray_picker.point_1().z;
                const offset_y = y - this.#intersect_point_y;
                const offset_z = z - this.#intersect_point_z;
                if (offset_y != 0 && offset_z != 0) {
                    const y = offset_y * this.#mesh_scale;
                    const z = offset_z * this.#mesh_scale;
                    this.#dispatchEventTranslate(0, y, z);
                    this.#mesh.translateY(y);
                    this.#mesh.translateZ(z);
                    this.#updateWorldToLocalMatrix();
                    this.#requestAnimationFrame();
                }
            }
        }

        // 轴旋转
        if (Constants.AXIS_X_ROTATE == this.#mesh_highlight_element) {
            this.#ray_picker.pickYZ(this.#ray);
            const x = this.#ray_picker.point_1().x;
            const y = this.#ray_picker.point_1().y;
            const z = this.#ray_picker.point_1().z;
            this.#dispatchEventRotate(0, this.#rotater_container.angle);
            this.#rotater_container.setCurrent(x, y, z);
        } else if (Constants.AXIS_Y_ROTATE == this.#mesh_highlight_element) {
            this.#ray_picker.pickXZ(this.#ray);
            const x = this.#ray_picker.point_1().x;
            const y = this.#ray_picker.point_1().y;
            const z = this.#ray_picker.point_1().z;
            this.#dispatchEventRotate(1, this.#rotater_container.angle);
            this.#rotater_container.setCurrent(x, y, z);
        } else if (Constants.AXIS_Z_ROTATE == this.#mesh_highlight_element) {
            this.#ray_picker.pickXY(this.#ray);
            const x = this.#ray_picker.point_1().x;
            const y = this.#ray_picker.point_1().y;
            const z = this.#ray_picker.point_1().z;
            this.#dispatchEventRotate(2, this.#rotater_container.angle);
            this.#rotater_container.setCurrent(x, y, z);
        }

        // 调整缩放轨迹
        if (Constants.AXIS_X_SCALE === this.#mesh_highlight_element || 
            Constants.AXIS_Y_SCALE === this.#mesh_highlight_element ||
            Constants.AXIS_Z_SCALE === this.#mesh_highlight_element) {
            this.#overlapped.setShowLineDash(true);
            const r = this.#attached_interactive.getBoundingClientRect();
            const w = this.#attached_interactive.clientWidth;
            const h = this.#attached_interactive.clientHeight;
            let x = event.x - r.left;
            let y = event.y - r.top;
            x = x - w / 2.0;
            y = h / 2.0 - y;
            this.#overlapped.setLineDashEndPoint(x, y);
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
        }

        const last_highlight_element = this.#mesh_highlight_element;

        // 重置
        this.#mesh.setShowAll();
        this.#rail.setAllHidden();
        this.#rotater_container.setAllHidden();
        this.#overlapped.setShowLineDash(false);
        this.#rail_axis.setVisible(false);
        this.#updateRotate();
        this.#updateWorldToLocalMatrix();
        this.setPickInfo(event.x, event.y);
        this.setupRay();
        this.#setHoverElement(this.pick());
        this.#is_take_over = false;
        this.#requestAnimationFrame();

        // 平移
        if (Constants.AXIS_X_TRANSLATE == last_highlight_element ||
            Constants.AXIS_Y_TRANSLATE == last_highlight_element ||
            Constants.AXIS_Z_TRANSLATE == last_highlight_element ||
            Constants.PLANE_XY         == last_highlight_element ||
            Constants.PLANE_XZ         == last_highlight_element ||
            Constants.PLANE_YZ         == last_highlight_element) {
            this.dispatchEvent({ type: 'translate-end' });
            this.#is_active = false;
        }

        // 缩放
        if (Constants.AXIS_X_SCALE     == last_highlight_element || 
            Constants.AXIS_Y_SCALE     == last_highlight_element ||
            Constants.AXIS_Z_SCALE     == last_highlight_element) {
            this.dispatchEvent({ type: 'scale-end' });
            this.#is_active = false;
        }

        // 旋转
        if (Constants.AXIS_X_ROTATE    == last_highlight_element ||
            Constants.AXIS_Y_ROTATE    == last_highlight_element ||
            Constants.AXIS_Z_ROTATE    == last_highlight_element) {
            this.dispatchEvent({ type: 'rotate-end' });
            this.#is_active = false;
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
     * 
     * 设置当前hover的元素
     * 
     * @param {*} element 
     */
    #setHoverElement(element) {
        if (element >= 0) {
            this.#is_hover = true;
            if (this.#mesh_highlight_element != element) {
                if (this.onhoverchanged) {
                    this.onhoverchanged(true);
                }
                this.#mesh.setHightlight(this.#mesh_highlight_element, false);
                this.#mesh_highlight_element = element;
                this.#mesh.setHightlight(this.#mesh_highlight_element, true);
                this.#requestAnimationFrame();
            }
        } else {
            this.#is_hover = false;
            if (this.#mesh_highlight_element != element) {
                if (this.onhoverchanged) {
                    this.onhoverchanged(false);
                }
                this.#mesh.setHightlight(this.#mesh_highlight_element, false);
                this.#mesh_highlight_element = element;
                this.#requestAnimationFrame();
            }
        }
    }

    /**
     * 请求一帧新的渲染
     */
    #requestAnimationFrame() {
        this.#request_animation_frame();
    }

    /**
     * 
     * 分发平移事件
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    #dispatchEventTranslate(x, y, z) {
        this.dispatchEvent({
            type: 'translate',
            data: {
                x: x,
                y: y,
                z: z,
            }
        });
    }

    /**
     * 
     * 分发缩放事件
     * 
     * @param {*} axis 
     * @param {*} value 
     */
    #dispatchEventScale(axis, value) {
        this.dispatchEvent({
            type: 'scale',
            data: {
                axis : axis,
                value: value,
                x    : 0 === axis? value: 1.0,
                y    : 1 === axis? value: 1.0,
                z    : 2 === axis? value: 1.0,
            }
        });
    }

    /**
     * 
     * 绕轴旋转
     * 
     * 0 == axis  x
     * 1 == axis  y
     * 2 == axis  z
     * 
     * @param {Number} axis 
     * @param {Number} angle
     */
    #dispatchEventRotate(axis, angle) {
        this.dispatchEvent({
            type: 'rotate',
            data: {
                axis : axis,
                angle: angle,
            },
        });
    }

    /**
     * 销毁
     */
    dispose() {
        this.detach();
        this.#overlapped.dispose();
        this.#mesh.dispose();
        this.#rail.dispose();
        this.#rail_axis.dispose();
        this.#rotater_container.dispose();
    }
}
