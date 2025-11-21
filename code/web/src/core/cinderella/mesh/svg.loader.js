/* eslint-disable no-unused-vars */

import isNumber         from 'lodash/isNumber';
import isArray          from 'lodash/isArray';
import isString         from 'lodash/isString';
import XThree           from '@xthree/basic';
import { SVG }          from '@svgdotjs/svg.js';
import { SVGLoader }    from 'three/addons/loaders/SVGLoader';
import SvgPath          from 'svgpath';
import parse            from 'svg-path-parser';
import SvgMesh          from './svg';

/**
 * 
 * 从 SVG 字符串创建
 * 
 * @param {*} svg_str 
 * @param {*} conf 
 * @param {*} target_w 
 * @param {*} target_h 
 * @returns 
 */
export default function(svg_str, conf, target_w = 2, target_h = 2) {
    if (!isString(svg_str)) {
        return;
    }

    let svg;
    const point = new XThree.Vector2();
    const size  = new XThree.Vector2();
    const box2  = new XThree.Box2();
    box2.makeEmpty();

    // 统计尺寸
    try {
        const expand = (x, y) => {
            if (isNumber(x)) {
                box2.min.x = Math.min(box2.min.x, x);
                box2.max.x = Math.max(box2.max.x, x);
            }

            if (isNumber(y)) {
                box2.min.y = Math.min(box2.min.y, y);
                box2.max.y = Math.max(box2.max.y, y);
            }
        };

        expand(0, 0);

        svg = SVG(svg_str);
        svg.each(function() {
            const bbox = this.bbox();
            if (bbox) {
                expand(bbox.width, bbox.height);
            }
        });

        box2.getSize(size);
    } catch(error) {
        console.error(error);
        return;
    }

    // 缩放参数
    const scale_x = target_w / size.x;
    const scale_y = target_h / size.y;
    const scale   = Math.min(scale_x, scale_y);

    // 进行缩放
    function scale_element(el, scale) {
        if (el.type === 'rect') {
            el.x(el.x() * scale);
            el.y(el.y() * scale);
            el.width (el.width()  * scale);
            el.height(el.height() * scale);
        }
        
        else if (el.type === 'circle') {
            el.cx(el.cx() * scale);
            el.cy(el.cy() * scale);
            el.radius(el.radius() * scale);
        }

        else if (el.type === 'ellipse') {
            el.cx(el.cx() * scale);
            el.cy(el.cy() * scale);
            el.rx(el.rx() * scale);
            el.ry(el.ry() * scale);
        }
    
        else if (el.type === 'line') {
            el.attr({
                x1: el.attr('x1') * scale,
                y1: el.attr('y1') * scale,
                x2: el.attr('x2') * scale,
                y2: el.attr('y2') * scale,
            });
        }

        else if (el.type === 'path') {
            el.transform({ scale: scale }, true);
        }

        else if (el.type === 'polygon' || el.type === 'polyline') {
            const points = el.array().map(pt => [pt[0] * scale, pt[1] * scale]);
            el.plot(points);
        }
    }

    function traverse_and_scale(parent, scale) {
        parent.each(function() {
            const el = this;
            scale_element(el, scale);
            if (el.children && el.children().length > 0) {
                traverse_and_scale(el, scale);
            }
        });
    }
    traverse_and_scale(svg, scale);

    // 转SVG
    svg_str = svg.svg();

    // 加载svg
    const loader = new SVGLoader();
    const data   = loader.parse(svg_str);
    const paths  = data.paths;
    if (!isArray(paths)) {
        return;
    }

    // 构建 
    let group;

    // 构建
    for (const path of paths) {
        const shapes = SVGLoader.createShapes(path);
        if (!isArray(shapes)) {
            continue;
        }

        for (const shape of shapes) {
            const mesh = new SvgMesh(shape, conf);
            if (!group) {
                group = new XThree.Group();
            }
            group.add(mesh);
        }
    }

    return group;
}
