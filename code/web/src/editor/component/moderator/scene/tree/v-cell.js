/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isString              from 'lodash/isString';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import IconSetter            from '../icon';
import Tree                  from './v';
import TreeCollapsible       from './v-collapsible';
import NameInput             from './v-cell-name-input';
import CellDropMenu          from './v-cell-menu';
import Constants             from './constants';
import SceneBarContainer     from './v-cell-scene-bar-container';
import Html                  from './v-cell-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-scene-tree-cell';

/**
 * 常量
 */
const indent_offset = 18;

/**
 * Cell
 */
export default class TreeCell extends Element {
    /**
     * 共享一下
     */
    #context;

    /**
     * 协调器
     */
    #coordinator;
    #coordinator_selected_container;

    /**
     * 元素
     */
    #container;

    /**
     * 是不是代表场景
     */
    #is_scene_node = false;

    /**
     * 元素
     */
    #left_padding;                  // 用来模拟tree的深度

    /**
     * 元素
     */
    #content;
    #operator;
    #collapsible;                   // 是否折叠
    #icon;                          // 显示类型ICON
    #title;                         // 显示名称
    #visible;                       // 可视按钮
    #anchor;                        // 锚点
    #line_top;                      // 顶部线
    #selected_dot;                  // 选择点
    #external_import;               // 是否是外部导入
    #line_bottom;                   // 底部线

    /**
     * scene bar
     */
    #scene_bar;

    /**
     * 改名Input
     */
    #rename_input;

    /**
     * 索引
     */
    #index = -1;

    /**
     * data, 防止出现冗余的对Dom的操作
     */
    #indent = 0;                    // 缩进
    #name = '';                     // 名称
    #uuid = '';                     // 元素的UUID
    #is_container;                  // 是不是有容器
    #folded;                        // 是否折叠
    #icon_type;                     // Icon类型
    #node_visible;                  // 元素的可见性

    /**
     * node弱引用
     */
    #weakref_node;

    /**
     * 用户定义数据
     */
    #user_data = {};

    /**
     * 数据
     */
    #last_pointer_x = 0;
    #last_pointer_y = 0;
    #offset_x = 0;
    #offset_y = 0;

    /**
     * 右击菜单
     */
    #drop_menu;

    /**
     * 标记是不是被拖动
     */
    #dragging = false;
    #dragging_related_cell;

    /**
     * 线的状态
     */
    #line_status; // up bottom

    /**
     * 获取
     */
    get is_scene_node() {
        return this.#is_scene_node;
    }

    /**
     * 获取
     */
    get dragging() {
        return this.#dragging;
    }

    /**
     * 获取
     */
    get dragging_related_cell() {
        return this.#dragging_related_cell;
    }

    /**
     * 是否容器
     */
    get is_container() {
        return this.#is_container;
    }

    /**
     * 获取自定义数据
     */
    get user_data() {
        return this.#user_data;
    }

    /**
     * 获取状态回调
     */
    get onfoldedstatuschanged() {
        return this.#collapsible.onfoldedstatuschanged;
    }

    /**
     * 设置状态回调
     */
    set onfoldedstatuschanged(callback) {
        this.#collapsible.onstatuschanged = callback;
    }

    /**
     * 可见性
     */
    get onvisiblechanged() {
        return this.#visible.onchanged;
    }

    /**
     * 可见性
     */
    set onvisiblechanged(callback) {
        this.#visible.onchanged = callback;
    }

