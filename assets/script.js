// NEXAR WORLD — vanilla JS (no framework, no build step)

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion-item').forEach((item) => {
    const head = item.querySelector('.accordion-head');
    const panel = item.querySelector('.accordion-panel');
    if (!head || !panel) return;
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  const currentPage = document.body.getAttribute('data-page');
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === currentPage) link.classList.add('is-active');
  });

  const eqTabs = document.getElementById('eqTabs');
  const eqPanels = document.getElementById('eqPanels');
  if (eqTabs && eqPanels) renderEquipment(eqTabs, eqPanels);

  const packGrid = document.getElementById('packGrid');
  if (packGrid) renderShop(packGrid);

  const pickerGrid = document.getElementById('formPickerGrid');
  const wizardBox = document.getElementById('formWizard');
  if (pickerGrid && wizardBox) initFormBuilder(pickerGrid, wizardBox);
});

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => b.classList.remove('is-active'));
      tabPanels.forEach((p) => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      const panel = document.querySelector(`.tab-panel[data-tab="${target}"]`);
      if (panel) panel.classList.add('is-active');
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });
}

/* ============================================================
   EQUIPMENT — تجهیزات NEXAR (رده C/B/A + معادن)
============================================================ */
const RANK_PRICE = { C: '5,000 NEX', B: '10,000 NEX', A: '15,000 NEX' };

