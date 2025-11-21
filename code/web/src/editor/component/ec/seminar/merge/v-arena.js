/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Element               from '@ux/base/element';
import EditableMesh          from '@core/cinderella/mesh/editable';
import MeshFromSoup          from '@core/misc/mesh-from-soup';
import RendererView          from './renderer/v';
import Performer             from './performer';
import Prompt                from './v-prompt';
import Html                  from './v-arena-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-merge-arena';

/**
 * Arena
 */
export default class Arena extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 宿主
     */
    #host;

    /**
     * 元素
     */
    #container;
    #close;
    #renderer_view;
    #commit;

    /**
     * 合并后的soup
     */
    #soup;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} host 
     */
    constructor(coordinator, host) {
        super(tagName);
        this.#coordinator = coordinator;
        this.#host = host;
        this.createContentFromTpl(tpl);
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container      = this.getChild('#container');
        this.#close          = this.getChild('#close-btn');
        this.#renderer_view  = this.getChild('#renderer-view');
        this.#commit         = this.getChild('#commit');
        this.#close.onclick  = () => this.#onClickCloseBtn();
        this.#commit.onclick = () => this.#onClickCommit();

        // 显示
        const prompt = new Prompt(this.#coordinator);
        prompt.show();
        prompt.on_cancel = () => {
            this.remove();
            this.returnToDefaultEditeMode();
        };

        prompt.on_confirm = () => {
            const soup = prompt.soup;
            if (soup) {
                this.#renderer_view.setSoup(soup);
                this.#soup = soup.clone();
            }

            this.#container.style.display = 'flex';
            Animation.Try(this.#container, {
                duration   : 300,
                easing     : 'out',
                translateY : [30, 0],
                opacity    : [0.3, 1],
                onComplete : () => {
                    ;
                }
            });
        };
    }

    /**
     * 
     * 显示
     * 
     * @param {*} parentNode 
     */
    show(parentNode) {
        if (!parentNode) {
            parentNode = document.body;
        }
        parentNode.appendChild(this);
    }

    /**
     * 点击关闭按钮
     */
    #onClickCloseBtn() {
        this.returnToDefaultEditeMode();
        this.dismiss();
    }

    /**
     * 点击提交
     */
    #onClickCommit() {
        if (!this.#soup) {
            return;
        }

        // 构建 Mesh
        const mesh = new EditableMesh();
        mesh.setName('Merged');
        mesh.updateWorldMatrix(true, false);

        MeshFromSoup(mesh, this.#soup);

        this.#coordinator.scene.add(mesh);
        this.#coordinator.selected_container.replace(mesh);
        this.#coordinator.updateTransformer();
        this.#coordinator.markTreeViewNeedUpdate(true);
        this.#coordinator.renderNextFrame();

        // 销毁自己
        this.returnToDefaultEditeMode();
        this.dismiss();
    }

    /**
     * 回滚到默认的模式
     */
    returnToDefaultEditeMode() {
        this.#host.returnToDefaultEditeMode();
    }

    /**
     * 销毁
     */
    dismiss() {
        if (this.#soup) {
            this.#soup.delete();
            this.#soup = undefined;
        }
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, Arena);
