/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import Position              from '@common/misc/compute-visible-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowMore              from './v-more';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-editor';

/**
 * 菜单项
 */
export default class BizNavToolbarEditor extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 按键监控
     */
    #keyboard_watcher;

    /**
     * 宿主
     */
    #host;

    /**
     * 渲染器
     */
    #cinderella;

    /**
     * 选择模式
     */
    #select_mode = 'v';

    /**
     * 元素
     */
    #switcher_container_topo;
    #switcher_container_topo_select_v;
    #switcher_container_topo_select_e;
    #switcher_container_topo_select_f;

    #switcher_container_oper;
    #switcher_container_oper_pointer;
    #switcher_container_oper_extrude_vertex;
    #switcher_container_oper_extrude;
    #switcher_container_oper_inset;
    #switcher_container_oper_circumcidere;
    #switcher_container_oper_bevel;
    #switcher_container_oper_linkup;

    /**
     * 元素按钮
     */
    #btn_more;

    /**
     * 键盘事件
     */
    #on_keyup = event => this.#onKeyUp(event);

    /**
     * 获取选择模式
     */
    get select_mode() {
        return this.#select_mode;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} host 
     */
    constructor(coordinator, host) {
        super(tagName);
        this.#coordinator      = coordinator;
        this.#cinderella       = coordinator.cinderella;
        this.#keyboard_watcher = this.#cinderella.getKeyboardWatcher();
        this.#host             = host;
        this.createContentFromTpl(tpl);
        this.#updateOperStatus();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#switcher_container_topo                = this.getChild('#topo');
        this.#switcher_container_topo_select_v       = this.getChild('#p');
        this.#switcher_container_topo_select_e       = this.getChild('#e');
        this.#switcher_container_topo_select_f       = this.getChild('#f');
        this.#switcher_container_oper                = this.getChild('#oper');
        this.#switcher_container_oper_pointer        = this.getChild('#pointer');
        this.#switcher_container_oper_extrude_vertex = this.getChild('#extrude-vertex');
        this.#switcher_container_oper_extrude        = this.getChild('#extrude');
        this.#switcher_container_oper_inset          = this.getChild('#inset');
        this.#switcher_container_oper_circumcidere   = this.getChild('#circumcidere');
        this.#switcher_container_oper_bevel          = this.getChild('#bevel');
        this.#switcher_container_oper_linkup         = this.getChild('#linkup');
        this.#btn_more                               = this.getChild('#more');
        this.#switcher_container_topo.addEventListener('changed', event => {
            this.#onSwitcherTopoChanged(event);
        });
        this.#switcher_container_oper.addEventListener('changed', event => {
            this.#onSwitcherOperChanged(event);
        });
        this.#btn_more.addEventListener('click', event => this.#onClickMore(event));
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        this.#keyboard_watcher.addEventListener('keyup', this.#on_keyup);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#keyboard_watcher.removeEventListener('keyup', this.#on_keyup);
    }

    /**
     * 
     * 设置选择的模式
     * 
     * v / e / f
     * 
     * @param {String} mode 
     * @param {*} send_command 
     */
    setSelectMode(mode, send_command = false) {
        if (!isString(mode) || this.#select_mode == mode) {
            return;
        }

        switch (mode) {
        case 'v':
            this.#switcher_container_topo.select(this.#switcher_container_topo_select_v);
            break;

        case 'e':
            this.#switcher_container_topo.select(this.#switcher_container_topo_select_e);
            break;

        case 'f':
            this.#switcher_container_topo.select(this.#switcher_container_topo_select_f);
            break;

        default:
            return;
        }

        // 记录旧的
        const old_select_mode = this.#select_mode;

        // 记录
        this.#select_mode = mode;

        // 调整
        this.#updateOperStatus(send_command);

        // 发送信号
        if (send_command) {
            this.#coordinator.sendCommandToEc({
                cls : 'topo',
                old_select_mode,
                type: this.#select_mode,  // v e f
            });
        }
    }

    /**
     * 重置状态
     */
    reset() {
        this.resetSwitcherSelectedStatus();
    }

    /**
     * 重置状态, topo 选择状态
     */
    resetSwitcherSelectedStatus() {
        this.#switcher_container_oper.select(this.#switcher_container_oper_pointer);
    }

    /**
     * 
     * 由于选择模式的变化
     * 
     * @param {*} send_command 
     */
    #updateOperStatus(send_command = false) {
        // 重置
        this.resetSwitcherSelectedStatus();

        // 发送命令
        if (send_command) {
            this.#coordinator.sendCommandToEc({
                cls : 'oper',
                type: 'none',
            });
        }

        // 根据选择模式进行调整
        switch (this.#select_mode) {
        case 'v':
            this.#switcher_container_oper_extrude_vertex.setEnable(true );
            this.#switcher_container_oper_extrude       .setEnable(false);
            this.#switcher_container_oper_inset         .setEnable(false);
            this.#switcher_container_oper_circumcidere  .setEnable(false);
            this.#switcher_container_oper_bevel         .setEnable(false);
            this.#switcher_container_oper_linkup        .setEnable(true );
            break;

        case 'e':
            this.#switcher_container_oper_extrude_vertex.setEnable(false);
            this.#switcher_container_oper_extrude       .setEnable(false);
            this.#switcher_container_oper_inset         .setEnable(false);
            this.#switcher_container_oper_circumcidere  .setEnable(true );
            this.#switcher_container_oper_bevel         .setEnable(true );
            this.#switcher_container_oper_linkup        .setEnable(true );
            break;

        case 'f':
            this.#switcher_container_oper_extrude_vertex.setEnable(false);
            this.#switcher_container_oper_extrude       .setEnable(true );
            this.#switcher_container_oper_inset         .setEnable(true );
            this.#switcher_container_oper_circumcidere  .setEnable(false);
            this.#switcher_container_oper_bevel         .setEnable(false);
            this.#switcher_container_oper_linkup        .setEnable(false);
            break;
        }
    }

    /**
     * 
     * switcher 变化
     * 
     * @param {*} event 
     */
    #onSwitcherTopoChanged(event) {
        const token = event.token;
        if (!isString(token) || token.length == 0) {
            return;
        }
        this.setSelectMode(token, true);
    }

    /**
     * 
     * switcher 变化
     * 
     * @param {*} event 
     */
    #onSwitcherOperChanged(event) {
        const token = event.token;
        if (!isString(token) || token.length == 0) {
            return;
        }

        //
        // 发送信号
        //
        // type :
        //      extrusion           // 内插面
        //      circumcidere        // 环切
        //      edge-slide          // 边滑动
        //      bevel               // 倒角
        //
        this.#coordinator.sendCommandToEc({
            cls : 'oper',
            type: token,
        });
    }

    /**
     * 
     * 按下更多按钮
     * 
     * @param {*} event 
     */
    #onClickMore(event) {
        ShowMore(this.#coordinator, this.#host, this.#select_mode, this.#btn_more);
    }

    /**
     * 
     * 键盘按键弹起
     * 
     * @param {*} event 
     */
    #onKeyUp(event) {
        switch (event.key) {
        case '1':
            this.setSelectMode('v');
            break;

        case '2':
            this.setSelectMode('e');
            break;

        case '3':
            this.setSelectMode('f');
            break;

        case 'Escape':
            this.resetSwitcherSelectedStatus(); // 恢复默认的修改器
            break;
        }
    }

    /**
     * 
     * 在指定的位置显示菜单
     * 
     * @param {*} x 
     * @param {*} y 
     */
    showMore(x, y) {
        const menu = ShowMore(this.#coordinator, this.#host, this.#select_mode);
        const w = document.body.clientWidth;
        const h = document.body.clientHeight;
        x = x || 0;
        y = y || 0;
        Position.ComputeVisiblePosition(menu, x, y, w, h);
    }
}

CustomElementRegister(tagName, BizNavToolbarEditor);
