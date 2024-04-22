import GSAP from 'gsap'

import { ShaderMaterial, Mesh } from 'three'
import * as THREE from 'three'

import vertex from '@js/shaders/face-vertex.glsl'
import fragment from '@js/shaders/face-fragment.glsl'

export default class StretchPlane {
  constructor({ sizes, device, assets, camera }) {
    this.sizes = sizes

    this.device = device

    this.assets = assets

    this.camera = camera

    this.createTexture()

    this.cretateGeometry()

    this.createMaterial()

    this.createMesh()

    this.calculateBounds({
      sizes: this.sizes,
      device: this.device
    })
  }

  createTexture() {
    // this.texture = this.assets.textures[0]
  }

  cretateGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 0.005, 100, 1)
  }

  createMaterial() {
    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      uniforms: {
        // uTexture: { value: this.texture },
        uAlpha: { value: 0 },
        uTime: { value: 0 },
        depthInfo: { value: null },
        cameraNear: { value: this.camera.near },
        cameraFar: { value: this.camera.far }
      }
    })
  }

  createMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
  }

  calculateBounds({ sizes, device }) {
    this.sizes = sizes

    this.device = device

    this.updateScale(this.device)

    this.updateX()

    this.updateY()
  }

  /**
   * Animations
   */
  show() {
    GSAP.fromTo(
      this.mesh.material.uniforms.uAlpha,
      {
        value: 0
      },
      {
        value: 1
      }
    )
  }

  hide() {
    GSAP.to(this.mesh.material.uniforms.uAlpha, {
      value: 0
    })
  }
  /**
   * events
   */
  onResize(value) {
    this.calculateBounds(value)
  }

  /**
   * update
   */

  updateScale() {
    const scale = [1.0, 1.0, 1.0]

    this.mesh.scale.set(...scale)
  }

  updateX(x = 0) {}

  updateY(y = 0) {}

  update({ scroll, time, controledParams, depthInfo }) {
    this.updateX(scroll.x)

    this.updateY(scroll.y)

    this.material.uniforms.uTime.value = time.current

    this.mesh.material.uniforms.uAlpha.value = controledParams.alpha

    this.mesh.material.uniforms.depthInfo.value = depthInfo
  }
}
