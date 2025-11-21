/* eslint-disable no-unused-vars */

// HDR
import hdr_brown_photostudio                from '@assets/hdr/brown_photostudio_1k.hdr';
import hdr_kloofendal_43d_clear_puresky     from '@assets/hdr/kloofendal_43d_clear_puresky_1k.hdr';
import hdr_meadow                           from '@assets/hdr/meadow_1k.hdr';
import hdr_metro_noord                      from '@assets/hdr/metro_noord_1k.hdr';
import hdr_near_the_river                   from '@assets/hdr/near_the_river_1k.hdr';
import hdr_pillars                          from '@assets/hdr/pillars.hdr';
import hdr_royal_esplanade                  from '@assets/hdr/royal_esplanade_1k.hdr';
import hdr_rural_crossroads                 from '@assets/hdr/rural_crossroads_1k.hdr';
import hdr_scythian_tombs                   from '@assets/hdr/scythian_tombs_1k.hdr';
import hdr_winter_evening                   from '@assets/hdr/winter_evening_1k.hdr';

// 微缩图
import thumb_brown_photostudio              from '@assets/images/hdr-thumb/brown_photostudio_1k.jpg';
import thumb_kloofendal_43d_clear_puresky   from '@assets/images/hdr-thumb/kloofendal_43d_clear_puresky_1k.jpg';
import thumb_meadow                         from '@assets/images/hdr-thumb/meadow_1k.jpg';
import thumb_metro_noord                    from '@assets/images/hdr-thumb/metro_noord_1k.jpg';
import thumb_near_the_river                 from '@assets/images/hdr-thumb/near_the_river_1k.jpg';
import thumb_pillars                        from '@assets/images/hdr-thumb/pillars.jpg';
import thumb_royal_esplanade                from '@assets/images/hdr-thumb/royal_esplanade_1k.jpg';
import thumb_rural_crossroads               from '@assets/images/hdr-thumb/rural_crossroads_1k.jpg';
import thumb_scythian_tombs                 from '@assets/images/hdr-thumb/scythian_tombs_1k.jpg';
import thumb_winter_evening                 from '@assets/images/hdr-thumb/winter_evening_1k.jpg';


import isArray      from 'lodash/isArray';
import isFunction   from 'lodash/isFunction';
import Cache        from './cache';

/**
 * 标记是不是已经初始化
 */
let is_inited = false;

/**
 * 内置的 HDR
 */
const dao = {
    /**
     * hdr
     */
    brown_photostudio : {
        url     : hdr_brown_photostudio,
        thumb   : thumb_brown_photostudio,
        cached  : false,
    },

    /**
     * hdr
     */
    kloofendal_43d_clear_puresky : {
        url     : hdr_kloofendal_43d_clear_puresky,
        thumb   : thumb_kloofendal_43d_clear_puresky,
        cached  : false,
    },

    /**
     * hdr
     */
    meadow : {
        url     : hdr_meadow,
        thumb   : thumb_meadow,
        cached  : false,
    },

    /**
     * hdr
     */
    noord : {
        url     : hdr_metro_noord,
        thumb   : thumb_metro_noord,
        cached  : false,
    },

    /**
     * hdr
     */
    near_the_river : {
        url     : hdr_near_the_river,
        thumb   : thumb_near_the_river,
        cached  : false,
    },

    /**
     * hdr
     */
    pillars : {
        url     : hdr_pillars,
        thumb   : thumb_pillars,
        cached  : false,
    },

    /**
     * hdr
     */
    royal_esplanade : {
        url     : hdr_royal_esplanade,
        thumb   : thumb_royal_esplanade,
        cached  : false,
    },

    /**
     * hdr
     */
    rural_crossroads : {
        url     : hdr_rural_crossroads,
        thumb   : thumb_rural_crossroads,
        cached  : false,
    },

    /**
     * hdr
     */
    scythian_tombs : {
        url     : hdr_scythian_tombs,
        thumb   : thumb_scythian_tombs,
        cached  : false,
    },

    /**
     * hdr
     */
    winter_evening : {
        url     : hdr_winter_evening,
        thumb   : thumb_winter_evening,
        cached  : false,
    },
}

/**
 * 
 * @param {*} callback 
 */
export default function(callback) {
    if (is_inited) {
        if (isFunction(callback)) {
            callback(dao);
        }
    } else {

        // 获取全部的cache的成员
        Cache.getAllItemsKey((data) => {

            // 标记已经cache的数据
            if (isArray(data)) {
                for (const key of data) {
                    if (key in dao) {
                        dao[key].cached = true;
                    }
                }
            }
            
            // 回调
            if (isFunction(callback)) {
                callback(dao);
            }
        });

        // 标记
        is_inited = true;
    }
}
