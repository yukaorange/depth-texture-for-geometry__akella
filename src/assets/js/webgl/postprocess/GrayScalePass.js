import PostProcessPass from './PostProcessPass'

import { WebGLRenderTarget } from 'three'

import grayScaleFragment from '../../shaders/filter/grayscale-fragment.glsl'
import vertex from '../../shaders/post-vertex.glsl'

export default class GrayScalePass extends PostProcessPass {
  constructor() {
    super({
      fragment: grayScaleFragment,
      vertex: vertex,
      renderTarget: new WebGLRenderTarget(window.innerWidth, window.innerHeight)
    })
  }
}
