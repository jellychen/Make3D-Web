/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 扭曲化
 */
export default class Contort extends Base {
    /**
     * 设置面板
     */
    #setter;

    /**
     * 操作的mesh
     */
    #mesh;

    /**
     * 编辑的Soup
     */
    #soup;
    #soup_current;

    /**
     * 当前调整的轴
     */
    #dir;

    /**
     * 操作
     */
    #op;
    #op_context;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} coordinator 
     * @param {*} mesh 
     */
    constructor(host, coordinator, mesh) {
        if (!(mesh instanceof EditableMesh)) {
            throw new Error("Mesh must be instance of EditableMesh");
        }
        super(host, coordinator, mesh);
        this.#mesh = mesh;
        this.#soup = mesh.getEditableSoup().clone();
        this.updateWireframe(this.#soup);
        this.renderNextFrame();
    }

    /**
     * 启动
     */
    start() {
        super.start();

        // 保存历史记录
        this.historical_recorder.saveMeshSoup(this.#mesh);
        
        // 设置窗口
        this.#setter = new Setter(
            this, 
            () => this.#onSetterChanged(),
            () => this.#onCommit());
        this.#setter.setAngle(0);
        this.#setter.setCoordinateDir('px');
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('modifier.contort');
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        const Chameleon = GlobalScope.Chameleon;
        const {
            CoordinateDir,
            GeoSolidSoupOP,
            GeoSolidSoupOP_ContortContext,
        } = Chameleon;

        // 如果 Dir 变化了
        const dir   = this.#setter.coordinateDir;
        const angle = this.#setter.angle;
        if (this.#dir !== dir) {
            this.#dir = dir;

            // 重置
            this.#setter.setAngle(0);

            // 重置数据
            if (this.#op) {
                this.#op.delete();
                this.#op = undefined;
            }
    
            if (this.#op_context) {
                this.#op_context.delete();
                this.#op_context = undefined;
            }
    
            if (this.#soup_current) {
                this.#soup_current.delete();
                this.#soup_current = undefined;
            }

            // 数据
            this.#soup_current = this.#soup.makeSnapshot();
            this.#op           = new GeoSolidSoupOP(this.#soup_current.getPtr());
            this.#op_context   = new GeoSolidSoupOP_ContortContext(this.#soup_current);

            // 处理
            if      ('px' === dir) this.#op.contort(angle, CoordinateDir.PX, this.#op_context);
            else if ('py' === dir) this.#op.contort(angle, CoordinateDir.PY, this.#op_context);
            else if ('pz' === dir) this.#op.contort(angle, CoordinateDir.PZ, this.#op_context);
            else if ('nx' === dir) this.#op.contort(angle, CoordinateDir.NX, this.#op_context);
            else if ('ny' === dir) this.#op.contort(angle, CoordinateDir.NY, this.#op_context);
            else if ('nz' === dir) this.#op.contort(angle, CoordinateDir.NZ, this.#op_context);

            // Soup 转 Mesh
            MeshFromSoup(this.#mesh, this.#soup_current);

            this.updateWireframe(this.#soup_current);
            
        } else {
            // 执行修改
            this.#op_context.rotateTo(angle);

            // Soup 转 Mesh
            MeshFromSoup(this.#mesh, this.#soup_current);

            this.updateWireframe(this.#soup_current);
        }

        // 下一帧渲染
        this.renderNextFrame();
    }

    /**
     * 提交
     */
    #onCommit() {
        this.commit();
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        if (this.#op) {
            this.#op.delete();
            this.#op = undefined;
        }

        if (this.#op_context) {
            this.#op_context.delete();
            this.#op_context = undefined;
        }

        if (this.#soup_current) {
            this.#soup_current.delete();
            this.#soup_current = undefined;
        }

        if (this.#soup) {
            this.#soup.delete();
            this.#soup = undefined;
        }

        if (this.#setter) {
            this.#setter.dispose();
            this.#setter = undefined;
        }

        // 下一帧渲染
        this.renderNextFrame();
    }
}