const EQUIPMENT = [
  {
    key: 'air', title: 'هوایی', icon: '✈️',
    ranks: {
      C: [
        { name:'CASA C-295', country:'اسپانیا', flag:'🇪🇸', desc:'هواپیمای ترابری تاکتیکی مناسب جابه‌جایی نیرو و تجهیزات.' },
        { name:'T-6C Texan II', country:'مکزیک', flag:'🇲🇽', desc:'هواپیمای آموزشی و پشتیبانی سبک.' },
        { name:'شاهد ۱۲۹ (Shahed-129)', country:'ایران', flag:'🇮🇷', desc:'پهپاد شناسایی و تهاجمی با قابلیت حمل موشک.' },
        { name:'CF-18 Hornet', country:'کانادا', flag:'🇨🇦', desc:'جنگنده چندمنظوره مناسب رهگیری و پشتیبانی هوایی.' },
      ],
      B: [
        { name:'Eurofighter Typhoon', country:'بریتانیا', flag:'🇬🇧', desc:'جنگنده چندمنظوره با قدرت مانور و رهگیری بالا.' },
        { name:'KC-390 Millennium', country:'برزیل', flag:'🇧🇷', desc:'هواپیمای ترابری و سوخت‌رسان راهبردی.' },
        { name:'Messerschmitt Me 262', country:'آلمان نازی', flag:'🇩🇪', desc:'نخستین جنگنده جت عملیاتی جهان.' },
      ],
      A: [
        { name:'F-22 Raptor', country:'آمریکا', flag:'🇺🇸', desc:'جنگنده نسل پنجم با برتری هوایی و رادارگریزی بسیار بالا.' },
        { name:'Rafale', country:'فرانسه', flag:'🇫🇷', desc:'جنگنده چندمنظوره پیشرفته برای نبردهای هوایی و زمینی.' },
        { name:'Bayraktar Kızılelma', country:'ترکیه', flag:'🇹🇷', desc:'پهپاد رزمی نسل جدید با توان انجام عملیات تهاجمی پیشرفته.' },
      ],
    }
  },
  {
    key: 'naval', title: 'دریایی', icon: '🚢',
    ranks: {
      C: [
        { name:'Kaman-class Fast Attack Craft', country:'ایران', flag:'🇮🇷', desc:'شناور تندرو مناسب عملیات ساحلی و حملات سریع.' },
        { name:'ARM Reformador (POLA-101)', country:'مکزیک', flag:'🇲🇽', desc:'ناوچه چندمنظوره برای گشت‌زنی و دفاع دریایی.' },
        { name:'Segura-class Minehunter', country:'اسپانیا', flag:'🇪🇸', desc:'مین‌روب دریایی برای پاکسازی مسیر شناورها.' },
        { name:'Kingston-class', country:'کانادا', flag:'🇨🇦', desc:'شناور گشتی و مین‌روب مناسب حفاظت از آب‌های سرزمینی.' },
      ],
      B: [
        { name:'Niterói-class Frigate', country:'برزیل', flag:'🇧🇷', desc:'ناوچه موشک‌انداز مناسب اسکورت و نبرد دریایی.' },
        { name:'Type 23 Frigate', country:'بریتانیا', flag:'🇬🇧', desc:'ناوچه ضدزیردریایی با توان دفاع دریایی بالا.' },
        { name:'Type VII U-Boat', country:'آلمان نازی', flag:'🇩🇪', desc:'زیردریایی مشهور جنگ جهانی دوم با قدرت تهاجمی بالا.' },
      ],
      A: [
        { name:'Gerald R. Ford-class Aircraft Carrier', country:'آمریکا', flag:'🇺🇸', desc:'پیشرفته‌ترین ناو هواپیمابر جهان با توان حمل ده‌ها جنگنده.' },
        { name:'Charles de Gaulle', country:'فرانسه', flag:'🇫🇷', desc:'ناو هواپیمابر هسته‌ای با قابلیت اجرای عملیات دوربرد.' },
        { name:'TCG Anadolu', country:'ترکیه', flag:'🇹🇷', desc:'ناو تهاجمی آبی‌ـ‌خاکی و حامل پهپادهای رزمی.' },
      ],
    }
  },
  {
    key: 'ground', title: 'زمینی', icon: '🪖',
    ranks: {
      C: [
        { name:'Boragh APC', country:'ایران', flag:'🇮🇷', desc:'نفربر زرهی مناسب انتقال نیرو و پشتیبانی میدان نبرد.' },
        { name:'SandCat', country:'مکزیک', flag:'🇲🇽', desc:'خودروی زرهی سبک مناسب عملیات شهری و ضدتروریسم.' },
        { name:'BMR-600', country:'اسپانیا', flag:'🇪🇸', desc:'خودروی زرهی چندمنظوره برای عملیات تاکتیکی.' },
        { name:'VBTP-MR Guarani', country:'برزیل', flag:'🇧🇷', desc:'خودروی زرهی چرخی برای انتقال نیرو و پشتیبانی رزمی.' },
      ],
      B: [
        { name:'LAV III', country:'کانادا', flag:'🇨🇦', desc:'خودروی رزمی چرخی با قدرت مانور و حفاظت بالا.' },
        { name:'Challenger 2', country:'بریتانیا', flag:'🇬🇧', desc:'تانک سنگین با زره مقاوم و قدرت آتش بالا.' },
        { name:'Altay', country:'ترکیه', flag:'🇹🇷', desc:'تانک اصلی میدان نبرد ترکیه با فناوری‌های مدرن.' },
      ],
      A: [
        { name:'Leopard 2A8', country:'آلمان', flag:'🇩🇪', desc:'یکی از قدرتمندترین تانک‌های جهان با سامانه‌های پیشرفته دفاعی و تهاجمی.' },
        { name:'M1A2 Abrams SEP V3', country:'آمریکا', flag:'🇺🇸', desc:'تانک فوق‌سنگین با قدرت آتش و حفاظت بسیار بالا.' },
        { name:'Leclerc XLR', country:'فرانسه', flag:'🇫🇷', desc:'تانک پیشرفته فرانسوی با تحرک، دقت و قدرت آتش فوق‌العاده.' },
      ],
    }
  },
  {
    key: 'missile', title: 'موشکی', icon: '🚀',
    ranks: {
      C: [
        { name:'Fateh-110', country:'ایران', flag:'🇮🇷', desc:'موشک بالستیک کوتاه‌برد با دقت مناسب برای حملات تاکتیکی.' },
        { name:'MGM-140 ATACMS', country:'آمریکا', flag:'🇺🇸', desc:'موشک تاکتیکی زمین‌به‌زمین برای انهدام اهداف مهم.' },
        { name:'SSM-80 (Programa FASGW)', country:'اسپانیا', flag:'🇪🇸', desc:'موشک تاکتیکی مناسب پشتیبانی عملیات زمینی.' },
        { name:'CRV7 Rocket System', country:'کانادا', flag:'🇨🇦', desc:'راکت هدایت‌شونده مناسب انهدام خودروها و مواضع سبک.' },
      ],
      B: [
        { name:'Storm Shadow', country:'بریتانیا', flag:'🇬🇧', desc:'موشک کروز دوربرد با دقت بسیار بالا برای انهدام اهداف راهبردی.' },
        { name:'MANSUP', country:'برزیل', flag:'🇧🇷', desc:'موشک ضدکشتی میان‌برد با قدرت تخریب بالا.' },
        { name:'V-2 Rocket', country:'آلمان نازی', flag:'🇩🇪', desc:'نخستین موشک بالستیک دوربرد جهان.' },
      ],
      A: [
        { name:'LGM-30 Minuteman III', country:'آمریکا', flag:'🇺🇸', desc:'موشک بالستیک قاره‌پیما با توان حمل کلاهک هسته‌ای.' },
        { name:'M51 SLBM', country:'فرانسه', flag:'🇫🇷', desc:'موشک بالستیک راهبردی شلیک‌شونده از زیردریایی.' },
        { name:'TAYFUN', country:'ترکیه', flag:'🇹🇷', desc:'موشک بالستیک بردبلند با قدرت تخریب بسیار بالا.' },
      ],
    }
  },
  {
    key: 'defense', title: 'پدافندی', icon: '🛡️',
    ranks: {
      C: [
        { name:'Rapier', country:'بریتانیا', flag:'🇬🇧', desc:'سامانه پدافند کوتاه‌برد برای مقابله با هواگردها و موشک‌های کروز.' },
        { name:'MIM-23 Hawk', country:'آمریکا', flag:'🇺🇸', desc:'سامانه پدافند میان‌برد برای دفاع از مراکز حساس.' },
        { name:'Skyguard Aspide', country:'اسپانیا', flag:'🇪🇸', desc:'سامانه دفاع هوایی مناسب مقابله با اهداف ارتفاع پایین.' },
        { name:'Mersad', country:'ایران', flag:'🇮🇷', desc:'سامانه پدافند میان‌برد بومی برای رهگیری اهداف هوایی.' },
      ],
      B: [
        { name:'NASAMS', country:'کانادا', flag:'🇨🇦', desc:'سامانه پدافند میان‌برد با دقت بالا علیه هواپیما و موشک‌های کروز.' },
        { name:'RBS 70 NG', country:'برزیل', flag:'🇧🇷', desc:'سامانه پدافند کوتاه‌برد با هدایت لیزری.' },
        { name:'Flak 88', country:'آلمان نازی', flag:'🇩🇪', desc:'توپ ضدهوایی مشهور با توان مقابله با هواپیما و زرهی.' },
      ],
      A: [
        { name:'Patriot PAC-3', country:'آمریکا', flag:'🇺🇸', desc:'یکی از قدرتمندترین سامانه‌های دفاع موشکی جهان، مناسب رهگیری موشک‌های بالستیک.' },
        { name:'SAMP/T NG', country:'فرانسه', flag:'🇫🇷', desc:'سامانه پدافند دوربرد برای مقابله با جنگنده‌ها و موشک‌های بالستیک.' },
        { name:'SİPER', country:'ترکیه', flag:'🇹🇷', desc:'پیشرفته‌ترین سامانه پدافند دوربرد ترکیه برای دفاع از حریم هوایی.' },
      ],
    }
  },
  {
    key: 'cyber', title: 'سایبری', icon: '💻',
    ranks: {
      C: [
        { name:'Cyber Security Suite', country:'کانادا', flag:'🇨🇦', desc:'سامانه دفاع سایبری مناسب محافظت از زیرساخت‌ها در برابر حملات معمولی.' },
        { name:'CCN-CERT Platform', country:'اسپانیا', flag:'🇪🇸', desc:'سامانه ملی تشخیص و مقابله با نفوذهای سایبری.' },
        { name:'APT Defense System', country:'ایران', flag:'🇮🇷', desc:'سامانه دفاع و پایش حملات سایبری در سطح متوسط.' },
        { name:'Windows Defender ATP', country:'آمریکا', flag:'🇺🇸', desc:'سامانه شناسایی بدافزار و جلوگیری از نفوذ به شبکه.' },
      ],
      B: [
        { name:'NCSC Cyber Shield', country:'بریتانیا', flag:'🇬🇧', desc:'سامانه دفاع ملی برای مقابله با حملات پیشرفته سایبری.' },
        { name:'SisGAAz', country:'برزیل', flag:'🇧🇷', desc:'سامانه نظارت و کنترل امنیت سایبری و زیرساخت‌های حیاتی.' },
        { name:'Enigma', country:'آلمان نازی', flag:'🇩🇪', desc:'سامانه رمزنگاری تاریخی با امنیت بسیار بالا در زمان خود.' },
      ],
      A: [
        { name:'XKeyscore', country:'آمریکا', flag:'🇺🇸', desc:'سامانه فوق‌پیشرفته جمع‌آوری اطلاعات و رصد ارتباطات جهانی.' },
        { name:'DGSE Cyber Warfare', country:'فرانسه', flag:'🇫🇷', desc:'سامانه عملیات تهاجمی و دفاعی سایبری برای نفوذ به زیرساخت‌های دشمن.' },
        { name:'AVCI Cyber Defense', country:'ترکیه', flag:'🇹🇷', desc:'سامانه پیشرفته دفاع و عملیات سایبری برای مقابله با حملات گسترده.' },
      ],
    }
  },
];

const MINES = [
  { name:'معدن ۱', desc:'استخراج سنگ و مواد اولیه ساختمانی.', income:'2,000 NEX', price:'5,000 NEX' },
  { name:'معدن ۲', desc:'استخراج سنگ‌آهن.', income:'3,000 NEX', price:'6,000 NEX' },
  { name:'معدن ۳', desc:'استخراج زغال‌سنگ.', income:'4,000 NEX', price:'7,000 NEX' },
  { name:'معدن ۴', desc:'استخراج مس.', income:'5,000 NEX', price:'8,000 NEX' },
  { name:'معدن ۵', desc:'استخراج آلومینیوم.', income:'6,000 NEX', price:'9,000 NEX' },
  { name:'معدن ۶', desc:'استخراج طلا.', income:'7,500 NEX', price:'10,000 NEX' },
  { name:'معدن ۷', desc:'استخراج اورانیوم.', income:'9,000 NEX', price:'12,000 NEX' },
  { name:'معدن ۸', desc:'استخراج تیتانیوم.', income:'11,000 NEX', price:'14,000 NEX' },
  { name:'معدن ۹', desc:'استخراج عناصر کمیاب.', income:'13,500 NEX', price:'16,000 NEX' },
  { name:'معدن ۱۰', desc:'استخراج منابع استراتژیک فوق‌کمیاب.', income:'16,000 NEX', price:'18,000 NEX' },
];

