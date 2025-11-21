/* eslint-disable no-unused-vars */

import MeshFromSoup from '@core/misc/mesh-from-soup';
import Recorder     from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 存储当前Mesh的Soup
     */
    saveMeshSoup(mesh) {
        const coordinator = this.coordinator;
        const soup        = mesh.getEditableSoup();
        if (!soup) {
            return;
        }

        // 数据快拍
        const snapshot = soup.makeSnapshot();
        if (!snapshot) {
            return;
        } else {
            this.historic_recorder.appendNew(snapshot);
        }

        // 销毁引用计数
        snapshot.delete();

        // 添加
        this.append({
            historic_recorder: this.chameleon_historic_recorder,
            mesh,
            coordinator,

            /**
             * 回滚
             */
            rollback() {
                const recorder = this.historic_recorder.getCurrentSetup();
                if (!recorder) {
                    throw new Error("getCurrentSetup Error");
                }

                if (!recorder.hasCurrent()) {
                    throw new Error("recorder is invalid");
                }
                
                const soup = recorder.current();
                if (!soup) {
                    throw new Error("Soup is invalid");
                }

                MeshFromSoup(mesh, soup);
                soup.delete();
                recorder.rollback();
                this.coordinator.renderNextFrame();
            },

            /**
             * 销毁
             */
            destroy() {
                const recorder = this.historic_recorder.getCurrentSetup();
                if (!recorder) {
                    throw new Error("getCurrentSetup Error");
                }
                recorder.dismissOldest();
            },
        });
    }
});
