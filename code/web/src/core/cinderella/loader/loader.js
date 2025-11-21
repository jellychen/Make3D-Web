
import XThree from '@xthree/basic';

import { RGBELoader  } from 'three/addons/loaders/RGBELoader' ;
import { OBJLoader   } from 'three/addons/loaders/OBJLoader'  ;
import { STLLoader   } from 'three/addons/loaders/STLLoader'  ;
import { FBXLoader   } from 'three/addons/loaders/FBXLoader'  ;
import { GLTFLoader  } from 'three/addons/loaders/GLTFLoader' ;
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';

import LoaderManager   from './loader-manager';

/**
 * 预先生成
 */
const Loader_File    = new XThree.FileLoader(LoaderManager);
const Loader_Texture = new XThree.TextureLoader(LoaderManager);
const Loader_Image   = new XThree.ImageLoader(LoaderManager);
const Loader_HDR     = new RGBELoader(LoaderManager);
const Loader_OBJ     = new OBJLoader(LoaderManager);
const Loader_STL     = new STLLoader(LoaderManager);
const Loader_FBX     = new FBXLoader(LoaderManager);
const Loader_GLTF    = new GLTFLoader(LoaderManager);
const Loader_Draco   = new DRACOLoader();

// 初始化 Draco
Loader_Draco.setDecoderPath('/assets/draco/');
Loader_GLTF .setDRACOLoader(Loader_Draco);

/**
 * 统一加载器
 */
export default class Loader {
    /**
     * 
     * 从URL中加载文件
     * 
     * @param {string} url 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadFileUrl(url, on_success, on_fail) {
        return Loader_File.load(url, on_success, undefined, on_fail);
    }

    /**
     * 
     * 从本地加载文件
     * 
     * @param {data} data 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadFileData(data, on_success, on_fail) {
        const token = LoaderManager.addData(data);
        const ca = (data) => {
            LoaderManager.dispose(token);
            if (on_success) {
                on_success(data);
            }
        };
        const cb = () => {
            LoaderManager.dispose(token);
            if (on_fail) {
                on_fail();
            }
        };
        return Loader_File.load(token, ca, undefined, cb);
    }

    /**
     * 
     * 从URL中加载纹理
     * 
     * @param {string} url 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadTextureUrl(url, on_success, on_fail) {
        return Loader_Texture.load(url, on_success, undefined, on_fail);
    }

    /**
     * 
     * 从本地加载数据
     * 
     * @param {data} data 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadTextureData(data, on_success, on_fail) {
        const token = LoaderManager.addData(data);
        const ca = (texture) => {
            LoaderManager.dispose(token);
            if (on_success) {
                on_success(texture);
            }
        };
        const cb = () => {
            LoaderManager.dispose(token);
            if (on_fail) {
                on_fail();
            }
        };
        return Loader_Texture.load(token, ca, undefined, cb);
    }

    /**
     * 
     * 从URL中加载图片
     * 
     * @param {string} url 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadImageUrl(url, on_success, on_fail) {
        return Loader_Image.load(url, on_success, undefined, on_fail);
    }

    /**
     * 
     * 从数据中加载
     * 
     * @param {data} data 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadImageData(data, on_success, on_fail) {
        const token = LoaderManager.addData(data);
        const ca = () => {
            LoaderManager.dispose(token);
            if (on_success) {
                on_success();
            }
        };
        const cb = () => {
            LoaderManager.dispose(token);
            if (on_fail) {
                on_fail();
            }
        };
        return Loader_Image.load(token, ca, undefined, cb);
    }

    /**
     * 
     * 从Url加载Hdr
     * 
     * @param {string} url 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadHdrUrl(url, on_success, on_fail) {
        return Loader_HDR.load(url, on_success, undefined, on_fail);
    }

    /**
     * 
     * 从数据中加载
     * 
     * @param {data} data 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadHdrData(data, on_success, on_fail) {
        const token = LoaderManager.addData(data);
        const ca = (texture) => {
            LoaderManager.dispose(token);
            if (on_success) {
                on_success(texture);
            }
        };
        const cb = () => {
            LoaderManager.dispose(token);
            if (on_fail) {
                on_fail();
            }
        };
        return Loader_HDR.load(token, ca, undefined, cb);
    }

    /**
     * 
     * 从URL中加载Object
     * 
     * @param {string} url 
     * @param {function} on_success 
     * @param {function} on_fail 
     * @returns 
     */
    static loadObjectUrl(url, on_success, on_fail) {
        return Loader_OBJ.load(url, on_success, undefined, on_fail);
    }

    /**
     * 
     * 从本地加载数据
     * 
     * @param {data} data 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadObjectData(data, on_success, on_fail) {
        const token = LoaderManager.addData(data);
        const ca = (object) => {
            LoaderManager.dispose(token);
            if (on_success) {
                on_success(object);
            }
        };
        const cb = () => {
            LoaderManager.dispose(token);
            if (on_fail) {
                on_fail();
            }
        };
        return Loader_OBJ.load(token, ca, undefined, cb);
    }

    /**
     * 
     * 从URL中加载Stl
     * 
     * @param {string} url 
     * @param {function} on_success 
     * @param {function} on_fail 
     * @returns 
     */
    static loadStlUrl(url, on_success, on_fail) {
        return Loader_STL.load(url, on_success, undefined, on_fail);
    }

    /**
     * 
     * 从本地加载数据
     * 
     * @param {data} data 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadStlData(data, on_success, on_fail) {
        const token = LoaderManager.addData(data);
        const ca = (object) => {
            LoaderManager.dispose(token);
            if (on_success) {
                on_success(object);
            }
        };
        const cb = () => {
            LoaderManager.dispose(token);
            if (on_fail) {
                on_fail();
            }
        };
        return Loader_STL.load(token, ca, undefined, cb);
    }

    /**
     * 
     * 从URL中加载Fbx
     * 
     * @param {string} url 
     * @param {function} on_success 
     * @param {function} on_fail 
     * @returns 
     */
    static loadFbxUrl(url, on_success, on_fail) {
        return Loader_FBX.load(url, on_success, undefined, on_fail);
    }

    /**
     * 
     * 从本地加载数据
     * 
     * @param {data} data 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadFbxData(data, on_success, on_fail) {
        const token = LoaderManager.addData(data);
        const ca = (object) => {
            LoaderManager.dispose(token);
            if (on_success) {
                on_success(object);
            }
        };
        const cb = () => {
            LoaderManager.dispose(token);
            if (on_fail) {
                on_fail();
            }
        };
        return Loader_FBX.load(token, ca, undefined, cb);
    }

    /**
     * 
     * 从本地加载数据
     * 
     * @param {data} data 
     * @param {function} on_success 
     * @param {function} on_fail 
     */
    static loadGLTFData(data, on_success, on_fail) {
        const token = LoaderManager.addData(data);
        const ca = (object) => {
            LoaderManager.dispose(token);
            if (on_success) {
                on_success(object);
            }
        };
        const cb = () => {
            LoaderManager.dispose(token);
            if (on_fail) {
                on_fail();
            }
        };
        return Loader_GLTF.load(token, ca, undefined, cb);
    }

    /**
     * 
     * 从URL中加载gltf
     * 
     * @param {string} url 
     * @param {function} on_success 
     * @param {function} on_fail 
     * @returns 
     */
    static loadGLTFUrl(url, on_success, on_fail) {
        return Loader_GLTF.load(url, on_success, undefined, on_fail);
    }
}
