#ifdef GL_ES
precision mediump float;
#endif

#define HALF_EPSILON 0.005

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5) - st;
    float r = 2.0 * length(pos);
    float a = atan(pos.y, pos.x);

    float f = cos(3.0 * a + u_time);
    // f = abs(cos(3.0 * a));
    // f = 0.5 * abs(cos(2.5 * a)) + 0.3;
    color = vec3(1.0 - smoothstep(f, f+.02, r));

    float f_star = cos(u_time) * abs(cos(12.0 * a) * sin(3.0 * a)) + sin(u_time);
    float f_gear = 0.2 * sin(u_time) * smoothstep(-0.5, 1.0, cos(10.0 * a)) + 0.5;

    vec3 star = vec3(1.0 - smoothstep(f_star - HALF_EPSILON, f_star + HALF_EPSILON, r));
    vec3 gear = vec3(1.0 - smoothstep(f_gear - HALF_EPSILON, f_gear + HALF_EPSILON, r));

    color = (star * (0.5 * gear + 0.2) + 0.3 * gear);
    color -= 0.2 * vec3(1.0 - smoothstep(f, 0.5*f+.02, r));

    gl_FragColor = vec4(color, 1.0);
}