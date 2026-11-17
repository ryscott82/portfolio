import { html, render, Component } from './vendor/preact-htm.js';
import { SECTIONS, CONTACT, PROGRAM, POSTCARD, POCKET } from './content.js';

// ---------------------------------------------------------------------------
// Scene geometry (all in the 1600 x 900 "table" frame)
//   binder open:  x 280..1320, y 96..776   (left page 306..800, right page 800..1294, pages y 114..758)
//   lamp:         (430, 70), 700-900 units above the table
// ---------------------------------------------------------------------------
const LIGHT_STOPS = 'rgba(255,230,180,.30), rgba(60,30,8,.05) 36%, rgba(14,6,0,.26) 70%, rgba(6,2,0,.40) 100%';
const LAMP_H = 700; // lamp height above the table, same as for the binder's shadow
const LIT_PAD = 700; // lighting layers reach this far past the screen so nothing shows an edge
const ARROW_R = html`<svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="17" cy="17" r="14"></circle><path d="M10 17h14M18 11l6 6-6 6"></path></svg>`;
const ARROW_L = html`<svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="17" cy="17" r="14"></circle><path d="M24 17H10M16 11l-6 6 6 6"></path></svg>`;
const META = {
  a: { w: 190, h: 190, rot: -7, z: 14 }, b: { w: 170, h: 170, rot: 6, z: 14 }, st: { w: 128, h: 128, rot: -11, z: 4 },
  c1: { w: 252, h: 144, rot: -4, z: 9 }, c2: { w: 252, h: 144, rot: 5, z: 7 }, c3: { w: 252, h: 144, rot: -2, z: 5 },
  fr: { w: 378, h: 213, rot: 20, z: 97, thick: true } // Focusrite interface: a real box, 1.8 in (~97 units) tall, front facing the binder
};
const BASE_ORDER = ['a', 'b', 'st', 'c3', 'c2', 'c1'];
const FOCUSRITE = 'assets/photos/focusrite.webp';
const LOGOS = { babson: [600, 75], wholefoods: [240, 240], ftc: [305, 240], frc: [350, 240], rmhc: [158, 240] };
const LOGO_NAMES = { babson: 'Babson College', wholefoods: 'Whole Foods Market', ftc: 'FIRST Tech Challenge', frc: 'FIRST Robotics Competition', rmhc: 'Ronald McDonald House' };
function Logo({ name, h }) {
  const d = LOGOS[name]; if (!d) return null;
  return html`<${Pic} src=${'assets/logos/' + name + '.png'} alt=${LOGO_NAMES[name] + ' logo'} fit="contain" cls="logo" style=${`width:${Math.round(d[0] * h / d[1])}px;height:${h}px;background-color:transparent;flex:none`} />`;
}

// Photos are painted as backgrounds rather than image elements, so they can't be dragged off the page,
// copied or saved from the right-click menu. They still carry a text label for screen readers.
const noMenu = (e) => e.preventDefault();
function Pic({ src, alt, fit, cls, style }) {
  return html`<div role="img" aria-label=${alt || null} class=${'pic' + (cls ? ' ' + cls : '')} onContextMenu=${noMenu} onDragStart=${noMenu}
    style=${`background-image:url(${src});background-size:${fit || 'cover'};${style || ''}`}></div>`;
}

// ---------------------------------------------------------------------------
// Table items (photos, sticker, business cards). `live` = real links; otherwise plain text (inside the binder).
// ---------------------------------------------------------------------------
function Thing({ which, down, live }) {
  const pm = META[which] && META[which].photo ? META[which] : null;
  const size = pm ? [pm.w, pm.h] : ({ a: [190, 190], b: [170, 170], st: [128, 128] }[which] || [252, 144]);
  const back = { st: '#e9e9e5', c2: '#14171a', c3: '#1f4f9e' }[which] || '#f6f6f3';
  const round = which === 'st' ? '50%' : which.charAt(0) === 'c' ? '3px' : '0';
  if (which === 'fr') return html`<${Pic} src=${FOCUSRITE} alt="Focusrite Scarlett audio interface" fit="100% 100%" style="width:378px;height:213px;background-color:transparent" />`;
  const box = `position:relative;width:${size[0]}px;height:${size[1]}px;font-family:Georgia,'Times New Roman',serif`;
  const L = (href, text, style) => live ? html`<a href=${href} target="_blank" rel="noopener" style=${style || ''}>${text}</a>` : html`<span style=${style || ''}>${text}</span>`;
  if (pm && !down) return html`<div style=${box}><div style="position:absolute;inset:0;box-sizing:border-box;padding:8px;background:#fdfdfb">
      <${Pic} src=${pm.src} alt=${pm.alt} fit=${pm.fit} style=${'width:100%;height:100%' + (pm.fit === 'contain' ? ';background-color:#fff' : '')} />
    </div></div>`;
  if (down) return html`<div style=${box}><div style=${`position:absolute;inset:0;border-radius:${round};background:${back}`}></div></div>`;
  if (which === 'a' || which === 'b') {
    return html`<div style=${box}><div style="position:absolute;inset:0;box-sizing:border-box;padding:10px;background:#fdfdfb">
      <${Pic} src=${'assets/photos/' + (which === 'a' ? 'tableA' : 'tableB') + '.jpg'} alt=${which === 'a' ? 'Mountains in the clouds' : 'Sunset over the ocean'} style="width:100%;height:100%" />
    </div></div>`;
  }
  if (which === 'st') {
    return html`<div style=${box}><div style="position:absolute;inset:0;box-sizing:border-box;border-radius:50%;background:#f4f4f2;border:5px solid #ffffff;display:flex;align-items:center;justify-content:center;font-size:13.5px;color:#333">[STICKER]</div></div>`;
  }
  if (which === 'c1') {
    return html`<div style=${box}><div style="position:absolute;inset:0;box-sizing:border-box;padding:18px 20px;border-radius:3px;background:#fdfdfb;color:#17181a;display:flex;flex-direction:column">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div><p style="margin:0;font-size:17px;font-weight:700">Ryan Edward Scott</p><p style="margin:4px 0 0;font-size:10.5px;color:#44474b">Babson College · Strategy and Consulting</p></div>
        <div aria-hidden="true" style="width:30px;height:30px;background:#0079ad;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center">RS</div>
      </div>
      <div style="margin-top:auto;display:flex;flex-direction:column;gap:3px;font-size:10.5px;color:#006a96">
        ${L('https://ryanedwardscott.com', 'ryanedwardscott.com')}
        ${L(CONTACT.linkedin, 'linkedin.com/in/ryscott82')}
        <span style="color:#44474b">${CONTACT.email || '[EMAIL]'} · [PHONE]</span>
      </div></div></div>`;
  }
  if (which === 'c2') {
    return html`<div style=${box}><div style="position:absolute;inset:0;box-sizing:border-box;padding:20px;border-radius:3px;background:#14171a;color:#f2f2ee;display:flex;flex-direction:column;align-items:center">
      <p style="margin:8px 0 0;font-size:27px;font-weight:700;letter-spacing:.32em;padding-left:.32em">REMG</p>
      <div aria-hidden="true" style="width:40px;height:2px;background:#009ddc;margin:8px 0"></div>
      <p style="margin:0;font-size:8.5px;letter-spacing:.26em">RYAN EDWARD MEDIA GROUP</p>
      <div style="margin-top:auto;width:100%;display:flex;justify-content:space-between;font-size:10px"><span>Pittsburgh, PA</span>${L(CONTACT.remg, 'ryanedwardmediagroup.com', 'color:#fff')}</div>
    </div></div>`;
  }
  return html`<div style=${box}><div style="position:absolute;inset:0;box-sizing:border-box;padding:18px 20px;border-radius:3px;background:#1f4f9e;color:#fff;display:flex;flex-direction:column;overflow:hidden">
    <div aria-hidden="true" style="position:absolute;right:-10px;top:22px;width:130px;height:33px;background:repeating-linear-gradient(180deg,rgba(255,255,255,.4) 0 1px,rgba(255,255,255,0) 1px 8px)"></div>
    <p style="margin:0;font-size:20px;font-style:italic">Ryan Scott</p>
    <p style="margin:4px 0 0;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase">[VOICE / INSTRUMENT]</p>
    <div style="margin-top:auto;display:flex;justify-content:space-between;font-size:10.5px">${L(CONTACT.instagram, 'Instagram @ryscott82', 'color:#fff')}${L(CONTACT.youtube, 'YouTube', 'color:#fff')}</div>
  </div></div>`;
}

// ---------------------------------------------------------------------------
class Binder extends Component {
  constructor(props) {
    super(props);
    this.N = 20;
    this.build();
    this.state = { open: false, slow: false, sp: 0, flip: null, s: 1, vw: window.innerWidth, vh: window.innerHeight,
      pop: null, muted: false, held: null, plain: false, mp: 0, mdir: 1, items: this.home() };
    this.fit = this.fit.bind(this);
    this.onKey = this.onKey.bind(this);
    this.onHash = this.onHash.bind(this);
    this.wheelLock = 0;
    this.setRoot = (el) => { this.root = el; };
    this.hand = {};
    Object.keys(META).forEach((id) => { this.hand[id] = this.itemDown(id); });
    this.gF = this.grab('F');
    this.gB = this.grab('B');
  }

