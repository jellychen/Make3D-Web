/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isUndefined           from 'lodash/isUndefined';
import XThree                from '@xthree/basic';
import GlobalScope           from '@common/global-scope';
import ScopedParameters      from '@core/houdini/scoped-parameters';
import DefaultMatcapMaterial from './renderable/default-matcap-material';
import NavToolbar            from './toolbar/v';
import Base                  from '../base';
import Arena                 from './arena';
import Setter                from './setter/v';

/**
 * 三维雕刻
 */
export default class EcSculptor extends Base {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 监控键盘
     */
    #keyboard_watcher;

    /**
     * orbit
     */
    #orbit;

    /**
     * 核心渲染器
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * 尺寸
     */
    #w = 0;
    #h = 0;
    #pixel_ratio = 1.0;

    /**
     * 渲染
     */
    #cinderella_renderer;

    /**
     * 辅助场景
     */
    #collaborator;

    /**
     * 进行操作的元素
     */
    #object;                                        // 元素
    #object_matrix        = new XThree.Matrix4();    // 元素转化到世界坐标系
    #object_parent_matrix = new XThree.Matrix4();    // 元素父亲转化到世界坐标系

    /**
     * 操作的soup
     */
    #soup;

    /**
     * 辅助编辑显示的
     */
    #arena;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * 导航条
     */
    #nav_toolbar;

    /**
     * 通用设置面板
     */
    #setter;

    /**
     * 记录当前更新的相机的VP矩阵的版本
     */
    #current_camera_vp_version = undefined;

    /**
     * 事件回调
     */
    #on_pointer_down  = event => this.#onPointerDown (event);
    #on_pointer_move  = event => this.#onPointerMove (event);
    #on_pointer_up    = event => this.#onPointerUp   (event);
    #on_keyboard_down = event => this.#onKeyboardDown(event);
    #on_keyboard_up   = event => this.#onKeyboardUp  (event);

    /**
     * 位置指示器
     */
    #localizer;

    /**
     * c++ 接口
     */
    #connector;

    /**
     * brush
     * 
     * CLAY
     * NORMAL
     * CREASE
     * DRAG
     * FLATTEN
     * INFLATE
     * LOCAL_SCALE
     * PAINT
     * PINCH
     * SMOOTH
     * TWIST
     * MOVE
     * 
     * MASKING
     * 
     */
    #current_brush;
    #current_brush_str_bck
    #current_brush_bck;
    
    /**
     * 标记是否开始雕刻
     */
    #sculpting = false;

    /**
     * 鼠标位置
     */
    #pointer_x = 0;
    #pointer_y = 0;

    /**
     * 临时变量
     */
    #vec3_0 = new XThree.Vector3();
    #vec3_1 = new XThree.Vector3();
    #vec3_2 = new XThree.Vector3();
    #vec3_3 = new XThree.Vector3();
    #vec4_0 = new XThree.Vector4();
    #vec4_1 = new XThree.Vector4();
    #vec4_2 = new XThree.Vector4();
    #vec4_3 = new XThree.Vector4();
    #mat4_0 = new XThree.Matrix4();
    #mat4_1 = new XThree.Matrix4();
    #mat4_2 = new XThree.Matrix4();
    #mat4_3 = new XThree.Matrix4();
    #mat4_4 = new XThree.Matrix4();
    #mat4_5 = new XThree.Matrix4();

    /**
     * 事件回调
     */
    #on_orbit_changed = event => this.#onOrbitChanged(event);

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(coordinator);
        this.#coordinator = coordinator;
        this.#keyboard_watcher = this.keyboard_watcher;
        this.#orbit = this.orbit;
        this.#selected_container = coordinator.selected_container; // 获取选择容器
        if (1 !== this.#selected_container.count()) {
            throw new Error('EcSculptor must only select one!')
        }

        // 初始化Matcap材质
        DefaultMatcapMaterial.init(() => {
            this.renderNextFrame();
        });

