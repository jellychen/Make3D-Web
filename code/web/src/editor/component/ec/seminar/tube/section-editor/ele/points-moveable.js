/* eslint-disable no-unused-vars */

/**
 * 
 * 找到全部可以移动的点
 * 
 * 其中要考虑，选择端点会把它关联的2个控制点也加入
 * 
 * 
 * 暂时没用上，不支持移动一批点
 * 
 */
export default class PointsMoveable {
    /**
     * container
     */
    #container;

    /**
     * 所有点的的索引
     */
    #indices = [];

    /**
     *
     * 构造函数
     * 
     * @param {*} container 
     */
    constructor(container) {
        this.#container = container;
    }

    /**
     * 
     * 空
     * 
     * @returns 
     */
    empty() {
        return this.#indices.length == 0;
    }

    /**
     * 重置
     */
    clear() {
        this.#indices.length = 0;
    }

    /**
     * 更新
     */
    update() {
        this.#indices.length = 0;
        const points = this.#container.points;
        for (let i = 0; i < points.length; ++i) {
            const point = points[i];

            //
            // 没有选中就算了
            //
            if (!point.selected) {
                continue;
            }
            
            //
            // 先添加自己
            //
            this.#addIndex(i);

            //
            // 2. 如果是端点(非控制点)
            //
            // 还要把前后的控制端点合并进去
            //
            if (!point.controller) {
                this.#addIndex(this.#container.normalizeIndex(i - 1));
                this.#addIndex(this.#container.normalizeIndex(i + 1));
            }
        }
    }

    /**
     * 
     * 从选择的点
     * 
     * @param {*} index 
     */
    updateFromSelectedPoint(index) {
        this.#indices.length = 0;
        const points       = this.#container.points;
        const points_count = points.length;
        const point        = points[index];
        this.#addIndex(index);
        if (!point.controller) {
            if (index > 0) {
                this.#addIndex(index - 1);
            }

            if (index < points_count - 1) {
                this.#addIndex(this.#container.normalizeIndex(index + 1));
            }
        }
    }

    /**
     * 
     * 移动
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    offset(x, y) {
        if (this.#indices.length == 0) {
            return;
        }

        if (0 == x && 0 == y) {
            return false;
        }

        for (const index of this.#indices) {
            const point = this.#container.getPoint(index);
            point.x += x;
            point.y += y;
        }
        
        return true;
    }

    /**
     * 
     * 添加索引
     * 
     * @param {*} index 
     */
    #addIndex(index) {
        if (this.#indices.includes(index)) {
            ;
        } else {
            this.#indices.push(index);
        }
    }
}
