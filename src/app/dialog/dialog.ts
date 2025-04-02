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
        "speechContext": "Ха-ха, добре, [ім'я]! Йди до таверни, тобі потрібно найняти своїх перших найманців!",
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
        "speechContext": "Все рівно будь на сторожі! Ворог може бути де завгодно, навіть в межах міста. Темний бог має здатність створювати мирзенних створінь де йому заманеться. Звичайно им ближче до освяченої землі - тим слабкіші ці монстри будуть, але все ж розслаблятися не варто навіть в ліжку своєї кімнати!",
        "speechDescription": "Реєстрація в гільдії",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/116.png",
        "avatarPosition": "left"
      },
      {
        id: 12,
        "activeCharacterName": "Головний герой",
        "speechContext": "Дякую за пораду, але зі мною буде мій дідусь, тому я в повній безпеці!",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 13,
        "activeCharacterName": "Обслуга гільдії",
        "speechContext": "Все ж будь обережний та враховуй ризики при командуванні.",
        "speechDescription": "Реєстрація в гільдії",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/116.png",
        "avatarPosition": "left"
      },
      {
        id: 14,
        "activeCharacterName": "Головний герой",
        "speechContext": "Добре, дякую за пораду",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 15,
        "activeCharacterName": "",
        "speechContext": "*ззаду наближається дід*",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 16,
        "activeCharacterName": "Дід",
        "speechContext": "[Обслуга гільдії], доброго ранку! Дякую що навчаєш мого малого! Нам вже пора на ринок, гарного дня!",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/guild-hall.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 17,
        "activeCharacterName": "Дід",
        "speechContext": "От ми й істалися до ринку. Капи їжі, відповідно заявленій кількості в задачах, і не забудь купити бинти, а також взяти зілля відновлення. Ніколи не знаєш, що може статися в дорозі.",
        "speechDescription": "Поради діда",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "left"
      },
      {
        id: 18,
        "activeCharacterName": "Головний герой",
        "speechContext": "Добре, дідусь. Я домовлюся з приводу товару, а ти поки домовся з гільдією логістів, добре?",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 19,
        "activeCharacterName": "Дід",
        "speechContext": "Добре, зустрінемося тут хвилин через 20.",
        "speechDescription": "Поради діда",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "left"
      },
      {
        id: 20,
        "activeCharacterName": "",
        "speechContext": "*Через 20 хвилин*",
        "speechDescription": "Поради діда",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": "left"
      },
      {
        id: 21,
        "activeCharacterName": "Головний герой",
        "speechContext": "Дідусю, дякую що привів логістів. Хлопці, сюди, я покажу де куплений мною товар. Завантажуйте його обережно",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 22,
        "activeCharacterName": "",
        "speechContext": "*Логісти з мінімальними коментарями виконують накази*",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": "right"
      },
      {
        id: 23,
        "activeCharacterName": "",
        "speechContext": "*Ще через хвилин 30*",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": "right"
      },
      {
        id: 24,
        "activeCharacterName": "Головний логіст",
        "speechContext": "Товар завантажений, караван готовий відбувати",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/117.png",
        "avatarPosition": "left"
      },
      {
        id: 25,
        "activeCharacterName": "Головний герой",
        "speechContext": "Найманці, займіть місця в возах. Я з ді... з майстром [Ім'я діда] поїдемо по переду, всім інший зайняти місця в возах відповідно ролі в групі.",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 26,
        "activeCharacterName": "Головний герой",
        "speechContext": "Відбуваємо!",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "assets/dialogData/background/market.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "right"
      },
      {
        id: 27,
        "activeCharacterName": "",
        "speechContext": "*Через години дві дороги десь з далеку стало чутно швидко скачучого вершника.*",
        "speechDescription": "Бажання небезпеки",
        "backgroundImg": "",
        "activeCharacterAvatar": "",
        "avatarPosition": "right"
      },
      {
        id: 28,
        "activeCharacterName": "Посланець",
        "speechContext": "Майстер [Ім'я діда], біля східного пункту пропуску в приміський район було помічено дракона, вам терміново треба йти туди! Також всьому каравану треба бути обережніше, я чув що в околоцях цього ранку на мандрівників напав маленький загін з гоблінами. Здається, поки я сюди мчав - бачив одного здалеку.",
        "speechDescription": "Тривожна звістка",
        "activeCharacterAvatar": "assets/characters/121.png",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "avatarPosition": "left"
      },
      {
        id: 29,
        "activeCharacterName": "Дід",
        "speechContext": "Я попрямую до східного пункту пропуску до околиць міста. Будьте обережні, більшу половину шляху ми подолали. Доберіться до пункту призначення та очікуйте на подальші вказівки там!",
        "speechDescription": "Наслідки провалу",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      },
      {
        id: 30,
        "activeCharacterName": "",
        "speechContext": "*Дід поскакав у вказаному напрямку*",
        "speechDescription": "Дід поскакав у вказаному напрямку",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 31,
        "activeCharacterName": "",
        "speechContext": "*через 30 хв дороги ГГ бачить групу з 3-х авантюристів. Група зупиняється біля групи авантюристів, що махають їм з узлісся.*",
        "speechDescription": "Дід поскакав у вказаному напрямку",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 32,
        "activeCharacterName": "Головний авантюрист",
        "speechContext": "*Стійте! Ми бачили сліди гоблінів-розвідників он в тому напрямку. Схоже вони збирали інформацію. Думаю десь не подалік є більша група монстрів. Тут не далеко є печера, ми думаємо там окопатися ті тримати оборону, ходімо з нами?*",
        "speechDescription": "Дід поскакав у вказаному напрямку",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/123.png",
        "avatarPosition": "right"
      },
      {
        id: 33,
        "activeCharacterName": "ГГ",
        "speechContext": "Дякую за пропозицію, але, думаю якщо ми поспішимо - то встигнемо проскочити.  Дістатися до західного форту. Там чекають поставку їжі від нас.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 34,
        "activeCharacterName": "Лідер логістів",
        "speechContext": "Можливо, варто прислухатися? Якщо гобліни-розвідники вже тутб то...",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/117.png",
        "avatarPosition": "right"
      },
      {
        id: 35,
        "activeCharacterName": "Головний авантюрист",
        "speechContext": "Дякую, та я відмовлюся. В нас в гільдії є домовленість, що в разі небезпеки ми маємо зібратися в певних місціх, залежних від нашого поточного місце перебування. На скільки мені відомо - до печери прямує ще 3 групи. Думаю разом в нас буде хороший шанс відбитися.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/123.png",
        "avatarPosition": "right"
      },
      {
        id: 36,
        "activeCharacterName": "ГГ",
        "speechContext": "Враховуйте що на околицях міста був помічений дракон. В печері ви будете легкою здобиччю, якщо він сюди добереться.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 37,
        "activeCharacterName": "Головний авантюрист",
        "speechContext": "Ого, не чув про дракона. В будь-якому випадку вважаю що якщо він сюди добереться - погано буде всім. Ми ж в декількох годинах їзди від міста, для дракона це лічені хвилини польоту. Все ж я вважаю що продовжувати шлях буде більше небезпечно, тому відмовлюся від вашої пропозиції, бережіть себе, удачі вам в дорозі!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/123.png",
        "avatarPosition": "right"
      },
      {
        id: 38,
        "activeCharacterName": "ГГ",
        "speechContext": "Зрозумів. І ви бережіть себе, удачі нам обом!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 39,
        "activeCharacterName": "ГГ",
        "speechContext": "Група, продовжуємо шлях згідно запланованого маршруту. Якщо можна гнати коней швидше - робимо це, важлива кожна вхилина.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 40,
        "activeCharacterName": "Лідер логістів",
        "speechContext": "(Презирливо) Слухаюся...",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/117.png",
        "avatarPosition": "right"
      },
      {
        id: 41,
        "activeCharacterName": "",
        "speechContext": "*через, орієнтовно, годину пришвидшеного шляху*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 42,
        "activeCharacterName": "",
        "speechContext": "*раптом, на скелястій дорогі з'являється пара гоблінів*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 43,
        "activeCharacterName": "Лідер найманців",
        "speechContext": "Найманці, вперед! Воїни, не підпускайте ворогів в тил. Всім найманцям, кожен з вас прекрасно знає свої ролі, виконуйте їх, як завжди. Не поспішайте, ворогів не багато.",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/118.png",
        "avatarPosition": "right"
      },
      {
        id: 44,
        "activeCharacterName": "",
        "speechContext": "*Битва спалахує. ГГ б’ється відчайдушно, але з-за спини лунає пронизливий крик. Маг-цілитель падає на підлогу, з його спини стирчить декулька чорних стріл*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "",
        "avatarPosition": ""
      },
      {
        id: 45,
        "activeCharacterName": "Лідер найманців",
        "speechContext": "На взяли в кільки, позаду ворожі лучники, кругова оборона!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/118.png",
        "avatarPosition": "right"
      },
      {
        id: 46,
        "activeCharacterName": "Лідер гогістів",
        "speechContext": "Логісти! Швидко прориваємося, доки найманці тримають ворога на собі!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/120.png",
        "avatarPosition": "left"
      },
      {
        id: 47,
        "activeCharacterName": "",
        "speechContext": "*Логісти, жахнувшись, рвуть вози вперед*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/120.png",
        "avatarPosition": "right"
      },
      {
        id: 48,
        "activeCharacterName": "ГГ",
        "speechContext": "НІ! Залиштеся! Ми...",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 49,
        "activeCharacterName": "Лідер найманців",
        "speechContext": "Це кінець [ГГ], тікай!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/118.png",
        "avatarPosition": "right"
      },
      {
        id: 50,
        "activeCharacterName": "ГГ",
        "speechContext": "Ні, я не залишу тебе!",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/113.png",
        "avatarPosition": "left"
      },
      {
        id: 51,
        "activeCharacterName": "",
        "speechContext": "*ГГ загадковим чином виживає, я ще не придумав як*",
        "speechDescription": "Битва з гоблінами",
        "backgroundImg": "assets/dialogData/background/forest1.jpg",
        "activeCharacterAvatar": "assets/characters/120.png",
        "avatarPosition": ""
      },
      {
        id: 52,
        "activeCharacterName": "Дід",
        "speechContext": "Ти живий… Але дорогою ціною. Ти не впорався з керуванням групою, зробив кілька неправильних рішень, і це коштувало твоїй групі життя. Про те вози успішно дісталися до місця, логісти вижили, завдання виконане.",
        "speechDescription": "Наслідки провалу",
        "backgroundImg": "assets/dialogData/background/room.jpg",
        "activeCharacterAvatar": "assets/characters/112.png",
        "avatarPosition": "right"
      }
    ]
  }
]
