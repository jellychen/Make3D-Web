/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-figma-acount';

/**
 * 用来代表Figma插件的账号的差异
 */
export default class FigmaAccount extends Element {

}

CustomElementRegister(tagName, FigmaAccount);
