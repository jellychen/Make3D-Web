/* eslint-disable no-unused-vars */

import isArray               from 'lodash/isArray';
import Panzoom               from '@panzoom/panzoom'
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Context               from './context';
import Renderer              from './renderer';
import Panel                 from './panel';
import Drawer                from './v-drawer';
import DrawerItem            from './v-drawer-item';
import Topo                  from './topo';
import PanelCreator          from './panel-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shader-graph-editor';

/**
 * 材质编辑器
 */
export default class ShaderGraphEditor extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #dashboard;
    #dashboard_content;
    #nodes;
    #nodes_link;

    /**
     * 是否
     */
    #pointer_down = false;

    /**
     * 变换
     */
    #zoomer;
    #zoomer_own_event = false;
    #zoom_x = 0;
    #zoom_y = 0;
    #zoom_s = 1;

    /**
     * 上下文
     */
    #context;

    /**
     * 渲染器
     */
    #renderer;

    /**
     * 记录图的拓扑结构
     */
    #topo = new Topo();

    /**
     * 操作的元素
     */
    #handled_panel_port;
    #handled_panel_port_connector;

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 缩放
     */
    get zoomer() {
        return this.#zoomer;
    }

    /**
     * 获取
     */
    get dashboard_content() {
        return this.#dashboard_content;
    }

    /**
     * 获取
     */
    get nodes() {
        return this.#nodes;
    }

    /**
     * 获取
     */
    get nodes_link() {
        return this.#nodes_link;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container         = this.getChild('#container');
        this.#dashboard         = this.getChild('#dashboard');
        this.#dashboard_content = this.getChild('#content');
        this.#nodes             = this.getChild('#nodes');
        this.#nodes_link        = this.getChild('#nodes-link');
        this.#renderer          = new Renderer(this.#dashboard, this.#nodes_link, this.#topo);
        this.#context           = new Context(this, this.#renderer);
        
        // 测试
        this.#nodes.appendChild(this.createPanel('pbr'));
        this.#nodes.appendChild(this.createPanel('uv'));

    }

    /**
     * 安装缩放器
     */
    setupZoomer() {
        if (!this.#zoomer) {
            this.#zoomer = Panzoom(this.#dashboard_content, {
                noBind  : true,
                bounds  : false,
                minScale: 0.2,
                maxScale: 1.8,
            });

            this.#dashboard_content.addEventListener('panzoomchange', event => {
                const x = event.detail.x;
                const y = event.detail.y;
                const s = event.detail.scale;
                this.#onPanzoomChange(x, y, s);
            });
        }

        this.#dashboard.onpointerdown = event => this.#onDashboardPointerDown(event);
        this.#dashboard.onpointermove = event => this.#onDashboardPointerMove(event);
        this.#dashboard.onpointerup   = event => this.#onDashboardPointerUp  (event);
        this.#dashboard.onwheel       = event => this.#onDashboardWheel      (event);
    }

    /**
     * 放弃缩放器
     */
    disposeZoomer() {
        if (this.#zoomer) {
            this.#dashboard.onpointerdown = null;
            this.#dashboard.onpointermove = null;
            this.#dashboard.onpointerup   = null;
            this.#dashboard.onwheel       = null;
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.setupZoomer();
    }

    /**
     * 将要被移除
     */
    willRemoved() {
        ;
    }

    /**
     * 
     * 获取节点
     * 
     * @param {*} id 
     * @returns 
     */
    getPanelById(id) {
        return this.#nodes.getElementById(id);
    }

    /**
     * 
     * 根据位置来获取元素，窗口坐标系
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    getPanelByPoint(x, y) {
        const result = this.shadow.elementFromPoint(x, y);
        if (isArray(result) && result.length > 0) {
            const ele = result[0];
            if (ele instanceof Panel) {
                return ele;
            }
        } else if (result instanceof Panel) {
            return result;
        }
        return;
    }

    /**
     * 
     * 获取输入，窗口坐标系
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    getPanelInPortByPoint(x, y) {
        const panel = this.getPanelByPoint(x, y);
        if (panel) {
            const port = panel.getInPortByPoint(x, y);
            if (port) {
                return { panel, port };
            }
        }
    }

    /**
     * 
     * 获取输出，窗口坐标系
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    getPanelOutPortByPoint(x, y) {
        const panel = this.getPanelByPoint(x, y);
        if (panel) {
            const port = panel.getOutPortByPoint(x, y);
            if (port) {
                return { panel, port };
            }
        }
    }

    /**
     * 
     * 根据位置来获取元素，窗口坐标系
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    getPanelPortByPoint(x, y) {
        const panel = this.getPanelByPoint(x, y);
        if (panel) {
            const port = panel.getPortByPoint(x, y);
            if (port) {
                return { panel, port };
            }
        }
    }

    /**
     * 
     * 由于content会设置transform
     * 把 dashboard 的坐标转化成 content 的 坐标
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    transformPointer(x, y) {
        return this.#renderer.toLocal(x, y);
    }

    /**
     * 
     * 鼠标事件
     * 
     * @param {*} event 
     */
    #onDashboardPointerDown(event) {
        this.#dashboard.setPointerCapture(event.pointerId);
        this.#pointer_down = true;
        const x = event.clientX;
        const y = event.clientY;
        const panel_port = this.getPanelPortByPoint(x, y);
        if (panel_port) {
            const port    = panel_port.port;
            const port_xy = port.getDotLocation();
            const curve   = this.#renderer.curve_temp;
            curve.setColorRed();
            curve.x0 = port_xy.x;
            curve.y0 = port_xy.y;
            curve.x1 = port_xy.x;
            curve.y1 = port_xy.y;
            this.#handled_panel_port = port;
            this.#handled_panel_port.setDotHighlight(true);
        } else {
            this.#zoomer.handleDown(event);
            this.#zoomer_own_event = true;
            this.#handled_panel_port = undefined;
        }
    }

    /**
     * 
     * 鼠标事件
     * 
     * @param {*} event 
     */
    #onDashboardPointerMove(event) {
        if (this.#zoomer_own_event) {
            this.#zoomer.handleMove(event);
        } else if (this.#pointer_down) {
            // 更新曲线的终点位置
            const curve = this.#renderer.curve_temp;
            const x = event.offsetX;
            const y = event.offsetY;
            const p = this.transformPointer(x, y);
            curve.x1 = p.x;
            curve.y1 = p.y;

            // 判断是否找到对应的另一个点
            let panel_port;
            if (this.#handled_panel_port.is_in_port) {
                const x = event.clientX;
                const y = event.clientY;
                panel_port = this.getPanelOutPortByPoint(x, y);
            } else if (this.#handled_panel_port.is_out_port) {
                const x = event.clientX;
                const y = event.clientY;
                panel_port = this.getPanelInPortByPoint(x, y);
            }

            // 取消之前的高亮
            if (this.#handled_panel_port_connector) {
                this.#handled_panel_port_connector.setDotHighlight(false);
            }

            // 找到了端口
            if (panel_port && panel_port.panel != this.#handled_panel_port.panel) {
                curve.setColorGreen();
                this.#handled_panel_port_connector = panel_port.port;
                this.#handled_panel_port_connector.setDotHighlight(true);
            } else {
                curve.setColorRed();
                this.#handled_panel_port_connector = undefined;
            }
            
            // 执行渲染
            this.#renderer.render();
        }
    }

    /**
     * 
     * 鼠标事件
     * 
     * @param {*} event 
     */
    #onDashboardPointerUp(event) {
        this.#dashboard.releasePointerCapture(event.pointerId);
        this.#pointer_down = false;
        if (this.#zoomer_own_event) {
            this.#zoomer_own_event = false;
            this.#zoomer.handleUp(event);
        } else {
            // 取消临时显示的曲线
            this.#renderer.curve_temp.reset();

            // 如果上下继都找到, 执行链接
            if (this.#handled_panel_port && 
                this.#handled_panel_port_connector) {
                this.#connectPorts(
                    this.#handled_panel_port, 
                    this.#handled_panel_port_connector);
            }

            // 重置
            if (this.#handled_panel_port) {
                this.#handled_panel_port.setDotHighlight(false);
                this.#handled_panel_port = undefined;
            }

            if (this.#handled_panel_port_connector) {
                this.#handled_panel_port_connector.setDotHighlight(false);
                this.#handled_panel_port_connector = undefined;
            }

            // 执行渲染
            this.#renderer.render();
        }
    }

    /**
     * 
     * 鼠标事件
     * 
     * @param {*} event 
     */
    #onDashboardWheel(event) {
        this.#zoomer.zoomWithWheel(event);
    }

    /**
     * 
     * pan zoom 改变了
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} scale 
     */
    #onPanzoomChange(x, y, scale) {
        this.#zoom_x = x;
        this.#zoom_y = y;
        this.#zoom_s = scale;
        if (this.#renderer) {
            this.#renderer.panZoom(x, y, scale);
            this.#renderer.render(false);
        }
    }

    /**
     * 
     * 链接 A B 两个端口
     * 
     * @param {*} a 
     * @param {*} b 
     */
    #connectPorts(a, b) {
        const i            = a.is_in_port? a : b;
        const o            = a.is_in_port? b : a;
        const i_panel_uuid = i.panel.uuid;
        const i_name       = i.name;
        const o_panel_uuid = o.panel.uuid;
        const o_name       = o.name;
        this.#topo.connect(o_panel_uuid, o_name, i_panel_uuid, i_name);
    }

    /**
     * 
     * 创建 Panel
     * 
     * @param {*} name 
     * @returns 
     */
    createPanel(name) {
        return PanelCreator(this.#context, this.#topo, name);
    }
}

CustomElementRegister(tagName, ShaderGraphEditor);
