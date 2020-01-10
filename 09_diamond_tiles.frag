#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265358979323846

vec2 rotate2D(vec2 _st, float _angle) {
    _st -= 0.5; // [0, 1] -> [-0.5, 0.5]
    _st = mat2(cos(_angle), -sin(_angle),
               sin(_angle),  cos(_angle)) * _st;
    _st += 0.5; // [-0.5, 0.5] -> [0, 1]
    return _st;
}

vec2 tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

float box(vec2 _st, vec2 _size, float _smoothEdges) {
    _size = vec2(0.5) - 0.5 * _size;
    vec2 aa = vec2(0.5 * _smoothEdges);
    vec2 uv = smoothstep(_size-aa, _size+aa, _st);
    uv *= smoothstep(_size-aa, _size+aa, vec2(1.0) - _st);
    return uv.x * uv.y;
}

vec2 offset(vec2 _st, vec2 _offset) {
    return vec2(
        _st.x + 0.5 - float(_st.x > 0.5), // (_st.x > 0.5) ? _st.x - 0.5 : _st.x + 0.5
        _st.y + 0.5 - float(_st.y > 0.5)  // (_st.y > 0.5) ? _st.y - 0.5 : _st.y + 0.5
    );
}

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.y *= u_resolution.y / u_resolution.x;
    vec3 color = vec3(0.0);

    st = tile(st, 10.0);
    vec2 offset_st = offset(st, vec2(0.5));
    st = rotate2D(st, 0.25 * PI); // try moving this one line up

    color += vec3(box(offset_st, vec2(0.95), 0.01)); // grid
    color -= vec3(box(st, vec2(0.3), 0.01));         // black diamond (outline)
    color += vec3(box(st, vec2(0.2), 0.01)) * 2.;    // white diamond (interior)

    gl_FragColor = vec4(color, 1.0);
}