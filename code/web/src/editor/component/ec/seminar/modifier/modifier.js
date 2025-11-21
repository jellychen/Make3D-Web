/* eslint-disable no-unused-vars */

import GlobalScope        from '@common/global-scope';
import Base               from '../base';
import NavToolbar         from './toolbar/v';
import HistoricalRecorder from './historical-recorder';

/**
 * 修改器
 */
export default class EcModifier extends Base {
    /**
     * 导航条
     */
    nav_toolbar;

    /**
     * 被选中的元素
     */
    selected_container;

    /**
     * 场景orbit方位
     */
    orbit_camera_stand_controller;
    orbit_orientation;

    /**
     * 进行操作的元素
     */
    object;

    /**
     * 操作
     */
    manipulator;

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
        this.selected_container = coordinator.selected_container;
        if (1 !== this.selected_container.count()) {
            throw new Error('EcModifier must only select one!')
        }
        
        this.historical_recorder           = new HistoricalRecorder(this, coordinator);
        this.object                        = this.selected_container.getOneValue();
        this.orbit_camera_stand_controller = this.orbit.getCameraStandController();
        this.orbit_orientation             = this.orbit.backupOrientation();
        this.orbit_camera_stand_controller.lookAtObject(this.object);

        // 开启历史记录
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirModifierHistoricRecorder
        } = Chameleon;
        AbattoirModifierHistoricRecorder.setupCurrent();

        // 构建导航条
        this.nav_toolbar = new NavToolbar(this.coordinator);
        this.nav.setToolbarContent(this.nav_toolbar);

        // 配置
        this.cinderella_conf_context.setDisableAll();
        this.cinderella_conf_context.setEnableCoordinate(true);
        this.cinderella_conf_context.setEnableRenderScene(true);
        this.cinderella_conf_context.setEnableLights(false);
        this.cinderella_conf_context.setEnableSceneShadow(true);
        this.cinderella_conf_context.setEnableTransformerGlobal(false);
        this.cinderella_conf_context.setEnableHaft(false);
        this.cinderella_conf_context.setEnablePlaneDetector(false);
        this.cinderella_conf_context.setEnableSelectBox(false);
        this.cinderella_conf_context.setEnableOutline(true);

        // 设置鼠标
        this.setCursor("default");

        // 标记编辑状态
        this.object.setEditing(true);
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return "modifier";
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // 恢复
        this.cinderella.getSceneLayersAdapter().enableAll();

        // 清除编辑态
        this.object.setEditing(false);

        // 恢复相机方位
        this.orbit_camera_stand_controller.toOrientation(this.orbit_orientation);

        // 销毁操作
        this.disposeManipulator();

        // 销毁回滚日历
        this.historical_recorder.distory();

        // 销毁历史记录
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirModifierHistoricRecorder
        } = Chameleon;
        AbattoirModifierHistoricRecorder.dispose();
    }
}
