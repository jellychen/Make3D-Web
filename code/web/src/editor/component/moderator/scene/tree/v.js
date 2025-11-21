/* eslint-disable no-unused-vars */

import isFunction                from 'lodash/isFunction';
import Animation                 from '@common/misc/animation';
import CallmeNextframe           from '@common/misc/callme-nextframe';
import CustomElementRegister     from '@ux/base/custom-element-register';
import Element                   from '@ux/base/element';
import ElementDomCreator         from '@ux/base/element-dom-creator';
import Constants                 from './constants';
import TreeCell                  from './v-cell';
import ScrollBar_V               from './scroll-v';
import AdapterBuilder            from './adapter-builder';
import Adapter                   from './adapter';
import VirtualScroller           from './v-virtual-scroller';
import AutoScroller              from './v-auto-scroller';
import Context                   from './context';
import Html                      from './v-tpl.html';
import TreeMaintainerCoordinator from './v-maintainer-coordinator';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-scene-tree';

/**
 * Options for the observer (which mutations to observe)
 */
const __mutation_config__ = { attributes: true, childList: true, subtree: true };

/**
 * 场景树
 */
export default class Tree extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 用来维护协调者
     */
    #maintainer_coordinator = new TreeMaintainerCoordinator(this);

    /**
     * 共享数据
     */
    #context = new Context(this, this.#maintainer_coordinator);

    /**
     * 元素
     */
    #container;
    #scroll_content_container;
    #content_container;

    /**
     * 场景
     */
    #scene;

    /**
     * 数据适配器
     */
    #adapter;
    #adapter_builder = new AdapterBuilder();

    /**
     * 正在等待更新 scene adapter 更新
     */
    #need_update = false;
    #need_rebuild_adapter = false;

    /**
     * 虚拟的列表
     */
    #virtual_scroller;
    #auto_scroller;

    /**
     * 滚动条
     */
    #scrollbar_v;

    /**
     * 监听尺寸发生变化
     */
    #observer_resize;
    #observer_mutation;

    /**
     * 事件回调
     */
    #on_scroll           = (event) => this.#onScroll(event);
    #on_scroll_end       = (evert) => this.#onScrollEnd(evert);
    #scrollbar_on_scroll = (event) => this.#onScrollbarScroll(event);
    #on_pointer_down     = (event) => this.#onPointerDown(event);
    #on_pointer_move     = (event) => this.#onPointerMove(event);
    #on_pointer_up       = (event) => this.#onPointerUp(event);
    #on_pointer_cancel   = (event) => this.#onPointerCancel(event);
    #on_pointer_leave    = (event) => this.#onPointerLeave(event);

    /**
     * 场景发生变化
     */
    #on_scene_changed          = (event) => this.#onSceneChanged(event);
    #on_scene_selected_changed = (event) => this.#onSceneSelectedChanged(event);

    /**
     * 拖出的Cell和相关的数据
     */
    #dragged_cell;                      // 构建出用来拖动的Cell
    #dragged_cell_start_x   = 0;        // 拖出的位置
    #dragged_cell_start_y   = 0;        // 拖出的位置
    #dragged_offset_x       = 0;        // 鼠标位置距离Cell左侧的位置
    #dragged_offset_y       = 0;        // 鼠标位置距离Cell顶侧的位置
    #dragged_has_setcapture = false;

    /**
     * 记录上一次hit的Cell
     */
    #current_hit_cell;
    #current_hit_cell_status;  // before / after / inside

    /**
     * 下一帧回调
     */
    #callme_nextframe = new CallmeNextframe();

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 获取
     */
    get maintainer_coordinator() {
        return this.#maintainer_coordinator;
    }

    /**
     * 获取
     */
    get context() {
        return this.#context;
    }

    /**
     * 获取
     */
    get tree_virtual_scroller() {
        return this.#virtual_scroller;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.observerBubblesEvent();
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container                = this.getChild('#container');
        this.#scroll_content_container = this.getChild('#scroll-content-container');
        this.#content_container        = this.getChild('#content-container');
        this.#scrollbar_v              = this.getChild('#scrollbar-v');
        this.#virtual_scroller         = new VirtualScroller(this.#context,
                                                             this.#container,
                                                             this.#scroll_content_container,
                                                             this.#content_container);
        this.#auto_scroller            = new AutoScroller(this, this.#scroll_content_container);
        this.#callme_nextframe.callback = () => this.update();
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        
        // 监听父容器尺寸变化
        this.#observer_resize = new ResizeObserver(entries => {
            this.#onResize();
        });
        this.#observer_resize.observe(this);

        // 监听孩子的尺寸变化
        this.#observer_mutation = new MutationObserver(() => {
            this.#onContentSizeMaybeChanged();
        });
        this.#observer_mutation.observe(this.#scroll_content_container, __mutation_config__);

        // 事件监听
        this.#container.addEventListener('pointerdown',              this.#on_pointer_down);
        this.#scroll_content_container.addEventListener('scroll',    this.#on_scroll);
        this.#scroll_content_container.addEventListener('scrollend', this.#on_scroll_end);
        this.#scrollbar_v.addEventListener('scroll-offset-changed',  this.#scrollbar_on_scroll);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        
        if (this.#observer_resize) {
            this.#observer_resize.disconnect();
            this.#observer_resize = undefined;
        }

        if (this.#observer_mutation) {
            this.#observer_mutation.disconnect();
            this.#observer_mutation = undefined;
        }

        this.#scroll_content_container.removeEventListener('scroll',    this.#on_scroll);
        this.#scroll_content_container.removeEventListener('scrollend', this.#on_scroll_end);
        this.#scrollbar_v.removeEventListener('scroll-offset-changed',  this.#scrollbar_on_scroll);
        this.#virtual_scroller.dismiss();
        this.#auto_scroller.dismiss();
    }

    /**
     * 
     * 自定义菜单
     * 
     * @param {*} event 
     */
    onCustomizeMenu(event) {
        event.stopPropagation();
        if (!this.#isAllowMenu()) {
            return;
        }

        const x = event.clientX;
        const y = event.clientY;
        this.#maintainer_coordinator.onSceneCustomizeMenu(undefined, x, y);

        return true;
    }

    /**
     * 
     * 接收到冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        super.onRecvBubblesEvent(event);

        // 分发
        switch (event.detail.command) {
        case 'folded.changed':
            this.#onRecvBubblesEvent_FoldedChanged(event);
            break;

        case 'scene.collapse':
            this.#onRecvBubblesEvent_SceneCollapse(event);
            break;

        case 'scene.refresh':
            this.#onRecvBubblesEvent_SceneRefresh(event);
            break;

        case 'render.next.frame':
            this.renderNextFrame();
            break;

        case 'cell.rename.begin':
            this.#onRecvBubblesEvent_CellBeginRename(event);
            break;

        case 'cell.name.changed':
            this.#onRecvBubblesEvent_CellNameChanged(event);
            break;

        case 'cell.visible.changed':
            this.#onRecvBubblesEvent_CellVisibleChanged(event);
            this.#coordinator.updateTransformer();
            break;

        case 'create.folder':
            this.#onRecvBubblesEvent_CreateFolder(event);
            break;

        case 'cell.removed':
            this.#onRecvBubblesEvent_CellRemoved(event);
            this.#coordinator.updateTransformer();
            break;
        }
    }

    /**
     * 
     * 是否允许右击菜单
     * 
     * @returns 
     */
    #isAllowMenu() {
        if (!this.#context) {
            return true;
        } else {
            this.#context.update();
            return !this.#context.forbidden_menu;
        }
    }

    /**
     * 
     * 是否允许调整
     * 
     * @returns 
     */
    #isAllowAjustSort() {
        if (!this.#context) {
            return true;
        } else {
            this.#context.update();
            return !this.#context.forbidden_ajust_sort;
        }
    }

    /**
     * 
     * 接收到消息
     * 
     * @param {*} event 
     */
    #onRecvBubblesEvent_FoldedChanged(event) {
        let folded = event.detail.folded;
        let cell   = event.detail.cell;
        let index  = cell.getIndex();

        // 设置
        this.#adapter.setIndexedElementFolded(index, folded);

        // 折叠
        if (!folded) {
            let element = this.#adapter.getIndexedElement(index);
            let depth   = this.#adapter.getIndexedElementDepth(index);
            let builder = this.#adapter_builder;
            let adapter = builder.gen(element, false, depth);
            this.#adapter.insert(index, adapter, false);
            this.#need_update = true;
        } 
            
        // 展开
        else {
            this.#adapter.removeIndexedElementChildren(index);
            this.#need_update = true;
        }
    }

    /**
     * 
     * 接收冒泡消息
     * 
     * @param {*} event 
     */
    #onRecvBubblesEvent_SceneCollapse(event) {
        this.#scene.collapseAllChildren();
        this.#need_rebuild_adapter = true;
        this.#need_update = true;
        this.renderNextFrame();
        this.markNeedUpdateTree(true);
    }

    /**
     * 
     * 接收冒泡消息
     * 
     * @param {*} event 
     */
    #onRecvBubblesEvent_SceneRefresh(event) {
        this.#need_rebuild_adapter = true;
        this.#need_update = true;
        this.renderNextFrame();
    }

    /**
     * 
     * 接收冒泡事件
     * 
     * @param {*} event 
     */
    #onRecvBubblesEvent_CellBeginRename(event) {
        let cell = event.detail.cell;

        // 调整其他的Cell退出重命名状态
        let children = this.#content_container.childNodes;
        let children_count = children.length;
        for (let i = 0; i < children_count; ++i) {
            let child = children[i];
            if (child === cell) {
                continue;
            }

            if (!isFunction(child.setShowRenameInput)) {
                continue;
            }
            child.setShowRenameInput(false);
        }
    }

    /**
     * 
     * 接收冒泡事件
     * 
     * @param {*} event 
     */
    #onRecvBubblesEvent_CellNameChanged(event) {
        let cell  = event.detail.cell;
        let name  = event.detail.name;
        let index = cell.getIndex();
        this.#adapter.updateIndexedName(index, name);
    }

    /**
     * 
     * 接收冒泡事件
     * 
     * @param {*} event 
     */
    #onRecvBubblesEvent_CellVisibleChanged(event) {
        this.#need_update = true;
        this.renderNextFrame();
        this.markNeedUpdateTree(false);
    }

    /**
     * 
     * 接收冒泡事件
     * 
     * @param {*} event 
     */
    #onRecvBubblesEvent_CreateFolder(event) {
        this.#need_rebuild_adapter = true;
        this.#need_update = true;
        this.renderNextFrame();
        this.markNeedUpdateTree(true);
    }

    /**
     *
     * 接收冒泡事件
     *  
     * @param {*} event 
     */
    #onRecvBubblesEvent_CellRemoved(event) {
        this.#need_rebuild_adapter = true;
        this.#need_update = true;
        this.renderNextFrame();
        this.markNeedUpdateTree(true);
    }

    /**
     * 在下一帧渲染
     */
    renderNextFrame() {
        if (this.#coordinator) {
            this.#coordinator.renderNextFrame();
        }
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        if (this.#coordinator) {
            throw new Error("coordinator has set already");
        }
        this.#coordinator = coordinator;
        this.#maintainer_coordinator.setCoordinator(coordinator);
        this.#virtual_scroller.setCoordinator(coordinator);
        this.#coordinator.addEventListener('selected.changed', this.#on_scene_selected_changed);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} scene 
     */
    setScene(scene) {
        // 删除旧的时间监听
        if (this.#scene) {
            this.#scene.removeEventListener('scene-changed', this.#on_scene_changed);
            this.#scene = undefined;
        }

        this.#scene = scene;
        this.#adapter_builder.setScene(scene);

        // 添加监听
        if (this.#scene) {
            this.#scene.addEventListener('scene-changed', this.#on_scene_changed);
        }
    }

    /**
     * 
     * 场景可能发生了变化
     * 
     * @param {*} update 
     */
    rebuildDataAdapter() {
        if (this.#scene) {
            let builder = this.#adapter_builder;
            let adapter = builder.gen();
            this.#adapter = adapter;
            this.#virtual_scroller.setDataAdapter(adapter, false);
        } else {
            this.#adapter = [];
            this.#virtual_scroller.setDataAdapter([], false);
        }
        this.#need_rebuild_adapter = false;
    }

    /**
     * 
     * 设置数据适配器
     * 
     * @param {*} adapter 
     */
    setDataAdapter(adapter) {
        this.#adapter = adapter;
        this.#virtual_scroller.setDataAdapter(adapter);
    }

    /**
     * 
     * 标记
     * 
     * @param {*} scene_change 
     */
    markNeedUpdateTree(scene_change = false) {
        this.#need_update          = true;
        this.#need_rebuild_adapter = this.#need_rebuild_adapter || scene_change;
        this.#callme_nextframe.callme();
    }

    /**
     * 
     * 由于数据变动，更新内容
     * 
     * @param {*} defer 
     */
    update(scene_maybe_changed = false) {
        this.#callme_nextframe.clear();
        if (this.#need_rebuild_adapter || scene_maybe_changed) {
            this.rebuildDataAdapter();
            this.#virtual_scroller.update();
        } else if (this.#need_update) {
            this.#virtual_scroller.update();
        }
        this.#need_rebuild_adapter = false;
        this.#need_update          = false;
    }

    /**
     * 
     * 根据位置获取Cell
     * 
     * @param {Number} x ClientX
     * @param {Number} y ClientY
     */
    getCellByPoint(x, y) {
        let children = this.#content_container.childNodes;
        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            if (!(child instanceof TreeCell)) {
                continue;
            }
            
            // 判断
            if (child.isPointIn(x, y)) {
                return child;
            }
        }
        return null;
    }

    /**
     * 
     * 滚动到指定的位置
     * 
     * @param {Number} position 
     */
    scrollTo(position) {
        if (!this.#adapter || !this.#adapter.hasData) {
            this.#scroll_content_container.scrollTop = 0;
        } else {
            const scroll_height = this.#scroll_content_container.scrollHeight;
            const client_height = this.#scroll_content_container.clientHeight;
            const max_top = scroll_height - client_height;
            if (position < 0) {
                position = 0;
            } else if (position > max_top) {
                position = max_top;
            }
            this.#scroll_content_container.scrollTop = position;
        }
    }

    /**
     * 
     * 滚动
     * 
     * @param {*} offset 
     */
    scrollOffset(offset) {
        offset = parseFloat(offset);
        if (!this.#adapter || !this.#adapter.hasData) {
            this.#scroll_content_container.scrollTop = 0;
        } else {
            const scroll_height = this.#scroll_content_container.scrollHeight;
            const client_height = this.#scroll_content_container.clientHeight;
            const max_top = scroll_height - client_height;
            let top = this.#scroll_content_container.scrollTop;
            let next_top = top + offset;
            if (next_top < 0) {
                next_top = 0;
            } else if (next_top > max_top) {
                next_top = max_top;
            }
            this.#scroll_content_container.scrollTop = next_top;
        }
    }

    /**
     * 
     * 跳转到指定的index
     * 
     * @param {Number} index    调整指定的元素
     * @param {Boolean} blink   闪烁
     * @returns 
     */
    scrollToIndex(index, blink = true) {
        if (index < 0 || !this.#adapter || index >= this.#adapter.getCount()) {
            return false;
        }

        // 先滚动到指定的位置
        this.scrollTo(index * Constants.DefaultCellHeight);

        // 在下一帧执行闪烁
        if (blink) {
            requestAnimationFrame(() => {
                let cell = this.#getCellByIndex(index);
                if (cell) {
                    cell.blink();
                }
            });
        }

        return true;
    }

    /**
     * 
     * 滚动到指定的节点
     * 
     * @param {*} ref 
     * @param {boolean} blink 
     */
    scrollToSenceObject(ref, blink = true) {
        if (undefined == ref) {
            return;
        }

        // Ref的所有父亲都展开
        let parent = ref.parent;
        if (parent) {
            parent.setUnfoldedRecursion();
        }

        // 通知重新构建Adapter
        this.rebuildDataAdapter();
        this.update();

        // 跳转到指定的索引位置
        let index = this.#adapter.getItemIndexByUUID(ref.uuid);
        if (index >= 0) {
            this.scrollToIndex(index, blink);
        }
    }

    /**
     * 
     * 根据索引获取Cell，需要显示的Cell
     * 
     * @param {Number} index 
     */
    #getCellByIndex(index) {
        let children = this.#content_container.childNodes;
        let children_count = children.length;
        for (let i = 0; i < children_count; ++i) {
            let child = children[i];
            if (child.getIndex && index == child.getIndex()) {
                return child;
            }
        }
    }

    /**
     * 
     * 当尺寸发生变化的时候
     * 
     * @param {*} event 
     */
    #onResize(event) {
        this.#virtual_scroller.becauseOfContainerSizeChanged();
        this.#adjustScrollBar();
    }

    /**
     * 
     * 调整
     * 
     * @param {*} event 
     */
    #onContentSizeMaybeChanged(event) {
        this.#adjustScrollBar();
    }

    /**
     * 调整滚动条
     */
    #adjustScrollBar() {
        let content_length = this.#scroll_content_container.scrollHeight;
        let offset = this.#scrollbar_v.getOffset();
        let client_length = this.#container.clientHeight;

        if (client_length >= content_length) {
            this.#scrollbar_v.style.display = 'none';
        } else {
            this.#scrollbar_v.style.display = 'block';
            if (offset + client_length > content_length) {
                offset = content_length - client_length;
            }
            this.#scrollbar_v.setScrollInfo(content_length, offset, client_length);
        }
    }

    /**
     * 
     * 滚动事件
     * 
     * @param {*} event 
     */
    #onScroll(event) {
        event.stopPropagation();
        this.#virtual_scroller.scrollChanged();
        this.#scrollbar_v.setOffset(this.#scroll_content_container.scrollTop);
    }

    /**
     * 
     * 滚动结束事件
     * 
     * @param {*} event 
     */
    #onScrollEnd(event) {
        event.stopPropagation();
    }

    /**
     * 
     * 监听滚动条的滚动
     * 
     * @param {*} event 
     */
    #onScrollbarScroll(event) {
        this.scrollTo(this.#scrollbar_v.getOffset());
        this.#virtual_scroller.scrollChanged();
    }

    /**
     * 
     * 销毁被拖动的Cell
     * 
     * @returns 
     */
    #dismissDraggedCell() {
        if (!this.#dragged_cell) {
            return;
        }

        const cell = this.#dragged_cell;
        const related_cell = cell.dragging_related_cell;
        if (related_cell) {
            related_cell.setTranslucency(false);
        }
        this.#dragged_cell = undefined;

        Animation.Try(
            cell,
            {
                opacity: 0,
                left: this.#dragged_cell_start_x,
                top: this.#dragged_cell_start_y,
                duration: 500,
                easing: 'easeOutCubic',
                onComplete: () => {
                    cell.remove();
                }
            });
    }

    /**
     * 
     * 按下
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        // 只有左键的按下才响应
        if (0 != event.button) {
            return;
        }

        // 必须是点击了Cell
        let target = event.target;
        if (!(target instanceof TreeCell)) {
            return;
        }

        // 如果是 Scene
        if (target.is_scene_node) {
            return;
        }

        // 监听后续的事件
        this.#container.addEventListener('pointermove',   this.#on_pointer_move);
        this.#container.addEventListener('pointerup',     this.#on_pointer_up);
        this.#container.addEventListener('pointercancel', this.#on_pointer_cancel);
        this.#container.addEventListener('pointerleave',  this.#on_pointer_leave);

        // 记录相关的位置数据
        const client_rect = target.getBoundingClientRect();
        this.#dragged_offset_x = event.x - client_rect.left;
        this.#dragged_offset_y = event.y - client_rect.top;
    }

    /**
     * 
     * 移动
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        // 鼠标位置
        const x = event.clientX;
        const y = event.clientY;

        // 如果没有构建Cell
        if (!this.#dragged_cell) {
            if (!(event.target instanceof TreeCell)) {
                throw new Error('event.target must be TreeCell');
            }

            const related_cell = event.target;
            related_cell.setTranslucency(true);
            this.#dragged_cell = related_cell.cloneDeepAndMakeDragges();
            this.#dragged_cell_start_x = x - this.#dragged_offset_x;
            this.#dragged_cell_start_y = y - this.#dragged_offset_y;
            document.body.appendChild(this.#dragged_cell);

            // 发送事件
            this.dispatchUserDefineEvent('cell-drag-start', {
                'cell' : this.#dragged_cell,
                'x'    : x,
                'y'    : y,
            });
        }

        // 捕获后续事件
        if (!this.#dragged_has_setcapture) {
            this.#dragged_has_setcapture = true;
            this.#container.setAttribute('has-cell-dragging', '');
            this.#container.setPointerCapture(event.pointerId);
        }

        // 发送事件
        this.dispatchUserDefineEvent('cell-drag-move', {
            'cell' : this.#dragged_cell,
            'x'    : x,
            'y'    : y,
        });

        // 修正位置
        this.#dragged_cell.style.left = `${x - this.#dragged_offset_x}px`;
        this.#dragged_cell.style.top  = `${y - this.#dragged_offset_y}px`;

        // 如果不允许调整顺序
        if (!this.#isAllowAjustSort()) {
            return;
        }

        //
        // 如果拖动的Cell，超过外部滚动的容器
        // 执行自动滚动
        //
        const client_rect = this.#scroll_content_container.getBoundingClientRect();
        if (y < client_rect.top || y > client_rect.bottom) {
            this.#auto_scroller.onDragPointerMove(event);
        } 
        
        // 
        else {
            // 寻找命中的元素
            const hitcell = this.getCellByPoint(x, y);

            //
            // 对Hover的元素执行高亮态
            //
            // 如果找到的Cell不是拖出来的元素
            //
            if (hitcell !== this.#dragged_cell.dragging_related_cell) {

                // 如果 Hover 的 Cell发生了变化
                if (hitcell != this.#current_hit_cell) {

                    // 清理上一个 Hover 的 Cell 的 Hover 态
                    if (this.#current_hit_cell) {
                        this.#current_hit_cell.setHideLine();
                        this.#current_hit_cell.setHover(false);
                        this.#current_hit_cell = undefined;
                    }
                    
                    // 记录一下
                    this.#current_hit_cell = hitcell;

                    // 对当前的的 hitcell 设置 hover 态
                    if (this.#current_hit_cell) {
                        this.#current_hit_cell.setHover(true);
                    }
                }
            } 
            
            // 清理掉旧的 hover 的 Cell
            else if (this.#current_hit_cell) {
                this.#current_hit_cell.setHideLine();
                this.#current_hit_cell.setHover(false);
                this.#current_hit_cell = undefined;
            }

            //
            // 如果 hover 了
            // 调整 Cell 的 Hover 态度
            //
            if (this.#current_hit_cell) {

                // 获取位置
                const client_rect = this.#current_hit_cell.getBoundingClientRect();

                // 如果是容器类型
                if (this.#current_hit_cell.is_container) {

                    // 如果是闭合的
                    if (this.#current_hit_cell.isFolded()) {
                        if (y < client_rect.y + client_rect.height * 0.3) {
                            this.#current_hit_cell_status = "before";
                            this.#current_hit_cell.setShowLineTop(true);
                        } else if (y > client_rect.y + client_rect.height * 0.7) {
                            this.#current_hit_cell_status = "after";
                            this.#current_hit_cell.setShowLineBottom(true);
                        } else {
                            this.#current_hit_cell_status = "inside";
                            this.#current_hit_cell.setHideLine();
                        }
                    }

                    //
                    // 如何是打开的
                    //
                    // 不现实上下的线 
                    // 
                    else {
                        if (y < client_rect.y + client_rect.height * 0.5) {
                            this.#current_hit_cell_status = "before";
                            this.#current_hit_cell.setShowLineTop(true);
                        } else {
                            this.#current_hit_cell_status = "inside";
                            this.#current_hit_cell.setHideLine();
                        }
                    }
                } 
                
                // 非容器
                else {
                    if (y < client_rect.y + client_rect.height * 0.5) {
                        this.#current_hit_cell_status = "before";
                        this.#current_hit_cell.setShowLineTop(true);
                    } else {
                        this.#current_hit_cell_status = "after";
                        this.#current_hit_cell.setShowLineBottom(true);
                    }
                }
            } else {
                this.#current_hit_cell_status = undefined;
            }
        }
    }

    /**
     * 
     * 抬起
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {

        // 鼠标位置
        const x = event.clientX;
        const y = event.clientY;

        // 修改显示属性
        this.#container.releasePointerCapture(event.pointerId);
        this.#container.removeAttribute('has-cell-dragging');
        this.#container.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#container.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#container.removeEventListener('pointercancel', this.#on_pointer_cancel);

        // 如果允许调整顺序
        if (this.#isAllowAjustSort()) {

            // 拖拽
            if (this.#current_hit_cell) {
                if (this.#dragged_cell) {
                    const a = this.#dragged_cell    .getRefObject();
                    const b = this.#current_hit_cell.getRefObject();
                    if (a && b) {
                        if ('before' === this.#current_hit_cell_status) {
                            if (b.parent) {
                                b.parent.insertBefore('tree-view', b, a);
                            }
                        } else if ('after' === this.#current_hit_cell_status) {
                            if (b.parent) {
                                b.parent.insertAfter('tree-view', b, a);
                            }
                        } else {
                            if (a != b && !b.isAncestor(a)) {
                                b.insertFront('tree-view', a);
                            }
                        }
                        this.rebuildDataAdapter();
                        this.#virtual_scroller.update();
                    }

                    // 发送事件
                    this.dispatchUserDefineEvent('cell-drag-finish', {
                        'cell' : this.#dragged_cell,
                        'x'    : x,
                        'y'    : y,
                    });
                }

                // 回收
                this.#current_hit_cell.setHideLine();
                this.#current_hit_cell.setHover(false);
                this.#current_hit_cell = undefined;
            } 
            
            // 没有命中
            else {
                ;
            }
        }

        // 补充拖动结束事件
        if (this.#dragged_cell) {

            // 发送事件
            this.dispatchUserDefineEvent('cell-drag-finish', {
                'cell' : this.#dragged_cell,
                'x'    : x,
                'y'    : y,
            });
        }

        // 收尾
        this.#auto_scroller.onDragCancel();
        this.#dragged_has_setcapture = false;
        this.#dismissDraggedCell();
    }

    /**
     * 
     * 取消
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }

    /**
     * 
     * 移出
     * 
     * @param {*} event 
     */
    #onPointerLeave(event) {
        this.#onPointerCancel(event);
    }

    /**
     * 
     * 场景发生了变化
     * 
     * @param {*} event 
     */
    #onSceneChanged(event) {
        this.#need_update = true;
        this.#need_rebuild_adapter = true;
    }

    /**
     * 
     * 场景中选择的元素发生了变化
     * 
     * @param {*} event 
     */
    #onSceneSelectedChanged(event) {
        this.#need_update = true;
    }
}

CustomElementRegister(tagName, Tree);
