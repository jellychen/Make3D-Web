/* eslint-disable no-unused-vars */

import isObject              from 'lodash/isObject';
import isArray               from 'lodash/isArray';
import isString              from 'lodash/isString';
import Panzoom               from '@panzoom/panzoom'
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Tpls                  from './tpls';
import PanelDraggable        from './panel-draggable';
import SlotComponentCreator  from './slot-component/component-creator';
import Node                  from './graph/node';
import Html                  from './panel-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shader-graph-panel';

/**
 * Panel
 */
export default class ShaderGraphPanel extends Element {
    /**
     * uuid
     */
    #uuid;

    /**
     * 上下文
     */
    #context;

    /**
     * 拓扑中的节点
     */
    #topo;
    #topo_node;

    /**
     * slot
     */
    #slots_in  = [];
    #slots_out = [];

    /**
     * 元素
     */
    #container;
    #header;
    #board;
    #port_container;
    #in;
    #out;

    /**
     * 移动
     */
    #draggable;

    /**
     * 当前的位置
     */
    #x = 0;
    #y = 0;

    /**
     * 获取id
     */
    get uuid() {
        return this.#uuid;
    }

    /**
     * 获取
     */
    get topo_node() {
        return this.#topo_node;
    }

    /**
     * 获取
     */
    get slots_in() {
        return this.#slots_in;
    }

    /**
     * 获取
     */
    get slots_out() {
        return this.#slots_out;
    }

    /**
     * 获取
     */
    get x() {
        return this.#x;
    }

    /**
     * 获取
     */
    get y() {
        return this.#y;
    }

    /**
     * 获取
     */
    get nodes_in() {
        return this.#in;
    }

    /**
     * 获取
     */
    get nodes_out() {
        return this.#out;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} context 
     * @param {*} uuid 
     * @param {*} panel_tpl 
     * @param {*} topo 
     */
    constructor(context, uuid, panel_tpl, topo) {
        super(tagName);
        this.#uuid    = uuid? uuid: crypto.randomUUID();
        this.id       = this.#uuid;
        this.#context = context;
        this.createContentFromTpl(tpl);
        this.#setTplFromName(panel_tpl);
        this.#setupTopo(topo);
        this.#draggable = new PanelDraggable(this.#context, this, this.#header);
        this.#draggable.on_drag_start = ()     => this.#onDragStart();
        this.#draggable.on_drag       = (x, y) => this.#onDrag(x, y);
        this.#draggable.on_drag_end   = ()     => this.#onDragEnd();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container           = this.getChild('#container');
        this.#header              = this.getChild('#header');
        this.#board               = this.getChild('#board');
        this.#port_container      = this.getChild('#port-container');
        this.#in                  = this.getChild('#in');
        this.#out                 = this.getChild('#out');
        this.#board.onpointerdown = event => event.preventDefault();
        this.onpointerdown        = event => this.#onPointerDown(event);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} name 
     */
    #setTplFromName(name) {
        this.#setTpl(Tpls[name]);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} tpl 
     */
    #setTpl(tpl) {
        if (!isObject(tpl)) {
            return;
        }

        this.setName(tpl.name);

        const board_view = SlotComponentCreator(tpl.board);
        if (board_view) {
            this.#board.appendChild(board_view);
        }

        if (isArray(tpl.in)) {
            for (const item of tpl.in) {
                this.#slots_in.push(item);
                const slot = SlotComponentCreator('port.in', item, this);
                if (slot) {
                    this.#in.appendChild(slot);
                }
            }
        }

        if (isArray(tpl.out)) {
            for (const item of tpl.out) {
                this.#slots_out.push(item);
                const slot = SlotComponentCreator('port.out', item, this);
                if (slot) {
                    this.#out.appendChild(slot);
                }
            }
        }
    }

    /**
     * 
     * 设置拓扑
     * 
     * @param {*} topo 
     * @returns 
     */
    #setupTopo(topo) {
        this.#topo = topo;
        this.#topo_node = new Node(this, this.#uuid, this.slots_in, this.slots_out);
        this.#topo.addNode(this.#topo_node);
        return this.#topo_node;
    }

    /**
     * 
     * 设置 ID
     * 
     * @param {*} id 
     */
    setId(id) {
        this.id = id;
    }

    /**
     * 
     * 设置位置
     * 
     * @param {*} x 
     * @param {*} y 
     */
    setLocation(x, y) {
        this.style.transform = `translate(${x}px, ${y}px)`;
    }

    /**
     * 
     * 设置名称
     * 
     * @param {*} name 
     */
    setName(name) {
        if (isString(name)) {
            this.#header.innerText = name;
        } else {
            this.#header.innerText = 'Unknown';
        }
    }

    /**
     * 
     * 根据名字获取输入节点
     * 
     * @param {*} name 
     * @returns 
     */
    getInPortByName(name) {
        for (const child of this.#in.children) {
            if (child.name == name) {
                return child;
            }
        }
    }

    /**
     * 
     * 输入节点
     * 
     * @param {*} name 
     * @returns 
     */
    in(name) {
        return this.getInPortByName(name);
    }

    /**
     * 
     * 根据名字获取输出节点
     * 
     * @param {*} name 
     * @returns 
     */
    getOutPortByName(name) {
        for (const child of this.#out.children) {
            if (child.name == name) {
                return child;
            }
        }
    }

    /**
     * 
     * 输出节点
     * 
     * @param {*} name 
     * @returns 
     */
    out(name) {
        return this.getOutPortByName(name);
    }

    /**
     * 
     * 平面空间位置，查找命中的元素, 输入端口
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    getInPortByPoint(x, y) {
        for (const child of this.#in.children) {
            if (child.dotHittest(x, y)) {
                return child;
            }
        }
    }

    /**
     * 
     * 平面空间位置，查找命中的元素， 输出端口
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    getOutPortByPoint(x, y) {
        for (const child of this.#out.children) {
            if (child.dotHittest(x, y)) {
                return child;
            }
        }
    }

    /**
     * 
     * 平面空间位置，查找命中的元素， 端口
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    getPortByPoint(x, y) {
        const port = this.getInPortByPoint(x, y);
        if (port) {
            return port;
        } else {
            return this.getOutPortByPoint(x, y);
        }
    }

    /**
     * 尺寸和位置可能发生了变化
     */
    #onSizeOrLocationMaybeChanged() {
        if (this.#topo_node) {
            this.#topo_node.updateLocation();
        }
    }

    /**
     * 事件
     */
    #onDragStart() {
        this.#container.classList.add('dragging');
    }

    /**
     * 
     * 事件
     * 
     * @param {*} x 
     * @param {*} y 
     */
    #onDrag(x, y) {
        this.#x = x;
        this.#y = y;
        this.#onSizeOrLocationMaybeChanged();
        this.#context.render();
    }

    /**
     * 事件
     */
    #onDragEnd() {
        this.#container.classList.remove('dragging');
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.style.zIndex = parseInt(performance.now());
    }

    /**
     * 设置正常的状态
     */
    setStatusNormal() {
        this.#container.setAttribute('status', 'normal');
    }

    /**
     * 设置错误的状态
     */
    setStatusError() {
        this.#container.setAttribute('status', 'error');
    }
}

CustomElementRegister(tagName, ShaderGraphPanel);
