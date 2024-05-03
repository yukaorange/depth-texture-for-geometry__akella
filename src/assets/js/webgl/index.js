import GSAP from 'gsap'
import { PerspectiveCamera, WebGLRenderer, Scene, Clock } from 'three'

import * as THREE from 'three'

import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import PostProcessPipeline from './postprocess/PostProcessPipeline'

import Home from './Home'

export default class Canvas {
  constructor({ template, dom, device, assets }) {
    this.template = template

    this.container = dom

    this.bounds = this.container.getBoundingClientRect()

    this.device = device

    this.assets = assets

    this.x = {
      start: 0,
      end: 0
    }

    this.y = {
      start: 0,
      end: 0
    }

    this.time = {
      current: 0,
      previous: 0,
      delta: 0
    }

    this.createRenderer()

    this.createRendererTargetForDepthMap()

    this.createScene()

    this.createModelScene()

    this.createCamera()

    this.createDepthCamera()

    this.createPane()

    // this.createControls()

    this.createClock()

    this.createPostProcessPipeline()

    this.onResize(this.device)
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true
    })

    this.renderer.setClearColor(0x000000, 1.0)

    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.container.appendChild(this.renderer.domElement)
  }

  createRendererTargetForDepthMap() {
    this.rendererTargetForDepth = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    )

    this.rendererTargetForDepth.texture.minFilter = THREE.NearestFilter

    this.rendererTargetForDepth.texture.magFilter = THREE.NearestFilter

    this.rendererTargetForDepth.stencilBuffer = false

    this.rendererTargetForDepth.depthTexture = new THREE.DepthTexture()

    this.rendererTargetForDepth.depthTexture.format = THREE.DepthFormat

    this.rendererTargetForDepth.depthTexture.type = THREE.UnsignedShortType
  }

  createScene() {
    this.scene = new Scene()
  }

  createModelScene() {
    this.modelScene = new Scene()
  }

  createCamera() {
    const fov = 45
    const aspect = window.innerWidth / window.innerHeight
    const near = 0.1
    const far = 1000

    this.camera = new PerspectiveCamera(fov, aspect, near, far)

    this.camera.position.z = 3
  }

  createDepthCamera() {
    const fov = 45
    const aspect = window.innerWidth / window.innerHeight
    const near = 2
    const far = 3

    this.depthCamera = new PerspectiveCamera(fov, aspect, near, far)

    this.depthCamera.position.z = 2
  }

  createPane() {
    this.pane = new Pane()

    this.controledParams = {
      alpha: 1
    }

    this.pane.addBinding(this.controledParams, 'alpha', {
      min: 0,
      max: 1,
      step: 0.01
    })

    //hide
    this.pane.containerElem_.style.display = 'none'
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  createClock() {
    this.clock = new Clock()
  }

  /**home */
  createHome() {
    this.home = new Home({
      scene: this.scene,
      modelScene: this.modelScene,
      camera: this.depthCamera,
      sizes: this.sizes,
      device: this.device,
      assets: this.assets
    })
  }

  destroyHome() {
    this.home.destroy()
  }

  /**
   * events
   */

  onPreloaded() {
    this.onChangeEnd(this.template)
  }

  onChangeStart(template) {
    if (this.template !== template && template !== 'home') {
      this.home.hide()
    }

    this.template = template
  }

  onChangeEnd(template) {
    if (template == 'home') {
      this.createHome()
    } else {
      this.destroyHome()
    }
  }

  onResize(device) {
    this.bounds = this.container.getBoundingClientRect()

    this.renderer.setSize(window.innerWidth, window.innerHeight)

    const aspect = window.innerWidth / window.innerHeight

    const fov = this.camera.fov * (Math.PI / 180) // default camera.fov = 45deg. result fov is in radians. (1/4 PI rad)

    const height = 2 * Math.tan(fov / 2) * this.camera.position.z //z = 5 is setted at this.createCamera

    const width = height * aspect //To fit clip space to screen.

    this.sizes = {
      //Calclated viewport space sizes.
      height: height,
      width: width
    }

    const values = {
      sizes: this.sizes,
      device: device
    }

    this.home?.onResize(values)

    this.postProcessPipeline?.resize(values)

    this.camera.aspect = aspect

    // this.depthCamera.aspect = aspect
    this.depthCamera.aspect = 1

    this.camera.updateProjectionMatrix()

    this.depthCamera.updateProjectionMatrix()
  }

  onTouchDown(event) {
    this.isDown = true

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchDown(values)
    }

    if (this.collections) {
      this.collections.onTouchDown(values)
    }

    if (this.detail) {
      this.detail.onTouchDown(values)
    }

    if (this.home) {
      this.home.onTouchDown(values)
    }
  }

  onTouchMove(event) {
    if (!this.isDown) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchMove(values)
    }

    if (this.collections) {
      this.collections.onTouchMove(values)
    }

    if (this.detail) {
      this.detail.onTouchMove(values)
    }

    if (this.home) {
      this.home.onTouchMove(values)
    }
  }

  onTouchUp(event) {
    this.isDown = false

    const x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX
    const y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchUp(values)
    }

    if (this.collections) {
      this.collections.onTouchUp(values)
    }

    if (this.detail) {
      this.detail.onTouchUp(values)
    }

    if (this.home) {
      this.home.onTouchUp(values)
    }
  }

  onWheel({ pixelX, pixelY }) {
    if (this.collections) {
      // if (this.transition && this.transition.isTransitioning) return;

      this.collections.onWheel({ pixelX, pixelY })
    }

    if (this.home) {
      this.home.onWheel({ pixelX, pixelY })
    }
  }

  /**
   * postprocess
   */
  createPostProcessPipeline() {
    this.postProcessPipeline = new PostProcessPipeline({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera
    })

    this.postProcessPipeline.createPasses()

    this.postProcessPipeline.createPostProcess()
  }

  /**loop */

  update(scroll) {
    this.time.delta = this.clock.getDelta()

    this.time.previous = this.time.current

    this.time.current += this.time.delta

    this.renderer.setRenderTarget(this.rendererTargetForDepth)

    this.renderer.render(this.modelScene, this.depthCamera)

    let depthTexture = this.rendererTargetForDepth.depthTexture

    if (this.home) {
      this.home.update({
        scroll: scroll,
        time: this.time,
        controledParams: this.controledParams,
        camera: this.depthCamera,
        depthInfo: depthTexture
      })
    }

    this.renderer.setRenderTarget(null)

    this.renderer.render(this.scene, this.camera)

    // this.postProcessPipeline.render()
  }
}
