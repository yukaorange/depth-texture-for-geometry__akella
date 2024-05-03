precision mediump float;

#include <packing>
#include "./noise/simplex.glsl"

float PI = 3.14159265359;

varying float vDepth;
varying float vStrength;

varying vec2 vUv;

varying vec3 vPosition;
varying vec3 vNormal;

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

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vNormal = normalMatrix * normal;

  vPosition = modelPosition.xyz;

  float depth = readDepth(depthInfo, newUv);

  depth = 1.0 - depth;//invert depth to positive z orientation

  pos.z += depth;

  pos.y += .001 * snoise(vec3(vec2(newUv * 18.75), uTime));

  float interval = uTime - modelPosition.y;

  float strength = sin(interval * 2.12) + sin(interval * 4.3) + sin(interval * 5.76);

  strength = smoothstep(0.1, 1.0, strength);

  strength = abs(strength);

  strength *= 0.05;

  pos.y += snoise(modelPosition.xyz * 1.0) * strength;

  pos.z += snoise(modelPosition.xyz * 100.0) * strength;

  vStrength = strength;

  vDepth = depth;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}
