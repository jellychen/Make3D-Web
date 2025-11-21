/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import * as XThree from 'three';
import Logger      from '@common/misc/logger';
import LoadTexture from '@core/cinderella/loader/loader-texture';

/**
 * Mixin
 */
Object.assign(XThree.MeshPhysicalMaterial.prototype, {
    /**
     * 类别
     */
    category : 'pbr',

    /**
     * 
     * 设置是不是平直着色
     * 
     * @param {boolean} flat 
     */
    setFlatShading(flat) {
        this.flatShading = true === flat;
        return this;
    },

    /**
     * 
     * 设置置换贴图
     * 
     * @param {*} texture 
     */
    setDisplacementTexture(texture) {
        if (texture == this.displacementMap) {
            return;
        }

        this.useTexture(texture);
        this.unuseTexture(this.displacementMap);
        this.displacementMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从URL中加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     */
    setDisplacementTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setDisplacementTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );

        return this;
    },

    /**
     * 
     * 设置缩放, 默认是 1
     * 
     * @param {Number} scale 
     */
    setDisplacementScale(scale) {
        this.displacementScale = scale;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置偏执，默认是 0
     * 
     * @param {Number} bias 
     */
    setDisplacementBias(bias) {
        this.displacementBias = bias;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置alpha
     * 
     * @param {*} alpha 
     * @returns 
     */
    setAlpha(alpha) {
        this.opacity = parseFloat(alpha);
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        if (this.color) {
            this.color.setHex(color);
            this.needsUpdate = true;
        } else {
            this.color = new XThree.Color(color);
            this.needsUpdate = true;
        }
        return this;
    },

    /**
     * 
     * 设置颜色贴图
     * 
     * @param {*} texture 
     */
    setColorTexture(texture) {
        if (texture == this.map) {
            return;
        }

        this.useTexture(texture);
        this.unuseTexture(this.map);
        this.map = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     */
    setColorTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setColorTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );

        return this;
    },

    /**
     * 
     * 设置高光颜色
     * 
     * @param {*} color 
     */
    setSpecularColor(color) {
        if (this.specularColor) {
            this.specularColor.setHex(color);
            this.needsUpdate = true;
        } else {
            this.specularColor = new XThree.Color(color);
            this.needsUpdate = true;
        }
        return this;
    },

    /**
     * 
     * 设置高光贴图
     * 
     * @param {*} texture 
     */
    setSpecularTexture(texture) {
        if (texture == this.specularColorMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.specularColorMap);
        this.specularColorMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     */
    setSpecularTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setSpecularTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );

        return this;
    },

    /**
     * 
     * 设置自发光的颜色
     * 
     * @param {*} color 
     */
    setEmissiveColor(color) {
        if (this.emissive) {
            this.emissive.setHex(color);
            this.needsUpdate = true;
        } else {
            this.emissive = new XThree.Color(color);
            this.needsUpdate = true;
        }
        return this;
    },

    /**
     * 
     * 设置自发光的图片
     * 
     * @param {*} texture 
     */
    setEmissiveTexture(texture) {
        if (texture == this.emissiveMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.emissiveMap);
        this.emissiveMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     */
    setEmissiveTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setEmissiveTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置发光颜色的强度，默认是 1
     * 
     * @param {Number} intensity 
     */
    setEmissiveIntensity(intensity) {
        this.emissiveIntensity = intensity;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置法线贴图
     * 
     * @param {*} texture 
     */
    setNormalTexture(texture) {
        if (texture == this.normalMap) {
            return this;
        }
        
        this.useTexture(texture);
        this.unuseTexture(this.normalMap);
        this.normalMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络中加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     */
    setNormalTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setNormalTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置法线的空间
     * 
     * XThree.TangentSpaceNormalMap  // 切线空间
     * XThree.ObjectSpaceNormalMap   // 局部坐标
     * 
     * @param {*} space 
     */
    setNormalTextureSpace(space) {
        this.normalMapType = space;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置法线贴图的法线的缩放
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setNormalScale(x, y) {
        this.normalScale.x = x;
        this.normalScale.y = y;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置 AO 贴图
     * 
     * @param {*} texture 
     */
    setAoTexture(texture) {
        if (texture == this.aoMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.aoMap);
        this.aoMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络中加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     */
    setAoTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setAoTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );

        return this;
    },

    /**
     * 
     * 设置 AO 贴图的强度
     * 
     * @param {Number} intensity 
     */
    setAoIntensity(intensity) {
        this.aoMapIntensity = intensity;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置金属性 0 - 1
     * 
     * @param {Number} value 
     */
    setMetalness(value) {
        this.metalness = value;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置金属性贴图
     * 
     * @param {*} texture 
     */
    setMetalnessTexture(texture) {
        if (texture == this.metalnessMap) {
            return this;
        }
        
        this.useTexture(texture);
        this.unuseTexture(this.metalnessMap);
        this.metalnessMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络中加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     */
    setMetalnessTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setMetalnessTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置粗糙度 0 - 1
     * 
     * @param {Number} value 
     */
    setRoughness(value) {
        this.roughness = value;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置粗糙度贴图
     * 
     * @param {*} texture 
     */
    setRoughnessMap(texture) {
        if (texture == this.roughnessMap) {
            return;
        }

        this.useTexture(texture);
        this.unuseTexture(this.roughnessMap);
        this.roughnessMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络中加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     */
    setRoughnessMapFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setRoughnessMap(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );

        return this;
    },

    /**
     * 
     * 设置清漆的强度
     * 
     * @param {Number} intensity 
     */
    setClearCoatIntensity(intensity) {
        this.clearcoat = intensity;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置清漆的强度
     * 
     * @param {*} intensity 
     */
    setClearCoat(intensity) {
        return this.setClearCoatIntensity(intensity);
    },

    /**
     * 
     * 设置清漆的强度贴图
     * 
     * @param {*} texture 
     */
    setClearCoatTexture(texture) {
        if (texture == this.clearcoatMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.clearcoatMap);
        this.clearcoatMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络中加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     */
    setClearCoatTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setClearCoatTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置清漆粗糙度
     * 
     * @param {Number} value 
     */
    setClearCoatRoughness(value) {
        this.clearcoatRoughness = value;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置清漆粗糙度贴图
     * 
     * @param {*} texture 
     */
    setClearCoatRoughnessTexture(texture) {
        if (texture == this.clearcoatRoughnessMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.clearcoatRoughnessMap);
        this.clearcoatRoughnessMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     * @returns 
     */
    setClearCoatRoughnessTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setClearCoatRoughnessTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置清漆法线贴图
     * 
     * @param {*} texture 
     */
    setClearCoatNormalTexture(texture) {
        if (texture == this.clearcoatNormalMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.clearcoatNormalMap);
        this.clearcoatNormalMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     * @returns 
     */
    setClearCoatNormalTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setClearCoatNormalTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置清漆法线贴图的缩放 0 - 1
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setClearCoatNormalScale(x, y) {
        this.clearcoatNormalScale.x = x;
        this.clearcoatNormalScale.y = y;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置光泽度 0 - 1
     * 
     * @param {Number} sheen 
     */
    setSheen(sheen) {
        this.sheen = sheen;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置光泽度颜色
     * 
     * @param {*} color 
     */
    setSheenColor(color) {
        if (this.sheenColor) {
            this.sheenColor.setHex(color);
            this.needsUpdate = true;
        } else {
            this.sheenColor = new XThree.Color(color);
            this.needsUpdate = true;
        }
        return this;
    },

    /**
     * 
     * 设置光泽度贴图
     * 
     * @param {*} texture 
     */
    setSheenColorTexture(texture) {
        if (texture == this.sheenColorMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.sheenColorMap);
        this.sheenColorMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     * @returns 
     */
    setSheenColorTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setSheenColorTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置光泽粗糙度 0 - 1
     * 
     * @param {Number} roughness 
     */
    setSheenRoughness(roughness) {
        this.sheenRoughness = roughness;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置光泽粗糙度贴图
     * 
     * @param {*} texture 
     */
    setSheenRoughnessTexture(texture) {
        if (texture == this.sheenRoughnessMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.sheenRoughnessMap);
        this.sheenRoughnessMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络中加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     * @returns 
     */
    setSheenRoughnessTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setSheenRoughnessTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );

        return this;
    },

    /**
     * 
     * 设置折射率 1.0 - 2.333
     * 
     * @param {Number} ior 
     */
    setIOR(ior) {
        this.ior = ior;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置厚度，默认是 0
     * 
     * @param {Number} thickness 
     */
    setThickness(thickness) {
        this.thickness = thickness;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置厚度贴图
     * 
     * @param {*} texture 
     */
    setThicknessTexture(texture) {
        if (texture == this.thicknessMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.thicknessMap);
        this.thicknessMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     * @returns 
     */
    setThicknessTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setThicknessTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置透视度，如果透视不是0 Opacity必须是1
     * 
     * @param {Number} transmission 
     */
    setTransmission(transmission) {
        this.transmission = transmission;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置透视度贴图
     * 
     * @param {*} texture 
     */
    setTransmissionTexture(texture) {
        if (texture == this.transmissionMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.transmissionMap);
        this.transmissionMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     * @returns 
     */
    setTransmissionTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setTransmissionTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置环境光贴图
     * 
     * @param {*} texture 
     */
    setEnvTexture(texture) {
        if (texture != this.envMap) {
            return this;
        }

        this.useTexture(texture);
        this.unuseTexture(this.envMap);
        this.envMap = texture;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 从网络中加载
     * 
     * @param {*} url 
     * @param {*} request_next_frame 
     * @returns 
     */
    setEnvTextureFromUrl(url, request_next_frame = undefined) {
        if (typeof url !== 'string') {
            return;
        }

        request_next_frame = request_next_frame || (() => {});

        // load
        LoadTexture.fromUrl(
            url,

            // success
            texture => {
                this.setEnvTexture(texture);
                request_next_frame();
                Logger.logLoadUrlSuccess(url);
            },

            undefined,

            // fail
            () => {
                request_next_frame();
                Logger.logLoadUrlFail(url);
            }
        );
        
        return this;
    },

    /**
     * 
     * 设置环境光贴图的强度
     * 
     * @param {Number} intensity 
     */
    setEnvTextureIntensity(intensity) {
        this.envMapIntensity = intensity;
        this.needsUpdate = true;
        return this;
    },

    /**
     * 
     * 设置衰减颜色
     * 
     * @param {*} color 
     * @returns 
     */
    setAttenuationColor(color) {
        if (this.attenuationColor) {
            this.attenuationColor.setHex(color);
            this.needsUpdate = true;
        } else {
            this.attenuationColor = new XThree.Color(color);
            this.needsUpdate = true;
        }
        return this;
    },

    /**
     * 
     * 获取
     * 
     * @param {*} distance 
     * @returns 
     */
    setAtDistance(distance) {
        this.attenuationDistance = distance;
        this.needsUpdate = true;
        return this;
    }
});

export default XThree.MeshPhysicalMaterial;
