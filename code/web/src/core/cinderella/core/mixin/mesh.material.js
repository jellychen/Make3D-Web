/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Mesh.prototype, {
    /**
     * 获取当前的材质
     */
    getCurrentMaterial() {
        return this.material;
    },

    /**
     * 
     * 是否存在
     * 
     * @returns 
     */
    hasBackupMaterial() {
        return this.userData.backup_material;
    },

    /**
     * 如果存在备份的材质，直接报错
     */
    __throwErrorIfHasBackupMaterial() {
        if (this.userData.backup_material) {
            throw new Error("backup_material is exist");
        }
    },

    /**
     * 
     * 备份当前的材质
     * 
     * 如果已经备份过了数据，爆异常
     * 
     */
    backupMaterial() {
        this.__throwErrorIfHasBackupMaterial();
        this.userData.backup_material = this.material;
        this.material = null;
    },

    /**
     * 
     * 如果没有备份过，才备份
     * 
     * @returns 
     */
    backupMaterialIfNotHas() {
        if (this.userData.backup_material) {
            return false;
        }
        this.userData.backup_material = this.material;
        this.material = null;
        return true;
    },

    /**
     * 
     * 从备份的数据中恢复
     * 
     * 如果默认的材质已经有值了，就拒绝恢复
     * 
     */
    recoverMaterialFromBackup() {
        if (this.material) {
            throw new Error("material is exist");
        }
        this.material = this.userData.backup_material;
        this.userData.backup_material = null;
    },
});