function renderEquipment(tabsEl, panelsEl) {
  const cats = [...EQUIPMENT, { key:'mines', title:'معادن', icon:'🏭' }];

  tabsEl.innerHTML = cats.map((cat, i) => `
    <button class="tab-btn ${i === 0 ? 'is-active' : ''}" data-tab="${cat.key}">${cat.icon} ${cat.title}</button>
  `).join('');

  const rankCardHtml = (rank, it) => `
    <div class="item-card">
      <div class="item-head">
        <span class="rank-badge rank-${rank.toLowerCase()}">${rank}</span>
        <span class="item-names">
          <b>${it.name}</b>
          <span>${[it.flag, it.country].filter(Boolean).join(' · ')}</span>
        </span>
      </div>
      <div class="item-block-label">کارایی</div>
      <p class="eq-desc">${it.desc}</p>
      <div class="rank-price"><span>💰 قیمت رده ${rank}</span><b>${RANK_PRICE[rank]}</b></div>
    </div>
  `;

  const mineCardHtml = (m) => `
    <div class="item-card">
      <div class="item-head">
        <span class="item-emoji">⛏</span>
        <span class="item-names"><b>${m.name}</b></span>
      </div>
      <div class="item-block-label">کارایی</div>
      <p class="eq-desc">${m.desc}</p>
      <div class="output-line">📈 درآمد: +${m.income}</div>
      <div class="output-line">💰 قیمت: ${m.price}</div>
    </div>
  `;

  panelsEl.innerHTML = cats.map((cat, i) => `
    <div class="tab-panel ${i === 0 ? 'is-active' : ''}" data-tab="${cat.key}">
      ${cat.key === 'mines'
        ? `<div class="item-grid">${MINES.map(mineCardHtml).join('')}</div>`
        : `
          <div class="item-block-label">🅰 رده A · ${RANK_PRICE.A}</div>
          <div class="item-grid">${cat.ranks.A.map((it) => rankCardHtml('A', it)).join('')}</div>
          <div class="item-block-label" style="margin-top:22px;">🅱 رده B · ${RANK_PRICE.B}</div>
          <div class="item-grid">${cat.ranks.B.map((it) => rankCardHtml('B', it)).join('')}</div>
          <div class="item-block-label" style="margin-top:22px;">🅲 رده C · ${RANK_PRICE.C}</div>
          <div class="item-grid">${cat.ranks.C.map((it) => rankCardHtml('C', it)).join('')}</div>
        `
      }
    </div>
  `).join('');

  initTabs();
}

