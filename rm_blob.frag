#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define SPHERE_RADIUS 0.25
#define T_MAX 20.0

// indexing of sd_ functions returns
#define SDF 0
#define MAT 1

// materials
#define MAT_FLOOR    1.0
#define MAT_BODY     2.0
#define MAT_EYE      3.0
#define MAT_PUPIL    4.0

// polynomial smooth min (https://www.iquilezles.org/www/articles/smin/smin.htm)
float smin(in float a, in float b, in float k) {
    float h = max(k - abs(a - b), 0.0);
    return min(a, b) - h * h / (k * 4.0);
}

float smax(in float a, in float b, in float k) {
    float h = max(k - abs(a - b), 0.0);
    return max(a, b) + h * h / (k * 4.0);
}

// signed distance function to a sphere
float sd_sphere(in vec3 pos, float radius) {
    return length(pos) - radius;
}

// signed distance function to an ellipsoid
float sd_ellipsoid(in vec3 pos, vec3 radii) {
    float k0 = length(pos / radii);
    float k1 = length(pos / radii / radii);
    return k0 * (k0 - 1.0) / k1;
}

float sd_stick(in vec3 pos, vec3 a, vec3 b, float ra, float rb) {
    vec3 ba = b - a;
    vec3 pa = pos - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float r = mix(ra, rb, h);
    return length(pa - h * ba) - r;
}

// returns a vec2 with the signed distance function to the blobby
// character 'guy' and also a flag that indicates the hit material
vec2 sd_guy(in vec3 pos) {
    float t = fract(u_time);
    float y = 4.0 * t * (1.0 - t);
    float dy = 4.0 * (1.0 - 2.0 * t); // derivative of y

    vec2 u = vec2(1.0, dy);
    vec2 v = vec2(-dy, 1.0); // perpendicular to the tangent vector u (dot(u, v) == 0)

    vec3 cen = vec3(0.0, y, 0.0);
    float sy = 0.5 + 0.5 * y; // squash and stretch
    float sz = 1.0 / sy; // scale z for the ellipsoid to preserve it's volume
    vec3 radii = vec3(SPHERE_RADIUS, SPHERE_RADIUS * sy, SPHERE_RADIUS * sz);

    vec3 q = pos - cen; // guy's coordinate system center
    float d = sd_ellipsoid(q, radii);

    // head
    vec3 head = q;
    vec3 shead = vec3(abs(head.x), head.yz); // exploit simmetry by using the absolute value of the x axis
    float d2 = sd_ellipsoid(head - vec3(0, 0.28, 0), vec3(0.15, 0.2, 0.23));
    float d3 = sd_ellipsoid(head - vec3(0, 0.28, -0.1), vec3(0.22, 0.2, 0.2));
    
    d2 = smin(d2, d3, 0.05);
    d = smin(d, d2, 0.15);

    // eyebrows
    vec3 eb = shead - vec3(0.12, 0.34, 0.15);
    eb.xy = (mat2(3, 4, -4, 3) / 5.0) * eb.xy; // rotate the eyebrow's coordinate system
    d2 = sd_ellipsoid(eb, vec3(0.06, 0.035, 0.05));
    d = smin(d, d2, 0.04);

    // mouth
    d2 = sd_ellipsoid(head - vec3(0.0, 0.15 + 3.0 * head.x * head.x, 0.15), // stretch space to make a smile
                    vec3(0.1, 0.04, 0.2));
    d = smax(d, -d2, 0.03); // space carving

    // ears
    d2 = sd_stick(shead, vec3(0.1, 0.4, -0.01), vec3(0.2, 0.55, 0.05), 0.01, 0.03);
    d = smin(d, d2, 0.03);

    vec2 res = vec2(d, MAT_BODY);
    
    // eye (sclera)
    float d4 = sd_sphere(shead - vec3(0.08, 0.28, 0.16), 0.05);
    if (d4 < d) {
        res = vec2(d4, MAT_EYE); // show the eyes if they're closer
        d = d4;
    }

    // pupil
    d4 = sd_sphere(shead - vec3(0.09, 0.28, 0.195), 0.02);
    if (d4 < d) res = vec2(d4, MAT_PUPIL); // show the eyes if they're closer

    return res;
}

// how far inside/outside the spheres in the scene is the point at 'pos'?
// and also, which material was hit?
vec2 map(in vec3 pos) {
    vec2 d1 = sd_guy(pos); // returns vec2(sdf value, hit material)

    // ground plane at y = -SPHERE_RADIUS (so the sphere perctly touches it)
    float d2 = pos.y - (-SPHERE_RADIUS); // a plane's SDF is how high above it you are
    
    return d2 < d1[SDF] ? vec2(d2, MAT_FLOOR) : d1;
}

