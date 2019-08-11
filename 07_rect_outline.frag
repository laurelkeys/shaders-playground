#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float istep(float edge, float x) {
    return 1.0 - step(edge, x);
}

float pulse(float edge0, float edge1, float x) {
    return step(edge0, x) - step(edge1, x);
}

float ipulse(float edge0, float edge1, float x) {
    return 1.0 - pulse(edge0, edge1, x);
}

float sumFold(vec4 v) {
    return v.x + v.y + v.z + v.w;
}

float productFold(vec4 v) {
    return v.x * v.y * v.z * v.w;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    float size = 0.2;
    vec2 margin = vec2(0.1, 0.1);

    vec4 sides = vec4(
        ipulse(margin.x, margin.x + size, st.x),       // left
        ipulse(margin.y, margin.y + size, 1.0 - st.y), // top
        ipulse(margin.x, margin.x + size, 1.0 - st.x), // right
        ipulse(margin.y, margin.y + size, st.y)        // bottom
    );

    vec4 margins = vec4(
        istep(margin.x, st.x),    // left
        istep(margin.y, 1.-st.y), // top
        istep(margin.x, 1.-st.x), // right
        istep(margin.y, st.y)     // bottom
    );

    color = vec3(productFold(sides) + sumFold(margins));

    gl_FragColor = vec4(color, 1.0);
}