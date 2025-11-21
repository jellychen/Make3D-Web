/* eslint-disable no-unused-vars */

import GlobalScope      from '@common/global-scope';
import XThree           from '@xthree/basic';
import ParametersScoped from '@core/houdini/scoped-parameters';

/**
 * 用来更具选择来更新 Transformer
 */
export default class SelectorTransformer {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 场景渲染
     */
    #arena;

    /**
     * 是否启用
     */
    #enable;

    /**
     * 核心渲染器
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * 键盘监控
     */
    #keyboard_watcher;

    /**
     * 渲染器交互
     */
    #interactive;
    #interactive_controller;

    /**
     * wasm 对象
     */
    #connector;

    /**
     * 拾取的基元
     */
    #primitive = 'v';

    /**
     * 变换组件
     */
    #transformer;

    /**
     * 模型矩阵
     */
    #matrix               = new XThree.Matrix4();
    #matrix_invert        = new XThree.Matrix4();
    #matrix_parent        = new XThree.Matrix4();
    #matrix_normal        = new XThree.Matrix3();
    #matrix_normal_invert = new XThree.Matrix3();

    /**
     * 边拖出面
     */
    #manipulator_edge_pullout;

    /**
     * 变换事件
     */
    #on_transform_translate_begin = event => this.#onTransformTranslateBegin(event);
    #on_transform_translate       = event => this.#onTransformTranslate(event);
    #on_transform_translate_end   = event => this.#onTransformTranslateEnd(event);
    #on_transform_scale_begin     = event => this.#onTransformScaleBegin(event);
    #on_transform_scale           = event => this.#onTransformScale(event);
    #on_transform_scale_end       = event => this.#onTransformScaleEnd(event);
    #on_transform_rotate_begin    = event => this.#onTransformRotateBegin(event);
    #on_transform_rotate          = event => this.#onTransformRotate(event);
    #on_transform_rotate_end      = event => this.#onTransformRotateEnd(event);
    #on_wheel                     = event => this.#onWheel(event);

    /**
     * 正在执行 edge-pullout
     */
    #edge_pullouting = false;

    /**
     * 记录
     */
    #translate_x = 0;
    #translate_y = 0;
    #translate_z = 0;

    /**
     * 记录
     */
    #scale_x = 1;
    #scale_y = 1;
    #scale_z = 1;

    /**
     * 记录
     */
    #rotate_angle = 0;

    /**
     * 临时
     */
    #vec3_0 = new XThree.Vector3();
    #vec3_1 = new XThree.Vector3();
    #vec3_2 = new XThree.Vector3();
    #vec3_3 = new XThree.Vector3();
    #vec4_0 = new XThree.Vector4();
    #vec4_1 = new XThree.Vector4();
    #vec4_2 = new XThree.Vector4();
    #vec4_3 = new XThree.Vector4();
    #mat3_0 = new XThree.Matrix3();
    #mat3_1 = new XThree.Matrix3();
    #mat4_0 = new XThree.Matrix4();
    #mat4_1 = new XThree.Matrix4();
    #mat4_2 = new XThree.Matrix4();
    #mat4_3 = new XThree.Matrix4();
    #mat4_4 = new XThree.Matrix4();

