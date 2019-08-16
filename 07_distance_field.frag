#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    // remap the space to be betweeen -1 and 1
    vec2 st = 2.0 * (gl_FragCoord.xy / u_resolution.xy) - 1.0;
    st.x *= u_resolution.x / u_resolution.y; // aspect ratio
    vec3 color = vec3(0.0);
    float d = 0.0;

    // make the distance field
    d = length(abs(st) - 0.3); // ||vec2(|st.x| - 0.3, |st.y| - 0.3)||
    // d = length(min(abs(st) - 0.3, 0.0));
    // d = length(max(abs(st) - 0.3, 0.0));

    // visualize the distance field
    gl_FragColor = vec4(vec3(fract(d*10.0)), 1.0);

    // drawing with the distance field
    // gl_FragColor = vec4(vec3(step(0.3, d)), 1.0);
    // gl_FragColor = vec4(vec3(step(0.3, d) * step(d, 0.4)), 1.0);
    // gl_FragColor = vec4(vec3(smoothstep(0.3, 0.4, d) * smoothstep(0.6, 0.5, d)), 1.0);
}