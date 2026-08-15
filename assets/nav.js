/* ============================================================================
   Slides the top nav and wordmark in once the page has loaded.

   index.html opts out with data-manual-nav on <body>; it reveals the nav
   partway through its own intro sequence instead, after the name resolves.
   ========================================================================= */
(function () {
  if (document.body.hasAttribute('data-manual-nav')) return;

  function reveal() {
    requestAnimationFrame(function () {
      var nav = document.querySelector('.site-nav');
      if (nav) nav.classList.add('show');
      var mark = document.querySelector('.site-mark');
      if (mark) mark.classList.add('show');
    });
  }

  if (document.readyState === 'complete') reveal();
  else window.addEventListener('load', reveal);
})();