// approximates the surface normal to get a sense of orientation
vec3 calc_normal(in vec3 pos) {
    vec2 e = vec2(0.0001, 0.0);
    // surface gradient
    return normalize(vec3(                               // how much do things change in the:
        map(pos + e.xyy)[SDF] - map(pos - e.xyy)[SDF],   //   left-right axis
        map(pos + e.yxy)[SDF] - map(pos - e.yxy)[SDF],   //   top-down
        map(pos + e.yyx)[SDF] - map(pos - e.yyx)[SDF])); //   front-back
}

float cast_shadow(in vec3 ro, in vec3 rd) {
    float res = 1.0;

    float t = 0.001;
    for (int i = 0; i < 100; ++i) {
        vec3 pos = ro + t * rd; // p(t)
        float h = map(pos)[SDF];
        // if (h < 0.0001) break; // obs.: quits early but makes the shadow close to the eye weird

        // soft shadows
        res = min(res, 16.0 * h / t);
        t += h;
        if (t > 20.0) break;
    }

    return clamp(res, 0.0, 1.0);
}

// returns the distance to the closest intersection and the material
vec2 cast_ray(in vec3 ro, in vec3 rd) {
    float m = -1.0;
    float t = 0.0;
    for (int i = 0; i < 100; ++i) {
        vec3 pos = ro + t * rd; // p(t)

        vec2 hm = map(pos); // hit point distance to the sphere center and material
        m = hm[MAT];

        float h = hm[SDF];
        if (h < 0.001) break; // we're close enough to the surface (0.0)

        t += h; // raymarch
        if (t >= T_MAX) break; // we've explored enough 
    }

    if (t >= T_MAX) {
        // t = -1.0; // we're "inside" the "outside" of the scene
        m = -1.0;
    }
    return vec2(t, m);
}

void main() {
    // pixel values normalized to [-1, 1] on the y axis, 
    // with (0, 0) at the center of the screen
	vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.x;

    // float an = 8.0 * u_mouse.x / u_resolution.x; // move camera angle with the mouse
    float an = 1.5 * u_time; // move camera angle with time
    // float an = 0.0; // fix camera angle

    // target point
    vec3 ta = vec3(0.0, 0.95, 0.0);

    // camera (ray origin)
    vec3 ro = ta + vec3(1.5 * sin(an), 0.0, 1.5 * cos(an));

    // camera transformation
    vec3 ww = normalize(ta - ro);                  // front versor
    vec3 uu = normalize(cross(ww, vec3(0, 1, 0))); // right versor
    vec3 vv = normalize(cross(uu, ww));            // top versor

    // point we're looking at (ray direction)
    vec3 rd = normalize(p.x * uu + p.y * vv + 1.8 * ww);

    // base sky color gradient
    vec3 color = vec3(0.4, 0.75, 1.0) - 0.7 * rd.y;
    // make the horizon line brighter and less saturated
    color = mix(color, vec3(0.7, 0.75, 0.8), exp(-10.0 * rd.y));

    vec2 tm = cast_ray(ro, rd); // hit point t and material m
    if (tm.y >= 0.0) {
        float t = tm.x;
        float m = tm.y;

        // we hit something
        vec3 hit_point = ro + t * rd;
        vec3 normal = calc_normal(hit_point);

        // add color based on the material
        vec3 matte = vec3(0.18); // albedo, "whiteness" (obs.: grass albedo ~= 0.25)
        if (m == MAT_FLOOR)      matte = vec3(0.05, 0.1, 0.02);
        else if (m == MAT_BODY)  matte = vec3(0.4, 0.1, 0.02);
        else if (m == MAT_EYE)   matte = vec3(0.4);
        else if (m == MAT_PUPIL) matte = vec3(0.005);

        vec3 sun_dir = normalize(vec3(0.8, 0.4, 0.2));
        // key light (sun diffuse)
        float sun_dif = clamp(dot(normal, sun_dir), 0.0, 1.0);
        // sun shadow (asks: "can this point be seen from the light source?")
        // obs.: we offset the query point a little to prevent self intersections
        // float sun_sha = step(cast_ray(hit_point + normal * 0.001, sun_dir)[MAT], 0.0); // 0 if t < 0.0
        float sun_sha = cast_shadow(hit_point + normal * 0.001, sun_dir);

        // fill light (sky diffuse)
        float sky_dif = clamp(0.5 + 0.5 * dot(normal, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);

        // bounce light
        float bou_dif = clamp(0.5 + 0.5 * dot(normal, vec3(0.0, -1.0, 0.0)), 0.0, 1.0);
        
        color  = matte * vec3(7.0, 4.5, 3.0) * sun_dif * sun_sha;
        // the more a surface is facing up (y axis), the more sky light it'll catch
        color += matte * vec3(0.5, 0.8, 0.9) * sky_dif;
        color += matte * vec3(0.7, 0.3, 0.2) * bou_dif;
    }

    // gamma correction
    color = pow(color, vec3(0.4545));

    gl_FragColor = vec4(color, 1);
}

// coordinate system (0 is the center of the screen)
//
//     y (up)
//     |
//     |
//     0 ----- x (right)
//    /
//   /
//  z (out*)
//
// * as in the right hand rule