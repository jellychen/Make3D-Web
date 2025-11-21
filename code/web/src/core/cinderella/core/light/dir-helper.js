
import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';
import Circle           from './circle';
import Constants        from './constants';

/**
 * 临时对象
 */
const vec3_0 = new XThree.Vector3();
const vec3_1 = new XThree.Vector3();
const vec3_2 = new XThree.Vector3();

/**
 * 方向光的辅助器
 */
export default class Helper extends XThree.Group {
    /**
     * 线段
     */
    #line;
    #line_circle_0;
    #line_circle_1;

    /**
     * 灯光
     */
    #light;

    /**
     * 
     * 构造函数
     * 
     * @param {*} light 
     */
    constructor(light) {
        super();
        this.matrixWorldAutoUpdate                = false;
        this.matrixWorld.identity();
        this.#light                               = light;

        this.#line                                = new XThreeRenderable.LineSegments();
        this.#line.setColor(Constants.DEFAULT_COLOR);
        this.#line.setWidth(Constants.DEFAULT_LINE_WIDTH);
        this.#line.matrixWorldAutoUpdate          = false;
        this.#line.matrixWorld.identity();

        this.#line_circle_0                       = new Circle();
        this.#line_circle_0.setColor(Constants.DEFAULT_COLOR);
        this.#line_circle_0.setWidth(Constants.DEFAULT_LINE_WIDTH);
        this.#line_circle_0.setRadius(Constants.DEFAULT_CIRCLE_RADIUS, Constants.DEFAULT_CIRCLE_RADIUS_SEGMENTS);
        this.#line_circle_0.matrixWorldAutoUpdate = false;
        this.#line_circle_0.matrixWorld.identity();

        this.#line_circle_1                       = new Circle();
        this.#line_circle_1.setColor(Constants.DEFAULT_COLOR);
        this.#line_circle_1.setWidth(Constants.DEFAULT_LINE_WIDTH);
        this.#line_circle_1.setRadius(Constants.DEFAULT_CIRCLE_RADIUS * 0.5, Constants.DEFAULT_CIRCLE_RADIUS_SEGMENTS);
        this.#line_circle_1.matrixWorldAutoUpdate = false;
        this.#line_circle_1.matrixWorld.identity();
        
        this.add(this.#line);
        this.add(this.#line_circle_0);
        this.add(this.#line_circle_1);
    }

    /**
     * 更具灯光的方向，来调整辅助器
     */
    update() {
        const light  = this.#light;
        const target = light.target;
        vec3_0.copy(light .getBasePoint(true));
        vec3_1.copy(target.getBasePoint(true));
        vec3_1.sub(vec3_0).normalize().multiplyScalar(Constants.DEFAULT_LINE_LENGTH);
        vec3_2.copy(vec3_0).add(vec3_1);
        this.#line.setSegments([
            vec3_0.x,
            vec3_0.y,
            vec3_0.z,
            vec3_2.x,
            vec3_2.y,
            vec3_2.z,
        ]);
        this.#line_circle_0.setPositionOrientation(vec3_0, vec3_1);
        this.#line_circle_0.compose();
        this.#line_circle_0.matrixWorld = this.#line_circle_0.matrix;
        this.#line_circle_1.setPositionOrientation(vec3_0, vec3_1);
        this.#line_circle_1.compose();
        this.#line_circle_1.matrixWorld = this.#line_circle_1.matrix;
    }

    /**
     * 销毁
     */
    dispose() {
        this.#line         .dispose();
        this.#line_circle_0.dispose();
        this.#line_circle_1.dispose();
    }

    /**
     * 销毁
     */
    removeFromParentAndDispose() {
        this.removeFromParent();
        this.dispose();
    }
}