/* ============================================================
   SHOP — پک‌های ویژه NEXAR
============================================================ */
const PACKS = [
  {
    tier: 'gold', icon: '🏆', title: 'پک طلایی', sub: 'ویژه فرماندهانی که به دنبال برتری مطلق در میدان نبرد هستند.',
    items: [
      ['✈️ ۱۰ فروند F-22 Raptor', 'برتری هوایی نسل پنجم و رادارگریزی فوق‌پیشرفته.'],
      ['✈️ ۸ فروند B-2 Spirit', 'بمب‌افکن استراتژیک با قابلیت نفوذ به پیشرفته‌ترین سامانه‌های دفاعی.'],
      ['✈️ ۸ فروند SR-71 Blackbird', 'هواپیمای شناسایی فوق‌سریع و دوربرد.'],
      ['🚀 ۱۰ فروند Minuteman III', 'موشک بالستیک قاره‌پیما با قدرت تخریب راهبردی.'],
      ['🚀 ۱۰ فروند Trident II D5', 'موشک بالستیک فوق‌پیشرفته با دقت بسیار بالا.'],
      ['🚀 ۱۵ فروند AGM-158 JASSM', 'موشک کروز رادارگریز مناسب انهدام اهداف حیاتی.'],
    ],
    budget: '20,000 NEX بودجه ویژه',
    price: ['🪙 800 سکه روبیکا', '💵 80 هزار تومان', '🪙 998 سکه بله'],
    note: 'تجهیزات این پک در فروشگاه عادی موجود نیستند و بدون نیاز به اجازه کشور سازنده قابل استفاده‌اند؛ مناسب فرماندهانی که به دنبال برتری مطلق در نبردهای NEXAR هستند.',
  },
  {
    tier: 'silver', icon: '🥈', title: 'پک نقره', sub: 'ویژه فرماندهانی که امنیت کشور را بر هر چیز دیگری ترجیح می‌دهند.',
    items: [
      ['🛡️ ۱۰ سامانه Patriot PAC-3', 'رهگیری موشک‌های بالستیک، کروز و اهداف هوایی پیشرفته.'],
      ['🛡️ ۱۰ سامانه SAMP/T NG', 'دفاع هوایی دوربرد با دقت بسیار بالا.'],
      ['🛡️ ۱۰ سامانه SİPER', 'پدافند دوربرد مناسب دفاع از مراکز راهبردی.'],
      ['💻 ۱۵ واحد XKeyscore', 'سامانه فوق‌پیشرفته جمع‌آوری اطلاعات و رصد ارتباطات.'],
      ['💻 ۱۵ واحد DGSE Cyber Warfare', 'اجرای عملیات تهاجمی و دفاعی سایبری.'],
      ['💻 ۱۵ واحد AVCI Cyber Defense', 'سامانه دفاع سایبری پیشرفته برای مقابله با حملات گسترده.'],
    ],
    budget: '20,000 NEX بودجه ویژه',
    price: ['🪙 600 سکه روبیکا', '💵 60 هزار تومان', '🪙 800 سکه بله'],
    note: 'مناسب فرماندهانی که به دنبال ایجاد یک سپر دفاعی قدرتمند و برتری سایبری هستند.',
  },
  {
    tier: 'bronze', icon: '🥉', title: 'پک برنز', sub: 'ویژه فرماندهانی که به دنبال تقویت همزمان نیروی زمینی و دریایی خود هستند.',
    items: [
      ['🪖 ۱۰ دستگاه M1A2 Abrams SEP V3', 'تانک پیشرفته با زره فوق‌مقاوم و قدرت آتش بالا.'],
      ['🪖 ۱۰ دستگاه Leopard 2A8', 'یکی از قدرتمندترین تانک‌های عملیاتی جهان.'],
      ['🪖 ۱۰ دستگاه Leclerc XLR', 'تانک نسل جدید با سرعت بالا و کنترل آتش پیشرفته.'],
      ['🚢 ۵ فروند Gerald R. Ford-class', 'ناو هواپیمابر فوق‌سنگین با ظرفیت عملیاتی بسیار بالا.'],
      ['🚢 ۱۰ فروند Arleigh Burke-class Destroyer', 'ناوشکن چندمنظوره مجهز به سامانه‌های پیشرفته.'],
      ['🚢 ۱۵ فروند FREMM Frigate', 'ناوچه مدرن مناسب نبردهای دریایی و دفاع از ناوگان.'],
      ['⚓ ۱۰ سامانه Aegis Combat System', 'رهگیری موشک‌ها و اهداف هوایی.'],
    ],
    budget: '20,000 NEX بودجه ویژه',
    price: ['🪙 400 سکه روبیکا', '💵 40 هزار تومان', '🪙 500 سکه بله'],
    note: 'مناسب فرماندهانی که به دنبال ایجاد یک نیروی زمینی و دریایی مدرن و قدرتمند هستند.',
  },
  {
    tier: 'ground', icon: '🪖', title: 'پک زمینی', sub: 'ویژه فرماندهانی که به دنبال ساخت یک نیروی زمینی مدرن و قدرتمند هستند.',
    items: [
      ['🪖 ۱۰ دستگاه M1A2 Abrams SEP V3', 'زره و کنترل آتش فوق‌پیشرفته.'],
      ['🪖 ۱۰ دستگاه Leopard 2A8', 'تحرک و دقت بسیار بالا.'],
      ['🪖 ۱۰ دستگاه Leclerc XLR', 'سرعت بالا و سیستم کنترل آتش پیشرفته.'],
      ['🪖 ۱۰ دستگاه Challenger 3', 'زره بسیار مقاوم و قدرت نفوذ فوق‌العاده.'],
      ['🚁 ۱۰ فروند AH-64E Apache Guardian', 'پشتیبانی پیشرفته نیروهای زمینی.'],
      ['🚁 ۱۰ فروند T129 ATAK', 'عملیات ضدزره و پشتیبانی نزدیک.'],
      ['🛸 ۲۰ فروند Bayraktar Akıncı', 'پهپاد رزمی سنگین با توان اجرای حملات دقیق.'],
    ],
    budget: '20,000 NEX بودجه ویژه',
    price: ['🪙 400 سکه روبیکا', '💵 40 هزار تومان', '🪙 500 سکه بله'],
    note: 'مناسب فرماندهانی که به دنبال برتری مطلق در نبردهای زمینی هستند.',
  },
  {
    tier: 'naval', icon: '⚓', title: 'پک دریایی', sub: 'ویژه فرماندهانی که به دنبال تسلط کامل بر آب‌های آزاد و نبردهای دریایی هستند.',
    items: [
      ['🚢 ۵ فروند Gerald R. Ford-class', 'ناو هواپیمابر فوق‌سنگین.'],
      ['🚢 ۱۰ فروند Arleigh Burke-class Destroyer', 'سامانه‌های دفاعی و تهاجمی پیشرفته.'],
      ['🚢 ۱۰ فروند Zumwalt-class Destroyer', 'ناوشکن رادارگریز با فناوری نسل جدید.'],
      ['🚢 ۱۵ فروند FREMM Frigate', 'دفاع از ناوگان و نبردهای دریایی.'],
      ['⚓ ۱۰ سامانه Aegis Combat System', 'رهگیری موشک‌ها و اهداف هوایی.'],
      ['🚁 ۱۰ فروند MH-60R Seahawk', 'نبرد ضدزیردریایی و شناسایی.'],
      ['🛸 ۲۰ فروند MQ-8C Fire Scout', 'شناسایی و پشتیبانی عملیات دریایی.'],
    ],
    budget: '20,000 NEX بودجه ویژه',
    price: ['🪙 400 سکه روبیکا', '💵 40 هزار تومان', '🪙 500 سکه بله'],
    note: 'مناسب فرماندهانی که به دنبال برتری مطلق در نبردهای دریایی هستند.',
  },
  {
    tier: 'cyber', icon: '💻', title: 'پک حمله و دفاع سایبری', sub: 'ویژه فرماندهانی که به دنبال تسلط کامل بر جنگ سایبری هستند.',
    items: [
      ['💻 ۲۰ واحد XKeyscore', 'جمع‌آوری اطلاعات و رصد ارتباطات.'],
      ['💻 ۲۰ واحد DGSE Cyber Warfare', 'نفوذ به زیرساخت‌های دشمن.'],
      ['💻 ۲۰ واحد AVCI Cyber Defense', 'دفاع پیشرفته در برابر حملات گسترده.'],
      ['💻 ۲۰ واحد NSA Cyber Operations', 'نفوذ، رهگیری و جنگ سایبری راهبردی.'],
      ['💻 ۲۰ واحد Sentinel SIEM', 'شناسایی و خنثی‌سازی حملات در لحظه.'],
      ['💻 ۲۰ واحد Threat Intelligence Center', 'تحلیل تهدیدات و کشف آسیب‌پذیری‌ها.'],
      ['🤖 ۱۰ سیستم هوش مصنوعی نظامی سایبری', 'مدیریت خودکار دفاع و ضدحمله.'],
    ],
    budget: '20,000 NEX بودجه ویژه',
    price: ['🪙 400 سکه روبیکا', '💵 40 هزار تومان', '🪙 500 سکه بله'],
    note: 'مناسب فرماندهانی که به دنبال برتری مطلق در جنگ سایبری هستند.',
  },
  {
    tier: 'missile', icon: '🚀', title: 'پک موشکی', sub: 'ویژه فرماندهانی که به دنبال قدرت تخریب و حملات راهبردی هستند.',
    items: [
      ['🚀 ۱۰ فروند Minuteman III', 'برد بسیار بلند و قدرت تخریب راهبردی.'],
      ['🚀 ۱۰ فروند Trident II D5', 'دقت بسیار بالا.'],
      ['🚀 ۱۵ فروند AGM-158 JASSM', 'رادارگریز، مناسب انهدام اهداف حیاتی.'],
      ['🚀 ۱۵ فروند Storm Shadow', 'موشک کروز دوربرد با دقت بسیار بالا.'],
      ['🚀 ۱۰ فروند Tomahawk Block V', 'مناسب حملات راهبردی.'],
      ['🚀 ۱۰ فروند Taurus KEPD 350', 'نفوذ به اهداف مستحکم.'],
      ['🚀 ۱۰ فروند ATACMS', 'موشک تاکتیکی زمین‌به‌زمین با دقت بالا.'],
    ],
    budget: '20,000 NEX بودجه ویژه',
    price: ['🪙 400 سکه روبیکا', '💵 40 هزار تومان', '🪙 500 سکه بله'],
    note: 'مناسب فرماندهانی که به دنبال اجرای حملات دقیق و راهبردی هستند.',
  },
  {
    tier: 'defense', icon: '🛡️', title: 'پک پدافند', sub: 'ویژه فرماندهانی که به دنبال ساخت نفوذناپذیرترین سپر دفاعی هستند.',
    items: [
      ['🛡️ ۱۰ سامانه Patriot PAC-3', 'دقت بسیار بالا در رهگیری.'],
      ['🛡️ ۱۰ سامانه THAAD', 'رهگیری در ارتفاع بالا و خارج از جو.'],
      ['🛡️ ۱۰ سامانه S-500 Prometey', 'رهگیری جنگنده نسل ۵ و اهداف فضایی.'],
      ['🛡️ ۱۰ سامانه Aster SAMP/T NG', 'پدافند دوربرد با پوشش گسترده.'],
      ['🛡️ ۱۰ سامانه Iron Dome', 'انهدام راکت و موشک کوتاه‌برد.'],
      ["🛡️ ۱۰ سامانه David's Sling", 'دفاع در برابر موشک میان‌برد و کروز.'],
      ['🛡️ ۱۰ سامانه Aegis Ashore', 'سپر دفاع موشکی راهبردی دوربرد.'],
    ],
    budget: '20,000 NEX بودجه ویژه',
    price: ['🪙 400 سکه روبیکا', '💵 40 هزار تومان', '🪙 500 سکه بله'],
    note: 'مناسب فرماندهانی که به دنبال ایجاد یک سپر دفاعی تقریباً نفوذناپذیر هستند.',
  },
  {
    tier: 'air', icon: '✈️', title: 'پک هوایی', sub: 'ویژه فرماندهانی که به دنبال تسلط کامل بر آسمان هستند.',
    items: [
      ['✈️ ۱۰ فروند F-22 Raptor', 'برتری مطلق هوایی و رادارگریزی پیشرفته.'],
      ['✈️ ۱۰ فروند F-35 Lightning II', 'مأموریت‌های هوایی، زمینی و شناسایی.'],
      ['💣 ۸ فروند B-2 Spirit', 'نفوذ به پیشرفته‌ترین سامانه‌های دفاعی.'],
      ['💣 ۸ فروند B-52 Stratofortress', 'ظرفیت حمل حجم عظیمی از تسلیحات.'],
      ['💣 ۸ فروند B-1B Lancer', 'مافوق‌صوت با قدرت حمله سنگین.'],
      ['✈️ ۱۰ فروند Rafale F4', 'درگیری هوایی و حملات دقیق.'],
      ['✈️ ۱۰ فروند Eurofighter Typhoon', 'مانورپذیری و قدرت آتش بسیار بالا.'],
      ['🚁 ۱۰ فروند AH-64E Apache Guardian', 'پشتیبانی نزدیک و انهدام اهداف زرهی.'],
      ['🛸 ۲۰ فروند MQ-9 Reaper', 'مداومت پروازی بالا و حمل مهمات هدایت‌شونده.'],
    ],
    budget: '20,000 NEX بودجه ویژه',
    price: ['🪙 400 سکه روبیکا', '💵 40 هزار تومان', '🪙 500 سکه بله'],
    note: 'مناسب فرماندهانی که به دنبال برتری مطلق در نبردهای هوایی هستند.',
  },
];