    /**
     * 获取
     */
    get enable() {
        return true == this.#enable;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} connector 
     * @param {*} arena 
     */
    constructor(coordinator, connector, arena) {
        this.#coordinator             = coordinator;
        this.#connector               = connector;
        this.#arena                   = arena;
        this.#cinderella              = coordinator.cinderella;
        this.#cinderella_conf_context = this.#cinderella.getConfContext();
        this.#keyboard_watcher        = this.#cinderella.getKeyboardWatcher();
        this.#interactive             = this.#cinderella.getInteractive();
        this.#interactive_controller  = this.#cinderella.getInteractiveController();
        this.#transformer             = this.#cinderella_conf_context.transformer;
        this.setEnable(true);
    }

    /**
     * 
     * 打开或者关闭
     * 
     * @param {boolean} enable 
     */
    setEnable(enable) {
        if (this.#enable == enable) {
            return;
        } else {
            this.#enable = true === enable;
        }

        if (true === enable) {
            this.#cinderella_conf_context.setEnableTransformer(true);
            this.#transformer.addEventListener('translate-begin',     this.#on_transform_translate_begin);
            this.#transformer.addEventListener('translate',           this.#on_transform_translate);
            this.#transformer.addEventListener('translate-end',       this.#on_transform_translate_end);
            this.#transformer.addEventListener('scale-begin',         this.#on_transform_scale_begin);
            this.#transformer.addEventListener('scale',               this.#on_transform_scale);
            this.#transformer.addEventListener('scale-end',           this.#on_transform_scale_end);
            this.#transformer.addEventListener('rotate-begin',        this.#on_transform_rotate_begin);
            this.#transformer.addEventListener('rotate',              this.#on_transform_rotate);
            this.#transformer.addEventListener('rotate-end',          this.#on_transform_rotate_end);
            this.#interactive_controller.addEventListener('wheel',    this.#on_wheel);
        } else {
            this.#cinderella_conf_context.setEnableTransformer(false);
            this.#transformer.removeEventListener('translate-begin',  this.#on_transform_translate_begin);
            this.#transformer.removeEventListener('translate',        this.#on_transform_translate);
            this.#transformer.removeEventListener('translate-end',    this.#on_transform_translate_end);
            this.#transformer.removeEventListener('scale-begin',      this.#on_transform_scale_begin);
            this.#transformer.removeEventListener('scale',            this.#on_transform_scale);
            this.#transformer.removeEventListener('scale-end',        this.#on_transform_scale_end);
            this.#transformer.removeEventListener('rotate-begin',     this.#on_transform_rotate_begin);
            this.#transformer.removeEventListener('rotate',           this.#on_transform_rotate);
            this.#transformer.removeEventListener('rotate-end',       this.#on_transform_rotate_end);
            this.#interactive_controller.removeEventListener('wheel', this.#on_wheel);
        }
    }

    /**
     * 
     * 设置父亲的变换矩阵
     * 
     * @param {*} mat4 
     */
    setParentMatrix(mat4) {
        this.#matrix_parent.copy(mat4);
    }

    /**
     * 
     * 设置变换矩阵
     * 
     * @param {*} mat4 
     */
    setMatrix(mat4) {
        this.#matrix.copy(mat4);
        this.#matrix_normal.getNormalMatrix(mat4);
        this.#matrix_invert.copy(mat4).invert();
        this.#matrix_normal_invert.copy(this.#matrix_normal).invert();
    }

    /**
     * 
     * 获取拾取的基元
     * 
     * @param {String} primitive 
     */
    setSelectorPrimitive(primitive) {
        if (this.#primitive != primitive) {
            this.#primitive = primitive;
            this.update();
        }
    }

    /**
     * 更新
     */
    update() {
        if (!this.#enable) {
            return;
        }

        switch (this.#primitive) {
        case 'v':
            this.#updataBecaseOfVertices();
            break;

        case 'e':
            this.#updataBecaseOfEdges();
            break;

        case 'f':
            this.#updataBecaseOfFaces();
            break;
        }

        this.renderNextFrame();
    }

    /**
     * 通过点计算
     */
    #updataBecaseOfVertices() {
        const count = this.#connector.countOfSelectedVertices();
        if (0 == count) {
            this.#cinderella_conf_context.setEnableTransformer(false);
        } else {
            this.#cinderella_conf_context.setEnableTransformer(true);
            this.#connector.normalSelectedVertices();
            this.#connector.centerOfSelectedVertices();
            ParametersScoped.getVec3(0, this.#vec3_0); // 法线
            ParametersScoped.getVec3(1, this.#vec3_1); // 位置

            // 变换到世界坐标系
            this.#vec3_0.applyNormalMatrix(this.#matrix_normal);
            this.#vec3_1.applyMatrix4(this.#matrix);

            // 设置
            this.#transformer.setPositionInfo(this.#vec3_1, this.#vec3_0);
        }
    }

    /**
     * 通过边计算
     */
    #updataBecaseOfEdges() {
        const count = this.#connector.countOfSelectedEdges();
        if (0 == count) {
            this.#cinderella_conf_context.setEnableTransformer(false);
        } else {
            this.#cinderella_conf_context.setEnableTransformer(true);
            this.#connector.normalSelectedEdges();
            this.#connector.centerOfSelectedEdges();
            ParametersScoped.getVec3(0, this.#vec3_0); // 法线
            ParametersScoped.getVec3(1, this.#vec3_1); // 位置

            // 变换到世界坐标系
            this.#vec3_0.applyNormalMatrix(this.#matrix_normal);
            this.#vec3_1.applyMatrix4(this.#matrix);

            // 设置
            this.#transformer.setPositionInfo(this.#vec3_1, this.#vec3_0);
        }
    }

    /**
     * 通过面计算
     */
    #updataBecaseOfFaces() {
        const count = this.#connector.countOfSelectedFaces();
        if (0 == count) {
            this.#cinderella_conf_context.setEnableTransformer(false);
        } else {
            this.#cinderella_conf_context.setEnableTransformer(true);
            this.#connector.normalSelectedFaces();
            this.#connector.centerOfSelectedFaces();
            ParametersScoped.getVec3(0, this.#vec3_0); // 法线
            ParametersScoped.getVec3(1, this.#vec3_1); // 位置

            // 变换到世界坐标系
            this.#vec3_0.applyNormalMatrix(this.#matrix_normal);
            this.#vec3_1.applyMatrix4(this.#matrix);

            // 设置
            this.#transformer.setPositionInfo(this.#vec3_1, this.#vec3_0);
        }
    }

    /**
     * 变换开始
     */
    #onTransformBegin() {
        // 配置
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirTopoPrimitive,
        } = Chameleon;

        // 重置数据
        this.#translate_x = 0;
        this.#translate_y = 0;
        this.#translate_z = 0;

        // 如果选择的是边，且是按下shift执行的是
        if (this.#keyboard_watcher.shift && 'e' == this.#primitive) {
            this.#edge_pullouting = true;
            this.#manipulator_edge_pullout = this.#connector.getManipulatorEdgePullout();
            this.#manipulator_edge_pullout.begin();
        } else {
            this.#edge_pullouting = false;
        }

        // 开启
        switch (this.#primitive) {
        case 'v':
            this.#connector.selectedTransformBegin(AbattoirTopoPrimitive.V);
            break;

        case 'e':
            this.#connector.selectedTransformBegin(AbattoirTopoPrimitive.E);
            break;

        case 'f':
            this.#connector.selectedTransformBegin(AbattoirTopoPrimitive.F);
            break;
        }
    }

    /**
     * 
     * 拖动开始
     * 
     * @param {*} event 
     */
    #onTransformTranslateBegin() {
        this.#onTransformBegin();
    }

    /**
     * 
     * 拖动
     * 
     * @param {*} event 
     */
    #onTransformTranslate(event) {
        this.#translate_x += event.data.x;
        this.#translate_y += event.data.y;
        this.#translate_z += event.data.z;

        // 计算变换矩阵
        const matrix = this.#transformer.getMeshMatrixWorld().rotation();
        this.#mat4_0.copy(matrix).invert();
        this.#mat4_1.makeTranslation(event.data.x, event.data.y, event.data.z);
        this.#mat4_1.multiply(this.#mat4_0).premultiply(matrix);
        this.#mat4_2.copy(this.#matrix).invert();
        this.#mat4_3.copy(this.#mat4_1);
        this.#mat4_3.multiply(this.#matrix).premultiply(this.#mat4_2);

        // 写入
        GlobalScope.ChameleonScopedParameters.setMat4(0, this.#mat4_3);

        // 执行对边进行拖出
        if (this.#edge_pullouting) {
            if (this.#manipulator_edge_pullout && 
                this.#manipulator_edge_pullout.transform()) {
                this.#arena.markNeedUpdate();
                this.renderNextFrame();
            }
        } 
        
        // 执行对元素的偏移
        else {
            if (this.#connector.selectedTransform()) {
                this.#arena.markNeedUpdate();
                this.renderNextFrame();
            }
        }
    }

    /**
     * 
     * 拖动结束
     * 
     * @param {*} event 
     */
    #onTransformTranslateEnd() {
        this.#translate_x = undefined;
        this.#translate_y = undefined;
        this.#translate_z = undefined;
        if (this.#edge_pullouting) {
            this.#edge_pullouting = false;
            this.#manipulator_edge_pullout.dismiss();
            this.#manipulator_edge_pullout = undefined;
        } else {
            this.#connector.selectedTransformFinish();
        }
    }

