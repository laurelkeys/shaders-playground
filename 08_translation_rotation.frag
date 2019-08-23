#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(in float angle) {
    return mat2(cos(angle), -sin(angle),
                sin(angle),  cos(angle));
}

mat2 scale(in vec2 scale){
    return mat2(scale.x, 0.0,
                0.0, scale.y);
}

float box(in vec2 st, in vec2 size) {
    size = vec2(0.5) - 0.5 * size;
    
    const vec2 eps = vec2(0.001);
    vec2 uv = smoothstep(size, size + eps, st);
    uv *= smoothstep(size, size + eps, vec2(1.0) - st);

    return uv.x * uv.y;
}

float box_cross(in vec2 st, in float size) {
    return box(st, vec2(size,size/4.)) +
           box(st, vec2(size/4.,size));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // to move the cross we move the space
    vec2 translate = vec2(cos(u_time), sin(u_time));
    st += 0.35 * translate;

    // center space on vec2(0.0) before rotating
    st -= vec2(0.5);
    st = rotate2d(sin(u_time) * PI) * st; // matrix product
    // st = scale(0.25 + vec2(sin(u_time) + 1.0)) * st; // matrix product
    st += vec2(0.5);

    vec3 color = vec3(0.0);
    // show the coordinates of the space on the background
    // color = vec3(st.x, st.y, 0.0);

    color += vec3(box_cross(st, 0.25));
    gl_FragColor = vec4(color,1.0);
}