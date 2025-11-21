/* eslint-disable no-unused-vars */

import R              from './r';
import W              from './w';
import M3dArrayBuffer from './m3d-loader';
import Serializer     from './serializer';
import                     './serializer-metadata';
import                     './serializer-scene';
import                     './serializer-object';
import                     './serializer-group';
import                     './serializer-mesh';
import                     './serializer-mesh-editable.js';
import                     './serializer-placeholder';
import                     './serializer-light';
import                     './serializer-material';
import                     './serializer-texture';
import Builder        from './builder.js';
import                     './builder-read-arraybuffer-as-rawbuffer';
import                     './builder-metadata';
import                     './builder-scene';
import                     './builder-object';
import                     './builder-group';
import                     './builder-mesh';
import                     './builder-mesh-editable';
import                     './builder-light';
import                     './builder-material';
import                     './builder-texture';

export default {
    R,
    W,
    Serializer,
    Builder,
    M3dArrayBuffer,
}