  // ---------- content ----------
  build() {
    const pages = [], starts = [], slugs = {};
    SECTIONS.forEach((sec, si) => {
      starts.push(pages.length / 2);
      sec.pages.forEach((p, k) => {
        const page = Object.assign({}, p);
        page.section = si;
        page.pos = sec.label + ' · ' + (k + 1) + ' of ' + sec.pages.length;
        pages.push(page);
      });
    });
    // every photo on a page is a taped-in print: an item that starts on its page and can be peeled off
    this.photoIds = []; this.photoHome = {};
    pages.forEach((p, i) => {
      (p.blocks || []).forEach((b, k) => {
        if (b.type !== 'photo' || !b.src) return;
        const id = 'p' + i + '_' + k;
        META[id] = { w: b.w || 386, h: b.h || 200, rot: b.rot != null ? b.rot : (k % 2 ? 1.1 : -0.9) * (i % 2 ? 1 : -1), z: 2,
          photo: true, src: b.src, alt: b.alt || '', fit: b.contain ? 'contain' : 'cover', tap: b.tap || null };
        b.slot = id;
        this.photoIds.push(id);
        this.photoHome[id] = { at: i, lx: i % 2 ? 58 : 50, ly: 150 };
      });
    });
    this.order = ['fr'].concat(this.photoIds, BASE_ORDER);
    pages.forEach((p, i) => {
      p.num = i + 1;
      p.hasPrev = i % 2 === 0 && i > 0;
      p.hasNext = i % 2 === 1 && i < pages.length - 1;
      if (p.slug) slugs[p.slug] = i;
      if (!p.title) { // continuation pages borrow the title of the page before for hints
        for (let j = i - 1; j >= 0; j--) if (pages[j].title) { p.hintTitle = pages[j].title; break; }
      }
    });
    this.pages = pages;
    this.starts = starts;
    this.spreads = pages.length / 2;
    this.slugs = slugs;
  }
  pageName(i) { const p = this.pages[i]; return p.cover ? 'the first page' : (p.title || p.hintTitle || SECTIONS[p.section].label); }
  spreadSlug(sp) { const L = this.pages[2 * sp], R = this.pages[2 * sp + 1]; return (L && L.slug) || (R && R.slug) || ''; }
  sectionOf(sp) { let k = 0; for (let i = 0; i < this.starts.length; i++) if (sp >= this.starts[i]) k = i; return k; }
  goSlug(slug) { const i = this.slugs[slug]; if (i == null) return; this.isMobile() ? this.goMobile(i) : this.goSpread(Math.floor(i / 2)); }

