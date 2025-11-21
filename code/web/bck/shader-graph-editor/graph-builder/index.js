/* eslint-disable no-unused-vars */

/**
 * 构建节点
 */
export default class Builder {
    /**
     * 整个拓扑图
     */
    #topo;

    /**
     * 拓扑图
     */
    #root;

    /**
     * 用来缓冲节点创建的 TSL Node
     */
    #tsl_nodes_cache = new Map();

    /**
     * 
     * 构造函数
     * 
     * @param {*} topo 
     * @param {*} root_node 
     */
    constructor(topo, root_node) {
        this.#root = root_node;
        this.#topo = topo;
    }

    /**
     * 
     * 从指定的节点构建
     * 
     * @param {*} node 
     */
    #buildFromNode(node) {
        const uuid = node.uuid;
        if (!this.#tsl_nodes_cache.has(uuid)) {
            
        }
        return this.#tsl_nodes_cache.get(uuid);
    }

    /**
     * 
     * 构建节点
     * 
     * @returns 
     */
    build() {
        return this.#buildFromNode(this.#root);
    }
}
