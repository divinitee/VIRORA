// Vira mascot MVP (2026-11-13). Scripted, no AI.
// Each moment has 10 lines; EACH LINE carries its own mood, and the pose is
// picked from that mood's folder, so the picture always fits the words.
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
  cheeky: [1, 8],
};

const L = (mood, en, uz, ru) => ({ mood, en, uz, ru });

export const LINES = {
  // First visit, no practice ever finished
  first: [
    L("wave", "Hi! I'm Vira. I'll show you around.", "Salom! Men Vira. Sizga hammasini ko'rsatib beraman.", "Привет! Я Вира. Я всё вам покажу."),
    L("wave", "Welcome to VIRORA. I'm your guide here.", "VIRORA'ga xush kelibsiz. Men shu yerda sizning yo'lboshchingizman.", "Добро пожаловать в VIRORA. Я ваш гид здесь."),
    L("wave", "First time here? Good. Stay close to me.", "Shu yerda birinchi martami? Yaxshi. Men bilan bo'ling.", "Вы здесь впервые? Отлично. Держитесь меня."),
    L("wave", "Hello! Let's make English a daily habit.", "Salom! Keling, ingliz tilini kundalik odatga aylantiramiz.", "Привет! Давайте сделаем английский ежедневной привычкой."),
    L("cheerful", "It's simple: a few minutes a day, I'll do the rest.", "Hammasi oddiy: kuniga bir necha daqiqa, qolganini o'zim qilaman.", "Всё просто: несколько минут в день, остальное на мне."),
    L("cheerful", "Small steps every day. That's how it works.", "Har kuni kichik qadamlar. Hammasi shunday ishlaydi.", "Маленькие шаги каждый день. Так это и работает."),
    L("cheerful", "I'm happy you're here. Let's start easy.", "Shu yerdaligingizdan xursandman. Osondan boshlaymiz.", "Я рада, что вы здесь. Начнём с простого."),
    L("neutral", "Start with today's practice. I picked it for you.", "Bugungi mashqdan boshlang. Uni siz uchun tanladim.", "Начните с практики на сегодня. Я выбрала её для вас."),
    L("neutral", "Don't worry about mistakes. That's how we learn.", "Xatolardan qo'rqmang. Biz shunday o'rganamiz.", "Не бойтесь ошибок. Так мы и учимся."),
    L("neutral", "First practice first. Ready?", "Avval birinchi mashq. Tayyormisiz?", "Сначала первая практика. Готовы?"),
  ],
  // Streak is 1 and today not done yet (the day-two return)
  dayTwo: [
    L("wave", "You came back. That was the hard part.", "Qaytdingiz. Eng qiyini shu edi.", "Вы вернулись. Это было самое сложное."),
    L("wave", "Welcome back! Your seat is ready.", "Xush kelibsiz! Joyingiz tayyor.", "С возвращением! Ваше место свободно."),
    L("wave", "Day two. I was waiting for you.", "Ikkinchi kun. Sizni kutayotgandim.", "Второй день. Я вас ждала."),
    L("cheerful", "Day two. Most people stop here. Not you.", "Ikkinchi kun. Ko'pchilik shu yerda to'xtaydi. Siz emas.", "Второй день. Многие на нём сдаются. Но не вы."),
    L("cheerful", "Two days in a row. That already looks like a habit.", "Ketma-ket ikki kun. Bu allaqachon odatga o'xshayapti.", "Два дня подряд. Это уже похоже на привычку."),
    L("cheerful", "Yesterday's words are still here. Let's check them.", "Kechagi so'zlar hali ham shu yerda. Ularni tekshiramiz.", "Вчерашние слова никуда не делись. Давайте их проверим."),
    L("cheerful", "Good to see you again. Let's keep going.", "Sizni yana ko'rganimdan xursandman. Davom etamiz.", "Рада снова вас видеть. Продолжаем."),
    L("cheeky", "Oh, you remembered me. I'm touched.", "O, meni eslabsiz-ku. Ta'sirlandim.", "О, вы меня вспомнили. Я тронута."),
    L("cheeky", "Back already? I like your style.", "Qaytdingizmi? Uslubingiz menga yoqdi.", "Уже вернулись? Мне нравится ваш подход."),
    L("cheeky", "Day two and still here. Impressive.", "Ikkinchi kun, siz esa hali ham shu yerdasiz. Zo'r.", "Второй день, а вы всё ещё здесь. Впечатляет."),
  ],
  // Streak 2+ and today not done yet. {n} = streak days
  streak: [
    L("proud", "{n} days in a row. Don't think I didn't notice.", "Ketma-ket {n} kun. Sezmadim deb o'ylamang.", "Серия: {n}. Не думайте, что я не заметила."),
    L("proud", "Day {n}. Let's not break it today.", "{n}-kun. Bugun ham uzmaymiz.", "День {n}. Сегодня тоже не прерываем."),
    L("proud", "A {n}-day streak. That's real work.", "{n} kunlik streak. Bu haqiqiy mehnat.", "{n}-й день подряд. Это настоящая работа."),
    L("proud", "You keep showing up. That's the secret.", "Siz har kuni kelyapsiz. Sir ham shunda.", "Вы приходите каждый день. В этом и секрет."),
    L("cheeky", "You again? I like this habit.", "Yana sizmi? Menga bu odat yoqyapti.", "Снова вы? Мне нравится эта привычка."),
    L("cheeky", "Day {n}. Careful, I might get used to this.", "{n}-kun. Ehtiyot bo'ling, ko'nikib qolishim mumkin.", "День {n}. Осторожно, я могу к этому привыкнуть."),
    L("cheeky", "Your streak looks good. Let's keep it that way.", "Streakingiz chiroyli ko'rinyapti. Shunday qolsin.", "Ваша серия отлично выглядит. Пусть так и остаётся."),
    L("cheerful", "Back again! Day {n}, here we go.", "Yana qaytdingiz! {n}-kun, boshladik.", "Снова здесь! День {n}, поехали."),
    L("cheerful", "I knew you'd come. Today's practice is ready.", "Kelishingizni bilardim. Bugungi mashq tayyor.", "Я знала, что вы придёте. Практика на сегодня готова."),
    L("cheerful", "{n} days strong. Let's add one more.", "Ketma-ket {n} kun. Yana bittasini qo'shamiz.", "Уже день {n}. Добавим ещё один."),
  ],
  // Had a streak before, now 0
  gap: [
    L("disappointed", "I noticed. I'm not angry. Five minutes?", "Sezdim. Jahlim chiqqani yo'q. Besh daqiqa, xo'pmi?", "Я заметила. Не сержусь. Пять минут, идёт?"),
    L("disappointed", "Your words missed you. Me too, a little.", "So'zlar sizni sog'indi. Men ham, ozgina.", "Слова по вам соскучились. Я тоже, немного."),
    L("disappointed", "The streak is gone, but you're not. Let's start again.", "Streak yo'qoldi, lekin siz shu yerdasiz. Qaytadan boshlaymiz.", "Серия прервалась, но вы здесь. Начнём заново."),
    L("disappointed", "I waited. It's okay. Today counts too.", "Kutdim. Hechqisi yo'q. Bugun ham hisobga kiradi.", "Я ждала. Ничего страшного. Сегодня тоже считается."),
    L("disappointed", "A short break is fine. A long one is not. Come on.", "Qisqa tanaffus mayli. Uzuni emas. Qani, ketdik.", "Короткий перерыв — это нормально. Длинный — нет. Давайте."),
    L("disappointed", "One small practice and we're back on track.", "Bitta kichik mashq va yana yo'ldamiz.", "Одна маленькая практика — и мы снова в деле."),
    L("curious", "It's been a while. Where were we?", "Anchadan beri ko'rinmadingiz. Qayerda to'xtagan edik?", "Давно вас не было. На чём мы остановились?"),
    L("curious", "Busy days? Let's see what you still remember.", "Band kunlarmi? Keling, nimani eslab qolganingizni ko'ramiz.", "Были заняты? Давайте посмотрим, что вы помните."),
    L("neutral", "No stress. Let's pick up where you left off.", "Stress yo'q. To'xtagan joyingizdan davom etamiz.", "Без стресса. Продолжим с того места, где вы остановились."),
    L("neutral", "Welcome back. Today is a good day to restart.", "Xush kelibsiz. Bugun qaytadan boshlash uchun yaxshi kun.", "С возвращением. Сегодня хороший день, чтобы начать заново."),
  ],
  // Today's practice already finished (Home)
  todayDone: [
    L("proud", "Done for today. Well played.", "Bugungisi tayyor. Zo'r o'ynadingiz.", "На сегодня всё. Отлично сыграно."),
    L("proud", "That's today's practice. Little, but every day.", "Bugungi mashq shu. Kam, lekin har kuni.", "Вот и практика на сегодня. Мало, но каждый день."),
    L("proud", "You did your part today. I'm proud of you.", "Bugun o'z ishingizni qildingiz. Siz bilan faxrlanaman.", "Сегодня вы сделали своё дело. Я горжусь вами."),
    L("proud", "Practice done. Tomorrow we go a bit further.", "Mashq tugadi. Ertaga biroz uzoqroqqa boramiz.", "Практика готова. Завтра пойдём чуть дальше."),
    L("cheerful", "Done! Want one more round, or rest?", "Tayyor! Yana bir raundmi, yoki dam olamizmi?", "Готово! Ещё раунд или отдохнём?"),
    L("cheerful", "Nice work today. See you tomorrow.", "Bugun yaxshi ishladingiz. Ertaga ko'rishamiz.", "Хорошая работа сегодня. До завтра."),
    L("cheerful", "Today: done. Mood: great.", "Bugun: bajarildi. Kayfiyat: a'lo.", "Сегодня: сделано. Настроение: отличное."),
    L("cheeky", "Already done? Show-off.", "Allaqachon tugatdingizmi? Maqtanchoq.", "Уже всё? Хвастунишка."),
    L("cheeky", "Streak safe. You can relax. A little.", "Streak xavfsiz. Dam olsangiz bo'ladi. Ozgina.", "Серия в безопасности. Можно расслабиться. Чуть-чуть."),
    L("cheeky", "More practice? I won't stop you.", "Yana mashqmi? Men to'xtatmayman.", "Ещё практики? Я вас не остановлю."),
  ],
  // Coach session finished (Vira's plan)
  sessionEnd: [
    L("sleepy", "That's enough for today. I'm off for a little nap.", "Bugunga yetadi. Men biroz mizg'ib olaman.", "На сегодня хватит. Я пойду немного вздремну."),
    L("sleepy", "Good work. We'll continue from here tomorrow.", "Yaxshi ishladik. Ertaga shu yerdan davom etamiz.", "Хорошо поработали. Завтра продолжим с этого места."),
    L("sleepy", "Little, but every day. That's the secret.", "Kam, lekin har kuni. Sir shunda.", "Мало, но каждый день. В этом весь секрет."),
    L("sleepy", "My work is done. Yours too. Rest now.", "Mening ishim tugadi. Sizniki ham. Endi dam oling.", "Моя работа сделана. Ваша тоже. Теперь отдыхайте."),
    L("sleepy", "Time for tea and a break. See you tomorrow.", "Choy va tanaffus vaqti. Ertaga ko'rishamiz.", "Время для чая и отдыха. До завтра."),
    L("sleepy", "Your brain needs rest to remember. Off you go.", "Eslab qolish uchun miyangizga dam kerak. Boravering.", "Чтобы запомнить, мозгу нужен отдых. Идите отдыхайте."),
    L("sleepy", "I'm closing my notebook for today. You did well.", "Bugunga daftarimni yopaman. Yaxshi ishladingiz.", "На сегодня закрываю тетрадь. Вы молодец."),
    L("cheerful", "Session done! Tomorrow I'll have a new plan for you.", "Mashg'ulot tugadi! Ertaga siz uchun yangi reja bo'ladi.", "Занятие окончено! Завтра у меня будет для вас новый план."),
    L("cheerful", "Nice. Want to play a game in Skill Hub while I rest?", "Zo'r. Men dam olayotganimda Skill Hub'da o'ynab turasizmi?", "Отлично. Пока я отдыхаю, может, сыграете в Skill Hub?"),
    L("proud", "Everything for today is done. That's a full day.", "Bugungi hammasi bajarildi. To'liq kun bo'ldi.", "Всё на сегодня сделано. Вот это полный день."),
  ],
  // Lesson passed (LessonRunner)
  lessonDone: [
    L("proud", "See? You know more than you think.", "Ko'rdingizmi? O'ylaganingizdan ko'proq bilasiz.", "Видите? Вы знаете больше, чем вам кажется."),
    L("proud", "You didn't even need me for that one.", "Bu safar yordamim kerak ham bo'lmadi.", "В этот раз я вам даже не понадобилась."),
    L("proud", "Clean work. On to the next?", "Toza ish. Keyingisiga o'tamizmi?", "Чистая работа. Идём дальше?"),
    L("proud", "Lesson passed. That one's yours now.", "Dars topshirildi. Endi bu sizniki.", "Урок пройден. Теперь это ваше."),
    L("surprised", "Wait, already? That was fast!", "To'xtang, allaqachonmi? Juda tez bo'ldi!", "Подождите, уже? Это было быстро!"),
    L("surprised", "Wow. I didn't expect that score.", "Voy. Bunday natijani kutmagandim.", "Ого. Не ожидала такого результата."),
    L("surprised", "Did you study in secret? Be honest.", "Yashirincha o'qidingizmi? Rostini ayting.", "Вы тайно занимались? Признавайтесь."),
    L("cheerful", "Another lesson done. Slowly, but surely.", "Yana bir dars ortda qoldi. Sekin, lekin aniq.", "Ещё один урок позади. Медленно, но верно."),
    L("cheerful", "Not bad. Actually, really good.", "Yomon emas. Aslida, juda yaxshi.", "Неплохо. На самом деле, очень хорошо."),
    L("cheerful", "That's how it's done. Keep this energy.", "Mana shunday bo'ladi. Shu ruhni saqlang.", "Вот так это делается. Сохраняйте этот настрой."),
  ],
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

// Random pick that never repeats the last one for this key (per browser).
function pickIndex(key, len) {
  if (len <= 1) return 0;
  let last = -1;
  try { last = Number(localStorage.getItem(key)); } catch { /* ignore */ }
  let i = Math.floor(Math.random() * len);
  if (i === last) i = (i + 1) % len;
  try { localStorage.setItem(key, String(i)); } catch { /* ignore */ }
  return i;
}

/** { src, text, mood } for a moment, or null if the moment is unknown. */
export function viraFor(moment, lang = "en", vars = {}) {
  const set = LINES[moment];
  if (!set?.length) return null;
  const line = set[pickIndex(`vira_line_${moment}`, set.length)];
  let text = line[lang] || line.en;
  for (const [k, v] of Object.entries(vars)) text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  const mood = POSES[line.mood] ? line.mood : "neutral";
  const [first, last] = POSES[mood];
  const nn = String(first + pickIndex(`vira_pose_${mood}`, last - first + 1)).padStart(2, "0");
  return { src: `/assets/vira/${mood}/vira_base_${mood}_${nn}.webp`, text, mood };
}
