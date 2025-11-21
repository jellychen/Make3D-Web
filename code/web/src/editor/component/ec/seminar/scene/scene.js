/* eslint-disable no-unused-vars */

import Base                from '../base';
import NavToolbar          from './toolbar/v';
import Assistor            from './assistor';
import Selector            from './selector';
import SelectorTransformer from './selector-transformer';
import Menu                from './menu';
import HistoricalRecorder  from './historical-recorder';

/**
 * 场景编辑
 */
export default class EcScene extends Base {
    /**
     * 导航条
     */
    nav_toolbar;

    /**
     * 被选中的元素
     */
    selected_container;

    /**
     * 菜单
     */
    menu;

    /**
     * 选择器
     */
    selector;

    /**
     * 变换
     */
    selector_transformer;

    /**
     * 辅助器
     */
    assistor;

    /**
     * 监听事件
     */
    #on_keydown = event => this.onKeyDown(event);
    #on_keyup   = event => this.onKeyUp  (event);

    /**
     * 用来完成回滚的对象
     */
    historical_recorder;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(coordinator);
        this.coordinator.setEnableSelectedContainerAutoOutline(true);
        this.setEnableCustomizeMenu(true);
        this.historical_recorder  = new HistoricalRecorder(this, coordinator);
        this.selected_container   = coordinator.selected_container;
        this.selector             = new Selector(coordinator, this);
        this.selector_transformer = new SelectorTransformer(coordinator, this);
        this.assistor             = new Assistor(coordinator, this);

        // 构建菜单
        this.menu = new Menu(coordinator, this);

        // 隐藏右侧菜单
        this.coordinator.moderator.setVisible(true);
        this.coordinator.moderator.setForbidden(false);

        // 构建导航条
        this.nav_toolbar = new NavToolbar(this.coordinator, this);
        this.nav.setToolbarContent(this.nav_toolbar);

        // 配置
        this.cinderella_conf_context.setDisableAll();
        this.cinderella_conf_context.setEnableCoordinate(true);
        this.cinderella_conf_context.setEnableTransformerGlobal(true);
        this.cinderella_conf_context.setEnableRenderScene(true);
        this.cinderella_conf_context.setEnableLights(true);
        this.cinderella_conf_context.setEnableSceneShadow(true);
        this.cinderella_conf_context.setEnableCursor(true);
        this.cinderella_conf_context.setEnableEdgeEnhancement(true);
        this.cinderella_conf_context.setEnableSelectBox(true);

        // 设置鼠标
        this.setCursor("default");

        // 调整变换组件
        this.coordinator.updateTransformer();

        // 监听事件
        this.keyboard_watcher.addEventListener('keydown', this.#on_keydown);
        this.keyboard_watcher.addEventListener('keyup'  , this.#on_keyup);
    }

    /**
     * 
     * 自定义菜单
     * 
     * @param {*} event 
     */
    onCustomizeMenu(event) {
        super.onCustomizeMenu(event);
        this.menu.show(event.clientX, event.clientY);
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return "scene";
    }

    /**
     * 
     * 获取历史记录
     * 
     * @returns 
     */
    getHistoricalRecorder() {
        return this.historical_recorder;
    }

    /**
     * 
     * 是否打开了光追窗口
     * 
     * @returns 
     */
    isOpenRTWindow() {
        return this.nav_toolbar.isOpenRTWindow;
    }

    /**
     * 
     * 打开或者关闭 选择和选择变换器
     * 
     * @param {boolean} enable 
     */
    setEnableSelectorAndSelectorTransformer(enable) {
        this.selector.setEnable(enable);
        this.selector_transformer.setEnable(enable);
    }

    /**
     * 主动更新变换器
     */
    updateTransformer() {
        this.coordinator.updateTransformer();
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // 销毁菜单回调
        this.setEnableCustomizeMenu(false);

        // 销毁
        this.assistor.dispose();
        this.selector.dispose();
        this.selector_transformer.dispose();

        // 销毁事件
        this.keyboard_watcher.removeEventListener('keydown', this.#on_keydown);
        this.keyboard_watcher.removeEventListener('keyup',   this.#on_keyup);

        // 销毁回滚日历
        this.historical_recorder.distory();
    }
}
