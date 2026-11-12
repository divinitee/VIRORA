// Vira mascot MVP (2026-11-13). Scripted, no AI: a pose + a line per moment.
// Pure (no React). Poses live in public/assets/vira/<mood>/vira_base_<mood>_<nn>.webp
// (source of truth: Desktop/VIRORA/Mascots and Characters/vira/base/app on Tee's Mac).
// To add poses: copy the files in and widen the [first, last] range in POSES.
// Lines follow the app language (useAppLang). Formal "siz"/"вы" to match the app.

// mood -> [first, last] pose number available
export const POSES = {
  neutral: [1, 11],
  wave: [1, 12],
  cheerful: [1, 10],
  proud: [1, 13],
  disappointed: [2, 13],
  sleepy: [1, 10],
  surprised: [1, 10],
  curious: [1, 12],
  cheeky: [1, 9],
};

// moment -> moods Vira may show for it
export const MOMENT_MOODS = {
  first: ["wave", "neutral"],
  dayTwo: ["wave", "cheerful"],
  streak: ["proud", "cheerful", "cheeky"],
  gap: ["disappointed"],
  todayDone: ["cheerful", "proud", "cheeky"],
  sessionEnd: ["sleepy"],
  lessonDone: ["proud", "cheerful", "surprised"],
};

export const LINES = {
  first: {
    en: ["Hi! I'm Vira. I'll show you the way here.", "It's simple: a few minutes a day, and leave the rest to me.", "Let's start with your first practice. Ready?"],
    uz: ["Salom! Men Vira. Shu yerda sizga yo'l ko'rsataman.", "Hammasi oddiy: kuniga bir necha daqiqa, qolganini menga qo'yib bering.", "Birinchi mashqdan boshlaymiz. Tayyormisiz?"],
    ru: ["Привет! Я Вира. Я покажу вам, что здесь к чему.", "Всё просто: несколько минут в день, остальное на мне.", "Начнём с первой практики. Готовы?"],
  },
  dayTwo: {
    en: ["You came back. That was the hard part. Let's go.", "Day two. This is where most people stop. Not you.", "I was waiting for you. Your seat is ready."],
    uz: ["Qaytdingiz. Eng qiyini shu edi. Ketdik.", "Ikkinchi kun. Ko'pchilik shu yerda to'xtaydi. Siz emas.", "Sizni kutayotgandim. Joyingiz tayyor."],
    ru: ["Вы вернулись. Это было самое сложное. Поехали.", "Второй день. Многие на нём сдаются. Но не вы.", "Я вас ждала. Ваше место свободно."],
  },
  streak: {
    en: ["{n} days in a row. Don't think I didn't notice.", "You again? I like this habit.", "Day {n}. Let's not break it today."],
    uz: ["Ketma-ket {n} kun. Sezmadim deb o'ylamang.", "Yana keldingizmi? Menga bu odat yoqyapti.", "{n}-kun. Bugun ham uzmaymiz."],
    ru: ["Серия: {n}. Не думайте, что я не заметила.", "Снова вы? Мне нравится эта привычка.", "День {n}. Сегодня тоже не прерываем."],
  },
  gap: {
    en: ["I noticed. I'm not angry. Five minutes?", "It's been a while. Fine, where were we?", "Your words missed you. Me too, a little."],
    uz: ["Sezdim. Jahlim chiqqani yo'q. Besh daqiqa, xo'pmi?", "Anchadan beri ko'rinmadingiz. Mayli, qayerda to'xtagan edik?", "So'zlar sizni sog'indi. Men ham, ozgina."],
    ru: ["Я заметила. Не сержусь. Пять минут, идёт?", "Давно вас не было. Ладно, на чём мы остановились?", "Слова по вам соскучились. Я тоже, немного."],
  },
  todayDone: {
    en: ["Today's done. Want one more round, or shall we rest?", "That's today's practice. Little, but every day. That's the secret.", "Done for today. See you tomorrow."],
    uz: ["Bugungisi tayyor. Yana bir raund, yoki dam olamizmi?", "Bugungi mashq shu. Kam, lekin har kuni. Sir shunda.", "Bugunga yetadi. Ertaga ko'rishamiz."],
    ru: ["На сегодня готово. Ещё раунд или отдохнём?", "Вот и практика на сегодня. Мало, но каждый день. В этом весь секрет.", "На сегодня всё. До завтра."],
  },
  sessionEnd: {
    en: ["That's enough for today. I'm off for a little nap.", "Good work. We'll continue from here tomorrow.", "Little, but every day. That's the secret."],
    uz: ["Bugunga yetadi. Men biroz dam olaman.", "Yaxshi ishladik. Ertaga shu yerdan davom etamiz.", "Kam, lekin har kuni. Sir shunda."],
    ru: ["На сегодня хватит. Я пойду немного вздремну.", "Хорошо поработали. Завтра продолжим с этого места.", "Мало, но каждый день. В этом весь секрет."],
  },
  lessonDone: {
    en: ["See? You know more than you think.", "You didn't even need me for that one.", "Clean work. On to the next?"],
    uz: ["Ko'rdingizmi? O'ylaganingizdan ko'proq bilar ekansiz.", "Bu safar yordamim kerak ham bo'lmadi.", "Toza ish. Keyingisiga o'tamizmi?"],
    ru: ["Видите? Вы знаете больше, чем вам кажется.", "В этот раз я вам даже не понадобилась.", "Чистая работа. Идём дальше?"],
  },
};

/** Which welcome moment fits the Home screen, from the ComebackCard server state. */
export function homeMoment(state) {
  if (!state?.streak) return null;
  const { current = 0, best = 0, today_done } = state.streak;
  if (today_done) return "todayDone";
  if (current >= 2) return "streak";
  if (current === 1) return "dayTwo";
  if (best > 0) return "gap";
  return "first";
}

// Avoid showing the same item twice in a row for a given key (per browser).
function pickIndex(key, len) {
  if (len <= 1) return 0;
  let last = -1;
  try { last = Number(localStorage.getItem(key)); } catch { /* ignore */ }
  let i = Math.floor(Math.random() * len);
  if (i === last) i = (i + 1) % len;
  try { localStorage.setItem(key, String(i)); } catch { /* ignore */ }
  return i;
}

/** { src, text } for a moment, or null if the moment is unknown. */
export function viraFor(moment, lang = "en", vars = {}) {
  const set = LINES[moment];
  if (!set) return null;
  const lines = set[lang] || set.en;
  let text = lines[pickIndex(`vira_line_${moment}_${lang}`, lines.length)];
  for (const [k, v] of Object.entries(vars)) text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  const moods = MOMENT_MOODS[moment] || ["neutral"];
  const mood = moods[pickIndex(`vira_mood_${moment}`, moods.length)];
  const [first, last] = POSES[mood] || POSES.neutral;
  const nn = String(first + pickIndex(`vira_pose_${mood}`, last - first + 1)).padStart(2, "0");
  const src = `/assets/vira/${mood}/vira_base_${mood}_${nn}.webp`;
  return { src, text, mood };
}
