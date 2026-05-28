(function () {
'use strict';

/* ---------- inline GLSL (Fedelo's exact shader) ---------- */

var VS_SRC = [
  'attribute vec2 a_pos;',
  'void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }'
].join('\n');

var FS_SRC = [
  'precision highp float;',
  'uniform vec2  u_res;',
  'uniform vec2  u_mouse;',
  'uniform float u_time;',
  'uniform float u_dark;',
  'uniform float u_glowStr;',
  'uniform float u_glowSize;',
  'uniform vec3  u_glowCol;',
  'uniform float u_mood;',
  'uniform float u_hover;',
  'uniform vec2  u_cpos[8];',
  'uniform float u_cage[8];',
  '',
  'vec2 hash2(vec2 p) {',
  '  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));',
  '  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);',
  '}',
  'float noise(vec2 p) {',
  '  vec2 i = floor(p), f = fract(p);',
  '  vec2 u = f * f * (3.0 - 2.0 * f);',
  '  return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),',
  '                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),',
  '             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),',
  '                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);',
  '}',
  'float fbm(vec2 p) {',
  '  float v = 0.0, a = 0.5;',
  '  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);',
  '  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }',
  '  return v;',
  '}',
  '',
  'void main() {',
  '  vec2 uv  = gl_FragCoord.xy / u_res;',
  '  float asp = u_res.x / u_res.y;',
  '  vec2 st  = vec2(uv.x * asp, uv.y);',
  '  vec2 ms  = vec2(u_mouse.x * asp, u_mouse.y);',
  '  float t  = u_time * 0.10;',
  '',
  '  /* domain-warped flow field */',
  '  vec2 q = vec2(fbm(st + vec2(0.0, 0.0) + t),',
  '                fbm(st + vec2(5.2, 1.3) + t * 0.75));',
  '  vec2 r = vec2(fbm(st + 2.2 * q + vec2(1.7, 9.2) + t * 0.5),',
  '                fbm(st + 2.2 * q + vec2(8.3, 2.8) + t * 0.4));',
  '  float f = fbm(st + 2.4 * r);',
  '  f = f * 0.5 + 0.5;',
  '',
  '  /* mouse field */',
  '  float md = length(st - ms);',
  '  float gSize = u_glowSize;',
  '  float mg = exp(-md * md * (5.5 / (gSize * gSize)));',
  '  float mgSharp = exp(-md * md * 80.0);',
  '  f += mg * 0.22 * (0.6 + 0.4 * u_hover);',
  '',
  '  /* contour lines from field */',
  '  float density = mix(10.0, 7.0, u_dark);',
  '  float cf = fract(f * density);',
  '  float contour  = smoothstep(0.06, 0.0, abs(cf - 0.5));',
  '  float contour2 = smoothstep(0.025, 0.0, abs(cf - 0.5)) * 0.5;',
  '',
  '  /* click ripples */',
  '  float ripple = 0.0;',
  '  for (int i = 0; i < 8; i++) {',
  '    float age = u_cage[i];',
  '    if (age >= 0.0 && age < 2.2) {',
  '      vec2 cp = vec2(u_cpos[i].x * asp, u_cpos[i].y);',
  '      float d = length(st - cp);',
  '      float spd = 0.55;',
  '      float R = age * spd;',
  '      float w = 0.022;',
  '      float ring  = (smoothstep(R - w,        R - w * 0.3, d) - smoothstep(R + w * 0.3, R + w, d));',
  '      float R2 = R * 0.52;',
  '      float ring2 = (smoothstep(R2 - w * 0.5, R2,           d) - smoothstep(R2,         R2 + w * 0.5, d));',
  '      float fade = exp(-age * 2.0);',
  '      ripple += (ring + ring2 * 0.4) * fade;',
  '    }',
  '  }',
  '',
  '  /* palette */',
  '  vec3 bg      = mix(vec3(1.000, 1.000, 1.000), vec3(0.039, 0.039, 0.039), u_dark);',
  '  vec3 lineCol = mix(vec3(0.86,  0.86,  0.86 ), vec3(0.20,  0.19,  0.18 ), u_dark);',
  '  vec3 accent  = u_glowCol;',
  '',
  '  vec3 col = bg;',
  '  col = mix(col, lineCol, (contour + contour2) * mix(0.22, 0.80, u_dark));',
  '',
  '  float hov = u_hover;',
  '  float strength = u_glowStr;',
  '',
  '  if (u_mood < 0.5) {',
  '    /* SUBTLE */',
  '    col = mix(col, accent, mg * mix(0.06, 0.28, u_dark) * strength);',
  '    col = mix(col, accent, clamp(ripple, 0.0, 1.0) * mix(0.28, 0.65, u_dark) * strength);',
  '    col = mix(col, mix(vec3(1.0), accent, 0.5), mgSharp * mix(0.45, 0.9, u_dark) * strength);',
  '  } else if (u_mood < 1.5) {',
  '    /* WARM BLOOM */',
  '    float bloom = mg * mix(0.55, 0.85, u_dark) * strength;',
  '    col = mix(col, accent, bloom);',
  '    col = mix(col, accent, (contour + contour2) * mg * 0.55 * strength);',
  '    col = mix(col, accent, clamp(ripple, 0.0, 1.0) * 0.7 * strength);',
  '    vec3 core = mix(vec3(1.0, 0.95, 0.85), accent, 0.4);',
  '    col = mix(col, core, mgSharp * 0.95 * strength);',
  '  } else if (u_mood < 2.5) {',
  '    /* SPOTLIGHT */',
  '    float dim = smoothstep(0.0, 1.4, md) * mix(0.12, 0.35, u_dark) * (0.4 + 0.6 * hov);',
  '    col = mix(col, mix(bg * 0.55, bg, 0.4), dim * strength);',
  '    float pool = exp(-md * md * 3.5 / (gSize * gSize));',
  '    col = mix(col, accent, pool * 0.45 * strength);',
  '    col = mix(col, mix(vec3(1.0), accent, 0.3), mgSharp * 1.0 * strength);',
  '    col += accent * (contour + contour2) * pool * 0.6 * strength;',
  '    col = mix(col, accent, clamp(ripple, 0.0, 1.0) * 0.7 * strength);',
  '  } else {',
  '    /* INVERTED */',
  '    float inv = mg * strength;',
  '    vec3 invBg = accent;',
  '    vec3 invLine = mix(vec3(1.0), bg, 0.2);',
  '    col = mix(col, invBg, inv * 0.85);',
  '    col = mix(col, invLine, (contour + contour2) * inv * 0.9);',
  '    col = mix(col, vec3(1.0), mgSharp * 0.9 * strength);',
  '    col = mix(col, vec3(1.0), clamp(ripple, 0.0, 1.0) * 0.6 * strength);',
  '  }',
  '',
  '  gl_FragColor = vec4(col, 1.0);',
  '}'
].join('\n');

/* ---------- helpers ---------- */
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function hexToRgb(hex) {
  var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex || ''));
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1.0, 0.29, 0.11];
}
var MOOD = { subtle: 0, bloom: 1, spotlight: 2, inverted: 3 };

