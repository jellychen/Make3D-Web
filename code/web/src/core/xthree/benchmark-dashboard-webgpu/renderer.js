
import * as XThree from 'three/webgpu';
import * as tsl   from 'three/tsl';
import Box from '../renderable/webgpu/box/box.js';
import l0 from '../renderable/webgpu/line/line-segments-immediate.js';
import l1 from '../renderable/webgpu/line/line-segments-immediate';
import p0 from '../renderable/webgpu/point/point-round';
import m0 from '../material/webgpu/circle-pattern.js';
import m1 from '../material/webgpu/aspect-color-not-smooth.js'
import m2 from '../material/webgpu/aspect-color.js'
// import {convertColorSpace} from 'three/webgpu'

// const out = convertColorSpace(
//   in, 
//   THREE.LinearSRGBColorSpace, 
//   THREE.SRGBColorSpace
// );

//
// tsl.shapeCircle
//

// tsl.texture(null)

export default class Renderer {
    /**
     * 
     */
    #scene;
    #renderer;

    /**
     * 
     * @param {*} canvas 
     */
    constructor(canvas) {
        canvas.width = 1600;
        canvas.height = 1200;
        this.#renderer = new XThree.WebGPURenderer( { 
            antialias: true,
            canvas
        } );
    }

    /**
     * 初始化
     */
    async init() {
        await this.#renderer.init();
        this.#scene = new XThree.Scene();
        const camera = new XThree.PerspectiveCamera( 40, 800/600, .25, 50 );
		camera.position.set( 0, -4, 40 );
        camera.lookAt(0, 0, 0);

        // const floorMaterial = new XThree.NodeMaterial();
		// floorMaterial.colorNode = tsl.vec4(1, 1, 1, 1);
		// floorMaterial.opacity = .2;
		// floorMaterial.transparent = true;
        const floorMaterial = this.m();



        let mesh_geo ;
        {
            // 构建渲染的网格
            const v                       = new Float32Array(12);
            v[ 0]                         = -1.0;
            v[ 1]                         = +1.0;
            v[ 2]                         = +0.0;
            v[ 3]                         = -1.0;
            v[ 4]                         = -1.0;
            v[ 5]                         = +0.0;
            v[ 6]                         = +1.0;
            v[ 7]                         = -1.0;
            v[ 8]                         = +0.0;
            v[ 9]                         = +1.0;
            v[10]                         = +1.0;
            v[11]                         = +0.0;

            const u                       = new Float32Array(8);
            u[0]                          = 0;
            u[1]                          = 1;
            u[2]                          = 0;
            u[3]                          = 0;
            u[4]                          = 1;
            u[5]                          = 0;
            u[6]                          = 1;
            u[7]                          = 1;

            const i                       = new Uint16Array(6);
            i[0]                          = 0;
            i[1]                          = 1;
            i[2]                          = 2;
            i[3]                          = 0;
            i[4]                          = 2;
            i[5]                          = 3;

            const geo = new XThree.BufferGeometry();
            geo.setAttribute('position', new XThree.BufferAttribute(v, 3));
            geo.setAttribute('uv', new XThree.BufferAttribute(u, 2));
            geo.setIndex(new XThree.BufferAttribute(i, 1));
            mesh_geo = geo;
        }

        mesh_geo = new XThree.TorusGeometry( 10, 3, 16, 100 );


        // const floor = new XThree.Mesh( new XThree.BoxGeometry( 50, .001, 50 ), floorMaterial );
        const floor = new XThree.Mesh( mesh_geo, floorMaterial );
		floor.receiveShadow = true;
		floor.position.set( 0, 0, 0 );
		this.#scene.add( floor );

        // {
        //     const box = new XThree.Box3();
        //     box.min.set(0, 0, 0);
        //     box.max.set(1, 1, 1);
        //     const bb = new Box();
        //     bb.setBox(box);
        //     bb.setColor(0xff0000);
        //     this.#scene.add(bb);
        // }

        // {
        //     const lines = [
        //         0, 0, 0, 1, 1, 1
        //     ];
        //     const l = new l0();
        //     l.setSegments(lines);
        //     this.#scene.add(l);
        // }

        // {
        //     const lines = [0, 0, 0, 1, 1, 0];
        //     const color = [1, 1, 1, 1, 0, 0];
        //     const l = new l1();
        //     l.setSegments(lines);
        //     this.#scene.add(l);
        // }

        // {
        //     const point = new p0();
        //     point.setSize(4);
        //     point.setPoints([
        //         0, 0, 0, 1, 1, 1, 0.5, 0.5, 0
        //     ]);
        //     this.#scene.add(point);
        // }

        this.#renderer.renderAsync(this.#scene, camera);
    }

    /**
     * 获取材质
     */
    m() {
        // class Material extends XThree.NodeMaterial {
        //     constructor() {
        //         super();
        //         this.lights = false;
        //         this.colorNode = tsl.vec4(1, 1, 1, 1);
        //     }
        // };
        // return new Material();
        // const m = new m0();
        // m.setTransparent(true, 0.8);
        // return m;

        const m = new m2();
        return m;
    }
}
