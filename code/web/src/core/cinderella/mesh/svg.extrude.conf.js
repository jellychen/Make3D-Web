/* eslint-disable no-unused-vars */

/**
 * 挤压
 */
export default class Conf {
    // Number of points on the curves
    // int
    curveSegments  = 8;

    // Number of points used for subdividing segments along the depth of the extruded spline
    // int
    steps          = 1;

    // Depth to extrude the shape
    // float
    depth          = 0.2;

    // Apply beveling to the shape
    // bool
    bevelEnabled   = true;

    // How deep into the original shape the bevel goes
    // float
    bevelThickness = 0.02;

    // Distance from the shape outline that the bevel extends
    // float
    bevelSize      = 0.02;

    // Distance from the shape outline that the bevel starts
    // float
    bevelOffset    = 0;

    // Number of bevel layers
    // int
    bevelSegments  = 6;

    /**
     * 克隆
     */
    clone() {
        const that = new Conf();
        that.curveSegments  = this.curveSegments;
        that.steps          = this.steps;
        that.depth          = this.depth;
        that.bevelEnabled   = this.bevelEnabled;
        that.bevelThickness = this.bevelThickness;
        that.bevelSize      = this.bevelSize;
        that.bevelOffset    = this.bevelOffset;
        that.bevelSegments  = this.bevelSegments;
        return that;
    }
}