/* ---------- public factory ---------- */

function createShaderBg(container, options) {
  options = options || {};
  var opts = {
    color:     options.color     || '#c6f432',
    darkMode:  !!options.darkMode,
    forceDark: !!options.forceDark,
    strength:  clamp(options.strength != null ? options.strength : 1.6, 0, 3),
    size:      clamp(options.size     != null ? options.size     : 1.0, 0.4, 3),
    mood:      options.mood      || 'bloom',
    textReact: options.textReact !== false,
  };

  var canvas = document.createElement('canvas');
  canvas.className = 'hero-flowfield';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  var gl = null;
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
      || canvas.getContext('experimental-webgl', { antialias: false, alpha: false });
  } catch (e) { /* ignore */ }

  if (!gl) return mountFallback();

  /* compile + link */
  function compileShader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      try { console.warn('ShaderBg compile error:', gl.getShaderInfoLog(s)); } catch (e) {}
      gl.deleteShader(s);
      return null;
    }
    return s;
  }
  var vs = compileShader(gl.VERTEX_SHADER, VS_SRC);
  var fs = compileShader(gl.FRAGMENT_SHADER, FS_SRC);
  if (!vs || !fs) return mountFallback();

  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    try { console.warn('ShaderBg link error:', gl.getProgramInfoLog(program)); } catch (e) {}
    gl.deleteProgram(program);
    return mountFallback();
  }
  gl.deleteShader(vs); gl.deleteShader(fs);
  gl.useProgram(program);

  /* full-screen quad */
  var vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var U = {
    res:      gl.getUniformLocation(program, 'u_res'),
    mouse:    gl.getUniformLocation(program, 'u_mouse'),
    time:     gl.getUniformLocation(program, 'u_time'),
    dark:     gl.getUniformLocation(program, 'u_dark'),
    glowStr:  gl.getUniformLocation(program, 'u_glowStr'),
    glowSize: gl.getUniformLocation(program, 'u_glowSize'),
    glowCol:  gl.getUniformLocation(program, 'u_glowCol'),
    mood:     gl.getUniformLocation(program, 'u_mood'),
    hover:    gl.getUniformLocation(program, 'u_hover'),
    cpos:     gl.getUniformLocation(program, 'u_cpos[0]'),
    cage:     gl.getUniformLocation(program, 'u_cage[0]'),
  };

  /* runtime state */
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var glowRgb = hexToRgb(opts.color);
  var dv = (opts.forceDark || opts.darkMode) ? 1.0 : 0.0;

  var state = {
    mouse:     [0.5, 0.5],
    mouseLerp: [0.5, 0.5],
    hover:     0,
    hoverLerp: 0,
    clicks:    [], ages: new Float32Array(8).fill(-99),
    idx:       0,
    t0:        Date.now(),
    raf:       null,
  };
  for (var i = 0; i < 8; i++) state.clicks.push([0.5, 0.5]);

  var visible = true, running = true;
  var reactLines = opts.textReact ? container.querySelectorAll('[data-react-line]') : null;

  function resize() {
    canvas.width  = Math.max(1, Math.floor(canvas.offsetWidth  * DPR));
    canvas.height = Math.max(1, Math.floor(canvas.offsetHeight * DPR));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  var ro = new ResizeObserver(resize); ro.observe(canvas);

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) visible = entries[i].isIntersecting;
    if (visible && running && state.raf == null) draw();
  }, { threshold: 0 });
  io.observe(container);

  /* draw loop */
  function draw() {
    if (!running || !visible) { state.raf = null; return; }

    /* eased mouse + hover */
    state.mouseLerp[0] += (state.mouse[0] - state.mouseLerp[0]) * 0.06;
    state.mouseLerp[1] += (state.mouse[1] - state.mouseLerp[1]) * 0.06;
    state.hoverLerp    += (state.hover    - state.hoverLerp)    * 0.08;

    var t = (Date.now() - state.t0) / 1000;
    var targetDark = (opts.forceDark || opts.darkMode) ? 1 : 0;
    dv += (targetDark - dv) * 0.08;

    var moodId = MOOD[opts.mood] != null ? MOOD[opts.mood] : 1;
    var glowStr = opts.strength * (0.55 + 0.45 * state.hoverLerp);

    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform2f(U.mouse, state.mouseLerp[0], state.mouseLerp[1]);
    gl.uniform1f(U.time, t);
    gl.uniform1f(U.dark, dv);
    gl.uniform1f(U.glowStr, glowStr);
    gl.uniform1f(U.glowSize, opts.size);
    gl.uniform3f(U.glowCol, glowRgb[0], glowRgb[1], glowRgb[2]);
    gl.uniform1f(U.mood, moodId);
    gl.uniform1f(U.hover, state.hoverLerp);

    /* per-line text reactivity, computed in the same RAF for consistency.
       --prox carries raw cursor proximity (0..1); --hov carries the eased hover
       state (0..1). CSS composes them — usually as `--prox * --hov` so the
       effect requires both signals to peak. Matches Fedelo's pattern. */
    if (opts.textReact && reactLines && reactLines.length) {
      var rect = canvas.getBoundingClientRect();
      var cx = rect.left + state.mouseLerp[0] * rect.width;
      var cy = rect.top  + (1 - state.mouseLerp[1]) * rect.height;
      var maxD = Math.max(rect.width, rect.height) * 0.55;
      for (var i = 0; i < reactLines.length; i++) {
        var line = reactLines[i];
        var lr = line.getBoundingClientRect();
        var lx = lr.left + lr.width / 2;
        var ly = lr.top  + lr.height / 2;
        var dx = cx - lx, dy = cy - ly;
        var d = Math.sqrt(dx * dx + dy * dy);
        var prox = Math.max(0, 1 - d / maxD);
        line.style.setProperty('--prox', prox.toFixed(3));
        line.style.setProperty('--hov', state.hoverLerp.toFixed(3));
      }
    }

    /* click ripples — pos array (vec2) + age array */
    var cp = new Float32Array(16), ca = new Float32Array(8);
    for (var j = 0; j < 8; j++) {
      cp[j * 2]     = state.clicks[j][0];
      cp[j * 2 + 1] = state.clicks[j][1];
      ca[j] = state.ages[j] >= 0 ? (t - state.ages[j]) : -1.0;
    }
    gl.uniform2fv(U.cpos, cp);
    gl.uniform1fv(U.cage, ca);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    state.raf = requestAnimationFrame(draw);
  }
  draw();

  /* event handlers — attached to the container, not the canvas */
  function onMove(e) {
    var r = container.getBoundingClientRect();
    state.mouse[0] = (e.clientX - r.left) / r.width;
    state.mouse[1] = 1 - (e.clientY - r.top) / r.height;
    state.hover = 1;
  }
  function onEnter() { state.hover = 1; }
  function onLeave() {
    state.hover = 0;
    if (opts.textReact && reactLines) {
      for (var i = 0; i < reactLines.length; i++) {
        reactLines[i].style.setProperty('--prox', '0');
        reactLines[i].style.setProperty('--hov', '0');
      }
    }
  }
  function onClick(e) {
    if (e.target.closest && e.target.closest('a, button')) return;
    var r = container.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width;
    var y = 1 - (e.clientY - r.top) / r.height;
    var i = state.idx % 8;
    state.clicks[i] = [x, y];
    state.ages[i] = (Date.now() - state.t0) / 1000;
    state.idx++;
  }
  container.addEventListener('mousemove', onMove);
  container.addEventListener('mouseenter', onEnter);
  container.addEventListener('mouseleave', onLeave);
  container.addEventListener('click', onClick);

  /* lost-context safety */
  canvas.addEventListener('webglcontextlost', function (e) {
    e.preventDefault();
    running = false;
    if (state.raf) { cancelAnimationFrame(state.raf); state.raf = null; }
    mountFallback(true);
  }, false);

  /* public controller */
  return {
    setColor:    function (hex) { glowRgb = hexToRgb(hex); opts.color = hex; },
    setDarkMode: function (d)   { opts.darkMode = !!d; },
    setMood:     function (m)   { if (MOOD[m] != null) opts.mood = m; },
    setStrength: function (s)   { opts.strength = clamp(+s, 0, 3); },
    setSize:     function (s)   { opts.size     = clamp(+s, 0.4, 3); },
    destroy: function () {
      running = false;
      if (state.raf) cancelAnimationFrame(state.raf);
      ro.disconnect(); io.disconnect();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      container.removeEventListener('click', onClick);
      try { gl.deleteProgram(program); gl.deleteBuffer(vbo); } catch (e) {}
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };

  function mountFallback(keepCanvas) {
    if (!keepCanvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    container.setAttribute('data-flowfield-fallback', 'true');
    var fb = document.createElement('div');
    fb.className = 'hero-flowfield-fallback';
    fb.setAttribute('aria-hidden', 'true');
    container.insertBefore(fb, container.firstChild);
    return {
      setColor:    function () {}, setDarkMode: function () {},
      setMood:     function () {}, setStrength: function () {}, setSize: function () {},
      destroy: function () {
        if (fb.parentNode) fb.parentNode.removeChild(fb);
        container.removeAttribute('data-flowfield-fallback');
      }
    };
  }
}

/* ---------- mounts ---------- */

(function mount() {
  /* Both shader containers (hero + end-CTA card) live inside a
     .theme-dark scope, so the shader is pinned to dark regardless
     of page-level theme. Same architecture as fedelo.studio. */

  var hero = document.getElementById('hero-shader');
  if (hero) {
    hero.style.setProperty('--hero-glow', '#c6f432');
    var heroBg = createShaderBg(hero, {
      color:     '#c6f432',
      forceDark: true,
      strength:  1.6,
      size:      1.0,
      mood:      'spotlight',
    });
    window.__youmakeitFlowField = heroBg;
  }

  var finalCard = document.getElementById('end-cta-card');
  if (finalCard) {
    finalCard.style.setProperty('--hero-glow', '#c6f432');
    createShaderBg(finalCard, {
      color:     '#c6f432',
      forceDark: true,
      strength:  1.4,
      size:      1.4,
      mood:      'bloom',
      textReact: true,
    });
  }
})();

})();
