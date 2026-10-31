// VIRORA Coach UI copy (VT-40 Stage 3, 2026-10-08). DRAFT for P5 (coach voices):
// en is the source; uz/ru are first drafts and NEED a native check before launch.
// Shared lines first, then per-persona overrides (vira friendly, velvet personal,
// vi strategic). Persona never changes WHAT the plan is, only how it is said.
// Students never see "round": UI says "Today's Practice" and "Keep going".

const SHARED = {
  en: {
    today_title: "Today's Practice",
    today_sub: "{n} min · picked for you",
    today_sub_plain: "Picked for you",
    unavailable_title: "We couldn't load your practice",
    unavailable_sub: "Nothing was recorded. Your plan is still here, so try again in a moment.",
    partial_note: "{n} item(s) couldn't load. They stay in your plan.",
    start: "Start",
    resume: "Continue",
    leave_title: "Save and leave?", leave_sub: "Everything you finished is saved. Come back any time today to finish the rest.", leave_save: "Save & leave", leave_stay: "Keep practising", leaving: "Saving…",
    leave_failed_title: "Not saved yet", leave_failed_sub: "We couldn't reach the server. Your answers are kept on this device and will be sent when you're back online.", leave_anyway: "Leave anyway",
    leave_grammar_note: "The grammar round you're in will start again next time. Everything you finished is saved.",
    resume_title: "Pick up where you left off", resume_sub: "{done} min done · {left} min left",
    recap_title: "What you did today", recap_words: "Words", recap_grammar: "Grammar", recap_accuracy: "Accuracy", recap_minutes: "Minutes",
    recap_moved: "Moved up", recap_learned: "Learned today", recap_again: "Worth another look", recap_none: "Every answer counts. Your map updates as you practise.",
    keep_going: "Keep going",
    keep_going_sub: "A fresh plan from what you just did",
    done_title: "Today's Practice is done",
    done_sub: "Everything else in VIRORA is still yours. Come back tomorrow for a new plan.",
    done_sub_more: "Everything else in VIRORA is still yours. Keep going for a fresh plan now, or come back tomorrow.",
    no_more_today: "That's all the guided practice for today.",
    back_home: "Back to home",
    map_title: "Your map",
    map_empty: "Your map fills in as you practise.",
    label_new: "New", label_weak: "Needs work", label_learning: "Practising", label_solid: "Strong",
    reason_review: "Review", reason_weak: "Needs work", reason_new: "New", reason_practice: "Practise", reason_prereq: "Comes first",
    word_check: "Word check", grammar_check: "Grammar",
    pick_meaning: "What does it mean?", pick_word: "Which English word?",
    q_definition: "Which word matches this definition?", q_context: "Fill the gap", q_spelling: "Type the English word",
    check: "Check", answer: "Answer:", word_card: "Quick refresher", got_it: "Got it", min_short: "<1 min",
    pick_definition: "Which definition fits this word?", show_translation: "Show translation", q_spelling_sentence: "Type the missing word",
    next: "Next", skip: "Skip",
    item_of: "{i} of {n}",
    onboarding_title: "Meet your coach",
    onboarding_goal: "What do you want from English right now?",
    onboarding_minutes: "How long each day?",
    onboarding_go: "Make my plan",
    min: "{n} min",
    nothing_title: "Nothing urgent today",
    nothing_sub: "You're on top of your goal. Free practice is open.",
    free_practice: "Free practice",
    handoff_up: "{to} is your coach now",
    handoff_down: "{to} is your coach now. Everything you learned stays.",
    handoff_ok: "Let's go",
    see_plans: "See plans",
    loading: "Planning your practice…",
    error: "Couldn't load your plan. Try again.",
    retry: "Try again",
    save_pending: "Some answers haven't saved yet. Keep going and we'll retry, or tap Try again.",
    save_failed: "Your answers didn't save yet", save_failed_sub: "Check your connection and try again. Your answers are kept while this page stays open.",
    how_planned: "Why these?",
    review_due: "Due for review",
    goal_switch_locked: "Switching goals comes with Learner",
  },
  uz: {
    today_title: "Bugungi mashg'ulot",
    today_sub: "{n} daqiqa · siz uchun tanlandi",
    today_sub_plain: "Siz uchun tanlandi",
    unavailable_title: "Mashg'ulotni yuklab bo'lmadi",
    unavailable_sub: "Hech narsa yozilmadi. Rejangiz joyida, birozdan so'ng qayta urinib ko'ring.",
    partial_note: "{n} ta mashq yuklanmadi. Ular rejangizda qoladi.",
    start: "Boshlash", resume: "Davom etish",
    leave_title: "Saqlab chiqasizmi?", leave_sub: "Tugatganlaringiz saqlanadi. Qolganini bugun istalgan vaqtda tugatishingiz mumkin.", leave_save: "Saqlab chiqish", leave_stay: "Mashqni davom ettirish", leaving: "Saqlanmoqda…",
    leave_failed_title: "Hali saqlanmadi", leave_failed_sub: "Serverga ulanib bo'lmadi. Javoblaringiz shu qurilmada saqlanadi va internet tiklanganda yuboriladi.", leave_anyway: "Baribir chiqish",
    leave_grammar_note: "Hozirgi grammatika mashqi keyingi safar boshidan boshlanadi. Tugatganlaringiz saqlangan.",
    resume_title: "Qolgan joyingizdan davom eting", resume_sub: "{done} daq bajarildi · {left} daq qoldi",
    recap_title: "Bugun nima qildingiz", recap_words: "So'zlar", recap_grammar: "Grammatika", recap_accuracy: "Aniqlik", recap_minutes: "Daqiqa",
    recap_moved: "Oldinga siljidi", recap_learned: "Bugun o'rganildi", recap_again: "Yana bir ko'rib chiqing", recap_none: "Har bir javob hisobga olinadi. Xaritangiz mashq bilan yangilanadi.",
    keep_going: "Yana davom etamiz", keep_going_sub: "Hozir qilganingiz asosida yangi reja",
    done_title: "Bugungi mashg'ulot tugadi",
    done_sub: "VIRORA'dagi boshqa hamma narsa ochiq. Ertaga yangi reja bo'ladi.",
    done_sub_more: "VIRORA'dagi boshqa hamma narsa ochiq. Hozir yangi reja bilan davom eting yoki ertaga qaytib keling.",
    no_more_today: "Bugungi yo'naltirilgan mashg'ulot shu.",
    back_home: "Bosh sahifaga",
    map_title: "Sizning xaritangiz", map_empty: "Mashq qilganingiz sari xarita to'ladi.",
    label_new: "Yangi", label_weak: "Ishlash kerak", label_learning: "Mashq qilinmoqda", label_solid: "Mustahkam",
    reason_review: "Takrorlash", reason_weak: "Ishlash kerak", reason_new: "Yangi", reason_practice: "Mashq", reason_prereq: "Avval shu",
    word_check: "So'z tekshiruvi", grammar_check: "Grammatika",
    pick_meaning: "Ma'nosi nima?", pick_word: "Qaysi inglizcha so'z?",
    q_definition: "Qaysi so'z shu ta'rifga mos?", q_context: "Bo'sh joyni to'ldiring", q_spelling: "Inglizcha so'zni yozing",
    check: "Tekshirish", answer: "Javob:", word_card: "Eslab olamiz", got_it: "Tushundim", min_short: "<1 daq",
    pick_definition: "Qaysi ta'rif shu so'zga mos?", show_translation: "Tarjimani ko'rsatish", q_spelling_sentence: "Tushib qolgan so'zni yozing",
    next: "Keyingisi", skip: "O'tkazib yuborish", item_of: "{i} / {n}",
    onboarding_title: "Murabbiyingiz bilan tanishing",
    onboarding_goal: "Hozir ingliz tilidan nima istaysiz?",
    onboarding_minutes: "Har kuni qancha vaqt?",
    onboarding_go: "Rejamni tuz", min: "{n} daq",
    nothing_title: "Bugun shoshilinch narsa yo'q", nothing_sub: "Maqsadingiz nazorat ostida. Erkin mashq ochiq.",
    free_practice: "Erkin mashq",
    handoff_up: "Endi murabbiyingiz — {to}", handoff_down: "Endi murabbiyingiz — {to}. O'rganganlaringiz saqlanadi.",
    handoff_ok: "Boshladik", see_plans: "Tariflar",
    loading: "Mashg'ulot rejalashtirilmoqda…", error: "Rejani yuklab bo'lmadi.", retry: "Qayta urinish",
    save_pending: "Ba'zi javoblar hali saqlanmadi. Davom eting, biz qayta urinamiz yoki «Qayta urinish»ni bosing.",
    save_failed: "Javoblaringiz hali saqlanmadi", save_failed_sub: "Internet aloqasini tekshirib, qayta urinib ko'ring. Sahifa ochiq turganda javoblaringiz saqlanib turadi.",
    how_planned: "Nega aynan shular?", review_due: "Takrorlash vaqti",
    goal_switch_locked: "Maqsadni almashtirish Learner tarifida",
    goal_everyday: "Kundalik ingliz tili: hayot uchun so'z va grammatika", goal_vocabulary: "So'z boyligimni oshirish", goal_grammar_basics: "Grammatika asoslarini mustahkamlash",
  },
  ru: {
    today_title: "Практика на сегодня",
    today_sub: "{n} мин · подобрано для вас",
    today_sub_plain: "Подобрано для вас",
    unavailable_title: "Не удалось загрузить практику",
    unavailable_sub: "Ничего не записано. План сохранён, попробуйте ещё раз чуть позже.",
    partial_note: "Не загрузилось: {n}. Это останется в вашем плане.",
    start: "Начать", resume: "Продолжить",
    leave_title: "Сохранить и выйти?", leave_sub: "Всё, что вы закончили, сохранено. Возвращайтесь сегодня в любое время, чтобы закончить.", leave_save: "Сохранить и выйти", leave_stay: "Продолжить занятие", leaving: "Сохраняем…",
    leave_failed_title: "Ещё не сохранено", leave_failed_sub: "Не удалось связаться с сервером. Ваши ответы хранятся на этом устройстве и будут отправлены, когда появится связь.", leave_anyway: "Всё равно выйти",
    leave_grammar_note: "Текущий раунд грамматики начнётся заново в следующий раз. Всё, что вы закончили, сохранено.",
    resume_title: "Продолжите с того места, где остановились", resume_sub: "{done} мин сделано · {left} мин осталось",
    recap_title: "Что вы сделали сегодня", recap_words: "Слова", recap_grammar: "Грамматика", recap_accuracy: "Точность", recap_minutes: "Минуты",
    recap_moved: "Продвинулись", recap_learned: "Выучено сегодня", recap_again: "Стоит повторить", recap_none: "Каждый ответ учитывается. Ваша карта обновляется по мере практики.",
    keep_going: "Продолжаем", keep_going_sub: "Новый план по тому, что вы только что сделали",
    done_title: "Практика на сегодня готова",
    done_sub: "Всё остальное в VIRORA по-прежнему ваше. Завтра будет новый план.",
    done_sub_more: "Всё остальное в VIRORA по-прежнему ваше. Продолжите с новым планом сейчас или возвращайтесь завтра.",
    no_more_today: "На сегодня это вся практика с коучем.",
    back_home: "На главную",
    map_title: "Ваша карта", map_empty: "Карта заполняется по мере практики.",
    label_new: "Новое", label_weak: "Нужно подтянуть", label_learning: "В практике", label_solid: "Уверенно",
    reason_review: "Повтор", reason_weak: "Нужно подтянуть", reason_new: "Новое", reason_practice: "Практика", reason_prereq: "Сначала это",
    word_check: "Проверка слова", grammar_check: "Грамматика",
    pick_meaning: "Что это значит?", pick_word: "Какое это английское слово?",
    q_definition: "Какое слово подходит к определению?", q_context: "Заполните пропуск", q_spelling: "Напишите английское слово",
    check: "Проверить", answer: "Ответ:", word_card: "Повторим", got_it: "Понятно", min_short: "<1 мин",
    pick_definition: "Какое определение подходит к слову?", show_translation: "Показать перевод", q_spelling_sentence: "Напишите пропущенное слово",
    next: "Дальше", skip: "Пропустить", item_of: "{i} из {n}",
    onboarding_title: "Знакомьтесь с вашим коучем",
    onboarding_goal: "Чего вы хотите от английского сейчас?",
    onboarding_minutes: "Сколько времени в день?",
    onboarding_go: "Составить план", min: "{n} мин",
    nothing_title: "Сегодня ничего срочного", nothing_sub: "Вы держите цель под контролем. Свободная практика открыта.",
    free_practice: "Свободная практика",
    handoff_up: "Теперь ваш коуч — {to}", handoff_down: "Теперь ваш коуч — {to}. Всё изученное сохранено.",
    handoff_ok: "Поехали", see_plans: "Тарифы",
    loading: "Составляем практику…", error: "Не удалось загрузить план.", retry: "Ещё раз",
    save_pending: "Часть ответов пока не сохранилась. Продолжайте, мы повторим попытку, или нажмите «Ещё раз».",
    save_failed: "Ответы пока не сохранились", save_failed_sub: "Проверьте подключение и попробуйте снова. Пока страница открыта, ответы не потеряются.",
    how_planned: "Почему именно это?", review_due: "Пора повторить",
    goal_switch_locked: "Смена цели — в тарифе Learner",
    goal_everyday: "Английский на каждый день: слова и грамматика для жизни", goal_vocabulary: "Расширить словарный запас", goal_grammar_basics: "Подтянуть основы грамматики",
  },
};

