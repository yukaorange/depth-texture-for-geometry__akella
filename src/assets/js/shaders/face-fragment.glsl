precision mediump float;

#include <packing>
#include "./noise/simplex.glsl"

float PI = 3.14159265359;

uniform float uAlpha;
uniform float uTime;
uniform sampler2D depthInfo;

uniform float cameraNear;
uniform float cameraFar;

varying vec2 vUv;
varying vec2 newUv;

varying float vDepth;

float readDepth(sampler2D depthSampler, vec2 coord) {
  float fragCoordZ = texture2D(depthSampler, coord).x;
  float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
  return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}

void main() {

  float depth = readDepth(depthInfo, newUv);

  float moMix = smoothstep(0.2, 1.0, vDepth);

  gl_FragColor.rgb = mix(vec3(0.0), vec3(1.0), moMix);

  gl_FragColor.a = 1.0;

}