    /**
     * 获取唯一
     */
    get uuid() {
        return this.#uuid;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} context 
     * @param {*} coordinator 
     */
    constructor(context, coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.#coordinator_selected_container = coordinator.selected_container;
        this.#context = context;
        this.createContentFromTpl(tpl);
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container       = this.getChild('#container');
        this.#left_padding    = this.getChild('#left-padding');
        this.#operator        = this.getChild('#operator');
        this.#content         = this.getChild('#content');
        this.#collapsible     = this.getChild('#collapsible');
        this.#icon            = this.getChild('#icon');
        this.#title           = this.getChild('#name');
        this.#anchor          = this.getChild('#anchor');
        this.#visible         = this.getChild('#visible');
        this.#line_top        = this.getChild('#line-top');
        this.#selected_dot    = this.getChild('#is-selected');
        this.#external_import = this.getChild('#is-external-import');
        this.#line_bottom     = this.getChild('#line-bottom');

        // 自己点击事件
        this.#container.onclick    = (event) => this.#onClick(event);
        this.#container.ondblclick = (event) => this.#onDbClick(event);
        this.#title.ondblclick     = (event) => this.#onTitleDbClick(event);

        // 折叠按钮
        this.#collapsible.addEventListener('changed', (event) => {
            event.stopPropagation();
            this.#onCollapsibleChanged(event);
        });

