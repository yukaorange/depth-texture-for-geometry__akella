precision mediump float;

#include <packing>
#include "./noise/simplex.glsl"

float PI = 3.14159265359;

varying vec2 vUv;
varying vec2 newUv;

varying float vDepth;

uniform sampler2D depthInfo;

uniform float cameraNear;
uniform float cameraFar;
uniform float uTime;

attribute float y;

float readDepth(sampler2D depthSampler, vec2 coord) {
  float fragCoordZ = texture2D(depthSampler, coord).x;

  float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);

  return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}

void main() {
  vUv = uv;

  vec2 newUv = vec2(vUv.x, y);

  vec3 pos = position;

  float depth = readDepth(depthInfo, newUv);

  depth = 1.0 - depth;//invert depth to positive z orientation

  pos.z += depth;

  pos.y += .01 * snoise(vec3(vec2(newUv * 18.75), uTime));

  vDepth = depth;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}
