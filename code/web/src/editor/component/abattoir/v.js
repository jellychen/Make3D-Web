/* eslint-disable no-unused-vars */

import isString                 from 'lodash/isString';
import isFunction               from 'lodash/isFunction';
import ResizeThrottling         from '@common/misc/resize-throttling';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import Cinderella               from '@/core/cinderella/isolate';
import Gizmo                    from './gizmo';
import KeyboardObserver         from './keyboard-observer';
import UpperSlotsContainer      from './upper-slots-container/v';
import EnvmapSelector           from './envmap-selector/v';
import MatcapSelector           from './matcap-selector/v';
import AbattoirToast            from './toast/v';
import Vision                   from './vision/v';
import KeyboardView             from './keyboard-v';
import RasterMode               from './raster-mode/v';
import Information              from './information/v';
import Dashboard                from './dashboard/v';
import Bottom                   from './bottom/v';
import ShowMaterialChangedAlert from './material-changed-alert';
import Cursor                   from './v-cursor';
import Html                     from './v-tpl.html';
import Hcss                     from "./v-tpl.html.css";
const tpl = ElementDomCreator.createTpl(Html, Hcss);
const tagName = 'x-biz-abattoir';

/**
 * 中间部分的画板
 */
export default class Abattoir extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 菜单的回调函数
     */
    #on_customize_menu_callback;

    /**
     * 元素
     */
    #container;

    /**
     * 元素
     */
    #core;
    #upper_slots;
    #canvas_container;
    #canvas;
    #canvas_focused_mask;
    #camera_preview;
    #gizmo;
    #gizmo_canvas;
    #vision;
    #raster_mode;

    /**
     * 显示选择的元素的信息
     */
    #information;

    /**
     * 记录获取焦点的时间
     */
    #on_fouces_time = 0;

    /**
     * 锚点
     */
    #anchor_l_t;        // 左上
    #anchor_l_c;        // 左中
    #anchor_l_b;        // 左下
    #anchor_t_c;        // 上中
    #anchor_r_t;        // 右上
    #anchor_r_t_inside; // 右上
    #anchor_r_c;        // 右中
    #anchor_r_b;        // 右下
    #anchor_b_c;        // 下中
    #anchor_c  ;        // 中间

    /**
     * 扩展槽
     */
    #extension_c_r;

    /**
     * 整体扩展
     */
    #slots;

    /**
     * 下方的dashboard
     */
    #dashboard;

    /**
     * 底部
     */
    #bottom;

    /**
     * 监控尺寸变换和截流
     */
    #resize_observer;
    #resize_throttling = new ResizeThrottling(200); // 默认截流200毫秒

    /**
     * 记录尺寸
     */
    #pixel_ratio = 1;
    #w = 0;
    #h = 0;

    /**
     * 鼠标样式设置
     */
    #cursor_setter;

    /**
     * 渲染器
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * 键盘监控
     */
    #keyboard_observer;

    /**
     * canvas 是不是拥有焦点
     */
    #canvas_has_focus = false;

    /**
     * 记录鼠标按下的位置
     */
    #canvas_pointer_down_pos_x = 0;
    #canvas_pointer_down_pos_y = 0;

    /**
     * 材质变动提醒宽
     */
    #material_changed_alert;

    /**
     * 判断是否获得了焦点
     */
    get is_focused() {
        return this.#canvas === this.shadow.activeElement;
    }

    /**
     * 获取上次获得焦点的时间
     */
    get last_focused_time() {
        return this.#on_fouces_time;
    }

    /**
     * 获取场景
     */
    get scene() {
        return this.#cinderella.getScene();
    }

    /**
     * 获取内置渲染器
     */
    get cinderella() {
        return this.#cinderella;
    }

    /**
     * 获取配置
     */
    get cinderella_conf_context() {
        return this.#cinderella_conf_context;
    }

    /**
     * 获取容器
     */
    get container() {
        return this.#container;
    }

    /**
     * 获取右侧
     */
    get vision() {
        return this.#vision;
    }

    /**
     * 获取右侧扩展槽
     */
    get extension_contaienr_right() {
        return this.#extension_c_r;
    }

    /**
     * 获取
     */
    get upper_slots() {
        return this.#upper_slots;
    }

    /**
     * 获取
     */
    get canvas() {
        return this.#canvas;
    }

    /**
     * 锚点
     */
    get anchor_left_top() {
        return this.#anchor_l_t;
    }

    /**
     * 锚点
     */
    get anchor_top_left() {
        return this.#anchor_l_t;
    }

    /**
     * 锚点
     */
    get anchor_left_center() {
        return this.#anchor_l_c;
    }

    /**
     * 锚点
     */
    get anchor_left_bottom() {
        return this.#anchor_l_b;
    }

    /**
     * 锚点
     */
    get anchor_bottom_left() {
        return this.#anchor_l_b;
    }

    /**
     * 锚点
     */
    get anchor_top_center() {
        return this.#anchor_t_c;
    }

    /**
     * 锚点
     */
    get anchor_right_top() {
        return this.#anchor_r_t;
    }

    /**
     * 锚点
     */
    get anchor_right_top_insde() {
        return this.#anchor_r_t_inside;
    }

    /**
     * 锚点
     */
    get anchor_top_right() {
        return this.#anchor_r_t;
    }

    /**
     * 锚点
     */
    get anchor_top_right_inside() {
        return this.#anchor_r_t_inside;
    }

    /**
     * 锚点
     */
    get anchor_right_center() {
        return this.#anchor_r_c;
    }

    /**
     * 锚点
     */
    get anchor_right_bottom() {
        return this.#anchor_r_b;
    }

    /**
     * 锚点
     */
    get anchor_bottom_right() {
        return this.#anchor_r_b;
    }

    /**
     * 锚点
     */
    get anchor_bottom_center() {
        return this.#anchor_b_c;
    }

    /**
     * 锚点
     */
    get anchor_center() {
        return this.#anchor_c;
    }

    /**
     * 获取扩展槽
     */
    get slots() {
        return this.#slots;
    }

    /**
     * 获取
     */
    get core() {
        return this.#core;
    }

    /**
     * 获取
     */
    get dashboard() {
        return this.#dashboard;
    }

    /**
     * 获取
     */
    get bottom() {
        return this.#bottom;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.#resize_throttling.on_resize_begin = () => this.onResizeBegin();
        this.#resize_throttling.on_resize_end   = () => this.onResizeEnd();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();

        // 开启自定义菜单
        this.setEnableCustomizeMenu(true);

        // 获取元素
        this.#information         = this.getChild('#information');
        this.#container           = this.getChild('#container');
        this.#core                = this.getChild('#core');
        this.#upper_slots            = this.getChild('#upper-slots');
        this.#canvas_container    = this.getChild('#canvas-container');
        this.#canvas              = this.getChild('#canvas');
        this.#canvas_focused_mask = this.getChild('#cavans-focused-mask');
        this.#anchor_l_t          = this.getChild('#anchor-left-top');
        this.#anchor_l_c          = this.getChild('#anchor-left-center');
        this.#anchor_l_b          = this.getChild('#anchor-left-bottom');
        this.#anchor_t_c          = this.getChild('#anchor-top-center');
        this.#anchor_r_t          = this.getChild('#anchor-right-top');
        this.#anchor_r_t_inside   = this.getChild('#anchor-right-top-inside');
        this.#anchor_r_c          = this.getChild('#anchor-right-center');
        this.#anchor_r_b          = this.getChild('#anchor-right-bottom');
        this.#anchor_b_c          = this.getChild('#anchor-bottom-center');
        this.#anchor_c            = this.getChild('#anchor-center');
        this.#extension_c_r       = this.getChild('#right-extension-container');
        this.#slots               = this.getChild('#slots');
        this.#dashboard           = this.getChild('#dashboard');

        // 鼠标样式设置
        this.#cursor_setter = new Cursor(this.#core);
        this.#canvas.setCursor = type => {
            this.#cursor_setter.setCursor(type);
        };
        
        this.#canvas.onfocus = event => {
            this.#on_fouces_time = Date.now();
            this.#canvas_has_focus = true ;
            this.#canvas_focused_mask.style.opacity = 1;
            this.dispatchUserDefineEvent('onfocus', {});
        }

        this.#canvas.onblur  = event => {
            this.#canvas_has_focus = false;
            this.#canvas_focused_mask.style.opacity = 0;
            this.dispatchUserDefineEvent('onblur', {});
        }

        this.#canvas.onpointerdown = event => {
            this.#canvas_pointer_down_pos_x = event.clientX;
            this.#canvas_pointer_down_pos_y = event.clientY;
        };

        this.#canvas.onpointerup = event => {
            const x = event.clientX;
            const y = event.clientY;
            if (event.button == 2 && isFunction(this.#on_customize_menu_callback)) {
                if (this.#canvas_pointer_down_pos_x == x ||
                    this.#canvas_pointer_down_pos_y == y) {
                    this.#on_customize_menu_callback(event);
                }
            }
        };
        
        // Gizmo初始化
        this.#gizmo_canvas = this.getChild('#gizmo-canvas');
        this.#gizmo = new Gizmo(this.#gizmo_canvas);
        this.#gizmo.requestAnimationFrame();

        // vision
        this.#vision = this.getChild('#vision');

        // raster_mode
        this.#raster_mode = this.getChild('#raster-mode');

        // 监控键盘事件
        this.#keyboard_observer = new KeyboardObserver();
    }

    /**
     * 初始化
     */
    async init() {
        this.#cinderella = new Cinderella(this.#canvas);
        await this.#cinderella.init();
        this.#cinderella_conf_context = this.#cinderella.getConfContext();  // 配置管理器
        this.#cinderella_conf_context.setEnableCoordinate(true);            // 开启坐标网格
        this.#cinderella_conf_context.setEnableTransformer(false);          // 关闭变换组件
        this.#cinderella_conf_context.setEnableOutline(false);              // 关闭描边Pass
        this.#cinderella_conf_context.setEnableHaft(false);                 // 关闭Haft
        this.#cinderella_conf_context.setEnablePlaneDetector(false);        // 关闭渲染面侦测Pass
        this.#cinderella.addEventListener('view-changed', (event) => {
            this.#gizmo.setView(event.a, event.b);
        });
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
        this.#raster_mode.setCoordinator(coordinator);
        this.#vision.setCoordinator(coordinator);
        this.#information.setCoordinator(coordinator);
        return this;
    }

    /**
     * 执行加载
     */
    load() {
        this.#vision.load();
        return this;
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        // 设置canvas焦点
        this.#canvas.focus();

        // 监控渲染画布的尺寸的变化
        this.#resize_observer = new ResizeObserver(entries => {
            this.onResize();
        });
        this.#resize_observer.observe(this.#canvas_container);

        // 监控键盘事件
        this.#keyboard_observer.attach(document.body);

        // 显示展示默认材质
        this.showMaterialChangedAlert('raster');
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();

        // 移除监听
        if (this.#resize_observer) {
            this.#resize_observer.unobserve(this);
            this.#resize_observer.disconnect();
            this.#resize_observer = undefined;
        }
    }

    /**
     * 
     * 设置 vision 的可见性
     * 
     * @param {boolean} visible 
     */
    setVisionVisible(visible) {
        this.#vision.setVisible(true === visible);
    }

    /**
     * 
     * 获取使用的渲染器
     * 
     * @returns 
     */
    getTransformers() {
        return this.#cinderella;
    }

    /**
     * 
     * 获取鼠标样式
     * 
     * @returns 
     */
    getCursorType() {
        return this.#cursor_setter.type;
    }

    /**
     * 
     * 设置鼠标样式
     * 
     * pointer
     * pointer-3d
     * add
     * curve-move
     * curve
     * highlight
     * pen
     * pen-point
     * scissor
     * hand
     * hand-closed
     * knife
     * pencil
     * 
     * @param {string} type 
     */
    setCursor(type) {
        if (!isString(type) || !type) {
            this.setCursorDefault();
        } else {
            this.#cursor_setter.setCursor(type);
        }
    }

    /**
     * 设置默认的鼠标样式
     */
    setCursorDefault() {
        this.#cursor_setter.setCurosrDefault();
    }

    /**
     * 
     * 设置自定义菜单的回调函数
     * 
     * @param {*} callback 
     */
    setHookCustomizeMenuCallback(callback) {
        if (isFunction(callback)) {
            this.#on_customize_menu_callback = callback;
        } else {
            this.#on_customize_menu_callback = undefined;
        }
    }

    /**
     * 自定义菜单
     */
    onCustomizeMenu(event) {
        return true;
    }

    /**
     * 当尺寸发生变化开始的时候
     */
    onResizeBegin() {
        ;
    }

    /**
     * 当尺寸发生变化的时候
     */
    onResize() {
        this.#resize_throttling.resize();
        const ratio = window.devicePixelRatio || 1;
        const w = this.#canvas_container.offsetWidth;
        const h = this.#canvas_container.offsetHeight;
        this.#w = w;
        this.#h = h;
        this.#pixel_ratio = ratio;
        this.#canvas.style.width  =  `${w}px`;
        this.#canvas.style.height =  `${h}px`;
        this.#canvas.width  = ratio * w;
        this.#canvas.height = ratio * h;
        this.#cinderella.onResize(ratio, w, h);
        if (this.#camera_preview) {
            this.#camera_preview.onCanvasResize(ratio, w, h);
        }
    }

    /**
     * 当尺寸发生变化结束的时候
     */
    onResizeEnd() {
        ;
    }

    /**
     * 判断是不是获得焦点
     */
    isFocused() {
        return this.#canvas_has_focus;
    }

    /**
     * 
     * 显示材质发生了变化
     * 
     * @param {*} mode
     *          'raster'
     *          'performance' 
     *          'tracer'
     * @param {*} timeout 
     */
    showMaterialChangedAlert(mode, timeout = 1800) {
        if (this.#material_changed_alert) {
            this.#material_changed_alert.dismiss();
            this.#material_changed_alert = undefined;
        }
        this.#material_changed_alert = ShowMaterialChangedAlert(() => {
            this.#material_changed_alert = undefined;
        }, mode);
        this.#material_changed_alert.dismissAfter(timeout);
        this.#canvas_container.appendChild(this.#material_changed_alert);
    }
}

CustomElementRegister(tagName, Abattoir);