        // 锚点点击
        this.#anchor.onclick = (event) => {
            event.stopPropagation();
            if (this.#context && this.#context.maintainer_coordinator) {
                this.#context.maintainer_coordinator.onCellAnchorClick(this);
            }
        };

        // 可视按钮 
        this.#visible.addEventListener('changed', (event) => {
            event.stopPropagation();
            this.#onVisibleSwitcherChanged(event);
        });
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * 
     * 是否允许右击菜单
     * 
     * @returns 
     */
    isAllowMenu() {
        if (!this.#context) {
            return true;
        } else {
            this.#context.update();
            return !this.#context.forbidden_menu;
        }
    }

    /**
     * 
     * 克隆自己，并移除ID
     * 
     * @param {boolean} erase_id 
     */
    cloneDeep() {
        const cell = new TreeCell(this.#context, this.#coordinator);
        cell.#title.textContent = this.#name;
        cell.#title.uuid = this.#uuid;
        cell.#weakref_node = this.getRefObject().getWeakRef();
        cell.setAttr_IconType(this.#icon_type);
        cell.setAttr_Container(this.#is_container);
        cell.setAttr_Folded(this.#folded);
        cell.setAttr_IconVisible(this.#node_visible);
        return cell;
    }

    /**
     * 创建并设置成拖动
     */
    cloneDeepAndMakeDragges() {
        const cell = this.cloneDeep();
        cell.#dragging = true;
        cell.#dragging_related_cell = this;
        cell.style.width = `${this.clientWidth}px`;
        cell.setAttribute('dragging', 'true');
        return cell;
    }

    /**
     * 
     * 显示头部的线
     * 
     * @param {boolean} show 
     */
    setShowLineTop(show) {
        if (show) {
            if (this.#line_status == 'top') {
                return;
            } else {
                this.#line_status = 'top'
            }
            this.#line_top.style.visibility = 'visible';
            this.#line_bottom.style.visibility = 'hidden';
        } else {
            this.setHideLine();
        }
    }

    /**
     * 
     * 显示底部的线
     * 
     * @param {boolean} show 
     */
    setShowLineBottom(show) {
        if (show) {
            if (this.#line_status == 'bottom') {
                return;
            } else {
                this.#line_status = 'bottom'
            }
            this.#line_bottom.style.visibility = 'visible';
            this.#line_top.style.visibility = 'hidden';
        } else {
            this.setHideLine();
        }
    }

    /**
     * 隐藏上下的线
     */
    setHideLine() {
        if (!this.#line_status) {
            return;
        } else {
            this.#line_status = undefined;
            this.#line_top.style.visibility = 'hidden';
            this.#line_bottom.style.visibility = 'hidden';
        }
    }

    /**
     * 
     * 设置是不是 Scene Cell
     * 
     * @param {boolean} is_scene 
     */
    setAttr_Scene(is_scene) {
        if (true === is_scene) {
            if (undefined == this.#scene_bar) {
                this.#scene_bar = new SceneBarContainer();
                this.#operator.insertBefore(this.#scene_bar, this.#anchor);
            }
            this.#is_scene_node = true;
        } else if (this.#scene_bar) {
            this.#scene_bar.remove();
            this.#scene_bar = undefined;
            this.#is_scene_node = false;
        }
    }

    /**
     * 
     * 设置Index
     * 
     * @param {Number} index 
     */
    setAttr_Index(index = -1) {
        if (index % 2 == 0) {
            this.#operator.classList.add('lightness');
            this.#operator.classList.remove('darken');
        } else {
            this.#operator.classList.remove('lightness');
            this.#operator.classList.add('darken');
        }
        this.#index = index;
        this.style.transform = `translate3d(0, ${index * Constants.DefaultCellHeight}px, 0)`;
    }

    /**
     * 
     * 获取索引
     * 
     * @returns 
     */
    getIndex() {
        return this.#index;
    }

    /**
     * 
     * 设置是不是被选中
     * 
     * @param {Boolean} selected 
     */
    setAttr_Selected(selected) {
        if (selected) {
            this.#selected_dot.style.display = 'block';
        } else {
            this.#selected_dot.style.display = 'none';
        }
    }

    /**
     * 
     * 判断是不是被旋转
     * 
     * @returns
     */
    isSelected() {
        return this.#container.hasAttribute('selected');
    }

    /**
     * 
     * 设置有没有被命中
     * 
     * @param {Boolean} hit 
     */
    setHit(hit) {
        if (hit) {
            this.#container.setAttribute('hit', '');
        } else {
            this.#container.removeAttribute('hit');
        }
    }

    /**
     * 
     * 设置缩进像素
     * 
     * @param {Number} indent 
     */
    setIndent(indent) {
        if (this.#indent === indent) {
            return;
        }

        const offset = indent* indent_offset;
        this.#left_padding.style.width = `${offset}px`;
        this.#line_top.style.left = `${offset}px`;
        this.#line_bottom.style.left = `${offset}px`;
        this.#indent = indent;
    }

    /**
     * 
     * 设置Cell是不是有展开项目
     * 
     * @param {boolean} container 
     */
    setAttr_Container(container) {
        container = true == container;
        if (this.#is_container === container) {
            return;
        }

        this.#is_container = container;

        if (container) {
            this.#collapsible.style.visibility = 'visible';
        } else {
            this.#collapsible.style.visibility = 'hidden';
        }
    }

    /**
     * 
     * 判断当前的状态是不是折叠
     * 
     * @returns 
     */
    isFolded() {
        return this.#collapsible.isFolded();
    }

    /**
     * 
     * 设置折叠的状态
     * 
     * @param {Boolean} folded 
     */
    setAttr_Folded(folded) {
        folded = true === folded;
        if (this.#folded === folded) {
            return;
        }

        this.#folded = folded;
        this.#collapsible.setFolded(folded);

        // 修改 Threejs的元素的元素属性
        const ref = this.getRefObject();
        if (ref) {
            ref.setFolded(folded);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {String} type 
     */
    setAttr_IconType(type) {
        if (type !== this.#icon_type) {
            this.#icon_type = type;
            IconSetter(this.#icon, type);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {true} visible 
     */
    setAttr_IconVisible(visible) {
        visible = true === visible;
        if (this.#node_visible === visible) {
            return;
        }
        this.#node_visible = visible;
        this.#visible.setChecked(visible);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} show 
     */
    setAttr_ExternalImport(show) {
        if (show) {
            this.#external_import.style.display = 'block';
        } else {
            this.#external_import.style.display = 'none';
        }
    }

    /**
     * 
     * 显示改名的输入框
     * 
     * @param {boolean} show 
     */
    setShowRenameInput(show) {
        if (true === show) {
            // 发送冒泡事件
            this.bubblesEvent({
                command: 'cell.rename.begin',
                cell   : this
            });

            // 调整界面
            //
            // tips:
            //      要先隐藏title在显示input
            //      如果同时显示，有可能会出现内容大于父容器的情况，避免出现scroll事件，刷新界面
            //
            this.#title.style.display = 'none';
            if (undefined == this.#rename_input) {
                this.#rename_input = new NameInput();
                this.#rename_input.addEventListener('commit', (event) => {
                    this.#onRenameInputCommit(event)
                });
                this.#rename_input.value = this.#title.textContent;
                this.#rename_input.selectAll();
                this.#content.appendChild(this.#rename_input);
            }
            this.#rename_input.setFocus();
        } else {
            if (this.#rename_input) {
                this.#rename_input.remove();
                this.#rename_input = undefined;
            }
            this.#title.style.display = 'block';
        }
    }

    /**
     * 把当前的Cell和Object从场景中移除
     */
    removeFromScene() {
        Animation.Try(this, {
            opacity   : [1, 0],
            duration  : 300,
            easing    : 'easeOutCubic',
            onComplete: () => {

                // 把 ThreeJs Object 从场景中移除
                const ref = this.getRefObject();
                if (ref) {
                    ref.removeFromParent();
                }

                // 发送冒泡事件
                this.bubblesEvent({
                    command: 'cell.removed',
                    cell   : this
                });

                // 更新tree
                this.#context.maintainer_coordinator.markNeedUpdateTree(true);
                this.#coordinator.updateSelectedContainerIfHasSomethingDelete();
                this.#coordinator.renderNextFrame();
            }
        });
    }

    /**
     * 
     * 设置是不是灰色模式
     * 
     * @param {boolean} enable 
     */
    setAttr_GrayMode(enable) {
        if (true === enable) {
            this.#container.setAttribute('mode', 'gray');
        } else {
            this.#container.removeAttribute('mode');
        }
    }

    /**
     * 
     * 闪烁一下
     * 
     * @param {Number} defer             延迟时间
     * @param {Number} reside_time_ms    驻留时间
     */
    blink(defer = -1, reside_time_ms = 500) {
        if (defer < 0) {
            const blink_border = 'blink-border';
            this.#container.setAttribute(blink_border, 'true')
            setTimeout(() => {
                this.#container.removeAttribute(blink_border)
            }, reside_time_ms);
        } else {
            setTimeout(() => this.blink(-1, reside_time_ms), defer);
        }
    }

    /**
     * 
     * 下一帧闪烁
     * 
     * @param {Number} reside_time_ms   驻留时间
     */
    blinkNextFrame(reside_time_ms = 500) {
        requestAnimationFrame(() => this.blink(-1, reside_time_ms));
    }

    /**
     * 
     * 设置 Hover 状态
     * 
     * @param {boolean} hover 
     */
    setHover(hover) {
        if (hover) {
            this.#container.setAttribute('hovering', 'true')
        } else {
            this.#container.setAttribute('hovering', 'false')
        }
    }

    /**
     * 
     * 获取引用的对象
     * 
     * @returns 
     */
    getRefObject() {
        if (this.#weakref_node) {
            return this.#weakref_node.deref();
        }
        return undefined;
    }

    /**
     * 
     * 获取自定义数据
     * 
     * @returns 
     */
    getUserData() {
        return this.#user_data;
    }

    /**
     * 
     * 获取节点的名称
     * 
     * @returns 
     */
    getObjectName() {
        return this.#name;
    }

    /**
     * 
     * 获取节点的UUID
     * 
     * @returns 
     */
    getObjectUUID() {
        return this.#uuid;
    }

    /**
     * 
     * 判断点是不是在区域里面，xy 都是ClientX ClientY
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    isPointIn(x, y) {
        const client_rect = this.getBoundingClientRect();
        if (x < client_rect.left  || 
            x > client_rect.right ||
            y < client_rect.top   ||
            y > client_rect.bottom) {
            return false;
        }
        return true;
    }

    /**
     * 重置
     * 
     * 这个函数比较特殊，用处单一，在进入cell处理状态情况，重置状态
     * 比如处于重命名状态，然后刷新Tree。会重置这个状态
     * 
     */
    resetAttitude() {
        this.setShowRenameInput(false);
    }

    /**
     * 重置全部数据
     */
    reset() {
        this.resetUserData();
        this.resetStatus();
        this.setHideLine();
    }

    /**
     * 重置数据
     */
    resetUserData() {
        this.#user_data = {};
    }

    /**
     * 重置全部的装置
     */
    resetStatus() {
        this.style.opacity = 1;
        this.#indent       = 0;
        this.#name         = '';
        this.#uuid         = '';
        this.#is_container = undefined;
        this.#folded       = undefined;
        this.#icon_type    = undefined;
        this.#weakref_node = undefined;
        
        this.setAttr_IconVisible(true);
        this.setAttr_Selected(false);
        this.setHit(false);
        this.setIndent(0);
        this.setAttr_Container(false);
        this.setHideLine();
        this.setTranslucency(false);

        // 如果是 scene bar
        if (this.#scene_bar) {
            this.#scene_bar.remove();
            this.#scene_bar = undefined;
        }

        // 销毁菜单
        if (this.#drop_menu) {
            this.#drop_menu.dismiss();
        }
    }

    /**
     * 
     * 设置半透明显示
     * 
     * @param {boolean} enable 
     */
    setTranslucency(enable) {
        if (enable) {
            this.#container.setAttribute('translucency', 'true');
        } else {
            this.#container.setAttribute('translucency', 'false');
        }
    }

    /**
     * 
     * 动画渐变到透明
     * 
     * @param {Function} callback 
     */
    animationToTransparent(callback = undefined) {
        Animation.Try(
            this,
            {
                opacity: 0,
                duration: 200,
                easing: 'easeOutCubic',
                onComplete: () => {
                    if (isFunction(callback)) {
                        callback(this);
                    }
                }
            });
    }

    /**
     * 
     * 设置 data
     * 
     * @param {*} data 
     */
    setData(data) {
        if (!data) {
            return;
        }

        // object
        const object = data.object;

        // ========================================================================================
        // 三维元素
        // ========================================================================================
        this.#weakref_node = object.getWeakRef();
        this.setAttr_Scene(true === object.isScene);
        this.setAttr_GrayMode(!object.isVisible(true));

        // ========================================================================================
        // 缩进
        // ========================================================================================
        const indent = data.indent;
        this.setIndent(indent);

        // ========================================================================================
        // 名称
        // ========================================================================================
        const name = object.getNameOrTypeAsName();
        this.#title.textContent = name;
        this.#name = name;

        // ========================================================================================
        // UUID
        // ========================================================================================
        this.#uuid = object.uuid;

        // ========================================================================================
        // 类型
        // ========================================================================================
        const type = object.type;
        this.setAttr_IconType(type);

        // ========================================================================================
        // 是否是容器
        // ========================================================================================
        this.setAttr_Container(data.is_container);

        // ========================================================================================
        // 是否折叠
        // ========================================================================================
        this.setAttr_Folded(data.folded);

        // ========================================================================================
        // 可见性
        // ========================================================================================
        this.setAttr_IconVisible(object.isVisible(false));

        // ========================================================================================
        // 选中
        // ========================================================================================
        this.setAttr_Selected(this.#coordinator_selected_container.containerOf(object));

        // ========================================================================================
        // 外部导入
        // ========================================================================================
        this.setAttr_ExternalImport(object.isExternalImport());
    }

    /**
     * 
     * 接收到需要右击菜单
     * 
     * @param {*} event 
     * @returns 
     */
    onCustomizeMenu(event) {
        event.stopPropagation();
        if (!this.isAllowMenu()) {
            return true;
        }

        const x = event.clientX;
        const y = event.clientY;
        if (this.#is_scene_node) {
            if (this.#context && this.#context.maintainer_coordinator) {
                this.#context.maintainer_coordinator.onSceneCustomizeMenu(this, x, y);
            }
        } else {
            if (!this.#drop_menu) {
                this.#drop_menu = new CellDropMenu(this, token => this.#onMenu(token));
            }
            this.#drop_menu.show(x, y);
        }
        
        return true;
    }

    /**
     * 
     * 判断对应的三维元素的可见性
     * 
     * @returns 
     */
    isObjectVisible() {
        const ref = this.getRefObject();
        if (undefined == ref) {
            return false;
        }
        return true == ref.visible;
    }

    /**
     * 
     * 设置对象可见性
     * 
     * @param {boolean} visible 
     * @returns 
     */
    setObjectVisible(visible) {
        const ref = this.getRefObject();
        if (undefined == ref) {
            return false;
        }
        
        // 防止冗余操作
        visible = true === visible;
        if (ref.visible == visible) {
            return false;
        }

        // 调整参数
        ref.visible = visible;
        this.setAttr_IconVisible(visible);
        this.renderNextFrame();

        // 冒泡事件
        this.bubblesEvent({
            command: 'cell.visible.changed',
            visible: visible,
            cell   : this
        });

        return true;
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClick(event) {
        event.stopPropagation();
        if (this.#context && this.#context.maintainer_coordinator) {
            this.#context.maintainer_coordinator.onCellClick(this);
        }
    }

    /**
     * 
     * 双击
     * 
     * @param {*} event 
     */
    #onDbClick(event) {
        event.stopPropagation();
    }

    /**
     * 
     * 双击名称
     * 
     * @param {*} event 
     */
    #onTitleDbClick(event) {
        event.stopPropagation();
        if (!this.#context.forbidden_rename) {
            this.setShowRenameInput(true);
        }
    }

    /**
     * 
     * 折叠按钮发生变化
     * 
     * @param {*} event 
     */
    #onCollapsibleChanged(event) {
        const folded = true === event.folded;
        if (this.#folded === folded) {
            return;
        } else {
            this.#folded = folded;
        }

        // 事件分发
        this.bubblesEvent({
            command: 'folded.changed',
            folded : this.#folded,
            cell   : this
        });

        // 修改 Threejs的元素的元素属性
        const ref = this.getRefObject();
        if (ref) {
            ref.setFolded(this.#folded);
        }

        // 刷新树
        this.#context.maintainer_coordinator.markNeedUpdateTree(true);
    }

    /**
     * 
     * 可见性的改变
     * 
     * @param {*} event 
     */
    #onVisibleSwitcherChanged(event) {
        this.setObjectVisible(event.checked);
    }

    /**
     * 
     * 接收到菜单事件
     * 
     * @param {string} token 
     */
    #onMenu(token) {
        const ref = this.getRefObject();
        if (!ref) {
            return;
        }

        switch (token) {
        case 'select':
            break;

        case 'rename':
            this.setShowRenameInput(true);
            break;

        case 'remove':
            this.removeFromScene();
            break;

        case 'duplicate':
            break;

        case 'reset.position':
            ref.resetTranslate();
            this.renderNextFrame();
            break;

        case 'reset.scale':
            ref.resetScale();
            this.renderNextFrame();
            break;

        case 'reset.rotation':
            ref.resetRotation();
            this.renderNextFrame();
            break;

        case 'reset.transform':
            ref.resetTransform();
            this.renderNextFrame();
            break;
        
        case 'show-hide':
            this.setObjectVisible(!this.isObjectVisible());
            this.renderNextFrame();
            break;

        case 'create.folder':
            {
                const object = this.getRefObject();
                if (object && object.createFolder("tree-view")) {
                    this.bubblesEvent({
                        command: 'create.folder',
                        cell   : this
                    });
                }
            }
            break;
        }
    }

    /**
     * 
     * 改名输入框确认提交
     * 
     * @param {*} event 
     */
    #onRenameInputCommit(event) {

        // 退出改名状态
        this.setShowRenameInput(false);

        // 获取新名字，剔除不合法的值
        let new_name = event.value;
        if (!isString(new_name)) {
            return;
        }

        new_name = new_name.trim();
        if ('' === new_name) {
            return;
        }

        // 获取对应的元素
        const ref = this.getRefObject();
        if (ref) {
            ref.name = new_name;
        }
        
        // 冒泡事件
        this.bubblesEvent({
            command: 'cell.name.changed',
            name   : new_name,
            cell   : this
        });

        // 设置到title
        this.#title.textContent = new_name;
    }

    /**
     * 在下一帧渲染
     */
    renderNextFrame() {
        this.#context.renderNextFrame();
    }
}

CustomElementRegister(tagName, TreeCell);