// Persona lines (voice only). Missing keys fall back to SHARED.
const PERSONA = {
  vira: {
    en: { hello: "Hi, I'm Vira. Give me {n} {mins} and I'll show you the best things to work on today.", done_title: "Nice work today!", upsell: "Want to keep going? Velvet gives you a second session every day." },
    uz: { hello: "Salom, men Vira. Menga {n} daqiqa bering — bugun nima ustida ishlashni ko'rsataman.", done_title: "Bugun zo'r ishladingiz!", upsell: "Davom etmoqchimisiz? Velvet har kuni ikkinchi mashg'ulot beradi." },
    ru: { hello: "Привет, я Вира. Дайте мне {n} {mins}, и я покажу, над чем лучше всего поработать сегодня.", done_title: "Отличная работа сегодня!", upsell: "Хотите продолжить? С Velvet — вторая сессия каждый день." },
  },
  velvet: {
    en: { hello: "I'm Velvet. I've looked at where you are. Here's your plan for today.", done_title: "That's today's plan done. Nice work." },
    uz: { hello: "Men Velvet. Qayerda ekaningizni ko'rib chiqdim. Mana bugungi rejangiz.", done_title: "Bugungi reja bajarildi. Zo'r ishladingiz." },
    ru: { hello: "Я Velvet. Я посмотрела, где вы сейчас. Вот ваш план на сегодня.", done_title: "План на сегодня выполнен. Отличная работа." },
  },
  vi: {
    en: { hello: "VI here. Highest-value work first: weak spots, then reviews, then new ground.", done_title: "Session complete. Your map is updated." },
    uz: { hello: "VI. Avval eng muhimi: zaif joylar, keyin takrorlash, keyin yangi mavzular.", done_title: "Mashg'ulot yakunlandi. Xaritangiz yangilandi." },
    ru: { hello: "Это VI. Сначала самое ценное: слабые места, затем повтор, затем новое.", done_title: "Сессия завершена. Карта обновлена." },
  },
};

