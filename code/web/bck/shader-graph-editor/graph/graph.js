/* eslint-disable no-unused-vars */

/**
 * 图
 */
export default class Graph {
    /**
     * 数据结构
     */
    #map = new Map();

    /**
     * 获取容器
     */
    get container() {
        return this.#map;
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 查找节点
     * 
     * @param {string} uuid
     */
    getNode(uuid) {
        return this.#map.get(uuid);
    }

    /**
     * 
     * 添加节点
     * 
     * @param {*} node 
     */
    addNode(node) {
        if (node && node.uuid) {
            const uuid = node.uuid;
            if (this.#map.has(uuid)) {
                throw new Error("uuid node has alread added");
            } else {
                this.#map.set(uuid, node);
            }
        }
    }

    /**
     * 
     * 删除节点
     * 
     * @param {*} uuid 
     */
    delNode(uuid) {
        this.#map.delete(uuid);
    }

    /**
     * 
     * 获取指定节点的输入槽
     * 
     * @param {*} uuid 
     * @param {*} name 
     * @returns 
     */
    getNodeInSlot(uuid, name) {
        const node = this.getNode(uuid);
        if (!node) {
            return;
        }
        return node.getSlotIn(name);
    }

    /**
     * 
     * 获取指定节点的输出槽
     * 
     * @param {*} uuid 
     * @param {*} name 
     * @returns 
     */
    getNodeOutSlot(uuid, name) {
        const node = this.getNode(uuid);
        if (!node) {
            return;
        }
        return node.getSlotOut(name);
    }

    /**
     * 
     * 添加边
     * 
     * @param {*} uuid_a 
     * @param {*} uuid_a_slot 
     * @param {*} uuid_b 
     * @param {*} uuid_b_slot 
     * @returns 
     */
    connect(uuid_a, uuid_a_slot, uuid_b, uuid_b_slot) {
        // 输出节点
        const a = this.getNodeOutSlot(uuid_a, uuid_a_slot);

        // 输入节点
        const b = this.getNodeInSlot (uuid_b, uuid_b_slot);
        
        // 如果不存在
        if (!a || !b) {
            return;
        }

        // 获取2个端口
        const port_a = a.asPort();
        const port_b = b.asPort();

        // 输出节点可以输出到多个输入节点中
        // 输入节点只有一个输入节点与他对接

        // 如果输入节点已经有对接了, 有可能需要清理
        const b_input_port = b.port;
        if (b_input_port) {

            // 已经链接过了
            if (b_input_port == port_a) {
                return;
            }

            // 取消旧的链接
            else {
                b_input_port.slot.del(port_b);
                b.setFrom(undefined);
            }
        }

        // 添加新的链接
        a.add(port_b);
        b.setFrom(port_a);
    }

    /**
     * 
     * 移除输入节点的输入
     * 
     * @param {*} uuid 
     * @param {*} uuid_slot 
     * @returns 
     */
    removeInput(uuid, uuid_slot) {
        const slot = this.getNodeInSlot(uuid, uuid_slot);
        if (!slot) {
            return;
        }

        const slot_input_port = slot.port;
        if (!slot_input_port) {
            return;
        }

        slot_input_port.slot.del(slot.asPort());
        slot.setFrom(undefined);
    }
}
