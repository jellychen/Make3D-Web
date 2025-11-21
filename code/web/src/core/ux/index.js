/* eslint-disable no-unused-vars */

import GlobalScope from '@common/global-scope';

import './base/element';
import './controller/alert-box/v';
import './controller/toast/v';
import './controller/backdrop-blur/v';
import './controller/separator/v';
import './controller/separator-dark/v';
import './controller/text/v';
import './controller/text-multiline/v';
import './controller/button/v';
import './controller/button-tab/v';
import './controller/button-tab/v-item';
import './controller/confirmation/v';
import './controller/slider-circle/v';
import './controller/slider/v';
import './controller/slider-with-input/v';
import './controller/numizer/v';
import './controller/numizer-2/v';
import './controller/switcher/v';
import './controller/icon-btn/v';
import './controller/icon-button-brief/v';
import './controller/icon-button-borderless/v';
import './controller/icon-button/v';
import './controller/icon-status-switcher/v';
import './controller/icon-status-switcher-container/v';
import './controller/icon-label/v';
import './controller/icon-marker/v';
import './controller/svg/v';
import './controller/image/v';
import './controller/image-icon/v';
import './controller/image-advanced/v';
import './controller/integer/v';
import './controller/key/v';
import './controller/logo/v';
import './controller/lottie-animation/v';
import './controller/status/v';
import './controller/progress-infinite/v';
import './controller/progress-infinite-line/v';
import './controller/progress/v';
import './controller/loader/v';
import './controller/scrollable-container/v-scrollbar-container';
import './controller/scrollable-container/v';
import './controller/selector/v';
import './controller/selector/v-item';
import './controller/selector-bar/v';
import './controller/selector-bar/v-item';
import './controller/spin/v';
import './controller/text-input/v';
import './controller/text-input-area/v';
import './controller/text-input-number/v';
import './controller/color/v';
import './controller/color-selector/v';
import './controller/color-selector-panel/v';
import './controller/coming/v';
import './controller/drop-menu/v';
import './controller/drop-menu/v-item-sparator';
import './controller/drop-menu/v-item';
import './controller/drop-selector/v';
import './controller/drop-selector/v-item';
import './controller/forbidden-mask/v';
import './controller/tab/v-item';
import './controller/tab-vertical/v-item';
import './controller/tab-vertical/v';
import './controller/tag-vip/v';
import './controller/switcher-icon/v';
import './controller/mailbox/v';
import './controller/tips/v';
import './controller/video/v';
import './controller/window/v';

// 
// 便捷度考虑
// 暴露一些辩解的方法给全局变量
//
import AlertBox                 from './controller/alert-box';
import Toast                    from './controller/toast';
import CreateWindow             from './controller/window';
import TipsManager              from './controller/tips';
import CreateMenu               from './controller/drop-menu';
import CreateSelector           from './controller/drop-selector';
import CreateColorSelectorPanel from './controller/color-selector-panel';

(() => {

    GlobalScope.alertBox                 = AlertBox;                           // 提示框
    GlobalScope.toast                    = Toast;                              // Toast提示
    GlobalScope.createMenu               = CreateMenu;                         // 创建菜单
    GlobalScope.createWindow             = CreateWindow;                       // 创建窗口
    GlobalScope.createDropSelector       = CreateSelector;                     // 创建选择器
    GlobalScope.createColorSelectorPanel = CreateColorSelectorPanel;           // 创建颜色选择器
    GlobalScope.createTipsManager        = ((host)=> new TipsManager(host));   // 创建Tips管理器

})();
