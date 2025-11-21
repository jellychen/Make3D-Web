/* eslint-disable no-unused-vars */

import isArray          from "lodash/isArray";
import isString         from "lodash/isString";
import isUndefined      from "lodash/isUndefined";
import GlobalScope      from '@common/global-scope';
import ParametersScoped from '@core/houdini/scoped-parameters';

/**
 * 布尔
 */
export default class BooleanCoordinator {
    /**
     * 宿主
     */
    #host;

    /**
     * 容器
     */
    #receptacle;

    /**
     * wasm
     */
    #connector;

    /**
     * 
     */
    #boolean_type;
    #enum;

    /**
     * 获取当前的
     */
    get boolean_type() {
        return this.#enum;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} connector 
     */
    constructor(host, connector) {
        this.#host = host;
        this.#receptacle = host.receptacle;
        this.#connector = connector;

        // 初始值
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirBooleanEnum,
        } = Chameleon;
        this.#boolean_type = 'none';
    }

    /**
     * 
     * 设置 CSG 类型
     * 
     * @param {String} type 
     */
    setBooleanType(type) {
        if (!isString(type) || this.#boolean_type == type) {
            return false;
        }

        // 初始值
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirBooleanEnum,
        } = Chameleon;

        // CSG 类型
        switch (type) {
        case 'union':
            this.#enum = AbattoirBooleanEnum.UNION;
            this.#boolean_type = 'union';
            break;

        case 'intersection':
            this.#enum = AbattoirBooleanEnum.INTERSECTION;
            this.#boolean_type = 'intersection';
            break;

        case 'a-not-b':
        case 'a_not_b':
            this.#enum = AbattoirBooleanEnum.A_NOT_B;
            this.#boolean_type = 'a_not_b';
            break;

        case 'b-not-a':
        case 'b_not_a':
            this.#enum = AbattoirBooleanEnum.B_NOT_A;
            this.#boolean_type = 'b_not_a';
            break;

        case 'xor':
            this.#enum = AbattoirBooleanEnum.XOR;
            this.#boolean_type = 'xor';
            break;

        default:
            this.#enum = undefined;
            this.#boolean_type = 'none';
            break;
        }

        return true;
    }

    /**
     * 更新
     */
    update() {
        this.#connector.begin();
        if (!isUndefined(this.#enum)) {
            const objects = this.#receptacle.getAllObjects();
            if (isArray(objects)) {
                for (const object of objects) {
                    const soup = object.getEditableSoup();
                    if (!soup) {
                        throw new Error("getEditableSoup error");
                    } else {
                        ParametersScoped.setMat4(0, object.getMatrixWorld(true));
                        this.#connector.addSoup(soup.getPtr());
                    }
                }
            }
            this.#connector.commitAndCalc(this.#enum);
            this.#connector.end();
        }
        return true;
    }
}
