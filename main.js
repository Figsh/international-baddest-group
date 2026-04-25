  // RULES DATA - icons replaced with fontawesome
  const rules = [
    { title: "Introduction", body: "All new members must properly introduce themselves before they can be fully recognized in the group. This helps everyone know each other and maintain order.", icon: "fas fa-hand-peace" },
    { title: "Participation", body: "All members, including admins, are expected to participate in daily activities and group engagements. Active participation keeps the group lively and organized.", icon: "fas fa-comments" },
    { title: "Content Posting", body: "Posting of unnecessary or irrelevant content is not allowed unless it has been approved by the admins. Always ensure your posts are meaningful to the group.", icon: "fas fa-pen-fancy" },
    { title: "Respect Privacy", body: "Members are free to interact and mingle, but do not message anyone privately without their permission. Respect personal boundaries at all times.", icon: "fas fa-user-secret" },
    { title: "Sensitive Content", body: "Posting of explicit or inappropriate content is generally prohibited. Any exceptions must strictly follow group-approved guidelines.", icon: "fas fa-ban" },
    { title: "Behavior", body: "No quarrels, insults, or offensive language will be tolerated. Respect and maturity are expected from every member at all times.", icon: "fas fa-handshake" },
    { title: "Advertisements", body: "Do not advertise events, shows, or external promotions in the group unless you have received approval from the admins.", icon: "fas fa-bullhorn" }
  ];

  function buildRules() {
    const grid = document.getElementById('rulesGrid');
    grid.innerHTML = rules.map((r, i) => `
      <div class="rule-card" onclick="toggleRule(this)" style="animation-delay:${i*0.06}s">
        <h3>
          <span class="rule-num">${i+1}</span>
          <i class="${r.icon}"></i> Rule ${i+1}: ${r.title}
          <span class="rule-arrow"><i class="fas fa-chevron-right"></i></span>
        </h3>
        <p>${r.body}</p>
      </div>
    `).join('');
  }

  function toggleRule(el) {
    el.classList.toggle('open');
  }

  function agreeRules() {
    showToast("🙌 Thank you for agreeing to the group rules!");
  }

  // MEMBERS DATA (from original)
  const memberNamesRaw = [
    "DJ SpireX.Com","Jones Joseph","Oluwa Big Zaddy","Aniebiet Wilson","BiG TreNch","BRAKEMI",
    "Emeding Benson","fresh1223334444","Hotspot FX","katatizo empire","Lonely Candy",
    "Nurse Mbetobong Tommy","Ømäh Blåq","Stephanie","Testimony","Universe",
    "Wilson Nsikan","Figsh","Precious David","Baddest Ikon","Queen V","Young Alpha","King Tino","Mighty Jay"
  ];

  const ceoNames    = ["dj spirex"];
  const figshName   = "figsh";

  function buildMembers() {
    const allNames = [...new Set(memberNamesRaw)];
    let members = allNames.map((name, idx) => {
      const clean = name.replace(/[❤️😂😍💕]/g, '').trim();
      const lower = clean.toLowerCase();
      const isCeo   = ceoNames.some(c => lower.includes(c));
      const isFigsh = lower === figshName;
      let badgeText, badgeClass;
      if (isCeo)        { badgeText = "👑 CEO";              badgeClass = ""; }
      else if (isFigsh) { badgeText = "⚡ ADMIN · DEV";      badgeClass = "admin-badge"; }
      else              { badgeText = "🛡️ ADMIN";            badgeClass = "admin-badge"; }

      // Replace emoji shield with fontawesome in badge
      if (badgeText.includes("🛡️")) badgeText = "ADMIN";
      if (badgeText.includes("👑")) badgeText = "CEO";
      if (badgeText.includes("⚡")) badgeText = "ADMIN · DEV";

      const letter = clean.charAt(0).toUpperCase();
      const colors = ["9d7eff","ffbc6e","ff6e9f","5effbc","ff8c42","c492ff"];
      const col = colors[idx % colors.length];
      const avatar = `https://ui-avatars.com/api/?background=${col}&color=fff&rounded=true&size=100&name=${encodeURIComponent(letter)}&bold=true&fontsize=0.5`;
      let badgeFinal = badgeText;
      if (badgeText === "CEO") badgeFinal = "<i class='fas fa-crown'></i> CEO";
      else if (badgeText === "ADMIN · DEV") badgeFinal = "<i class='fas fa-code'></i> ADMIN · DEV";
      else if (badgeText === "ADMIN") badgeFinal = "<i class='fas fa-shield-alt'></i> ADMIN";

      return { id: idx, originalName: name, displayName: clean, firstLetter: letter, avatar, badgeFinal, badgeClass, isFigsh, isCeo };
    });

    let ceoIdx = members.findIndex(m => m.isCeo);
    if (ceoIdx > 0) { const c = members.splice(ceoIdx,1)[0]; members.unshift(c); }
    let fIdx = members.findIndex(m => m.isFigsh);
    if (fIdx > 4 || fIdx === -1) {
      if (fIdx > 4) { const f = members.splice(fIdx,1)[0]; members.splice(4,0,f); }
    }
    return members;
  }

  let allMembers = buildMembers();

  function renderCards(list) {
    const grid = document.getElementById('membersGrid');
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = '<div style="text-align:center;width:100%;padding:2rem;color:var(--muted);"><i class="fas fa-user-slash"></i> No member found 🚀</div>';
      return;
    }
    list.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'member-card' + (m.isFigsh ? ' figsh-glow' : '');
      card.style.animationDelay = `${Math.min(i * 0.04, 0.6)}s`;
      card.innerHTML = `
        <div class="badge ${m.badgeClass}">${m.badgeFinal}</div>
        <div class="avatar">
          <img src="${m.avatar}" alt="${m.displayName}" loading="lazy"
               onerror="this.src='https://ui-avatars.com/api/?background=9d7eff&color=fff&rounded=true&size=100&name=${m.firstLetter}&bold=true'">
        </div>
        <div class="member-name">${m.displayName}</div>
        <div class="member-tag"><i class="fas fa-bolt"></i> ${m.firstLetter} · BADDEST</div>
      `;
      card.addEventListener('click', () => {
        showToast(`🔥 ${m.displayName} · ${m.badgeFinal.replace(/<[^>]*>/g, '')}`);
      });
      grid.appendChild(card);
    });
  }

  function buildFilters() {
    const letters = [...new Set(allMembers.map(m => m.firstLetter))].filter(l => /[A-Z]/i.test(l)).sort();
    const bar = document.getElementById('filterBar');
    bar.innerHTML = `<button class="filter-btn active" data-l="all"><i class="fas fa-fire"></i> ALL 🔥</button>` +
      letters.map(l => `<button class="filter-btn" data-l="${l}"><i class="fas fa-filter"></i> ${l}</button>`).join('');
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const l = btn.getAttribute('data-l');
        renderCards(l === 'all' ? allMembers : allMembers.filter(m => m.firstLetter === l));
      });
    });
  }

  document.getElementById('searchInput').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const firstBtn = document.querySelector('.filter-btn');
    if (firstBtn && q === '') firstBtn.classList.add('active');
    renderCards(q ? allMembers.filter(m => m.displayName.toLowerCase().includes(q)) : allMembers);
  });

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  buildFilters();
  renderCards(allMembers);
  buildRules();
