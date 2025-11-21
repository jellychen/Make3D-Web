/* eslint-disable no-unused-vars */

import Constants             from './constants';
import RecycleCellsContainer from './recycle-cells-container';

/**
 * 用来操作
 */
export default class VirtualContainer extends RecycleCellsContainer {
    /**
     * 共享数据
     */
    #context;

    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #scroll_content_container;
    #content_container;

    /**
     * 数据适配器
     */
    #adapter;

    /**
     * 局部的数据
     */
    #redundancy_cells = [];

    /**
     * 记录当前的
     */
    #map = new Map();

    /**
     * 
     * 构造函数
     * 
     * @param {*} context 
     * @param {*} container 
     * @param {*} scroll_content_container 
     * @param {*} content_container 
     */
    constructor(context, container, scroll_content_container, content_container) {
        super();
        this.#context = context;
        this.#container = container;
        this.#scroll_content_container = scroll_content_container;
        this.#content_container = content_container;
        this.#clearContent();
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        super.setCoordinator(coordinator);
        this.#coordinator = coordinator;
    }

    /**
     * 
     * 设置数据适配器
     * 
     * @param {*} adapter 
     * @param {*} update 
     */
    setDataAdapter(adapter, update = true) {
        this.#adapter = adapter;
        if (update) {
            this.update();
        }
    }

    /**
     * 容器尺寸发生了变化
     */
    becauseOfContainerSizeChanged() {
        this.update();
    }

    /**
     * 滚动信息发生了变化
     */
    scrollChanged() {
        this.update();
    }

    /**
     * 
     * 设置数据容器的高度
     * 
     * @param {Number} height 
     */
    #setContentContainerHeight(height) {
        this.#content_container.style.height = `${height}px`;
    }

    /**
     * 清理
     */
    #clearContent() {
        const children = this.#content_container.childNodes;
        while (children.length > 0) {
            children[0].remove();
        }
    }
    
    // 清除
    #clearAllCells() {
        const children = this.#content_container.childNodes;
        while (children.length > 0) {
            const child = children[0];
            child.remove();
            this.recycle(child);
        }
    }

    /**
     * 
     * 更新元素
     * 
     * @param {Number} start 
     * @param {Number} end 
     */
    #updateCells(start, end) {
        if (end <= start) {
            return;
        }

        // 统计全部需要显示的UUID
        this.#map.clear();
        for (let i = start; i < end; ++i) {
            this.#map.set(this.#adapter.getItem(i).uuid, i);
        }

        // UI元素
        const children = this.#content_container.childNodes;
        const children_count = children.length;

        // 标记冗余部分, 复用可用的部分
        for (let i = 0; i < children_count; ++i) {
            const child = children[i];
            const uuid  = child.getObjectUUID();
            if (!this.#map.has(uuid)) {
                this.#redundancy_cells.push(child);
            } else {
                const index = this.#map.get(uuid);
                const data  = this.#adapter.getItem(index);
                child.resetAttitude();
                child.setAttr_Index(index);
                child.setData(data);
                
                this.#map.delete(uuid);
            }
        }

        // 重新布局
        let document_fragment = null;
        for (let i = start; i < end; ++i) {
            const data = this.#adapter.getItem(i);
            const uuid = data.uuid;
            if (!this.#map.has(uuid)) {
                continue;
            }

            // 需要新增的元素
            let cell = undefined;
            if (this.#redundancy_cells.length > 0) {
                cell = this.#redundancy_cells.pop();
            } else {
                cell = this.obtain(this.#context);
                document_fragment = document_fragment || new DocumentFragment();
                document_fragment.append(cell);
            }

            cell.setAttr_Index(i);
            cell.setData(data);
        }

        // 移除不需要的部分
        while (this.#redundancy_cells.length > 0) {
            this.recycle(this.#redundancy_cells.pop(), true);
        }

        // 添加碎片
        if (document_fragment) {
            this.#content_container.append(document_fragment);
        }
    }

    /**
     * 
     * 更新， 从adapter中把界面更新出来
     * 
     * @returns 
     */
    update() {
        // 如果没有数据，清理元素
        if (!this.#adapter || !this.#adapter.hasData()) {
            this.#clearAllCells();
            this.#setContentContainerHeight(0);
            return;
        }

        // 已知参数
        let cell_default_height       = Constants.DefaultCellHeight;                                    // cell 固定高度
        let client_height             = this.#container.clientHeight;                                   // 可视区域高度
        let scroll_top                = this.#scroll_content_container.scrollTop;                       // 滚动条的位置
        let client_visible_cell_count = Math.ceil(client_height / cell_default_height);                 // 可视区域放置多少Cell
        let cells_count               = this.#adapter.getCount();                                       // 全部的Cell数量
        let cells_total_height        = cell_default_height * cells_count;                              // 
        let overscan_count_scale      = 1.0;
        let overscan_count            = Math.ceil(client_visible_cell_count / overscan_count_scale);    // 上下用来预准备的数量
        let needs_cells_count         = overscan_count * 2 + client_visible_cell_count;                 // 总共会构建的Cell数量
        if (scroll_top + client_height > cells_total_height) {
            scroll_top = cells_total_height - client_height;
        }
        let client_scroll_cells_count = Math.floor(scroll_top   / cell_default_height);                 // 向下取整

        // 设置容器的尺寸
        this.#setContentContainerHeight(cells_total_height);

        // 校准滚动条
        this.#scroll_content_container.scrollTop = scroll_top;

        // 如果全部的Cell数量小于needs_cells_count
        if (cells_count < needs_cells_count) {
            this.#updateCells(0, cells_count);
        } else {
            let start = client_scroll_cells_count - overscan_count;
            let end   = start + needs_cells_count;
            if (start < 0) start = 0;
            if (end   > cells_count) end = cells_count;
            this.#updateCells(start, end);
        }
    }

    /**
     * 更新所有的Cell显示有没有children的标识，可能由于删除了某些元素
     */
    updateAllShowCellHasChildMarker() {
        const children = this.#content_container.childNodes;
        const children_count = children.length;
        for (let i = 0; i < children_count; ++i) {
            const child = children[i];
            const index = child.getIndex();
            const item  = this.#adapter.getItem(index);
            child.setHasChild(item.has_child);
        }
    }

    /**
     * 销毁
     */
    dispose() {

    }
}