export const COACH_NAMES = { vira: "Vira", velvet: "Velvet", vi: "VI" };
export const COACH_COLORS = { vira: "#B79CF2", velvet: "#8E3B7A", vi: "#D4AF37" };

const fill = (s, vars = {}) => String(s ?? "").replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));

/** "minute(s)" agreeing with n (accusative in ru: 1 минуту, 2 минуты, 5 минут); uz needs no agreement. */
export function minutesWord(lang, n) {
  const k = Math.abs(Math.trunc(Number(n) || 0));
  if (lang === "ru") return k % 10 === 1 && k % 100 !== 11 ? "минуту" : k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14) ? "минуты" : "минут";
  if (lang === "uz") return "daqiqa";
  return k === 1 ? "minute" : "minutes";
}

/** coachT(lang, persona)(key, vars): persona line -> shared line -> English. */
export function coachT(lang = "en", persona = "vira") {
  const L = ["en", "uz", "ru"].includes(lang) ? lang : "en";
  return (key, vars) => {
    const p = PERSONA[persona]?.[L]?.[key] ?? PERSONA[persona]?.en?.[key];
    const s = p ?? SHARED[L][key] ?? SHARED.en[key] ?? key;
    return fill(s, vars && vars.n !== undefined ? { mins: minutesWord(L, vars.n), ...vars } : vars);
  };
}

/** Goal name in the learner's language. English (and any goal without a translation) keeps the server's objective text. */
export function goalLabel(t, g) {
  const k = `goal_${g?.id}`;
  const s = t(k);
  return s === k ? g?.objective : s;
}

/** Server label ("New" | "Needs work" | "Practising" | "Strong") -> localized. */
export function labelKey(label) {
  return { "New": "label_new", "Needs work": "label_weak", "Practising": "label_learning", "Strong": "label_solid" }[label] || "label_new";
}

/** Server short_reason -> localized key. */
export function reasonKey(r) {
  const s = String(r || "").toLowerCase();
  if (s.includes("review") || s === "due") return s === "due" ? "review_due" : "reason_review";
  if (s.includes("need") || s.includes("weak")) return "reason_weak";
  if (s.includes("first") || s.includes("comes")) return "reason_prereq";
  if (s.includes("new")) return "reason_new";
  return "reason_practice";
}
