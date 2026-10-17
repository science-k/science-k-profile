const mobileView = matchMedia('(max-width: 800px)');
const input = document.querySelector('#lecture-search');
if (input) {
  const search = document.querySelector('.lecture-search');
  const head = document.querySelector('.lecture-list-head');
  const fields = document.querySelector('.lecture-fields');
  const searchHome = search.parentNode;
  const searchNext = search.nextSibling;
  // Move the existing search only on mobile; preserve desktop order and one input.
  const placeSearch = () => {
    if (mobileView.matches) head.insertBefore(search, fields);
    else searchHome.insertBefore(search, searchNext);
  };
  mobileView.addEventListener('change', placeSearch);
  placeSearch();
  const rows = [...document.querySelectorAll('.lecture-entry')];
  const normalize = text => text.toLocaleLowerCase().replace(/\s+/g, '');
  const entries = rows.map(row => [row, normalize(row.textContent)]);
  const update = () => {
    const query = normalize(input.value);
    let count = 0;
    entries.forEach(([row, text]) => { row.hidden = !text.includes(query); if (!row.hidden) count++; });
    document.querySelectorAll('.lecture-month-group').forEach(group => { group.hidden = ![...group.querySelectorAll('.lecture-entry')].some(row => !row.hidden); });
    document.querySelectorAll('.lecture-table-year').forEach(group => { group.hidden = ![...group.querySelectorAll('.lecture-month-group')].some(month => !month.hidden); });
    document.querySelector('#search-status').textContent = query ? (count ? `${count}개 강의 항목을 찾았습니다.` : '검색 결과가 없습니다. 다른 주제나 기관명을 입력해 주세요.') : `전체 ${rows.length}개 강의 항목`;
  };
  search.hidden = false;
  input.addEventListener('input', update);
  document.querySelector('#search-clear').addEventListener('click', () => { input.value = ''; update(); input.focus(); });
  update();
}
const links = [...document.querySelectorAll('.profile-nav a')];
if (links.length) {
  const targets = links.map(link => document.getElementById(link.hash.slice(1)));
  const nav = links[0].parentElement;
  let queued = false;
  const update = () => {
    queued = false;
    let active = 0;
    targets.forEach((target, i) => { if (target && target.getBoundingClientRect().top < 150) active = i; });
    links.forEach((link, i) => { if(i === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    if (mobileView.matches) {
      const bounds = nav.getBoundingClientRect();
      const item = links[active].getBoundingClientRect();
      // Scroll this menu horizontally without moving the page vertically.
      if (item.left < bounds.left) nav.scrollLeft += Math.floor(item.left - bounds.left) - 4;
      else if (item.right > bounds.right) nav.scrollLeft += Math.ceil(item.right - bounds.right) + 4;
    }
  };
  const scheduleUpdate = () => { if(!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', scheduleUpdate, {passive:true});
  addEventListener('resize', scheduleUpdate, {passive:true});
  update();
}
