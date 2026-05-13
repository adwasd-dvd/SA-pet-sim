import { STONEAGE_QUEST_INDEX_25, STONEAGE_QUEST_VERSION_SCOPE } from "./stoneage-quest-index.js";

const QUEST_INDEX_25_KNOWLEDGE = STONEAGE_QUEST_INDEX_25.map((entry) => ({
  id: entry.id,
  category: "quest",
  title: entry.title,
  tags: entry.tags,
  summary: entry.summary,
  facts: entry.facts,
  guidance: entry.guidance,
  source: entry.source,
  sourceLabel: entry.sourceLabel,
  version: entry.version,
  group: entry.group,
  status: entry.status
}));

export const STONEAGE_KNOWLEDGE = {
  version: "17173-stoneage-knowledge-v2",
  sourceLabel: "17173 石器时代专区",
  sources: {
    quests: "https://news.17173.com/z/stoneage/renwu/renwu.htm",
    questIndex25: STONEAGE_QUEST_VERSION_SCOPE.source,
    versions: "https://news.17173.com/z/stoneage/banben/banben.htm",
    pets: "https://news.17173.com/z/stoneage/chongwu/pet.htm",
    guide: "https://news.17173.com/z/stoneage/guide/guide.htm",
    villages: "https://news.17173.com/z/stoneage/cunzhuang/cunzhuang.htm",
    maps: "https://news.17173.com/z/stoneage/ditu/ditu.htm"
  },
  entries: [
    {
      id: "world-nice-continent",
      category: "world",
      title: "尼斯大陆与出生地",
      tags: ["尼斯大陆", "塞纳斯", "萨伊那斯", "加鲁迦", "加鲁卡", "萨姆吉尔", "玛丽娜斯", "加加", "卡鲁它那", "出生地"],
      summary: "17173 新手资料把石器世界称为尼斯大陆，早期冒险主要围绕塞纳斯/萨伊那斯与加鲁迦/加鲁卡两大岛展开。",
      facts: [
        "萨姆吉尔村以英雄萨姆吉尔命名，玛丽娜斯渔村与海产和海之精灵意象相关。",
        "加鲁迦/加鲁卡岛森林密布，加加村是树上村落，卡鲁它那是由小岛组成的渔村。",
        "村落附近更适合初期锻炼；远离村镇、进入洞窟或野外后才应强调遇敌风险。"
      ],
      guidance: [
        "NPC 谈出生地时要先问或查看玩家当前地图，不要假定所有玩家都从同一村出发。",
        "向导推荐路线时优先用当前 Worker 出口和 gmsv mapwarp，再用这些世界观名称解释方向。"
      ],
      source: "https://news.17173.com/z/stoneage/guide/13.htm",
      sourceLabel: "17173/guide/13"
    },
    {
      id: "beginner-first-steps",
      category: "guide",
      title: "新手开局：移动、对话、背包与宠物",
      tags: ["新手", "入门", "走路", "对话", "NPC", "背包", "道具", "宠物", "战斗", "村长家", "地图"],
      summary: "新手指南强调先学移动、NPC 对话、地图坐标、宠物状态和 15 格道具栏，再逐步出村探索。",
      facts: [
        "进入游戏后通常先在村内学习走路、与 NPC 对话、查看地图与坐标。",
        "道具栏只有 15 个袋子，外出冒险前应留空位，否则无法继续拾取或购买。",
        "一次只能派一只宠物出击，宠物可设为战斗、休息、邮件、等待等状态。",
        "新手创建人物时，17173 建议体力 8-9、腕力 4-5、耐力 4-5、速度 1-2 作为稳健开局。"
      ],
      guidance: [
        "玩家问下一步时，先检查 HP、背包空位、出战宠、附近 NPC 和出口。",
        "NPC 不要把外部攻略当成已完成状态；任务、交易和传送仍看当前脚本。"
      ],
      source: "https://news.17173.com/z/stoneage/guide/14.htm",
      sourceLabel: "17173/guide/14"
    },
    {
      id: "attributes-and-elements",
      category: "combat",
      title: "属性与基础战斗相克",
      tags: ["属性", "地", "水", "火", "风", "攻击", "防御", "敏捷", "耐久", "魅力", "相克", "战斗"],
      summary: "17173 属性页把人物能力、武器倾向和四属性相克作为早期战斗判断基础。",
      facts: [
        "四属性关系是地克水、水克火、火克风、风克地。",
        "攻击力影响伤害，防御力降低受伤，敏捷影响回避、反击和行动顺序。",
        "魅力越高，宠物忠诚度越容易稳定；战斗死亡会影响魅力。",
        "斧头攻击高但负面状态明显；枪、棍更稳；爪和空手偏多段攻击。"
      ],
      guidance: [
        "战斗建议要结合当前敌我等级、HP 和宠物属性，不能只凭属性相克下结论。",
        "向导可以解释相克，但实际伤害仍由 Worker 战斗结算。"
      ],
      source: "https://news.17173.com/z/stoneage/guide/15.htm",
      sourceLabel: "17173/guide/15"
    },
    {
      id: "battle-basics",
      category: "combat",
      title: "战斗与遇敌常识",
      tags: ["战斗", "遇敌", "参战", "捕获", "放走", "逃跑", "野外", "恐龙"],
      summary: "新手指南说明野外敌人平时不可见，移动时随机遭遇；进入战斗后再选择攻击、捕获等动作。",
      facts: [
        "野外移动可能突然切入战斗画面；村镇和店铺不应当被当成野外刷怪区。",
        "玩家可与宠物并肩作战，也可在合适规则下捕获恐龙作为宠物。",
        "和其他玩家的决斗需要双方同意；当前单人版主要模拟 PvE 与 NPCEnemy。"
      ],
      guidance: [
        "NPC 要把随机遇敌、NPCEnemy 开战和向导辅助开战区分清楚。",
        "玩家问刷怪时先查当前地图 encount.txt 和安全区规则。"
      ],
      source: "https://news.17173.com/z/stoneage/guide/13.htm",
      sourceLabel: "17173/guide/13"
    },
    {
      id: "pet-system-basics",
      category: "pet",
      title: "宠物系统：捕获、成长、三围、忠诚",
      tags: ["宠物", "恐龙", "怪兽", "捕获", "成长", "等级", "三围", "攻击", "防御", "敏捷", "忠诚", "宠物店"],
      summary: "宠物介绍页强调宠物是石器时代核心玩法：可捕获、随身携带、并肩作战、升级成长并学习技能。",
      facts: [
        "人物进入石器时代时会带一只宠物，也可在世界各地捕获不同宠物。",
        "宠物三围通常指攻击、防御、敏捷；同种宠物也会有成长差异。",
        "宠物忠诚度会受战斗胜负、惩罚和死亡影响；忠诚低时可能不听指挥。",
        "宠物同样有地、水、火、风属性，战斗相克关系和人物属性一致。"
      ],
      guidance: [
        "宠物建议要先看当前出战宠、宠物栏容量和可捕获资料。",
        "不要承诺稀有宠一定能抓到；捕获成功率由当前战斗与 Worker 规则决定。"
      ],
      source: "https://news.17173.com/z/stoneage/chongwu/pet01.htm",
      sourceLabel: "17173/chongwu/pet01"
    },
    {
      id: "pet-skills",
      category: "pet",
      title: "宠物技能：战斗、合成、料理",
      tags: ["宠物技能", "忠犬", "背水", "连续攻击", "一击必杀", "猛毒", "石化", "混乱", "合成", "料理", "宠物店"],
      summary: "宠物技能页列出大量技能，既有战斗特技，也有合成和料理等生产能力。",
      facts: [
        "常见战斗技能包括连续攻击、三段/四段/五段攻击、忠犬平八、背水之阵、一击必杀等。",
        "状态类技能可造成中毒、石化、混乱、酒醉、催眠等效果。",
        "合成和料理不保证成功，受宠物特性与运气影响。",
        "学习技能通常要去宠物店或对应训练地点，并支付费用。"
      ],
      guidance: [
        "当前 Worker 还没有全量宠物技能 VM 时，NPC 要说清楚“资料里有，当前只模拟部分”。",
        "玩家问技能时优先解释用途和限制，不要虚构已学会的技能。"
      ],
      source: "https://news.17173.com/z/stoneage/chongwu/pet03.htm",
      sourceLabel: "17173/chongwu/pet03"
    },
    {
      id: "pet-mail-and-riding",
      category: "pet",
      title: "宠物邮件与骑宠",
      tags: ["宠物邮件", "邮件", "名片", "骑宠", "骑乘", "骑师", "庄园", "雷龙", "老虎", "忠诚100"],
      summary: "17173 宠物资料介绍了宠物邮件和骑宠：宠物可做信差，骑宠技能则训练玩家而不是宠物本身。",
      facts: [
        "宠物邮件需要先交换名片、对方在线，并把一只宠物设为邮件状态。",
        "特殊道具和石币通常不能用宠物邮件寄送。",
        "骑宠技能在四大家族庄园附近的骑师处学习，课程分下级、中级、上级。",
        "骑乘要求学习等级符合、身上带着可骑宠物，且可骑宠物忠诚度满 100。"
      ],
      guidance: [
        "单人版如未实现邮件/骑宠，NPC 应把它作为原版资料说明，不要直接开启功能。",
        "骑宠答复要强调忠诚度和已学骑乘等级。"
      ],
      source: "https://news.17173.com/z/stoneage/chongwu/pet02.htm",
      sourceLabel: "17173/chongwu/pet02+pet04"
    },
    {
      id: "version-75-spirit-summon",
      category: "version",
      title: "7.5 精灵的传说/精灵的召唤",
      tags: ["版本", "7.5", "精灵的传说", "精灵的召唤", "伊甸大陆", "魔界", "艾巴登", "雷尔", "宠物二转", "人物六转", "追猎者", "庄园"],
      summary: "版本页把 7.5 定位为承接家族开拓史、精灵王传说、伊甸新大陆、宠物进化史、石头就业所后的伊甸大陆主线延伸。",
      facts: [
        "7.5 关注魔界入侵、艾巴登、雷尔、四大精灵、宠物二转和人物六转。",
        "版本新增或强化摆摊、宠物仓库、全新宠物、装备资料、庄园规则、庄园素材商店。",
        "职业侧重点包括猎人新技能、白狼/法师/猎人技能限制与三、四阶技能。",
        "追猎者在该版本被加强，围绕自然威能、号召自然、属性结界等定位。"
      ],
      guidance: [
        "NPC 谈版本历史时要把它当世界背景，不要把所有 7.5 功能都假定当前 Worker 已实现。",
        "玩家问二转/六转时可指出这是高阶主线，需要对应任务 NPC、道具和前置条件。"
      ],
      source: "https://news.17173.com/z/stoneage/banben/sa75_1.htm",
      sourceLabel: "17173/banben/sa75_1"
    },
    {
      id: "quest-index-major-versions",
      category: "quest",
      title: "任务索引：2.0 到 8.0 的攻略脉络",
      tags: ["任务", "攻略", "任务攻略", "8.0", "7.5", "7.0", "6.0", "5.0", "4.0", "3.0", "2.0", "南岛", "北岛", "吉鲁岛", "沙姆岛"],
      summary: "17173 任务页按版本和岛屿整理攻略，覆盖 8.0、7.5、7.0、6.0、5.0、4.0、3.0、2.0 以及南北岛/吉鲁/沙姆任务。",
      facts: [
        "8.0 收录思念故乡的贝克、慰灵碑、黄泉之路、塔蜜提雅之迷、人龙进化等。",
        "7.5 收录地精灵找战士团团长、雷尔、宠物二转、精灵的召唤、六转生之迷、永远的忠诚。",
        "7.0 同时有石头就业所职业攻略和任务攻略，如暗灵法师、白狼勇士、追猎者、光之石、达那成人、海底的歌声等。",
        "早期重要任务包括红暴、四圣石、五勾玉、黑暗精灵王、精灵少女、成人仪式、恐龙博士等。"
      ],
      guidance: [
        "如果知识库只有任务标题，NPC 应说“我知道这是哪个攻略线，但具体步骤要看对应任务页或本地脚本”。",
        "任务执行仍以当前地图 NPC、背包道具、flag 和 gmsv 脚本为准。"
      ],
      source: "https://news.17173.com/z/stoneage/renwu/renwu.htm",
      sourceLabel: "17173/renwu/index"
    },
    {
      id: "quest-adult-ceremony",
      category: "quest",
      title: "成人仪式",
      tags: ["成人仪式", "成人礼", "LV30", "LV35", "海底通道", "柯奥村", "卡鲁它那村", "仪之玉", "仪之盔"],
      summary: "成人仪式是早期关键任务，17173 资料标记 30 级可做，35 级后更轻松。",
      facts: [
        "北岛路线可从柯奥村附近进入海底通道；南岛路线通常要在卡鲁它那村买通行证后从村外西北洞口进入。",
        "进入成人礼洞穴后老人会要求收集 15 个仪之玉。",
        "完成后可取得仪之盔，资料描述为防御提升、敏捷下降并带法术耐性。",
        "洞内敌人大多约 30 级上下，刚到 30 级会比较吃力。"
      ],
      guidance: [
        "玩家未到等级或战宠太弱时，建议先练级、补给和留背包空位。",
        "涉及通行证和奖励时不要直接发放，必须由脚本或 Worker VM 校验。"
      ],
      source: "https://news.17173.com/z/stoneage/renwu/n10.htm",
      sourceLabel: "17173/renwu/n10"
    },
    {
      id: "quest-red-raptor-hero-island",
      category: "quest",
      title: "英雄岛前传：红暴",
      tags: ["红暴", "英雄岛", "波拉岛", "拨拉岛", "日美子", "弥生", "不可思议的贝", "黑乌力", "水灞洞窟", "龙王", "龙王玉", "英雄的祝福", "巴朵兰恩"],
      summary: "红暴任务是英雄岛前传，17173 标记条件为 80 级以上并完成成人礼。",
      facts: [
        "常见起线是萨村日美子送花到渔村弥生，取得不可思议的贝，再回萨村找黑乌力进入英雄岛。",
        "鱼村出生可直接找弥生取贝壳；其他出生地通常先从萨村日美子接线。",
        "后段会穿过水灞洞窟、波拉山谷和龙王洞，挑战约 120 级红暴龙王守护。",
        "打过后可取得 LV1 红暴相关奖励，并可拿龙王玉、英雄的祝福等后续线索。"
      ],
      guidance: [
        "这是高等级长线任务，NPC 要提醒前置成人礼、补给、组队/战宠强度。",
        "当前地图不在任务链时，向导应给“找对应 NPC/入口”的方向，不要直接跳完整流程。"
      ],
      source: "https://news.17173.com/z/stoneage/renwu/news_01.htm",
      sourceLabel: "17173/renwu/news_01"
    },
    {
      id: "quest-four-sacred-stones",
      category: "quest",
      title: "英雄岛后传：四圣石",
      tags: ["四圣石", "四宝玉", "英雄岛后传", "绿雷龙", "金虎", "泰坦", "鲁乌", "迪欧", "加美", "地之宝玉", "水之宝玉", "火之宝玉", "风之宝玉"],
      summary: "四圣石任务是英雄岛后传，17173 明确写在做红暴/英雄岛任务后继续。",
      facts: [
        "任务从海底洞窟接线后，会牵涉泰坦队员、萨姆吉尔、公文、通行证与泰坦洞窟。",
        "鲁乌、迪欧、加美等人形/特定宠需要练到指定等级并配合采矿、伐木、钓竿等证明。",
        "地、水、火、风宝玉会引出不同岛上高等级宠物出现或后续交换条件。",
        "集齐相关宝玉后可回海底洞窟与萨姆吉尔交换金虎线索。"
      ],
      guidance: [
        "回答四圣石时要强调它是长链后传，先确认红暴线、成人礼和所需证明。",
        "如玩家只问“金虎/绿雷龙”，先说明其与宝玉和英雄岛后续相关。"
      ],
      source: "https://news.17173.com/z/stoneage/renwu/news_02.htm",
      sourceLabel: "17173/renwu/news_02"
    },
    {
      id: "quest-commission-shops",
      category: "quest",
      title: "村庄任务委托店",
      tags: ["委托店", "萨姆吉尔村任务委托店", "玛丽娜斯渔村任务委托店", "加加村任务委托店", "卡鲁他那村任务委托店", "宠物委托书", "料理委托书"],
      summary: "2.0 任务索引列出四大村任务委托店；萨姆吉尔委托包含抓宠与料理两类委托书。",
      facts: [
        "萨村宠物委托书 A 要昆伊、凯比特各 2 只；料理委托书 A 要硬掉的荷包蛋。",
        "委托等级越高，要求的宠物、料理和奖励也更复杂。",
        "委托店任务本质上是交付指定物品或宠物，不是单纯对话。"
      ],
      guidance: [
        "玩家问委托时先检查背包、宠物栏和当前村，不要承诺跨村委托通用。",
        "交付宠物/料理必须等本地脚本实现后再扣除或奖励。"
      ],
      source: "https://news.17173.com/z/stoneage/renwu/wt01.htm",
      sourceLabel: "17173/renwu/wt01"
    },
    {
      id: "map-index",
      category: "map",
      title: "石器地图与坐标索引",
      tags: ["地图", "坐标", "座标", "北岛", "南岛", "吉鲁岛", "沙姆岛", "全貌图", "洞窟", "LV1宠物地图"],
      summary: "17173 地图页提供四大岛坐标入口和大量全貌图、村庄图、LV1 宠物地图。",
      facts: [
        "坐标索引分北岛、南岛、吉鲁岛、沙姆岛四类。",
        "地图页还列有伊甸大陆、地城/水城/火城/风城、天空之岛、萨姆吉尔、玛丽娜斯、加加、卡鲁它那等全貌图。",
        "17173 特别强调大地图容易迷路，坐标是找村庄、洞窟和任务点的核心线索。"
      ],
      guidance: [
        "向导说路线时优先给当前 Worker 出口；跨岛方向可补充 17173 坐标名词。",
        "图片全貌图不能直接等于当前打包地图，实际移动仍按 WORLD.maps。"
      ],
      source: "https://news.17173.com/z/stoneage/ditu/ditu.htm",
      sourceLabel: "17173/ditu/index"
    },
    {
      id: "north-island-coordinates",
      category: "map",
      title: "北岛常用坐标与设施",
      tags: ["北岛", "玛丽娜斯", "玛丽娜斯渔村", "渔村", "萨姆吉尔村", "萨村", "柯奥", "霍特尔村", "柯尔克村", "中央森林", "阿布洞窟", "科奥海底通路"],
      summary: "北岛坐标页列出玛丽娜斯渔村、萨姆吉尔村、霍特尔、柯尔克、记录点、洞窟和海底通路等。",
      facts: [
        "玛丽娜斯渔村坐标资料列为 114,662 / 79,615，设施含记录点、武器/防具/道具/便利商店、医院、肉屋、长毛象宅即便、竞技场、道场。",
        "萨姆吉尔村坐标资料列为 637,493 / 708,488，并有宠物店等完整村庄设施。",
        "柯奥相关海底通路入口资料含 474,630 / 471,630 一带，是南北岛连接和成人礼线索的重要区域。",
        "中央森林记录点在 342,466，阿布洞窟前记录点在 181,346。"
      ],
      guidance: [
        "玩家说“萨村/渔村”时要识别简称，结合当前地图出口给最近行动。",
        "坐标来自攻略资料；游戏内实际 floor 和坐标以当前地图数据为准。"
      ],
      source: "https://news.17173.com/z/stoneage/ditu/zb1.htm",
      sourceLabel: "17173/ditu/zb1"
    },
    {
      id: "south-island-coordinates",
      category: "map",
      title: "南岛常用坐标与洞窟",
      tags: ["南岛", "卡鲁它那村", "卡鲁他那", "加加村", "塔姆塔姆村", "多多村", "乌鲁力村", "奇喀喀村", "森林洞窟", "卡鲁它那洞窟", "哥耶山洞窟"],
      summary: "南岛坐标页列出卡鲁它那、加加、塔姆塔姆、多多、乌鲁力、奇喀喀和多处洞窟/记录点。",
      facts: [
        "卡鲁它那村坐标资料列为 304,599 / 301,640，设施包含记录点、商店、医院、肉屋、长毛象宅即便、竞技场、道场。",
        "加加村资料附近坐标列为 570,378 / 587,315，拥有完整村庄设施和宠物店。",
        "塔姆塔姆村约 426,93 / 481,94；多多村约 509,496 / 542,490；乌鲁力村约 549,745 / 517,767。",
        "卡鲁它那洞窟资料标注为 3 层、6-30 级敌人，森林洞窟和哥耶山洞窟也列有敌人等级与任务线索。"
      ],
      guidance: [
        "南岛地点较分散，回答时最好给目标村名加坐标，而不是只说“往南走”。",
        "遇敌建议要区别村庄安全区和洞窟/野外。"
      ],
      source: "https://news.17173.com/z/stoneage/ditu/zb2.htm",
      sourceLabel: "17173/ditu/zb2"
    },
    {
      id: "village-shopping-index",
      category: "village",
      title: "村庄购物与服务设施索引",
      tags: ["村庄购物", "商店", "武器店", "防具店", "道具店", "便利商店", "医院", "肉屋", "宠物店", "竞技场", "百人道场", "24小时"],
      summary: "村庄购物页按新大陆、北岛、南岛、沙姆岛、吉鲁岛和其他服务区整理商店与设施。",
      facts: [
        "新大陆条目含伊甸园、地城塔耳塔、水城尼克斯、火城弗烈顿、风城亚伊欧。",
        "北岛条目含萨姆吉尔村、玛丽娜斯渔村、霍特尔、卡坦、柯尔克、柯奥、SBC 饲育员本部。",
        "南岛条目含加加、卡鲁它那、塔姆塔姆、多多、乌鲁力、奇喀喀、强恩一族洞窟、JBA 饲育员本部。",
        "其他服务含多城 24 小时、竞技场、北岛/南岛百人道场。"
      ],
      guidance: [
        "商店 NPC 只能围绕自己的商品和当前地图服务回答，不要代替别村商店卖货。",
        "玩家问补给时先推荐医院、肉屋、道具店和宠物店等当前地图已有服务。"
      ],
      source: "https://news.17173.com/z/stoneage/cunzhuang/cunzhuang.htm",
      sourceLabel: "17173/cunzhuang/index"
    },
    {
      id: "samugiru-shopping",
      category: "village",
      title: "萨姆吉尔村购物印象",
      tags: ["萨姆吉尔村", "萨村", "武器店", "防具店", "道具店", "记录点", "凯比特肉", "酒的精灵", "莱伊卡斧头"],
      summary: "萨姆吉尔村购物页列出记录点、武器店、防具店等详细价目，记录点资料提到需要凯比特肉。",
      facts: [
        "萨村记录点资料写在村内 92,99，需凯比特肉一块。",
        "武器店页列出斧、棍棒、枪、爪、投掷斧等早期装备。",
        "村庄商店价目是原版补给参考，当前 Worker 商品仍以 gmsv/itemset 和 NPC trade 为准。"
      ],
      guidance: [
        "萨村 NPC 可自然提到村内补给、记录点和基础装备，但结账必须走当前商品表。",
        "玩家问记录点时要看当前是否已实现 SavePoint NPC。"
      ],
      source: "https://news.17173.com/z/stoneage/cunzhuang/06.htm",
      sourceLabel: "17173/cunzhuang/06"
    },
    {
      id: "marinas-shopping",
      category: "village",
      title: "玛丽娜斯渔村购物印象",
      tags: ["玛丽娜斯", "玛丽娜斯渔村", "渔村", "武器店", "防具店", "海产", "料理材料"],
      summary: "玛丽娜斯渔村购物页列出武器、防具等价目；新手指南也提到渔村道具店偏料理材料。",
      facts: [
        "渔村常被称为玛丽娜斯，和海产、海之精灵意象相关。",
        "新手指南提到玛丽娜斯与加加村道具店出售料理材料，适合后续料理补血等用途。",
        "渔村也是红暴前置中弥生相关线索出现的村庄。"
      ],
      guidance: [
        "玩家说“渔村”时优先映射到玛丽娜斯渔村。",
        "料理相关问答可自然引导到材料、宠物料理技能或委托店。"
      ],
      source: "https://news.17173.com/z/stoneage/cunzhuang/07.htm",
      sourceLabel: "17173/cunzhuang/07"
    },
    {
      id: "gaga-karutana-shopping",
      category: "village",
      title: "加加村与卡鲁它那补给差异",
      tags: ["加加村", "卡鲁它那", "卡鲁他那", "料理材料", "合成素材", "南岛", "道具店", "武器店"],
      summary: "新手指南提到四个出生村商品差异：玛丽娜斯和加加偏料理材料，萨姆吉尔和卡鲁它那偏合成素材。",
      facts: [
        "加加村是加鲁卡岛的树上村落，资料中道具店偏料理材料。",
        "卡鲁它那是小岛组成的渔村，资料中道具店偏合成道具素材。",
        "南岛两村都是早期出生和补给节点，具体商店库存以当前 NPC trade 为准。"
      ],
      guidance: [
        "商人 NPC 回答“哪里买材料”时可以区分料理材料和合成素材。",
        "不要跨店直接卖别村素材；可以建议玩家走出口或请求向导传送。"
      ],
      source: "https://news.17173.com/z/stoneage/guide/14.htm",
      sourceLabel: "17173/guide/14"
    },
    ...QUEST_INDEX_25_KNOWLEDGE,
    {
      id: "ai-role-boundaries",
      category: "system",
      title: "AI/NPC 行为边界",
      tags: ["AI", "NPC", "向导", "交易", "传送", "奖励", "flag", "脚本", "gmsv", "VM", "不能编"],
      summary: "当前项目的 AI 只能解释、建议和提出 action proposal；真正状态变化必须走 Worker NPC VM 和本地规则。",
      facts: [
        "交易、传送、奖励、flag、避敌、折扣、赠品和战斗不能只靠语言生效。",
        "外部攻略用于专业表达和线索检索，不替代当前地图、NPC 脚本、背包和任务状态。",
        "如果资料库只知道任务索引，AI 必须说明缺少完整步骤，不能补造奖励或坐标。"
      ],
      guidance: [
        "每次回复都要把“我知道的攻略线索”和“当前能执行的动作”分开。",
        "NPC 要保持自身身份：商人谈商品，守门人谈条件，治疗师谈恢复，传送 NPC 谈目的地。"
      ],
      source: "local-worker-runtime",
      sourceLabel: "local/runtime"
    }
  ]
};
