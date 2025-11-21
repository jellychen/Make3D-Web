/* eslint-disable no-unused-vars */

import XThree                from '@xthree/basic';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Loader                from '@core/cinderella/loader/loader';
import ImageViewMesh         from '@core/cinderella/mesh/image.view';
import ModelLoader           from './model-loader';
import M3dLoader             from './m3d-loader';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-droppers-receiver';

/**
 * 文件拖动到这里
 * 
 * 接受文件类型： png jpg jpeg bmp / obj fbx gltf stl
 * 
 */
export default class DroppersReceiver extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 场景
     */
    #scene;

    /**
     * 元素
     */
    #container;
    #zone;
    #close;
    #add_;
    #tips_container;
    #file_input;

    /**
     * 模型加载
     */
    #model_loader;

    /**
     * m3d 加载
     */
    #m3d_loader;

    /**
     * 事件回调
     */
    #on_dismiss = event => this.#onClickDismiss(event);

    /**
     * 获取
     */
    get container() {
        return this.#container;
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
        this.#scene = this.#coordinator.scene;
        this.#model_loader = new ModelLoader(coordinator, this.#scene);
        this.#m3d_loader   = new M3dLoader  (coordinator, this.#scene);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container      = this.getChild('#container');
        this.#zone           = this.getChild('#zone');
        this.#close          = this.getChild('#close-btn');
        this.#add_           = this.getChild('#add');
        this.#tips_container = this.getChild('#tips-container');
        this.#file_input     = this.getChild('#file-input');
        ["dragenter", "dragover", "dragleave", "drop"].forEach(event_name => {
            this.#zone.addEventListener(event_name, event => {
                event.preventDefault();
                event.stopPropagation();
            }, false);
        });

        this.onclick              = event => this.dismiss();
        this.#container.onclick   = event => event.stopPropagation();
        this.#zone.ondragenter    = event => this.#onDragEnter(event);
        this.#zone.ondragover     = event => this.#onDragOver(event);
        this.#zone.ondragleave    = event => this.#onDragLeave(event);
        this.#zone.ondrop         = event => this.#onDrop(event);
        this.#close.onclick       = event => this.dismiss();
        this.#add_.onclick        = event => this.#onAddClick(event);
        this.#file_input.onchange = event => this.#onFileInputChanged(event);
    }

    /**
     * 元素添加到DOM上面的回调
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
        Animation.Try(this.#container, {
            opacity   : [0, 1],
            translateY: [-60, 0],
            duration  : 200,
            easing    : 'easeOutCubic',
        });
    }

    /**
     * 元素从Dom上面移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} show 
     */
    #showDropZoneHighlight(color) {
        if (color) {
            this.#zone.setAttribute('highlight', color);
        } else {
            this.#zone.removeAttribute('highlight');
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onDragEnter(event) {
        event.preventDefault();
        this.#showDropZoneHighlight('green');
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onDragOver(event) {
        event.preventDefault();
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onDragLeave(event) {
        event.preventDefault();
        this.#showDropZoneHighlight(undefined);
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    async #onDrop(event) {
        event.preventDefault();
        this.#showDropZoneHighlight(undefined);

        // 记录插入的元素格式
        let inserted_elements_count = 0;
        
        // 遍历所有的文件
        const files = event.dataTransfer.files;
        for (const file of files) {
            const name = file.name;
            const extension = name.substring(name.lastIndexOf(".") + 1);
            const ext = extension.toLowerCase();
            switch (ext) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'bmp':
                this.#insertImage(file);
                inserted_elements_count++;
                break;

            case 'obj':
            case 'stl':
            case 'fbx':
            case 'gltf':
            case 'glb':
                this.#insertModel(file, ext);
                inserted_elements_count++;
                break;

            case 'm3d':
                await this.#m3d_loader.load_M3d(file);
                break;
            }
        }

        // 如果成功插入的元素超过1个
        if (inserted_elements_count > 0) {
            this.#blinkTips();
        }

        this.deferDismiss();
    }

    /**
     * 
     * 点击按钮
     * 
     * @param {*} event 
     */
    #onAddClick(event) {
        this.#file_input.click();
    }

    /**
     * 
     * 输入文件发生了变化
     * 
     * @param {*} event 
     */
    async #onFileInputChanged(event) {
        const files = event.target.files;
        for (const file of files) {
            const name = file.name;
            const extension = name.substring(name.lastIndexOf(".") + 1);
            const ext = extension.toLowerCase();
            switch (ext) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'bmp':
                this.#insertImage(file);
                break;
    
            case 'obj':
            case 'stl':
            case 'fbx':
            case 'gltf':
            case 'glb':
                this.#insertModel(file, ext);
                break;
    
            case 'm3d':
                await this.#m3d_loader.load_M3d(file);
                break;
            }
        }
        this.deferDismiss();
    }

    /**
     * 
     * 加载一张图片
     * 
     * @param {*} file 
     */
    #insertImage(file) {
        Loader.loadTextureData(file, (texture) => {
            if (!(texture instanceof XThree.Texture)) {
                return;
            } else {
                texture.flipY = false;
                texture.colorSpace = 'srgb-linear';

                const mesh = new ImageViewMesh();
                mesh.setTexture(texture);
                this.#scene.add(mesh);
                this.#coordinator.renderNextFrame();
            }
        });
    }

    /**
     * 
     * 加载一个模型
     * 
     * @param {*} file 
     * @param {*} ext 
     */
    #insertModel(file, ext) {
        switch (ext) {
        case 'obj':
            this.#model_loader.load_OBJ(file);
            break;

        case 'stl':
            this.#model_loader.load_STL(file);
            break;

        case 'fbx':
            this.#model_loader.load_FBX(file);
            break;

        case 'gltf':
        case 'glb':
            this.#model_loader.load_GLTF_GLB(file);
            break;
        }
    }

    /**
     * 闪烁
     */
    #blinkTips() {
        setTimeout(() => this.#tips_container.style.visibility = "hidden", 1500);
        this.#tips_container.style.visibility = "visible";
    }

    /**
     * 
     * 点击了销毁
     * 
     * @param {*} event 
     */
    #onClickDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        this.dismiss();
    }

    /**
     * 
     * 延迟销毁
     * 
     * @param {*} time 
     */
    deferDismiss(time) {
        setTimeout(() => this.dismiss(), time);
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Try(this.#container, {
            opacity   : [1, 0],
            duration  : 200,
            easing    : 'easeOutCubic',
            onComplete: () => {
                this.remove();
            }
        });
    }
}

CustomElementRegister(tagName, DroppersReceiver);
