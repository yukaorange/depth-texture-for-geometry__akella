import map from 'lodash/map'
import GSAP from 'gsap'

import { PlaneGeometry } from 'three'

import * as THREE from 'three'

import Face from './object/Face'
import Plane from './object/Plane'
import StretchPlane from './object/StretchPlane'

export default class Home {
  constructor({ scene, sizes, device, assets }) {
    this.scene = scene

    this.sizes = sizes

    this.device = device

    this.assets = assets

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.scrollCurrent = {
      //necessary to memolize touchstart position.
      x: 0,
      y: 0
    }

    this.scroll = {
      x: 0,
      y: 0
    }

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.createModel()

    this.createPlaneArray()

    this.createPlane()

    this.onResize({
      sizes: this.sizes,
      device: this.device
    })

    this.show()
  }

  createModel() {
    this.model = new Face({
      sizes: this.sizes,
      device: this.device,
      assets: this.assets
    })

    this.scene.add(this.model.face)
  }

  createPlaneArray() {
    this.strechPlane = new StretchPlane({
      sizes: this.sizes,
      device: this.device,
      assets: this.assets
    })

    let number = 20

    for (let i = 0; i < number; i++) {
      let mesh = this.strechPlane.mesh.clone()

      mesh.position.y = (i - number / 2) / number

      this.scene.add(mesh)
    }
  }

  createPlane() {
    this.plane = new Plane({
      sizes: this.sizes,
      device: this.device,
      assets: this.assets
    })

    this.scene.add(this.plane.mesh)
  }

  /**
   * animate
   */

  show() {
    this.model.show()
  }

  hide() {
    this.model.hide()
  }

  /**
   * events
   */
  onResize(values) {
    this.model?.onResize(values)

    this.plane?.onResize(values)

    this.strechPlane?.onResize(values)
  }

  onTouchDown({ x, y }) {
    this.speed.target = 1
    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove({ x, y }) {
    const xDistance = x.start - x.end
    const yDistance = y.start - y.end

    this.x.target = this.scrollCurrent.x - xDistance
    this.y.target = this.scrollCurrent.y - yDistance
  }

  onTouchUp({ x, y }) {
    this.speed.target = 0
  }

  onWheel({ pixelX, pixelY }) {
    this.x.target -= pixelX
    this.y.target -= pixelY
  }

  /**
   * update
   */
  update({ scroll, time, controledParams, depthInfo }) {
    const params = {
      scroll: scroll,
      time: time,
      controledParams: controledParams,
      depthInfo: depthInfo
    }

    this.model?.update(params)

    this.plane?.update(params)

    this.strechPlane?.update(params)
  }

  /**
   * destroy
   */
  destroy() {
    this.scene.remove(this.model.mesh)
  }
}
