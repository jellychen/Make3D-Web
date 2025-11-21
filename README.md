# Make3D-Web


## English
> Make3D is a web-based 3D modeling and rendering software that supports Blender-style hard-surface modeling and PBR material ray-tracing rendering.
>
> The current online official website is make3d.online.

**About the Project**
I am the developer of this project and have completed almost all of the development work. The ray-tracing renderer was co-developed with another teammate.
You can reach me at 994299094@qq.com or via WeChat: breakerror.
Graphic enthusiasts and experts of all kinds are welcome to connect and exchange ideas.

**Open-Source Limitations**
This project is open-sourced under the MIT license.
All code that has been published in the repository can be used freely without restrictions.
Third-party npm dependencies comply with their respective open-source licenses, which are not listed here individually.

Considering potential multi-party interest conflicts, the geometry kernel and the ray-tracing renderer will not be open-sourced.

A WebAssembly-compiled version of the geometry kernel has already been provided and integrated into the project, so it can be used directly.
The open-sourcing of the geometry kernel’s source code is currently under consideration. However, the project is quite large, and organizing the code and preparing documentation will require significant time.

## Build & Usage

git clone git@github.com:jellychen/Make3D-Web.git
cd code/web
npm install
npm run serve:dev

This project can be run directly in the browser.

## Architecture Overview

This project is mainly composed of three parts.
* Geometry Engine
  * Hard-Surface Modeling Engine
  * Boolean Operations
  * Modifiers
  * UV Unwrapping
  * ....
* Renderer
  * PBR
  * WEBGPU Acceleration
  * OIDN Denoising
  * ....
* Workbench & Editor
  * Editing and Interaction Work

# 中文
> Make3D 是一款基于Web平台的三维建模+渲染的软件，支持类似Blender的硬表面建模和PBR材质的光追渲染
> 
> 目前在线的官网 **make3d.online**

**关于项目**
我是这个项目的开发者，完成了几乎所有的开发工作。 光追渲染器是由另一名童鞋一起共同开发完成。 可以通过 994299094@qq.com 或者 微信: breakerror 联系到我。
欢迎各类图形学大佬一起沟通交流。

**开源限制**
本项目采用MIT协议开源，已经放到仓库的代码可以无责任使用，依赖的npm的第三方库遵守各自的开源协议。这里不一一列举。
考虑到存在一些多方的利益冲突，几何内核和光追渲染器不开源。 
几何内核已经提供了Wasm编译的版本，并已经集成到了这个项目里面，可以直接使用。 几何内核的源码的开源事宜层面正在计划中。 但是项目过于庞大，整理和文档都需要很多时间。

## 编译使用

git clone git@github.com:jellychen/Make3D-Web.git
cd code/web
npm install
npm run serve:dev

在浏览器中打开就可以运行这个项目

## 架构总览

本项目主要由3个部分完成
* 几何引擎
  * 硬表面建模引擎
  * 布尔运算
  * 修改器
  * 展UV
  * ....
* 渲染器
  * PBR
  * WEBGPU加速
  * OIDN降噪
  * ....
* 工作台和编辑器
  * 编辑交互工作