function renderShop(packGrid) {
  packGrid.innerHTML = PACKS.map((p) => `
    <div class="pack-card tier-${p.tier}">
      <div class="pack-head"><span class="p-ic">${p.icon}</span><span class="p-title">NEXAR • ${p.title}</span></div>
      <p class="pack-sub">${p.sub}</p>
      <div class="pack-items">
        ${p.items.map(([name, desc]) => `<div class="pack-item"><b>${name}</b><span>${desc}</span></div>`).join('')}
        <div class="pack-item"><b>💰 ${p.budget}</b></div>
      </div>
      <div class="pack-price-row">
        ${p.price.map((tag) => `<span class="pack-price-tag">${tag}</span>`).join('')}
      </div>
      <p class="pack-note">⭐ تجهیزات این پک در فروشگاه عادی موجود نیستند و بدون نیاز به اجازه کشور سازنده قابل استفاده‌اند. ${p.note}</p>
    </div>
  `).join('');
}

/* ============================================================
   FORM DEFINITIONS — فرم و تگ کشورها NEXAR
============================================================ */
const MGMT_ID = 'https://rubika.ir/Esi_Shz0';

const NEXAR_FORMS = [
  {
    key: 'procurement', icon: '⚜️', title: 'خرید تجهیزات', sub: 'Defense Procurement — سفارش رسمی تجهیزات',
    fields: [
      { key:'country', label:'🏴 کشور', type:'text' },
      { key:'buyer', label:'🎖 مسئول خرید', type:'text' },
      { key:'air_branch', label:'🚁 شاخه هوایی', type:'text', optional:true },
      { key:'defense_branch', label:'🛡 شاخه پدافندی', type:'text', optional:true },
      { key:'ground_branch', label:'🚛 شاخه زمینی', type:'text', optional:true },
      { key:'naval_branch', label:'🚢 شاخه دریایی', type:'text', optional:true },
      { key:'cyber_branch', label:'💻 شاخه سایبری', type:'text', optional:true },
      { key:'economic_branch', label:'🏭 شاخه اقتصادی', type:'text', optional:true },
      { key:'order_qty', label:'📦 تعداد سفارش', type:'number' },
      { key:'unit_price', label:'💲 قیمت هر واحد', type:'text' },
      { key:'total_value', label:'💰 ارزش کل قرارداد', type:'text' },
      { key:'budget_before', label:'💵 بودجه پیش از خرید', type:'text' },
      { key:'budget_after', label:'💸 بودجه باقی‌مانده', type:'text' },
      { key:'investment_income', label:'📈 درآمد حاصل از سرمایه‌گذاری', type:'text', optional:true },
      { key:'final_income', label:'📊 درآمد نهایی کشور', type:'text', optional:true },
    ],
    compile: (v) => `╔══════ 『 ⚜️ 𝐍𝐄𝐗𝐀𝐑 • DEFENSE PROCUREMENT ⚜️ 』 ══════╗

║ 🏴 کشور : ${v.country}
║ 🎖 مسئول خرید : ${v.buyer}

╠════════════ 『 📑 سفارش تجهیزات 』 ════════════╣

║ 🚁 شاخه هوایی : ${v.air_branch || '—'}
║ 🛡 شاخه پدافندی : ${v.defense_branch || '—'}
║ 🚛 شاخه زمینی : ${v.ground_branch || '—'}
║ 🚢 شاخه دریایی : ${v.naval_branch || '—'}
║ 💻 شاخه سایبری : ${v.cyber_branch || '—'}
║ 🏭 شاخه اقتصادی : ${v.economic_branch || '—'}

║ 📦 تعداد سفارش : ${v.order_qty}

║ 💲 قیمت هر واحد : ${v.unit_price}

║ 💰 ارزش کل قرارداد : ${v.total_value}

╠════════════ 『 🏦 گزارش خزانه‌داری 』 ═══════════╣

║ 💵 بودجه پیش از خرید : ${v.budget_before}

║ 💸 بودجه باقی‌مانده : ${v.budget_after}

║ 📈 درآمد حاصل از سرمایه‌گذاری : ${v.investment_income || '—'}

║ 📊 درآمد نهایی کشور : ${v.final_income || '—'}

╠═══════════════════════════════════════════════╣

║ 🔖 Military Procurement Document
║ 🔖 #خرید_تجهیزات

║ 🌐 JOIN ➤ @NEXAR_War

╚═══════════════════════════════════════════════╝`,
  },
  {
    key: 'transport', icon: '🚚', title: 'اعزام ترابری', sub: 'Transport Order — ثبت رسمی محموله',
    fields: [
      { key:'sender_country', label:'🏴 کشور فرستنده', type:'text' },
      { key:'sender_rep', label:'📣 نماینده رسمی (فرستنده)', type:'text' },
      { key:'destination', label:'🎯 مقصد', type:'text' },
      { key:'dest_country', label:'🏴 کشور مقصد', type:'text' },
      { key:'dest_rep', label:'📣 نماینده رسمی (مقصد)', type:'text' },
      { key:'route', label:'🛣 مسیر انتقال', type:'choice', options:['✈️ هوایی', '🚛 زمینی', '🚢 دریایی', '💳 آنلاین و بانکی'] },
      { key:'escort', label:'🛡 اسکورت', type:'text', optional:true },
      { key:'send_time', label:'🕒 ساعت ارسال', type:'text' },
      { key:'arrive_time', label:'🕓 ساعت رسیدن', type:'text' },
    ],
    compile: (v) => `╔═══════ 『 🚚 𝐍𝐄𝐗𝐀𝐑 • TRANSPORT ORDER 🚚 』 ═══════╗

║ 🏴 کشور فرستنده : ${v.sender_country}
║ 📣 نماینده رسمی : ${v.sender_rep}

╠═══════════ 『 📦 اطلاعات ترابری 』 ═══════════╣

║ 🎯 مقصد : ${v.destination}
║ 🏴 کشور مقصد : ${v.dest_country}
║ 📣 نماینده رسمی : ${v.dest_rep}

║ 🛣 مسیر انتقال : ${v.route}

║ 🛡 اسکورت : ${v.escort || '—'}

╠═══════════ 『 ⏰ زمان‌بندی عملیات 』 ═══════════╣

║ 🕒 ساعت ارسال : ${v.send_time}
║ 🕓 ساعت رسیدن : ${v.arrive_time}

╠═══════════ 『 ⚠️ هشدار امنیتی 』 ═══════════╣

║ در طول مسیر، سایر کشورها مجاز به رهگیری،
║ حمله یا خرابکاری علیه محموله هستند.
║ در صورت موفقیت عملیات رهگیری، محموله
║ ممکن است توقیف، غارت یا منهدم شود.

╠═══════════════════════════════════════════════╣

║ 🔻 Official Transport Document
║ 🔻 #ترابری

║ 🌐 JOIN ➤ @NEXAR_War

╚═══════════════════════════════════════════════╝`,
  },
  {
    key: 'complaint', icon: '⚖️', title: 'ثبت شکایت', sub: 'Complaint Report — طرح شکایت رسمی',
    fields: [
      { key:'plaintiff_country', label:'🏴 کشور شاکی', type:'text' },
      { key:'plaintiff_rep', label:'📣 نماینده رسمی (شاکی)', type:'text' },
      { key:'defendant_country', label:'🎯 کشور متهم', type:'text' },
      { key:'defendant_rep', label:'📣 نماینده رسمی (متهم)', type:'text' },
      { key:'subject', label:'📑 موضوع شکایت', type:'text' },
      { key:'description', label:'📜 شرح شکایت', type:'textarea' },
      { key:'evidence_images', label:'📷 تصاویر', type:'text', optional:true },
      { key:'evidence_video', label:'🎥 ویدیو', type:'text', optional:true },
      { key:'evidence_docs', label:'📄 اسناد', type:'text', optional:true },
      { key:'evidence_links', label:'🔗 لینک مدارک', type:'text', optional:true },
      { key:'request', label:'⚖️ درخواست شاکی', type:'choice-multi', options:['💰 غرامت', '🚫 تحریم', '⚔️ مجوز اقدام نظامی', '📢 اخطار رسمی', '🏛 بررسی توسط مدیریت'] },
    ],
    compile: (v) => `╔═══════ 『 ⚖️ 𝐍𝐄𝐗𝐀𝐑 • COMPLAINT REPORT ⚖️ 』 ═══════╗

║ 🏴 کشور شاکی : ${v.plaintiff_country}
║ 📣 نماینده رسمی : ${v.plaintiff_rep}

╠═══════════ 『 📋 اطلاعات شکایت 』 ═══════════╣

║ 🎯 کشور متهم : ${v.defendant_country}
║ 📣 نماینده رسمی : ${v.defendant_rep}

║ 📑 موضوع شکایت : ${v.subject}

║ 📜 شرح شکایت :
${v.description}

╠═══════════ 『 📎 مستندات و شواهد 』 ═══════════╣

║ 📷 تصاویر : ${v.evidence_images || '—'}
║ 🎥 ویدیو : ${v.evidence_video || '—'}
║ 📄 اسناد : ${v.evidence_docs || '—'}
║ 🔗 لینک مدارک : ${v.evidence_links || '—'}

╠═══════════ 『 ⚖️ درخواست شاکی 』 ═══════════╣

║ ${v.request}

╠═══════════════════════════════════════════════╣

║ 🔻 Official Complaint Record
║ 🔻 #شکایت

║ 🌐 JOIN ➤ @NEXAR_War

╚═══════════════════════════════════════════════╝`,
  },
  {
    key: 'military_op', icon: '⚔️', title: 'عملیات نظامی', sub: 'Military Operation — ثبت رسمی یک حمله',
    fields: [
      { key:'attacker_country', label:'🏴 کشور مهاجم', type:'text' },
      { key:'commander', label:'👑 فرمانده عملیات', type:'text' },
      { key:'target_country', label:'🏴 کشور هدف', type:'text' },
      { key:'target_area', label:'📍 منطقه هدف', type:'text' },
      { key:'ground_force', label:'🚛 نیروی زمینی', type:'text', optional:true },
      { key:'air_force', label:'✈️ نیروی هوایی', type:'text', optional:true },
      { key:'naval_force', label:'🚢 نیروی دریایی', type:'text', optional:true },
      { key:'cyber_force', label:'💻 نیروی سایبری', type:'text', optional:true },
      { key:'description', label:'📋 شرح عملیات', type:'textarea' },
      { key:'start_time', label:'🕒 زمان آغاز', type:'text' },
      { key:'end_time', label:'🕓 زمان پایان', type:'text' },
    ],
    compile: (v) => `╔═══════ 『 ⚔️ 𝐍𝐄𝐗𝐀𝐑 • MILITARY OPERATION ⚔️ 』 ═══════╗

║ 🏴 کشور مهاجم : ${v.attacker_country}
║ 👑 فرمانده عملیات : ${v.commander}

╠══════════ 『 🎯 هدف عملیات 』 ══════════╣

║ 🏴 کشور هدف : ${v.target_country}
║ 📍 منطقه هدف : ${v.target_area}

╠══════════ 『 ⚔️ اطلاعات حمله 』 ══════════╣

║ 🚛 نیروی زمینی : ${v.ground_force || '—'}

║ ✈️ نیروی هوایی : ${v.air_force || '—'}

║ 🚢 نیروی دریایی : ${v.naval_force || '—'}

║ 💻 نیروی سایبری : ${v.cyber_force || '—'}

╠══════════ 『 📋 شرح عملیات 』 ══════════╣

${v.description}

╠══════════ 『 ⏰ زمان‌بندی 』 ══════════╣

║ 🕒 زمان آغاز : ${v.start_time}
║ 🕓 زمان پایان : ${v.end_time}

╠══════════ 『 ⚠️ وضعیت جنگی 』 ══════════╣

║ این عملیات به صورت رسمی ثبت شده و
║ کشور هدف مجاز به دفاع، ضدحمله
║ یا درخواست کمک از متحدان خود می‌باشد.

╠══════════════════════════════════════╣

║ 🔻 Official Military Operation
║ 🔻 #حمله

║ 🌐 JOIN ➤ @NEXAR_War

╚══════════════════════════════════════╝`,
  },
  {
    key: 'covert_op', icon: '🕵️', title: 'عملیات ویژه', sub: 'Covert Operation — عملیات مخفی',
    fields: [
      { key:'executor_country', label:'🏴 کشور مجری', type:'text' },
      { key:'op_officer', label:'👑 مسئول عملیات', type:'text' },
      { key:'target_country', label:'🏴 کشور هدف', type:'text' },
      { key:'target_entity', label:'👤 شخص / نهاد هدف', type:'text' },
      { key:'op_type', label:'⚡ نوع عملیات', type:'choice', options:['💰 اقتصادی', '🎖 نظامی', '🏛 سیاسی'] },
      { key:'description', label:'📋 شرح عملیات', type:'textarea' },
      { key:'agents', label:'🕶 مأموران', type:'text', optional:true },
      { key:'cyber_support', label:'💻 پشتیبانی سایبری', type:'text', optional:true },
      { key:'special_equip', label:'🎯 تجهیزات ویژه', type:'text', optional:true },
      { key:'start_time', label:'🕒 زمان آغاز', type:'text' },
      { key:'end_time', label:'🕓 زمان پایان', type:'text' },
    ],
    compile: (v) => `╔═══════ 『 🕵️ 𝐍𝐄𝐗𝐀𝐑 • COVERT OPERATION 🕵️ 』 ═══════╗

║ 🏴 کشور مجری : ${v.executor_country}
║ 👑 مسئول عملیات : ${v.op_officer}

╠══════════ 『 🎯 هدف عملیات 』 ══════════╣

║ 🏴 کشور هدف : ${v.target_country}
║ 👤 شخص / نهاد هدف : ${v.target_entity}

╠══════════ 『 ⚡ نوع عملیات 』 ══════════╣

║ ${v.op_type}

╠══════════ 『 📋 شرح عملیات 』 ══════════╣

${v.description}

╠══════════ 『 🛡 نیروهای درگیر 』 ══════════╣

║ 🕶 مأموران : ${v.agents || '—'}
║ 💻 پشتیبانی سایبری : ${v.cyber_support || '—'}
║ 🎯 تجهیزات ویژه : ${v.special_equip || '—'}

╠══════════ 『 ⏰ زمان‌بندی 』 ══════════╣

║ 🕒 زمان آغاز : ${v.start_time}
║ 🕓 زمان پایان : ${v.end_time}

╠══════════ 『 ⚠️ نتیجه عملیات 』 ══════════╣

║ ❓ در انتظار بررسی مدیریت

╠══════════════════════════════════════╣

║ 🔻 Classified Operation Record
║ 🔻 #عملیات_ویژه

║ 🌐 JOIN ➤ @NEXAR_War

╚══════════════════════════════════════╝`,
  },
  {
    key: 'interception', icon: '🚨', title: 'رهگیری محموله', sub: 'Interception Operation — رهگیری کاروان دشمن',
    fields: [
      { key:'attacker_country', label:'🏴 کشور مهاجم', type:'text' },
      { key:'commander', label:'👑 فرمانده عملیات', type:'text' },
      { key:'cargo_owner', label:'🏴 کشور صاحب محموله', type:'text' },
      { key:'cargo_type', label:'📦 نوع محموله', type:'text' },
      { key:'current_location', label:'📍 موقعیت فعلی', type:'text' },
      { key:'ground_force', label:'🚛 نیروی زمینی', type:'text', optional:true },
      { key:'air_force', label:'✈️ نیروی هوایی', type:'text', optional:true },
      { key:'naval_force', label:'🚢 نیروی دریایی', type:'text', optional:true },
      { key:'cyber_support', label:'💻 پشتیبانی سایبری', type:'text', optional:true },
      { key:'action_type', label:'🎖 نوع اقدام', type:'choice', options:['💰 غارت محموله', '💥 نابودی محموله', '🛑 توقیف محموله'] },
      { key:'description', label:'📜 شرح عملیات', type:'textarea' },
      { key:'start_time', label:'🕒 زمان آغاز', type:'text' },
      { key:'end_time', label:'🕓 زمان پایان', type:'text' },
    ],
    compile: (v) => `╔═══════ 『 🚨 𝐍𝐄𝐗𝐀𝐑 • INTERCEPTION OPERATION 🚨 』 ═══════╗

║ 🏴 کشور مهاجم : ${v.attacker_country}
║ 👑 فرمانده عملیات : ${v.commander}

╠══════════ 『 🎯 اطلاعات هدف 』 ══════════╣

║ 🏴 کشور صاحب محموله : ${v.cargo_owner}
║ 📦 نوع محموله : ${v.cargo_type}
║ 📍 موقعیت فعلی : ${v.current_location}

╠══════════ 『 ⚔️ جزئیات عملیات 』 ══════════╣

║ 🚛 نیروی زمینی : ${v.ground_force || '—'}
║ ✈️ نیروی هوایی : ${v.air_force || '—'}
║ 🚢 نیروی دریایی : ${v.naval_force || '—'}
║ 💻 پشتیبانی سایبری : ${v.cyber_support || '—'}

╠══════════ 『 🎖 نوع اقدام 』 ══════════╣

║ ${v.action_type}

╠══════════ 『 📜 شرح عملیات 』 ══════════╣

${v.description}

╠══════════ 『 ⏰ زمان عملیات 』 ══════════╣

║ 🕒 زمان آغاز : ${v.start_time}
║ 🕓 زمان پایان : ${v.end_time}

╠══════════ 『 📊 نتیجه عملیات 』 ══════════╣

║ ❓ در انتظار بررسی مدیریت

╠══════════════════════════════════════╣

║ 🔻 Official Interception Report
║ 🔻 #رهگیری_محموله

║ 🌐 JOIN ➤ @NEXAR_War

╚══════════════════════════════════════╝`,
  },
  {
    key: 'defense_op', icon: '🛡️', title: 'عملیات دفاعی', sub: 'Defense Operation — واکنش دفاعی به حمله',
    fields: [
      { key:'defender_country', label:'🏴 کشور مدافع', type:'text' },
      { key:'defense_commander', label:'👑 فرمانده دفاع', type:'text' },
      { key:'attacker_country', label:'🏴 کشور مهاجم', type:'text' },
      { key:'attack_target', label:'🎯 هدف حمله', type:'text' },
      { key:'clash_location', label:'📍 محل درگیری', type:'text' },
      { key:'ground_force', label:'🚛 نیروی زمینی', type:'text', optional:true },
      { key:'air_force', label:'✈️ نیروی هوایی', type:'text', optional:true },
      { key:'naval_force', label:'🚢 نیروی دریایی', type:'text', optional:true },
      { key:'cyber_defense', label:'💻 پدافند سایبری', type:'text', optional:true },
      { key:'defense_type', label:'⚔️ نوع دفاع', type:'choice', options:['🛡 دفاع مستقیم', '🔄 ضدحمله', '🚨 رهگیری', '🏰 استحکام مواضع'] },
      { key:'description', label:'📜 شرح عملیات دفاعی', type:'textarea' },
      { key:'start_time', label:'🕒 زمان آغاز', type:'text' },
      { key:'end_time', label:'🕓 زمان پایان', type:'text' },
    ],
    compile: (v) => `╔═══════ 『 🛡️ 𝐍𝐄𝐗𝐀𝐑 • DEFENSE OPERATION 🛡️ 』 ═══════╗

║ 🏴 کشور مدافع : ${v.defender_country}
║ 👑 فرمانده دفاع : ${v.defense_commander}

╠══════════ 『 🚨 اطلاعات حمله 』 ══════════╣

║ 🏴 کشور مهاجم : ${v.attacker_country}
║ 🎯 هدف حمله : ${v.attack_target}
║ 📍 محل درگیری : ${v.clash_location}

╠══════════ 『 🛡 نیروهای مدافع 』 ══════════╣

║ 🚛 نیروی زمینی : ${v.ground_force || '—'}
║ ✈️ نیروی هوایی : ${v.air_force || '—'}
║ 🚢 نیروی دریایی : ${v.naval_force || '—'}
║ 💻 پدافند سایبری : ${v.cyber_defense || '—'}

╠══════════ 『 ⚔️ نوع دفاع 』 ══════════╣

║ ${v.defense_type}

╠══════════ 『 📜 شرح عملیات دفاعی 』 ══════════╣

${v.description}

╠══════════ 『 ⏰ زمان عملیات 』 ══════════╣

║ 🕒 زمان آغاز : ${v.start_time}
║ 🕓 زمان پایان : ${v.end_time}

╠══════════ 『 📊 نتیجه دفاع 』 ══════════╣

║ ❓ در انتظار بررسی مدیریت

╠══════════════════════════════════════╣

║ 🔻 Official Defense Report
║ 🔻 #دفاع

║ 🌐 JOIN ➤ @NEXAR_War

╚══════════════════════════════════════╝`,
  },
];

