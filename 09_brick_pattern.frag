#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 brick_tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    _st.x += 0.5 * step(1.0, mod(_st.y, 2.0));
    return fract(_st);
}

vec2 moving_tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    // _st.x += u_time * (1.0 - 2.0 * step(1.0, mod(_st.y, 2.0)));
    _st.x -= u_time * step(1.0, mod(_st.y, 2.0)); // odd rows right
    _st.x += u_time * (1.0 - step(1.0, mod(_st.y, 2.0))); // even rows left
    return fract(_st);
}

float box(vec2 _st, vec2 _size) {
    _size = (1.0 - _size) / 2.0; // vec2(0.5) - 0.5 * _size;
    vec2 eps = vec2(1e-5);
    vec2 uv = smoothstep(_size-eps, _size+eps, _st);
    uv *= smoothstep(_size-eps, _size+eps, vec2(1.0) - _st);
    return uv.x * uv.y;
}

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(1.0);

    // modern metric brick of 215mm x 102.5mm x 65mm
    // st /= vec2(2.15, 0.65) / 1.5;

    // st = brick_tile(st, 5.0);
    st = moving_tile(st, 5.0);

    color = vec3(st, 1.0);
    color = vec3(box(st, vec2(0.95)));

    gl_FragColor = vec4(color, 1.0);
}