/* University of Aberdeen GameJam 2027
   Drives the hero countdowns and the Done / Next up labels on the timeline.
   All dates live in index.html, on the data-* attributes of each timeline
   milestone, so that is the only place they need to be edited.

   Also points the Sign up buttons marked data-signup straight at the sign-up
   form, once its URL has been added to the .signup-link button in index.html.

   To preview the page at another moment, add ?now=<ISO date> to the URL,
   e.g. index.html?now=2027-01-27T09:00:00Z */

(() => {
  'use strict';

  const form = document.querySelector('.signup-link');
  const formUrl = form ? form.getAttribute('href') : '';
  if (formUrl) {
    document.querySelectorAll('[data-signup]').forEach((a) => a.setAttribute('href', formUrl));
  }

  const preview = Date.parse(new URLSearchParams(location.search).get('now') || '');
  const offset = Number.isNaN(preview) ? 0 : preview - Date.now();
  const now = () => Date.now() + offset;

  const milestones = Array.from(document.querySelectorAll('[data-milestone]'))
    .map((el) => {
      const at = Date.parse(el.dataset.at);
      const until = Date.parse(el.dataset.until || el.dataset.at);
      return {
        el,
        at,
        until: Number.isNaN(until) ? at : until,
        key: el.dataset.key || '',
        label: el.dataset.label || '',
        live: el.dataset.live || '',
        status: el.querySelector('[data-status]'),
      };
    })
    .filter((m) => !Number.isNaN(m.at));

  // data-countdown="next" follows the next milestone; any other value is the
  // data-key of the one milestone that countdown is for.
  const countdowns = Array.from(document.querySelectorAll('[data-countdown]')).map((el) => ({
    el,
    target: el.dataset.countdown,
    label: el.querySelector('.countdown__label'),
    clock: el.querySelector('.countdown__clock'),
    live: el.querySelector('.countdown__live'),
    d: el.querySelector('[data-unit="d"]'),
    h: el.querySelector('[data-unit="h"]'),
    m: el.querySelector('[data-unit="m"]'),
    s: el.querySelector('[data-unit="s"]'),
  }));

  if (milestones.length === 0) return;

  const set = (node, text) => {
    if (node && node.textContent !== text) node.textContent = text;
  };
  const pad = (n) => String(n).padStart(2, '0');

  function draw(cd, milestone, t) {
    const isLive = Boolean(milestone) && t >= milestone.at;
    cd.clock.hidden = !milestone || isLive;
    cd.live.hidden = !isLive;
    cd.label.hidden = isLive;

    if (!milestone) {
      set(cd.label, 'The University of Aberdeen GameJam 2027 has finished. Thank you to everyone who took part.');
      return;
    }
    if (isLive) {
      set(cd.live, milestone.live);
      return;
    }

    set(cd.label, 'Time until ' + milestone.label);
    const secs = Math.max(0, Math.floor((milestone.at - t) / 1000));
    set(cd.d, pad(Math.floor(secs / 86400)));
    set(cd.h, pad(Math.floor((secs % 86400) / 3600)));
    set(cd.m, pad(Math.floor((secs % 3600) / 60)));
    set(cd.s, pad(secs % 60));
  }

  function render() {
    const t = now();
    const next = milestones.find((m) => t <= m.until) || null;
    const isLive = Boolean(next) && t >= next.at;

    milestones.forEach((m) => {
      const past = t > m.until;
      m.el.classList.toggle('is-past', past);
      m.el.classList.toggle('is-next', m === next);
      set(m.status, past ? 'Done' : m === next ? (isLive ? 'Now' : 'Next up') : '');
    });

    countdowns.forEach((cd) => {
      if (cd.target === 'next') {
        cd.el.hidden = false;
        draw(cd, next, t);
        return;
      }
      // A fixed countdown hides once its milestone has passed, or once the
      // "next" countdown is already showing the same milestone.
      const m = milestones.find((x) => x.key === cd.target);
      const show = Boolean(m) && m !== next && t <= m.until;
      cd.el.hidden = !show;
      if (show) draw(cd, m, t);
    });
  }

  render();
  setInterval(render, 1000);
})();
