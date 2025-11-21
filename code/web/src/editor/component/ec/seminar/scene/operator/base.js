/* eslint-disable no-unused-vars */

import isFunction    from 'lodash/isFunction';
import isNumber      from 'lodash/isNumber';
import isUndefined   from 'lodash/isUndefined';
import XThree        from '@xthree/basic';
import GlobalScope   from '@common/global-scope';
import DeferDestory  from '@common/misc/defer-destory';
import PlaneDetector from '../plane-detector';

/**
 * 用来分配唯一的ID
 */
let __unique_id__ = 0;

/**
 * 基类
 */
export default class Base {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 修改控制器
     */
    #ec;

    /**
     * 辅助器
     */
    #assistor;

    /**
     * Wasm内核
     */
    #chameleon = GlobalScope.chameleon;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * abattoir
     */
    #abattoir;

    /**
     * 渲染器
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * orbit
     */
    #orbit;

    /**
     * 场景
     */
    #scene;

    /**
     * 辅助场景
     */
    #collaborator;

    /**
     * 窗体
     */
    #setting_panel_container;

    /**
     * 面侦
     */
    #plane_detector;

    /**
     * 临时
     */
    #vec3_0 = new XThree.Vector3();
    #vec3_1 = new XThree.Vector3();

    /**
     * mesh
     */
    #mesh;

    /**
     * 最后销毁
     */
    #defer_destory = new DeferDestory();

    /**
     * 销毁后回滚的标记
     */
    #rollback_marker;

    /**
     * 获取唯一的ID
     */
    get unique_id() {
        __unique_id__++;
        return __unique_id__;
    }

    /**
     * 获取键盘监控器
     */
    get keyboard_watcher() {
        return this.#coordinator.keyboard_watcher;
    }

    /**
     * 访问器
     */
    get ec() {
        return this.#ec;
    }

    /**
     * 历史
     */
    get historical_recorder() {
        return this.#ec.historical_recorder;
    }

    /**
     * 访问器
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 访问器
     */
    get chameleon() {
        return this.#chameleon;
    }

    /**
     * 访问器
     */
    get selected_container() {
        return this.#selected_container;
    }

    /**
     * 获取中间的显示区域
     */
    get abattoir() {
        return this.#abattoir;
    }

    /**
     * 访问器
     */
    get cinderella() {
        return this.#cinderella;
    }

    /**
     * 访问器
     */
    get cinderella_conf_context() {
        return this.#cinderella_conf_context;
    }

    /**
     * orbit
     */
    get orbit() {
        return this.#orbit;
    }

    /**
     * 场景
     */
    get scene() {
        return this.#scene;
    }

    /**
     * 辅助场景
     */
    get collaborator() {
        return this.#collaborator;
    }

    /**
     * 辅助
     */
    get assistor() {
        return this.#assistor;
    }

    /**
     * 获取设置窗体
     */
    get setting_panel_container() {
        if (!this.#setting_panel_container) {
            this.#setting_panel_container = this.#coordinator.moderator.scene.showModal();
        }
        return this.#setting_panel_container;
    }