        // 获取感兴趣的元素
        this.#cinderella = coordinator.cinderella;
        this.#cinderella_renderer = this.#cinderella.getRenderer();
        this.#cinderella_conf_context = this.#cinderella.getConfContext();
        this.#object = this.#selected_container.getOneValue();
        this.#soup = this.#object.getEditableSoup();
        this.#localizer = this.localizer;
        this.#collaborator = this.collaborator;

        // 设置通用菜单
        this.#setter = new Setter(coordinator, this);
        this.#coordinator.moderator.setForbidden(false);
        this.#coordinator.moderator.showSceneContainerModal(true);
        this.#coordinator.moderator.getSceneContainerModal().setContent(this.#setter);
        
        // 构建导航条
        this.#nav_toolbar = new NavToolbar(this.coordinator, this);
        this.#nav_toolbar.setType("clay");
        this.#nav_toolbar.addEventListener('type-changed', (event) => {
            this.setBrushType(event.token);
        });
        this.nav.setToolbarContent(this.#nav_toolbar);

        // 获取元素的属性
        this.#object.updateWorldMatrix(true, false);
        this.#object_matrix.copy(this.#object.matrixWorld);
        this.#object_parent_matrix.copy(this.#object.getParentMatrixWorld());

        // 写入确定的信息
        GlobalScope.ChameleonScopedParameters.setMatrix(this.#object.matrixWorld);

        // 感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirSculptorController,
            AbattoirSculptorEnumBrushType,
        } = Chameleon;

        // 构建角斗场
        this.#connector = new AbattoirSculptorController(this.#soup);
        this.#connector.setupBrush(AbattoirSculptorEnumBrushType.CLAY);
        this.#connector.setRadius(50);
        this.#connector.setIntensity(10);
        this.#connector.setNegative(false);

        // 标记当前的画刷
        this.#current_brush = AbattoirSculptorEnumBrushType.CLAY;

        // 监听设置变动
        this.#setter.on_setting_changed = () => {
            this.setShowEdges(this.#setter.showEdges);
            this.#connector.setRadius(this.#setter.radius);
            this.#connector.setIntensity(this.#setter.intensity);
            this.#connector.setNegative(!this.#setter.positive);
            this.#updateLocalizer();
        };

        // 配置 arena 
        this.#arena = new Arena(coordinator, this.#connector, this.#cinderella_renderer);
        this.#arena.copyMatrixFromObject(this.#object);
        this.#arena.showVertices(false);
        this.#arena.showEdges(false);
        this.#collaborator.attach(this.#arena);     // 替换默认的场景
        this.#object.visible = false;               // 隐藏原来的元素
            
        // 配置
        this.cinderella_conf_context.setDisableAll();
        this.cinderella_conf_context.setEnableCoordinate(true);
        this.cinderella_conf_context.setEnableRenderScene(true);
        this.cinderella_conf_context.setEnableSceneShadow(false);
        this.cinderella_conf_context.setEnableCursor(true);
        this.cinderella_conf_context.setEnableLocalizer(true);
        this.cinderella_conf_context.setEnableEdgeEnhancement(false);
        this.cinderella_conf_context.setEnableSelectBox(false);

        // 隐藏鼠标
        this.setCursor('default');

        // 默认不显示
        this.#localizer.showA(false);
        this.#localizer.showB(false);

        // 监听事件
        this.interactive_controller.addEventListener('pointer-down', this.#on_pointer_down);
        this.interactive_controller.addEventListener('pointer-move', this.#on_pointer_move);
        this.interactive_controller.addEventListener('pointer-up'  , this.#on_pointer_up  );

        // 监听
        this.#orbit.addEventListener('changed', this.#on_orbit_changed);

        // 监听键盘
        this.#keyboard_watcher.addEventListener('keydown', this.#on_keyboard_down);
        this.#keyboard_watcher.addEventListener('keyup',   this.#on_keyboard_up  );

        // 执行渲染
        this.renderNextFrame();
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return "sculptor";
    }

    /**
     * 
     * 设置画刷的类型
     * 
     * @param {string} type 
     */
    setBrushType(type) {
        if (!isString(type)) {
            return;
        }

        // 感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const AbattoirSculptorEnumBrushType = Chameleon.AbattoirSculptorEnumBrushType;

        // 根据名称
        let brush = undefined;
        switch (type) {
        case "clay":
            brush = AbattoirSculptorEnumBrushType.CLAY;
            break;

        case "smooth":
            brush = AbattoirSculptorEnumBrushType.SMOOTH;
            break;

        case "drag":
            brush = AbattoirSculptorEnumBrushType.DRAG;
            break;

        case "crease":
            brush = AbattoirSculptorEnumBrushType.CREASE;
            break;

        case "flatten":
            brush = AbattoirSculptorEnumBrushType.FLATTEN;
            break;

        case "inflate":
            brush = AbattoirSculptorEnumBrushType.INFLATE;
            break;

        case "expand":
            brush = AbattoirSculptorEnumBrushType.EXPAND;
            break;

        case "pinch":
            brush = AbattoirSculptorEnumBrushType.PINCH;
            break;

        case "stack":
            brush = AbattoirSculptorEnumBrushType.STACK;
            break;

        case "twist":
            brush = AbattoirSculptorEnumBrushType.TWIST;
            break;

        case "masking":
            brush = AbattoirSculptorEnumBrushType.MASKING;
            break;
        }

        // 设置
        if (!isUndefined(brush) || this.#current_brush != brush) {
            this.#connector.setupBrush(brush);
            this.#current_brush = brush;
        }
    }

    /**
     * 
     * 设置显示边框
     * 
     * @param {*} show 
     */
    setShowEdges(show) {
        this.#arena.markNeedUpdate();
        this.#arena.showEdges(true == show);
        this.renderNextFrame();
    }

    /**
     * 
     * 更新视口尺寸
     * 
     * @returns 
     */
    #updateViewportSize() {
        const w = this.#cinderella.w;
        const h = this.#cinderella.h;
        const p = this.#cinderella.pixel_ratio;
        if (this.#w != w || this.#h != h || this.#pixel_ratio != p) {
            this.#w = w;
            this.#h = h;
            this.#pixel_ratio = p;
            ScopedParameters.setViewportSize(w, h, p);
        }
        return this;
    }

    /**
     * 更新相机参数
     */
    #updateCamera() {
        const camera = this.#cinderella.getCamera();
        if (this.#current_camera_vp_version !== camera.version) {
            ScopedParameters.setV(camera.matrixWorldInverse);
            ScopedParameters.setP(camera.projectionMatrix);
            this.#current_camera_vp_version = camera.version;
        }
        return this;
    }

    /**
     * 更新
     */
    #updateViewportSizeAndCamera() {
        this.#updateCamera();
        this.#updateViewportSize();
    }

    /**
     * 
     * 鼠标按下
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        // 非左键
        if (event.buttons !== 1) {
            return;
        } else {
            this.#updateViewportSizeAndCamera();
            this.#connector.sculptBegin();
            this.#connector.setStartPointerPos(event.x, event.y);
            this.#sculpting = true;
        }
    }

    /**
     * 
     * 鼠标移动
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        // 更新
        this.#updateViewportSizeAndCamera();
        this.#connector.envSync();

        // 记录
        this.#pointer_x = event.x;
        this.#pointer_y = event.y;

        // 雕刻
        if (this.#sculpting) {
            if (this.#connector.updatePointerPos(event.x, event.y)) {
                this.#arena.markNeedUpdate();
                this.renderNextFrame();
            } else {
            }
        }

        // 更新
        this.#updateLocalizer();
        this.renderNextFrame();
    }

    /**
     * 
     * 鼠标弹起
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        if (this.#sculpting) {
            this.#updateViewportSizeAndCamera();
            this.#connector.sculptFinish();
            this.#sculpting = false;
        }
    }

    /**
     * 
     * 键盘按下
     * 
     * @param {*} event 
     */
    #onKeyboardDown(event) {
        if ("Shift" == event.key) {
            this.#current_brush_str_bck = this.#nav_toolbar.type;
            this.#current_brush_bck = this.#current_brush;
            this.#connector.setupBrush(GlobalScope.Chameleon.AbattoirSculptorEnumBrushType.SMOOTH);
            this.#nav_toolbar.setType("smooth");
        }
    }

    /**
     * 
     * 键盘弹起
     * 
     * @param {*} event 
     */
    #onKeyboardUp(event) {
        if ("Shift" == event.key) {
            this.#nav_toolbar.setType(this.#current_brush_str_bck);
            this.#connector.setupBrush(this.#current_brush_bck);
        }
    }

    /**
     * 更新
     */
    #updateLocalizer() {
        // 感兴趣的类
        const { CommonMath3DSymmetryAxis } = GlobalScope.Chameleon;

        // 标记是不是存在 localizer
        let has_localizer = false;

        // 获取
        if (this.#connector.pick(this.#pointer_x, this.#pointer_y, CommonMath3DSymmetryAxis.NONE)) {
            ScopedParameters.getVec3(0, this.#vec3_0);  // p
            ScopedParameters.getVec3(1, this.#vec3_1);  // n
            const r = ScopedParameters.getF32Arr()[0];  // r
            this.#localizer.showA(true);
            this.#localizer.setPositionInfo_A(r, this.#vec3_0, this.#vec3_1);
            has_localizer = true;
        } else {
            this.#localizer.showA(false);
        }

        if (this.#connector.pick(this.#pointer_x, this.#pointer_y, CommonMath3DSymmetryAxis.X)) {
            ScopedParameters.getVec3(0, this.#vec3_0);  // p
            ScopedParameters.getVec3(1, this.#vec3_1);  // n
            const r = ScopedParameters.getF32Arr()[0];  // r
            this.#localizer.showB(true);
            this.#localizer.setPositionInfo_B(r, this.#vec3_0, this.#vec3_1);
            has_localizer = true;
        } else {
            this.#localizer.showB(false);
        }

        // 设置鼠标样式
        if (has_localizer) {
            this.setCursor('none');
        } else {
            this.setCursor('default');
        }
    }

    /**
     * 
     * 相机发生了变化
     * 
     * @param {*} event 
     */
    #onOrbitChanged(event) {
        this.#updateViewportSizeAndCamera();
        this.#connector.envSync();
        this.#updateLocalizer();
        this.renderNextFrame();
    }

    /**
     * 回滚
     */
    rollback() {
        if (this.#connector && this.#connector.rollback()) {
            this.#arena.markNeedUpdate();
            this.renderNextFrame();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // 销毁设置菜单
        this.#coordinator.moderator.disposeSceneContainerModal();

        // 恢复元素的可见性和场景
        this.#object.visible = true;

        // 监听键盘
        this.#keyboard_watcher.removeEventListener('keydown', this.#on_keyboard_down);
        this.#keyboard_watcher.removeEventListener('keyup',   this.#on_keyboard_up  );

        // 移除
        this.#orbit.removeEventListener('changed', this.#on_orbit_changed);

        // 移除事件
        this.interactive_controller.removeEventListener('pointer-down', this.#on_pointer_down);
        this.interactive_controller.removeEventListener('pointer-move', this.#on_pointer_move);
        this.interactive_controller.removeEventListener('pointer-up'  , this.#on_pointer_up  );

        // 销毁场景
        if (this.#arena) {
            this.#collaborator.detach(this.#arena);
            this.#arena.dispose();
            this.#arena = undefined;
        }

        // 销毁
        if (this.#connector) {
            this.#connector.delete();
            this.#connector = undefined;
        }

        // 恢复场景
        this.#cinderella.setOverrideScene(undefined);
    }
}
