/* eslint-disable no-unused-vars */

import Graph from "./graph/graph";

/**
 * 用来维护拓扑结构
 */
export default class Topo extends Graph {
    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} context 
     */
    draw(context) {
        // 遍历全部的节点
        this.container.forEach(node => {
            
            // 遍历全部的输出
            node.foreachAllSlotOut(slot => {
                const l0 = slot.getPanelPortDotLocation();
                const x0 = l0.x;
                const y0 = l0.y;

                // 执行绘制
                context.lineWidth   = 1.6;
                context.lineCap     = "round";
                context.strokeStyle = '#EEE';
                context.beginPath();

                // 每个下一继
                for (const port of slot.arr) {
                    const slot = port.slot;
                    const l1 = slot.getPanelPortDotLocation();
                    const x1 = l1.x;
                    const y1 = l1.y;

                    let offset = Math.abs(x1 - x0) * 0.6;
                    context.moveTo(x0, y0);
                    context.bezierCurveTo(
                        x0 + offset,
                        y0,
                        x1 - offset,
                        y1,
                        x1,
                        y1);
                }

                // 执行绘制
                context.stroke();
            });
        });
    }
}
