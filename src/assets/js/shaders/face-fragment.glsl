precision mediump float;

uniform float uAlpha;
uniform float uTime;
// uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  float time = uTime;

  vec2 uv = vUv;

  vec3 color = vec3(0.0);

  color.x = uv.x;
  color.y = uv.y;

  color.z = sin(time);

  vec3 testColor = vec3(uv.x);

  gl_FragColor = vec4(color, uAlpha);

  // gl_FragColor = vec4(testColor, 1.0);
}
