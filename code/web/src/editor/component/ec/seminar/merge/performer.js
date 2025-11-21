/* eslint-disable no-unused-vars */

import isFunction              from 'lodash/isFunction';
import GlobalScope             from '@common/global-scope';
import FrameAnimationGenerator from '@common/misc/frame-animation-generator';
import ParametersScoped        from '@core/houdini/scoped-parameters';

/**
 * 执行器
 */
export default class Performer {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 存储需要更新的网格
     */
    #meshes = [];

    /**
     * 可编辑网格数量
     */
    #editable_meshed_count = 0;

    /**
     * 执行器
     */
    #frame_animation_generator;

    /**
     * 合并器
     */
    #merger;

    /**
     * 合并后的Soup
     */
    #merged_soup;

    /**
     * 获取
     */
    get meshes() {
        return this.#meshes;
    }

    /**
     * 获取
     */
    get editable_meshed_count() {
        return this.#editable_meshed_count;
    }

    /**
     * 判断
     */
    get empty() {
        return this.#meshes.length == 0;
    }

    /**
     * 获取
     */
    get merged_soup() {
        return this.#merged_soup;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} recursion 
     */
    constructor(coordinator, recursion=false) {
        this.#coordinator = coordinator;

        //
        // 统计
        //
        const travel = object => {
            if (!object.visible || !object.isEditableMesh) {
                return;
            }

            // 新增
            this.#editable_meshed_count++;

            // 处理元素
            this.#meshes.push(object);

            // 递归
            if (recursion) {
                for (const child of object.children) {
                    travel(child);
                }
            }
        };
        this.#coordinator.selected_container.foreach(travel)
    }

    /**
     * 网格迭代器
     */
    *meshIterator() {
        for (const mesh of this.#meshes) {
            yield mesh;
        }
    }

    /**
     * 
     * 接受到
     * 
     * @param {*} mesh 
     */
    #onRecvMesh(mesh) {
        const soup = mesh.getEditableSoup();
        if (!soup) {
            return;
        }
        ParametersScoped.setMat4(0, mesh.getMatrixWorld(true));
        this.#merger.addPS0(soup.getPtr());
    }

    /**
     * 结束
     */
    #onFinish() {
        if (this.#merger) {
            this.#merged_soup = this.#merger.build();
            this.#merger.delete();
            this.#merger = undefined;
        }
    }

    /**
     * 
     * 执行
     * 
     * @param {*} callback 
     * @param {*} finish_callback 
     */
    start(callback, finish_callback) {
        if (this.#frame_animation_generator) {
            throw new Error("frame_animation_generator already exist");
        }

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoupMerger,
        } = Chameleon;
        this.#merger = GeoSolidSoupMerger.MakeShared();
        this.#frame_animation_generator = new FrameAnimationGenerator(
            this.meshIterator(),
            mesh => {
                this.#onRecvMesh(mesh);
                if (isFunction(callback)) {
                    callback(mesh);
                }
            },
            () => {
                this.#onFinish();
                if (isFunction(finish_callback)) {
                    finish_callback();
                }
            });
        this.#frame_animation_generator.start();
    }

    /**
     * 取消执行
     */
    cancel() {
        if (this.#merger) {
            this.#merger.delete();
            this.#merger = undefined;
        }

        if (this.#frame_animation_generator) {
            this.#frame_animation_generator.cancel();
            this.#frame_animation_generator = undefined;
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.cancel();

        //
        // 释放
        //
        if (this.#merged_soup) {
            this.#merged_soup.delete();
            this.#merged_soup = undefined;
        }
    }
}
