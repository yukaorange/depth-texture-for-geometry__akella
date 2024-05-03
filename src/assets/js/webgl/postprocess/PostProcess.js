import {
  WebGLRenderTarget,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  OrthographicCamera
} from 'three'

import { map } from 'lodash'

import vertex from '../../shaders/post-vertex.glsl'
import fragment from '../../shaders/post-fragment.glsl'

export default class PostProcess {
  constructor({ renderer, passes }) {
    this.renderer = renderer

    this.passes = map(passes, pass => {
      return pass
    })

    this.currentSourse = null

    this.scene = new Scene()

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        tDiffuse: { value: null }
      }
    })

    this.geometry = new PlaneGeometry(2, 2)

    this.quad = new Mesh(this.geometry, this.material)

    this.scene.add(this.quad)
  }

  render({ texture }) {
    const rt = this.renderer.getRenderTarget()
    const autoClear = this.renderer.autoClear

    let backBuffer = texture

    for (let i = 0; i < this.passes.length; i++) {
      const pass = this.passes[i]

      pass.material.uniforms.tDiffuse.value = backBuffer

      this.quad.material = pass.material

      this.renderer.setRenderTarget(pass.renderTarget)

      this.renderer.render(this.scene, this.camera)
      
      if (pass.renderTarget) {
        backBuffer = pass.renderTarget.texture || null
      }
    }

    this.renderer.setRenderTarget(rt)
    this.renderer.autoClear = autoClear
  }

  resize(values) {}
}
