/* eslint-disable no-unused-vars */

import isUndefined            from 'lodash/isUndefined';
import GlobalBroadcastChannel from '@common/global-broadcast-channel';
import Fireworks              from '@common/misc/fireworks';
import SystemEventInterceptor from '@common/misc/system-event-interceptor';
import GlobalScope            from '@common/global-scope';
import TaskGroup              from '@common/misc/task-group';
import ResizeObserver         from 'resize-observer-polyfill';
import Bowser                 from 'bowser';

import '@common';
import '@assets';
import '@assets/import.css';
import '@ux';

import CoreInitialization        from '@core/initialization';
import HoudiniLoader             from '@core/houdini';
import HoudiniScopedParameters   from '@core/houdini/scoped-parameters';
import ShowIntroducer            from '@core/introducer';
import ShowOperatingInstructions from '@editor/arena/operating-instructions';
import ShowLogin                 from '@editor/arena/login';
import ShowLauncherLoading       from '@editor/arena/launcher-loading';
import User                      from '@editor/dao/model/user';
import ShowVIP                   from '@editor/arena/vip';
import InspectorSupervisor       from './arena/inspector-supervisor';

/// #if BUILD_FOR === 'electron'
import NCBar                     from '@editor/arena/ncbar';
/// #endif

/**
 * 核心，异步加载的
 */
export class AppCoreModule {
    /**
     * 浏览器
     */
    #browser;

    /**
     * 核心元素
     */
    #arena;

    /**
     * 系统事件拦截
     */
    #sysetm_event_interceptor;

    /**
     * 界面核心元素
     */
    #container;

    /**
     * 
     * 构造函数
     * 
     * @param {*} container 
     */
    constructor(container) {
        this.#container = container;
    }

    /**
     * 
     * 启动
     * 
     */
    start() {
        // ==================================================================================
        //
        // 开发模式
        //
        // ==================================================================================
        if (__PRODUCTION_UI__) {
            console.log("PRODUCTION Mode");
        } else {
            console.log("DEV Mode");
        }

        // ==================================================================================
        //
        // 浏览器
        //
        // "EdgeHTML"   Edge浏览器内置引擎
        // "Trident"    IE浏览器内置引擎
        // "Presto"     Opera浏览器内置引擎
        // "WebKit"     开源浏览器引擎
        // "Blink"      Google基于WebKit开发引擎
        // "Gecko"      Mozilla内置引擎
        // "KHTML"      KDE网页排版引擎
        //
        // ==================================================================================
        this.#browser = Bowser.getParser(window.navigator.userAgent).parsedResult;

        // ==================================================================================
        // 判断浏览器是不是在支持的范围内
        // ==================================================================================
        if (this.#browser === "Trident"|| 
            this.#browser === "Presto" ||
            this.#browser === "KHTML") {
            return;
        }

        // ==================================================================================
        // Polyfill系统的一些缺失
        // ==================================================================================
        if (!window.ResizeObserver) {
            window.ResizeObserver = ResizeObserver;
        }

        // ==================================================================================
        // 拦截默认的系统的快捷键
        // ==================================================================================
        this.#sysetm_event_interceptor = new SystemEventInterceptor();
        this.#sysetm_event_interceptor.enable(true);

        // ==================================================================================
        // 如果是Electron Node就隐藏 Node
        // ==================================================================================
        if (typeof process !== 'undefined') {
            console.log(process.versions.node);
            try {
                delete process.versions.node;
            } catch(e) {
                Object.defineProperty(process.versions, 'node', {
                    get: () => undefined
                });
            }
        }
        
        // ==================================================================================
        // 一组任务
        // ==================================================================================
        const task_group = new TaskGroup(() => {
            this.#onStart();
        });

        // ==================================================================================
        // 任务1：加载wasm内核
        // ==================================================================================
        const task_0 = task_group.newTask();
        HoudiniLoader((success, module) => {
            if (success) {
                module._info();
                module.Initialize.init();
                module.Initialize.init_async(success => {
                    GlobalScope.Chameleon = GlobalScope.chameleon = module;
                    GlobalScope.ChameleonScopedParameters = HoudiniScopedParameters;
                    GlobalScope.ChameleonScopedParameters.__setup_ifneed__();
                    task_0.success();
                });
            } else {
                alert("Load Wasm Fail!!!");
                task_0.fail();
            }
        }, window.crossOriginIsolated);

        // ==================================================================================
        // 任务2：内核初始化
        // ==================================================================================
        const task_1 = task_group.newTask();
        CoreInitialization(
            () => {
                task_1.success();
            }, 
            () => {
                task_1.fail();
            }
        );
    }

    /**
     * 执行加载
     */
    async #onStart() {
        // ==================================================================================
        // 异步加载JS核心逻辑模块
        // ==================================================================================
        const Arena = await import(/* webpackChunkName: "workbench.core.arena" */ './arena/v');
        this.#arena = new Arena.default();

        // 异步初始化
        await this.#arena.init();

        // 协调器
        const coordinator = this.#arena.coordinator;

        // 显示NCBar
/// #if BUILD_FOR === 'electron'
        NCBar.setup();
/// #endif

        // 插入DOM
        const container = this.#container;
        while (container.hasChildNodes()) {
            container.removeChild(container.firstChild);
        }
        this.#arena.appendToParentNode(container);

        // ==================================================================================
        // 防止用户打开Inspector
        // ==================================================================================
        InspectorSupervisor();

        // ==================================================================================
        // 判断是不是Figma
        // ==================================================================================
        if (!isUndefined(window.isFigmaPlugin) && window.isFigmaPlugin) {
            // Figma.invoke('resize', {
            //     width : 1200,
            //     height: 800,
            // });
            // ShowFigmaReminder();
            // ShowFigmaResizer ();
            // await Figma.invoke('init', {});
            // await FigmaUser.tryGet();
        }

        //
        // 如果不是figma，判断是否已经登录过了
        //
        else {
            //
            // 显示加载态
            //
            const loading = ShowLauncherLoading();

            //
            // 刷新登录态度
            //
            if (await User.Refresh()) {
                await User.RefreshUseRecoder();
                loading.dispose();
                ShowOperatingInstructions(coordinator);
                ShowIntroducer();
            }

            //
            // 拿不到登录的数据，显示登录框
            //
            else {
                
                loading.dispose();

                //
                // 启动
                //
                // const url = new URL(window.location.href);
                // if (url.searchParams.has('dev')) {
                //     ShowOperatingInstructions(coordinator);
                //     ShowIntroducer();
                // } else {
                //     const login = ShowLogin();
                //     if (login) {
                //         login.on_success = () => {
                //             ShowOperatingInstructions(coordinator);
                //             ShowIntroducer();
                //         }
                //     }
                // }
            }
        }

        // ==================================================================================
        // 监听VIP权益
        // ==================================================================================
        GlobalBroadcastChannel.addEventListener('refresh-vip', async () => {
            //
            // 放烟花
            //
            Fireworks.SchoolPride(6000);
            
            //
            // 显示VIP
            //
            setTimeout(() => ShowVIP(), 800);

            //
            // 刷新
            //
            await User.RefreshVip();
        });
    }
}
