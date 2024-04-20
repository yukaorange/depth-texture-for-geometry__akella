import PostProcessPass from './PostProcessPass'

import { WebGLRenderTarget } from 'three'

import OutFragment from '../../shaders/filter/out-fragment.glsl'
import vertex from '../../shaders/post-vertex.glsl'

export default class OutPass extends PostProcessPass {
  constructor() {
    super({
      fragment: OutFragment,
      vertex: vertex,
      renderTarget: null
    })
  }
}
