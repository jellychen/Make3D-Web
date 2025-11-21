/* eslint-disable no-unused-vars */

import EventDispatcher        from '@common/misc/event-dispatcher';
import SelectedContainer      from './selected-container';
import ScopedParametersSyncer from './scoped-parameters-syncer';
import TransformerUpdater     from './misc/transformer-updater';

/**
 * 协调者，用来调节整个项目
 */
export default class Coordinator extends EventDispatcher {
    /**
     * UI 相关
     */
    arena;                 // Arena, 根页面
    dashboard_container;   // 
    abattoir;              // 用来承载渲染器的页面元素
    moderator;             // 配置面板

    /**
     * 弹提示信息
     */
    mailbox_t;
    mailbox_b;

    /**
     * 界面元素
     */
    nav;
    side_menu;

    /**
     * 设置面板
     */
    settings;

    /**
     * 场景
     */
    scene;

    /**
     * 核心的渲染器，渲染器调节器
     */
    cinderella;
    cinderella_conf_context;
    
    /**
     * 部件
     */
    transformer; // 变换组件

    /**
     * 被选中的元素
     */
    selected_container;
    selected_container_auto_outline = true;
    selected_container_need_update = false;

    /**
     * 编辑方法
     */
    ec_mode;
    ec;

    /**
     * 同步
     */
    scoped_parameters_syncer;

    /**
     * 工具类
     */
    transformer_updater;
    transformer_need_update = false;

    /**
     * 拦截
     */
    transformer_updater_hook;

    /**
     * 获取键盘监控器
     */
    get keyboard_watcher() {
        return this.cinderella.getKeyboardWatcher();
    }

    /**
     * 获取用来显示场景的树
     */
    get scene_tree() {
        return this.moderator.scene_tree;
    }

    /**
     * 获取
     */
    get camera() {
        return this.cinderella.getCamera();
    }

    /**
     * 获取中间的显示区域
     */
    get is_abattoir_focused() {
        return this.abattoir.isFocused();
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} init_object 
     */
    constructor(init_object) {
        super();

        // 初始化
        this.arena               = init_object.arena;
        this.dashboard_container = init_object.dashboard;
        this.abattoir            = init_object.abattoir;
        this.moderator           = init_object.moderator;
        this.nav                 = init_object.nav;
        this.side_menu           = init_object.side_menu;
        this.mailbox_t           = init_object.mailbox_t;
        this.mailbox_b           = init_object.mailbox_b;
        if (!this.abattoir || !this.arena) {
            throw new Error("init_object is invalidata");
        }

        // 实时渲染器的一些初始化
        this.cinderella               = this.abattoir.cinderella;
        this.cinderella_conf_context  = this.cinderella.getConfContext();
        this.transformer              = this.cinderella_conf_context.transformer;
        this.scene                    = this.cinderella.getScene();
        this.selected_container       = new SelectedContainer(this, this.scene);       // 选中物体的列表
        this.scoped_parameters_syncer = new ScopedParametersSyncer(this);              // 和wasm同步
        this.transformer_updater      = new TransformerUpdater(this, this.cinderella); // 初始化工具

        // 时机
        this.cinderella.addEventListener('frame-begin', () => this.onFrameBegin());
        this.cinderella.addEventListener('frame-end'  , () => this.onFrameEnd  ());
    }

    /**
     * 干掉全部的
     */
    resetAllHook() {
        this.transformer_updater_hook = undefined;
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.ec) {
            this.ec.dispose();
            this.ec = undefined;
        }
    }
}
