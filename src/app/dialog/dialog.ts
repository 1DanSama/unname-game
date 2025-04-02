export const dialogs = [
  {
    "scenes": [
      {
        id: 1,
        "activeCharacterName": "Дід",
        "speechContext": "Прокидайся! Сьогодні твій чотирнадцятий день народження, і настав час виконати свій перший гільдійський квест!",
        "speechDescription": "Початок - пробудження",
        "backgroundImg": "assets/dialogData/background/room.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 2,
        "activeCharacterName": "Головний герой",
        "speechContext": "Я не сплю, дідусю!",
        "speechDescription": "Відповідь головного героя",
        "backgroundImg": "assets/dialogData/background/room.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 3,
        "activeCharacterName": "Дід",
        "speechContext": "Ха-ха, добре, [ім'я]! Йди до таверни, тобі потрібно найняти своїх перших найманців! Раджу найняти 1 хіла, 1 воїна 1 мага та 1 розвідника.",
        "speechDescription": "Настанова діда",
        "backgroundImg": "assets/dialogData/background/room.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 4,
        "activeCharacterName": "Головний герой",
        "speechContext": "Привіт, [ім'я обслуги]! Як справи?",
        "speechDescription": "Вхід до таверни",
        "backgroundImg": "assets/dialogData/background/tavern-room.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 5,
        "activeCharacterName": "Обслуга таверни",
        "speechContext": "О, [ім'я ГГ], ти сьогодні так рано. Вітаю тебе з чотирнадцятиріччям! У мене день чудовий, а твій?",
        "speechDescription": "Вітання в таверні",
        "backgroundImg": "assets/dialogData/background/tavern-room.jpg",
        "activeCharacterAvatar": "assets/characters/111.png",
        "avatarPosition": "left"
      },
      {
        id: 6,
        "activeCharacterName": "Головний герой",
        "speechContext": "Мій день просто неймовірний! Сьогодні я виконаю свій перший гільдійський квест разом із дідусем!",
        "speechDescription": "Ентузіазм героя",
        "backgroundImg": "assets/dialogData/background/tavern-room.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 7,
        "activeCharacterName": "Обслуга таверни",
        "speechContext": "Це чудовий подарунок для юного авантюриста. Хочеш пораду щодо найму?",
        choise: [
          {text: '1. Так', pathId: 8},
          {text: '2. Ні', pathId: 9},
        ],
        "speechDescription": "Вибір гравця",
        "backgroundImg": "assets/dialogData/background/tavern-room.jpg",
        "activeCharacterAvatar": "assets/characters/111.png",
        "avatarPosition": "left"
      },
      {
        id: 8,
        "activeCharacterName": "Обслуга таверни",
        "speechContext": "Воїни акцентують увагу ворога на собі, і дають магам спокійно чаклувати, а розвідники відносно спокійно обійти ворожий авантард, що б атакувати в спину. Але без лікарів всі вони проживуть не довго. В будь-якій групі має бути хоча б 1 воїн, хоча б 1 лікар та хоча б 1 маг чи розвідник.",
        "speechDescription": "Пояснення обслуги таверни",
        "backgroundImg": "assets/dialogData/background/tavern-room.jpg",
        "activeCharacterAvatar": "assets/characters/111.png",
        "avatarPosition": "left"
      },
      {
        id: 9,
        "activeCharacterName": "Обслуга гільдії",
        "speechContext": "З днем народження, [ім'я]! Як подарунок, я приберіг для тебе два хороші квести з доставки їжі в одне місце. За даними розвідки, на маршруті не було помічено небезпеки, тому все має пройти спікійно.",
        "speechDescription": "Реєстрація в гільдії",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/116.png",
        "avatarPosition": "left"
      },
      {
        id: 10,
        "activeCharacterName": "Головний герой",
        "speechContext": "Зі мню поїде мій дідусь, також я найняв найманців для охорони вантажу, тож все має пройти добре",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 11,
        "activeCharacterName": "Обслуга гільдії",
        "speechContext": "Все рівно будь на сторожі! Ворог може бути де завгодно, навіть в межах міста. Темний бог має здатність створювати мирзенних створінь де йому заманеться. Звичайно ми ближче до освяченої землі і нас захищають аванпости. Сильних монстрів вони наврядчи пропустять, але дрібноту можуть.",
        "speechDescription": "Реєстрація в гільдії",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/116.png",
        "avatarPosition": "left"
      },
      {
        id: 12,
        "activeCharacterName": "Обслуга гільдії",
        "speechContext": " Авантюристи першого кола не побіжать за парою десятків гоблінів, ризикуючи бути не готовими до приходу чогось серйознішого, наприкад велитня чи химери. Тому розслаблятися не варто навіть в ліжку своєї кімнати!",
        "speechDescription": "Реєстрація в гільдії",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/116.png",
        "avatarPosition": "left"
      },
      {
        id: 13,
        "activeCharacterName": "Головний герой",
        "speechContext": "Дякую за пораду, але зі мною буде мій дідусь, тому я в повній безпеці!",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 14,
        "activeCharacterName": "Обслуга гільдії",
        "speechContext": "Все ж будь обережний та враховуй ризики при командуванні.",
        "speechDescription": "Реєстрація в гільдії",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/116.png",
        "avatarPosition": "left"
      },
      {
        id: 15,
        "activeCharacterName": "Головний герой",
        "speechContext": "Добре, дякую за пораду",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 16,
        "activeCharacterName": "",
        "speechContext": "*ззаду наближається дід*",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 17,
        "activeCharacterName": "Дід",
        "speechContext": "[Обслуга гільдії], доброго ранку! Дякую що навчаєш мого малого!",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "left"
      },
      {
        id: 18,
        "activeCharacterName": "Обслуга гільдії",
        "speechContext": "(відповідає сухо) Шановний [ім*я діда], доброго ранку. Я дбаю про кожного авантюриста моєї гільдії, нинішнього, потенційного чи колишнього.",
        "speechDescription": "(відповідає сухо)",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/116.png",
        "avatarPosition": "left"
      },
      {
        id: 19,
        "activeCharacterName": "Дід",
        "speechContext": "Дякуємо, ми це дійсно цінуємо. [ім*я ГГ], Гільдія дбає про авантюристів, а авантюристи про гільдію, це основа нашої життєдіяльності, запам'ятай це.",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "left"
      },
      {
        id: 20,
        "activeCharacterName": "Головний герой",
        "speechContext": "Знаю, дідусю! Я обов'язково буду дбати про своїх друзів з гільдії та про саму гільдію!",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 21,
        "activeCharacterName": "Дід",
        "speechContext": "Молодець, так тримати! [Ім'я Обслуга гільдії] Нам вже пора на ринок, бережи себе, гарного дня!",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "left"
      },
      {
        id: 22,
        "activeCharacterName": "Обслуга гільдії",
        "speechContext": "(відповідає сухо) І ви бережіть себе, шановні. Бажаю вдачі.",
        "speechDescription": "(відповідає сухо)",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/116.png",
        "avatarPosition": "left"
      },
      {
        id: 23,
        "activeCharacterName": "",
        "speechContext": "*Черех 15 хвилин пішого ходу.*",
        "speechDescription": "Поради діда",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": "left"
      },
      {
        id: 24,
        "activeCharacterName": "Дід",
        "speechContext": "От ми і на ринку. Пам'ятаєш що тобі треба купити?",
        "speechDescription": "Поради діда",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "left"
      },
      {
        id: 25,
        "activeCharacterName": "Головний герой",
        "speechContext": "Так, дідусь, я взяв сувій з описом вимог. Я знайду і придбаю товір, а ти поки домовся з гільдією логістів, добре?",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 26,
        "activeCharacterName": "Дід",
        "speechContext": "Добре, зустрінемося тут хвилин через 20.",
        "speechDescription": "Поради діда",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "left"
      },
      {
        id: 27,
        "activeCharacterName": "",
        "speechContext": "*Через 20 хвилин*",
        "speechDescription": "Поради діда",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": "left"
      },
      {
        id: 28,
        "activeCharacterName": "Головний герой",
        "speechContext": "Дідусю, дякую що привів логістів. Хлопці, сюди, я покажу де куплений мною товар. Завантажуйте його обережно",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 29,
        "activeCharacterName": "",
        "speechContext": "*Логісти з мінімальними коментарями виконують накази*",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": "right"
      },
      {
        id: 30,
        "activeCharacterName": "",
        "speechContext": "*Ще через хвилин 30*",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": "right"
      },
      {
        id: 31,
        "activeCharacterName": "Головний логіст",
        "speechContext": "Товар завантажений, караван готовий відбувати",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/117.png",
        "avatarPosition": "left"
      },
      {
        id: 32,
        "activeCharacterName": "Головний герой",
        "speechContext": "Найманці, займіть місця в возах. Я з ді... з майстром [Ім'я діда] поїдемо попереду, всім інший зайняти місця в возах відповідно ролі в групі.",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 33,
        "activeCharacterName": "Головний герой",
        "speechContext": "Відбуваємо!",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 34,
        "activeCharacterName": "",
        "speechContext": "*Через години дві дороги десь з далеку стало чутно швидко скачучого вершника.*",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "",
        "activeCharacterAvatar": "",
        "avatarPosition": "right"
      },
      {
        id: 35,
        "activeCharacterName": "Посланець",
        "speechContext": "Майстер [Ім'я діда], біля східного пункту пропуску в приміський район було помічено дракона, вам терміново треба йти туди! Також усьому каравану треба бути обережніше, я чув що в околоцях цього ранку на мандрівників напав маленький загін з гоблінами. Здається, поки я сюди мчав - бачив одного здалеку.",
        "speechDescription": "Тривожна звістка",
        "activeCharacterAvatar": "assets/characters/121.png",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "avatarPosition": "left"
      },
      {
        id: 36,
        "activeCharacterName": "Дід",
        "speechContext": "Я попрямую до східного пункту пропуску до околиць міста. Будьте обережні, більшу половину шляху ми подолали. Доберіться до пункту призначення та очікуйте на подальші вказівки там!",
        "speechDescription": "Наслідки провалу",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 37,
        "activeCharacterName": "",
        "speechContext": "*Дід поскакав у вказаному напрямку*",
        "speechDescription": "Дід поскакав у вказаному напрямку",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 38,
        "activeCharacterName": "",
        "speechContext": "*через 30 хв дороги ГГ бачить групу з 3-х авантюристів. Група зупиняється біля групи авантюристів, що махають їм з узлісся.*",
        "speechDescription": "Дід поскакав у вказаному напрямку",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 39,
        "activeCharacterName": "Головний авантюрист",
        "speechContext": "*Стійте! Ми бачили сліди гоблінів-розвідників он в тому напрямку. Схоже вони збирали інформацію. Думаю десь не подалік є більша група монстрів. Тут не далеко є печера, ми думаємо там окопатися ті тримати оборону, ходімо з нами?*",
        "speechDescription": "Дід поскакав у вказаному напрямку",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/123.png",
        "avatarPosition": "right"
      },
      {
        id: 40,
        "activeCharacterName": "Лідер логістів",
        "speechContext": "[Ім'я ГГ], можливо, варто прислухатися? Якщо гобліни-розвідники вже неподалік, то...",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/117.png",
        "avatarPosition": "right"
      },
      {
        id: 41,
        "activeCharacterName": "ГГ",
        "speechContext": "Дякую за пропозицію, але, думаю якщо ми поспішимо - то встигнемо проскочити. Дістатися до західного форту. Там чекають поставку їжі від нас. Пропоную вам приєднатися до нас, в наших возах вистачить на вас місця.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 42,
        "activeCharacterName": "Головний авантюрист",
        "speechContext": "Дякую, та я відмовлюся. В нас в гільдії є домовленість, що в разі небезпеки ми маємо зібратися в певних місціх, залежних від нашого поточного місце перебування. На скільки мені відомо - до печери прямує ще 3 групи. Думаю разом в нас буде хороший шанс відбитися.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/123.png",
        "avatarPosition": "right"
      },
      {
        id: 43,
        "activeCharacterName": "ГГ",
        "speechContext": "Враховуйте що на околицях міста був помічений дракон. В печері ви будете легкою здобиччю, якщо він сюди добереться.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 44,
        "activeCharacterName": "Головний авантюрист",
        "speechContext": "Ого, не чув про дракона. В будь-якому випадку вважаю, що якщо він сюди добереться - погано буде всім. Ми ж в декількох годинах їзди від міста, для дракона це лічені хвилини польоту. Все ж я вважаю що продовжувати шлях буде більше небезпечно, тому відмовлюся від вашої пропозиції, бережіть себе, удачі вам в дорозі!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/123.png",
        "avatarPosition": "right"
      },
      {
        id: 45,
        "activeCharacterName": "ГГ",
        "speechContext": "Зрозумів. І ви бережіть себе, удачі нам обом!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 46,
        "activeCharacterName": "ГГ",
        "speechContext": "Група, продовжуємо шлях згідно запланованого маршруту. Якщо можна гнати коней швидше - робимо це, важлива кожна вхилина.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 47,
        "activeCharacterName": "Лідер логістів",
        "speechContext": "(Презирливо) Слухаюся...",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/117.png",
        "avatarPosition": "right"
      },
      {
        id: 48,
        "activeCharacterName": "",
        "speechContext": "*через, орієнтовно, годину пришвидшеного шляху*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 49,
        "activeCharacterName": "",
        "speechContext": "*раптом, на скелястій дорогі з'являється пара гоблінів*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 50,
        "activeCharacterName": "Лідер найманців",
        "speechContext": "Найманці, вперед! Воїни, не підпускайте ворогів в тил. Всім найманцям, кожен з вас прекрасно знає свої ролі, виконуйте їх, як завжди. Не поспішайте, ворогів не багато.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/118.png",
        "avatarPosition": "right"
      },
      {
        id: 51,
        "activeCharacterName": "",
        "speechContext": "*Битва спалахує. ГГ б’ється відчайдушно, але з-за спини лунає пронизливий крик. Маг-цілитель падає на підлогу, з його спини стирчить декілька чорних стріл*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 52,
        "activeCharacterName": "Лідер найманців",
        "speechContext": "Нас взяли в кільце, позаду ворожі лучники, кругова оборона!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/118.png",
        "avatarPosition": "right"
      },
      {
        id: 53,
        "activeCharacterName": "Лідер логістів",
        "speechContext": "Логісти! Швидко прориваємося, доки найманці тримають ворога на собі!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/117.png",
        "avatarPosition": "left"
      },
      {
        id: 54,
        "activeCharacterName": "",
        "speechContext": "*Логісти, жахнувшись, рвуть вози вперед*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 55,
        "activeCharacterName": "ГГ",
        "speechContext": "НІ! Залиштеся! Ми...",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 56,
        "activeCharacterName": "Лідер найманців",
        "speechContext": "Це кінець [ГГ], треба було залишатися з авантюристами!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/118.png",
        "avatarPosition": "right"
      },
      {
        id: 57,
        "activeCharacterName": "",
        "speechContext": "*Бій продовжується. Без лікувальної магії підмога гоблінів не без труднощів, з втратами але все ж зминає захисників вбивши кожного з них.*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 58,
        "activeCharacterName": "",
        "speechContext": "Проходить певний час. ГГ відкриває очі, і бачить себе в повозці. Він лежить на місцях для сидіння, а його волосся хтось поглажує.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 59,
        "activeCharacterName": "ГГ",
        "speechContext": "А? Що? Де я?",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 60,
        "activeCharacterName": "Дід",
        "speechContext": "Все вже добре, мій любий онуку. Дракон був відволікаючим манером. Він так і не посмів напасти. Але, нажаль, гобліни та інші дрібні приспішники темного бога скористалися цим.",
        "speechDescription": "Наслідки провалу",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 61,
        "activeCharacterName": "Дід",
        "speechContext": "Багато людей загинуло, ще більше поранено. Знищені цілі поселення. Королівство зтягнуло всі сили до напрямку з якого йшов дракон, це була помилка, нас обдурили, як дітей...",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 62,
        "activeCharacterName": "ГГ",
        "speechContext": "Діду, я ... (ГГ розповідає діду всю історію, звнувачуючи в загибелі найманців і логістів себе)",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 63,
        "activeCharacterName": "Дід",
        "speechContext": "Не звинувачуй себе, найманці виконали свою роботу. Нажаль це не останній раз коли тобі доводиться бачити їх смерть. На відміну від нас найманці не мають благословення переродження. Здебільшого це люди, які через війну втратили все що мали, і їх єдиний спосіб помсититися і прогодувати себе - це продовжувати бій.",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 64,
        "activeCharacterName": "Дід",
        "speechContext": "Мало хто з найманців знаходить себе в ремісництві чи логістикі. Під час бою, загалом, рятуються цивільні, за рахунок життя солдатів. От тільки, в основном, в королівствах куди вони евакуюються немає потреби в їх колишніх вміннях. Тільки дійсно досвідчені майстри своєї справи можуть розраховувати на фахову роботу.",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 65,
        "activeCharacterName": "Дід",
        "speechContext": "Більшість *врятованих* навіть не має достатньо часу для пошуку роботи, тому що треба годувати сім'ю, найманець який не знайде роботу до обіду - це велика рідкість, навіть якщо він новачок.",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 66,
        "activeCharacterName": "Дід",
        "speechContext": "Я думаю ти обурений тим що логісти просто втекли, але вони не вміють битися, що їм залишалося робити? Залишатися з вами і помирати? Вони рятували власність їх логістично гільдії, згідно їх робочому обов'язку. Як би це сумно не звучало, але здебільшого найманців наймають не так для охорони, як для того що б користуючись тим що вони відволікли нападників втікти і врятувати більш дорогоцінне майно.",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 67,
        "activeCharacterName": "Дід",
        "speechContext": "Я отримав благословіння за подвиги на полі бою, світлий бог мене признав та дав мені своє тавро за мою хоробрість та відданість. Тобі ж пощастило, обидва твоїх батьки були героями, діти героїв отримують тавро і прихильність бога своїх батьків в момент народження.",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 68,
        "activeCharacterName": "Дід",
        "speechContext": "А от найманці такої привілегії немають. Для торгівельної, логістичної, будівельно, видобувничої та інших гільдій вони всього лише ресурс. Як би це жахливо не звучало, але віз з конем коштує денної оплати пару десятків найманців, тому кожен член гільдії на завданні готовий пожертвувати найманцем за для порятунку майна гільдї, робити ж інакше не законно.",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 69,
        "activeCharacterName": "ГГ",
        "speechContext": "Я чув про це раніше, але побачити це на власні очі - це зовсім інше. Це просто жахливо! Діду, я обіцяю зробити все від мене залежне що б змінити цей світ! Звичайні люди не мають бути ресурсом, я впевнений що світлий бог любить їх так само як і нас, героїв!",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 70,
        "activeCharacterName": "Дід",
        "speechContext": "Безперечно так, він любить всіх однаково, але його ресурси обмежені, тому він не може допомагати на пряму всім і кожному. Саме для цього він і створив нас, гільдію авантюристів.",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 71,
        "activeCharacterName": "Дід",
        "speechContext": "Ми - буквально все що стоїть між силами бога темряви та світом який ти бачив. Ми боронимо людей навіть ціною свого життя, якщо доведеться. Але якщо жерці темних богів викрадуть твоє тіло і прведуть запечатувальний ретуал - Світлий бог не зможе тебе воскресити, тримай це в голові. Як правило поразка в глобальній битві для героя перша і останняя.",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 72,
        "activeCharacterName": "Дід",
        "speechContext": "Тобі дуже пощастило що гобліни не зрозуміли що ти герой, та не вкали твоє тіло для запечатування. Душа не може повенутися в тіло, що вже наповнене темною енергією.",
        "speechDescription": "Дід з сумом розповідає",
        "backgroundImg": "повозка",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      }
    ]
  }
]
