#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
    float epsilon = 0.02;
    return smoothstep(pct-epsilon, pct, st.y) -
           smoothstep(pct, pct+epsilon, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    float e = 0.5 * (sin(u_time) + 1.0) + 0.5; // value between 0.5-1.5
    float y = pow(st.x, e);
    // float y = st.x;
    
    vec3 color = vec3(y); // vec3(y, y, y)

    float pct = plot(st, y);
    color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0); // lerp

    gl_FragColor = vec4(color, 1.0);
}