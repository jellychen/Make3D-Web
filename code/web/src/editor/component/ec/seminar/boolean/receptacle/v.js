/* eslint-disable no-unused-vars */

import isUndefined           from 'lodash/isUndefined';
import XThree                from '@xthree/basic';
import ParametersScoped      from '@core/houdini/scoped-parameters';
import EditableMesh          from '@core/cinderella/mesh/editable';
import MeshFromSoup          from '@core/misc/mesh-from-soup';
import XThreeMaterial        from '@xthree/material';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Sortable              from 'sortablejs';
import ObjectsArrMonitor     from './objects-arr-monitor';
import Item                  from './v-item';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-boolean-receptacle';

/**
 * 容器
 */
export default class Receptacle extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 宿主
     */
    #host;

    /**
     * wasm 对象
     */
    #connector;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * 选择的元素覆盖材质
     */
    #override_material = new XThreeMaterial.AspectColorNotSmooth();

    /**
     * 界面元素
     */
    #moderator;
    #scene_tree;
    #aio;

    /**
     * 元素
     */
    #container;
    #panel;
    #content;
    #drop_in_box;
    #add;

    /**
     * 拖拽排序
     */
    #sortable;

    /**
     * 是否强制高亮
     */
    #status;

    /**
     * 命中的Item
     */
    #current_hit_item;
    #current_hit_item_status; // before / after
    
    /**
     * 每次开始
     */
    #is_object_subitable;
    #is_object_in;

    /**
     * 事件回调
     */
    #on_cell_drag_start  = event => this.#onCellDragStart (event);
    #on_cell_drag_move   = event => this.#onCellDragMove  (event);
    #on_cell_drag_finish = event => this.#onCellDragFinish(event);
    #on_add_click        = event => this.#onAddClick      (event);

    /**
     * 数据检测
     */
    #objects_arr_monitor;

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 获取
     */
    get host() {
        return this.#host;
    }

    /**
     * 获取
     */
    get historical_recorder() {
        return this.#host.historical_recorder;
    }

   /**
    * 
    * 构造函数
    * 
    * @param {*} coordinator 
    * @param {*} host 
    * @param {*} connector 
    */
    constructor(coordinator, host, connector) {
        super(tagName);
        this.#coordinator         = coordinator;
        this.#objects_arr_monitor = new ObjectsArrMonitor(connector, host);
        this.#host                = host;
        this.#selected_container  = coordinator.selected_container;
        this.#connector           = connector;
        this.#moderator           = this.#coordinator.moderator;
        this.#scene_tree          = this.#moderator.scene_tree;
        this.#aio                 = this.#moderator.aio;
        this.#override_material.setTransparent(true, 0.5);
        this.#override_material.setFrontColor(0x513fac);
        this.#override_material.setSide(XThree.FrontSide);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container   = this.getChild('#container');
        this.#panel       = this.getChild('#panel');
        this.#content     = this.getChild('#content');
        this.#drop_in_box = this.getChild('#drop-in-box');
        this.#add         = this.getChild('#add');

        // 拖拽
        this.#sortable = Sortable.create(this.#content, {
            animation: 300,
            ghostClass: 'if-dragging',
            dragClass: 'sortable-drag',
            onStart : (event) => this.#onDragStart(event),
            onUpdate: (event) => this.#onCellsChanged(event),
            onEnd   : (event) => this.#onDragEnd(event),
        });

        // 监听事件
        this.#scene_tree.addEventListener('cell-drag-start',  this.#on_cell_drag_start);
        this.#scene_tree.addEventListener('cell-drag-move',   this.#on_cell_drag_move);
        this.#scene_tree.addEventListener('cell-drag-finish', this.#on_cell_drag_finish);
        this.#add       .addEventListener('click',            this.#on_add_click);

        // 选择的元素添加进去
        const selected_objects = [];
        this.#selected_container.foreach(object => {
            if (!object || !this.#isSuitObject(object)) {
                return;
            }
            selected_objects.push(object);
            const item = this.#createItemFromObject(object);
            object.backupMaterial();
            object.material = this.#override_material;
            this.#content.appendChild(item);
        });
        this.#objects_arr_monitor.resetObjectes(selected_objects);
        this.#onContentChildrenChanged();
    }

    /**
     * 
     * 设置是否高亮
     * 
     * @param {boolean} show 
     */
    setHighlight(show) {
        if (show) {
            if (this.#status == 'highlight') {
                return;
            }
            this.#status = 'highlight';
            this.#panel.setAttribute('status', 'highlight');
        } else {
            if (isUndefined(this.#status)) {
                return;
            }
            this.#status = undefined;
            this.#panel.setAttribute('status', '');
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {boolean} show 
     */
    setHighlightError(show) {
        if (show) {
            if (this.#status == 'error') {
                return;
            }
            this.#status = 'error';
            this.#panel.setAttribute('status', 'error');
        } else {
            if (isUndefined(this.#status)) {
                return;
            }
            this.#status = undefined;
            this.#panel.setAttribute('status', '');
        }
    }

    /**
     * 
     * 显示
     * 
     * @param {boolean} show 
     */
    update() {
        if (this.#connector.hasResultContent()) {
            this.#add.enable = true;
        } else {
            this.#add.enable = false;
        }
    }

    /**
     * 
     * 元素是不是已经添加进去了
     * 
     * @param {*} object 
     * @returns 
     */
    #isObjectIn(object) {
        if (!object) {
            return false;
        }

        for (const i of this.#content.childNodes) {
            if (!(i instanceof Item)) {
                continue;
            }

            if (i.uuid === object.uuid) {
                return true;
            }
        }

        return false;
    }

    /**
     * 
     * 根据位置获取 Item
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    #getItemByPoint(x, y) {
        for (const i of this.#content.childNodes) {
            if (!(i instanceof Item)) {
                continue;
            }

            if (i.isPointIn(x, y)) {
                return i;
            }
        }
        return null;
    }

    /**
     * 
     * 设置全部的Item的Hover支持
     * 
     * @param {boolean} enable 
     */
    #setAllItemsEnableHover(enable) {
        for (const i of this.#content.childNodes) {
            if (!(i instanceof Item)) {
                continue;
            }
            i.setEnableHover(enable);
        }
    }

    /**
     * 
     * 开始拖动
     * 
     * @param {*} event 
     */
    #onDragStart(event) {
        // 规避 Sortable 的BUG
        this.#setAllItemsEnableHover(false);
    }

    /**
     * 
     * 结束拖动
     * 
     * @param {*} event 
     */
    #onDragEnd(event) {
        // 规避 Sortable 的BUG
        this.#setAllItemsEnableHover(true);
        
        // 规避 Sortable 的Bug
        setTimeout(() => {
            this.#objects_arr_monitor.check(this.getAllObjects());
        }, 0);
    }

    /**
     * 
     * 判断对象是不是符合
     * 
     * @param {*} object 
     * @returns 
     */
    #isSuitObject(object) {
        return object && (object instanceof EditableMesh);
    }

    /**
     * 
     * 从Object构建 Item
     * 
     * @param {*} object 
     * @returns 
     */
    #createItemFromObject(object) {
        if (!object) {
            return;
        }

        const item = new Item(this);
        item.setObject(object)
        item.setName(object.getNameOrTypeAsName());
        item.setUUID(object.uuid);

        return item;
    }

    /**
     * 
     * Cell 拖动开始
     * 
     * @param {*} event 
     */
    #onCellDragStart(event) {
        // 获取拖动的Cell，并获取里面的模型
        const cell = event.cell;
        const object = cell.getRefObject();
        if (!object) {
            return;
        }

        this.#is_object_in = false;
        this.#is_object_subitable = false;
        this.#is_object_subitable = this.#isSuitObject(object);
        this.#is_object_in = this.#isObjectIn(object);
    }

    /**
     * 
     * Cell 拖动
     * 
     * @param {*} event 
     */
    #onCellDragMove(event) {
        // 获取拖动的Cell，并获取里面的模型
        const cell = event.cell;
        const object = cell.getRefObject();
        if (!object) {
            return;
        }

        // 判断是否符合要求
        const is_suitable = this.#is_object_subitable;

        // 获取鼠标的位置
        const client_rect = this.#panel.getBoundingClientRect();
        const x = event.x;
        const y = event.y;
        
        // 如果位置没有命中
        if (x < client_rect.left || x > client_rect.right ||
            y < client_rect.top  || y > client_rect.bottom) {
            this.setHighlight(false);
            
            // 如果之前有命中 item，取消命中态
            if (this.#current_hit_item) {
                this.#current_hit_item.setHideLine();
                this.#current_hit_item = undefined;
                this.#current_hit_item_status = undefined;
            }
        } 
        
        // 命中处理
        else {
            //如果不是符号要求的模型，显示错误的颜色
            if (!is_suitable || this.#is_object_in) {
                this.setHighlightError(true);
            } 

            // 符号要求，显示正确的颜色
            else {
                this.setHighlight(true);

                // 找到对应的 Item
                let item = this.#getItemByPoint(x, y);
                let item_status;

                // 如果没找到
                if (!item) {
                    // 是不是最后一个
                    const count = this.#content.childNodes.length;
                    if (count > 0) {
                        const back = this.#content.childNodes[count - 1];
                        const rect = back.getBoundingClientRect();
                        if (y >= rect.bottom) {
                            item = back;
                        }
                    }
                }

                // 找到 item
                if (item) {
                    const client_rect = item.getBoundingClientRect();
                    if (y < client_rect.top + client_rect.height * 0.5) {
                        item.setShowLineUp(true);
                        item_status = "before";
                    } else {
                        item.setShowLineBottom(true);
                        item_status = "after";
                    }
                } 
                
                // 没有命中
                if (!item || item != this.#current_hit_item) {
                    if (this.#current_hit_item) {
                        this.#current_hit_item.setHideLine();
                        this.#current_hit_item = undefined;
                    }
                }

                // 记录
                this.#current_hit_item = item;
                this.#current_hit_item_status = item_status;
            }
        }
    }

    /**
     * 
     * Cell 拖动结束
     * 
     * @param {*} event 
     */
    #onCellDragFinish(event) {
        // 取消强制高亮
        this.setHighlight(false);

        // 获取拖动的Cell，并获取里面的模型
        const cell = event.cell;
        const object = cell.getRefObject();
        if (!object) {
            return;
        }

        if (!this.#is_object_in && this.#is_object_subitable) {
            // 获取鼠标的位置
            const x = event.x;
            const y = event.y;
            const client_rect = this.#panel.getBoundingClientRect();

            // 备份材质
            object.backupMaterial();
            object.material = this.#override_material;

            // 如果之前命中了
            if (this.#current_hit_item) {
                const parent = this.#current_hit_item.parentNode;
                const item  = this.#createItemFromObject(object);
                if (item) {
                    if ("before" == this.#current_hit_item_status) {
                        parent.insertBefore(item, this.#current_hit_item);
                    } else if ("after" == this.#current_hit_item_status) {
                        if (this.#current_hit_item.nextSibling) {
                            parent.insertBefore(item, this.#current_hit_item.nextSibling);
                        } else {
                            this.#content.appendChild(item);
                        }
                    }
                    this.#onContentChildrenChanged();
                }
            }

            // 如果没有命中
            else if (x >= client_rect.left && x <= client_rect.right &&
                     y >= client_rect.top  && y <= client_rect.bottom) {
                this.#content.appendChild(this.#createItemFromObject(object));
                this.#onContentChildrenChanged();
            }
        }

        // 如果之前命中了Item
        if (this.#current_hit_item) {
            this.#current_hit_item.setHideLine();
            this.#current_hit_item = undefined;
            this.#current_hit_item_status = undefined;
        }

        // 检测数据
        this.#objects_arr_monitor.check(this.getAllObjects());
    }

    /**
     * 
     * 当Cell发生了变化
     * 
     * @param {*} event 
     */
    #onCellsChanged(event) {
        this.dispatchEventDetail("changed");
    }

    /**
     * 内容发生了变化
     */
    #onContentChildrenChanged() {
        if (0 == this.#content.childNodes.length) {
            this.#drop_in_box.style.display = 'block';
        } else {
            this.#drop_in_box.style.display = 'none';
        }
        this.#onCellsChanged();
    }

    /**
     * 
     * 获取所有元素的个数
     * 
     * @returns 
     */
    countOfAllObjects() {
        let count = 0;
        for (const i of this.#content.childNodes) {
            if (!(i instanceof Item)) {
                continue;
            }

            const object = i.object;
            if (object) {
                count++;
            }
        }
        return count;
    }

    /**
     * 
     * 获取全部的元素
     * 
     * @returns 
     */
    getAllObjects() {
        const arr = new Array();
        for (const i of this.#content.childNodes) {
            if (!(i instanceof Item)) {
                continue;
            }

            const object = i.object;
            if (object) {
                arr.push(object);
            }
        }
        return arr;
    }

    /**
     * 
     * 重置里面的对象
     * 
     * @param {*} objects 
     */
    resetAllObjets(objects) {
        // 回滚
        for (const object of this.getAllObjects()) {
            object.material = null;
            object.recoverMaterialFromBackup();
        }

        // cell 数量搞够
        const len_0 = this.#content.children.length;
        const len_1 = objects.length;
        if (len_0 > len_1) {
            while (this.#content.children.length > len_1) {
                this.#content.removeChild(this.#content.firstChild);
            }
        }
        
        if (len_1 > len_0) {
            while (this.#content.children.length < len_1) {
                this.#content.appendChild(new Item(this));
            }
        }

        // 弥补
        for (let i = 0; i < len_1; ++i) {
            const object = objects[i]
            const item   = this.#content.children[i];
            item.setObject(object)
            item.setName(object.getNameOrTypeAsName());
            item.setUUID(object.uuid);
            object.backupMaterialIfNotHas();
            object.material = this.#override_material;
        }
    }

    /**
     * 
     * 有 Item 移除
     * 
     * @param {*} item 
     * @param {*} object 
     */
    onItemRemoved(item, object) {
        // 恢复材质
        if (object) {
            object.material = undefined;
            object.recoverMaterialFromBackup();
        }

        // 通知外面
        this.#onContentChildrenChanged();

        // 检测数据
        this.#objects_arr_monitor.check(this.getAllObjects());
    }

    /**
     * 
     * 添加按钮
     * 
     * @param {*} event 
     */
    #onAddClick(event) {
        if (!this.#connector.hasResultContent()) {
            return;
        }

        // 获取结果
        const soup = this.#connector.resultAsSoupAndPlacedInCenter();
        if (!soup) {
            return;
        }

        // 构建 Mesh
        const mesh = new EditableMesh();
        mesh.setName("boolean");

        // 获取位置
        ParametersScoped.getLocation(mesh.position);
        
        // 转Mesh
        MeshFromSoup(mesh, soup);

        // 销毁soup
        soup.delete();

        // 添加到场景中
        this.#coordinator.scene.add(mesh);
        this.#coordinator.markTreeViewNeedUpdate(true);

        // 重绘
        this.renderNextFrame();

        // 闪烁
        const moderator = this.#coordinator.moderator;
        const scene_tree = moderator.scene_tree;
        scene_tree.scrollToSenceObject(mesh, true);

        // 添加回撤
        this.historical_recorder.removeElement(mesh, this);
    }

    /**
     * 下一帧重绘
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        // 把自己移除
        this.remove();

        // 对全部的元素
        for (const object of this.getAllObjects()) {
            object.material = undefined;
            object.recoverMaterialFromBackup();
        }

        // 销毁材质
        if (this.#override_material) {
            this.#override_material.dispose();
            this.#override_material = undefined;
        }

        // 销毁事件
        this.#scene_tree.removeEventListener('cell-drag-start',  this.#on_cell_drag_start);
        this.#scene_tree.removeEventListener('cell-drag-move',   this.#on_cell_drag_move);
        this.#scene_tree.removeEventListener('cell-drag-finish', this.#on_cell_drag_finish);
    }
}

CustomElementRegister(tagName, Receptacle);
