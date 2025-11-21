
import DefaultMaterial      from '@core/cinderella/mesh/material.default';
import CorrectMeshTransform from '@core/cinderella/utils/correct-mesh-transform';
import MeshCentralization   from '@core/misc/mesh-centralization';
import Editor               from './v';

/**
 * Mixin
 */
Object.assign(Editor.prototype, {
    /**
     * 添加到场景中
     */
    addToScene() {
        if (!this.svg_mesh_group) {
            return;
        }
        
        // 把所有的材质替换成PBR材质
        for (const child of this.svg_mesh_group.children) {
            child.disposeMaterial();
            child.material = DefaultMaterial();

            // 修复一下
            CorrectMeshTransform(child);
        }

        // 居中
        MeshCentralization(this.svg_mesh_group);

        // 添加到主场景
        this.svg_mesh_group.remove();
        this.coordinator.scene.add(this.svg_mesh_group);
        this.coordinator.selected_container.replace(this.svg_mesh_group);
        this.coordinator.updateTransformer();
        this.coordinator.markTreeViewNeedUpdate(true);
        this.coordinator.renderNextFrame();
        this.svg_mesh_group = undefined;

        // 销毁
        this.dismiss();
    }
});
