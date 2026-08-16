/* ============================================================================
   Constellation field.

   Drifting stars that link to each other, and to the pointer, when the
   pointer comes near. One shared copy; it used to be pasted into each page
   with a different hardcoded rgba() literal.

   The line colour now comes from the page's --accent-rgb custom property, so
   every page keeps its own hue without forking the engine.

   Opt-outs, both set in markup:
     data-manual-lit  the page fades the canvas in on its own schedule
                      (index.html does this at the end of its intro sequence)
   ========================================================================= */
(function () {
  var cv = document.getElementById('stars');
  if (!cv) return;

  var ctx = cv.getContext('2d');
  var W, H, dpr, nodes = [];
  var mouse = { x: -9999, y: -9999, on: false };

  var accent = (
    getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb') || ''
  ).trim() || '176, 168, 230';

  var LINK_DIST = 82;   // star-to-star linking radius
  var REACH     = 150;  // how close the pointer must be to wake a star

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.max(60, Math.min(160, Math.round(W * H / 12000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .38,
        vy: (Math.random() - .5) * .38,
        g: 0.5 + Math.random() * 1.3
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    var i, j;

    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 4 || n.x > W - 4) n.vx *= -1;
      if (n.y < 4 || n.y > H - 4) n.vy *= -1;
    }

    for (i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      var da = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      var near = mouse.on && da < REACH;

      if (near) {
        for (j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx.strokeStyle = 'rgba(' + accent + ',' +
              (0.5 * (1 - d / LINK_DIST) * (1 - da / REACH)).toFixed(2) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.strokeStyle = 'rgba(' + accent + ',' + (0.4 * (1 - da / REACH)).toFixed(2) + ')';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }

      var base = 0.17 * a.g;
      var br = near ? Math.min(1, base + 0.8 * (1 - da / REACH)) : base;
      var rad = 1.5 + a.g * 0.42 + (near ? 0.5 * (1 - da / REACH) : 0);
      ctx.fillStyle = 'rgba(255,255,255,' + br.toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(a.x, a.y, rad, 0, 6.28); ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true;
  }, { passive: true });
  window.addEventListener('blur', function () { mouse.on = false; });
  window.addEventListener('resize', size);

  size();
  requestAnimationFrame(frame);

  if (!cv.hasAttribute('data-manual-lit')) {
    requestAnimationFrame(function () { cv.classList.add('lit'); });
  }
})();
