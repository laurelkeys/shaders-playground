#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;

vec2 brick_tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    _st.x += 0.5 * step(1.0, mod(_st.y, 2.0));
    return fract(_st);
}

vec2 moving_tile(vec2 _st, float _zoom, float _speed) {
    _st *= _zoom;
    float time = u_time * _speed;
    if (fract(time) > 0.5) {
        // horizontal move
        if (fract(_st.y * 0.5) > 0.5) {
            _st.x += fract(time) * 2.;
        } else {
            _st.x -= fract(time) * 2.;
        }
    } else {
        // vertical move
        if (fract(_st.x * 0.5) > 0.5) {
            _st.y += fract(time) * 2.;
        } else {
            _st.y -= fract(time) * 2.;
        }
    }
    return fract(_st);
}

float circle(vec2 _st, float _radius) {
    vec2 pos = vec2(0.5) - _st;
    float eps = 0.1;
    // return step(1.0 - dot(pos, pos), _radius);
    return smoothstep((1.0 - eps) * _radius,
                      (1.0 + eps) * _radius,
                      1.0 - PI * dot(pos, pos));
}

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    vec3 color = vec3(1.0);

    st = moving_tile(st, 13.0, 0.25);

    color = vec3(1.0 - circle(st, 0.35));

    gl_FragColor = vec4(color, 1.0);
}