    /**
     * 
     * 缩放开始
     * 
     * @param {*} event 
     */
    #onTransformScaleBegin() {
        this.#scale_x = 1.0;
        this.#scale_y = 1.0;
        this.#scale_z = 1.0;
        this.#onTransformBegin();
    }

    /**
     * 
     * 缩放
     * 
     * @param {*} event 
     */
    #onTransformScale(event) {
        // 用来处理缩放系数
        let x = event.data.x;
        let y = event.data.y;
        let z = event.data.z;

        // 如果按下了Shift，就执行同比放大
        if (true === this.#keyboard_watcher.shift) {
            if (event.data.axis == 0) {
                // x 轴
                y = z = x;
            } else if (event.data.axis == 1) {
                // y 轴
                x = z = y;
            } else if (event.data.axis == 2) {
                // z 轴
                x = y = z;
            }
        }

        // 计算缩放系数
        const a = x / this.#scale_x;
        const b = y / this.#scale_y;
        const c = z / this.#scale_z;

        // 更新
        this.#scale_x = x;
        this.#scale_y = y;
        this.#scale_z = z;

        // 在世界坐标系下计算
        const matrix = this.#transformer.getMeshMatrixWorld().removeScaleFactor();
        this.#mat4_0.copy(matrix).invert();
        this.#mat4_1.makeScale(a, b, c);
        this.#mat4_1.multiply(this.#mat4_0).premultiply(matrix);

        // 模型
        this.#mat4_2.copy(this.#matrix).invert();
        this.#mat4_3.copy(this.#mat4_1);
        this.#mat4_3.multiply(this.#matrix).premultiply(this.#mat4_2);

        // 写入
        GlobalScope.ChameleonScopedParameters.setMat4(0, this.#mat4_3);

        // 执行
        if (this.#connector.selectedTransform()) {
            this.#arena.markNeedUpdate();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 缩放结束
     * 
     * @param {*} event 
     */
    #onTransformScaleEnd() {
        this.#connector.selectedTransformFinish();
    }

    /**
     * 
     * 旋转开始
     * 
     * @param {*} event 
     */
    #onTransformRotateBegin() {
        this.#rotate_angle = 0;
        this.#onTransformBegin();
    }

    /**
     * 
     * 旋转
     * 
     * @param {*} event 
     */
    #onTransformRotate(event) {
        // 用来处理旋转系数
        const angle = event.data.angle;
        const angle_offset = angle - this.#rotate_angle;
        this.#rotate_angle = angle;

        // 在世界坐标系下计算
        this.#vec3_0.copy(this.#transformer.getCenter());
        const matrix = this.#transformer.getMeshMatrixWorld();
        const axis   = event.data.axis;
        if (0 == axis) {
            this.#vec4_0.set(1, 0, 0, 0);   // x 轴
        } else if (1 == axis) {
            this.#vec4_0.set(0, 1, 0, 0);   // y 轴
        } else if (2 == axis) {
            this.#vec4_0.set(0, 0, 1, 0);   // z 轴
        }

        // 模型
        this.#mat4_0 = this.#matrix_invert;
        this.#mat3_0 = this.#matrix_normal_invert;
        this.#vec4_1.copy(this.#vec4_0).applyMatrix4(matrix);               // 世界坐标系方向
        this.#vec3_1.set(this.#vec4_1.x, this.#vec4_1.y, this.#vec4_1.z);
        this.#vec3_1.applyMatrix3(this.#mat3_0).normalize();                // 转化到模型坐标系
        this.#vec3_2.copy(this.#vec3_0).applyMatrix4(this.#mat4_0);
        this.#mat4_2.makeTranslation(this.#vec3_2);
        this.#mat4_3.makeTranslation(this.#vec3_2.negate());
        this.#mat4_4.identity();
        this.#mat4_4.makeRotationAxis(this.#vec3_1, angle_offset);
        this.#mat4_4.multiply(this.#mat4_3);
        this.#mat4_4.premultiply(this.#mat4_2);

        // 写入
        GlobalScope.ChameleonScopedParameters.setMat4(0, this.#mat4_4);

        // 执行
        if (this.#connector.selectedTransform()) {
            this.#arena.markNeedUpdate();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 旋转结束
     * 
     * @param {*} event 
     */
    #onTransformRotateEnd() {
        this.#connector.selectedTransformFinish();
        this.update();
    }

    /**
     * 收到滚轮事件
     */
    #onWheel(event) {
        //
        // 只有按下Shift按键
        // 调整 变换器的朝向
        //
        if (this.#keyboard_watcher.shift) {
            const x = event.deltaX;
            const y = event.deltaY;
            let offset = 0;
            if (Math.abs(x) > Math.abs(y)) {
                offset = x;
            } else {
                offset = y;
            }
            offset = Math.sign(offset) * 
                     Math.clamp(
                     Math.abs(offset), 0, 20);
            this.#transformer.rotateOnZAxis(Math.PI * offset / 1024);
        }
    }

    /**
     * 下一帧执行渲染
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        this.setEnable(false);
    }
}
