
import isFunction           from 'lodash/isFunction';
import XThree               from '@xthree/basic';
import MeshFromSoup         from '@core/misc/mesh-from-soup';
import CorrectMeshTransform from '@core/cinderella/utils/correct-mesh-transform';
import Editable             from '@core/cinderella/mesh/editable';
import EditableMaterial     from '@core/cinderella/mesh/editable.default.material';
import GeometryTris         from '@core/misc/geometry-tris';
import MeshCentralization   from '@core/misc/mesh-centralization';
import Editor               from './v';

/**
 * 异步转化
 */
class AsyncConvert {
    /**
     * 转化结束后的网格Group
     */
    group = new XThree.Group();

    /**
     * 存储SVG的Group
     */
    svg_mesh_group;

    /**
     * 
     * 构造函数
     * 
     * @param {*} svg_mesh_group 
     */
    constructor(svg_mesh_group) {
        this.svg_mesh_group = svg_mesh_group;
        this.group.copyFromOther(svg_mesh_group);
    }

    /**
     * 
     * 转换其中一个网格
     * 
     * @param {*} mesh 
     * @returns 
     */
    convert(mesh) {
        if (!mesh.geometry) {
            return;
        }

        // 拿到里面的三角形网格
        const tris = GeometryTris(mesh.geometry);
        if (!tris) {
            return;
        }

        // 修复
        const soup = tris.fix_manifold_and_to_soup();
        tris.delete();
        if (!soup) {
            return;
        }

        // 创建mesh
        const editable = MeshFromSoup(undefined, soup);
        editable.material = EditableMaterial();
        
        // 修复
        CorrectMeshTransform(editable);

        this.group.add(editable);
    }

    /**
     * 执行一次转化工作
     */
    *job() {
        const size = this.svg_mesh_group.children.length;
        for (let i = 0; i < size; i++) {
            this.convert(this.svg_mesh_group.children[i]);
            yield i;
        }
    }

    /**
     * 
     * 启动执行
     * 
     * @param {*} process_callback 
     * @param {*} finish_callback 
     */
    start(process_callback, finish_callback) {
        const s = this.svg_mesh_group.children.length;
        const g = this.job();
        const r = () => {
            const d = g.next();
            if (d.done) {
                if (isFunction(finish_callback)) {
                    finish_callback();
                }
            } else {
                if (isFunction(process_callback)) {
                    process_callback(s, d.value);
                }
                requestAnimationFrame(r);
            }
        };
        requestAnimationFrame(r);
    }
};

/**
 * Mixin
 */
Object.assign(Editor.prototype, {
    /**
     * 转化成多边形, 并添加到场景中
     */
    convertPolygonAddToScene() {
        if (!this.svg_mesh_group || 0 == this.svg_mesh_group.children.length) {
            return;
        }

        const convert = new AsyncConvert(this.svg_mesh_group);
        convert.start((total, current) => {
            console.log(total, current);
        }, () => {
            const group = convert.group;

            //
            MeshCentralization(group);

            this.coordinator.scene.add(group);
            this.coordinator.selected_container.replace(group);
            this.coordinator.updateTransformer();
            this.coordinator.markTreeViewNeedUpdate(true);
            this.coordinator.renderNextFrame();
            this.dismiss();
        });
    }
});
