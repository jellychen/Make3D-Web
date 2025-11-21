
import Pass     from '../../pass';
import Material from './material';

/**
 * Pass
 */
export default class EffectPass extends Pass {
    /**
     * 构造函数
     */
    constructor() {
        super(new Material());
    }
}
