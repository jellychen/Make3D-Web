/* eslint-disable no-unused-vars */

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

/**
 * 核心，异步加载的
 */
export class AppCoreModule {
    /**
     * 核心元素
     */
    #arena;

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 异步启动
     */
    async start() {
        // ==================================================================================
        // 一组任务
        // ==================================================================================
        const task_group = new TaskGroup(() => {
            this.#onLoadSuccess();
        });

        // ==================================================================================
        // 任务1：加载wasm内核
        // ==================================================================================
        const task_0 = task_group.newTask();
        HoudiniLoader((success, module) => {
            if (success) {
                module._info();
                module.Initialize.init();
                module.Initialize.init_async((success) => {
                    GlobalScope.Chameleon = GlobalScope.chameleon = module;
                    GlobalScope.ChameleonScopedParameters = HoudiniScopedParameters;
                    GlobalScope.ChameleonScopedParameters.setup();
                    task_0.success();
                });
            } else {
                task_0.fail();
                alert("Network error, Load Fail!!!");
            }
        }, window.crossOriginIsolated);

        // ==================================================================================
        // 任务2：内核初始化
        // ==================================================================================
        const task_1 = task_group.newTask();
        CoreInitialization(() => task_1.success(), () => task_1.fail());
    }

    /**
     * 加载成功
     */
    async #onLoadSuccess() {
        // ==================================================================================
        // 异步加载JS核心逻辑模块
        // ==================================================================================
        const Arena = await import(/* webpackChunkName: "repairman.core.arena" */ './arena/v');
        this.#arena = new Arena.default();

        // 插入DOM
        while (document.body.hasChildNodes()) {
            document.body.removeChild(document.body.firstChild);
        }
        document.body.appendChild(this.#arena);
    }
}
