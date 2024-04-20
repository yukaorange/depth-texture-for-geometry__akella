import PostProcessPass from './PostProcessPass'
import { WebGLRenderTarget } from 'three'

import GreenFragment from '../../shaders/filter/green-fragment.glsl'
import vertex from '../../shaders/post-vertex.glsl'

export default class GreenPass extends PostProcessPass {
  constructor() {
    super({
      fragment: GreenFragment,
      vertex: vertex,
      renderTarget: new WebGLRenderTarget(window.innerWidth, window.innerHeight)
    })
  }
}
