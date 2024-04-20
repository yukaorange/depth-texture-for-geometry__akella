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

    const scale = 0.025

    this.face.scale.set(scale, scale, scale)
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      uniforms: {
        // uTexture: { value: this.texture },
        uAlpha: { value: 0 },
        uTime: { value: 0 },
        depthInfo: { value: null }
      }
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
  show() {
    // GSAP.fromTo(
    //   this.mesh.material.uniforms.uAlpha,
    //   {
    //     value: 0
    //   },
    //   {
    //     value: 1
    //   }
    // )
  }

  hide() {
    // GSAP.to(this.mesh.material.uniforms.uAlpha, {
    //   value: 0
    // })
  }
  /**
   * events
   */
  onResize(value) {
    this.calculateBounds(value)

    this.updateScale(this.device)
  }

  /**
   * update
   */

  updateScale() {}

  updateX(x = 0) {}

  updateY(y = 0) {}

  update({ scroll, time, controledParams, depthInfo }) {
    this.updateX(scroll.x)

    this.updateY(scroll.y)

    this.material.uniforms.uTime.value = time.current

    this.material.uniforms.uAlpha.value = controledParams.alpha
  }
}
