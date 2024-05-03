import GSAP from 'gsap'

import * as THREE from 'three'

import vertex from '@js/shaders/vertex.glsl'
import fragment from '@js/shaders/fragment.glsl'

export default class Plane {
  constructor({ sizes, device, assets }) {
    this.sizes = sizes

    this.device = device

    this.assets = assets

    this.createTexture()

    this.createGeometry()

    this.createMaterial()

    this.addMaterialToModel()

    this.calculateBounds({
      sizes: this.sizes,
      device: this.device
    })
  }

  createTexture() {
    // this.texture = this.assets.textures[0]
  }

  createGeometry() {
    this.face = this.assets.models.face.scene.children[0]

    this.face.geometry.center()

    this.face.rotation.x = Math.PI * (3.2 / 2)

    const scale = 0.08

    this.face.scale.set(scale, scale, scale)

    this.face.position.set(0, 0, -1)
  }

  createMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      color: 0x000000
    })
  }

  addMaterialToModel() {
    this.face.traverse(object => {
      if (object.isMesh) {
        object.material = this.material
      }
    })
  }

  calculateBounds({ sizes, device }) {
    this.sizes = sizes

    this.device = device

    this.updateX()

    this.updateY()
  }

  /**
   * Animations
   */
  show() {}

  hide() {}
  /**
   * events
   */
  onResize(value) {
    this.calculateBounds(value)

    this.updateScale({
      device: this.device
    })
  }

  /**
   * update
   */

  updateScale({ device }) {
    let scale

    if (device == 'pc') {
      scale = 0.08
    }

    if (device == 'sp') {
      scale = 0.04
    }

    this.face.scale.set(scale, scale, scale)
  }

  updateX(x = 0) {}

  updateY(y = 0) {}

  update({ scroll, time, controledParams, depthInfo }) {
    this.updateX(scroll.x)

    this.updateY(scroll.y)

    this.face.position.z = -0.49 + 0.01 * Math.sin(time.current)

    // this.face.rotation.z = 0.2 * Math.cos(time.current)
  }
}
