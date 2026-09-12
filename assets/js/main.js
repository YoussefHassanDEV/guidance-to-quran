/* Hedaya Academy — site script (no dependencies) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Config — edit these for your own academy
  ------------------------------------------------------------------ */
  const SITE = {
    name: "Hedaya Academy",
    tagline: "Online Quran Academy",
    motto: "Where the Quran meets your family's journey",
    instagram: "hedaya__academy",       // public handle, used by the Instagram section
    phoneDisplay: "+20 11 5784 3587",
    phoneIntl: "201157843587",           // digits only, used for WhatsApp / tel:
    email: "hello@hedayaacademy.example",
    // Optional: paste a Formspree / Getform endpoint to receive form submissions by email.
    // Leave empty to fall back to WhatsApp + mailto (works on GitHub Pages with no backend).
    formEndpoint: "",
    socials: {
      facebook: "", instagram: "https://www.instagram.com/hedaya__academy/", youtube: "", linkedin: "", x: "", tiktok: ""
    },
    // Legal entity shown in the footer. Replace the placeholders with the real registration details.
    legal: {
      entity: "Hedaya Academy LLC",
      registration: "Registered in Wyoming, USA",
      ein: "EIN 00-0000000",
      address: "30 N Gould St, Sheridan, WY 82801, USA"
    }
  };

  const ICONS = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4V14h2.8v8z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-3.2.5-4.8s-.1-3.2-.5-4.8zM9.7 15.1V8.9l6.1 3.1z"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 21H3.2V8.7h3.7zM5 7A2.1 2.1 0 1 1 5 2.8 2.1 2.1 0 0 1 5 7zm16 14h-3.7v-6c0-1.4 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H9.4V8.7h3.5v1.7h.1a3.9 3.9 0 0 1 3.5-1.9c3.7 0 4.4 2.5 4.4 5.6z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2h3.4l-7.4 8.5L23 22h-6.8l-5.3-7-6.1 7H1.4l7.9-9.1L1 2h7l4.8 6.4zm-1.2 18h1.9L7.1 3.9H5.1z"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.4 1.7 3.9 4 4.1v3.3c-1.5 0-2.9-.5-4-1.3v6.4a5.7 5.7 0 1 1-4.9-5.7v3.4a2.4 2.4 0 1 0 1.6 2.3V3z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/></svg>',
    grad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.7-.8L3 21l1.9-5.3A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>'
  };

  const CURRENT = (document.body.dataset.page || "home").toLowerCase();

  /* Unsplash photos (free licence, CDN hotlinking permitted) */
  const photo = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
  const PHOTOS = {
    qaida: "photo-1609599006353-e629aaabfeae", nazra: "photo-1542816417-0983c9c9ad53", tajweed: "photo-1576764402988-7143f9cca90a",
    hifz: "photo-1589462135796-2b46e4bdd7fe", tafseer: "photo-1580220810949-e7ddee6a4954", translation: "photo-1575645513913-c002ea3b2e01",
    scholar: "photo-1590075865003-e48277faa558", seerah: "photo-1600814832809-579119f47045", arabic: "photo-1596125160970-6f02eeba00d3",
    urdu: "photo-1712249239167-18cb9e056ee6", english: "photo-1758612898312-708f2ffdcd53", duas: "photo-1574246604907-db69e30ddb97",
    tutoring: "photo-1623076189461-f7706b741c04", ramadan: "photo-1592326871020-04f58c1a52f3"
  };
  const EMOJI = { qaida: "🔤", nazra: "📖", tajweed: "🎙️", hifz: "🧠", tafseer: "💡", translation: "🌍", scholar: "🎓", seerah: "🕌", arabic: "✍️", urdu: "🗣️", english: "🇬🇧", duas: "🤲", tutoring: "🧮", ramadan: "🌙" };
  /* Cartoon avatars (DiceBear, free) */
  const avatar = (seed, style = "adventurer") => `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffdfbf,c0aede,b6e3f4,d1d4f9,ffd5dc&radius=50`;
  window.GTQ = { photo, PHOTOS, avatar };

  /* ------------------------------------------------------------------
     Data
  ------------------------------------------------------------------ */

  /* Public posts from instagram.com/hedaya__academy (captions as published, hashtags removed).
     `embed: true` renders the official Instagram player for that reel. */
  const INSTAGRAM = [
    { code: "DFabCtzNR3L", type: "reel", date: "2025-01-29", embed: true, text: "Alhamdulillah, students are telling their experience with Hedaya Academy, may Allah guide them." },
    { code: "DF1MFYTtxi4", type: "reel", date: "2025-02-08", embed: true, text: "Mashallah, Hedaya Academy has success stories worldwide 🌎 all praise be to Allah, Alhamdulillah. Enroll today!" },
    { code: "DdE6xA3ROS4", type: "reel", date: "2026-09-09", text: "The student asks: why do I sometimes forget how many rak'ahs I have prayed? The answer is paying attention, and changing the surahs you recite." },
    { code: "DdB3hzjNgxh", type: "reel", date: "2026-09-08", text: "Explaining how the Prophet ﷺ used to pray lengthy night prayers, standing for hours with prolonged recitation, deep reflection and heartfelt supplication until his feet swelled." },
    { code: "DdBvdvUt2KT", type: "reel", date: "2026-09-08", text: "Tafseer of Surah Al-Fatiha: notice how the surah ends with the people who went astray, the people Allah is angry with, and the people Allah has blessed. May Allah make us from them 🤲" },
    { code: "DdBuEwXtB-u", type: "reel", date: "2026-09-08", text: "🌙 The story of Prophet Danyal (Daniel) عليه السلام, and how similar it is to Prophet Yusuf: both interpreted dreams. Islamic Studies for kids." },
    { code: "DdAUPrbC4GI", type: "reel", date: "2026-09-07", text: "Part of a session discussing the signs of the Day of Judgement. The Prophet ﷺ warned us not to terrify us but to prepare us: check your prayers, mend your character and turn back to Allah." },
    { code: "Dc_MeNwN762", type: "reel", date: "2026-09-07", text: "🧸 Arabic made fun for kids! 🎉" },
    { code: "Dc9YHc1x02Y", type: "post", date: "2026-09-06", text: "🌟 Now you can learn Fiqh, Sunnah and Hadith in our advanced Islamic Studies bundle. Start your journey today! 📖✨" },
    { code: "Dc9eVHaRvxQ", type: "post", date: "2026-09-06", text: "Make sure you use your time wisely, and never forget why Allah created you. Life is temporary, and every moment is an opportunity to come closer to Allah, do good and prepare for the Hereafter." }
  ];
  const COURSES = [
    { id: "qaida", title: "Noorani Qaida", cat: "quran", level: "Beginner", age: "4+", weeks: "3–6 months", theme: "t-blue", ar: "ق",
      blurb: "The foundation of Quran reading. Learn the Arabic alphabet, harakat, sukoon, tanween and joining letters with correct pronunciation.",
      outcomes: ["Recognise and pronounce every Arabic letter from its correct makhraj", "Read joined words and short ayahs fluently", "Build the base for Tajweed and Nazra"], from: 25 },
    { id: "nazra", title: "Quran Reading (Nazra)", cat: "quran", level: "Beginner–Intermediate", age: "5+", weeks: "6–12 months", theme: "t-teal", ar: "ن",
      blurb: "Move from Qaida to reading the full Mushaf accurately, at a comfortable pace, with a dedicated one-to-one teacher.",
      outcomes: ["Read any page of the Quran without assistance", "Apply basic Tajweed rules while reading", "Complete a full khatm with your teacher"], from: 25 },
    { id: "tajweed", title: "Quran Reading with Tajweed", cat: "quran", level: "Intermediate", age: "7+", weeks: "6–12 months", theme: "t-orange", ar: "ت",
      blurb: "Perfect your recitation. Study the rules of noon sakinah, meem sakinah, madd, qalqalah and the articulation points in depth.",
      outcomes: ["Recite with the precision of a trained Qari", "Understand and name every Tajweed rule you apply", "Ijazah preparation track available"], from: 25 },
    { id: "hifz", title: "Quran Memorization (Hifz)", cat: "quran", level: "All levels", age: "6+", weeks: "2–4 years", theme: "t-navy", ar: "ح",
      blurb: "A structured memorisation programme with daily sabaq, sabqi and manzil revision, progress tracking and parent reports.",
      outcomes: ["Memorise selected surahs or the complete Quran", "Retain what you memorise with a proven revision cycle", "Monthly written progress reports"], from: 35 },
    { id: "tafseer", title: "Tafseer ul Quran", cat: "islamic", level: "Intermediate–Advanced", age: "12+", weeks: "12+ months", theme: "t-purple", ar: "ف",
      blurb: "Understand the meaning, context and lessons of the Quran surah by surah, drawing on classical tafseer works.",
      outcomes: ["Grasp the themes and message of each surah", "Learn the reasons of revelation and key rulings", "Reflect and apply the Quran in daily life"], from: 30 },
    { id: "translation", title: "Quran Translation", cat: "islamic", level: "All levels", age: "10+", weeks: "12 months", theme: "t-green", ar: "ر",
      blurb: "Word-by-word translation of the Quran so you understand what you recite in salah and daily tilawah.",
      outcomes: ["Understand the vocabulary of the Quran", "Follow the meaning during recitation", "Strengthen your connection in salah"], from: 30 },
    { id: "scholar", title: "Islamic Scholar Course", cat: "islamic", level: "Advanced", age: "15+", weeks: "3 years", theme: "t-amber", ar: "ع",
      blurb: "A multi-year 'Alim/'Alimah track covering Aqeedah, Fiqh, Hadith, Seerah, Arabic grammar and Usool, taught by qualified Muftis.",
      outcomes: ["Solid grounding in the core Islamic sciences", "Ability to read classical Arabic texts", "Certificate on completion"], from: 40 },
    { id: "seerah", title: "Seerat un Nabi ﷺ", cat: "islamic", level: "All levels", age: "8+", weeks: "6 months", theme: "t-rose", ar: "س",
      blurb: "Walk through the life of the Prophet Muhammad ﷺ from birth to the Farewell Pilgrimage, with lessons for today.",
      outcomes: ["Know the key events and people of the Seerah", "Learn the Prophet's character and manners", "Family-friendly, story-based lessons"], from: 25 },
    { id: "arabic", title: "Arabic Language", cat: "language", level: "Beginner–Advanced", age: "8+", weeks: "6–18 months", theme: "t-blue", ar: "ع",
      blurb: "Modern Standard and Quranic Arabic: reading, writing, grammar (nahw & sarf) and conversation with native-speaking teachers.",
      outcomes: ["Hold everyday conversations in Arabic", "Read and understand Quranic Arabic", "Master essential grammar"], from: 30 },
    { id: "urdu", title: "Urdu Language", cat: "language", level: "Beginner–Intermediate", age: "6+", weeks: "6–12 months", theme: "t-teal", ar: "ا",
      blurb: "Learn to read, write and speak Urdu with a friendly tutor. Perfect for diaspora families who want children to keep their language.",
      outcomes: ["Read and write the Urdu script", "Converse confidently with family", "Read simple Urdu books and poetry"], from: 25 },
    { id: "english", title: "English Language", cat: "language", level: "Beginner–Intermediate", age: "6+", weeks: "6–12 months", theme: "t-purple", ar: "E",
      blurb: "Spoken English, grammar and writing for students and professionals, with structured lessons and practice sessions.",
      outcomes: ["Speak clearly and confidently", "Write correct, natural English", "Prepare for school or work"], from: 25 },
    { id: "duas", title: "Daily Duas & Salah", cat: "short", level: "Beginner", age: "4+", weeks: "6–8 weeks", theme: "t-orange", ar: "د",
      blurb: "A short course for children and reverts: learn wudu, salah step by step, and the essential daily supplications with meaning.",
      outcomes: ["Pray salah correctly and confidently", "Memorise 40 essential duas", "Understand the meaning of what you say"], from: 20 },
    { id: "tutoring", title: "School Subjects Tutoring", cat: "short", level: "Grades 1–12", age: "6+", weeks: "Flexible", theme: "t-green", ar: "+",
      blurb: "Maths, Science and English tutoring aligned with your school curriculum, delivered by experienced subject teachers.",
      outcomes: ["Improve grades with personalised support", "Homework and exam preparation help", "Progress feedback to parents"], from: 30 },
    { id: "ramadan", title: "Ramadan Intensive", cat: "short", level: "All levels", age: "8+", weeks: "4 weeks", theme: "t-navy", ar: "ر",
      blurb: "A seasonal programme to complete or revise a portion of the Quran, learn the fiqh of fasting and prepare for Laylatul Qadr.",
      outcomes: ["Daily tilawah with a teacher", "Fiqh of fasting, zakah and Eid", "Special dua and dhikr sessions"], from: 20 }
  ];

  const PLAN_CATS = [
    { id: "qaida", label: "Qaida & Quran Reading with Tajweed", base: 1 },
    { id: "hifz", label: "Quran Memorization", base: 1.4 },
    { id: "tafseer", label: "Tafseer & Translation", base: 1.2 },
    { id: "short", label: "Short Courses", base: 0.8 },
    { id: "tutoring", label: "School Subjects Tutoring", base: 1.2 },
    { id: "language", label: "Arabic / English / Urdu", base: 1.2 },
    { id: "scholar", label: "Islamic Scholar Course", base: 1.6 }
  ];
  const PLANS = [
    { id: "a", name: "Plan A", days: 2, usd: 25, gbp: 20, classes: 8 },
    { id: "b", name: "Plan B", days: 3, usd: 35, gbp: 28, classes: 12, featured: true },
    { id: "c", name: "Plan C", days: 4, usd: 40, gbp: 32, classes: 16 },
    { id: "d", name: "Plan D", days: 5, usd: 50, gbp: 40, classes: 20 },
    { id: "w", name: "Weekend", days: "Sat & Sun", usd: 40, gbp: 32, classes: 8 }
  ];

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const waLink = (msg) => `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(msg)}`;

  /* Keep Tab inside an open overlay (drawer / modal / lightbox) */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trapTab(e, container) {
    if (e.key !== "Tab") return;
    const items = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3200);
  }

  /* ------------------------------------------------------------------
     Layout: header / footer / floating
  ------------------------------------------------------------------ */
  const NAV = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "courses.html", label: "Courses", key: "courses", sub: [
      { href: "courses.html#quran", label: "Quran Courses" },
      { href: "courses.html#islamic", label: "Islamic Studies" },
      { href: "courses.html#language", label: "Language Courses" },
      { href: "courses.html#short", label: "Short Courses" }
    ] },
    { href: "fee-plans.html", label: "Fee Plans", key: "fees" },
    { href: "about.html", label: "About Us", key: "about" },
    { href: "blog.html", label: "Blog", key: "blog" },
    { href: "free-trial.html", label: "Contact", key: "trial" }
  ];

  function navList(mobile) {
    return NAV.map((n) => {
      const active = n.key === CURRENT ? ' class="active"' : "";
      const sub = n.sub ? `<ul class="sub">${n.sub.map((s) => `<li><a href="${s.href}">${s.label}</a></li>`).join("")}</ul>` : "";
      const toggle = n.sub && !mobile ? `<button type="button" class="sub-toggle" aria-expanded="false" aria-haspopup="true" aria-label="Show ${n.label} menu">▾</button>` : "";
      return `<li${n.sub ? ' class="has-sub"' : ""}><a href="${n.href}"${active}>${n.label}</a>${toggle}${sub}</li>`;
    }).join("");
  }

  function socials() {
    // Only networks with a real URL are rendered; empty entries in SITE.socials are skipped.
    const s = SITE.socials, list = [["facebook", "Facebook", ICONS.fb], ["instagram", "Instagram", ICONS.ig], ["youtube", "YouTube", ICONS.yt], ["linkedin", "LinkedIn", ICONS.li], ["x", "X", ICONS.x], ["tiktok", "TikTok", ICONS.tt]];
    return list.filter(([k]) => s[k] && s[k] !== "#").map(([k, label, icon]) => `<a href="${s[k]}" aria-label="${label}" target="_blank" rel="noopener">${icon}</a>`).join("");
  }

  function renderHeader() {
    const el = $("#site-header"); if (!el) return;
    el.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="topbar"><div class="container">
        <ul>
          <li><a href="tel:+${SITE.phoneIntl}">${ICONS.phone} ${SITE.phoneDisplay}</a></li>
          <li><a href="mailto:${SITE.email}">${ICONS.mail} ${SITE.email}</a></li>
        </ul>
        <span class="tagline">${SITE.motto}</span>
        <div class="socials">${socials()}</div>
      </div></div>
      <div class="header" id="hdr"><div class="container">
        <a class="brand" href="index.html"><img src="assets/img/icon-192.png" alt="" width="44" height="44"><span>${SITE.name}<small>${SITE.tagline}</small></span></a>
        <nav class="nav" aria-label="Primary"><ul>${navList(false)}</ul></nav>
        <div class="header-actions">
          <button class="icon-btn theme-toggle" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle theme">${ICONS.sun}${ICONS.moon}</button>
          <a class="btn btn-accent btn-sm" href="free-trial.html">Book Now</a>
          <button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">${ICONS.menu}</button>
        </div>
      </div></div>
      <div class="drawer" id="drawer" aria-hidden="true">
        <div class="backdrop"></div>
        <div class="panel" role="dialog" aria-label="Menu">
          <div class="panel-head"><a class="brand" href="index.html"><img src="assets/img/icon-192.png" alt="" width="40" height="40"><span>${SITE.name}</span></a><button class="icon-btn" id="drawer-close" aria-label="Close menu">${ICONS.close}</button></div>
          <nav aria-label="Mobile"><ul>${navList(true)}</ul></nav>
          <a class="btn btn-accent btn-block" href="free-trial.html">Book Free Trial Class</a>
          <a class="btn btn-whatsapp btn-block" style="margin-top:.6rem" href="${waLink("Assalamu alaikum, I would like to know more about your courses.")}" target="_blank" rel="noopener">${ICONS.whatsapp} WhatsApp us</a>
        </div>
      </div>`;

    const hdr = $("#hdr");
    const onScroll = () => { hdr.classList.toggle("scrolled", window.scrollY > 10); const tt = $("#to-top"); if (tt) tt.classList.toggle("show", window.scrollY > 500); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    const drawer = $("#drawer"), burger = $("#burger"), panel = $(".panel", drawer);
    const open = (v) => {
      const was = drawer.classList.contains("open"); if (was === v) return;
      drawer.classList.toggle("open", v); drawer.setAttribute("aria-hidden", String(!v)); burger.setAttribute("aria-expanded", String(v)); document.body.style.overflow = v ? "hidden" : "";
      if (v) setTimeout(() => $("#drawer-close").focus(), 60); else burger.focus();
    };
    burger.addEventListener("click", () => open(true));
    $("#drawer-close").addEventListener("click", () => open(false));
    $(".backdrop", drawer).addEventListener("click", () => open(false));
    drawer.addEventListener("keydown", (e) => trapTab(e, panel));
    drawer.addEventListener("click", (e) => { if (e.target.closest("a")) open(false); });
    matchMedia("(min-width: 1025px)").addEventListener("change", (m) => { if (m.matches) open(false); });

    // Desktop sub-menu toggle (hover still works for mouse users; this covers touch and keyboard)
    const closeSubs = () => $$(".nav .has-sub.open").forEach((li) => { li.classList.remove("open"); $(".sub-toggle", li).setAttribute("aria-expanded", "false"); });
    $$(".nav .sub-toggle").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation(); const li = b.closest(".has-sub"), willOpen = !li.classList.contains("open");
      closeSubs(); li.classList.toggle("open", willOpen); b.setAttribute("aria-expanded", String(willOpen));
    }));
    document.addEventListener("click", (e) => { if (!e.target.closest(".nav .has-sub")) closeSubs(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { open(false); closeModal(); closeSubs(); } });

    $("#theme-toggle").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = dark ? "light" : "dark";
      const apply = () => { document.documentElement.setAttribute("data-theme", next); try { localStorage.setItem("gtq-theme", next); } catch (err) {} };
      btn.classList.remove("spin"); void btn.offsetWidth; btn.classList.add("spin");
      const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (document.startViewTransition && !reduce) {
        // Circular reveal from the toggle button (View Transitions API)
        const vt = document.startViewTransition(apply);
        vt.ready.then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" }
          );
        }).catch(() => {});
      } else if (!reduce) {
        // Fallback: expanding coloured circle overlay, then swap theme
        const ov = document.createElement("div"); ov.className = "theme-ripple";
        ov.style.cssText = `left:${x}px;top:${y}px;background:${next === "dark" ? "#170f09" : "#fffdf9"}`;
        document.body.appendChild(ov);
        requestAnimationFrame(() => { ov.style.transform = `translate(-50%,-50%) scale(${radius / 10})`; });
        setTimeout(apply, 380);
        setTimeout(() => { ov.style.opacity = "0"; setTimeout(() => ov.remove(), 350); }, 620);
      } else apply();
    });
  }

  function renderFooter() {
    const el = $("#site-footer"); if (!el) return;
    const y = new Date().getFullYear();
    el.innerHTML = `
      <div class="container">
        <div class="top">
          <div>
            <a class="brand" href="index.html"><img src="assets/img/icon-192.png" alt="" width="44" height="44"><span>${SITE.name}<small>${SITE.tagline}</small></span></a>
            <p style="font-size:.93rem">We help children and adults across the world learn to read, understand and love the Quran through live one-to-one classes with qualified, caring teachers.</p>
            <div class="badges"><span>${ICONS.shield} SSL secured</span><span>${ICONS.shield} Kid-safe classes</span><span>${ICONS.shield} Money-back trial</span></div>
            <div class="socials">${socials()}</div>
          </div>
          <div>
            <h4>Quick links</h4>
            <ul>
              <li><a href="about.html">About us</a></li>
              <li><a href="courses.html">All courses</a></li>
              <li><a href="fee-plans.html">Fee plans</a></li>
              <li><a href="free-trial.html">Free trial</a></li>
              <li><a href="blog.html">Blog</a></li>
              <li><a href="about.html#faq">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4>Popular courses</h4>
            <ul>
              <li><a href="courses.html#qaida">Noorani Qaida</a></li>
              <li><a href="courses.html#tajweed">Quran with Tajweed</a></li>
              <li><a href="courses.html#hifz">Quran Memorization</a></li>
              <li><a href="courses.html#tafseer">Tafseer ul Quran</a></li>
              <li><a href="courses.html#arabic">Arabic Language</a></li>
              <li><a href="courses.html#scholar">Islamic Scholar Course</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact us</h4>
            <ul class="contact">
              <li>${ICONS.phone}<span>Call / WhatsApp<br><a href="tel:+${SITE.phoneIntl}">${SITE.phoneDisplay}</a></span></li>
              <li>${ICONS.mail}<span>Email<br><a href="mailto:${SITE.email}">${SITE.email}</a></span></li>
              <li>${ICONS.clock}<span>Support hours<br>24 hours · 7 days a week</span></li>
            </ul>
            <h4 style="margin-top:1.4rem">Newsletter</h4>
            <form class="newsletter" id="newsletter"><input type="email" placeholder="Your email" aria-label="Email" required><button class="btn btn-accent btn-sm" type="submit">Join</button></form>
          </div>
        </div>
        <div class="legal">
          <strong>${SITE.legal.entity}</strong>
          <span>${SITE.legal.registration}</span>
          <span>${SITE.legal.ein}</span>
          <span>${SITE.legal.address}</span>
        </div>
        <div class="accept">
          <strong>We accept</strong>
          <div><i>VISA</i><i>Mastercard</i><i>PayPal</i><i>Bank transfer</i></div>
        </div>
        <div class="bottom">
          <div>© ${y} ${SITE.name}. All rights reserved.</div>
          <ul><li><a href="about.html#faq">Privacy</a></li><li><a href="about.html#faq">Refund policy</a></li><li><a href="about.html#faq">Disclaimer</a></li></ul>
        </div>
      </div>`;
    $("#newsletter").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("JazakAllah khair! You're subscribed."); });

    // Floating buttons
    const wa = document.createElement("a");
    wa.className = "float-wa"; wa.href = waLink("Assalamu alaikum! I'd like to book a free trial class."); wa.target = "_blank"; wa.rel = "noopener"; wa.setAttribute("aria-label", "Chat on WhatsApp"); wa.innerHTML = ICONS.whatsapp;
    document.body.appendChild(wa);
    const tt = document.createElement("button");
    tt.className = "to-top"; tt.id = "to-top"; tt.setAttribute("aria-label", "Back to top"); tt.innerHTML = ICONS.up;
    tt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(tt);
  }


  /* ------------------------------------------------------------------
     Cursor sparkles (desktop, fine pointer)
  ------------------------------------------------------------------ */
  function initSparkles() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas"); c.className = "sparkle-layer"; document.body.appendChild(c);
    const g = c.getContext("2d"); let W, H; const dpr = Math.min(devicePixelRatio || 1, 2);
    const size = () => { W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr; }; size(); addEventListener("resize", size);
    const parts = [], colors = ["#e9b93a", "#f3d27a", "#f1d9a8", "#ffffff", "#d98a4a"]; let last = 0;
    addEventListener("pointermove", (e) => { const now = performance.now(); if (now - last < 28) return; last = now;
      for (let i = 0; i < 2; i++) parts.push({ x: e.clientX * dpr, y: e.clientY * dpr, vx: (Math.random() - .5) * 1.4, vy: -Math.random() * 1.2 - .3, life: 1, r: (Math.random() * 3 + 2) * dpr, c: colors[(Math.random() * colors.length) | 0], rot: Math.random() * 6.28 }); }, { passive: true });
    const star = (x, y, r, rot) => { g.beginPath(); for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * .4 : r, a = rot + i * Math.PI / 4; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); };
    let idle = true;
    const loop = () => { requestAnimationFrame(loop); if (!parts.length) { if (!idle) { g.clearRect(0, 0, W, H); idle = true; } return; } idle = false; g.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.x += p.vx * dpr; p.y += p.vy * dpr; p.vy += .03; p.life -= .03; p.rot += .08; if (p.life <= 0) { parts.splice(i, 1); continue; }
        g.globalAlpha = p.life; g.fillStyle = p.c; star(p.x, p.y, p.r * p.life, p.rot); }
      g.globalAlpha = 1; };
    loop();
  }

  /* ------------------------------------------------------------------
     Reveal on scroll & counters
  ------------------------------------------------------------------ */
  function initReveal() {
    const els = $$(".reveal"); if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 });
    els.forEach((e, i) => { e.style.transitionDelay = `${(i % 4) * 80}ms`; io.observe(e); });
    // Fallback: some embedded/hidden-tab contexts never deliver IO updates; check on scroll too.
    let pending = false;
    const sweep = () => { pending = false; const vh = innerHeight; els.forEach((e) => { if (e.classList.contains("in")) return; const r = e.getBoundingClientRect(); if (r.top < vh * 0.92 && r.bottom > 0) { e.classList.add("in"); io.unobserve(e); } }); };
    const onScroll = () => { if (!pending) { pending = true; setTimeout(sweep, 60); } };
    window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); setTimeout(sweep, 400);
  }
  function initCounters() {
    const els = $$("[data-count]"); if (!els.length) return;
    const run = (el) => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || "", dur = 1600, t0 = performance.now();
      const step = (t) => { const p = Math.min(1, Math.max(0, (t - t0) / dur)), v = Math.floor(target * (1 - Math.pow(1 - p, 3))); el.textContent = v.toLocaleString() + suffix; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }), { threshold: .5 });
    els.forEach((e) => io.observe(e));
    $$(".card-float .bar i").forEach((b) => { const o = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { b.style.width = b.dataset.w || "72%"; o.disconnect(); } })); o.observe(b); });
  }

  /* ------------------------------------------------------------------
     Courses
  ------------------------------------------------------------------ */
  function courseCard(c) {
    return `<article class="card course-card reveal tilt" id="${c.id}" data-cat="${c.cat}" data-title="${esc(c.title.toLowerCase())}">
      <div class="thumb ${c.theme}" style="background-image:url('${photo(PHOTOS[c.id], 700)}')" tabindex="0" role="button" aria-label="View photo for ${esc(c.title)}"><span class="arabic-bg">${c.ar}</span><span class="tag">${c.level}</span><span class="emoji">${EMOJI[c.id] || "📚"}</span><span>${esc(c.title)}</span></div>
      <div class="body">
        <div class="meta"><span>${ICONS.users} Ages ${c.age}</span><span>${ICONS.clock} ${c.weeks}</span><span>${ICONS.book} 1-to-1 live</span></div>
        <p class="muted" style="font-size:.93rem">${esc(c.blurb)}</p>
        <div class="foot"><span class="price">from $${c.from}<small>/mo</small></span><button class="btn btn-primary btn-sm" data-course="${c.id}">Details</button></div>
      </div>
    </article>`;
  }

  function initCourses() {
    const grid = $("#course-grid"); if (!grid) return;
    const limit = +grid.dataset.limit || COURSES.length;
    const list = COURSES.slice(0, limit);
    grid.innerHTML = list.map(courseCard).join("");

    const search = $("#course-search"), chips = $$("[data-filter]");
    let cat = "all", q = "";
    const apply = () => {
      let n = 0;
      $$(".course-card", grid).forEach((el) => { const ok = (cat === "all" || el.dataset.cat === cat) && (!q || el.dataset.title.includes(q)); el.style.display = ok ? "" : "none"; if (ok) n++; el.classList.add("in"); });
      let empty = $(".empty", grid);
      if (!n) { if (!empty) { empty = document.createElement("div"); empty.className = "empty"; empty.textContent = "No courses match your search. Try another keyword or contact us — we can build a custom plan."; grid.appendChild(empty); } }
      else if (empty) empty.remove();
    };
    const press = (list, active) => list.forEach((x) => { const on = x === active; x.classList.toggle("active", on); x.setAttribute("aria-pressed", String(on)); });
    press(chips, chips.find((c) => c.classList.contains("active")));
    chips.forEach((b) => b.addEventListener("click", () => { press(chips, b); cat = b.dataset.filter; apply(); }));
    if (search) search.addEventListener("input", () => { q = search.value.trim().toLowerCase(); apply(); });
    // Deep link: courses.html#quran selects a category, courses.html#hifz scrolls to a course
    const deepLink = (fromNav) => {
      const h = location.hash.replace("#", ""); if (!h) return;
      const chip = chips.find((c) => c.dataset.filter === h);
      if (chip) { chip.click(); if (fromNav) grid.scrollIntoView({ behavior: "smooth", block: "start" }); }
      else { const el = document.getElementById(h); if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 200); }
    };
    deepLink(false); window.addEventListener("hashchange", () => deepLink(true));

    document.addEventListener("click", (e) => { const b = e.target.closest("[data-course]"); if (b) openCourse(b.dataset.course); });
  }

  let modal;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div"); modal.className = "modal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-labelledby", "course-title");
    modal.innerHTML = `<div class="backdrop"></div><div class="dialog"><div class="head"><button class="close" aria-label="Close">×</button><h2 id="course-title"></h2><div class="sub" style="opacity:.9;font-size:.9rem"></div></div><div class="body"></div></div>`;
    modal.querySelector(".backdrop").addEventListener("click", closeModal);
    modal.querySelector(".close").addEventListener("click", closeModal);
    modal.addEventListener("keydown", (e) => trapTab(e, modal.querySelector(".dialog")));
    document.body.appendChild(modal);
    return modal;
  }
  let modalLastFocus = null;
  function closeModal() {
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open"); document.body.style.overflow = "";
    if (modalLastFocus && modalLastFocus.focus) modalLastFocus.focus();
  }
  function openCourse(id) {
    const c = COURSES.find((x) => x.id === id); if (!c) return;
    const m = ensureModal();
    const head = m.querySelector(".head"); head.className = "head " + c.theme;
    head.style.cssText = `background-image:linear-gradient(180deg,rgba(10,20,40,.35),rgba(10,20,40,.75)),url('${photo(PHOTOS[c.id], 900)}');background-size:cover;background-position:center;min-height:180px;display:flex;flex-direction:column;justify-content:flex-end`;
    m.querySelector("h2").textContent = c.title;
    m.querySelector(".sub").textContent = `${c.level} · Ages ${c.age} · ${c.weeks}`;
    m.querySelector(".body").innerHTML = `
      <p class="muted">${esc(c.blurb)}</p>
      <div class="kv"><div><strong>Format</strong>Live 1-to-1 via Zoom / Skype</div><div><strong>Class length</strong>30, 45 or 60 minutes</div><div><strong>Starts from</strong>$${c.from} / month</div></div>
      <h3 style="font-size:1rem">What you'll achieve</h3>
      <ul class="outcomes">${c.outcomes.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
      <div class="actions"><a class="btn btn-accent" href="free-trial.html?course=${c.id}">Book a free trial</a><a class="btn btn-outline" href="fee-plans.html">See fee plans</a><a class="btn btn-whatsapp" target="_blank" rel="noopener" href="${waLink(`Assalamu alaikum, I'm interested in the ${c.title} course.`)}">${ICONS.whatsapp} Ask on WhatsApp</a></div>`;
    modalLastFocus = document.activeElement;
    m.classList.add("open"); document.body.style.overflow = "hidden";
    m.querySelector(".close").focus();
  }

  /* ------------------------------------------------------------------
     Pricing
  ------------------------------------------------------------------ */
  function initPricing() {
    const wrap = $("#plans"); if (!wrap) return;
    const tabs = $("#plan-tabs"), cur = $("#currency");
    let cat = PLAN_CATS[0], currency = "usd";
    if (tabs) tabs.innerHTML = PLAN_CATS.map((c, i) => `<button type="button" class="${i ? "" : "active"}" aria-pressed="${i ? "false" : "true"}" data-cat="${c.id}">${c.label}</button>`).join("");
    const press = (scope, active) => $$("button", scope).forEach((x) => { const on = x === active; x.classList.toggle("active", on); x.setAttribute("aria-pressed", String(on)); });
    if (cur) press(cur, $("button.active", cur));
    const sym = { usd: "$", gbp: "£" };
    const render = () => {
      wrap.innerHTML = PLANS.map((p) => {
        const price = Math.round(p[currency] * cat.base);
        const dayTxt = typeof p.days === "number" ? `${p.days} days a week` : `${p.days} (weekend only)`;
        return `<div class="card plan ${p.featured ? "featured" : ""}">
          ${p.featured ? '<span class="ribbon">Most popular</span>' : ""}
          <h3>${p.name}</h3>
          <div class="amount"><sup>${sym[currency]}</sup>${price}</div>
          <div class="per">per month · ${cat.label}</div>
          <ul>
            <li>${ICONS.check}<span>${dayTxt}</span></li>
            <li>${ICONS.check}<span>30-minute live class</span></li>
            <li>${ICONS.check}<span>${p.classes} classes per month</span></li>
            <li>${ICONS.check}<span>Monthly progress report</span></li>
            <li>${ICONS.check}<span>Male or female teacher</span></li>
            ${p.featured ? `<li>${ICONS.check}<span>Free make-up classes</span></li>` : ""}
          </ul>
          <a class="btn ${p.featured ? "btn-light" : "btn-primary"}" href="free-trial.html?plan=${p.id}">Start free trial</a>
          <div class="note">Cancel anytime · first month ${sym[currency]}${currency === "usd" ? 20 : 16} for new students</div>
        </div>`;
      }).join("");
      const perClass = $("#per-class"); if (perClass) perClass.textContent = `${sym[currency]}${(Math.round(PLANS[1][currency] * cat.base) / PLANS[1].classes).toFixed(2)}`;
    };
    if (tabs) tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; press(tabs, b); cat = PLAN_CATS.find((c) => c.id === b.dataset.cat); render(); });
    if (cur) cur.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; press(cur, b); currency = b.dataset.cur; render(); });
    render();
  }

  /* ------------------------------------------------------------------
     Testimonials scroller
  ------------------------------------------------------------------ */

  function initInstagram() {
    const grid = $("#ig-grid"); if (!grid) return;
    const url = (p) => `https://www.instagram.com/${p.type === "reel" ? "reel" : "p"}/${p.code}/`;
    const when = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const embeds = INSTAGRAM.filter((p) => p.embed), posts = INSTAGRAM.filter((p) => !p.embed);
    const embedWrap = $("#ig-embeds");
    if (embedWrap) {
      embedWrap.innerHTML = embeds.map((p) => `<div class="ig-embed reveal"><blockquote class="instagram-media" data-instgrm-permalink="${url(p)}" data-instgrm-version="14"><a href="${url(p)}" target="_blank" rel="noopener">${esc(p.text)}</a></blockquote></div>`).join("");
      const s = document.createElement("script"); s.src = "https://www.instagram.com/embed.js"; s.async = true; document.body.appendChild(s);
    }
    grid.innerHTML = posts.map((p) => `<a class="card ig-card reveal" href="${url(p)}" target="_blank" rel="noopener" aria-label="Open this ${p.type} on Instagram">
      <div class="ig-head"><span class="ig-logo">${ICONS.ig}</span><span><strong>@${SITE.instagram}</strong><small>${p.type === "reel" ? "Reel" : "Post"} · ${when(p.date)}</small></span></div>
      <p>${esc(p.text)}</p>
      <span class="ig-more">${p.type === "reel" ? "Watch on Instagram" : "View on Instagram"} ${ICONS.arrow}</span>
    </a>`).join("");
  }

  function initTestimonials() {
    const track = $(".testi-track"); if (!track) return;
    const prev = $("#testi-prev"), next = $("#testi-next");
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 24 : 300);
    prev && prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next && next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => { if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) track.scrollTo({ left: 0, behavior: "smooth" }); else track.scrollBy({ left: step(), behavior: "smooth" }); }, 5000);
    const stop = () => clearInterval(timer);
    track.addEventListener("pointerenter", stop); track.addEventListener("pointerdown", stop, { passive: true }); track.addEventListener("focusin", stop);
  }

  /* ------------------------------------------------------------------
     Free-trial / contact form
  ------------------------------------------------------------------ */
  function initForm() {
    const form = $("#trial-form"); if (!form) return;
    const courseSel = $("#f-course");
    if (courseSel) { courseSel.innerHTML = '<option value="">Select a course</option>' + COURSES.map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join(""); }
    // Prefill from query string
    const qs = new URLSearchParams(location.search);
    if (qs.get("course") && courseSel) courseSel.value = qs.get("course");
    const planSel = $("#f-plan"); if (qs.get("plan") && planSel) planSel.value = qs.get("plan");
    const teacherSel = $("#f-teacher"); if (qs.get("teacher") && teacherSel) teacherSel.value = qs.get("teacher") === "female" ? "Female teacher" : "Male teacher";
    // Timezone helper
    const tz = $("#tz"); if (tz) { try { tz.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.replace("_", " "); } catch (e) { tz.textContent = "your local time"; } }

    const validate = () => {
      let ok = true;
      $$(".field[data-req]", form).forEach((f) => {
        const input = $("input, select, textarea", f); let good = !!input.value.trim();
        if (good && input.type === "email") good = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        if (good && input.type === "tel") good = input.value.replace(/\D/g, "").length >= 7;
        f.classList.toggle("invalid", !good); if (!good) ok = false;
      });
      return ok;
    };
    form.addEventListener("input", (e) => { const f = e.target.closest(".field"); if (f) f.classList.remove("invalid"); });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) { toast("Please fill in the highlighted fields."); return; }
      const d = Object.fromEntries(new FormData(form).entries());
      const courseName = (COURSES.find((c) => c.id === d.course) || {}).title || "Not sure yet";
      const msg = `Assalamu alaikum! I'd like to book a free trial class.\n\nName: ${d.name}\nEmail: ${d.email}\nPhone/WhatsApp: ${d.phone}\nCountry: ${d.country}\nStudent age: ${d.age || "-"}\nCourse: ${courseName}\nPreferred time: ${d.time || "-"} (${d.tz || ""})\nTeacher preference: ${d.teacher || "No preference"}\nMessage: ${d.message || "-"}`;
      const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "Sending…";
      let sent = false;
      if (SITE.formEndpoint) {
        try { const r = await fetch(SITE.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) }); sent = r.ok; } catch (err) { sent = false; }
      }
      form.style.display = "none";
      const s = $("#form-success"); s.style.display = "block";
      $("#s-wa", s).href = waLink(msg);
      $("#s-mail", s).href = `mailto:${SITE.email}?subject=${encodeURIComponent("Free trial request — " + d.name)}&body=${encodeURIComponent(msg)}`;
      $("#s-title", s).textContent = sent ? "Request received!" : "One last step";
      $("#s-text", s).textContent = sent ? "JazakAllah khair. Our admissions team will contact you within 24 hours to schedule your free class." : "Send your request to our admissions team via WhatsApp or email — it's pre-filled, just press send. We'll reply within 24 hours to schedule your free class.";
      if (!sent) { try { window.open(waLink(msg), "_blank", "noopener"); } catch (err) {} }
      s.scrollIntoView({ behavior: "smooth", block: "center" });
      try { localStorage.setItem("gtq-lead", JSON.stringify({ name: d.name, at: Date.now() })); } catch (err) {}
    });
  }

  /* ------------------------------------------------------------------
     3D tilt, parallax, progress bar, cursor glow, cartoon avatars
  ------------------------------------------------------------------ */
  function initEffects() {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scroll progress bar
    const bar = document.createElement("div"); bar.className = "progress"; document.body.appendChild(bar);
    const prog = () => { const h = document.documentElement; bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%"; };
    window.addEventListener("scroll", prog, { passive: true }); prog();

    if (!fine || reduce) return;

    // Cursor glow
    const glow = document.createElement("div"); glow.className = "glow"; document.body.appendChild(glow);
    window.addEventListener("pointermove", (e) => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; glow.classList.add("on"); }, { passive: true });

    // Tilt cards (delegated so injected cards work too)
    const tiltables = () => $$(".tilt, .card:not(.plan):not(.testi)");
    tiltables().forEach((el) => { if (!$(".shine", el)) { el.classList.add("tilt"); const s = document.createElement("span"); s.className = "shine"; el.appendChild(s); } });
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest(".tilt"); if (!el) return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-4px)`;
      el.style.setProperty("--mx", x * 100 + "%"); el.style.setProperty("--my", y * 100 + "%");
    }, { passive: true });
    document.addEventListener("pointerout", (e) => { const el = e.target.closest(".tilt"); if (el && !el.contains(e.relatedTarget)) el.style.transform = ""; });
    new MutationObserver(() => tiltables().forEach((el) => { if (!$(".shine", el)) { el.classList.add("tilt"); const s = document.createElement("span"); s.className = "shine"; el.appendChild(s); } })).observe(document.body, { childList: true, subtree: true });

    // Hero parallax
    const scene = $(".hero-scene");
    if (scene) {
      const layers = $$(".photo, .mascot, .chip, .book3d-wrap", scene);
      scene.closest(".hero").addEventListener("pointermove", (e) => {
        const r = scene.getBoundingClientRect(), dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        layers.forEach((l, i) => { const d = (i % 3 + 1) * 8; l.style.translate = `${dx * d}px ${dy * d}px`; });
      }, { passive: true });
    }
  }
  /* ------------------------------------------------------------------
     UX extras: lightbox, ripple, testimonial dots, mobile CTA bar
  ------------------------------------------------------------------ */
  function initUX() {
    // Button ripple
    document.addEventListener("pointerdown", (e) => {
      const b = e.target.closest(".btn"); if (!b) return;
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      const rip = document.createElement("span"); rip.className = "ripple";
      rip.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      b.appendChild(rip); setTimeout(() => rip.remove(), 700);
    });

    // Shared lightbox (gallery photos + course covers)
    const lb = document.createElement("div"); lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML = `<figure><img alt=""><p class="lb-quote"></p><figcaption class="cap"><span class="cap-text"></span><span class="cap-actions"></span></figcaption></figure><button class="prev" aria-label="Previous">‹</button><button class="next" aria-label="Next">›</button><button class="close" aria-label="Close">×</button><div class="counter"></div>`;
    document.body.appendChild(lb);
    let items = [], idx = 0, lastFocus = null;
    const render = () => {
      const it = items[idx], img = $("img", lb);
      img.src = it.src; img.alt = it.alt || "";
      $("figure", lb).className = it.cls || "";
      const q = $(".lb-quote", lb); q.textContent = it.quote || ""; q.hidden = !it.quote;
      $(".cap-text", lb).textContent = it.cap || "";
      $(".cap-actions", lb).innerHTML = it.actions || "";
      $(".counter", lb).textContent = items.length > 1 ? `${idx + 1} / ${items.length}` : "";
      lb.querySelectorAll(".prev, .next").forEach((b) => b.style.display = items.length > 1 ? "" : "none");
    };
    const openLb = (list, i) => { items = list; idx = i; lastFocus = document.activeElement; render(); lb.classList.add("open"); document.body.style.overflow = "hidden"; $(".close", lb).focus(); };
    const step = (d) => { idx = (idx + d + items.length) % items.length; render(); };
    const hide = () => { lb.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
    $(".prev", lb).addEventListener("click", () => step(-1)); $(".next", lb).addEventListener("click", () => step(1)); $(".close", lb).addEventListener("click", hide);
    lb.addEventListener("click", (e) => { if (e.target === lb) hide(); });
    document.addEventListener("keydown", (e) => { if (!lb.classList.contains("open")) return; if (e.key === "Escape") hide(); if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); trapTab(e, lb); });
    // Swipe on touch
    let sx = 0; lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });

    // Gallery photos
    const figs = $$(".gallery figure");
    if (figs.length) {
      const list = figs.map((f) => { const img = $("img", f); return { src: img.src.replace(/w=\d+/, "w=1400"), alt: img.alt, cap: $("figcaption", f).textContent }; });
      figs.forEach((f, i) => { f.tabIndex = 0; f.setAttribute("role", "button"); f.addEventListener("click", () => openLb(list, i)); f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(list, i); } }); });
    }

    // Course covers: click the photo to view it large, with quick actions
    const courseItems = () => $$(".course-card").filter((c) => c.style.display !== "none").map((c) => {
      const data = COURSES.find((x) => x.id === c.id) || {};
      return { id: c.id, src: photo(PHOTOS[c.id], 1400), alt: data.title, cap: `${EMOJI[c.id] || "📚"} ${data.title} · ${data.level} · Ages ${data.age}`,
        actions: `<button class="btn btn-light btn-sm" data-lb-course="${c.id}">Details</button><a class="btn btn-accent btn-sm" href="free-trial.html?course=${c.id}">Free trial</a>` };
    });
    document.addEventListener("click", (e) => {
      const thumb = e.target.closest(".course-card .thumb");
      if (thumb) { const list = courseItems(), i = list.findIndex((x) => x.id === thumb.closest(".course-card").id); if (i > -1) openLb(list, i); return; }
      const d = e.target.closest("[data-lb-course]");
      if (d) { hide(); openCourse(d.dataset.lbCourse); }
    });
    document.addEventListener("keydown", (e) => { const t = e.target.closest && e.target.closest(".course-card .thumb, .post-card .cover"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); t.click(); } });

    // Blog post covers
    const posts = $$(".post-card");
    if (posts.length) {
      const postItems = posts.map((p) => {
        const cover = $(".cover", p), title = $("h3", p), link = p.matches("a") ? p : $("h3 a, a.more", p);
        const href = link ? link.getAttribute("href") : "#", date = $(".date", p);
        return { src: photo(cover.dataset.photo, 1400), alt: title ? title.textContent : "", cap: `📖 ${title ? title.textContent : ""}${date ? " · " + date.textContent.split("·")[0].trim() : ""}`,
          actions: `<a class="btn btn-light btn-sm" href="${href}" data-lb-link>Read article</a>` };
      });
      posts.forEach((p, i) => {
        const cover = $(".cover", p); if (!cover) return;
        cover.tabIndex = 0; cover.setAttribute("role", "button"); cover.setAttribute("aria-label", "View cover photo");
        cover.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); openLb(postItems, i); });
      });
      lb.addEventListener("click", (e) => { if (e.target.closest("[data-lb-link]")) hide(); });
    }

    // Faculty avatars: large circular portrait with name, role and qualifications
    const staff = $$(".faculty-card");
    if (staff.length) {
      const staffItems = staff.map((c) => {
        const name = $("h3", c)?.textContent || "", role = $(".role", c)?.textContent || "", tags = $$(".tags span", c).map((t) => t.textContent).join(" · ");
        const female = /female|ustadha|hafiza|alimah|\bms\b/i.test(role + " " + name);
        return { src: avatar($(".avatar", c)?.dataset.avatar || name), alt: name, cls: "avatar-view", cap: `${name} · ${role}${tags ? " · " + tags : ""}`,
          actions: `<a class="btn btn-accent btn-sm" href="free-trial.html?teacher=${female ? "female" : "male"}" data-lb-link>Book a trial with ${esc(name.split(" ").slice(-1)[0])}</a>` };
      });
      staff.forEach((c, i) => {
        const av = $(".avatar", c); if (!av) return;
        av.tabIndex = 0; av.setAttribute("role", "button"); av.setAttribute("aria-label", `View ${$("h3", c)?.textContent || "teacher"}`);
        av.style.cursor = "zoom-in";
        av.addEventListener("click", () => openLb(staffItems, i));
        av.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(staffItems, i); } });
      });
    }

    // Testimonial avatars: portrait + full quote
    const testis = $$(".testi");
    if (testis.length) {
      const testiItems = testis.map((t) => {
        const name = $(".who strong", t)?.textContent || "", where = $(".who span", t)?.textContent || "", quote = $("blockquote", t)?.textContent.trim() || "", av = $(".who .av", t);
        return { src: avatar(av?.dataset.avatar || name, av?.dataset.style || "big-smile"), alt: name, cls: "avatar-view", cap: `${name} · ${where}`, quote: `“${quote}”`,
          actions: `<a class="btn btn-accent btn-sm" href="free-trial.html" data-lb-link>Start your child's story</a>` };
      });
      testis.forEach((t, i) => {
        const av = $(".who .av", t); if (!av) return;
        av.tabIndex = 0; av.setAttribute("role", "button"); av.setAttribute("aria-label", `View ${$(".who strong", t)?.textContent || "student"}`); av.style.cursor = "zoom-in";
        av.addEventListener("click", () => openLb(testiItems, i));
        av.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(testiItems, i); } });
      });
    }
    // Hero collage photos
    const heroPhotos = $$(".hero-scene .photo");
    if (heroPhotos.length) {
      const heroItems = heroPhotos.map((p) => { const img = $("img", p); return { src: img.src.replace(/w=\d+/, "w=1400"), alt: img.alt, cap: `📸 ${p.dataset.cap || img.alt}`,
        actions: `<a class="btn btn-accent btn-sm" href="free-trial.html" data-lb-link>Book a free trial</a>` }; });
      heroPhotos.forEach((p, i) => {
        p.tabIndex = 0; p.setAttribute("role", "button"); p.setAttribute("aria-label", `View photo: ${p.dataset.cap || ""}`);
        p.addEventListener("click", () => openLb(heroItems, i));
        p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(heroItems, i); } });
      });
    }
    if (!posts.length) lb.addEventListener("click", (e) => { if (e.target.closest("[data-lb-link]")) hide(); });

    // Testimonial dots
    const track = $(".testi-track");
    if (track) {
      const items = $$(".testi", track), dots = document.createElement("div"); dots.className = "testi-dots";
      dots.innerHTML = items.map((_, i) => `<button type="button" aria-label="Go to testimonial ${i + 1}"${i ? "" : ' class="active"'}></button>`).join("");
      track.parentNode.appendChild(dots);
      dots.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; const i = [...dots.children].indexOf(b); items[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" }); });
      track.addEventListener("scroll", () => { const w = items[0].getBoundingClientRect().width + 24, i = Math.round(track.scrollLeft / w); [...dots.children].forEach((d, j) => d.classList.toggle("active", j === i)); }, { passive: true });
    }

    // Phone bottom tab bar (hidden from md up, where the header has the full navigation)
    if (CURRENT !== "trial") {
      const nav = document.createElement("nav"); nav.className = "mobile-nav"; nav.setAttribute("aria-label", "Quick navigation");
      const item = (href, page, icon, label, extra = "") => `<a href="${href}" class="${page === CURRENT ? "active" : ""}"${extra}>${icon}<span>${label}</span></a>`;
      nav.innerHTML = item("index.html", "home", ICONS.home, "Home") + item("courses.html", "courses", ICONS.book, "Courses")
        + `<a href="free-trial.html" class="enrol"><span class="bubble">${ICONS.grad}</span><span>Enrol</span></a>`
        + item("fee-plans.html", "fees", ICONS.tag, "Plans")
        + item(waLink("Assalamu alaikum! I'd like to book a free trial class."), "", ICONS.chat, "Contact", ' target="_blank" rel="noopener"');
      document.body.appendChild(nav);
    }
  }

  /* ------------------------------------------------------------------
     Art layer: headline reveal, lanterns, sparkle trail, page curtain
  ------------------------------------------------------------------ */
  function initArt() {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Letter-by-letter hero headline. Each word is wrapped in an unbreakable .w span so the
    // inline-block letters can only wrap at spaces; .grad-text animates as one piece so its
    // gradient text clipping keeps working. The class is "letters" (not "split", which is the
    // two-column layout class).
    const h1 = $(".hero h1");
    if (h1 && !reduce) {
      let i = 0;
      const letter = (ch) => { const s = document.createElement("span"); s.className = "ch"; s.textContent = ch; s.style.animationDelay = `${0.15 + i++ * 0.03}s`; return s; };
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
              const w = document.createElement("span"); w.className = "w";
              [...part].forEach((ch) => w.appendChild(letter(ch)));
              frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) {
            if (n.classList.contains("grad-text")) { const s = document.createElement("span"); s.className = "ch"; s.style.animationDelay = `${0.15 + i * 0.03}s`; i += 3; n.replaceWith(s); s.appendChild(n); }
            else walk(n);
          }
        });
      };
      walk(h1); h1.classList.add("letters");
    }

    // Lanterns in the hero
    const hero = $(".hero");
    if (hero) { const l = document.createElement("div"); l.className = "lanterns"; l.setAttribute("aria-hidden", "true"); l.innerHTML = '<img class="lantern l1" src="assets/img/lantern.svg" alt=""><img class="lantern l2" src="assets/img/lantern.svg" alt=""><img class="lantern l3" src="assets/img/lantern.svg" alt="">'; hero.appendChild(l); }

    // Sparkle trail (desktop, fine pointer)
    if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
      let last = 0; const glyphs = ["✦", "✧", "★", "✩"];
      window.addEventListener("pointermove", (e) => {
        const now = performance.now(); if (now - last < 70) return; last = now;
        const s = document.createElement("span"); s.className = "spark"; s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        s.style.left = e.clientX + (Math.random() * 16 - 8) + "px"; s.style.top = e.clientY + (Math.random() * 16 - 8) + "px";
        s.style.color = ["#e9b93a", "#d98a4a", "#f1d9a8", "#fff"][Math.floor(Math.random() * 4)];
        document.body.appendChild(s); setTimeout(() => s.remove(), 900);
      }, { passive: true });
    }

    // Curtain page transition for internal navigations
    if (!reduce) {
      const c = document.createElement("div"); c.className = "curtain leave"; c.innerHTML = '<img src="assets/img/mascot-boy.svg" alt="">'; document.body.appendChild(c);
      requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("off")));
      setTimeout(() => { c.classList.remove("leave", "off"); }, 900);
      document.addEventListener("click", (e) => {
        const a = e.target.closest("a[href]"); if (!a) return;
        const href = a.getAttribute("href");
        if (!href || href.startsWith("#") || a.target === "_blank" || /^(mailto|tel|https?):/.test(href) || e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (!/\.html(\?|#|$)/.test(href)) return;
        // same-page hash links inside the current file: let the smooth-scroll handler take it
        const cur = location.pathname.split("/").pop() || "index.html";
        if (href.split(/[?#]/)[0] === cur && href.includes("#")) return;
        e.preventDefault(); c.classList.add("on");
        setTimeout(() => { location.href = href; }, 520);
      });
      window.addEventListener("pageshow", (e) => { if (e.persisted) c.classList.remove("on"); });
    }
  }

  function initAvatars() {
    $$("[data-avatar]").forEach((el) => { const img = new Image(); img.alt = ""; img.width = 120; img.height = 120; img.loading = "lazy"; img.src = avatar(el.dataset.avatar, el.dataset.style || "adventurer"); el.textContent = ""; el.appendChild(img); });
    $$("[data-photo]").forEach((el) => { const id = el.dataset.photo, w = +el.dataset.w || 900; if (el.tagName === "IMG") el.src = photo(id, w); else el.style.backgroundImage = `url('${photo(id, w)}')`; });
  }

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader(); renderFooter();
    initAvatars();
    initCourses(); initPricing(); initTestimonials(); initInstagram(); initForm();
    initReveal(); initCounters(); initEffects(); initUX(); initArt(); initSparkles();
    // Smooth-scroll for in-page anchors with sticky offset
    document.addEventListener("click", (e) => { const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href") === "#") return; const t = document.getElementById(a.getAttribute("href").slice(1)); if (t) { e.preventDefault(); const hdr = $(".header"), y = t.getBoundingClientRect().top + window.scrollY - ((hdr ? hdr.offsetHeight : 74) + 16); window.scrollTo({ top: y, behavior: "smooth" }); } });
  });
})();
