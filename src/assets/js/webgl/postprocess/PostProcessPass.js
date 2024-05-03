import {
  PlaneGeometry,
  OrthographicCamera,
  Scene,
  Mesh,
  ShaderMaterial
} from 'three'

export default class PostProcessPass {
  constructor({ vertex, fragment, renderTarget }) {
    this.material = new ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.renderTarget = renderTarget || null
  }

  resize(values) {
    if (this.renderTarget) {
      // this.renderTarget.setSize()
    }
  }
}
