/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isArray    from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import Adapter    from './adapter';

/**
 * 构建适配器
 */
export default class AdapterBuilder {
    /**
     * 对于的树
     */
    #root;

    /**
     * 
     * 构造函数
     * 
     * @param {*} root 
     */
    constructor(root) {
        this.#root = root;
    }

    /**
     * 
     * 设置新的tree
     * 
     * @param {*} root 
     */
    setScene(root) {
        this.#root = root;
    }

    /**
     * 
     * 构建Adapter
     * 
     * @param {*} object 
     * @param {*} include 
     * @param {*} depth 
     * @returns 
     */
    gen(object = undefined, include = true, depth = 0) {
        if (!object) {
            object = this.#root;
        }

        if (!object) {
            return undefined;
        }

        // 非递归DFS
        const stack = [];
        const data  = [];

        // 包不包含根元素
        if (include) {
            stack.push({ node: object, depth: depth });
        } else {
            const children = object.getChildren();
            if (isArray(children)) {
                const count = children.length;
                for (let i = count - 1; i >= 0; --i) {
                    stack.push({ node: children[i], depth: depth + 1});
                }
            }
        }

        // 执行
        while (stack.length > 0) {

            // 获取头部
            const { node, depth } = stack.pop();

            //
            // 如果是辅助对象
            //
            // 就直接跳过当前的这个元素
            //
            if (isFunction(node.isAuxiliary) && node.isAuxiliary()) {
                continue;
            }

            // 判断是不是整体
            const overall = node.isOverall();
            
            // 获取节点的元素
            data.push({
                object:         node,                                                           // Tree里面的节点
                depth:          depth,                                                          // 深度
                indent:         depth,                                                          // 深度
                uuid:           node.uuid,                                                      // UUID
                has_child:      overall? false : node.hasChildren(),                            // 是否拥有孩子
                is_container:   overall? false : (node.hasChildren() || node.isContainer()),    // 是否是容器
                folded:         node.isFolded(),                                                // 是否折叠
            });

            //
            // 是不是强制设置成一个整体
            //
            // 如果是一个整体，对子元素不进行展开
            //
            if (overall || node.isFolded()) {
                continue;
            }

            // 每个孩子都插入stack中
            const children = node.getChildren();
            if (!isArray(children)) {
                continue;
            }

            const children_count = children.length;
            for (let i = children_count - 1; i >= 0; --i) {
                stack.push({ node: children[i], depth: depth + 1});
            }
        }
        
        return new Adapter(data, false);
    }
}