  // ---------- lifecycle ----------
  componentDidMount() {
    window.addEventListener('resize', this.fit);
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('hashchange', this.onHash);
    const i = this.slugs[(location.hash || '').slice(1)];
    const sp = i == null ? 0 : Math.floor(i / 2);
    this.setState({ sp, mp: i == null ? 0 : i });
    requestAnimationFrame(() => this.measure());
    // the binder opens as you arrive
    this.t0 = setTimeout(() => { if (!this.touched) { this.thud(); this.setState({ open: true, slow: true }); } }, 350);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.fit);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('hashchange', this.onHash);
    clearTimeout(this.t0); clearTimeout(this.t1);
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.unbind) this.unbind();
  }
  componentDidUpdate() {
    // keep the address bar on the current spread, so any page can be linked to
    const st = this.state;
    const slug = this.isMobile() ? (this.pages[st.mp].slug || '') : (st.open && !st.flip ? this.spreadSlug(st.sp) : '');
    const want = slug ? '#' + slug : '';
    if (want && location.hash !== want) { try { history.replaceState(null, '', want); } catch (e) { /* ignore */ } }
    if (this.isMobile()) { const t = document.querySelector('.m-tab.on'); if (t && t.scrollIntoView) t.scrollIntoView({ block: 'nearest', inline: 'center' }); }
  }
  freeze(items) {
    // turn the automatic first placement into fixed spots, so resizing the window doesn't move anything
    const out = Object.assign({}, items);
    Object.keys(out).forEach((id) => { const p = out[id]; if (p.auto || p.anchored) { const q = this.pos(id); out[id] = { x: q.x, y: q.y, at: null }; } });
    return out;
  }
  measure() {
    const box = document.querySelector('.measure'); if (!box) return;
    box.querySelectorAll('.mpage').forEach((pg) => {
      const pr = pg.getBoundingClientRect(), i = +pg.dataset.page;
      pg.querySelectorAll('[data-slot]').forEach((sl) => {
        const r = sl.getBoundingClientRect(), id = sl.dataset.slot;
        this.photoHome[id] = { at: i, lx: Math.round(r.left - pr.left), ly: Math.round(r.top - pr.top) };
      });
    });
    const items = Object.assign({}, this.state.items);
    this.photoIds.forEach((id) => { if (items[id].at === this.photoHome[id].at && !items[id].moved) items[id] = Object.assign({}, this.photoHome[id]); });
    this.measured = true;
    this.setState({ items: this.freeze(items) });
  }
  onHash() { const slug = (location.hash || '').slice(1); if (slug && slug !== this.spreadSlug(this.state.sp)) this.goSlug(slug); }
  onKey(e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA') return;
    if (e.key === 'Escape') { if (this.state.pop) this.setState({ pop: null }); else if (this.state.plain) this.setState({ plain: false }); return; }
    if (this.state.plain || this.state.pop) return;
    const fwd = e.key === 'ArrowRight' || e.key === 'PageDown', back = e.key === 'ArrowLeft' || e.key === 'PageUp';
    if (!fwd && !back) return;
    e.preventDefault();
    if (this.isMobile()) { this.goMobile(this.state.mp + (fwd ? 1 : -1)); return; }
    if (!this.state.open) { if (fwd) this.openBook(); return; }
    this.goSpread(this.state.sp + (fwd ? 1 : -1));
  }
  fit() { this.setState({ vw: window.innerWidth, vh: window.innerHeight }); }
  isMobile() { return this.state.vw < 760; }
  scale() { const w = this.state.vw, h = this.state.vh; return Math.min(w / 1330, (h - 60) / 742, 1.6); }

  // ---------- items ----------
  home() {
    // loose things start 'auto': placed into whatever open table there is around the binder (see layout())
    return { a: { auto: true, at: null }, b: { auto: true, at: null }, st: { auto: true, at: null },
      c1: { auto: true, at: null }, c2: { auto: true, at: null }, c3: { auto: true, at: null },
      fr: { x: 0, y: 0, at: null, anchored: true }, // pinned to the window's top-right corner until someone moves it
      ...Object.fromEntries(Object.entries(this.photoHome || {}).map(([k, v]) => [k, Object.assign({}, v)])) };
  }
  onPages(id, p) { const m = META[id], cx = p.x + m.w / 2, cy = p.y + m.h / 2; return cx > 306 && cx < 1294 && cy > 114 && cy < 758; }
  framePos(id) { const p = this.state.items[id]; return { x: (p.at % 2 === 0 ? 306 : 800) + p.lx, y: 114 + p.ly, at: null }; }
  overBinder(x, y, w, h) {
    const st = this.state, ox = st.open ? 280 : 20, oy = 96;
    const hit = (x0, y0, x1, y1) => x < ox + x1 && x + w > ox + x0 && y < oy + y1 && y + h > oy + y0;
    if (hit(st.open ? 0 : 520, 0, 1040, 680)) return true;
    for (let i = 0; i < SECTIONS.length; i++) {
      const ty = 30 + i * 104, left = st.open && this.starts[i] <= st.sp;
      if (left ? hit(-56, ty, 42, ty + 98) : hit(998, ty, 1096, ty + 98)) return true;
    }
    return false;
  }
  itemDown(id) {
    return (e) => {
      if (e.button) return;
      if (e.stopPropagation) e.stopPropagation();
      const lifted = Object.assign({}, this.state.items);
      if (lifted[id].at != null) lifted[id] = this.framePos(id);
      else if (lifted[id].anchored || lifted[id].auto) lifted[id] = { x: this.pos(id).x, y: this.pos(id).y, at: null };
      const m = META[id], p0 = lifted[id], x0 = e.clientX, y0 = e.clientY, sc = this.scale() || 1;
      let queued = 0, nx = p0.x, ny = p0.y, moved = false;
      this.setState({ held: id, items: lifted });
      const move = (ev) => {
        const dx = (ev.clientX - x0) / sc, dy = (ev.clientY - y0) / sc;
        if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
        const v = this.view(); // anywhere on the page, even past the table frame on tall or wide windows; up to half off an edge
        nx = Math.max(v.x0 - m.w / 2, Math.min(v.x1 - m.w / 2, p0.x + dx)); ny = Math.max(v.y0 + v.nav - m.h / 2, Math.min(v.y1 - m.h / 2, p0.y + dy));
        if (!queued) queued = requestAnimationFrame(() => {
          queued = 0;
          const items = Object.assign({}, this.state.items); items[id] = { x: nx, y: ny, at: null };
          this.setState({ items });
        });
      };
      const up = () => {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
        this.justDragged = moved;
        setTimeout(() => { this.justDragged = false; }, 80);
        let np = { x: nx, y: ny, at: null };
        if (!m.thick && this.state.open && !this.state.flip && this.onPages(id, np)) {
          // dropped on an open page: it becomes part of that page. Anything poking out over a tab label is slid inward.
          const onLeft = nx + m.w / 2 < 800, ra = m.rot * Math.PI / 180;
          const bw = m.w * Math.abs(Math.cos(ra)) + m.h * Math.abs(Math.sin(ra)), bh = m.w * Math.abs(Math.sin(ra)) + m.h * Math.abs(Math.cos(ra));
          const bx0 = nx + m.w / 2 - bw / 2, by0 = ny + m.h / 2 - bh / 2;
          if (by0 < 744 && by0 + bh > 126) {
            if (!onLeft && bx0 + bw > 1324) nx -= bx0 + bw - 1324;
            if (onLeft && bx0 < 276) nx += 276 - bx0;
          }
          np = { at: 2 * this.state.sp + (onLeft ? 0 : 1), lx: nx - (onLeft ? 306 : 800), ly: ny - 114 };
        }
        if (m.thick) { const c = this.clearSpot(id, np.x, np.y, true); np.x = c.x; np.y = c.y; } // never on the binder
        np.moved = true;
        // put down = on top of whatever it landed on (the binder, other things) — except where a rule says otherwise:
        // dropped onto open pages it's filed into the page (above), and nothing goes over the Focusrite
        this.zTop = (this.zTop || 0) + 1;
        np.zi = this.zTop;
        if (np.at == null) np.onTop = this.overBinder(np.x, np.y, m.w, m.h);
        const items = Object.assign({}, this.state.items); items[id] = np;
        this.setState({ held: null, items });
        if (!moved && m.tap) this.setState({ pop: m.tap }); // a tap (no drag) on the postcard turns it over
      };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    };
  }
  view() {
    // the visible window, in table coordinates
    const sc = this.scale(), vw = this.state.vw, vh = Math.max(520, this.state.vh);
    const fl = vw / 2 - 800 * sc, ft = vh / 2 + 28 - 450 * sc;
    return { x0: -fl / sc, y0: -ft / sc, x1: (vw - fl) / sc, y1: (vh - ft) / sc, nav: 56 / sc };
  }
  vpx() { const sc = this.scale(); return (this.state.vw / 2 - 800 * sc) / sc; }
  vpy() { const sc = this.scale(); return (Math.max(520, this.state.vh) / 2 + 28 - 450 * sc) / sc; }
  litCss(x, y) {
    // the lamp's falloff mapped onto something lying at table position x,y; reaches well past the screen edges
    const v = this.view(), W = v.x1 - v.x0, H = v.y1 - v.y0, M = LIT_PAD;
    return `left:${(v.x0 - x - M).toFixed(1)}px;top:${(v.y0 - y - M).toFixed(1)}px;width:${(W + 2 * M).toFixed(1)}px;height:${(H + 2 * M).toFixed(1)}px;` +
      `background:radial-gradient(${(0.95 * W).toFixed(1)}px ${(0.85 * H).toFixed(1)}px at ${(0.24 * W + M).toFixed(1)}px ${(0.10 * H + M).toFixed(1)}px, ${LIGHT_STOPS})`;
  }
  frPos() {
    // the Focusrite lives in the top-right corner of the window, partly tucked under the menu bar
    const v = this.view(), m = META.fr, a = m.rot * Math.PI / 180;
    const bw = m.w * Math.abs(Math.cos(a)) + m.h * Math.abs(Math.sin(a)), bh = m.w * Math.abs(Math.sin(a)) + m.h * Math.abs(Math.cos(a));
    const cx = v.x1 - 0.26 * bw, cy = v.y0 + v.nav + 0.16 * bh;
    return this.clearSpot('fr', cx - m.w / 2, cy - m.h / 2, true);
  }
  pos(id) {
    const p = this.state.items[id];
    if (id === 'fr' && p.anchored) return Object.assign({}, p, this.frPos());
    if (p.auto) return Object.assign({}, p, this.layout()[id]);
    return p;
  }
  binderBoxes() { return [[280, 96, 1320, 776], [1278, 126, 1376, 744], [224, 126, 322, 744]]; }
  hitsBinder(id, x, y) {
    // exact test of the item's rotated outline against the open binder and its tabs (separating axes)
    const m = META[id], a = m.rot * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), cx = x + m.w / 2, cy = y + m.h / 2;
    const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [cx + u * m.w / 2 * c - v * m.h / 2 * s, cy + u * m.w / 2 * s + v * m.h / 2 * c]);
    return this.binderBoxes().some((b) => {
      const bp = [[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]];
      const axes = [[1, 0], [0, 1], [c, s], [-s, c]];
      return axes.every(([ax, ay]) => {
        const pr = (q) => q.map((p) => p[0] * ax + p[1] * ay);
        const A = pr(pts), B = pr(bp);
        return Math.max(...A) > Math.min(...B) + 2 && Math.max(...B) > Math.min(...A) + 2;
      });
    });
  }
  clearSpot(id, x, y, keepVisible) {
    // nearest position to x,y where the item doesn't touch the binder (and, if asked, stays mostly on screen)
    const v = this.view(), m = META[id];
    const ok = (px, py) => {
      if (this.hitsBinder(id, px, py)) return false;
      if (!keepVisible) return true;
      const cx = px + m.w / 2, cy = py + m.h / 2;
      // some of it must stay in the window (the binder rule wins over showing all of it)
      return cx > v.x0 - m.w * 0.2 && cx < v.x1 + m.w * 0.1 && cy > v.y0 - m.h * 0.15 && cy < v.y1 + m.h * 0.2;
    };
    if (ok(x, y)) return { x, y };
    for (let r = 8; r < 900; r += 8) {
      let best = null, bd = 1e18;
      for (let t = 0; t < 64; t++) {
        const ang = t / 64 * Math.PI * 2, px = x + Math.cos(ang) * r, py = y + Math.sin(ang) * r;
        if (ok(px, py)) { const d = Math.hypot(px - x, py - y); if (d < bd) { bd = d; best = { x: px, y: py }; } }
      }
      if (best) return best;
    }
    return { x, y };
  }
  aabb(id, x, y) {
    const m = META[id], a = m.rot * Math.PI / 180;
    const bw = m.w * Math.abs(Math.cos(a)) + m.h * Math.abs(Math.sin(a)), bh = m.w * Math.abs(Math.sin(a)) + m.h * Math.abs(Math.cos(a));
    const cx = x + m.w / 2, cy = y + m.h / 2;
    return [cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2];
  }
  layout() {
    // Uses the whole window: every loose item goes to the free spot (clear of the open binder, its tabs and shadow,
    // the Focusrite, the menu bar, the bottom buttons and each other) nearest its preferred place.
    // If the window has no free spot big enough, it falls back to its preferred place, partly under the binder.
    const v = this.view(), key = [this.state.vw, this.state.vh].join('x');
    if (this._lay && this._lay.key === key) return this._lay.pos;
    const prefer = { c1: [150, 470], c2: [160, 600], c3: [142, 724], a: [150, 132], b: [1318, 404], st: [1310, 640] };
    const order = ['c1', 'c2', 'c3', 'a', 'b', 'st'];
    const pad = 12, botBar = 50 / this.scale();
    const fr = this.frPos(), obstacles = [[214, 84, 1386, 812], this.aabb('fr', fr.x, fr.y)];
    const lim = [v.x0 + 10, v.y0 + v.nav + 10, v.x1 - 10, v.y1 - botBar - 6];
    const hit = (b, o) => b[0] < o[2] + pad && b[2] > o[0] - pad && b[1] < o[3] + pad && b[3] > o[1] - pad;
    const out = {};
    order.forEach((id) => {
      const m = META[id], [px, py] = prefer[id];
      let best = null, bd = 1e18;
      for (let y = lim[1]; y < lim[3]; y += 14) {
        for (let x = lim[0]; x < lim[2]; x += 14) {
          const ix = x - (this.aabb(id, 0, 0)[0]), iy = y - (this.aabb(id, 0, 0)[1]); // item origin so its box starts at x,y
          const b = this.aabb(id, ix, iy);
          if (b[2] > lim[2] || b[3] > lim[3]) continue;
          if (obstacles.some((o) => hit(b, o))) continue;
          const d = (ix - px) * (ix - px) + (iy - py) * (iy - py);
          if (d < bd) { bd = d; best = [ix, iy]; }
        }
      }
      const p = best || [px, py];
      out[id] = { x: p[0], y: p[1] };
      obstacles.push(this.aabb(id, p[0], p[1]));
    });
    this._lay = { key, pos: out };
    return out;
  }
  itemCss(id) {
    const m = META[id], p = this.pos(id), held = this.state.held === id;
    if (p.at != null && !held) return 'display:none;';
    // under the binder only if the binder came down over it (e.g. the cover opened onto it); if it was put on the binder, it stays on top
    const behind = !held && !p.onTop && this.overBinder(p.x, p.y, m.w, m.h);
    const rank = this.order.filter((k) => { const q = this.state.items[k]; return q.at == null && (q.zi || 0) < (p.zi || 0); }).length;
    const h = held ? 60 : m.z, k = h / (900 - h);
    const dx = (p.x + m.w / 2 - 430) * k, dy = (p.y + m.h / 2 - 70) * k;
    if (m.thick) {
      // a tall object: always on top of the table, the binder and everything lying on them
      return `left:${p.x.toFixed(1)}px;top:${p.y.toFixed(1)}px;width:${m.w}px;height:${m.h}px;transform:rotate(${m.rot}deg)${held ? ' scale(1.03)' : ''};overflow:visible;` +
        `z-index:${held ? 72 : 60};filter:drop-shadow(0 1px 2px rgba(0,0,0,.55));`;
    }
    return `left:${p.x.toFixed(1)}px;top:${p.y.toFixed(1)}px;width:${m.w}px;height:${m.h}px;transform:rotate(${m.rot}deg)${held ? ' scale(1.04)' : ''};` +
      (id === 'st' ? 'border-radius:50%;' : '') + (id.charAt(0) === 'c' ? 'border-radius:3px;' : '') +
      `z-index:${held ? 70 : behind ? -1 : 10 + rank};` +
      `box-shadow:${held ? `${dx.toFixed(1)}px ${dy.toFixed(1)}px ${(3 + h * 0.4).toFixed(1)}px rgba(0,0,0,.42)` : '0 0 1px rgba(0,0,0,.35)'};`;
  }
  thickShadow(id) {
    const m = META[id], p = this.pos(id), held = this.state.held === id;
    const hh = m.z + (held ? 40 : 0), k = hh / (LAMP_H - hh);
    const sx = (p.x + m.w / 2 - 430) * k, sy = (p.y + m.h / 2 - 70) * k, ra = -m.rot * Math.PI / 180;
    const lx = sx * Math.cos(ra) - sy * Math.sin(ra), ly = sx * Math.sin(ra) + sy * Math.cos(ra);
    const steps = [];
    for (let t = 0; t <= 8; t++) steps.push(`transform:translate(${(lx * t / 8).toFixed(1)}px,${(ly * t / 8).toFixed(1)}px)`);
    return { box: `left:${p.x.toFixed(1)}px;top:${p.y.toFixed(1)}px;width:${m.w}px;height:${m.h}px;transform:rotate(${m.rot}deg);z-index:${held ? 71 : 59};filter:blur(${(2 + hh * 0.05).toFixed(1)}px);opacity:.42`, steps };
  }
  tapeFor(id, lx, ly) {
    // clear tape across corners that sit inside the page: both top corners for a photo, the deepest one otherwise
    const m = META[id], w = m.w, h = m.h, a = m.rot * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
    const ins = id === 'st' ? m.w * 0.5 * (1 - Math.SQRT1_2) : 0;
    const cs = [[ins, ins, -45], [w - ins, ins, 45], [w - ins, h - ins, -45], [ins, h - ins, 45]];
    const depth = cs.map((k) => {
      const dx = k[0] - w / 2, dy = k[1] - h / 2;
      const px = lx + w / 2 + dx * c - dy * sn, py = ly + h / 2 + dx * sn + dy * c;
      return Math.min(px, 494 - px, py, 644 - py);
    });
    const css = (k) => `left:${(k[0] - 35).toFixed(1)}px;top:${(k[1] - 11).toFixed(1)}px;transform:rotate(${k[2]}deg)`;
    if (m.photo && depth[0] > 6 && depth[1] > 6) return [css(cs[0]), css(cs[1])];
    let best = -1, bd = 6;
    depth.forEach((d, k) => { if (d > bd) { bd = d; best = k; } });
    return best < 0 ? [] : [css(cs[best])];
  }
  decals(page, mode) {
    // mode: 'page' (on a visible page) | 'strip' (riding the turning sheet) | 'mirror' (seen through from the other side)
    //       'R'/'L' (deeper in a stack, binder coords) | 'cover' (inside the front cover)
    const out = [], items = this.state.items, open = this.state.open;
    const go = () => { if (!open) this.openBook(Math.floor(page / 2)); else this.goSpread(Math.floor(page / 2)); };
    Object.keys(items).sort((x, y) => (items[x].zi || 0) - (items[y].zi || 0)).forEach((id) => {
      const p = items[id]; if (p.at !== page) return;
      const m = META[id], left = page % 2 === 0;
      let rot = m.rot, face = false, x, y;
      if (mode === 'page' || mode === 'strip') { x = p.lx; y = p.ly; }
      else if (mode === 'mirror') { x = 494 - p.lx - m.w; y = p.ly; face = true; }
      else if (mode === 'cover') { x = 26 + p.lx; y = 18 + p.ly; }
      else {
        const fx = mode === 'R' ? (left ? 1294 - p.lx - m.w : 800 + p.lx) : (left ? 306 + p.lx : 800 - p.lx - m.w);
        face = mode === 'R' ? left : !left;
        x = fx - 280; y = 18 + p.ly;
      }
      if (face) rot = -rot;
      const tapes = face ? [] : this.tapeFor(id, p.lx, p.ly);
      const css = `left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${m.w}px;height:${m.h}px;transform:rotate(${rot}deg);` +
        (id === 'st' ? 'border-radius:50%;' : id.charAt(0) === 'c' ? 'border-radius:3px;' : '');
      const thin = 'box-shadow:0 0 1px rgba(0,0,0,.35);';
      const d = { which: id, face, tapes, isItem: true, hint: 'Go to ' + this.pageName(page) };
      if (mode === 'cover') { d.css = css + 'pointer-events:auto;cursor:' + (open ? 'grab' : 'pointer') + ';'; d.shadow = thin; d.grab = open ? this.hand[id] : null; d.go = open ? null : go; }
      else if (mode === 'page') { d.css = css + thin + (open ? '' : 'cursor:pointer;'); d.grab = open ? this.hand[id] : null; d.go = open ? null : go; }
      else { d.css = css + thin; d.go = go; }
      out.push(d);
    });
    return out;
  }
  tabFor(i, side) {
    const sec = SECTIONS[i];
    return { isTab: true, i, label: sec.label, pick: () => this.goSpread(this.starts[i]),
      fs: 'font-size:' + Math.min(12.5, 76 / (sec.label.length * 0.6)).toFixed(1) + 'px',
      style: (side === 'R' ? 'left:998px;' : '') + 'top:' + (30 + i * 104) + 'px;' };
  }
  sheetTab(s) { for (let i = 1; i < this.starts.length; i++) if (this.starts[i] === s + 1) return i; return -1; }

  // ---------- sound: very quiet paper and leather ----------
  audio() {
    if (this.state.muted) return null;
    try {
      if (!this.ac) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; this.ac = new A(); }
      if (this.ac.state === 'suspended') this.ac.resume();
      return this.ac;
    } catch (e) { return null; }
  }
  noise(dur, type, f0, f1, peak, delay) {
    const ac = this.audio(); if (!ac || ac.state !== 'running') return;
    try {
      const n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource(); src.buffer = buf;
      const flt = ac.createBiquadFilter(); flt.type = type; flt.Q.value = 0.4;
      const t = ac.currentTime + (delay || 0);
      flt.frequency.setValueAtTime(f0, t); flt.frequency.exponentialRampToValueAtTime(f1, t + dur);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(flt); flt.connect(g); g.connect(ac.destination); src.start(t); src.stop(t + dur);
    } catch (e) { /* no sound */ }
  }
  swoosh(delay) { this.noise(0.5, 'lowpass', 620, 240, 0.02, delay == null ? 0.3 : delay); }
  thud() { this.noise(0.42, 'lowpass', 420, 160, 0.045); }

  // ---------- page turning ----------
  geom(dir, t) {
    // t: 0 = sheet flat where it started, 1 = flat on the other side. The free edge leads a little, the spine follows.
    const N = this.N, w = 494 / N, PI = Math.PI;
    const cl = (v) => v < 0 ? 0 : v > 1 ? 1 : v, ez = (v) => v * v * (3 - 2 * v);
    const te = PI * ez(cl(t * 1.2)), ts = PI * ez(cl((t - 0.17) / 0.83));
    const ang = (u) => { const th = ts + (te - ts) * Math.pow(u, 1.3); return dir === 'B' ? PI - th : th; };
    const out = []; let x = 0, z = 0, zmax = 0, smin = 1e9, smax = -1e9;
    for (let i = 0; i < N; i++) {
      const th = ang((i + 0.5) / N);
      out.push({ x, z, th, a: ang(i / N), b: ang((i + 1) / N) });
      const k = z / (1400 - z), sx = x + (x + 370) * k;
      if (sx < smin) smin = sx; if (sx > smax) smax = sx;
      x += w * Math.cos(th); z += w * Math.sin(th);
      if (z > zmax) zmax = z;
    }
    const k2 = z / (1400 - z), ex = x + (x + 370) * k2;
    if (ex < smin) smin = ex; if (ex > smax) smax = ex;
    return { strips: out, zmax, smin, smax };
  }
  stripCss(g) { return `transform:translate3d(${g.x.toFixed(2)}px,0,${g.z.toFixed(2)}px) rotateY(${(-g.th).toFixed(4)}rad)`; }
  paint(dir, t) {
    const root = this.root; if (!root) return false;
    const els = root.querySelectorAll('.strip'); if (!els.length) return false;
    const fs = root.querySelectorAll('.shF'), bs = root.querySelectorAll('.shB'), cast = root.querySelector('.cast');
    const G = this.geom(dir, t);
    // one continuous shade across the sheet: each strip blends from the tone at its near edge to its far edge
    const tone = (b) => b >= 0.82 ? `rgba(255,255,255,${Math.min(0.2, (b - 0.82) * 1.3).toFixed(3)})` : `rgba(0,0,0,${Math.min(0.36, (0.82 - b) * 0.36).toFixed(3)})`;
    const fr = (th) => 0.45 * Math.sin(th) + 0.82 * Math.cos(th), bk = (th) => -fr(th);
    for (let i = 0; i < els.length; i++) {
      const g = G.strips[i]; if (!g) continue;
      els[i].style.transform = `translate3d(${g.x.toFixed(2)}px,0,${g.z.toFixed(2)}px) rotateY(${(-g.th).toFixed(4)}rad)`;
      if (fs[i]) fs[i].style.background = `linear-gradient(90deg,${tone(fr(g.a))},${tone(fr(g.b))})`;
      if (bs[i]) bs[i].style.background = `linear-gradient(90deg,${tone(bk(g.b))},${tone(bk(g.a))})`;
    }
    if (cast) {
      const lift = Math.min(1, G.zmax / 160);
      cast.style.left = (520 + G.smin - 14).toFixed(1) + 'px';
      cast.style.width = Math.max(10, G.smax - G.smin + 28).toFixed(1) + 'px';
      cast.style.top = (18 + 366 * G.zmax / (1400 - G.zmax) * 0.45).toFixed(1) + 'px';
      cast.style.filter = `blur(${(6 + G.zmax * 0.08).toFixed(1)}px)`;
      cast.style.opacity = (0.7 * lift * (1 - 0.35 * Math.min(1, G.zmax / 480))).toFixed(3);
    }
    return true;
  }
  beginFlip(t, cb) {
    const st = this.state;
    if (!st.open || st.flip || t === st.sp || t < 0 || t >= this.spreads) return null;
    const dir = t > st.sp ? 'F' : 'B';
    this.setState({ flip: { dir, a: st.sp, b: t } }, cb);
    return dir;
  }
  finish(commit) {
    this.raf = 0;
    const f = this.state.flip; if (!f) return;
    this.setState(commit ? { sp: f.b, flip: null } : { flip: null });
  }
  animate(dir, v0, v1, commit) {
    let t0 = 0; const dur = Math.max(180, 950 * Math.abs(v1 - v0));
    const frame = (now) => {
      if (!t0) t0 = now;
      const k = Math.min(1, (now - t0) / dur);
      const ok = this.paint(dir, v0 + (v1 - v0) * k);
      if (k < 1 && ok) this.raf = requestAnimationFrame(frame); else this.finish(commit);
    };
    this.raf = requestAnimationFrame(frame);
  }
  stillMotion() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  goSpread(t) {
    const st = this.state;
    if (this.isMobile()) { this.goMobile(2 * t); return; }
    if (t < 0 || t >= this.spreads) return;
    if (!st.open) { this.openBook(t); return; }
    const dir = this.beginFlip(t, () => {
      if (this.stillMotion()) { this.t1 = setTimeout(() => this.finish(true), 60); return; }
      this.animate(dir, 0, 1, true);
    });
    if (dir) this.swoosh();
  }
  openBook(t) { this.touched = true; clearTimeout(this.t0); this.thud(); this.setState({ open: true, slow: false, sp: t == null ? this.state.sp : t, flip: null }); }
  closeBook() {
    clearTimeout(this.t1); if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0;
    if (this.state.open) this.thud();
    this.touched = true;
    this.setState({ open: false, flip: null, slow: false, sp: 0, pop: null });
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
  }
  grab(want) {
    // pull a page by its outer edge: the curl follows the pointer; past halfway it turns
    return (e) => {
      const st = this.state, root = this.root;
      if (!root || st.flip || !st.open) return;
      if (e.stopPropagation) e.stopPropagation();
      const t = st.sp + (want === 'F' ? 1 : -1);
      const r = root.getBoundingClientRect(), sc = r.width / 1040, spine = r.left + r.width / 2;
      const val = (ev) => { const xr = (ev.clientX - spine) / sc; const v = want === 'F' ? (494 - xr) / 988 : (xr + 494) / 988; return v < 0.01 ? 0.01 : v > 0.99 ? 0.99 : v; };
      let v = val(e), queued = 0;
      const dir = this.beginFlip(t, () => this.paint(want, v));
      if (!dir) return;
      if (e.preventDefault) e.preventDefault();
      const move = (ev) => { v = val(ev); if (!queued) queued = requestAnimationFrame(() => { queued = 0; this.paint(want, v); }); };
      const up = () => {
        this.unbind(); this.unbind = null;
        const commit = v > 0.5;
        if (commit) this.swoosh(0.05);
        this.animate(want, v, commit ? 1 : 0, commit);
      };
      this.unbind = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    };
  }
  swipeStart(e, fn) {
    // touch swipe anywhere on the table or a page turns it
    if (e.pointerType !== 'touch') return;
    const x0 = e.clientX, y0 = e.clientY;
    const up = (ev) => {
      window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      const dx = ev.clientX - x0, dy = ev.clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) fn(dx < 0 ? 1 : -1);
    };
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  }
  goMobile(i) {
    const n = this.pages.length;
    if (i < 0 || i >= n || i === this.state.mp) return;
    this.setState({ mp: i, mdir: i > this.state.mp ? 1 : -1 });
  }

  // ---------- binder shadow, projected from the lamp ----------
  binderClip() {
    const st = this.state, L = [430, 70], H = 700, h = st.open ? 16 : 22;
    const r = st.open ? [280, 96, 1320, 776] : [540, 96, 1060, 776];
    let pts = [[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]]; const k = H / (H - h);
    pts = pts.concat(pts.map((p) => [L[0] + (p[0] - L[0]) * k, L[1] + (p[1] - L[1]) * k]));
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    pts.forEach((p) => { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
    pts.slice().reverse().forEach((p) => { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); });
    const hull = lo.slice(0, -1).concat(up.slice(0, -1));
    while (hull.length < 8) hull.push(hull[hull.length - 1]);
    return 'polygon(' + hull.map((p) => p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px').join(',') + ')';
  }
  ovClip(W, last, back) {
    // keep only what lies outside the page within this strip (and past the outer edge on the last strip)
    const x0 = back && last ? -400 : 0, x1 = !back && last ? W + 400 : W;
    const f = (x, y) => x.toFixed(1) + 'px ' + y + 'px';
    return `left:0;width:${W.toFixed(2)}px;transform:${back ? 'rotateY(180deg) ' : ''}translateZ(-.6px);` +
      'clip-path:polygon(evenodd,' + [f(x0, -400), f(x1, -400), f(x1, 1044), f(x0, 1044), f(x0, -400), f(0, 0), f(0, 644), f(W, 644), f(W, 0), f(0, 0)].join(',') + ')';
  }

  // =========================================================================
  // Rendering
  // =========================================================================
  blocks(list, live, flat) {
    return list.map((b, k) => {
      switch (b.type) {
        case 'entry': return html`<div class="entry" key=${k}>${b.logo ? html`<div style="float:right;margin:2px 0 6px 14px"><${Logo} name=${b.logo} h=${b.logo === 'babson' ? 16 : 40} /></div>` : null}<h2 class="h2">${b.h}</h2>${b.meta ? html`<p class="meta">${b.meta}</p>` : null}${b.body ? html`<p class="body">${b.body}</p>` : null}</div>`;
        case 'text': return html`<p class="body" key=${k}>${b.body}</p>`;
        case 'photo': return b.src
          ? (flat
            ? html`<${Pic} key=${k} cls=${'photo' + (b.contain ? ' contain' : '')} src=${b.src} alt=${b.alt || ''} fit=${b.contain ? 'contain' : 'cover'} />`
            : html`<div key=${k} data-slot=${b.slot} aria-hidden="true" style=${`width:${META[b.slot].w}px;height:${META[b.slot].h}px;margin:${b.w ? '12px auto 4px' : '6px 0 2px'};flex:none`}></div>`)
          : html`<div key=${k} class="ph photo">${b.label}</div>`;
        case 'role': return html`<div class="entry sm" key=${k}><h2 class="h2">${b.h}</h2><p class="meta">${b.meta}</p></div>`;
        case 'list': return html`<div key=${k}>${b.h ? html`<h2 class="h2" style="margin-bottom:8px">${b.h}</h2>` : null}<ul class="list">${b.items.map((t, j) => html`<li key=${j}>${t}</li>`)}</ul></div>`;
        case 'links': return html`<div key=${k}><h2 class="h2" style="margin-bottom:6px">${b.h}</h2><div class="links">${b.items.map((a, j) => html`<a key=${j} href=${a[1]} target="_blank" rel="noopener">${a[0]}</a>`)}</div></div>`;
        case 'hi': return live
          ? html`<button key=${k} class="btn hi" onClick=${() => this.goSlug(b.goto)}><span class="h2" style="display:block">${b.h}</span><span class="meta" style="display:block">${b.meta}</span></button>`
          : html`<div key=${k} class="hi"><span class="h2" style="display:block">${b.h}</span><span class="meta" style="display:block">${b.meta}</span></div>`;
        case 'jump': return html`<div key=${k}><h2 class="h2" style="margin-bottom:4px">Jump to</h2><div class="jump">${SECTIONS.slice(1).map((s, j) => live
          ? html`<button key=${j} class="btn" onClick=${() => this.goSpread(this.starts[j + 1])}>${s.label}</button>`
          : html`<span key=${j} style="min-height:32px;display:inline-flex;align-items:center;color:#006a96;text-decoration:underline">${s.label}</span>`)}</div></div>`;
        case 'post': return live
          ? html`<button key=${k} class="post" onClick=${() => this.setState({ pop: 'postcard' })} aria-label="Look at the postcard"><${Pic} src=${POSTCARD.photo} alt=${POSTCARD.alt} style="position:absolute;inset:0" /></button>`
          : html`<div key=${k} class="post"><${Pic} src=${POSTCARD.photo} style="position:absolute;inset:0" /></div>`;
        case 'pocket': return live
          ? html`<button key=${k} class="pocket" onClick=${() => this.setState({ pop: 'pocket' })} aria-label="Take the card out of the pocket"><span class="pk-card"></span><span class="pk-front"></span></button>`
          : html`<div key=${k} class="pocket"><span class="pk-card"></span><span class="pk-front"></span></div>`;
        default: return null;
      }
    });
  }
  head(p) {
    if (!p.title) return null;
    return html`<div class="ink" style="display:flex;flex-direction:column;gap:12px">
      <p class="kicker">${p.kicker}</p><h1 class="h1">${p.title}</h1><hr class="rule" />
      ${p.lead ? html`<p class="lead">${p.lead}</p>` : null}
      ${p.logo ? html`<${Logo} name=${p.logo} h=${p.logo === 'rmhc' ? 52 : 46} />` : null}
    </div>`;
  }
  summary(live) {
    // the first page: who, what, how to reach me
    const c = CONTACT;
    return html`<div class="ink" style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
        <div style="display:flex;flex-direction:column;gap:16px"><p class="kicker">Portfolio</p><h1 class="h1" style="font-size:36px">Ryan Edward<br />Scott</h1></div>
        <div class="ph" style="width:120px;height:150px;flex:none;box-shadow:1px 2px 4px rgba(0,0,0,.35)">[HEADSHOT]</div>
      </div>
      <hr class="rule" />
      <p class="body">Babson College · B.S. Business Administration, Strategy and Consulting</p>
      <p class="body" style="font-weight:700">[ONE SENTENCE: WHAT YOU DO AND THE ROLES YOU'RE LOOKING FOR]</p>
      <div class="links">
        ${live ? html`<a href=${c.resume} target="_blank" rel="noopener">Résumé (PDF)</a>` : html`<span>Résumé (PDF)</span>`}
        ${live ? html`<a href=${c.linkedin} target="_blank" rel="noopener">LinkedIn</a>` : html`<span>LinkedIn</span>`}
        ${c.email ? (live ? html`<a href=${'mailto:' + c.email}>${c.email}</a>` : html`<span>${c.email}</span>`) : null}
      </div>
      <p class="meta">“We do our best work while helping others.” — Woodie Flowers</p>
    </div>`;
  }
  pageBody(p, side, live, flat) {
    // header + blocks + footer for one page; side 'L' or 'R'
    const foot = side === 'R'
      ? html`<div class="ink foot" style="justify-content:flex-end"><span class="pos">${p.pos}</span><span>${p.num}</span>${p.hasNext ? (live ? html`<button class="arw" onClick=${() => this.goSpread(this.state.sp + 1)} aria-label="Next pages">${ARROW_R}</button>` : html`<span class="arw">${ARROW_R}</span>`) : null}</div>`
      : html`<div class="ink foot">${p.cover
          ? (live ? html`<button class="btn closebtn" onClick=${() => this.closeBook()}>${ARROW_L} Close</button>` : html`<span class="closebtn">${ARROW_L} Close</span>`)
          : p.hasPrev ? (live ? html`<button class="arw" onClick=${() => this.goSpread(this.state.sp - 1)} aria-label="Previous pages">${ARROW_L}</button>` : html`<span class="arw">${ARROW_L}</span>`) : null}<span>${p.num}</span><span class="pos">${p.pos}</span></div>`;
    return html`<div class=${'pg ' + (side === 'R' ? 'pgR' : 'pgL')}>
      ${p.cover ? this.summary(live) : this.head(p)}
      ${p.blocks ? html`<div class="ink blocks">${this.blocks(p.blocks, live, flat)}</div>` : null}
      ${foot}
    </div>`;
  }
  decal(d, interactive) {
    return html`<div key=${d.which} class=${'decal' + (interactive === 'ghost' ? ' ghost' : '')} style=${d.css}
      onPointerDown=${interactive === true ? d.grab : null} onClick=${interactive ? d.go : null}
      data-hint=${interactive === 'ghost' ? d.hint : null} title=${interactive === 'ghost' ? d.hint : null}>
      <${Thing} which=${d.which} down=${d.face} />
      ${d.tapes.map((t, j) => html`<span key=${j} class="tape" style=${t}></span>`)}
    </div>`;
  }
  stack(list, side) {
    return list.map((e) => e.isTab
      ? html`<button key=${'t' + e.i} class=${'tab ' + (side === 'R' ? 'tabR' : 'tabL')} style=${e.style} onClick=${e.pick} aria-label=${'Go to ' + e.label} data-hint=${'Go to ' + e.label}>
          <span class="plastic"></span><span class="insert"><span class="lbl" style=${e.fs}>${e.label}</span></span></button>`
      : this.decal(e, 'ghost'));
  }
  tabFace(t, back) {
    return html`<div class=${'stf' + (back ? ' stfB' : '')} style=${back ? 'transform: rotateY(180deg) translateZ(-.3px)' : ''}><span class="plastic"></span><span class="insert"><span class="lbl" style=${t.fs}>${t.label}</span></span></div>`;
  }

  renderBinder() {
    const st = this.state, P = this.pages, f = st.flip, sc = this.scale();
    const target = f ? f.b : st.sp, cur = this.sectionOf(target);
    const tlo = f ? Math.min(f.a, f.b) : st.sp, thi = f ? Math.max(f.a, f.b) : st.sp;
    const moving = [];
    SECTIONS.forEach((s, i) => {
      const start = this.starts[i];
      if (st.open && start > tlo && start <= thi) {
        const t = this.tabFor(i, 'R'); moving.push({ label: t.label, fs: t.fs, style: 'top:' + (12 + i * 104) + 'px' });
      }
    });
    let li, ri, sf = 1, sb = 0;
    if (f && f.dir === 'F') { li = 2 * f.a; ri = 2 * f.b + 1; sf = 2 * f.a + 1; sb = 2 * f.b; }
    else if (f) { li = 2 * f.b; ri = 2 * f.a + 1; sf = 2 * f.b + 1; sb = 2 * f.a; }
    else { li = 2 * st.sp; ri = 2 * st.sp + 1; }
    const N = this.N, w = 494 / N, strips = [];
    if (f) {
      const G = this.geom(f.dir, 0), fD = this.decals(sf, 'strip'), bD = this.decals(sb, 'strip'), fX = this.decals(sb, 'mirror'), bX = this.decals(sf, 'mirror');
      for (let i = 0; i < N; i++) {
        const xf = i * w, xb = 494 - (i + 1) * w, W = Math.min(w + 1.4, 494 - xf);
        strips.push({ i, init: this.stripCss(G.strips[i]) + `;width:${W.toFixed(2)}px`,
          bgF: `background-position:${(-xf).toFixed(2)}px 0;clip-path:inset(-400px ${i === N - 1 ? '-400px' : '0'} -400px 0)`,
          bgB: `transform:rotateY(180deg);background-position:${(-xb).toFixed(2)}px 0;clip-path:inset(-400px 0 -400px ${i === N - 1 ? '-400px' : '0'})`,
          offF: `left:${(-xf).toFixed(2)}px;width:494px`, offB: `left:${(-xb).toFixed(2)}px;width:494px`,
          fD, bD, fX, bX, ovF: this.ovClip(W, i === N - 1, false), ovB: this.ovClip(W, i === N - 1, true),
          tabs: i === N - 1 ? moving : [] });
      }
    }
    // page edges: left = sheets already turned, right = sheets still to come
    const sheets = this.spreads - 1, lo = tlo, hi = thi;
    const edges = (n, sign, cx, cy) => {
      const parts = [];
      for (let e = 1; e <= n; e++) parts.push(`${sign * e * 1.5}px ${Math.round(e * 0.5)}px 0 ${e % 2 ? '#cfcfcc' : '#fbfbf9'}`);
      parts.push(`${cx + sign * n * 1.5}px ${cy + Math.round(n * 0.5)}px ${3 + n * 0.5}px rgba(0,0,0,.4)`);
      return parts.join(', ');
    };
    // right stack, deepest first: back cover, then each sheet's underside, tab, top side
    let rS = [], lS = [];
    const sl = this.spreads - 1, hs = st.open ? hi : 0;
    if (hs < sl) rS = rS.concat(this.decals(2 * sl + 1, 'R'));
    for (let s = sl - 1; s >= hs; s--) {
      rS = rS.concat(this.decals(2 * s + 2, 'R'));
      const tr = this.sheetTab(s); if (tr > 0 && (!st.open || this.starts[tr] > hi)) rS.push(this.tabFor(tr, 'R'));
      if (s > hs) rS = rS.concat(this.decals(2 * s + 1, 'R'));
    }
    if (!st.open) rS.push(this.tabFor(0, 'R'));
    if (st.open) {
      lS.push(this.tabFor(0, 'L'));
      if (lo > 0) lS = lS.concat(this.decals(0, 'L'));
      for (let q = 0; q < lo; q++) {
        lS = lS.concat(this.decals(2 * q + 1, 'L'));
        const tl = this.sheetTab(q); if (tl > 0 && this.starts[tl] <= lo) lS.push(this.tabFor(tl, 'L'));
        if (q < lo - 1) lS = lS.concat(this.decals(2 * q + 2, 'L'));
      }
    }
    const ox = st.open ? 280 : 20, dur = st.slow ? '1.8s' : '.9s';
    const L = P[li], R = P[ri], SF = P[sf], SB = P[sb];
    const rDecals = this.decals(ri, 'page'), lDecals = li === 0 ? [] : this.decals(li, 'page'), cDecals = lo === 0 ? this.decals(0, 'cover') : [];
    const showPlaybill = st.open && !f && st.sp === this.starts[5];
    const swipe = (e) => this.swipeStart(e, (d) => st.open ? this.goSpread(this.state.sp + d) : (d > 0 && this.openBook()));
    const wheel = (e) => {
      const d = e && e.deltaY ? e.deltaY : 0, now = Date.now();
      if (Math.abs(d) < 8 || now < this.wheelLock || this.state.pop) return;
      this.wheelLock = now + 850;
      if (!this.state.open) { if (d > 0) this.openBook(); return; }
      this.goSpread(this.state.sp + (d > 0 ? 1 : -1));
    };

    return html`<div class="oak" onWheel=${wheel} onPointerDown=${swipe} style="position:relative;width:100%;height:100%;min-height:520px;overflow:hidden">
      <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(95% 85% at 24% 10%, rgba(255,230,180,.30), rgba(60,30,8,.06) 36%, rgba(14,6,0,.44) 70%, rgba(6,2,0,.66) 100%);pointer-events:none"></div>

      <div style=${`position:absolute;left:50%;top:calc(50% + 28px);width:1600px;height:900px;transform:translate(-50%,-50%) scale(${sc})`}>
        <div aria-hidden="true" style="position:absolute;left:0;top:0;width:1600px;height:900px;filter:blur(6px);pointer-events:none">
          <div style=${`position:absolute;inset:0;background:rgba(0,0,0,.5);clip-path:${this.binderClip()};transition:clip-path ${dur} cubic-bezier(.4,.1,.2,1)`}></div>
        </div>

        <div ref=${this.setRoot} style=${`position:absolute;left:280px;top:96px;width:1040px;height:680px;perspective:3600px;transform:${st.open ? 'translateX(0px)' : 'translateX(-260px)'};transition:transform ${dur} cubic-bezier(.4,.1,.2,1)`}>
          <div aria-hidden="true" style=${`position:absolute;left:0;top:0;width:520px;height:680px;border-radius:16px 6px 6px 16px;box-shadow:0 1px 2px rgba(0,0,0,.45);opacity:${st.open ? 1 : 0};transition:${st.open ? `opacity .4s ease ${st.slow ? '1.1s' : '.55s'}` : 'opacity .12s ease 0s'}`}></div>

          <div class="lining" style="position:absolute;left:520px;top:0;width:520px;height:680px;border-radius:6px 16px 16px 6px;box-shadow:0 1px 2px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.10),inset 0 -2px 3px rgba(0,0,0,.8)">
            <div aria-hidden="true" style="position:absolute;inset:0;overflow:hidden;border-radius:6px 16px 16px 6px;pointer-events:none"><span style=${'position:absolute;' + this.litCss(ox + 520, 96)}></span></div>
            <div aria-hidden="true" style="position:absolute;inset:9px;border:1.5px dashed rgba(150,148,140,.5);border-radius:3px 10px 10px 3px"></div>
          </div>

          <div class="gl">${this.stack(rS, 'R')}</div>

          ${showPlaybill ? html`<button class="peek" onClick=${() => this.setState({ pop: 'playbill' })} aria-label="Pull out the show program" data-hint="Pull out the program"><span style="display:block;height:30px;background:#14171a;color:#fff;font-size:11px;letter-spacing:.34em;line-height:30px;text-align:center">PROGRAM</span></button>` : null}

          <div class="paper" style=${`position:absolute;left:520px;top:18px;width:494px;height:644px;border-radius:0 2px 2px 0;box-shadow:${edges(sheets - hi, 1, 2, 2)};clip-path:inset(-400px -400px -400px 0)`}>
            ${this.pageBody(R, 'R', st.open && !f)}
            ${rDecals.map((d) => this.decal(d, true))}
            <div class="litR" aria-hidden="true"></div>
            <div class="gutR" aria-hidden="true"></div>
            ${R.hasNext && st.open ? html`<div class="grab" style="right:0" onPointerDown=${this.gF} title="Drag to turn the page"></div>` : null}
          </div>

          <div style=${`position:absolute;left:520px;top:0;width:520px;height:680px;z-index:5;transform-origin:left center;transform-style:preserve-3d;transform:${st.open ? 'rotateY(-180deg)' : 'rotateY(0deg)'};transition:transform ${dur} cubic-bezier(.4,.1,.2,1)`}>
            <button class="leather cover" onClick=${() => this.openBook()} aria-label="Open Ryan Edward Scott's portfolio" style="position:absolute;inset:0;width:520px;height:680px;border:0;padding:0;margin:0;cursor:pointer;border-radius:6px 16px 16px 6px;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.2),inset 0 -2px 3px rgba(0,0,0,.85),inset -3px 0 4px rgba(0,0,0,.6)">
              <span aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(150% 110% at -21% -6%, rgba(255,240,215,.34), rgba(255,255,255,.07) 50%, rgba(0,0,0,.5) 100%)"></span>
              <span class="lit" aria-hidden="true" style=${this.litCss(ox + 520, 96)}></span>
              <span aria-hidden="true" style="position:absolute;left:0;top:0;width:26px;height:100%;background:linear-gradient(90deg, rgba(0,0,0,.6), rgba(255,255,255,.06) 60%, rgba(0,0,0,.28))"></span>
              <span aria-hidden="true" style="position:absolute;inset:11px 11px 11px 34px;border:1.5px dashed rgba(180,178,168,.68);border-radius:3px 9px 9px 3px;filter:drop-shadow(.5px 1px 0 rgba(0,0,0,.9))"></span>
              <span aria-hidden="true" style="position:absolute;inset:24px 24px 24px 47px;border-radius:4px 8px 8px 4px;box-shadow:inset 0 2px 2px rgba(255,255,255,.09),inset 0 -3px 5px rgba(0,0,0,.5),0 -1px 1px rgba(0,0,0,.7),0 1px 0 rgba(255,255,255,.07)"></span>
              <span style="position:absolute;left:47px;right:24px;top:268px;display:flex;flex-direction:column;align-items:center;gap:14px">
                <span style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:33px;letter-spacing:.24em;color:rgba(214,210,198,.62);text-shadow:-1px -1px 1px rgba(0,0,0,.95),1px 1px 0 rgba(255,255,255,.32),0 0 6px rgba(0,0,0,.6)">RYAN EDWARD SCOTT</span>
                <span aria-hidden="true" style="width:64px;height:2px;background:rgba(214,210,198,.5);box-shadow:0 -1px 0 rgba(0,0,0,.9),0 1px 0 rgba(255,255,255,.25)"></span>
                <span style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:17px;letter-spacing:.42em;color:rgba(214,210,198,.62);text-shadow:-1px -1px 1px rgba(0,0,0,.95),1px 1px 0 rgba(255,255,255,.30)">PORTFOLIO</span>
              </span>
            </button>

            <div class="lining" style="position:absolute;inset:0;transform:rotateY(180deg);backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:16px 6px 6px 16px;box-shadow:inset 0 1px 0 rgba(255,255,255,.10),inset 0 -2px 3px rgba(0,0,0,.8)">
              <div aria-hidden="true" style="position:absolute;inset:0;overflow:hidden;border-radius:16px 6px 6px 16px;pointer-events:none"><span style=${'position:absolute;' + this.litCss(ox, 96)}></span></div>
              <div aria-hidden="true" style="position:absolute;inset:9px;border:1.5px dashed rgba(150,148,140,.5);border-radius:10px 3px 3px 10px"></div>
              <div class="gl">${this.stack(lS, 'L')}</div>
              <div class="paper" style=${`position:absolute;left:26px;top:18px;width:494px;height:644px;border-radius:2px 0 0 2px;box-shadow:${edges(lo, -1, 1, 2)};clip-path:inset(-400px 0 -400px -400px)`}>
                ${this.pageBody(L, 'L', st.open && !f)}
                ${lDecals.map((d) => this.decal(d, true))}
                <div class="litL" aria-hidden="true"></div>
                <div class="gutL" aria-hidden="true"></div>
                ${L.hasPrev && st.open ? html`<div class="grab" style="left:0" onPointerDown=${this.gB} title="Drag to turn the page"></div>` : null}
              </div>
            </div>

            <div style="position:absolute;inset:0;transform:rotateY(180deg) translateZ(1px);transform-style:preserve-3d;pointer-events:none">
              ${cDecals.map((d) => html`<div key=${d.which} class="d3" style=${d.css} onPointerDown=${d.grab} onClick=${d.go}>
                <div class="d3f" style=${d.shadow}><${Thing} which=${d.which} down=${false} />${d.tapes.map((t, j) => html`<span key=${j} class="tape" style=${t}></span>`)}</div>
                <div class="d3f" style="transform:rotateY(180deg)"><${Thing} which=${d.which} down=${true} /></div>
              </div>`)}
            </div>
          </div>

          ${f ? html`<div class="cast" aria-hidden="true"></div>
            <div class="sheet" aria-hidden="true">
              ${strips.map((s) => html`<div key=${s.i} class="strip" style=${s.init}>
                <div class="paper face" style=${s.bgF}><div class="off" style=${s.offF}><div class="gutR"></div>${this.pageBody(SF, 'R', false)}${s.fD.map((d) => this.decal(d, false))}</div><div class="shd shF"></div></div>
                <div class="paper face" style=${s.bgB}><div class="off" style=${s.offB}><div class="gutL"></div>${this.pageBody(SB, 'L', false)}${s.bD.map((d) => this.decal(d, false))}</div><div class="shd shB"></div></div>
                ${s.fX.length ? html`<div class="ovh" style=${s.ovF}><div class="off" style=${s.offF}>${s.fX.map((d) => this.decal(d, false))}</div></div>` : null}
                ${s.bX.length ? html`<div class="ovh" style=${s.ovB}><div class="off" style=${s.offB}>${s.bX.map((d) => this.decal(d, false))}</div></div>` : null}
                ${s.tabs.map((t) => html`<div key=${t.label} class="stab" style=${t.style}>${this.tabFace(t, false)}${this.tabFace(t, true)}</div>`)}
              </div>`)}
            </div>` : null}
        </div>

        ${(() => { const sh = this.thickShadow('fr'); return html`<div key="fr-shadow" aria-hidden="true" style=${'position:absolute;pointer-events:none;' + sh.box}>
          ${sh.steps.map((t, j) => html`<div key=${j} style=${`position:absolute;inset:0;background:url(${FOCUSRITE}) 0 0/100% 100% no-repeat;filter:brightness(0);${t}`}></div>`)}</div>`; })()}
        ${this.order.map((id) => html`<div key=${id} class="item" style=${this.itemCss(id)} onPointerDown=${this.hand[id]} onClickCapture=${(e) => { if (this.justDragged) { e.preventDefault(); e.stopPropagation(); } }}>
          <${Thing} which=${id} down=${false} live=${true} />
          <span class="lit" aria-hidden="true" style=${this.litCss(this.pos(id).x || 0, this.pos(id).y || 0) + (id === 'fr' ? (() => { const v = this.view(), q = this.pos('fr'), mx = q.x - v.x0 + LIT_PAD, my = q.y - v.y0 + LIT_PAD;
            return `;-webkit-mask:url(${FOCUSRITE}) ${mx.toFixed(1)}px ${my.toFixed(1)}px/378px 213px no-repeat;mask:url(${FOCUSRITE}) ${mx.toFixed(1)}px ${my.toFixed(1)}px/378px 213px no-repeat`; })() : '')}></span>
        </div>`)}
      </div>

      ${this.measured ? null : html`<div class="measure" aria-hidden="true" style="position:absolute;left:-12000px;top:0;visibility:hidden;pointer-events:none">
        ${this.pages.map((p, i) => p.blocks && p.blocks.some((b) => b.slot) ? html`<div key=${i} class="paper mpage" data-page=${i} style="position:relative;width:494px;height:644px">${this.pageBody(p, i % 2 ? 'R' : 'L', false)}</div>` : null)}
      </div>`}

      ${this.renderNav(cur, false)}

      <div class="bottombar">
        <button class="nav strong" onClick=${() => this.setState({ pop: 'contact' })}>Contact me</button>
        <button class="nav" onClick=${() => (st.open ? this.closeBook() : this.openBook())}>${st.open ? 'Close book' : 'Open book'}</button>
        <button class="nav" onClick=${() => this.setState({ muted: !st.muted })}>${st.muted ? 'Audio off' : 'Audio on'}</button>
        <button class="nav" onClick=${() => { clearTimeout(this.t1); if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; this._lay = null; this.state.items = this.home(); this.setState({ items: this.freeze(this.home()), held: null, pop: null, sp: 0, flip: null }); }}>Reset page</button>
      </div>
    </div>`;
  }

  renderNav(cur, mobile) {
    const st = this.state;
    return html`<nav aria-label="Sections" style="position:absolute;left:0;top:0;width:100%;min-height:56px;box-sizing:border-box;padding:0 22px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0 18px;background:rgba(16,9,3,.30);backdrop-filter:blur(16px) saturate(1.3);-webkit-backdrop-filter:blur(16px) saturate(1.3);border-bottom:1px solid rgba(255,255,255,.16);z-index:20">
      <button class="nav" onClick=${() => this.closeBook()} style="color:#efe9da;font-size:17px;letter-spacing:.06em;padding-left:0">Ryan Edward Scott</button>
      <div class="navr">
        ${SECTIONS.map((sec, i) => { const on = st.open && i === cur; return html`<button key=${i} class="nav" onClick=${() => this.goSpread(this.starts[i])} aria-current=${on ? 'page' : null} style=${`color:${on ? '#5cc8f5' : '#e6dfcf'};border-bottom-color:${on ? '#009ddc' : 'transparent'}`}>${sec.label}</button>`; })}
        <span class="navsep" aria-hidden="true"></span>
        <a class="nav navcta" href=${CONTACT.resume} target="_blank" rel="noopener" style="display:inline-flex;align-items:center;text-decoration:none">Résumé (PDF)</a>
        <button class="nav navcta" onClick=${() => this.setState({ pop: 'contact' })}>Contact</button>
        <button class="nav" onClick=${() => this.setState({ plain: true })} style="color:#e6dfcf">Plain view</button>
      </div>
    </nav>`;
  }

  renderPop() {
    const st = this.state; if (!st.pop) return null;
    const close = () => this.setState({ pop: null });
    let body = null;
    if (st.pop === 'playbill') body = html`<div class="card-pop" style="width:340px;height:500px;display:flex;flex-direction:column">
      <p style="margin:0;height:64px;background:#14171a;color:#fff;font-size:18px;letter-spacing:.4em;line-height:64px;text-align:center">PROGRAM</p>
      <${Pic} src=${PROGRAM.photo} alt=${PROGRAM.alt} style="margin:26px 26px 0;height:200px" />
      <div style="padding:22px 26px;display:flex;flex-direction:column;gap:8px">
        <p style="margin:0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#005a80;font-weight:700">${PROGRAM.where}</p>
        <p style="margin:0;font-size:28px;line-height:1.15">${PROGRAM.show}</p>
        <p style="margin:0;font-size:15px;font-style:italic">${PROGRAM.role}</p>
        <p style="margin:0;font-size:13.5px">${PROGRAM.credit}</p>
      </div></div>`;
    if (st.pop === 'postcard') body = html`<div class="card-pop" style="width:500px;max-width:92vw;height:330px;box-sizing:border-box;padding:28px;display:flex;gap:24px">
      <p style="margin:0;flex:1;font-size:15px;line-height:1.6;font-style:italic">${POSTCARD.note}</p>
      <div style="width:1px;background:#9a9a96"></div>
      <div style="flex:1;display:flex;flex-direction:column;gap:22px">
        <div style="align-self:flex-end;width:62px;height:74px;border:1.5px dashed #6b6b68;display:flex;align-items:center;justify-content:center;font-size:10px;color:#44474b">[STAMP]</div>
        <div style="border-bottom:1px solid #6b6b68;height:18px"></div><div style="border-bottom:1px solid #6b6b68;height:18px"></div><div style="border-bottom:1px solid #6b6b68;height:18px"></div>
      </div></div>`;
    if (st.pop === 'pocket') body = html`<div class="card-pop" style="width:440px;max-width:92vw;box-sizing:border-box;padding:34px;background:#9dbdf2;color:#10264d;display:flex;flex-direction:column;gap:12px">
      <p style="margin:0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:700">From the back pocket</p>
      <p style="margin:0;font-size:22px;line-height:1.35">${POCKET.note}</p></div>`;
    if (st.pop === 'contact') {
      const c = CONTACT;
      body = html`<div class="card-pop" style="width:420px;max-width:92vw;box-sizing:border-box;padding:30px 34px;display:flex;flex-direction:column;gap:10px">
        <p class="kicker">Contact</p>
        <h2 style="margin:0;font-size:30px;font-weight:400">Ryan Edward Scott</h2>
        <hr class="rule" />
        ${c.email ? html`<a href=${'mailto:' + c.email} style="font-size:17px;font-weight:700">${c.email}</a>` : html`<span style="font-size:17px;font-weight:700">[EMAIL]</span>`}
        <a href=${c.resume} target="_blank" rel="noopener">Résumé (PDF)</a>
        <a href=${c.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        <a href=${c.instagram} target="_blank" rel="noopener">Instagram</a>
        <a href=${c.youtube} target="_blank" rel="noopener">YouTube</a>
        <a href=${c.remg} target="_blank" rel="noopener">Ryan Edward Media Group</a>
      </div>`;
    }
    return html`<div style="position:absolute;inset:0;z-index:50;display:flex;align-items:center;justify-content:center" role="dialog" aria-modal="true">
      <button onClick=${close} aria-label="Close" style="position:absolute;inset:0;width:100%;height:100%;border:0;padding:0;margin:0;background:rgba(8,4,0,.5);cursor:pointer"></button>
      <div class="popin" style="position:relative;display:flex;flex-direction:column;align-items:center;gap:16px">
        ${body}
        <button class="nav" onClick=${close} style="color:#fff;font-size:15px;text-decoration:underline">${st.pop === 'contact' ? 'Close' : 'Put it back'}</button>
      </div>
    </div>`;
  }

  renderPlain() {
    // everything on one plain, readable page
    return html`<div class="plain">
      <div class="plain-top">
        <strong style="font-size:17px">Ryan Edward Scott</strong>
        <div style="display:flex;gap:6px;align-items:center">
          <a href=${CONTACT.resume} target="_blank" rel="noopener" style="min-height:44px;display:inline-flex;align-items:center;padding:0 10px">Résumé (PDF)</a>
          <button class="btn" onClick=${() => this.setState({ plain: false })} style="min-height:44px;padding:0 10px;color:#005a80;font-weight:700">Back to the binder</button>
        </div>
      </div>
      <div class="plain-in">
        <section>${this.summary(true)}</section>
        ${this.pages.filter((p) => !p.cover).map((p, k) => html`<section key=${k}>
          ${this.head(p)}
          ${p.blocks ? html`<div class="blocks">${this.blocks(p.blocks.filter((b) => b.type !== 'pocket' && b.type !== 'jump'), true, true)}</div>` : null}
        </section>`)}
      </div>
    </div>`;
  }

  renderMobile() {
    // phone: one page at a time, tabs along the top, swipe or arrows to turn
    const st = this.state, p = this.pages[st.mp], cur = p.section;
    const ms = Math.min((st.vw - 20) / 494, (st.vh - 190) / 644);
    const left = (st.vw - 494 * ms) / 2;
    const swipe = (e) => this.swipeStart(e, (d) => this.goMobile(st.mp + d));
    const foot = html`<div class="m-bottom">
      <button class="nav" disabled=${st.mp === 0} onClick=${() => this.goMobile(st.mp - 1)}>‹ Back</button>
      <button class="nav" style="font-weight:700;color:#fff" onClick=${() => this.setState({ pop: 'contact' })}>Contact me</button>
      <button class="nav" disabled=${st.mp === this.pages.length - 1} onClick=${() => this.goMobile(st.mp + 1)}>Next ›</button>
    </div>`;
    return html`<div class="oak m-root">
      <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(95% 85% at 24% 10%, rgba(255,230,180,.30), rgba(60,30,8,.06) 36%, rgba(14,6,0,.44) 70%, rgba(6,2,0,.66) 100%);pointer-events:none"></div>
      <div class="m-top">
        <div class="m-row">
          <button class="nav" onClick=${() => this.goMobile(0)} style="color:#efe9da;font-size:16px;padding-left:4px">Ryan Edward Scott</button>
          <div style="display:flex">
            <a class="nav navcta" href=${CONTACT.resume} target="_blank" rel="noopener" style="display:inline-flex;align-items:center;text-decoration:none;font-size:14px">Résumé</a>
            <button class="nav" onClick=${() => this.setState({ plain: true })} style="color:#e6dfcf;font-size:14px">Plain view</button>
          </div>
        </div>
        <div class="m-tabs" role="tablist">
          ${SECTIONS.map((s, i) => html`<button key=${i} role="tab" aria-selected=${i === cur} class=${'m-tab' + (i === cur ? ' on' : '')} onClick=${() => this.goMobile(2 * this.starts[i])}>${s.label}</button>`)}
        </div>
      </div>
      <div class="m-stage" onPointerDown=${swipe}>
        <div key=${st.mp} class="paper m-page m-in" style=${`left:${left.toFixed(1)}px;--ms:${ms.toFixed(4)};--dx:${st.mdir * 40}px`}>
          ${this.pageBody(Object.assign({}, p, { hasNext: false, hasPrev: false, cover: p.cover }), 'R', true, true)}
        </div>
      </div>
      ${foot}
    </div>`;
  }

  render() {
    const st = this.state;
    return html`<div style="position:absolute;inset:0">
      ${this.isMobile() ? this.renderMobile() : this.renderBinder()}
      ${st.plain ? this.renderPlain() : null}
      ${this.renderPop()}
    </div>`;
  }
}

render(html`<${Binder} />`, document.getElementById('app'));