    /**
     * 获取面侦测
     */
    get plane_detector() {
        return this.#plane_detector;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} ec 
     * @param {*} coordinator 
     * @param {*} assistor 
     */
    constructor(ec, coordinator, assistor) {
        this.#ec                      = ec;
        this.#selected_container      = coordinator.selected_container;
        this.#coordinator             = coordinator;
        this.#assistor                = assistor;
        this.#abattoir                = coordinator.abattoir;
        this.#cinderella              = coordinator.cinderella;
        this.#cinderella_conf_context = this.#cinderella.getConfContext();
        this.#orbit                   = this.#cinderella.getOrbit();
        this.#scene                   = this.#cinderella.getScene();
        this.#collaborator            = this.#scene.getCollaborator();
        this.#plane_detector          = new PlaneDetector(coordinator);
        this.#plane_detector.addEventListener('changed', data => this.onPlaneDetectorChanged(data.position, data.normal));
        this.#plane_detector.addEventListener('finish' , ()   => this.onPlaneDetectorFinish());
    }

    /**
     * 启动
     */
    start() { }

    /**
     * 恢复到初始值
     */
    resetToDefault() { }

    /**
     * 
     * 延迟销毁
     * 
     * @param {*} callback 
     */
    deferDestory(callback) {
        this.#defer_destory.add(callback);
    }

    /**
     * 
     * 设置销毁的回滚
     * 
     * @param {*} marker 
     */
    setDisposeRollbackMarker(marker) {
        this.#rollback_marker = marker;
    }

    /**
     * 执行退出
     */
    exit() {
        this.dismiss();
    }

    /**
     * 下一帧重绘
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 
     * 更新变换组件
     * 
     */
    updateTransformer() {
        this.#coordinator.updateTransformer();
    }

    /**
     * 重置nav的旋转
     */
    resetNavToolbar() {
        if (!this.#coordinator) {
            return;
        }

        const nav = this.#coordinator.nav;
        if (!nav) {
            return;
        }

        const toolbar = nav.getToolbarContent();
        if (toolbar && isFunction(toolbar.reset)) {
            toolbar.reset();
        }
    }

    /**
     * 
     * boolean 
     * 
     * @param {*} enable 
     */
    enablePlaneDetector(enable) {
        this.#plane_detector.setEnable(enable);
    }

    /**
     * 
     * 
     * 
     * @param {*} enable 
     */
    enablePlaneDetectorDisposeWhenClick(enable) {
        this.#plane_detector.setDisposeWhenClick(enable);
    }

    /**
     * 
     * 收到面侦测的数据
     * 
     * @param {*} position 
     * @param {*} normal 
     */
    onPlaneDetectorChanged(position, normal) {
        if (this.#mesh && !isUndefined(position) && !isUndefined(normal)) {
            this.#mesh.setPositionOrientation(position, normal);
        }
    }

    /**
     * 面侦测结束
     * 
     * 只有调用了 enablePlaneDetectorDisposeWhenClick，才会回调
     */
    onPlaneDetectorFinish() {
        if (this.#mesh) {
            this.#mesh.pickignore = undefined;
        }
        this.setEnableSelectorAndSelectorTransformer(true);
    }

    /**
     * 
     * 设置开启或者关闭选择器
     * 
     * @param {*} enable 
     */
    setEnableSelectorAndSelectorTransformer(enable) {
        if (this.#ec) {
            this.#ec.setEnableSelectorAndSelectorTransformer(enable);
        }
    }

    /**
     * 
     * 把元素设置到 orbit 
     * 
     * @param {*} object 
     */
    setObjectPositionAtOrbitTarget(object) {
        if (object) {
            this.#orbit.getTarget(this.#vec3_0);
            object.position.copy (this.#vec3_0);
        }
    }

    /**
     * 
     * 因为Mesh开启面侦测
     * 
     * @param {*} mesh 
     */
    startPlaneDetectorCauseofMesh(mesh, start) {
        if (start) {
            this.setEnableSelectorAndSelectorTransformer(false);
            this.enablePlaneDetector(true);
            this.enablePlaneDetectorDisposeWhenClick(true);
            this.#mesh = mesh;
            this.#mesh.pickignore = true;
        } else {
            this.setEnableSelectorAndSelectorTransformer(true);
            this.enablePlaneDetector(false);
            this.enablePlaneDetectorDisposeWhenClick(false);
            this.#mesh = mesh;
            this.#mesh.pickignore = false;
        }
    }

    /**
     * 销毁设置窗口
     */
    disposeSettingWindow() {
        if (this.#setting_panel_container) {
            this.#setting_panel_container.dismiss(true);
            this.#setting_panel_container = undefined;
        }
    }

    /**
     * 通知 assistor 销毁自己
     */
    dismiss() {
        this.#assistor.disposeManipulator();
        this.resetNavToolbar();
    }

    /**
     * 销毁函数
     */
    dispose() {
        this.disposeSettingWindow();
        this.setEnableSelectorAndSelectorTransformer(true);

        if (this.#plane_detector) {
            this.#plane_detector.dispose();
        }

        this.#defer_destory.dismiss();
        if (isNumber(this.#rollback_marker)) {
            this.ec.historical_recorder.distoryUtilSize(this.#rollback_marker);
        }
    }
}
