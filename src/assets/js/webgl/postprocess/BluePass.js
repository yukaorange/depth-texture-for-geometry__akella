import PostProcessPass from './PostProcessPass'
import { WebGLRenderTarget } from 'three'

import BlueFragment from '../../shaders/filter/blue-fragment.glsl'
import vertex from '../../shaders/post-vertex.glsl'

export default class BluePass extends PostProcessPass {
  constructor() {
    super({
      fragment: BlueFragment,
      vertex: vertex,
      renderTarget: new WebGLRenderTarget(window.innerWidth, window.innerHeight)
    })
  }
}
