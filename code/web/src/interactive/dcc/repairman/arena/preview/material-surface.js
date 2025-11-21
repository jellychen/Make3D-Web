/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree      from '@xthree/basic';
import AspectColor from '@xthree/material/aspect-color-not-smooth';

const material = new AspectColor();
material.setEnhance(1);
material.setFrontColor(0xE3E3E3);
material.setBackColor (0x484848);
material.side                = XThree.DoubleSide;
material.polygonOffset       = true;
material.polygonOffsetFactor = 1;
material.polygonOffsetUnits  = 1;

export default material;