/* ============================================================
   Wizard engine (text / textarea / number / choice / choice-multi)
============================================================ */
function initFormBuilder(pickerGrid, wizardBox) {
  let state = null;

  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }

  function renderPicker() {
    pickerGrid.innerHTML = NEXAR_FORMS.map((f, i) => `
      <button class="form-pick-card" data-index="${i}">
        <span class="fp-icon">${f.icon}</span>
        <span>
          <span class="fp-title">${f.title}</span>
          <span class="fp-sub">${f.sub}</span>
        </span>
      </button>
    `).join('');

    pickerGrid.querySelectorAll('.form-pick-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const form = NEXAR_FORMS[Number(btn.getAttribute('data-index'))];
        state = { form, step: 0, values: {} };
        pickerGrid.style.display = 'none';
        wizardBox.style.display = 'block';
        renderWizard();
        wizardBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function backToPicker() {
    state = null;
    wizardBox.style.display = 'none';
    wizardBox.innerHTML = '';
    pickerGrid.style.display = 'grid';
    pickerGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function fieldInputHtml(field, currentVal) {
    if (field.type === 'textarea') {
      return `<textarea class="field-textarea" id="fbInput">${currentVal || ''}</textarea>`;
    }
    if (field.type === 'number') {
      return `<input class="field-input" id="fbInput" type="number" min="0" value="${currentVal ?? ''}" placeholder="عدد وارد کن">`;
    }
    if (field.type === 'choice' || field.type === 'choice-multi') {
      const selected = currentVal ? currentVal.split(' ، ') : [];
      return `
        <div class="choice-grid" id="fbChoiceGrid">
          ${field.options.map((o) => `<button type="button" class="choice-pill ${selected.includes(o) ? 'is-selected' : ''}" data-val="${o.replace(/"/g, '&quot;')}">${o}</button>`).join('')}
        </div>
        <input type="hidden" id="fbInput" value="${(currentVal || '').replace(/"/g, '&quot;')}">
      `;
    }
    return `<input class="field-input" id="fbInput" type="text" value="${(currentVal || '').toString().replace(/"/g, '&quot;')}" placeholder="اینجا بنویس...">`;
  }

  function wireChoiceField(field) {
    const grid = document.getElementById('fbChoiceGrid');
    const hidden = document.getElementById('fbInput');
    if (!grid || !hidden) return;
    grid.querySelectorAll('.choice-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        if (field.type === 'choice') {
          grid.querySelectorAll('.choice-pill').forEach((p) => p.classList.remove('is-selected'));
          pill.classList.add('is-selected');
          hidden.value = pill.getAttribute('data-val');
        } else {
          pill.classList.toggle('is-selected');
          const selected = [...grid.querySelectorAll('.choice-pill.is-selected')].map((p) => p.getAttribute('data-val'));
          hidden.value = selected.join(' ، ');
        }
      });
    });
  }

  function readFieldValue() {
    const el = document.getElementById('fbInput');
    return el ? el.value.trim() : '';
  }

  function fieldHasValue(field) {
    if (field.optional) return true;
    const el = document.getElementById('fbInput');
    return el && el.value.trim().length > 0;
  }

  function renderWizard() {
    const { form, step, values } = state;
    const totalSteps = form.fields.length;

    if (step < totalSteps) {
      const field = form.fields[step];
      const pct = Math.round((step / (totalSteps + 1)) * 100);
      const currentVal = values[field.key];

      wizardBox.innerHTML = `
        <button class="wizard-back" id="fbBackToPicker">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6l6 6-6 6"/></svg>
          انتخاب فرم دیگر
        </button>
        <div class="wizard-progress">مرحله ${step + 1} از ${totalSteps} — ${form.title}</div>
        <div class="wizard-track"><div class="wizard-track-fill" style="width:${pct}%"></div></div>
        <div class="field-group">
          <label class="field-label">${field.label}${field.optional ? ' <span style=\"color:var(--text-lo);font-weight:400;\">(اختیاری)</span>' : ''}</label>
          ${fieldInputHtml(field, currentVal)}
          ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
        </div>
        <div class="wizard-actions">
          ${step > 0 ? `<button class="btn btn-ghost" id="fbPrev">بازگشت</button>` : ''}
          <button class="btn btn-gold" id="fbNext">${step === totalSteps - 1 ? 'تکمیل فرم ✅' : 'بعدی ←'}</button>
        </div>
      `;

      if (field.type === 'choice' || field.type === 'choice-multi') wireChoiceField(field);

      document.getElementById('fbBackToPicker').addEventListener('click', backToPicker);
      if (step > 0) {
        document.getElementById('fbPrev').addEventListener('click', () => {
          values[field.key] = readFieldValue();
          state.step -= 1;
          renderWizard();
        });
      }
      document.getElementById('fbNext').addEventListener('click', () => {
        if (!fieldHasValue(field)) {
          showToast('⚠️ این بخش خالیه، پرش کن');
          return;
        }
        values[field.key] = readFieldValue();
        state.step += 1;
        renderWizard();
      });
    } else {
      const text = form.compile(values);
      wizardBox.innerHTML = `
        <button class="wizard-back" id="fbBackToPicker">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6l6 6-6 6"/></svg>
          انتخاب فرم دیگر
        </button>
        <div class="wizard-progress">✅ فرم تکمیل شد — ${form.title}</div>
        <div class="compiled-box">${text.replace(/</g, '&lt;')}</div>
        <div class="wizard-actions">
          <button class="btn btn-ghost" id="fbEdit">✏️ ویرایش آخرین بخش</button>
          <button class="btn btn-ghost" id="fbCopy">📋 کپی متن</button>
        </div>
        <div class="mgmt-cta">
          <span class="mgmt-ic">🌍</span>
          <span class="mgmt-text"><b>ارسال برای مدیریت NEXAR</b>متن رو کپی کن و برای آیدی مدیریت بفرست تا ثبت رسمی بشه.</span>
        </div>
        <div class="wizard-actions">
          <a class="btn btn-gold" id="fbSubmit" href="${MGMT_ID}" target="_blank" rel="noopener">📨 ارسال به مدیریت (${MGMT_ID.replace('https://rubika.ir/', '@')})</a>
        </div>
        <div class="wizard-actions">
          <button class="btn btn-ghost" id="fbRestart">🔄 ساخت یک فرم جدید</button>
        </div>
      `;

      document.getElementById('fbBackToPicker').addEventListener('click', backToPicker);
      document.getElementById('fbEdit').addEventListener('click', () => {
        state.step -= 1;
        renderWizard();
      });
      document.getElementById('fbCopy').addEventListener('click', () => {
        copyText(text);
        showToast('📋 متن کپی شد');
      });
      document.getElementById('fbSubmit').addEventListener('click', () => {
        copyText(text);
        showToast('📋 متن کپی شد؛ داخل چت مدیریت پیست و ارسال کن');
      });
      document.getElementById('fbRestart').addEventListener('click', backToPicker);
    }
  }

  renderPicker();
}
