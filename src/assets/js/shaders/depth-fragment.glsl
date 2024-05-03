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
varying vec3 vPosition;
varying vec3 vNormal;

varying float vDepth;
varying float vStrength;


void main() {

  float toMix = smoothstep(0.25, 1., vDepth);

  float colotMix = smoothstep(0.0, 0.001, vStrength*100.);

  float r = 0.12 + vStrength * 1.;
  float g = 0.93 + vStrength * 10.;
  float b = 0.14 + vStrength * 20.;

  vec3 virtualColor = vec3(r, g, b);

  vec3 color = mix(vec3(1.0), virtualColor, colotMix);

  gl_FragColor.rgb = mix(vec3(0.0), color, toMix);

  gl_FragColor.a = 1.0;

}
