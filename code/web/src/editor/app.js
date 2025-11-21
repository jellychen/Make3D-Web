/* eslint-disable no-unused-vars */

import GlobalTheme from '@common/global-theme';
import XTHREE      from '@xthree';

/**
 * 入口
 */
export default class APP {
    /**
     * 元素
     */
    #container;

    /**
     * 核心模块
     */
    #core_module = undefined;

    /**
     * 构造函数
     */
    constructor() {
        this.#container = document.body.querySelector('#container');
    }

    /**
     * 启动函数
     */
    async start() {
        // ==================================================================================
        // 用来限制最大的多线程数量
        // ==================================================================================
        const __max_concurrency__ = Math.min(
            parseInt(__MAX_CONCURRENCY__), navigator.hardwareConcurrency);
        Object.defineProperty(navigator, 'hardwareConcurrency', {
            get: () => __max_concurrency__
        });

        // ==================================================================================
        // 设置主题
        // ==================================================================================
        GlobalTheme.setDark();

        // ==================================================================================
        // 防止出现触控板等缩放网页
        // ==================================================================================
        window.addEventListener('wheel', function(event) {
            if (event.ctrlKey === true) { 
                event.preventDefault();
            }
        }, { passive: false });

        // ==================================================================================
        // 防止出现页面直接退出
        // ==================================================================================
        // window.addEventListener("beforeunload", (event) => {
        //     event.preventDefault();
        //     event.returnValue = "";
        // });

        // ==================================================================================
        // 设置使用的图形接口
        // ==================================================================================
        const urlSearchParams = new URLSearchParams(new URL(window.location).search);
        if (!urlSearchParams.has('force-webgpu')) {
            XTHREE.setDefault('webgl');
            console.log("Using webgl backend");
        } else {
            XTHREE.setDefault('webgpu');
            console.log("Using webgpu backend, if browser allowed");
        }

        // ==================================================================================
        // 异步加载
        // ==================================================================================
        await import(/* webpackChunkName: "workbench.core" */ './app-core-module')
            .then(({ AppCoreModule }) => {
                this.#core_module = new AppCoreModule(this.#container);
                this.#core_module.start();
            });
    }
}

