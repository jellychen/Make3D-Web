/* eslint-disable no-unused-vars */

import GlobalScope         from '@common/global-scope';
import Base                from '../base';
import NavToolbar          from './toolbar/v';
import Receptacle          from './receptacle/v';
import BooleanCoordinator  from './boolean_coordinator';
import Renderable          from './renderable';
import Selector            from './selector';
import SelectorTransformer from './selector-transformer';
import HistoricalRecorder  from './historical-recorder';

/**
 * CSG
 */
export default class EcBoolean extends Base {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 场景
     */
    #scene;

    /**
     * 界面元素
     */
    #moderator;
    #scene_tree;
    #scene_tree_context;
    #aio;

    /**
     * 导航条
     */
    #nav_toolbar;

    /**
     * 核心渲染器
     */
    #cinderella;
    #cinderella_conf_context; 

    /**
     * 渲染器
     */
    #cinderella_scene;

    /**
     * 渲染器配置备份
     */
    #cinderella_conf_bck;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * 选择器
     */
    #selector;

    /**
     * 变换
     */
    #selector_transformer;

    /**
     * 辅助场景
     */
    #renderable;

    /**
     * 用来控制，进行Boolean计算的容器
     */
    #receptacle;

    /**
     * wasm 对象
     */
    #connector;

    /**
     * 用来封装计算
     */
    #boolean_coordinator;

    /**
     * 接收到孩子 TransformChanged
     */
    #on_scene_has_child_transform_changed = event => this.#onSceneHasChildTransformChanged(event);

    /**
     * 用来完成回滚的对象
     */
    #historical_recorder;

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 获取
     */
    get toolbar() {
        return this.#nav_toolbar;
    }

    /**
     * 获取
     */
    get receptacle() {
        return this.#receptacle;
    }

    /**
     * 获取
     */
    get historical_recorder() {
        return this.#historical_recorder;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(coordinator);
        this.#coordinator             = coordinator;
        this.#historical_recorder     = new HistoricalRecorder(this, coordinator);
        this.#scene                   = this.#coordinator.scene;                            // 渲染的场景
        this.#selected_container      = coordinator.selected_container;                     // 获取选择容器
        this.#selector                = new Selector(this, coordinator);                    // 选择器
        this.#selector_transformer    = new SelectorTransformer(this, coordinator);         // 变换
        this.#cinderella              = this.#coordinator.cinderella;                       // 核心渲染器
        this.#cinderella_conf_context = this.#cinderella.getConfContext();                  // 核心渲染器配置
        this.#cinderella_conf_bck     = this.#cinderella_conf_context.makeConfSnapshot();   // 核心渲染器配置备份
        this.#cinderella_scene        = this.#cinderella.getScene();                        // 获取渲染器的场景

        // 感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirBooleanController,
        } = Chameleon;

        // 构建角斗场
        this.#connector = new AbattoirBooleanController();

        // 构建导航条
        this.#nav_toolbar = new NavToolbar(this);
        this.nav.setToolbarContent(this.#nav_toolbar);

        // 配置
        this.cinderella_conf_context.setDisableAll();
        this.cinderella_conf_context.setEnableCoordinate(true);
        this.cinderella_conf_context.setEnableRenderScene(true);
        this.cinderella_conf_context.setEnableLights(false);
        this.cinderella_conf_context.setEnableSceneShadow(false);
        this.cinderella_conf_context.setEnableCursor(true);
        this.cinderella_conf_context.setEnableEdgeEnhancement(false);
        this.cinderella_conf_context.setEnableSelectBox(true);

        // 设置鼠标
        this.setCursor("default");

        // 界面更新
        this.#moderator = this.#coordinator.moderator;
        this.#scene_tree = this.#moderator.scene_tree;
        this.#scene_tree_context = this.#scene_tree.context;
        this.#scene_tree_context.forbidden_rename = true;
        this.#scene_tree_context.forbidden_menu = true;
        this.#scene_tree_context.forbidden_ajust_sort = true;
        this.#receptacle = new Receptacle(this.#coordinator, this, this.#connector);
        this.#receptacle.addEventListener('changed', event => this.#onReceptacleChanged(event));
        this.#aio = this.#moderator.aio;
        this.#aio.setShowModalContainer(true);
        this.#aio.modal.appendChild(this.#receptacle);
        this.#boolean_coordinator = new BooleanCoordinator(this, this.#connector);

        // 创建辅助渲染
        this.#renderable = new Renderable(coordinator, this.#connector, this.#receptacle, this.#boolean_coordinator);
        this.#cinderella_scene.add(this.#renderable);

        // 监听事件
        this.#scene.addEventListener('child-transform-changed', this.#on_scene_has_child_transform_changed);

        // 执行渲染
        this.#selector.updateTransformer();
        
        this.renderNextFrame();
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return "boolean";
    }

    /**
     * 回滚
     */
    rollback() {
        if (this.#historical_recorder && this.#historical_recorder.canRollback()) {
            if (this.#historical_recorder.rollback()) {
                this.coordinator.renderNextFrame();
            }
        }
    }

    /**
     * 
     * 接收到外部命令
     * 
     * @param {info} object 
     */
    onRecvCommand(info = undefined) {
        ;
    }

    /**
     * 
     * 设置 CSG 类型
     * 
     * none
     * 
     * union
     * intersection
     * a_not_b
     * b_not_a
     * xor
     * 
     * @param {String} type 
     */
    setBooleanType(type) {
        if (this.#boolean_coordinator.setBooleanType(type)) {
            this.#renderable.markNeedUpdate();
            this.renderNextFrame();
        }
    }

    /**
     * 整个重新计算
     */
    updateAndMarkNeedUpdate() {
        this.#renderable.markNeedUpdate();
        this.renderNextFrame();
    }

    /**
     * 
     * 参与计算的元素发生变化
     * 
     * @param {*} event 
     */
    #onReceptacleChanged(event) {
        this.#renderable.markNeedUpdate();
        this.renderNextFrame();
    }

    /**
     * 
     * 接收到孩子 TransformChanged
     * 
     * @param {*} event 
     */
    #onSceneHasChildTransformChanged(event) {
        this.#renderable.markNeedUpdate();
        this.renderNextFrame();
    }

    /**
     * 下一帧渲染
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // 销毁回滚
        this.#historical_recorder.distory();

        // 恢复 Tree 的职能
        this.#scene_tree_context.reset();
        this.#scene.removeEventListener('child-transform-changed', this.#on_scene_has_child_transform_changed);

        // 销毁
        if (this.#selector) {
            this.#selector.dispose();
            this.#selector = undefined;
        }

        if (this.#selector_transformer) {
            this.#selector_transformer.dispose();
            this.#selector_transformer = undefined;
        }

        // 销毁
        if (this.#renderable) {
            this.#renderable.removeFromParent();
            this.#renderable.dispose();
            this.#renderable = undefined;
        }

        // 恢复界面
        this.#aio.setShowModalContainer(false);
        
        if (this.#receptacle) {
            this.#receptacle.remove();
            this.#receptacle.dispose();
            this.#receptacle = undefined;
        }

        // 重置渲染器的配置
        if (this.#cinderella_conf_bck) {
            this.#cinderella_conf_bck.makeCurrent();
        }
    }
}
