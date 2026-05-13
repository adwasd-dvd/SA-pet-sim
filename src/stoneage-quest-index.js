const RENWU_BASE_URL = "https://news.17173.com/z/stoneage/renwu/";

const href = (value) => new URL(value, RENWU_BASE_URL).href;

const task = (slug, title, source, aliases = []) => ({
  slug,
  title,
  source: href(source),
  aliases
});

export const STONEAGE_QUEST_VERSION_SCOPE = {
  maxVersion: "2.5",
  source: "https://news.17173.com/z/stoneage/renwu/renwu.htm",
  sourceLabel: "17173/renwu/index",
  policy: "只收录 17173 任务目录中 2.5 及以前/早期岛屿/转生/JOT-SOT 任务索引；后续版本条目留给后续资料包。",
  groups: [
    "石器时代2.0-2.5重要攻略篇",
    "石器2.5任务攻略",
    "石器时代2.0任务攻略",
    "南岛任务全攻略",
    "北岛任务全攻略",
    "吉鲁岛任务全攻略",
    "沙姆岛任务全攻略",
    "转生四洞窟全攻略",
    "JOT 环岛任务攻略"
  ]
};

export const STONEAGE_QUEST_GROUPS_25 = [
  {
    id: "major-20-25",
    version: "2.0-2.5",
    group: "石器时代2.0-2.5重要攻略篇",
    tags: ["2.0", "2.5", "重要攻略", "繁体版", "红暴", "四圣石", "精灵少女", "黑暗精灵王"],
    note: "17173 将这些作为 2.0-2.5 阶段的重要攻略索引。",
    tasks: [
      task("four-stones-green-dragon-gold-tiger-big5", "四圣石、绿雷龙、金虎任务最佳详细解法", "big5-1.htm", ["四圣石", "绿雷龙", "金虎"]),
      task("five-jade-red-raptor-samugiru-jewelry-big5", "五勾玉、红暴、萨姆吉尔首饰任务详解", "big5-2.htm", ["五勾玉", "红暴", "萨姆吉尔首饰"]),
      task("spirit-girl-part-1-big5", "精灵少女篇图文攻略(上篇)", "big5-3.htm", ["精灵少女", "精灵少女上篇"]),
      task("spirit-girl-part-2-big5", "精灵少女篇图文攻略(中篇)", "big5-4.htm", ["精灵少女中篇"]),
      task("spirit-girl-part-3-big5", "精灵少女篇图文攻略(下篇)", "big5-5.htm", ["精灵少女下篇"]),
      task("spirit-girl-final-big5", "精灵少女篇攻略(最后补充篇)", "big5-6.htm", ["精灵少女补充"]),
      task("dark-elf-king-big5", "黑暗精灵王任务全解", "big5-7.htm", ["黑暗精灵王"])
    ]
  },
  {
    id: "version-25",
    version: "2.5",
    group: "石器2.5任务攻略",
    tags: ["2.5", "精灵王", "精灵少女", "黑暗精灵王"],
    note: "2.5 阶段核心任务目录，优先作为精灵王/精灵少女/黑暗精灵王线索。",
    tasks: [
      task("dark-elf-king", "黑暗精灵王任务全解", "sa25_04.htm", ["黑暗精灵王", "精灵王"]),
      task("spirit-girl-final", "精灵少女篇攻略(最后补充篇)", "sa25_06.htm", ["精灵少女补充"]),
      task("spirit-girl-part-1", "精灵少女篇图文攻略(上篇)", "sa25_01.htm", ["精灵少女", "精灵少女上篇"]),
      task("spirit-girl-part-2", "精灵少女篇图文攻略(中篇)", "sa25_03.htm", ["精灵少女中篇"]),
      task("spirit-girl-part-3", "精灵少女篇图文攻略(下篇)", "sa25_05.htm", ["精灵少女下篇"]),
      task("spirit-king", "精灵王任务攻略(参考)", "sa25_02.htm", ["精灵王", "精灵王任务"])
    ]
  },
  {
    id: "version-20",
    version: "2.0",
    group: "石器时代2.0任务攻略",
    tags: ["2.0", "英雄岛", "红暴", "四圣石", "人形宠", "猜谜三兄弟", "委托店"],
    note: "2.0 阶段以英雄岛、红暴、四圣石、人形宠和四村委托店为核心。",
    tasks: [
      task("red-raptor-hero-island", "英雄岛前传(红暴)", "news_01.htm", ["英雄岛前传", "红暴"]),
      task("four-stones-hero-island", "英雄岛后传(四圣石)", "news_02.htm", ["英雄岛后传", "四圣石"]),
      task("humanoid-pet", "人形宠最新解法", "news_03.htm", ["人形宠"]),
      task("riddle-three-brothers", "猜谜三兄弟全解(参考)", "faq01.htm", ["猜谜三兄弟"]),
      task("samugiru-commission-shop", "萨姆吉尔村任务委托店", "wt01.htm", ["萨村委托店", "萨姆吉尔委托店"]),
      task("marinas-commission-shop", "玛丽娜斯渔村任务委托店", "wt02.htm", ["渔村委托店", "玛丽娜斯委托店"]),
      task("gaga-commission-shop", "加加村任务委托店", "wt03.htm", ["加加委托店"]),
      task("karutana-commission-shop", "卡鲁他那村任务委托店", "wt04.htm", ["卡鲁它那委托店", "卡鲁他那委托店"]),
      task("four-stones-green-dragon-gold-tiger", "四圣石、绿雷龙、金虎任务最佳详细解法", "news_09.htm", ["四圣石", "绿雷龙", "金虎"]),
      task("five-jade-red-raptor-samugiru-jewelry", "五勾玉、红暴、萨姆吉尔首饰任务详解", "news_10.htm", ["五勾玉", "红暴", "萨姆吉尔首饰"])
    ]
  },
  {
    id: "south-island",
    version: "2.5以前",
    group: "南岛任务全攻略",
    tags: ["南岛", "加鲁卡", "加鲁迦", "卡鲁它那", "加加", "成人仪式", "琉璃洞窟"],
    note: "南岛早期任务索引，适合 NPC 给玩家指路和解释区域任务线。",
    tasks: [
      task("save-grandfather", "解救老爷爷", "n1.htm", ["老爷爷"]),
      task("dragon-cave", "龙洞的任务", "n2.htm", ["龙洞"]),
      task("logging", "伐木任务", "n3.htm", ["伐木"]),
      task("pig-love-story", "小猪的爱情故事", "n4.htm", ["小猪爱情"]),
      task("ibu-mother", "伊布的母亲", "n5.htm", ["伊布"]),
      task("strong-en-cave", "强恩一族洞窟", "n6.htm", ["强恩一族"]),
      task("runaway-hubaba", "逃走的呼拔拔", "n7.htm", ["呼拔拔"]),
      task("red-tiger-girl", "红虎少女", "n8.htm", ["红虎少女"]),
      task("magic-shell", "神奇的贝壳", "n9.htm", ["贝壳"]),
      task("adult-ceremony", "成人仪式", "n10.htm", ["成人礼", "仪之玉", "仪之盔"]),
      task("sbc-report", "SBC报导", "n11.htm", ["SBC"]),
      task("liuli-cave-south", "琉璃洞窟", "n12.htm", ["琉璃"]),
      task("fishing", "钓鱼", "n13.htm", ["钓鱼"]),
      task("jinbuyi", "金布伊任务", "n14.htm", ["金布伊"])
    ]
  },
  {
    id: "north-island",
    version: "2.5以前",
    group: "北岛任务全攻略",
    tags: ["北岛", "萨伊那斯", "萨姆吉尔", "玛丽娜斯", "卡坦", "梦德洞窟", "愿藏娃娃"],
    note: "北岛早期任务索引，覆盖萨伊那斯/萨姆吉尔/玛丽娜斯附近的基础任务。",
    tasks: [
      task("yam-axe", "亚姆的斧头", "b1.htm", ["亚姆", "斧头"]),
      task("dinosaur-doctor", "恐龙博士", "b2.htm", ["恐龙博士"]),
      task("shell-delivery", "送贝壳的故事", "b3.htm", ["送贝壳", "贝壳"]),
      task("xuanhuang-cave-north", "玄黄洞窟", "b4.htm", ["玄黄"]),
      task("nama-club", "拿马棒方法", "b5.htm", ["拿马棒"]),
      task("katan-wish", "卡坦的愿望", "b6.htm", ["卡坦"]),
      task("abu-cave", "阿布洞窟", "b7.htm", ["阿布"]),
      task("robber-cave", "强盗的洞穴", "b8.htm", ["强盗"]),
      task("mengde-cave", "梦德洞窟", "b9.htm", ["梦德"]),
      task("yuancang-doll", "愿藏娃娃之谜", "b10.htm", ["愿藏", "愿藏娃娃", "坏心眼的愿藏"]),
      task("katan-illusion-cave", "卡坦村迷幻洞窟", "b11.htm", ["迷幻洞窟"])
    ]
  },
  {
    id: "jilu-island",
    version: "2.5以前",
    group: "吉鲁岛任务全攻略",
    tags: ["吉鲁岛", "五兄弟", "矿工", "黄金羚羊", "方位之祠"],
    note: "吉鲁岛早期任务索引，NPC 可据此解释岛内任务主题。",
    tasks: [
      task("five-brothers", "五兄弟的谜", "j1.htm", ["五兄弟"]),
      task("miner-contest", "矿工的比赛", "j2.htm", ["矿工"]),
      task("golden-antelope", "黄金羚羊之谜", "j3.htm", ["黄金羚羊"]),
      task("new-pig-love-story", "新小猪爱情故事", "j4.htm", ["新小猪爱情"]),
      task("direction-shrine", "方位之祠", "j5.htm", ["方位之祠", "方位"])
    ]
  },
  {
    id: "sham-island",
    version: "2.5以前",
    group: "沙姆岛任务全攻略",
    tags: ["沙姆岛", "四宝玉", "梦幻洞窟"],
    note: "沙姆岛早期任务索引，目前先作为地图/NPC 对话线索。",
    tasks: [
      task("four-jewels", "四宝玉之谜", "s1.htm", ["四宝玉"]),
      task("dream-cave", "梦幻洞窟", "s2.htm", ["梦幻洞窟"])
    ]
  },
  {
    id: "rebirth-caves",
    version: "2.5以前",
    group: "转生四洞窟全攻略",
    tags: ["转生", "四洞窟", "琉璃洞窟", "玄黄洞窟", "碧青洞窟", "深红洞窟", "漆黑洞窟"],
    note: "转生洞窟索引用于识别转生线，不代表当前 Worker 已完整开放转生。",
    tasks: [
      task("liuli-cave-rebirth", "琉璃洞窟", "z1.htm", ["琉璃"]),
      task("xuanhuang-cave-rebirth", "玄黄洞窟", "z2.htm", ["玄黄"]),
      task("biqing-cave", "碧青洞窟", "z3.htm", ["碧青"]),
      task("deep-red-cave", "深红洞窟", "z4.htm", ["深红"]),
      task("black-cave-final-rebirth", "漆黑洞窟(最后转生)", "z5.htm", ["漆黑洞窟", "最后转生"])
    ]
  },
  {
    id: "jot-sot",
    version: "2.5以前",
    group: "JOT 环岛任务攻略",
    tags: ["JOT", "SOT", "环岛", "南岛", "北岛", "全岛活动石"],
    note: "JOT/SOT 是南岛/北岛巡回活动，需要按路线找检查员并通过测试。",
    tasks: [
      task("jot-a-south", "JOT A 路线（南岛）", "jot01.htm", ["JOT A", "南岛巡回"]),
      task("jot-b-south", "JOT B 路线（南岛）", "jot02.htm", ["JOT B", "南岛巡回"]),
      task("sot-c-north", "SOT C 路线（北岛）", "jot03.htm", ["SOT C", "北岛巡回"]),
      task("sot-d-north", "SOT D 路线（北岛）", "jot04.htm", ["SOT D", "北岛巡回"])
    ]
  }
];

export const STONEAGE_QUEST_INDEX_25 = STONEAGE_QUEST_GROUPS_25.flatMap((group) => (
  group.tasks.map((entry, index) => ({
    id: `quest-${group.id}-${entry.slug}`,
    title: entry.title,
    version: group.version,
    group: group.group,
    order: index + 1,
    source: entry.source,
    sourceLabel: `17173/renwu/${entry.source.split("/").pop()}`,
    tags: [
      entry.title,
      ...entry.aliases,
      group.version,
      group.group,
      "2.5以前",
      "2.5及以前",
      "任务",
      "任务攻略",
      ...group.tags
    ],
    summary: `${group.group}目录条目：${entry.title}。${group.note}`,
    facts: [
      `17173 任务目录把「${entry.title}」归在「${group.group}」。`,
      `版本范围：${group.version}；当前只把它作为任务索引和 NPC/AI 线索。`,
      `原攻略页：${entry.source}`
    ],
    guidance: [
      "回答玩家时先说明这是目录线索；完整步骤要以对应攻略页和本地 gmsv 脚本接入为准。",
      "不要因为有目录条目就直接发奖励、传送、改 flag 或强行开任务。"
    ],
    status: "catalog"
  }))
));
