/* eslint-disable no-unused-vars */

import GlobalTheme from '@common/global-theme';
import XThree      from '@xthree';

/**
 * 入口
 */
export default class APP {
    /**
     * 核心模块
     */
    #core_module;

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 启动函数
     */
    async start() {
        // 设置主题
        GlobalTheme.setDark();

        // 强制webgl
        XThree.setDefault('webgl');

        // 加载核心
        await import(/* webpackChunkName: "repairman.core" */ './app-core-module')
        .then(async ({ AppCoreModule }) => {
            this.#core_module = new AppCoreModule();
            await this.#core_module.start();
        });
    }
}

const app = new APP();
await app.start();
