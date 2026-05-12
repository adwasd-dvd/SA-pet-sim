export const WORLD = {
  "source": {
    "root": "ref___data",
    "maps": "ref___data/map/** LS2MAP",
    "clientMaps": "公益石器时代/map/*.dat",
    "npcs": "ref___data/npc/**/*.create + .template + args/config",
    "warps": "ref___data/map/mapwarp.txt",
    "encounters": "ref___data/encount.txt"
  },
  "startMap": "1000",
  "maps": {
    "100": {
      "id": "100",
      "floorId": 100,
      "name": "萨伊那斯",
      "mapFile": "/data/maps/100.ls2map",
      "clientMapFile": "/data/client-maps/100.dat",
      "clientMapSource": "公益石器时代/map/100.dat",
      "summary": "萨伊那斯 | floor=100 | 800x800 | ref___data/map/sainasu/sainasu",
      "size": [
        800,
        800
      ],
      "spawn": [
        566,
        478
      ],
      "encounterPets": [
        88,
        91,
        89,
        92,
        1230,
        94,
        90,
        93
      ],
      "npcs": [
        {
          "id": "100-412-337-5188",
          "name": "权利书贩卖处",
          "x": 412,
          "y": 337,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/genout/nevent_03.create",
          "script": "file:genout/ss_100_412_337",
          "template": "npcgen_shop",
          "graphic": "16017",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_100_412_337",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "想要",
              "kau",
              "buy"
            ],
            "sellWords": [
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 2475,
                "name": "一级采石权利书",
                "secretName": "一级采石权利书",
                "description": "柯尔克坑道的采石权利书",
                "image": 24222,
                "cost": 200,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 200
              },
              {
                "id": 2476,
                "name": "特级采石权利书",
                "secretName": "特级采石权利书",
                "description": "柯尔克坑道的采石权利书",
                "image": 24222,
                "cost": 600,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 600
              },
              {
                "id": 2477,
                "name": "超特级采石权利书",
                "secretName": "超特级采石权利书",
                "description": "柯尔克坑道的采石权利书",
                "image": 24222,
                "cost": 1000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 1000
              }
            ]
          }
        },
        {
          "id": "100-472-297-4",
          "name": "坏心眼的愿藏",
          "x": 472,
          "y": 297,
          "type": "NPCEnemy",
          "dialogue": "如果能赢过我的话就让你通过。要决胜负吗？",
          "dialogueLines": [
            "如果能赢过我的话就让你通过。要决胜负吗？",
            "有什么事吗？"
          ],
          "source": "ref___data/npc/100/sb_ganzo.create",
          "script": "file:100/sb_ganzo.arg",
          "template": "sb_ganzo",
          "graphic": "100401",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_ganzo.arg",
            "entype": 2,
            "enemyNos": [
              253,
              254
            ],
            "askBattleMessages": [
              "如果能赢过我的话就让你通过。要决胜负吗？"
            ],
            "startMessage": "呼拔吉，去吧！",
            "deniedMessage": "有什么事吗？",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 60,
            "warp": null
          }
        },
        {
          "id": "100-344-355-1",
          "name": "戴斯",
          "x": 344,
          "y": 355,
          "type": "NPCEnemy",
          "dialogue": "什么！给我滚到旁边去！",
          "dialogueLines": [
            "什么！给我滚到旁边去！",
            "什么!别妨碍我们、滚到旁边去!"
          ],
          "source": "ref___data/npc/100/sb_dpd.create",
          "script": "file:100/sb_dpd.arg",
          "template": "sb_dice",
          "graphic": "100432",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_dpd.arg",
            "entype": 2,
            "enemyNos": [
              1283,
              1282,
              1284,
              1285,
              1286
            ],
            "askBattleMessages": [
              "什么！给我滚到旁边去！",
              "还是你打算阻挠我们！",
              "我们的等级可都是LV65以上的呀!即使这样还是有赢的自信",
              "的话就放马过来吧!"
            ],
            "startMessage": "放马过来!",
            "deniedMessage": "什么!别妨碍我们、滚到旁边去!",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 300,
            "warp": null
          }
        },
        {
          "id": "100-344-356-2",
          "name": "宝卡",
          "x": 344,
          "y": 356,
          "type": "NPCEnemy",
          "dialogue": "什么！给我滚到旁边去！",
          "dialogueLines": [
            "什么！给我滚到旁边去！",
            "什么!别妨碍我们、滚到旁边去!"
          ],
          "source": "ref___data/npc/100/sb_dpd.create",
          "script": "file:100/sb_dpd.arg",
          "template": "sb_por",
          "graphic": "100436",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_dpd.arg",
            "entype": 2,
            "enemyNos": [
              1283,
              1282,
              1284,
              1285,
              1286
            ],
            "askBattleMessages": [
              "什么！给我滚到旁边去！",
              "还是你打算阻挠我们！",
              "我们的等级可都是LV65以上的呀!即使这样还是有赢的自信",
              "的话就放马过来吧!"
            ],
            "startMessage": "放马过来!",
            "deniedMessage": "什么!别妨碍我们、滚到旁边去!",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 300,
            "warp": null
          }
        },
        {
          "id": "100-344-357-3",
          "name": "达姿",
          "x": 344,
          "y": 357,
          "type": "NPCEnemy",
          "dialogue": "什么！给我滚到旁边去！",
          "dialogueLines": [
            "什么！给我滚到旁边去！",
            "什么!别妨碍我们、滚到旁边去!"
          ],
          "source": "ref___data/npc/100/sb_dpd.create",
          "script": "file:100/sb_dpd.arg",
          "template": "sb_dar",
          "graphic": "100434",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_dpd.arg",
            "entype": 2,
            "enemyNos": [
              1283,
              1282,
              1284,
              1285,
              1286
            ],
            "askBattleMessages": [
              "什么！给我滚到旁边去！",
              "还是你打算阻挠我们！",
              "我们的等级可都是LV65以上的呀!即使这样还是有赢的自信",
              "的话就放马过来吧!"
            ],
            "startMessage": "放马过来!",
            "deniedMessage": "什么!别妨碍我们、滚到旁边去!",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 300,
            "warp": null
          }
        },
        {
          "id": "100-651-585-7570",
          "name": "勇士之王",
          "x": 651,
          "y": 585,
          "type": "welfare",
          "dialogue": "这是白狼勇士工公会，准备好要学技能了吗？",
          "dialogueLines": [
            "这是白狼勇士工公会，准备好要学技能了吗？"
          ],
          "source": "ref___data/npc/sa70/skill.create",
          "script": "file:sa70/warsk3",
          "template": "ProfessionShop",
          "graphic": "16185"
        },
        {
          "id": "100-290-96-7694",
          "name": "检查员(D-5)",
          "x": 290,
          "y": 96,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_5d",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_5d",
          "template": "changeevent",
          "graphic": "16066"
        },
        {
          "id": "100-230-180-7731",
          "name": "卡坦",
          "x": 230,
          "y": 180,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/seimu/event/event02_1",
          "dialogueLines": [],
          "source": "ref___data/npc/seimu/event/event02_n.create",
          "script": "file:seimu/event/event02_1",
          "template": "changeevent",
          "graphic": "16033"
        },
        {
          "id": "100-615-190-7723",
          "name": "肉店老板",
          "x": 615,
          "y": 190,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/scipt_plus/fishlevelup/npc_at_100",
          "dialogueLines": [],
          "source": "ref___data/npc/scipt_plus/fishlevelup/fishlevelup.create",
          "script": "file:scipt_plus/fishlevelup/npc_at_100",
          "template": "changeevent",
          "graphic": "16054"
        },
        {
          "id": "100-670-245-7691",
          "name": "检查员(D-2)",
          "x": 670,
          "y": 245,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_2d",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_2d",
          "template": "changeevent",
          "graphic": "16065"
        },
        {
          "id": "100-180-339-5790",
          "name": "洞窟前的护士",
          "x": 180,
          "y": 339,
          "type": "WindowHealer",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_winhealer",
          "template": "npcgen_winhealer",
          "graphic": "16012"
        },
        {
          "id": "100-183-346-6124",
          "name": "阿布的洞窟之前的储存点",
          "x": 183,
          "y": 346,
          "type": "SavePoint",
          "dialogue": "脚本入口：ref___data/npc/genout/sp_100_183_346",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/sp.create",
          "script": "file:genout/sp_100_183_346",
          "template": "npcgen_savepoint",
          "graphic": "10048"
        },
        {
          "id": "100-346-356-7660",
          "name": "姆哈萨",
          "x": 346,
          "y": 356,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/genou_3",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/genou/genou.create",
          "script": "file:sainasu/event/genou_3",
          "template": "changeevent",
          "graphic": "100110"
        },
        {
          "id": "100-167-398-7704",
          "name": "里奥",
          "x": 167,
          "y": 398,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/rion",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/rion.create",
          "script": "file:sainasu/event/rion",
          "template": "changeevent",
          "graphic": "100015"
        },
        {
          "id": "100-343-464-5789",
          "name": "森林的护士",
          "x": 343,
          "y": 464,
          "type": "WindowHealer",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_winhealer",
          "template": "npcgen_winhealer",
          "graphic": "16058"
        },
        {
          "id": "100-344-466-6123",
          "name": "森林中的储存点",
          "x": 344,
          "y": 466,
          "type": "SavePoint",
          "dialogue": "脚本入口：ref___data/npc/genout/sp_100_344_466",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/sp.create",
          "script": "file:genout/sp_100_344_466",
          "template": "npcgen_savepoint",
          "graphic": "10048"
        },
        {
          "id": "100-404-466-7629",
          "name": "艾尔斯",
          "x": 404,
          "y": 466,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa80/gloves/gloves_1",
          "dialogueLines": [],
          "source": "ref___data/npc/sa80/gloves/gloves.create",
          "script": "file:sa80/gloves/gloves_1",
          "template": "changeevent",
          "graphic": "16353"
        },
        {
          "id": "100-74-489-7701",
          "name": "检查员(D-12)",
          "x": 74,
          "y": 489,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_12d",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_12d",
          "template": "changeevent",
          "graphic": "16066"
        },
        {
          "id": "100-727-500-7690",
          "name": "检查员(D-1)",
          "x": 727,
          "y": 500,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_1d",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_1d",
          "template": "changeevent",
          "graphic": "16065"
        },
        {
          "id": "100-428-543-7696",
          "name": "检查员(D-7)",
          "x": 428,
          "y": 543,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_7d",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_7d",
          "template": "changeevent",
          "graphic": "16065"
        },
        {
          "id": "100-291-96-5280",
          "name": "看板",
          "x": 291,
          "y": 96,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_291_96",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_100_291_96",
          "template": "npcgen_signboard",
          "graphic": "10063"
        },
        {
          "id": "100-465-128-1679",
          "name": "看板",
          "x": 465,
          "y": 128,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_465_128",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/11100npc.create",
          "script": "file:genout/signb_100_465_128",
          "template": "npcgen_signboard",
          "graphic": "10096"
        },
        {
          "id": "100-670-244-5277",
          "name": "看板",
          "x": 670,
          "y": 244,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_670_244",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_100_670_244",
          "template": "npcgen_signboard",
          "graphic": "10062"
        },
        {
          "id": "100-413-335-5189",
          "name": "看板",
          "x": 413,
          "y": 335,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_413_335",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/nevent_03.create",
          "script": "file:genout/signb_100_413_335",
          "template": "npcgen_signboard",
          "graphic": "10062"
        },
        {
          "id": "100-183-339-5791",
          "name": "洞窟前的留言板",
          "x": 183,
          "y": 339,
          "type": "Dengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_dengon",
          "template": "npcgen_dengon",
          "graphic": "10063"
        },
        {
          "id": "100-190-363-1498",
          "name": "看板",
          "x": 190,
          "y": 363,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_190_363",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/10000npc.create",
          "script": "file:genout/signb_100_190_363",
          "template": "npcgen_signboard",
          "graphic": "10095"
        },
        {
          "id": "100-190-426-1497",
          "name": "看板",
          "x": 190,
          "y": 426,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_190_426",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/10000npc.create",
          "script": "file:genout/signb_100_190_426",
          "template": "npcgen_signboard",
          "graphic": "10096"
        },
        {
          "id": "100-627-485-96",
          "name": "を禜そó",
          "x": 627,
          "y": 485,
          "type": "Bus",
          "dialogue": "脚本入口：ref___data/npc/chatroom/bus.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/bus.create",
          "script": "file:chatroom/bus.arg",
          "template": "bus",
          "graphic": "100355"
        },
        {
          "id": "100-631-485-97",
          "name": "を禜そó",
          "x": 631,
          "y": 485,
          "type": "Bus",
          "dialogue": "脚本入口：ref___data/npc/chatroom/bus3.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/bus.create",
          "script": "file:chatroom/bus3.arg",
          "template": "bus",
          "graphic": "100355"
        },
        {
          "id": "100-633-486-2158",
          "name": "长毛象客运",
          "x": 633,
          "y": 486,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_100_633_486",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/msg_100_633_486",
          "template": "npcgen_man",
          "graphic": "16027"
        },
        {
          "id": "100-635-487-2159",
          "name": "使用方法",
          "x": 635,
          "y": 487,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_635_487",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/signb_100_635_487",
          "template": "npcgen_signboard",
          "graphic": "10096"
        },
        {
          "id": "100-626-488-2161",
          "name": "往玛丽那丝",
          "x": 626,
          "y": 488,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_626_488",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/signb_100_626_488",
          "template": "npcgen_signboard",
          "graphic": "10401"
        },
        {
          "id": "100-629-488-2160",
          "name": "往柯奥",
          "x": 629,
          "y": 488,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_629_488",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/signb_100_629_488",
          "template": "npcgen_signboard",
          "graphic": "10401"
        },
        {
          "id": "100-75-489-5287",
          "name": "看板",
          "x": 75,
          "y": 489,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_75_489",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_100_75_489",
          "template": "npcgen_signboard",
          "graphic": "10063"
        },
        {
          "id": "100-728-501-5276",
          "name": "看板",
          "x": 728,
          "y": 501,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_728_501",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_100_728_501",
          "template": "npcgen_signboard",
          "graphic": "10062"
        },
        {
          "id": "100-428-544-5282",
          "name": "看板",
          "x": 428,
          "y": 544,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_428_544",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_100_428_544",
          "template": "npcgen_signboard",
          "graphic": "10062"
        },
        {
          "id": "100-460-625-2169",
          "name": "往玛丽那丝",
          "x": 460,
          "y": 625,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_460_625",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/signb_100_460_625",
          "template": "npcgen_signboard",
          "graphic": "10401"
        },
        {
          "id": "100-463-625-2168",
          "name": "往萨姆吉尔",
          "x": 463,
          "y": 625,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_463_625",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/signb_100_463_625",
          "template": "npcgen_signboard",
          "graphic": "10401"
        },
        {
          "id": "100-467-627-2166",
          "name": "长毛象客运",
          "x": 467,
          "y": 627,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_100_467_627",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/msg_100_467_627",
          "template": "npcgen_man",
          "graphic": "16026"
        },
        {
          "id": "100-469-629-2167",
          "name": "使用方法",
          "x": 469,
          "y": 629,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_469_629",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/signb_100_469_629",
          "template": "npcgen_signboard",
          "graphic": "10095"
        },
        {
          "id": "100-115-654-2162",
          "name": "长毛象客运",
          "x": 115,
          "y": 654,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_100_115_654",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/msg_100_115_654",
          "template": "npcgen_man",
          "graphic": "16027"
        },
        {
          "id": "100-120-654-98",
          "name": "を禜そó",
          "x": 120,
          "y": 654,
          "type": "Bus",
          "dialogue": "脚本入口：ref___data/npc/chatroom/bus4.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/bus.create",
          "script": "file:chatroom/bus4.arg",
          "template": "bus",
          "graphic": "100355"
        },
        {
          "id": "100-119-656-2164",
          "name": "往萨姆吉尔",
          "x": 119,
          "y": 656,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_119_656",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/signb_100_119_656",
          "template": "npcgen_signboard",
          "graphic": "10401"
        },
        {
          "id": "100-122-656-2165",
          "name": "往柯奥",
          "x": 122,
          "y": 656,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_122_656",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/signb_100_122_656",
          "template": "npcgen_signboard",
          "graphic": "10401"
        },
        {
          "id": "100-114-658-2163",
          "name": "使用方法",
          "x": 114,
          "y": 658,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_100_114_658",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/bus.create",
          "script": "file:genout/signb_100_114_658",
          "template": "npcgen_signboard",
          "graphic": "10095"
        },
        {
          "id": "100-443-127-1678",
          "name": "盗贼",
          "x": 443,
          "y": 127,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_100_443_127",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/11100npc.create",
          "script": "file:genout/wpm_100_443_127",
          "template": "npcgen_warpman",
          "graphic": "100433",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "11101",
              "floor": 11101,
              "x": 33,
              "y": 29
            },
            "free": "LV>0",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "",
            "payMessage": "",
            "normalMessage": "干么，有什么事吗？,喂，你看什么看。",
            "moneyMessage": "",
            "partyMessage": "",
            "warpMessage": "在卡坦有梦德",
            "source": "ref___data/npc/genout/wpm_100_443_127"
          }
        },
        {
          "id": "100-278-325-4508",
          "name": "守人",
          "x": 278,
          "y": 325,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_100_278_325",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/genou.create",
          "script": "file:genout/wpm_100_278_325",
          "template": "npcgen_warpman",
          "graphic": "16202",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "11201",
              "floor": 11201,
              "x": 29,
              "y": 79
            },
            "free": "LV>69&ENDEV=4",
            "money": "-1",
            "cost": {
              "mode": "unavailable"
            },
            "deleteItems": [],
            "freeMessage": "你进入这个洞窟 应该没问题吧 等级低的人进入这里的话 会有危险的啊 请进吧。",
            "payMessage": "这里是非常危险的恐龙出没的地方 你现在的等级进来这里还太危险了 你还是不要进来比较好。",
            "normalMessage": "",
            "moneyMessage": "你的强度好像还不够进入这里。 等你变强一点再来比较好哦。",
            "partyMessage": "团队不能进入这里",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_100_278_325"
          }
        },
        {
          "id": "100-412-339-5190",
          "name": "矿工",
          "x": 412,
          "y": 339,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_100_412_339",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/nevent_03.create",
          "script": "file:genout/wpm_100_412_339",
          "template": "npcgen_warpman",
          "graphic": "16056",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "10601",
              "floor": 10601,
              "x": 28,
              "y": 49
            },
            "free": "LV>0",
            "money": "-1",
            "cost": {
              "mode": "unavailable"
            },
            "deleteItems": [],
            "freeMessage": "由于这个坑道的采矿竞争率很高， 所以不允许团体行动。 最近有盗矿贼出没，我们都严加戒备。 你是不是也想来这大捞一笔啊？ 如果你要进去的话，我可以让你从这边通过唷！",
            "payMessage": "",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "最近盗矿贼出没，大家都严加戒备。 由于这个缘故， 所以团体行动是不被允许的。",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_100_412_339"
          }
        },
        {
          "id": "100-258-170-1585",
          "name": "Warp",
          "x": 258,
          "y": 170,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-259-170-1586",
          "name": "Warp",
          "x": 259,
          "y": 170,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-260-170-1587",
          "name": "Warp",
          "x": 260,
          "y": 170,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-622-190-1569",
          "name": "Warp",
          "x": 622,
          "y": 190,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-622-191-1570",
          "name": "Warp",
          "x": 622,
          "y": 191,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-622-192-1571",
          "name": "Warp",
          "x": 622,
          "y": 192,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-622-193-1572",
          "name": "Warp",
          "x": 622,
          "y": 193,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-622-194-1573",
          "name": "Warp",
          "x": 622,
          "y": 194,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-622-195-1574",
          "name": "Warp",
          "x": 622,
          "y": 195,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-622-196-1575",
          "name": "Warp",
          "x": 622,
          "y": 196,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-622-197-1576",
          "name": "Warp",
          "x": 622,
          "y": 197,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-666-235-2864",
          "name": "Warp",
          "x": 666,
          "y": 235,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon03.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-184-339-6540",
          "name": "Warp",
          "x": 184,
          "y": 339,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-185-339-6542",
          "name": "Warp",
          "x": 185,
          "y": 339,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-191-365-2297",
          "name": "Warp",
          "x": 191,
          "y": 365,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-132-421-1618",
          "name": "Warp",
          "x": 132,
          "y": 421,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/10701d.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-318-428-2312",
          "name": "Warp",
          "x": 318,
          "y": 428,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-237-445-2392",
          "name": "Warp",
          "x": 237,
          "y": 445,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-237-445-2394",
          "name": "Warp",
          "x": 237,
          "y": 445,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-706-487-1533",
          "name": "Warp",
          "x": 706,
          "y": 487,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-707-487-1534",
          "name": "Warp",
          "x": 707,
          "y": 487,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-708-487-1535",
          "name": "Warp",
          "x": 708,
          "y": 487,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-709-487-1536",
          "name": "Warp",
          "x": 709,
          "y": 487,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-710-487-1537",
          "name": "Warp",
          "x": 710,
          "y": 487,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-638-491-1525",
          "name": "Warp",
          "x": 638,
          "y": 491,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-638-492-1526",
          "name": "Warp",
          "x": 638,
          "y": 492,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-638-493-1527",
          "name": "Warp",
          "x": 638,
          "y": 493,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-638-494-1528",
          "name": "Warp",
          "x": 638,
          "y": 494,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-607-561-4214",
          "name": "Warp",
          "x": 607,
          "y": 561,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-607-562-4215",
          "name": "Warp",
          "x": 607,
          "y": 562,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-607-563-4216",
          "name": "Warp",
          "x": 607,
          "y": 563,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-607-564-4217",
          "name": "Warp",
          "x": 607,
          "y": 564,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-607-565-4218",
          "name": "Warp",
          "x": 607,
          "y": 565,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-72-586-4246",
          "name": "Warp",
          "x": 72,
          "y": 586,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-73-586-4242",
          "name": "Warp",
          "x": 73,
          "y": 586,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-71-587-4247",
          "name": "Warp",
          "x": 71,
          "y": 587,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-72-587-4243",
          "name": "Warp",
          "x": 72,
          "y": 587,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-70-588-4248",
          "name": "Warp",
          "x": 70,
          "y": 588,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-71-588-4244",
          "name": "Warp",
          "x": 71,
          "y": 588,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-70-589-4245",
          "name": "Warp",
          "x": 70,
          "y": 589,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-78-614-1543",
          "name": "Warp",
          "x": 78,
          "y": 614,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-78-615-1544",
          "name": "Warp",
          "x": 78,
          "y": 615,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-78-616-1545",
          "name": "Warp",
          "x": 78,
          "y": 616,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-78-617-1546",
          "name": "Warp",
          "x": 78,
          "y": 617,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-470-631-1559",
          "name": "Warp",
          "x": 470,
          "y": 631,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-471-631-1560",
          "name": "Warp",
          "x": 471,
          "y": 631,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-472-631-1561",
          "name": "Warp",
          "x": 472,
          "y": 631,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-473-631-1562",
          "name": "Warp",
          "x": 473,
          "y": 631,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-474-631-1563",
          "name": "Warp",
          "x": 474,
          "y": 631,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-328-633-2430",
          "name": "Warp",
          "x": 328,
          "y": 633,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-328-633-2432",
          "name": "Warp",
          "x": 328,
          "y": 633,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-549-637-4990",
          "name": "Warp",
          "x": 549,
          "y": 637,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-549-638-4988",
          "name": "Warp",
          "x": 549,
          "y": 638,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-113-660-1551",
          "name": "Warp",
          "x": 113,
          "y": 660,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-113-661-1552",
          "name": "Warp",
          "x": 113,
          "y": 661,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-113-662-1553",
          "name": "Warp",
          "x": 113,
          "y": 662,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-113-663-1554",
          "name": "Warp",
          "x": 113,
          "y": 663,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-643-676-4999",
          "name": "Warp",
          "x": 643,
          "y": 676,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "100-643-677-5001",
          "name": "Warp",
          "x": 643,
          "y": 677,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1040-0",
          "label": "去 萨姆吉尔庄园",
          "detail": "萨姆吉尔庄园 | floor 1040 | 目标 (24,43) | 入口 5 格 (607,561)-(607,565)",
          "to": "1040",
          "x": 607,
          "y": 563,
          "bounds": [
            607,
            561,
            607,
            565
          ],
          "target": [
            24,
            43
          ],
          "tiles": [
            {
              "x": 607,
              "y": 561,
              "target": [
                24,
                41
              ]
            },
            {
              "x": 607,
              "y": 562,
              "target": [
                24,
                42
              ]
            },
            {
              "x": 607,
              "y": 563,
              "target": [
                24,
                43
              ]
            },
            {
              "x": 607,
              "y": 564,
              "target": [
                24,
                44
              ]
            },
            {
              "x": 607,
              "y": 565,
              "target": [
                24,
                45
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2030-1",
          "label": "去 玛丽娜丝的庄园",
          "detail": "玛丽娜丝的庄园 | floor 2030 | 目标 (63,64) | 入口 7 格 (70,586)-(73,589)",
          "to": "2030",
          "x": 71,
          "y": 587,
          "bounds": [
            70,
            586,
            73,
            589
          ],
          "target": [
            63,
            64
          ],
          "tiles": [
            {
              "x": 73,
              "y": 586,
              "target": [
                65,
                62
              ]
            },
            {
              "x": 72,
              "y": 587,
              "target": [
                64,
                63
              ]
            },
            {
              "x": 71,
              "y": 588,
              "target": [
                63,
                64
              ]
            },
            {
              "x": 70,
              "y": 589,
              "target": [
                62,
                65
              ]
            },
            {
              "x": 72,
              "y": 586,
              "target": [
                64,
                63
              ]
            },
            {
              "x": 71,
              "y": 587,
              "target": [
                63,
                64
              ]
            },
            {
              "x": 70,
              "y": 588,
              "target": [
                62,
                65
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1000-2",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (50,118) | 入口 4 格 (638,491)-(638,494)",
          "to": "1000",
          "x": 638,
          "y": 493,
          "bounds": [
            638,
            491,
            638,
            494
          ],
          "target": [
            50,
            118
          ],
          "tiles": [
            {
              "x": 638,
              "y": 491,
              "target": [
                50,
                116
              ]
            },
            {
              "x": 638,
              "y": 492,
              "target": [
                50,
                117
              ]
            },
            {
              "x": 638,
              "y": 493,
              "target": [
                50,
                118
              ]
            },
            {
              "x": 638,
              "y": 494,
              "target": [
                50,
                119
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1000-3",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (119,111) | 入口 5 格 (706,487)-(710,487)",
          "to": "1000",
          "x": 708,
          "y": 487,
          "bounds": [
            706,
            487,
            710,
            487
          ],
          "target": [
            119,
            111
          ],
          "tiles": [
            {
              "x": 706,
              "y": 487,
              "target": [
                117,
                111
              ]
            },
            {
              "x": 707,
              "y": 487,
              "target": [
                118,
                111
              ]
            },
            {
              "x": 708,
              "y": 487,
              "target": [
                119,
                111
              ]
            },
            {
              "x": 709,
              "y": 487,
              "target": [
                120,
                111
              ]
            },
            {
              "x": 710,
              "y": 487,
              "target": [
                121,
                111
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2000-4",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (72,35) | 入口 4 格 (78,614)-(78,617)",
          "to": "2000",
          "x": 78,
          "y": 616,
          "bounds": [
            78,
            614,
            78,
            617
          ],
          "target": [
            72,
            35
          ],
          "tiles": [
            {
              "x": 78,
              "y": 614,
              "target": [
                72,
                33
              ]
            },
            {
              "x": 78,
              "y": 615,
              "target": [
                72,
                34
              ]
            },
            {
              "x": 78,
              "y": 616,
              "target": [
                72,
                35
              ]
            },
            {
              "x": 78,
              "y": 617,
              "target": [
                72,
                36
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2000-5",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (107,81) | 入口 4 格 (113,660)-(113,663)",
          "to": "2000",
          "x": 113,
          "y": 662,
          "bounds": [
            113,
            660,
            113,
            663
          ],
          "target": [
            107,
            81
          ],
          "tiles": [
            {
              "x": 113,
              "y": 660,
              "target": [
                107,
                79
              ]
            },
            {
              "x": 113,
              "y": 661,
              "target": [
                107,
                80
              ]
            },
            {
              "x": 113,
              "y": 662,
              "target": [
                107,
                81
              ]
            },
            {
              "x": 113,
              "y": 663,
              "target": [
                107,
                82
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1100-6",
          "label": "去 柯奥村�",
          "detail": "柯奥村� | floor 1100 | 目标 (65,35) | 入口 5 格 (470,631)-(474,631)",
          "to": "1100",
          "x": 472,
          "y": 631,
          "bounds": [
            470,
            631,
            474,
            631
          ],
          "target": [
            65,
            35
          ],
          "tiles": [
            {
              "x": 470,
              "y": 631,
              "target": [
                63,
                35
              ]
            },
            {
              "x": 471,
              "y": 631,
              "target": [
                64,
                35
              ]
            },
            {
              "x": 472,
              "y": 631,
              "target": [
                65,
                35
              ]
            },
            {
              "x": 473,
              "y": 631,
              "target": [
                66,
                35
              ]
            },
            {
              "x": 474,
              "y": 631,
              "target": [
                67,
                35
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1300-7",
          "label": "去 霍特尔村�",
          "detail": "霍特尔村� | floor 1300 | 目标 (24,63) | 入口 8 格 (622,190)-(622,197)",
          "to": "1300",
          "x": 622,
          "y": 194,
          "bounds": [
            622,
            190,
            622,
            197
          ],
          "target": [
            24,
            63
          ],
          "tiles": [
            {
              "x": 622,
              "y": 190,
              "target": [
                24,
                59
              ]
            },
            {
              "x": 622,
              "y": 191,
              "target": [
                24,
                60
              ]
            },
            {
              "x": 622,
              "y": 192,
              "target": [
                24,
                61
              ]
            },
            {
              "x": 622,
              "y": 193,
              "target": [
                24,
                62
              ]
            },
            {
              "x": 622,
              "y": 194,
              "target": [
                24,
                63
              ]
            },
            {
              "x": 622,
              "y": 195,
              "target": [
                24,
                64
              ]
            },
            {
              "x": 622,
              "y": 196,
              "target": [
                24,
                65
              ]
            },
            {
              "x": 622,
              "y": 197,
              "target": [
                24,
                66
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1400-8",
          "label": "去 卡坦村温�",
          "detail": "卡坦村温� | floor 1400 | 目标 (71,115) | 入口 3 格 (258,170)-(260,170)",
          "to": "1400",
          "x": 259,
          "y": 170,
          "bounds": [
            258,
            170,
            260,
            170
          ],
          "target": [
            71,
            115
          ],
          "tiles": [
            {
              "x": 258,
              "y": 170,
              "target": [
                70,
                115
              ]
            },
            {
              "x": 259,
              "y": 170,
              "target": [
                71,
                115
              ]
            },
            {
              "x": 260,
              "y": 170,
              "target": [
                72,
                115
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "101-9",
          "label": "去 阿布的独栋房屋",
          "detail": "阿布的独栋房屋 | floor 101 | 目标 (16,21) | 入口 2 格 (184,339)-(185,339)",
          "to": "101",
          "x": 185,
          "y": 339,
          "bounds": [
            184,
            339,
            185,
            339
          ],
          "target": [
            16,
            21
          ],
          "tiles": [
            {
              "x": 184,
              "y": 339,
              "target": [
                15,
                21
              ]
            },
            {
              "x": 185,
              "y": 339,
              "target": [
                16,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "120-10",
          "label": "去 靠近水田的家|00",
          "detail": "靠近水田的家|00 | floor 120 | 目标 (10,17) | 入口 2 格 (549,637)-(549,638)",
          "to": "120",
          "x": 549,
          "y": 638,
          "bounds": [
            549,
            637,
            549,
            638
          ],
          "target": [
            10,
            17
          ],
          "tiles": [
            {
              "x": 549,
              "y": 638,
              "target": [
                10,
                17
              ]
            },
            {
              "x": 549,
              "y": 637,
              "target": [
                10,
                16
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "121-11",
          "label": "去 岬之家",
          "detail": "岬之家 | floor 121 | 目标 (10,17) | 入口 2 格 (643,676)-(643,677)",
          "to": "121",
          "x": 643,
          "y": 677,
          "bounds": [
            643,
            676,
            643,
            677
          ],
          "target": [
            10,
            17
          ],
          "tiles": [
            {
              "x": 643,
              "y": 676,
              "target": [
                10,
                16
              ]
            },
            {
              "x": 643,
              "y": 677,
              "target": [
                10,
                17
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "10701-12",
          "label": "去 盗贼的洞窟地下１楼|0K",
          "detail": "盗贼的洞窟地下１楼|0K | floor 10701 | 目标 (76,67) | 入口 (132,421)",
          "to": "10701",
          "x": 132,
          "y": 421,
          "bounds": [
            132,
            421,
            132,
            421
          ],
          "target": [
            76,
            67
          ],
          "tiles": [
            {
              "x": 132,
              "y": 421,
              "target": [
                76,
                67
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "10001-13",
          "label": "去 阿布的洞窟地下１楼|00",
          "detail": "阿布的洞窟地下１楼|00 | floor 10001 | 目标 (40,3) | 入口 (191,365)",
          "to": "10001",
          "x": 191,
          "y": 365,
          "bounds": [
            191,
            365,
            191,
            365
          ],
          "target": [
            40,
            3
          ],
          "tiles": [
            {
              "x": 191,
              "y": 365,
              "target": [
                40,
                3
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "10101-14",
          "label": "去 往柯尔克的道路１楼|00",
          "detail": "往柯尔克的道路１楼|00 | floor 10101 | 目标 (14,49) | 入口 (318,428)",
          "to": "10101",
          "x": 318,
          "y": 428,
          "bounds": [
            318,
            428,
            318,
            428
          ],
          "target": [
            14,
            49
          ],
          "tiles": [
            {
              "x": 318,
              "y": 428,
              "target": [
                14,
                49
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "10901-15",
          "label": "去 柯尔克的大坑道１楼",
          "detail": "柯尔克的大坑道１楼 | floor 10901 | 目标 (25,49) | 入口 (237,445)",
          "to": "10901",
          "x": 237,
          "y": 445,
          "bounds": [
            237,
            445,
            237,
            445
          ],
          "target": [
            25,
            49
          ],
          "tiles": [
            {
              "x": 237,
              "y": 445,
              "target": [
                25,
                49
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "11001-16",
          "label": "去 柯奥山的小洞窟１楼",
          "detail": "柯奥山的小洞窟１楼 | floor 11001 | 目标 (0,43) | 入口 (328,633)",
          "to": "11001",
          "x": 328,
          "y": 633,
          "bounds": [
            328,
            633,
            328,
            633
          ],
          "target": [
            0,
            43
          ],
          "tiles": [
            {
              "x": 328,
              "y": 633,
              "target": [
                0,
                43
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "31401-17",
          "label": "去 奇努伊的海底通路|10",
          "detail": "奇努伊的海底通路|10 | floor 31401 | 目标 (12,2) | 入口 (666,235)",
          "to": "31401",
          "x": 666,
          "y": 235,
          "bounds": [
            666,
            235,
            666,
            235
          ],
          "target": [
            12,
            2
          ],
          "tiles": [
            {
              "x": 666,
              "y": 235,
              "target": [
                12,
                2
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-18",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (216,6) | 入口 2 格 (396,186)-(396,187)",
          "to": "8200",
          "x": 396,
          "y": 187,
          "bounds": [
            396,
            186,
            396,
            187
          ],
          "target": [
            216,
            6
          ],
          "tiles": [
            {
              "x": 396,
              "y": 186,
              "target": [
                216,
                6
              ]
            },
            {
              "x": 396,
              "y": 187,
              "target": [
                216,
                6
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8216-19",
          "label": "去 白狼勇士公会",
          "detail": "白狼勇士公会 | floor 8216 | 目标 (2,23) | 入口 3 格 (653,608)-(653,610)",
          "to": "8216",
          "x": 653,
          "y": 609,
          "bounds": [
            653,
            608,
            653,
            610
          ],
          "target": [
            2,
            23
          ],
          "tiles": [
            {
              "x": 653,
              "y": 608,
              "target": [
                2,
                22
              ]
            },
            {
              "x": 653,
              "y": 609,
              "target": [
                2,
                23
              ]
            },
            {
              "x": 653,
              "y": 610,
              "target": [
                2,
                24
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "101": {
      "id": "101",
      "floorId": 101,
      "name": "阿布的独栋房屋",
      "mapFile": "/data/maps/101.ls2map",
      "clientMapFile": "/data/client-maps/101.dat",
      "clientMapSource": "公益石器时代/map/101.dat",
      "summary": "阿布的独栋房屋 | floor=101 | 30x30 | ref___data/map/sainasu/sonota/101",
      "size": [
        30,
        30
      ],
      "spawn": [
        15,
        21
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "101-15-21-6541",
          "name": "Warp",
          "x": 15,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "101-16-21-6543",
          "name": "Warp",
          "x": 16,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (185,339) | 入口 2 格 (15,21)-(16,21)",
          "to": "100",
          "x": 16,
          "y": 21,
          "bounds": [
            15,
            21,
            16,
            21
          ],
          "target": [
            185,
            339
          ],
          "tiles": [
            {
              "x": 15,
              "y": 21,
              "target": [
                184,
                339
              ]
            },
            {
              "x": 16,
              "y": 21,
              "target": [
                185,
                339
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "120": {
      "id": "120",
      "floorId": 120,
      "name": "靠近水田的家|00",
      "mapFile": "/data/maps/120.ls2map",
      "clientMapFile": "/data/client-maps/120.dat",
      "clientMapSource": "公益石器时代/map/120.dat",
      "summary": "靠近水田的家|00 | floor=120 | 30x30 | ref___data/map/extra/120",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        17
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "120-19-15-5004",
          "name": "房子主人",
          "x": 19,
          "y": 15,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_120_19_15",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "file:genout/wpm_120_19_15",
          "template": "npcgen_warpman",
          "graphic": "16017",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "122",
              "floor": 122,
              "x": 6,
              "y": 5
            },
            "free": "LV>49",
            "money": "-1",
            "cost": {
              "mode": "unavailable"
            },
            "deleteItems": [],
            "freeMessage": "你就算进入地下的迷宫洞窟 也没有问题吧。 等级低的人 到那里会很危险啊。 你要进入迷宫吗？",
            "payMessage": "这里的地下洞窟是一个迷宫啊。 以你的等级来说还太危险了 你还是不要去比较好。",
            "normalMessage": "",
            "moneyMessage": "你的强度还不足以去那里 你变强一点再来比较好。",
            "partyMessage": "团队没办法进入那里",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_120_19_15"
          }
        },
        {
          "id": "120-10-16-4991",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "120-10-17-4989",
          "name": "Warp",
          "x": 10,
          "y": 17,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (549,638) | 入口 2 格 (10,16)-(10,17)",
          "to": "100",
          "x": 10,
          "y": 17,
          "bounds": [
            10,
            16,
            10,
            17
          ],
          "target": [
            549,
            638
          ],
          "tiles": [
            {
              "x": 10,
              "y": 17,
              "target": [
                549,
                638
              ]
            },
            {
              "x": 10,
              "y": 16,
              "target": [
                549,
                637
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "121": {
      "id": "121",
      "floorId": 121,
      "name": "岬之家",
      "mapFile": "/data/maps/121.ls2map",
      "clientMapFile": "/data/client-maps/121.dat",
      "clientMapSource": "公益石器时代/map/121.dat",
      "summary": "岬之家 | floor=121 | 30x30 | ref___data/map/extra/121",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        16
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "121-23-15-5003",
          "name": "山上的老人",
          "x": 23,
          "y": 15,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_121_23_15",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "file:genout/msg_121_23_15",
          "template": "npcgen_man",
          "graphic": "16064"
        },
        {
          "id": "121-10-16-4998",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "121-10-17-5000",
          "name": "Warp",
          "x": 10,
          "y": 17,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (643,677) | 入口 2 格 (10,16)-(10,17)",
          "to": "100",
          "x": 10,
          "y": 17,
          "bounds": [
            10,
            16,
            10,
            17
          ],
          "target": [
            643,
            677
          ],
          "tiles": [
            {
              "x": 10,
              "y": 16,
              "target": [
                643,
                676
              ]
            },
            {
              "x": 10,
              "y": 17,
              "target": [
                643,
                677
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "122": {
      "id": "122",
      "floorId": 122,
      "name": "迷宫",
      "mapFile": "/data/maps/122.ls2map",
      "clientMapFile": "/data/client-maps/122.dat",
      "clientMapSource": "公益石器时代/map/122.dat",
      "summary": "迷宫 | floor=122 | 300x200 | ref___data/map/extra/122",
      "size": [
        300,
        200
      ],
      "spawn": [
        289,
        168
      ],
      "encounterPets": [
        565,
        566,
        567,
        568,
        569,
        570
      ],
      "npcs": [
        {
          "id": "122-162-12-15",
          "name": "宝物袋",
          "x": 162,
          "y": 12,
          "type": "NPCEnemy",
          "dialogue": "绑在袋口的绳子",
          "dialogueLines": [
            "绑在袋口的绳子",
            "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。"
          ],
          "source": "ref___data/npc/100/sb_mimi.create",
          "script": "file:100/sb_mimi.arg",
          "template": "sb_hag",
          "graphic": "16073",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_mimi.arg",
            "entype": 2,
            "enemyNos": [
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117
            ],
            "askBattleMessages": [
              "绑在袋口的绳子",
              "用切绳石把它割开吗？"
            ],
            "startMessage": "宝袋口打开了之后恐龙从里面飞了出来！",
            "deniedMessage": "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 60,
            "warp": null
          }
        },
        {
          "id": "122-78-96-11",
          "name": "宝物袋",
          "x": 78,
          "y": 96,
          "type": "NPCEnemy",
          "dialogue": "绑在袋口的绳子",
          "dialogueLines": [
            "绑在袋口的绳子",
            "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。"
          ],
          "source": "ref___data/npc/100/sb_mimi.create",
          "script": "file:100/sb_mimi.arg",
          "template": "sb_hag",
          "graphic": "16073",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_mimi.arg",
            "entype": 2,
            "enemyNos": [
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117
            ],
            "askBattleMessages": [
              "绑在袋口的绳子",
              "用切绳石把它割开吗？"
            ],
            "startMessage": "宝袋口打开了之后恐龙从里面飞了出来！",
            "deniedMessage": "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 60,
            "warp": null
          }
        },
        {
          "id": "122-78-102-10",
          "name": "宝物袋",
          "x": 78,
          "y": 102,
          "type": "NPCEnemy",
          "dialogue": "绑在袋口的绳子",
          "dialogueLines": [
            "绑在袋口的绳子",
            "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。"
          ],
          "source": "ref___data/npc/100/sb_mimi.create",
          "script": "file:100/sb_mimi.arg",
          "template": "sb_hag",
          "graphic": "16073",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_mimi.arg",
            "entype": 2,
            "enemyNos": [
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117
            ],
            "askBattleMessages": [
              "绑在袋口的绳子",
              "用切绳石把它割开吗？"
            ],
            "startMessage": "宝袋口打开了之后恐龙从里面飞了出来！",
            "deniedMessage": "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 60,
            "warp": null
          }
        },
        {
          "id": "122-120-145-14",
          "name": "宝物袋",
          "x": 120,
          "y": 145,
          "type": "NPCEnemy",
          "dialogue": "绑在袋口的绳子",
          "dialogueLines": [
            "绑在袋口的绳子",
            "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。"
          ],
          "source": "ref___data/npc/100/sb_mimi.create",
          "script": "file:100/sb_mimi.arg",
          "template": "sb_hag",
          "graphic": "16073",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_mimi.arg",
            "entype": 2,
            "enemyNos": [
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117
            ],
            "askBattleMessages": [
              "绑在袋口的绳子",
              "用切绳石把它割开吗？"
            ],
            "startMessage": "宝袋口打开了之后恐龙从里面飞了出来！",
            "deniedMessage": "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 60,
            "warp": null
          }
        },
        {
          "id": "122-45-152-13",
          "name": "宝物袋",
          "x": 45,
          "y": 152,
          "type": "NPCEnemy",
          "dialogue": "绑在袋口的绳子",
          "dialogueLines": [
            "绑在袋口的绳子",
            "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。"
          ],
          "source": "ref___data/npc/100/sb_mimi.create",
          "script": "file:100/sb_mimi.arg",
          "template": "sb_hag",
          "graphic": "16073",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_mimi.arg",
            "entype": 2,
            "enemyNos": [
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117
            ],
            "askBattleMessages": [
              "绑在袋口的绳子",
              "用切绳石把它割开吗？"
            ],
            "startMessage": "宝袋口打开了之后恐龙从里面飞了出来！",
            "deniedMessage": "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 60,
            "warp": null
          }
        },
        {
          "id": "122-93-152-12",
          "name": "宝物袋",
          "x": 93,
          "y": 152,
          "type": "NPCEnemy",
          "dialogue": "绑在袋口的绳子",
          "dialogueLines": [
            "绑在袋口的绳子",
            "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。"
          ],
          "source": "ref___data/npc/100/sb_mimi.create",
          "script": "file:100/sb_mimi.arg",
          "template": "sb_hag",
          "graphic": "16073",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_mimi.arg",
            "entype": 2,
            "enemyNos": [
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117,
              1117
            ],
            "askBattleMessages": [
              "绑在袋口的绳子",
              "用切绳石把它割开吗？"
            ],
            "startMessage": "宝袋口打开了之后恐龙从里面飞了出来！",
            "deniedMessage": "袋口被牢牢的绑起来，要拿里面的东西并不是那么简单的。",
            "endMessage": "",
            "dieAct": 0,
            "respawnSeconds": 60,
            "warp": null
          }
        },
        {
          "id": "122-162-12-1296",
          "name": "宝袋",
          "x": 162,
          "y": 12,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/extra/event/marju04a",
          "dialogueLines": [],
          "source": "ref___data/npc/extra/event/marju.create",
          "script": "file:extra/event/marju04a",
          "template": "changeevent",
          "graphic": "16073"
        },
        {
          "id": "122-282-48-1294",
          "name": "宝袋",
          "x": 282,
          "y": 48,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/extra/event/marju03a",
          "dialogueLines": [],
          "source": "ref___data/npc/extra/event/marju.create",
          "script": "file:extra/event/marju03a",
          "template": "changeevent",
          "graphic": "16073"
        },
        {
          "id": "122-216-51-1292",
          "name": "宝袋",
          "x": 216,
          "y": 51,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/extra/event/marju02a",
          "dialogueLines": [],
          "source": "ref___data/npc/extra/event/marju.create",
          "script": "file:extra/event/marju02a",
          "template": "changeevent",
          "graphic": "16073"
        },
        {
          "id": "122-54-90-1293",
          "name": "宝袋",
          "x": 54,
          "y": 90,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/extra/event/marju03",
          "dialogueLines": [],
          "source": "ref___data/npc/extra/event/marju.create",
          "script": "file:extra/event/marju03",
          "template": "changeevent",
          "graphic": "16073"
        },
        {
          "id": "122-111-127-1295",
          "name": "宝袋",
          "x": 111,
          "y": 127,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/extra/event/marju04",
          "dialogueLines": [],
          "source": "ref___data/npc/extra/event/marju.create",
          "script": "file:extra/event/marju04",
          "template": "changeevent",
          "graphic": "16073"
        },
        {
          "id": "122-39-164-1291",
          "name": "宝袋",
          "x": 39,
          "y": 164,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/extra/event/marju02",
          "dialogueLines": [],
          "source": "ref___data/npc/extra/event/marju.create",
          "script": "file:extra/event/marju02",
          "template": "changeevent",
          "graphic": "16073"
        },
        {
          "id": "122-6-5-4992",
          "name": "Warp",
          "x": 6,
          "y": 5,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "122-289-168-4993",
          "name": "Warp",
          "x": 289,
          "y": 168,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/meiro.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "120-0",
          "label": "去 靠近水田的家|00",
          "detail": "靠近水田的家|00 | floor 120 | 目标 (17,12) | 入口 (6,5)",
          "to": "120",
          "x": 6,
          "y": 5,
          "bounds": [
            6,
            5,
            6,
            5
          ],
          "target": [
            17,
            12
          ],
          "tiles": [
            {
              "x": 6,
              "y": 5,
              "target": [
                17,
                12
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1000": {
      "id": "1000",
      "floorId": 1000,
      "name": "萨姆吉尔村",
      "mapFile": "/data/maps/1000.ls2map",
      "clientMapFile": "/data/client-maps/1000.dat",
      "clientMapSource": "公益石器时代/map/1000.dat",
      "summary": "萨姆吉尔村 | floor=1000 | 160x160 | ref___data/map/sainasu/samugiru/samugiru",
      "size": [
        160,
        160
      ],
      "spawn": [
        50,
        116
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1000-109-63-1513",
          "name": "兔女郎",
          "x": 109,
          "y": 63,
          "type": "TimeMan",
          "dialogue": "欢迎光临，我是新来的美露露，请多指教。",
          "dialogueLines": [
            "欢迎光临，我是新来的美露露，请多指教。",
            "我笨手笨脚的常惹老板生气。"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_109_63",
          "template": "npcgen_timeman",
          "graphic": "16013"
        },
        {
          "id": "1000-119-65-1511",
          "name": "酒保",
          "x": 119,
          "y": 65,
          "type": "TimeMan",
          "dialogue": "欢迎光临，想喝点什么吗？",
          "dialogueLines": [
            "欢迎光临，想喝点什么吗？",
            "请慢慢享受。",
            "这间店“ＢＡＲ Ｓｉｌｋｙ ＣＬＵＢ”是连锁店，在其它村庄也有。这间就是萨姆吉尔店。",
            "不可对店里的女生动手动脚，因为有小孩子会进来。"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_119_65",
          "template": "npcgen_timeman",
          "graphic": "16025"
        },
        {
          "id": "1000-116-66-1514",
          "name": "村民",
          "x": 116,
          "y": 66,
          "type": "TimeMan",
          "dialogue": "辛苦工作一整天后，喝个一杯很舒服呢！但也不可喝过多免得跑出啤酒肚。",
          "dialogueLines": [
            "辛苦工作一整天后，喝个一杯很舒服呢！但也不可喝过多免得跑出啤酒肚。",
            "想去吉鲁岛是有办法的…这我也知道啊。"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_116_66",
          "template": "npcgen_timeman",
          "graphic": "16016"
        },
        {
          "id": "1000-116-69-1512",
          "name": "看板小姐",
          "x": 116,
          "y": 69,
          "type": "TimeMan",
          "dialogue": "欢迎光临，那里有空位！",
          "dialogueLines": [
            "欢迎光临，那里有空位！",
            "喔～是这样吗？常常都有人说我长得很可爱呢！"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_116_69",
          "template": "npcgen_timeman",
          "graphic": "16015"
        },
        {
          "id": "1000-42-72-1505",
          "name": "萨姆吉尔的老师",
          "x": 42,
          "y": 72,
          "type": "TimeMan",
          "dialogue": "我是萨姆吉尔的老师，想知道任何事情我都可以为你解答。",
          "dialogueLines": [
            "我是萨姆吉尔的老师，想知道任何事情我都可以为你解答。",
            "这个村庄之所以名为萨姆吉尔，就是取自于开创英雄萨姆吉尔的名号。",
            "说起萨姆吉尔，在村子中央有一座他的石像。我年轻时可以抱得动它唷。什么！你不相信啊？",
            "在这个世界，成人之后会被视为已经可以独当一面。经过成人礼之后，许多地方就无法成行了。",
            "成人练习不只是听课。到村外确认一次野外宠物资料，再回来向我报告。",
            "如果遇到危险，记得先让宠物出战；击败或捕获一只野外宠物就足够了。"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_42_72",
          "template": "npcgen_timeman",
          "graphic": "16002",
          "questId": "samugiru-field-practice"
        },
        {
          "id": "1000-39-75-1508",
          "name": "村庄孩童",
          "x": 39,
          "y": 75,
          "type": "TimeMan",
          "dialogue": "所谓的恋爱方程式…",
          "dialogueLines": [
            "所谓的恋爱方程式…"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_39_75",
          "template": "npcgen_timeman",
          "graphic": "16004"
        },
        {
          "id": "1000-42-75-1510",
          "name": "村庄孩童",
          "x": 42,
          "y": 75,
          "type": "TimeMan",
          "dialogue": "１加１等于２，２加２等于４，３加３等于６…",
          "dialogueLines": [
            "１加１等于２，２加２等于４，３加３等于６…"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_42_75",
          "template": "npcgen_timeman",
          "graphic": "16006"
        },
        {
          "id": "1000-36-78-1509",
          "name": "村庄孩童",
          "x": 36,
          "y": 78,
          "type": "TimeMan",
          "dialogue": "哈哈老师不知道！",
          "dialogueLines": [
            "哈哈老师不知道！"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_36_78",
          "template": "npcgen_timeman",
          "graphic": "16005"
        },
        {
          "id": "1000-42-79-1506",
          "name": "村庄孩童",
          "x": 42,
          "y": 79,
          "type": "TimeMan",
          "dialogue": "老师上课好无聊喔！来玩游戏嘛！",
          "dialogueLines": [
            "老师上课好无聊喔！来玩游戏嘛！"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_42_79",
          "template": "npcgen_timeman",
          "graphic": "16011"
        },
        {
          "id": "1000-42-81-1507",
          "name": "村庄孩童",
          "x": 42,
          "y": 81,
          "type": "TimeMan",
          "dialogue": "那个乌力斯坦是头牛还是山猪啊？",
          "dialogueLines": [
            "那个乌力斯坦是头牛还是山猪啊？"
          ],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/tman_1000_42_81",
          "template": "npcgen_timeman",
          "graphic": "16003"
        },
        {
          "id": "1000-94-101-5973",
          "name": "少女",
          "x": 94,
          "y": 101,
          "type": "ItemShop",
          "dialogue": "我有卖很神奇的东西喔！",
          "dialogueLines": [
            "我有卖很神奇的东西喔！"
          ],
          "source": "ref___data/npc/genout/shop_nuke1.create",
          "script": "file:genout/ss_1000_94_101",
          "template": "npcgen_shop",
          "graphic": "16067",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1000_94_101",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "我有卖很神奇的东西喔！",
            "items": [
              {
                "id": 13061,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至萨姆吉尔村",
                "image": 24074,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 2000
              },
              {
                "id": 13062,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至玛丽娜丝渔村",
                "image": 24075,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 2000
              },
              {
                "id": 13063,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至加加村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 2000
              },
              {
                "id": 13064,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至卡鲁它那村",
                "image": 24077,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 2000
              }
            ]
          }
        },
        {
          "id": "1000-64-112-5809",
          "name": "特产品贩卖员",
          "x": 64,
          "y": 112,
          "type": "ItemShop",
          "dialogue": "欢迎光临",
          "dialogueLines": [
            "欢迎光临"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1000_64_112",
          "template": "npcgen_shop",
          "graphic": "16067",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1000_64_112",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临",
            "items": [
              {
                "id": 12153,
                "name": "萨姆吉尔产的桃子",
                "secretName": "萨姆吉尔产的桃子",
                "description": "桃子4",
                "image": 24092,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12157,
                "name": "萨姆吉尔产的苹果",
                "secretName": "萨姆吉尔产的苹果",
                "description": "苹果4",
                "image": 24085,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12161,
                "name": "萨姆吉尔产的草莓",
                "secretName": "萨姆吉尔产的草莓",
                "description": "草莓4",
                "image": 24099,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12165,
                "name": "萨姆吉尔产的梨子",
                "secretName": "萨姆吉尔产的梨子",
                "description": "梨子4",
                "image": 24084,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12169,
                "name": "萨姆吉尔产的葡萄",
                "secretName": "萨姆吉尔产的葡萄",
                "description": "葡萄4",
                "image": 24101,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12173,
                "name": "萨姆吉尔产的樱桃",
                "secretName": "萨姆吉尔产的樱桃",
                "description": "樱桃4",
                "image": 24098,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12217,
                "name": "萨姆吉尔产的橘子",
                "secretName": "萨姆吉尔产的橘子",
                "description": "橘子4",
                "image": 23003,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12221,
                "name": "萨姆吉尔产的柿子",
                "secretName": "萨姆吉尔产的柿子",
                "description": "柿子4",
                "image": 24553,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              }
            ]
          }
        },
        {
          "id": "1000-77-37-7482",
          "name": "九兄弟之一",
          "x": 77,
          "y": 37,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality1.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality1.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "我的日记呢！好像掉了。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "1000-39-58-7488",
          "name": "九兄弟之一",
          "x": 39,
          "y": 58,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality7.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality7.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "你的打架技巧不错喔！",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "1000-108-28-7702",
          "name": "检查员(C)",
          "x": 108,
          "y": 28,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_edc",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_edc",
          "template": "changeevent",
          "graphic": "16027"
        },
        {
          "id": "1000-63-43-7530",
          "name": "莉儿",
          "x": 63,
          "y": 43,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/dance/dance.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/dance/dance.create",
          "script": "file:sa70/dance/dance.arg",
          "template": "changeevent",
          "graphic": "16083"
        },
        {
          "id": "1000-72-48-7300",
          "name": "说故事的老爷爷",
          "x": 72,
          "y": 48,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/poru/samugiru04",
          "dialogueLines": [],
          "source": "ref___data/npc/poru/samugiru_grandfather.create",
          "script": "file:poru/samugiru04",
          "template": "changeevent",
          "graphic": "16001"
        },
        {
          "id": "1000-33-56-7677",
          "name": "ＳＯＴ柜台",
          "x": 33,
          "y": 56,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_0cd",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_0cd",
          "template": "changeevent",
          "graphic": "16027"
        },
        {
          "id": "1000-47-56-7732",
          "name": "英雄战场纪念碑",
          "x": 47,
          "y": 56,
          "type": "Alldoman",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/won/syu.create",
          "script": "npc_alldoman",
          "template": "npc_alldoman",
          "graphic": "10060"
        },
        {
          "id": "1000-48-62-7419",
          "name": "战斗技巧指导员",
          "x": 48,
          "y": 62,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/newbie/fighter",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/newbie/newbie.create",
          "script": "file:sa60/newbie/fighter",
          "template": "changeevent",
          "graphic": "16496"
        },
        {
          "id": "1000-50-62-111",
          "name": "门票贩卖员",
          "x": 50,
          "y": 62,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/chatroom/ticket1000",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/chatroom.create",
          "script": "file:chatroom/ticket1000",
          "template": "changeevent",
          "graphic": "16014"
        },
        {
          "id": "1000-31-69-7581",
          "name": "凯拉斯",
          "x": 31,
          "y": 69,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/treasure/treasure1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/treasure/treasure.create",
          "script": "file:sa70/treasure/treasure1.arg",
          "template": "changeevent",
          "graphic": "16102"
        },
        {
          "id": "1000-73-72-7591",
          "name": "流浪旅人",
          "x": 73,
          "y": 72,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa75/angel/angelitem",
          "dialogueLines": [],
          "source": "ref___data/npc/sa75/angel/angel.create",
          "script": "file:sa75/angel/angelitem",
          "template": "changeevent",
          "graphic": "16154"
        },
        {
          "id": "1000-94-99-6117",
          "name": "萨姆吉尔的储存点",
          "x": 94,
          "y": 99,
          "type": "SavePoint",
          "dialogue": "脚本入口：ref___data/npc/genout/sp_1000_94_99",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/sp.create",
          "script": "file:genout/sp_1000_94_99",
          "template": "npcgen_savepoint",
          "graphic": "10048"
        },
        {
          "id": "1000-126-99-7678",
          "name": "检查员(C-1)",
          "x": 126,
          "y": 99,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_1c",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_1c",
          "template": "changeevent",
          "graphic": "16067"
        },
        {
          "id": "1000-117-101-7495",
          "name": "阿喇吉",
          "x": 117,
          "y": 101,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/beers/beers1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/beers/beers.create",
          "script": "file:sa70/beers/beers1.arg",
          "template": "changeevent",
          "graphic": "16090"
        },
        {
          "id": "1000-51-106-124",
          "name": "工程人员",
          "x": 51,
          "y": 106,
          "type": "NPC_NewNpcMan",
          "dialogue": "脚本入口：ref___data/npc/demale/testnpc01.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/demale/testnpc01.create",
          "script": "file:demale/testnpc01.arg",
          "template": "npc_newnpcman",
          "graphic": "100401"
        },
        {
          "id": "1000-77-118-7537",
          "name": "贝丝安娜",
          "x": 77,
          "y": 118,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/meat/meat1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/meat/meat.create",
          "script": "file:sa70/meat/meat1.arg",
          "template": "changeevent",
          "graphic": "16022"
        },
        {
          "id": "1000-57-124-7646",
          "name": "日美子",
          "x": 57,
          "y": 124,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/event02_2",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/event02.create",
          "script": "file:sainasu/event/event02_2",
          "template": "changeevent",
          "graphic": "16030"
        },
        {
          "id": "1000-97-32-7297",
          "name": "村庄少女",
          "x": 97,
          "y": 32,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/poru/samugiru2",
          "dialogueLines": [],
          "source": "ref___data/npc/poru/samugiru01.create",
          "script": "file:poru/samugiru2",
          "template": "npcgen_man",
          "graphic": "16028"
        },
        {
          "id": "1000-128-36-1517",
          "name": "海边的少女",
          "x": 128,
          "y": 36,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_128_36",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_128_36",
          "template": "npcgen_man",
          "graphic": "16009"
        },
        {
          "id": "1000-79-37-1516",
          "name": "愿藏的父亲",
          "x": 79,
          "y": 37,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_79_37",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_79_37",
          "template": "npcgen_man",
          "graphic": "16019"
        },
        {
          "id": "1000-111-37-2184",
          "name": "看板",
          "x": 111,
          "y": 37,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_1000_111_37",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/chatkanban.create",
          "script": "file:genout/signb_1000_111_37",
          "template": "npcgen_signboard",
          "graphic": "10096"
        },
        {
          "id": "1000-82-39-1515",
          "name": "愿藏的母亲",
          "x": 82,
          "y": 39,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_82_39",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_82_39",
          "template": "npcgen_man",
          "graphic": "16021"
        },
        {
          "id": "1000-97-43-1519",
          "name": "警卫（哥哥）",
          "x": 97,
          "y": 43,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_97_43",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_97_43",
          "template": "npcgen_man",
          "graphic": "16207"
        },
        {
          "id": "1000-97-46-1520",
          "name": "警卫（弟弟）",
          "x": 97,
          "y": 46,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_97_46",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_97_46",
          "template": "npcgen_man",
          "graphic": "16207"
        },
        {
          "id": "1000-60-61-118",
          "name": "强者表",
          "x": 60,
          "y": 61,
          "type": "Duelranking",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/duelranking.create",
          "script": "duelranking",
          "template": "duelranking",
          "graphic": "10070"
        },
        {
          "id": "1000-52-64-5707",
          "name": "竞技场前的看板",
          "x": 52,
          "y": 64,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_1000_52_64",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/signb_1000_52_64",
          "template": "npcgen_signboard",
          "graphic": "10061"
        },
        {
          "id": "1000-93-66-1524",
          "name": "萨姆吉尔的传言板",
          "x": 93,
          "y": 66,
          "type": "Dengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "npcgen_dengon",
          "template": "npcgen_dengon",
          "graphic": "10062"
        },
        {
          "id": "1000-93-72-7296",
          "name": "村民",
          "x": 93,
          "y": 72,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/poru/samugiru02",
          "dialogueLines": [],
          "source": "ref___data/npc/poru/samugiru01.create",
          "script": "file:poru/samugiru02",
          "template": "npcgen_man",
          "graphic": "16039"
        },
        {
          "id": "1000-74-93-1522",
          "name": "村中包打听",
          "x": 74,
          "y": 93,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_74_93",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_74_93",
          "template": "npcgen_man",
          "graphic": "16033"
        },
        {
          "id": "1000-94-93-1523",
          "name": "萨姆吉尔的传言板",
          "x": 94,
          "y": 93,
          "type": "Dengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "npcgen_dengon",
          "template": "npcgen_dengon",
          "graphic": "10062"
        },
        {
          "id": "1000-106-95-1518",
          "name": "村庄青年",
          "x": 106,
          "y": 95,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_106_95",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_106_95",
          "template": "npcgen_man",
          "graphic": "16045"
        },
        {
          "id": "1000-117-95-1504",
          "name": "村庄小姑娘",
          "x": 117,
          "y": 95,
          "type": "TownPeople",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "npcgen_man",
          "template": "npcgen_man",
          "graphic": "16038"
        },
        {
          "id": "1000-118-95-1502",
          "name": "村庄小姑娘",
          "x": 118,
          "y": 95,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_118_95",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_118_95",
          "template": "npcgen_man",
          "graphic": "16032"
        },
        {
          "id": "1000-118-96-1503",
          "name": "村庄小姑娘",
          "x": 118,
          "y": 96,
          "type": "TownPeople",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "npcgen_man",
          "template": "npcgen_man",
          "graphic": "16033"
        },
        {
          "id": "1000-127-100-5264",
          "name": "看板",
          "x": 127,
          "y": 100,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_1000_127_100",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_1000_127_100",
          "template": "npcgen_signboard",
          "graphic": "10062"
        },
        {
          "id": "1000-63-103-1501",
          "name": "村庄青年",
          "x": 63,
          "y": 103,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_63_103",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_63_103",
          "template": "npcgen_man",
          "graphic": "16048"
        },
        {
          "id": "1000-88-105-119",
          "name": "强者表",
          "x": 88,
          "y": 105,
          "type": "Duelranking",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/duelranking.create",
          "script": "duelranking",
          "template": "duelranking",
          "graphic": "10069"
        },
        {
          "id": "1000-50-106-7298",
          "name": "村民",
          "x": 50,
          "y": 106,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/poru/samugiru03",
          "dialogueLines": [],
          "source": "ref___data/npc/poru/samugiru01.create",
          "script": "file:poru/samugiru03",
          "template": "npcgen_man",
          "graphic": "16019"
        },
        {
          "id": "1000-62-115-1500",
          "name": "村庄青年",
          "x": 62,
          "y": 115,
          "type": "TownPeople",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "npcgen_man",
          "template": "npcgen_man",
          "graphic": "16209"
        },
        {
          "id": "1000-66-128-1521",
          "name": "热血青年",
          "x": 66,
          "y": 128,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1000_66_128",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1000npc_m.create",
          "script": "file:genout/msg_1000_66_128",
          "template": "npcgen_man",
          "graphic": "16202"
        },
        {
          "id": "1000-71-48-7301",
          "name": "黑乌力",
          "x": 71,
          "y": 48,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/poru/wpm_500_470_470",
          "dialogueLines": [],
          "source": "ref___data/npc/poru/samugiru_grandfather.create",
          "script": "file:poru/wpm_500_470_470",
          "template": "npcgen_warpman",
          "graphic": "100388",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "500",
              "floor": 500,
              "x": 274,
              "y": 369
            },
            "free": "ITEM=2414&LV>79",
            "money": "-1",
            "cost": {
              "mode": "unavailable"
            },
            "deleteItems": [],
            "freeMessage": "那我就说萨姆吉尔尚未成人时的第一个英雄事迹！ 另外切记！！不可思议的贝壳千万不要掉了！否则可能会无法交谈哦！",
            "payMessage": "乌力～～乌力",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "不好意思、可以一个一个来吗？",
            "warpMessage": "",
            "source": "ref___data/npc/poru/wpm_500_470_470"
          }
        },
        {
          "id": "1000-56-59-2263",
          "name": "斗技场向导",
          "x": 56,
          "y": 59,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_1000_56_59",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/duelroom.create",
          "script": "file:genout/wpm_1000_56_59",
          "template": "npcgen_warpman",
          "graphic": "16055",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "130",
              "floor": 130,
              "x": 57,
              "y": 13
            },
            "free": "ITEM=2597",
            "money": "-1",
            "cost": {
              "mode": "unavailable"
            },
            "deleteItems": [
              2521,
              2522,
              2523,
              2524,
              2602,
              2598,
              2599,
              2600,
              2601
            ],
            "freeMessage": "欢迎来到斗技场 现在斗技场有人的出席者。 请慢慢使用。",
            "payMessage": "没有门票。 请到那里购买门票。 现在的入场者有人。",
            "normalMessage": "",
            "moneyMessage": "不好意思请多关照。",
            "partyMessage": "以团队无法入场。 请把团队解散之后再个别 入场。",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_1000_56_59"
          }
        },
        {
          "id": "1000-112-37-6381",
          "name": "Warp",
          "x": 112,
          "y": 37,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-113-37-6383",
          "name": "Warp",
          "x": 113,
          "y": 37,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-98-44-6357",
          "name": "Warp",
          "x": 98,
          "y": 44,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-98-45-6359",
          "name": "Warp",
          "x": 98,
          "y": 45,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-80-66-6355",
          "name": "Warp",
          "x": 80,
          "y": 66,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-81-66-6353",
          "name": "Warp",
          "x": 81,
          "y": 66,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-68-72-6347",
          "name": "Warp",
          "x": 68,
          "y": 72,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-69-72-6345",
          "name": "Warp",
          "x": 69,
          "y": 72,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-53-81-6351",
          "name": "Warp",
          "x": 53,
          "y": 81,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-54-81-6349",
          "name": "Warp",
          "x": 54,
          "y": 81,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-106-91-6361",
          "name": "Warp",
          "x": 106,
          "y": 91,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-106-92-6363",
          "name": "Warp",
          "x": 106,
          "y": 92,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-63-98-6339",
          "name": "Warp",
          "x": 63,
          "y": 98,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-63-99-6335",
          "name": "Warp",
          "x": 63,
          "y": 99,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-63-100-6337",
          "name": "Warp",
          "x": 63,
          "y": 100,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-67-107-6344",
          "name": "Warp",
          "x": 67,
          "y": 107,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-67-108-6340",
          "name": "Warp",
          "x": 67,
          "y": 108,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-67-109-6342",
          "name": "Warp",
          "x": 67,
          "y": 109,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-97-110-6367",
          "name": "Warp",
          "x": 97,
          "y": 110,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-97-111-6369",
          "name": "Warp",
          "x": 97,
          "y": 111,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-79-112-7196",
          "name": "Warp",
          "x": 79,
          "y": 112,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/poru/dragon_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-117-112-1538",
          "name": "Warp",
          "x": 117,
          "y": 112,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-118-112-1539",
          "name": "Warp",
          "x": 118,
          "y": 112,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-119-112-1540",
          "name": "Warp",
          "x": 119,
          "y": 112,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-120-112-1541",
          "name": "Warp",
          "x": 120,
          "y": 112,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-121-112-1542",
          "name": "Warp",
          "x": 121,
          "y": 112,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-49-116-1529",
          "name": "Warp",
          "x": 49,
          "y": 116,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-49-117-1530",
          "name": "Warp",
          "x": 49,
          "y": 117,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-63-117-6375",
          "name": "Warp",
          "x": 63,
          "y": 117,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-49-118-1531",
          "name": "Warp",
          "x": 49,
          "y": 118,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-63-118-6378",
          "name": "Warp",
          "x": 63,
          "y": 118,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1000-49-119-1532",
          "name": "Warp",
          "x": 49,
          "y": 119,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (637,493) | 入口 4 格 (49,116)-(49,119)",
          "to": "100",
          "x": 49,
          "y": 118,
          "bounds": [
            49,
            116,
            49,
            119
          ],
          "target": [
            637,
            493
          ],
          "tiles": [
            {
              "x": 49,
              "y": 116,
              "target": [
                637,
                491
              ]
            },
            {
              "x": 49,
              "y": 117,
              "target": [
                637,
                492
              ]
            },
            {
              "x": 49,
              "y": 118,
              "target": [
                637,
                493
              ]
            },
            {
              "x": 49,
              "y": 119,
              "target": [
                637,
                494
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "100-1",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (708,488) | 入口 5 格 (117,112)-(121,112)",
          "to": "100",
          "x": 119,
          "y": 112,
          "bounds": [
            117,
            112,
            121,
            112
          ],
          "target": [
            708,
            488
          ],
          "tiles": [
            {
              "x": 117,
              "y": 112,
              "target": [
                706,
                488
              ]
            },
            {
              "x": 118,
              "y": 112,
              "target": [
                707,
                488
              ]
            },
            {
              "x": 119,
              "y": 112,
              "target": [
                708,
                488
              ]
            },
            {
              "x": 120,
              "y": 112,
              "target": [
                709,
                488
              ]
            },
            {
              "x": 121,
              "y": 112,
              "target": [
                710,
                488
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1001-2",
          "label": "去 萨姆吉尔的武器店",
          "detail": "萨姆吉尔的武器店 | floor 1001 | 目标 (10,15) | 入口 3 格 (63,98)-(63,100)",
          "to": "1001",
          "x": 63,
          "y": 99,
          "bounds": [
            63,
            98,
            63,
            100
          ],
          "target": [
            10,
            15
          ],
          "tiles": [
            {
              "x": 63,
              "y": 99,
              "target": [
                10,
                15
              ]
            },
            {
              "x": 63,
              "y": 100,
              "target": [
                10,
                16
              ]
            },
            {
              "x": 63,
              "y": 98,
              "target": [
                10,
                15
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1002-3",
          "label": "去 萨姆吉尔的道具店",
          "detail": "萨姆吉尔的道具店 | floor 1002 | 目标 (10,15) | 入口 3 格 (67,107)-(67,109)",
          "to": "1002",
          "x": 67,
          "y": 108,
          "bounds": [
            67,
            107,
            67,
            109
          ],
          "target": [
            10,
            15
          ],
          "tiles": [
            {
              "x": 67,
              "y": 108,
              "target": [
                10,
                15
              ]
            },
            {
              "x": 67,
              "y": 109,
              "target": [
                10,
                16
              ]
            },
            {
              "x": 67,
              "y": 107,
              "target": [
                10,
                15
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1003-4",
          "label": "去 萨姆吉尔的宠物店|00",
          "detail": "萨姆吉尔的宠物店|00 | floor 1003 | 目标 (16,21) | 入口 2 格 (68,72)-(69,72)",
          "to": "1003",
          "x": 69,
          "y": 72,
          "bounds": [
            68,
            72,
            69,
            72
          ],
          "target": [
            16,
            21
          ],
          "tiles": [
            {
              "x": 69,
              "y": 72,
              "target": [
                16,
                21
              ]
            },
            {
              "x": 68,
              "y": 72,
              "target": [
                15,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1004-5",
          "label": "去 萨姆吉尔的肉店",
          "detail": "萨姆吉尔的肉店 | floor 1004 | 目标 (16,21) | 入口 2 格 (53,81)-(54,81)",
          "to": "1004",
          "x": 54,
          "y": 81,
          "bounds": [
            53,
            81,
            54,
            81
          ],
          "target": [
            16,
            21
          ],
          "tiles": [
            {
              "x": 54,
              "y": 81,
              "target": [
                16,
                21
              ]
            },
            {
              "x": 53,
              "y": 81,
              "target": [
                15,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1005-6",
          "label": "去 萨姆吉尔的医院",
          "detail": "萨姆吉尔的医院 | floor 1005 | 目标 (16,21) | 入口 2 格 (80,66)-(81,66)",
          "to": "1005",
          "x": 81,
          "y": 66,
          "bounds": [
            80,
            66,
            81,
            66
          ],
          "target": [
            16,
            21
          ],
          "tiles": [
            {
              "x": 81,
              "y": 66,
              "target": [
                16,
                21
              ]
            },
            {
              "x": 80,
              "y": 66,
              "target": [
                15,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1006-7",
          "label": "去 萨姆吉尔的村长家",
          "detail": "萨姆吉尔的村长家 | floor 1006 | 目标 (10,21) | 入口 2 格 (98,44)-(98,45)",
          "to": "1006",
          "x": 98,
          "y": 45,
          "bounds": [
            98,
            44,
            98,
            45
          ],
          "target": [
            10,
            21
          ],
          "tiles": [
            {
              "x": 98,
              "y": 44,
              "target": [
                10,
                20
              ]
            },
            {
              "x": 98,
              "y": 45,
              "target": [
                10,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1009-8",
          "label": "去 萨姆吉尔的便利商店",
          "detail": "萨姆吉尔的便利商店 | floor 1009 | 目标 (10,26) | 入口 2 格 (106,91)-(106,92)",
          "to": "1009",
          "x": 106,
          "y": 92,
          "bounds": [
            106,
            91,
            106,
            92
          ],
          "target": [
            10,
            26
          ],
          "tiles": [
            {
              "x": 106,
              "y": 91,
              "target": [
                10,
                25
              ]
            },
            {
              "x": 106,
              "y": 92,
              "target": [
                10,
                26
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1020-9",
          "label": "去 萨姆吉尔道场柜台",
          "detail": "萨姆吉尔道场柜台 | floor 1020 | 目标 (4,12) | 入口 2 格 (97,110)-(97,111)",
          "to": "1020",
          "x": 97,
          "y": 111,
          "bounds": [
            97,
            110,
            97,
            111
          ],
          "target": [
            4,
            12
          ],
          "tiles": [
            {
              "x": 97,
              "y": 110,
              "target": [
                4,
                12
              ]
            },
            {
              "x": 97,
              "y": 111,
              "target": [
                4,
                12
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1011-10",
          "label": "去 长毛象快递|00畖0",
          "detail": "长毛象快递|00畖0 | floor 1011 | 目标 (10,15) | 入口 (63,117)",
          "to": "1011",
          "x": 63,
          "y": 117,
          "bounds": [
            63,
            117,
            63,
            117
          ],
          "target": [
            10,
            15
          ],
          "tiles": [
            {
              "x": 63,
              "y": 117,
              "target": [
                10,
                15
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1014-11",
          "label": "去 长毛象快递|00",
          "detail": "长毛象快递|00 | floor 1014 | 目标 (10,16) | 入口 (63,118)",
          "to": "1014",
          "x": 63,
          "y": 118,
          "bounds": [
            63,
            118,
            63,
            118
          ],
          "target": [
            10,
            16
          ],
          "tiles": [
            {
              "x": 63,
              "y": 118,
              "target": [
                10,
                16
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1012-12",
          "label": "去 聊天室柜台|0喟破饨陓0",
          "detail": "聊天室柜台|0喟破饨陓0 | floor 1012 | 目标 (16,21) | 入口 2 格 (112,37)-(113,37)",
          "to": "1012",
          "x": 113,
          "y": 37,
          "bounds": [
            112,
            37,
            113,
            37
          ],
          "target": [
            16,
            21
          ],
          "tiles": [
            {
              "x": 112,
              "y": 37,
              "target": [
                15,
                21
              ]
            },
            {
              "x": 113,
              "y": 37,
              "target": [
                16,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1013-13",
          "label": "去 老爷爷的家",
          "detail": "老爷爷的家 | floor 1013 | 目标 (10,16) | 入口 (79,112)",
          "to": "1013",
          "x": 79,
          "y": 112,
          "bounds": [
            79,
            112,
            79,
            112
          ],
          "target": [
            10,
            16
          ],
          "tiles": [
            {
              "x": 79,
              "y": 112,
              "target": [
                10,
                16
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1001": {
      "id": "1001",
      "floorId": 1001,
      "name": "萨姆吉尔的武器店",
      "mapFile": "/data/maps/1001.ls2map",
      "clientMapFile": "/data/client-maps/1001.dat",
      "clientMapSource": "公益石器时代/map/1001.dat",
      "summary": "萨姆吉尔的武器店 | floor=1001 | 30x30 | ref___data/map/sainasu/samugiru/1001",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        15
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1001-17-13-5693",
          "name": "萨姆吉尔的武器店",
          "x": 17,
          "y": 13,
          "type": "ItemShop",
          "dialogue": "欢迎光临",
          "dialogueLines": [
            "欢迎光临"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1001_17_13",
          "template": "npcgen_shop",
          "graphic": "16017",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1001_17_13",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临",
            "items": [
              {
                "id": 4,
                "name": "莱伊卡Lv1斧头",
                "secretName": "莱伊卡Lv1斧头",
                "description": "攻 +7 防 -2 敏 -2 酒的精灵 Lv1",
                "image": 20032,
                "cost": 105,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 105
              },
              {
                "id": 10,
                "name": "普通普通的斧头",
                "secretName": "普通普通的斧头",
                "description": "攻 +14 防 -5 敏 -5",
                "image": 20013,
                "cost": 260,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 260
              },
              {
                "id": 20,
                "name": "轻的斧头",
                "secretName": "轻的斧头",
                "description": "攻 +19 防 -7 敏 -6",
                "image": 20000,
                "cost": 1040,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 1040
              },
              {
                "id": 40,
                "name": "大的斧头",
                "secretName": "大的斧头",
                "description": "攻 +32 防 -11 敏 -11",
                "image": 20015,
                "cost": 6500,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 25,
                "price": 6500
              },
              {
                "id": 100,
                "name": "小棍棒",
                "secretName": "小棍棒",
                "description": "攻 +4",
                "image": 20103,
                "cost": 50,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 50
              },
              {
                "id": 110,
                "name": "普通普通的棍棒",
                "secretName": "普通普通的棍棒",
                "description": "攻 +8",
                "image": 20102,
                "cost": 200,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 200
              },
              {
                "id": 130,
                "name": "重的棍棒",
                "secretName": "重的棍棒",
                "description": "攻 +17 敏 -1",
                "image": 20104,
                "cost": 2300,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 20,
                "price": 2300
              },
              {
                "id": 200,
                "name": "小的枪",
                "secretName": "小的枪",
                "description": "攻 +5 敏 -1 魅 +1",
                "image": 20402,
                "cost": 60,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 60
              },
              {
                "id": 210,
                "name": "普通普通的枪",
                "secretName": "普通普通的枪",
                "description": "攻 +10 敏 -2 魅 +1",
                "image": 20422,
                "cost": 240,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 240
              },
              {
                "id": 220,
                "name": "轻的枪",
                "secretName": "轻的枪",
                "description": "攻 +14 敏 -2 魅 +2",
                "image": 20411,
                "cost": 960,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 960
              },
              {
                "id": 240,
                "name": "大的枪",
                "secretName": "大的枪",
                "description": "攻 +25 敏 -5 魅 +3",
                "image": 20401,
                "cost": 6000,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 25,
                "price": 6000
              },
              {
                "id": 300,
                "name": "小的爪",
                "secretName": "小的爪",
                "description": "攻 +3 (x2)",
                "image": 20203,
                "cost": 55,
                "type": 0,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 55
              },
              {
                "id": 310,
                "name": "普通普通的爪",
                "secretName": "普通普通的爪",
                "description": "攻 +6 (x2)",
                "image": 20200,
                "cost": 220,
                "type": 0,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 220
              },
              {
                "id": 330,
                "name": "重的爪",
                "secretName": "重的爪",
                "description": "攻 +13 敏 -1 (x3)",
                "image": 20217,
                "cost": 2530,
                "type": 0,
                "useField": 0,
                "target": 0,
                "level": 20,
                "price": 2530
              },
              {
                "id": 600,
                "name": "小的投掷斧头",
                "secretName": "小的投掷斧头",
                "description": "攻 +4",
                "image": 20508,
                "cost": 50,
                "type": 18,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 50
              },
              {
                "id": 620,
                "name": "轻的投掷斧头",
                "secretName": "轻的投掷斧头",
                "description": "攻 +11 敏 +1",
                "image": 20504,
                "cost": 800,
                "type": 18,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 800
              }
            ]
          }
        },
        {
          "id": "1001-17-15-5694",
          "name": "萨姆吉尔的防具店",
          "x": 17,
          "y": 15,
          "type": "ItemShop",
          "dialogue": "欢迎光临",
          "dialogueLines": [
            "欢迎光临"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1001_17_15",
          "template": "npcgen_shop",
          "graphic": "16018",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1001_17_15",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临",
            "items": [
              {
                "id": 800,
                "name": "粗杂的兜",
                "secretName": "粗杂的兜",
                "description": "防 +3",
                "image": 21541,
                "cost": 50,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 50
              },
              {
                "id": 810,
                "name": "普通普通的兜",
                "secretName": "普通普通的兜",
                "description": "防 +4",
                "image": 21540,
                "cost": 200,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 200
              },
              {
                "id": 820,
                "name": "轻的兜",
                "secretName": "轻的兜",
                "description": "防 +5",
                "image": 21510,
                "cost": 800,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 800
              },
              {
                "id": 841,
                "name": "美鲁菲Lv1兜5",
                "secretName": "美鲁菲Lv1兜5",
                "description": "防 +8 敏 -3 净化精灵(毒) Lv1",
                "image": 21518,
                "cost": 5750,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 25,
                "price": 5750
              },
              {
                "id": 900,
                "name": "破烂的帽子",
                "secretName": "破烂的帽子",
                "description": "防 +1",
                "image": 21508,
                "cost": 40,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 40
              },
              {
                "id": 912,
                "name": "爱鲁菲Lv2帽子2",
                "secretName": "爱鲁菲Lv2帽子2",
                "description": "防 +1 净化精灵(石化) Lv2",
                "image": 21503,
                "cost": 280,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 280
              },
              {
                "id": 920,
                "name": "普通普通的帽子",
                "secretName": "普通普通的帽子",
                "description": "防 +3",
                "image": 21530,
                "cost": 640,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 640
              },
              {
                "id": 1000,
                "name": "粗杂的铠",
                "secretName": "粗杂的铠",
                "description": "防 +4 敏 -1",
                "image": 21014,
                "cost": 75,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 75
              },
              {
                "id": 1011,
                "name": "哈鲁Lv1铠2",
                "secretName": "哈鲁Lv1铠2",
                "description": "防 +6 敏 -2 治愈的精灵 Lv1",
                "image": 21027,
                "cost": 400,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 400
              },
              {
                "id": 1020,
                "name": "轻的铠",
                "secretName": "轻的铠",
                "description": "防 +11 敏 -2",
                "image": 21046,
                "cost": 1200,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 1200
              },
              {
                "id": 1100,
                "name": "破烂的服",
                "secretName": "破烂的服",
                "description": "防 +2",
                "image": 21041,
                "cost": 60,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 60
              },
              {
                "id": 1113,
                "name": "提欧Lv1服2",
                "secretName": "提欧Lv1服2",
                "description": "防 +3 恩惠的精灵 Lv1",
                "image": 21009,
                "cost": 528,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 528
              },
              {
                "id": 1120,
                "name": "普通普通的服",
                "secretName": "普通普通的服",
                "description": "防 +7",
                "image": 21033,
                "cost": 960,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 960
              }
            ]
          }
        },
        {
          "id": "1001-16-19-7636",
          "name": "村子里的万事通",
          "x": 16,
          "y": 19,
          "type": "Windowman",
          "dialogue": "你想知道关于武器的哪些事呢？",
          "dialogueLines": [
            "你想知道关于武器的哪些事呢？",
            "直接攻击武器",
            "间接攻击武器",
            "2",
            "直接攻击类的武器是吧？你想知道",
            "哪一种武器呢？",
            "棍棒",
            "斧头"
          ],
          "source": "ref___data/npc/sainasu/bukiya.create",
          "script": "conff:sainasu/bukiya01.conf",
          "template": "windowman",
          "graphic": "16208"
        },
        {
          "id": "1001-10-15-6336",
          "name": "Warp",
          "x": 10,
          "y": 15,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1001-10-16-6338",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (63,100) | 入口 2 格 (10,15)-(10,16)",
          "to": "1000",
          "x": 10,
          "y": 16,
          "bounds": [
            10,
            15,
            10,
            16
          ],
          "target": [
            63,
            100
          ],
          "tiles": [
            {
              "x": 10,
              "y": 15,
              "target": [
                63,
                99
              ]
            },
            {
              "x": 10,
              "y": 16,
              "target": [
                63,
                100
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1002": {
      "id": "1002",
      "floorId": 1002,
      "name": "萨姆吉尔的道具店",
      "mapFile": "/data/maps/1002.ls2map",
      "clientMapFile": "/data/client-maps/1002.dat",
      "clientMapSource": "公益石器时代/map/1002.dat",
      "summary": "萨姆吉尔的道具店 | floor=1002 | 30x30 | ref___data/map/sainasu/samugiru/1002",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        15
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1002-15-13-7705",
          "name": "法术通",
          "x": 15,
          "y": 13,
          "type": "Windowman",
          "dialogue": "关于法术，你想知道哪些事情呢？",
          "dialogueLines": [
            "关于法术，你想知道哪些事情呢？",
            "关于法术的基本知识",
            "回复、复活系的法术",
            "状态异常系法术",
            "净化系法术",
            "属性变化系法术",
            "防御系法术",
            "‘关于法术的基本知识’"
          ],
          "source": "ref___data/npc/sainasu/jujutu.create",
          "script": "conff:sainasu/jujutu01.conf",
          "template": "windowman",
          "graphic": "16201"
        },
        {
          "id": "1002-18-15-5695",
          "name": "萨姆吉尔的道具店",
          "x": 18,
          "y": 15,
          "type": "ItemShop",
          "dialogue": "欢迎光临",
          "dialogueLines": [
            "欢迎光临"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1002_18_15",
          "template": "npcgen_shop",
          "graphic": "16033",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1002_18_15",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临",
            "items": [
              {
                "id": 1202,
                "name": "青色双重手环",
                "secretName": "青色双重的手环",
                "description": "攻 -1 防 +1 敏 +1 魅 +1",
                "image": 22058,
                "cost": 1000,
                "type": 8,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1000
              },
              {
                "id": 1250,
                "name": "阿萨Lv1贝铃",
                "secretName": "阿萨Lv1贝铃",
                "description": "魅 +1 大地的精灵 Lv1",
                "image": 24199,
                "cost": 300,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 300
              },
              {
                "id": 1257,
                "name": "阿萨Lv2木笛",
                "secretName": "阿萨Lv2木笛",
                "description": "魅 +2 大地的精灵 Lv2",
                "image": 24204,
                "cost": 700,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 700
              },
              {
                "id": 1264,
                "name": "阿萨Lv3鸣子",
                "secretName": "阿萨Lv3鸣子",
                "description": "魅 +3 大地的精灵 Lv3",
                "image": 24208,
                "cost": 1200,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 30,
                "price": 1200
              },
              {
                "id": 1305,
                "name": "木的戒指",
                "secretName": "木的戒指",
                "description": "魅 +1 会心一击率上升 +2",
                "image": 22052,
                "cost": 1600,
                "type": 11,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1600
              },
              {
                "id": 1350,
                "name": "黑色小首饰",
                "secretName": "黑色小首饰",
                "description": "魅 +1 毒耐性 +10",
                "image": 22010,
                "cost": 3400,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 3400
              },
              {
                "id": 1351,
                "name": "红色小首饰",
                "secretName": "红色小首饰",
                "description": "魅 +1 石化耐性 +10",
                "image": 22008,
                "cost": 3000,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 3000
              },
              {
                "id": 1352,
                "name": "小骨首饰",
                "secretName": "小骨首饰",
                "description": "魅 +1 睡眠耐性 +10",
                "image": 22016,
                "cost": 2600,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2600
              },
              {
                "id": 1353,
                "name": "绿色小首饰",
                "secretName": "绿色小首饰",
                "description": "魅 +1 混乱耐性 +10",
                "image": 22009,
                "cost": 4000,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 4000
              },
              {
                "id": 1354,
                "name": "青色小首饰",
                "secretName": "青色小首饰",
                "description": "魅 +1 酒醉耐性 +10",
                "image": 22001,
                "cost": 2000,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2000
              },
              {
                "id": 1402,
                "name": "红色小耳环",
                "secretName": "红色小耳环",
                "description": "魅 +3 回避率上升 +1",
                "image": 22103,
                "cost": 500,
                "type": 13,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 500
              }
            ]
          }
        },
        {
          "id": "1002-10-15-6341",
          "name": "Warp",
          "x": 10,
          "y": 15,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1002-10-16-6343",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (67,109) | 入口 2 格 (10,15)-(10,16)",
          "to": "1000",
          "x": 10,
          "y": 16,
          "bounds": [
            10,
            15,
            10,
            16
          ],
          "target": [
            67,
            109
          ],
          "tiles": [
            {
              "x": 10,
              "y": 15,
              "target": [
                67,
                108
              ]
            },
            {
              "x": 10,
              "y": 16,
              "target": [
                67,
                109
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1003": {
      "id": "1003",
      "floorId": 1003,
      "name": "萨姆吉尔的宠物店|00",
      "mapFile": "/data/maps/1003.ls2map",
      "clientMapFile": "/data/client-maps/1003.dat",
      "clientMapSource": "公益石器时代/map/1003.dat",
      "summary": "萨姆吉尔的宠物店|00 | floor=1003 | 30x30 | ref___data/map/sainasu/samugiru/1003",
      "size": [
        30,
        30
      ],
      "spawn": [
        16,
        21
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1003-12-13-5696",
          "name": "宠物店",
          "x": 12,
          "y": 13,
          "type": "PetShop",
          "dialogue": "欢迎光临宠物店。你的宠物要卖还是寄放都可以。",
          "dialogueLines": [
            "欢迎光临宠物店。你的宠物要卖还是寄放都可以。"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ps_1003_12_13",
          "template": "npcgen_petshop",
          "graphic": "16038"
        },
        {
          "id": "1003-18-13-5699",
          "name": "超级饲育员",
          "x": 18,
          "y": 13,
          "type": "PetSkillShop",
          "dialogue": "这个村里的超级饲育员",
          "dialogueLines": [
            "这个村里的超级饲育员",
            "好了！要教它什么好呢？"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/psks_1003_18_13",
          "template": "npcgen_petskillshop",
          "graphic": "16047"
        },
        {
          "id": "1003-19-17-7713",
          "name": "村子里的万事通",
          "x": 19,
          "y": 17,
          "type": "Windowman",
          "dialogue": "关于特技你想知道什么吗？",
          "dialogueLines": [
            "关于特技你想知道什么吗？",
            "普通特技",
            "状态异常特技",
            "特殊攻击 1",
            "特殊攻击 2",
            "2",
            "关于普通特技是吗？",
            "普通特技共有下列几种技巧。"
          ],
          "source": "ref___data/npc/sainasu/wazaya.create",
          "script": "conff:sainasu/wazaya01.conf",
          "template": "windowman",
          "graphic": "16209"
        },
        {
          "id": "1003-19-20-1484",
          "name": "蛇的训练师",
          "x": 19,
          "y": 20,
          "type": "NPC_FreePetSkill",
          "dialogue": "准备好要学技能了吗？",
          "dialogueLines": [
            "准备好要学技能了吗？"
          ],
          "source": "ref___data/npc/freeshop/freeshop01.create",
          "script": "file:freeshop/freeshop04.arg",
          "template": "FreePetSkill",
          "graphic": "16096"
        },
        {
          "id": "1003-19-15-7423",
          "name": "宠物常识解说员",
          "x": 19,
          "y": 15,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/newbie/petmaster",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/newbie/newbie.create",
          "script": "file:sa60/newbie/petmaster",
          "template": "changeevent",
          "graphic": "16122"
        },
        {
          "id": "1003-13-13-5698",
          "name": "乌力斯坦",
          "x": 13,
          "y": 13,
          "type": "npcgen_mugon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_mugon",
          "template": "npcgen_mugon",
          "graphic": "100252"
        },
        {
          "id": "1003-14-13-5697",
          "name": "乌力",
          "x": 14,
          "y": 13,
          "type": "npcgen_mugon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_mugon",
          "template": "npcgen_mugon",
          "graphic": "100250"
        },
        {
          "id": "1003-16-13-5700",
          "name": "店长",
          "x": 16,
          "y": 13,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1003_16_13",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/msg_1003_16_13",
          "template": "npcgen_man",
          "graphic": "16016"
        },
        {
          "id": "1003-15-21-6348",
          "name": "Warp",
          "x": 15,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1003-16-21-6346",
          "name": "Warp",
          "x": 16,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (69,72) | 入口 2 格 (15,21)-(16,21)",
          "to": "1000",
          "x": 16,
          "y": 21,
          "bounds": [
            15,
            21,
            16,
            21
          ],
          "target": [
            69,
            72
          ],
          "tiles": [
            {
              "x": 16,
              "y": 21,
              "target": [
                69,
                72
              ]
            },
            {
              "x": 15,
              "y": 21,
              "target": [
                68,
                72
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1004": {
      "id": "1004",
      "floorId": 1004,
      "name": "萨姆吉尔的肉店",
      "mapFile": "/data/maps/1004.ls2map",
      "clientMapFile": "/data/client-maps/1004.dat",
      "clientMapSource": "公益石器时代/map/1004.dat",
      "summary": "萨姆吉尔的肉店 | floor=1004 | 30x30 | ref___data/map/sainasu/samugiru/1004",
      "size": [
        30,
        30
      ],
      "spawn": [
        16,
        21
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1004-17-13-5701",
          "name": "萨姆吉尔的肉店",
          "x": 17,
          "y": 13,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1004_17_13",
          "template": "npcgen_shop",
          "graphic": "16054",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1004_17_13",
            "buyRate": 1,
            "sellRate": 1,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 2344,
                "name": "小的肉",
                "secretName": "小的肉",
                "description": "耐久力20前後回复",
                "image": 24008,
                "cost": 12,
                "type": 20,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 12
              },
              {
                "id": 2345,
                "name": "乾燥肉",
                "secretName": "乾燥肉",
                "description": "耐久力35前後回复",
                "image": 24035,
                "cost": 18,
                "type": 20,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 18
              },
              {
                "id": 2346,
                "name": "大的肉",
                "secretName": "大的肉",
                "description": "耐久力65前後回复",
                "image": 24017,
                "cost": 30,
                "type": 20,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 30
              },
              {
                "id": 2347,
                "name": "高级肉",
                "secretName": "高级肉",
                "description": "耐久力80前後回复",
                "image": 24026,
                "cost": 48,
                "type": 20,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 48
              }
            ]
          }
        },
        {
          "id": "1004-15-21-6352",
          "name": "Warp",
          "x": 15,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1004-16-21-6350",
          "name": "Warp",
          "x": 16,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (54,81) | 入口 2 格 (15,21)-(16,21)",
          "to": "1000",
          "x": 16,
          "y": 21,
          "bounds": [
            15,
            21,
            16,
            21
          ],
          "target": [
            54,
            81
          ],
          "tiles": [
            {
              "x": 16,
              "y": 21,
              "target": [
                54,
                81
              ]
            },
            {
              "x": 15,
              "y": 21,
              "target": [
                53,
                81
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1005": {
      "id": "1005",
      "floorId": 1005,
      "name": "萨姆吉尔的医院",
      "mapFile": "/data/maps/1005.ls2map",
      "clientMapFile": "/data/client-maps/1005.dat",
      "clientMapSource": "公益石器时代/map/1005.dat",
      "summary": "萨姆吉尔的医院 | floor=1005 | 30x30 | ref___data/map/sainasu/samugiru/1005",
      "size": [
        30,
        30
      ],
      "spawn": [
        16,
        21
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1005-14-14-5703",
          "name": "萨姆吉尔的药剂师",
          "x": 14,
          "y": 14,
          "type": "ItemShop",
          "dialogue": "到了",
          "dialogueLines": [
            "到了"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1005_14_14",
          "template": "npcgen_shop",
          "graphic": "16023",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1005_14_14",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "到了",
            "items": [
              {
                "id": 1500,
                "name": "耐久力回复药",
                "secretName": "耐久力回复药",
                "description": "耐久力100前後回复",
                "image": 23013,
                "cost": 25,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 25
              },
              {
                "id": 1501,
                "name": "耐久力回复药",
                "secretName": "耐久力回复药",
                "description": "耐久力200前後回复",
                "image": 23014,
                "cost": 50,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 50
              },
              {
                "id": 1510,
                "name": "气力回复药",
                "secretName": "气力回复药",
                "description": "气力20前後回复",
                "image": 23005,
                "cost": 80,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 80
              },
              {
                "id": 1511,
                "name": "气力回复药",
                "secretName": "气力回复药",
                "description": "气力40前後回复",
                "image": 23006,
                "cost": 160,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 160
              },
              {
                "id": 1512,
                "name": "气力回复药",
                "secretName": "气力回复药",
                "description": "气力60前後回复",
                "image": 23007,
                "cost": 250,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 250
              },
              {
                "id": 1530,
                "name": "复活药(100)",
                "secretName": "复活药(100)",
                "description": "气绝回复成耐力100",
                "image": 23021,
                "cost": 100,
                "type": 16,
                "useField": 1,
                "target": 101,
                "level": 0,
                "price": 100
              },
              {
                "id": 1531,
                "name": "复活药(300)",
                "secretName": "复活药(300)",
                "description": "气绝回复成耐力300",
                "image": 23021,
                "cost": 300,
                "type": 16,
                "useField": 1,
                "target": 101,
                "level": 0,
                "price": 300
              },
              {
                "id": 1540,
                "name": "乌西摩尼叶",
                "secretName": "乌西摩尼叶",
                "description": "解毒的热带性植物",
                "image": 23026,
                "cost": 30,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 30
              },
              {
                "id": 1541,
                "name": "伊西娃丽索叶",
                "secretName": "伊西娃丽索叶",
                "description": "解除石化的潮湿地带植物",
                "image": 23027,
                "cost": 25,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 25
              },
              {
                "id": 1542,
                "name": "摩浦叶",
                "secretName": "摩浦叶",
                "description": "解除混乱的平原植物",
                "image": 23024,
                "cost": 20,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 20
              },
              {
                "id": 1543,
                "name": "西伦恩根",
                "secretName": "西伦恩根",
                "description": "解除酒醉的乾燥地带植物",
                "image": 23028,
                "cost": 20,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 20
              },
              {
                "id": 1545,
                "name": "菲恩叶",
                "secretName": "菲恩叶",
                "description": "解除睡眠的海边植物",
                "image": 23025,
                "cost": 30,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 30
              }
            ]
          }
        },
        {
          "id": "1005-11-13-5239",
          "name": "萨姆吉尔的医生",
          "x": 11,
          "y": 13,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1005_11_13",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/newdir.create",
          "script": "file:genout/msg_1005_11_13",
          "template": "changeevent",
          "graphic": "16024"
        },
        {
          "id": "1005-17-13-5702",
          "name": "萨姆吉尔的护士",
          "x": 17,
          "y": 13,
          "type": "WindowHealer",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_winhealer",
          "template": "npcgen_winhealer",
          "graphic": "16012"
        },
        {
          "id": "1005-25-15-5704",
          "name": "美容师",
          "x": 25,
          "y": 15,
          "type": "Charm",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_charm",
          "template": "npcgen_charm",
          "graphic": "16065"
        },
        {
          "id": "1005-15-21-6356",
          "name": "Warp",
          "x": 15,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1005-16-21-6354",
          "name": "Warp",
          "x": 16,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (81,66) | 入口 2 格 (15,21)-(16,21)",
          "to": "1000",
          "x": 16,
          "y": 21,
          "bounds": [
            15,
            21,
            16,
            21
          ],
          "target": [
            81,
            66
          ],
          "tiles": [
            {
              "x": 16,
              "y": 21,
              "target": [
                81,
                66
              ]
            },
            {
              "x": 15,
              "y": 21,
              "target": [
                80,
                66
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1006": {
      "id": "1006",
      "floorId": 1006,
      "name": "萨姆吉尔的村长家",
      "mapFile": "/data/maps/1006.ls2map",
      "clientMapFile": "/data/client-maps/1006.dat",
      "clientMapSource": "公益石器时代/map/1006.dat",
      "summary": "萨姆吉尔的村长家 | floor=1006 | 30x40 | ref___data/map/sainasu/samugiru/1006",
      "size": [
        30,
        40
      ],
      "spawn": [
        10,
        20
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1006-12-13-7709",
          "name": "占卜师",
          "x": 12,
          "y": 13,
          "type": "LuckyMan",
          "dialogue": "想要我帮你占卜今日运势的话",
          "dialogueLines": [
            "想要我帮你占卜今日运势的话",
            "S是少不了的...。",
            "今天你的运势非常不好喔...。最好小心一点。",
            "凶...真糟糕...。",
            "虽然不是说非常好，不过只要你努力的话还是有机会的...。",
            "小吉....吧..",
            "嗯...普普通通啦！",
            "不好也不坏。"
          ],
          "source": "ref___data/npc/sainasu/uranai.create",
          "script": "file:sainasu/uranai",
          "template": "luckyman",
          "graphic": "16021"
        },
        {
          "id": "1006-15-13-7137",
          "name": "战斗指导员",
          "x": 15,
          "y": 13,
          "type": "Familyman",
          "dialogue": "4",
          "dialogueLines": [
            "4",
            "我是这个村子的战斗指导员！你想了解如何快速获取经验以及了解人们都在哪里战斗吗？请选择你的等级我将告诉你哪里最适合你前往！",
            "《等级01～20》",
            "《等级20～40》",
            "《等级40～60》",
            "《等级60～80》",
            "2",
            "你想了解哪一方面。"
          ],
          "source": "ref___data/npc/newguest/familyman.create",
          "script": "conff:newguest/familyman.conf",
          "template": "familyman",
          "graphic": "16125"
        },
        {
          "id": "1006-18-24-1323",
          "name": "家族管理员",
          "x": 18,
          "y": 24,
          "type": "Familyman",
          "dialogue": "2",
          "dialogueLines": [
            "2",
            "我是这个村子里的家族管理员！",
            "有什么我可以为你服务的吗？",
            "介绍家族功能",
            "申请成立新的家族",
            "申请加入现有家族",
            "退出或者解散家族",
            "想离开你的族人们了吗？"
          ],
          "source": "ref___data/npc/family/familyman.create",
          "script": "conff:family/familyman.conf",
          "template": "familyman",
          "graphic": "16065"
        },
        {
          "id": "1006-18-26-7718",
          "name": "村子里的万事通",
          "x": 18,
          "y": 26,
          "type": "Windowman",
          "dialogue": "2",
          "dialogueLines": [
            "2",
            "我是这个村子里的万事通啦！",
            "你想知道什么吗？",
            "关于操作的方法",
            "关于系统按钮",
            "关于宠物",
            "关于对战",
            "关于操作吗？"
          ],
          "source": "ref___data/npc/sainasu/windowman.create",
          "script": "conff:sainasu/manual.conf",
          "template": "windowman",
          "graphic": "16017"
        },
        {
          "id": "1006-18-30-1314",
          "name": "家族银行",
          "x": 18,
          "y": 30,
          "type": "Bankman",
          "dialogue": "2",
          "dialogueLines": [
            "2",
            "我是这个家族的银行管理员！",
            "你想查看自己的存款金额吗？",
            "家族个人帐户",
            "家族共同帐户"
          ],
          "source": "ref___data/npc/family/bankman.create",
          "script": "conff:family/bankman.conf",
          "template": "bankman",
          "graphic": "16017"
        },
        {
          "id": "1006-18-22-5705",
          "name": "萨姆吉尔的村长",
          "x": 18,
          "y": 22,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1006_18_22",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/msg_1006_18_22",
          "template": "changeevent",
          "graphic": "16210"
        },
        {
          "id": "1006-16-16-5706",
          "name": "村长家的厨师",
          "x": 16,
          "y": 16,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1006_16_16",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/msg_1006_16_16",
          "template": "npcgen_man",
          "graphic": "16054"
        },
        {
          "id": "1006-16-19-1340",
          "name": "家族留言版",
          "x": 16,
          "y": 19,
          "type": "FmDengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/family/fmdengon.create",
          "script": "npcgen_fmdengon",
          "template": "npcgen_fmdengon",
          "graphic": "10062"
        },
        {
          "id": "1006-10-20-6358",
          "name": "Warp",
          "x": 10,
          "y": 20,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1006-10-21-6360",
          "name": "Warp",
          "x": 10,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (98,45) | 入口 2 格 (10,20)-(10,21)",
          "to": "1000",
          "x": 10,
          "y": 21,
          "bounds": [
            10,
            20,
            10,
            21
          ],
          "target": [
            98,
            45
          ],
          "tiles": [
            {
              "x": 10,
              "y": 20,
              "target": [
                98,
                44
              ]
            },
            {
              "x": 10,
              "y": 21,
              "target": [
                98,
                45
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1009": {
      "id": "1009",
      "floorId": 1009,
      "name": "萨姆吉尔的便利商店",
      "mapFile": "/data/maps/1009.ls2map",
      "clientMapFile": "/data/client-maps/1009.dat",
      "clientMapSource": "公益石器时代/map/1009.dat",
      "summary": "萨姆吉尔的便利商店 | floor=1009 | 40x60 | ref___data/map/sainasu/samugiru/1009",
      "size": [
        40,
        60
      ],
      "spawn": [
        10,
        25
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1009-20-12-5005",
          "name": "委托书贩售员",
          "x": 20,
          "y": 12,
          "type": "ItemShop",
          "dialogue": "接任务要先买委托书喔！",
          "dialogueLines": [
            "接任务要先买委托书喔！"
          ],
          "source": "ref___data/npc/genout/mission.create",
          "script": "file:genout/ss_1009_20_12",
          "template": "npcgen_shop",
          "graphic": "16201",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1009_20_12",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "接任务要先买委托书喔！",
            "items": [
              {
                "id": 20001,
                "name": "萨村宠物委托书Ａ",
                "secretName": "萨村宠物委托书Ａ",
                "description": "昆伊和凯比特各两只，报酬400。",
                "image": 24176,
                "cost": 40,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 40
              },
              {
                "id": 20002,
                "name": "萨村宠物委托书Ｂ",
                "secretName": "萨村宠物委托书Ｂ",
                "description": "乌力和乌力斯坦各两只，报酬800。",
                "image": 24176,
                "cost": 80,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 80
              },
              {
                "id": 20003,
                "name": "萨村宠物委托书Ｃ",
                "secretName": "萨村宠物委托书Ｃ",
                "description": "呼拔拔和鲁尼帖斯各一只，报酬1500。",
                "image": 24176,
                "cost": 150,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 150
              },
              {
                "id": 20004,
                "name": "萨村宠物委托书Ｄ",
                "secretName": "萨村宠物委托书Ｄ",
                "description": "特洛昆和达克尔各两只，报酬3200。",
                "image": 24176,
                "cost": 320,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 320
              },
              {
                "id": 20005,
                "name": "萨村宠物委托书Ｅ",
                "secretName": "萨村宠物委托书Ｅ",
                "description": "龟之盾、绿龟、卡梅兰恩、石龟各一只，报酬精灵的羽毛一根。",
                "image": 24176,
                "cost": 400,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 400
              },
              {
                "id": 20006,
                "name": "萨村宠物委托书Ｆ",
                "secretName": "萨村宠物委托书Ｆ",
                "description": "柯伊达、柯洛加斯、多洛加、加克拉、海主人各一只，报酬?",
                "image": 24176,
                "cost": 1500,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 1500
              }
            ]
          }
        },
        {
          "id": "1009-14-13-5796",
          "name": "寄放店",
          "x": 14,
          "y": 13,
          "type": "PoolItemShop",
          "dialogue": "欢迎！",
          "dialogueLines": [
            "欢迎！"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/pis_1009_14_13",
          "template": "npcgen_poolitemshop",
          "graphic": "16055"
        },
        {
          "id": "1009-27-15-5797",
          "name": "收集破烂的商店",
          "x": 27,
          "y": 15,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1009_27_15",
          "template": "npcgen_shop",
          "graphic": "16208",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1009_27_15",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 2705,
                "name": "魔术笔 (油性)",
                "secretName": "魔术笔 (油性)",
                "description": "被加工的道具的名称 可以变更 (使用次数一次)",
                "image": 10904,
                "cost": 300,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 300
              },
              {
                "id": 2612,
                "name": "骰子",
                "secretName": "骰子",
                "description": "每次丢出来的数字都不一样",
                "image": 24298,
                "cost": 200,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 200
              },
              {
                "id": 2613,
                "name": "愿藏娃娃",
                "secretName": "愿藏娃娃",
                "description": "魅力 -3 有名人(?)愿藏的娃娃",
                "image": 24316,
                "cost": 50,
                "type": 15,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 50
              }
            ]
          }
        },
        {
          "id": "1009-27-17-5792",
          "name": "素材屋(石、木)",
          "x": 27,
          "y": 17,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1009_27_17",
          "template": "npcgen_shop",
          "graphic": "16017",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1009_27_17",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 11800,
                "name": "长青苔的石",
                "secretName": "长青苔的石",
                "description": "石的成分 1",
                "image": 24056,
                "cost": 26,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 26
              },
              {
                "id": 11801,
                "name": "光滑的石",
                "secretName": "光滑的石",
                "description": "石的成分 2",
                "image": 24062,
                "cost": 118,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 118
              },
              {
                "id": 11802,
                "name": "球石",
                "secretName": "球石",
                "description": "石的成分 3",
                "image": 24058,
                "cost": 468,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 468
              },
              {
                "id": 11803,
                "name": "凹凸不平的石",
                "secretName": "凹凸不平的石",
                "description": "石的成分 4",
                "image": 24062,
                "cost": 1368,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1368
              },
              {
                "id": 11804,
                "name": "洗涤石",
                "secretName": "洗涤石",
                "description": "石的成分 5",
                "image": 24063,
                "cost": 2700,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2700
              },
              {
                "id": 11805,
                "name": "坏石",
                "secretName": "坏石",
                "description": "石的成分 6",
                "image": 24054,
                "cost": 5040,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 5040
              },
              {
                "id": 11806,
                "name": "酸石",
                "secretName": "酸石",
                "description": "石的成分 7",
                "image": 24057,
                "cost": 7740,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7740
              },
              {
                "id": 11807,
                "name": "好石",
                "secretName": "好石",
                "description": "石的成分 8",
                "image": 24059,
                "cost": 11880,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 11880
              },
              {
                "id": 11810,
                "name": "腐烂的木",
                "secretName": "腐烂的木",
                "description": "木的成分 1",
                "image": 24117,
                "cost": 22,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 22
              },
              {
                "id": 11811,
                "name": "小枝",
                "secretName": "小枝",
                "description": "木的成分 2",
                "image": 24117,
                "cost": 98,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 98
              },
              {
                "id": 11812,
                "name": "枝干",
                "secretName": "枝干",
                "description": "木的成分 3",
                "image": 24115,
                "cost": 390,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 390
              },
              {
                "id": 11813,
                "name": "潮湿的木",
                "secretName": "潮湿的木",
                "description": "木的成分 4",
                "image": 24115,
                "cost": 1140,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1140
              },
              {
                "id": 11814,
                "name": "新木",
                "secretName": "新木",
                "description": "木的成分 5",
                "image": 24115,
                "cost": 2250,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2250
              },
              {
                "id": 11815,
                "name": "晒乾的木",
                "secretName": "晒乾的木",
                "description": "木的成分 6",
                "image": 24116,
                "cost": 4200,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 4200
              },
              {
                "id": 11816,
                "name": "光滑的木",
                "secretName": "光滑的木",
                "description": "木的成分 7",
                "image": 24116,
                "cost": 6450,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 6450
              },
              {
                "id": 11817,
                "name": "古代木",
                "secretName": "古代木",
                "description": "木的成分 8",
                "image": 24114,
                "cost": 9900,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 9900
              },
              {
                "id": 11820,
                "name": "骨的碎片",
                "secretName": "骨的碎片",
                "description": "骨的成分 1",
                "image": 24108,
                "cost": 26,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 26
              },
              {
                "id": 11821,
                "name": "有裂痕的骨",
                "secretName": "有裂痕的骨",
                "description": "骨的成分 2",
                "image": 24108,
                "cost": 118,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 118
              },
              {
                "id": 11822,
                "name": "弱的骨",
                "secretName": "弱的骨",
                "description": "骨的成分 3",
                "image": 24108,
                "cost": 468,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 468
              },
              {
                "id": 11823,
                "name": "变色的骨",
                "secretName": "变色的骨",
                "description": "骨的成分 4",
                "image": 24111,
                "cost": 1368,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1368
              },
              {
                "id": 11824,
                "name": "珍贵的骨",
                "secretName": "珍贵的骨",
                "description": "骨的成分 5",
                "image": 24111,
                "cost": 2700,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2700
              },
              {
                "id": 11825,
                "name": "硬的骨",
                "secretName": "硬的骨",
                "description": "骨的成分 6",
                "image": 24112,
                "cost": 5040,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 5040
              },
              {
                "id": 11826,
                "name": "兽之骨",
                "secretName": "兽之骨",
                "description": "骨的成分 7",
                "image": 24112,
                "cost": 7740,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7740
              },
              {
                "id": 11827,
                "name": "古老的骨",
                "secretName": "古老的骨",
                "description": "骨的成分 8",
                "image": 20036,
                "cost": 11880,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 11880
              },
              {
                "id": 11830,
                "name": "牙的碎片",
                "secretName": "牙的碎片",
                "description": "牙的成分 1",
                "image": 24109,
                "cost": 24,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 24
              },
              {
                "id": 11831,
                "name": "小牙",
                "secretName": "小牙",
                "description": "牙的成分 2",
                "image": 24109,
                "cost": 108,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 108
              },
              {
                "id": 11832,
                "name": "折断的牙",
                "secretName": "折断的牙",
                "description": "牙的成分 3",
                "image": 24109,
                "cost": 430,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 430
              },
              {
                "id": 11833,
                "name": "硬的牙",
                "secretName": "硬的牙",
                "description": "牙的成分 4",
                "image": 24109,
                "cost": 1254,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1254
              },
              {
                "id": 11834,
                "name": "大牙",
                "secretName": "大牙",
                "description": "牙的成分 5",
                "image": 24109,
                "cost": 2476,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2476
              },
              {
                "id": 11835,
                "name": "锐利的牙",
                "secretName": "锐利的牙",
                "description": "牙的成分 6",
                "image": 24110,
                "cost": 4620,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 4620
              },
              {
                "id": 11836,
                "name": "猛兽的牙",
                "secretName": "猛兽的牙",
                "description": "牙的成分 7",
                "image": 24110,
                "cost": 7096,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7096
              },
              {
                "id": 11837,
                "name": "龙之牙",
                "secretName": "龙之牙",
                "description": "牙的成分 8",
                "image": 24110,
                "cost": 10890,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 10890
              }
            ]
          }
        },
        {
          "id": "1009-27-24-5793",
          "name": "素材屋(牙、皮)",
          "x": 27,
          "y": 24,
          "type": "ItemShop",
          "dialogue": "欢迎光临。",
          "dialogueLines": [
            "欢迎光临。"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1009_27_24",
          "template": "npcgen_shop",
          "graphic": "16033",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1009_27_24",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临。",
            "items": [
              {
                "id": 11830,
                "name": "牙的碎片",
                "secretName": "牙的碎片",
                "description": "牙的成分 1",
                "image": 24109,
                "cost": 24,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 24
              },
              {
                "id": 11831,
                "name": "小牙",
                "secretName": "小牙",
                "description": "牙的成分 2",
                "image": 24109,
                "cost": 108,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 108
              },
              {
                "id": 11832,
                "name": "折断的牙",
                "secretName": "折断的牙",
                "description": "牙的成分 3",
                "image": 24109,
                "cost": 430,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 430
              },
              {
                "id": 11833,
                "name": "硬的牙",
                "secretName": "硬的牙",
                "description": "牙的成分 4",
                "image": 24109,
                "cost": 1254,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1254
              },
              {
                "id": 11834,
                "name": "大牙",
                "secretName": "大牙",
                "description": "牙的成分 5",
                "image": 24109,
                "cost": 2476,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2476
              },
              {
                "id": 11835,
                "name": "锐利的牙",
                "secretName": "锐利的牙",
                "description": "牙的成分 6",
                "image": 24110,
                "cost": 4620,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 4620
              },
              {
                "id": 11836,
                "name": "猛兽的牙",
                "secretName": "猛兽的牙",
                "description": "牙的成分 7",
                "image": 24110,
                "cost": 7096,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7096
              },
              {
                "id": 11837,
                "name": "龙之牙",
                "secretName": "龙之牙",
                "description": "牙的成分 8",
                "image": 24110,
                "cost": 10890,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 10890
              },
              {
                "id": 11840,
                "name": "破烂的皮",
                "secretName": "破烂的皮",
                "description": "皮的成分 1",
                "image": 24124,
                "cost": 22,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 22
              },
              {
                "id": 11841,
                "name": "易破的皮",
                "secretName": "易破的皮",
                "description": "皮的成分 2",
                "image": 24124,
                "cost": 98,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 98
              },
              {
                "id": 11842,
                "name": "薄的皮",
                "secretName": "薄的皮",
                "description": "皮的成分 3",
                "image": 24125,
                "cost": 390,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 390
              },
              {
                "id": 11843,
                "name": "光滑的皮",
                "secretName": "光滑的皮",
                "description": "皮的成分 4",
                "image": 24125,
                "cost": 1140,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1140
              },
              {
                "id": 11844,
                "name": "厚的皮",
                "secretName": "厚的皮",
                "description": "皮的成分 5",
                "image": 24126,
                "cost": 2250,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2250
              },
              {
                "id": 11845,
                "name": "熟皮",
                "secretName": "熟皮",
                "description": "皮的成分 6",
                "image": 24126,
                "cost": 4200,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 4200
              },
              {
                "id": 11846,
                "name": "有光泽的皮",
                "secretName": "有光泽的皮",
                "description": "皮的成分 7",
                "image": 24127,
                "cost": 6450,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 6450
              },
              {
                "id": 11847,
                "name": "硬的皮",
                "secretName": "硬的皮",
                "description": "皮的成分 8",
                "image": 24127,
                "cost": 9900,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 9900
              },
              {
                "id": 11880,
                "name": "蜘蛛的丝",
                "secretName": "蜘蛛的丝",
                "description": "线的成分 1",
                "image": 24105,
                "cost": 18,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 18
              },
              {
                "id": 11881,
                "name": "草的蔓",
                "secretName": "草的蔓",
                "description": "线的成分 2",
                "image": 24107,
                "cost": 78,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 78
              },
              {
                "id": 11882,
                "name": "木的蔓",
                "secretName": "木的蔓",
                "description": "线的成分 3",
                "image": 24107,
                "cost": 312,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 312
              },
              {
                "id": 11883,
                "name": "毛编的绳",
                "secretName": "毛编的绳",
                "description": "线的成分 4",
                "image": 24104,
                "cost": 912,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 912
              },
              {
                "id": 11884,
                "name": "皮的绳",
                "secretName": "皮的绳",
                "description": "线的成分 5",
                "image": 24104,
                "cost": 1800,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1800
              },
              {
                "id": 11885,
                "name": "耐用的蔓",
                "secretName": "耐用的蔓",
                "description": "线的成分 6",
                "image": 24106,
                "cost": 3360,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 3360
              },
              {
                "id": 11886,
                "name": "粗糙的绳",
                "secretName": "粗糙的绳",
                "description": "线的成分 7",
                "image": 24104,
                "cost": 5160,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 5160
              },
              {
                "id": 11887,
                "name": "强的绳",
                "secretName": "强的绳",
                "description": "线的成分 8",
                "image": 24104,
                "cost": 7920,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7920
              },
              {
                "id": 11900,
                "name": "乾涸的黏土",
                "secretName": "乾涸的黏土",
                "description": "黏土的成分 1",
                "image": 24062,
                "cost": 6,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 6
              },
              {
                "id": 11901,
                "name": "黏黏的黏土",
                "secretName": "黏黏的黏土",
                "description": "黏土的成分 2",
                "image": 24062,
                "cost": 25,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 11902,
                "name": "水分多的黏土",
                "secretName": "水分多的黏土",
                "description": "黏土的成分 3",
                "image": 24062,
                "cost": 98,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 98
              },
              {
                "id": 11903,
                "name": "柔软的黏土",
                "secretName": "柔软的黏土",
                "description": "黏土的成分 4",
                "image": 24062,
                "cost": 285,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 285
              },
              {
                "id": 11904,
                "name": "硬的黏土",
                "secretName": "硬的黏土",
                "description": "黏土的成分 5",
                "image": 24062,
                "cost": 563,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 563
              },
              {
                "id": 11905,
                "name": "不可思议的黏土",
                "secretName": "不可思议的黏土",
                "description": "黏土的成分 6",
                "image": 24062,
                "cost": 1050,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1050
              },
              {
                "id": 11906,
                "name": "化石的黏土",
                "secretName": "化石的黏土",
                "description": "黏土的成分 7",
                "image": 24062,
                "cost": 1613,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1613
              },
              {
                "id": 11907,
                "name": "上等的黏土",
                "secretName": "上等的黏土",
                "description": "黏土的成分 8",
                "image": 24062,
                "cost": 2475,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2475
              }
            ]
          }
        },
        {
          "id": "1009-27-28-5794",
          "name": "素材屋(贝、鳞)",
          "x": 27,
          "y": 28,
          "type": "ItemShop",
          "dialogue": "欢迎光临。",
          "dialogueLines": [
            "欢迎光临。"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1009_27_28",
          "template": "npcgen_shop",
          "graphic": "16206",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1009_27_28",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临。",
            "items": [
              {
                "id": 11860,
                "name": "砂色的贝壳",
                "secretName": "砂色的贝壳",
                "description": "贝壳的成分 1",
                "image": 24130,
                "cost": 26,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 26
              },
              {
                "id": 11861,
                "name": "土色的贝壳",
                "secretName": "土色的贝壳",
                "description": "贝壳的成分 2",
                "image": 24130,
                "cost": 118,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 118
              },
              {
                "id": 11862,
                "name": "樱色的贝壳",
                "secretName": "樱色的贝壳",
                "description": "贝壳的成分 3",
                "image": 24131,
                "cost": 468,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 468
              },
              {
                "id": 11863,
                "name": "红色的贝壳",
                "secretName": "红色的贝壳",
                "description": "贝壳的成分 4",
                "image": 24131,
                "cost": 1368,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1368
              },
              {
                "id": 11864,
                "name": "苍色的贝壳",
                "secretName": "苍色的贝壳",
                "description": "贝壳的成分 5",
                "image": 24132,
                "cost": 2700,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2700
              },
              {
                "id": 11865,
                "name": "海色的贝壳",
                "secretName": "海色的贝壳",
                "description": "贝壳的成分 6",
                "image": 24132,
                "cost": 5040,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 5040
              },
              {
                "id": 11866,
                "name": "水色的贝壳",
                "secretName": "水色的贝壳",
                "description": "贝壳的成分 7",
                "image": 24133,
                "cost": 7740,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7740
              },
              {
                "id": 11867,
                "name": "天空色的贝壳",
                "secretName": "天空色的贝壳",
                "description": "贝壳的成分 8",
                "image": 24133,
                "cost": 11880,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 11880
              },
              {
                "id": 11870,
                "name": "裂开的壳",
                "secretName": "裂开的壳",
                "description": "壳的成分 1",
                "image": 24150,
                "cost": 26,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 26
              },
              {
                "id": 11871,
                "name": "小的壳",
                "secretName": "小的壳",
                "description": "壳的成分 2",
                "image": 24150,
                "cost": 118,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 118
              },
              {
                "id": 11872,
                "name": "有裂痕的壳",
                "secretName": "有裂痕的壳",
                "description": "壳的成分 3",
                "image": 24150,
                "cost": 468,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 468
              },
              {
                "id": 11873,
                "name": "薄的壳",
                "secretName": "薄的壳",
                "description": "壳的成分 4",
                "image": 24149,
                "cost": 1368,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1368
              },
              {
                "id": 11874,
                "name": "褪色的壳",
                "secretName": "褪色的壳",
                "description": "壳的成分 5",
                "image": 24149,
                "cost": 2700,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2700
              },
              {
                "id": 11875,
                "name": "大的壳",
                "secretName": "大的壳",
                "description": "壳的成分 6",
                "image": 24149,
                "cost": 5040,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 5040
              },
              {
                "id": 11876,
                "name": "硬的壳",
                "secretName": "硬的壳",
                "description": "壳的成分 7",
                "image": 24148,
                "cost": 7740,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7740
              },
              {
                "id": 11877,
                "name": "珍贵的壳",
                "secretName": "珍贵的壳",
                "description": "壳的成分 8",
                "image": 24148,
                "cost": 11880,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 11880
              },
              {
                "id": 11910,
                "name": "鳞的碎片",
                "secretName": "鳞的碎片",
                "description": "鳞的成分 1",
                "image": 22034,
                "cost": 7,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7
              },
              {
                "id": 11911,
                "name": "小鱼的鳞",
                "secretName": "小鱼的鳞",
                "description": "鳞的成分 2",
                "image": 22034,
                "cost": 30,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 30
              },
              {
                "id": 11912,
                "name": "小的鳞",
                "secretName": "小的鳞",
                "description": "鳞的成分 3",
                "image": 22035,
                "cost": 117,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 117
              },
              {
                "id": 11913,
                "name": "清澈的鳞",
                "secretName": "清澈的鳞",
                "description": "鳞的成分 4",
                "image": 22035,
                "cost": 342,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 342
              },
              {
                "id": 11914,
                "name": "轻的鳞",
                "secretName": "轻的鳞",
                "description": "鳞的成分 5",
                "image": 22033,
                "cost": 675,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 675
              },
              {
                "id": 11915,
                "name": "大的鳞",
                "secretName": "大的鳞",
                "description": "鳞的成分 6",
                "image": 22033,
                "cost": 1260,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1260
              },
              {
                "id": 11916,
                "name": "重的鳞",
                "secretName": "重的鳞",
                "description": "鳞的成分 7",
                "image": 22037,
                "cost": 1935,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1935
              },
              {
                "id": 11917,
                "name": "硬的鳞",
                "secretName": "硬的鳞",
                "description": "鳞的成分 8",
                "image": 22037,
                "cost": 2970,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2970
              },
              {
                "id": 11920,
                "name": "腐烂的叶",
                "secretName": "腐烂的叶",
                "description": "叶的成分 1",
                "image": 24180,
                "cost": 5,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 5
              },
              {
                "id": 11921,
                "name": "枯萎的叶",
                "secretName": "枯萎的叶",
                "description": "叶的成分 2",
                "image": 24180,
                "cost": 22,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 22
              },
              {
                "id": 11922,
                "name": "小的叶",
                "secretName": "小的叶",
                "description": "叶的成分 3",
                "image": 24179,
                "cost": 88,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 88
              },
              {
                "id": 11923,
                "name": "新叶",
                "secretName": "新叶",
                "description": "叶的成分 4",
                "image": 24179,
                "cost": 257,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 257
              },
              {
                "id": 11924,
                "name": "珍贵的叶",
                "secretName": "珍贵的叶",
                "description": "叶的成分 5",
                "image": 24179,
                "cost": 507,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 507
              },
              {
                "id": 11925,
                "name": "大的叶",
                "secretName": "大的叶",
                "description": "叶的成分 6",
                "image": 24178,
                "cost": 945,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 945
              },
              {
                "id": 11926,
                "name": "不可思议的叶",
                "secretName": "不可思议的叶",
                "description": "叶的成分 7",
                "image": 24179,
                "cost": 1452,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1452
              },
              {
                "id": 11927,
                "name": "灵木的叶",
                "secretName": "灵木的叶",
                "description": "叶的成分 8",
                "image": 24178,
                "cost": 2228,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2228
              }
            ]
          }
        },
        {
          "id": "1009-25-30-7032",
          "name": "加工的老师",
          "x": 25,
          "y": 30,
          "type": "Windowman",
          "dialogue": "2",
          "dialogueLines": [
            "2",
            "我是加工的老师",
            "你有没有什么事情想问我呢？",
            "加工的方法",
            "素材的说明",
            "提示",
            "关于加工的方法是这样的…",
            "所谓的装备的加工不是由玩家来进行而是"
          ],
          "source": "ref___data/npc/jaruga/menu.create",
          "script": "conff:jaruga/gousei.conf",
          "template": "windowman",
          "graphic": "16209"
        },
        {
          "id": "1009-27-37-5795",
          "name": "素材屋(属性)",
          "x": 27,
          "y": 37,
          "type": "ItemShop",
          "dialogue": "欢迎光临。",
          "dialogueLines": [
            "欢迎光临。"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1009_27_37",
          "template": "npcgen_shop",
          "graphic": "16067",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1009_27_37",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临。",
            "items": [
              {
                "id": 12010,
                "name": "粗糙的砂",
                "secretName": "粗糙的砂",
                "description": "地的成分 1",
                "image": 24161,
                "cost": 2,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 2
              },
              {
                "id": 12011,
                "name": "潮湿的砂",
                "secretName": "潮湿的砂",
                "description": "地的成分 2",
                "image": 24161,
                "cost": 7,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7
              },
              {
                "id": 12012,
                "name": "细的砂",
                "secretName": "细的砂",
                "description": "地的成分 3",
                "image": 24161,
                "cost": 28,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 28
              },
              {
                "id": 12013,
                "name": "乾燥的砂",
                "secretName": "乾燥的砂",
                "description": "地的成分 4",
                "image": 24161,
                "cost": 81,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 81
              },
              {
                "id": 12014,
                "name": "美丽的砂",
                "secretName": "美丽的砂",
                "description": "地的成分 5",
                "image": 24161,
                "cost": 175,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 175
              },
              {
                "id": 12015,
                "name": "闪耀的砂",
                "secretName": "闪耀的砂",
                "description": "地的成分 6",
                "image": 24161,
                "cost": 298,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 298
              },
              {
                "id": 12016,
                "name": "光辉的砂",
                "secretName": "光辉的砂",
                "description": "地的成分 7",
                "image": 24161,
                "cost": 455,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 455
              },
              {
                "id": 12017,
                "name": "海之砂",
                "secretName": "海之砂",
                "description": "地的成分 8",
                "image": 24161,
                "cost": 700,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 700
              },
              {
                "id": 12020,
                "name": "朝露的水滴",
                "secretName": "朝露的水滴",
                "description": "水的成分 1",
                "image": 24144,
                "cost": 1,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1
              },
              {
                "id": 12021,
                "name": "雨水的水滴",
                "secretName": "雨水的水滴",
                "description": "水的成分 2",
                "image": 24144,
                "cost": 7,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7
              },
              {
                "id": 12022,
                "name": "涌泉的水滴",
                "secretName": "涌泉的水滴",
                "description": "水的成分 3",
                "image": 24144,
                "cost": 28,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 28
              },
              {
                "id": 12023,
                "name": "融雪的水滴",
                "secretName": "融雪的水滴",
                "description": "水的成分 4",
                "image": 24144,
                "cost": 81,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 81
              },
              {
                "id": 12024,
                "name": "清水的水滴",
                "secretName": "清水的水滴",
                "description": "水的成分 5",
                "image": 24144,
                "cost": 175,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 175
              },
              {
                "id": 12025,
                "name": "蒸馏水的水滴",
                "secretName": "蒸馏水的水滴",
                "description": "水的成分 6",
                "image": 24144,
                "cost": 298,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 298
              },
              {
                "id": 12026,
                "name": "地下水的水滴",
                "secretName": "地下水的水滴",
                "description": "水的成分 7",
                "image": 24144,
                "cost": 455,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 455
              },
              {
                "id": 12027,
                "name": "圣水的水滴",
                "secretName": "圣水的水滴",
                "description": "水的成分 8",
                "image": 24144,
                "cost": 700,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 700
              },
              {
                "id": 12030,
                "name": "火药草",
                "secretName": "火药草",
                "description": "火的成分 1",
                "image": 23029,
                "cost": 1,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1
              },
              {
                "id": 12031,
                "name": "火之粉草",
                "secretName": "火之粉草",
                "description": "火的成分 2",
                "image": 23029,
                "cost": 7,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7
              },
              {
                "id": 12032,
                "name": "火花草",
                "secretName": "火花草",
                "description": "火的成分 3",
                "image": 23029,
                "cost": 28,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 28
              },
              {
                "id": 12033,
                "name": "灯火草",
                "secretName": "灯火草",
                "description": "火的成分 4",
                "image": 23029,
                "cost": 81,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 81
              },
              {
                "id": 12034,
                "name": "火炎草",
                "secretName": "火炎草",
                "description": "火的成分 5",
                "image": 23029,
                "cost": 175,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 175
              },
              {
                "id": 12035,
                "name": "燃火草",
                "secretName": "燃火草",
                "description": "火的成分 6",
                "image": 23029,
                "cost": 298,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 298
              },
              {
                "id": 12036,
                "name": "红莲草",
                "secretName": "红莲草",
                "description": "火的成分 7",
                "image": 23029,
                "cost": 455,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 455
              },
              {
                "id": 12037,
                "name": "烈火草",
                "secretName": "烈火草",
                "description": "火的成分 8",
                "image": 23029,
                "cost": 700,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 700
              },
              {
                "id": 12040,
                "name": "凯比的羽毛",
                "secretName": "凯比的羽毛",
                "description": "风的成分 1",
                "image": 24136,
                "cost": 1,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 1
              },
              {
                "id": 12041,
                "name": "凯比特的羽毛",
                "secretName": "凯比特的羽毛",
                "description": "风的成分 2",
                "image": 24136,
                "cost": 7,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7
              },
              {
                "id": 12042,
                "name": "乌宝宝的羽毛",
                "secretName": "乌宝宝的羽毛",
                "description": "风的成分 3",
                "image": 24137,
                "cost": 28,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 28
              },
              {
                "id": 12043,
                "name": "火鸡的羽毛",
                "secretName": "火鸡的羽毛",
                "description": "风的成分 4",
                "image": 24137,
                "cost": 81,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 81
              },
              {
                "id": 12044,
                "name": "霍尔克的羽毛",
                "secretName": "霍尔克的羽毛",
                "description": "风的成分 5",
                "image": 24138,
                "cost": 175,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 175
              },
              {
                "id": 12045,
                "name": "加美的羽毛",
                "secretName": "加美的羽毛",
                "description": "风的成分 6",
                "image": 24138,
                "cost": 298,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 298
              },
              {
                "id": 12046,
                "name": "加斯的羽毛",
                "secretName": "加斯的羽毛",
                "description": "风的成分 7",
                "image": 24141,
                "cost": 455,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 455
              },
              {
                "id": 12047,
                "name": "克克洛斯的羽毛",
                "secretName": "克克洛斯的羽毛",
                "description": "风的成分 8",
                "image": 24141,
                "cost": 700,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 700
              }
            ]
          }
        },
        {
          "id": "1009-18-12-1301",
          "name": "委托管理员",
          "x": 18,
          "y": 12,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/extra/event/M_1000",
          "dialogueLines": [],
          "source": "ref___data/npc/extra/event/mission.create",
          "script": "file:extra/event/M_1000",
          "template": "changeevent",
          "graphic": "16200"
        },
        {
          "id": "1009-10-25-6362",
          "name": "Warp",
          "x": 10,
          "y": 25,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1009-10-26-6364",
          "name": "Warp",
          "x": 10,
          "y": 26,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (106,92) | 入口 2 格 (10,25)-(10,26)",
          "to": "1000",
          "x": 10,
          "y": 26,
          "bounds": [
            10,
            25,
            10,
            26
          ],
          "target": [
            106,
            92
          ],
          "tiles": [
            {
              "x": 10,
              "y": 25,
              "target": [
                106,
                91
              ]
            },
            {
              "x": 10,
              "y": 26,
              "target": [
                106,
                92
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1011": {
      "id": "1011",
      "floorId": 1011,
      "name": "长毛象快递|00畖0",
      "mapFile": "/data/maps/1011.ls2map",
      "clientMapFile": "/data/client-maps/1011.dat",
      "clientMapSource": "公益石器时代/map/1011.dat",
      "summary": "长毛象快递|00畖0 | floor=1011 | 30x30 | ref___data/map/sainasu/samugiru/1011",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        15
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1011-13-13-6139",
          "name": "长毛象快递",
          "x": 13,
          "y": 13,
          "type": "ItemShop",
          "dialogue": "谢谢！今天是来打工的吗？",
          "dialogueLines": [
            "谢谢！今天是来打工的吗？",
            "还是送东西来的呢？"
          ],
          "source": "ref___data/npc/genout/unsoya_1.create",
          "script": "file:genout/ss_1011_13_13",
          "template": "npcgen_shop",
          "graphic": "16055",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1011_13_13",
            "buyRate": 0.2,
            "sellRate": 2,
            "buyWords": [
              "你好",
              "谢谢",
              "打工",
              "工作",
              "帮忙",
              "baito",
              "work",
              "hataraku"
            ],
            "sellWords": [
              "送货",
              "送货",
              "行李货物",
              "行李货物",
              "nimotu",
              "todoke"
            ],
            "mainMessage": "谢谢！今天是来打工的吗？\\n还是送东西来的呢？",
            "items": [
              {
                "id": 2405,
                "name": "往玛丽娜丝的行李",
                "secretName": "往玛丽娜丝的行李",
                "description": "萨姆吉尔到玛丽娜丝的行李",
                "image": 16071,
                "cost": 40,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 8
              },
              {
                "id": 2408,
                "name": "往卡鲁它那的行李",
                "secretName": "往卡鲁它那的行李",
                "description": "萨姆吉尔到卡鲁它那的行李",
                "image": 16071,
                "cost": 60,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12
              },
              {
                "id": 2411,
                "name": "往加加的行李",
                "secretName": "往加加的行李",
                "description": "萨姆吉尔到加加的行李",
                "image": 16071,
                "cost": 70,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 14
              }
            ]
          }
        },
        {
          "id": "1011-18-18-6140",
          "name": "长毛象（运送用）",
          "x": 18,
          "y": 18,
          "type": "npcgen_mugon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/unsoya_1.create",
          "script": "npcgen_mugon",
          "template": "npcgen_mugon",
          "graphic": "100355"
        },
        {
          "id": "1011-14-17-6141",
          "name": "店员",
          "x": 14,
          "y": 17,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1014_14_17",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/unsoya_1.create",
          "script": "file:genout/msg_1014_14_17",
          "template": "npcgen_warpman",
          "graphic": "16036"
        },
        {
          "id": "1011-14-20-7429",
          "name": "长毛象快递老板",
          "x": 14,
          "y": 20,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/newbie/worksell_1014.conf",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/newbie/newbie2.create",
          "script": "file:sa60/newbie/worksell_1014.conf",
          "template": "npcgen_warpman",
          "graphic": "16018"
        },
        {
          "id": "1011-10-15-6376",
          "name": "Warp",
          "x": 10,
          "y": 15,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1011-10-16-6377",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (63,117) | 入口 2 格 (10,15)-(10,16)",
          "to": "1000",
          "x": 10,
          "y": 16,
          "bounds": [
            10,
            15,
            10,
            16
          ],
          "target": [
            63,
            117
          ],
          "tiles": [
            {
              "x": 10,
              "y": 15,
              "target": [
                63,
                117
              ]
            },
            {
              "x": 10,
              "y": 16,
              "target": [
                63,
                117
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1012": {
      "id": "1012",
      "floorId": 1012,
      "name": "聊天室柜台|0喟破饨陓0",
      "mapFile": "/data/maps/1012.ls2map",
      "clientMapFile": "/data/client-maps/1012.dat",
      "clientMapSource": "公益石器时代/map/1012.dat",
      "summary": "聊天室柜台|0喟破饨陓0 | floor=1012 | 30x30 | ref___data/map/sainasu/samugiru/1012",
      "size": [
        30,
        30
      ],
      "spawn": [
        15,
        21
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1012-13-16-103",
          "name": "解说员",
          "x": 13,
          "y": 16,
          "type": "Windowman",
          "dialogue": "‘聊天室引导所’",
          "dialogueLines": [
            "‘聊天室引导所’",
            "从这里、能够到聊天室。",
            "聊天室能够从开始的四个村子",
            "进入。",
            "里面有三个房间跟大厅。",
            "请多多利用。",
            "要进入聊天室必需要有门票。",
            "门票要在各个村子交出来。"
          ],
          "source": "ref___data/npc/chatroom/chatroom.create",
          "script": "conff:chatroom/chatroom.conf",
          "template": "windowman",
          "graphic": "16033"
        },
        {
          "id": "1012-18-16-102",
          "name": "门票贩卖员",
          "x": 18,
          "y": 16,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/chatroom/ticket1012",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/chatroom.create",
          "script": "file:chatroom/ticket1012",
          "template": "changeevent",
          "graphic": "16065"
        },
        {
          "id": "1012-14-13-2188",
          "name": "向导",
          "x": 14,
          "y": 13,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_1012_14_13",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/chatroom.create",
          "script": "file:genout/wpm_1012_14_13",
          "template": "npcgen_warpman",
          "graphic": "16202",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "110",
              "floor": 110,
              "x": 37,
              "y": 21
            },
            "free": "ITEM=2521*1",
            "money": "-1",
            "cost": {
              "mode": "unavailable"
            },
            "deleteItems": [
              2522,
              2523,
              2524,
              2602,
              2597,
              2598,
              2599,
              2600,
              2601
            ],
            "freeMessage": "欢迎来到聊天室 现在聊天室里有人的 出席者。 请您慢慢使用。",
            "payMessage": "没有门票。 请到那里购买门票。 现在的入场者有人。",
            "normalMessage": "",
            "moneyMessage": "真的是不好意思。",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别 入场。",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_1012_14_13"
          }
        },
        {
          "id": "1012-15-21-6382",
          "name": "Warp",
          "x": 15,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1012-16-21-6384",
          "name": "Warp",
          "x": 16,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (113,37) | 入口 2 格 (15,21)-(16,21)",
          "to": "1000",
          "x": 16,
          "y": 21,
          "bounds": [
            15,
            21,
            16,
            21
          ],
          "target": [
            113,
            37
          ],
          "tiles": [
            {
              "x": 15,
              "y": 21,
              "target": [
                112,
                37
              ]
            },
            {
              "x": 16,
              "y": 21,
              "target": [
                113,
                37
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1013": {
      "id": "1013",
      "floorId": 1013,
      "name": "老爷爷的家",
      "mapFile": "/data/maps/1013.ls2map",
      "clientMapFile": "/data/client-maps/1013.dat",
      "clientMapSource": "公益石器时代/map/1013.dat",
      "summary": "老爷爷的家 | floor=1013 | 30x30 | ref___data/map/poru/1013",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        16
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1013-14-16-7299",
          "name": "老爷爷的孙女",
          "x": 14,
          "y": 16,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/poru/girl",
          "dialogueLines": [],
          "source": "ref___data/npc/poru/samugiru01.create",
          "script": "file:poru/girl",
          "template": "changeevent",
          "graphic": "16009"
        },
        {
          "id": "1013-10-15-7194",
          "name": "Warp",
          "x": 10,
          "y": 15,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/poru/dragon_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1013-10-16-7195",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/poru/dragon_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (79,112) | 入口 2 格 (10,15)-(10,16)",
          "to": "1000",
          "x": 10,
          "y": 16,
          "bounds": [
            10,
            15,
            10,
            16
          ],
          "target": [
            79,
            112
          ],
          "tiles": [
            {
              "x": 10,
              "y": 15,
              "target": [
                79,
                112
              ]
            },
            {
              "x": 10,
              "y": 16,
              "target": [
                79,
                112
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1014": {
      "id": "1014",
      "floorId": 1014,
      "name": "长毛象快递|00",
      "mapFile": "/data/maps/1014.ls2map",
      "clientMapFile": "/data/client-maps/1014.dat",
      "clientMapSource": "公益石器时代/map/1014.dat",
      "summary": "长毛象快递|00 | floor=1014 | 30x30 | ref___data/map/sainasu/samugiru/1014",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        16
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1014-13-13-6142",
          "name": "长毛象快递",
          "x": 13,
          "y": 13,
          "type": "ItemShop",
          "dialogue": "谢谢！",
          "dialogueLines": [
            "谢谢！"
          ],
          "source": "ref___data/npc/genout/unsoya_1.create",
          "script": "file:genout/lbis_1014_13_13",
          "template": "npcgen_limitshop",
          "graphic": "16055",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/lbis_1014_13_13",
            "buyRate": 1,
            "sellRate": 1.5,
            "buyWords": [
              "你好",
              "引谢谢",
              "打工",
              "工作",
              "帮忙",
              "baito",
              "work",
              "hataraku",
              "送货",
              "送货",
              "货物",
              "货物",
              "nimotu",
              "todoke"
            ],
            "sellWords": [
              "卖",
              "卖",
              "卖",
              "卖",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "谢谢！",
            "items": [
              {
                "id": 2402,
                "name": "往萨姆吉尔的行李",
                "secretName": "往萨姆吉尔的行李",
                "description": "玛丽娜丝到萨姆吉尔的行李",
                "image": 16071,
                "cost": 40,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 40
              },
              {
                "id": 2403,
                "name": "往萨姆吉尔的行李",
                "secretName": "往萨姆吉尔的行李",
                "description": "卡鲁它那到萨姆吉尔的行李",
                "image": 16071,
                "cost": 60,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 60
              },
              {
                "id": 2404,
                "name": "往萨姆吉尔的行李",
                "secretName": "往萨姆吉尔的行李",
                "description": "加加到萨姆吉尔的行李",
                "image": 16071,
                "cost": 70,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 70
              }
            ]
          }
        },
        {
          "id": "1014-18-18-6143",
          "name": "长毛象（运送用）",
          "x": 18,
          "y": 18,
          "type": "npcgen_mugon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/unsoya_1.create",
          "script": "npcgen_mugon",
          "template": "npcgen_mugon",
          "graphic": "100355"
        },
        {
          "id": "1014-14-17-6144",
          "name": "店员",
          "x": 14,
          "y": 17,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1014_14_17",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/unsoya_1.create",
          "script": "file:genout/msg_1014_14_17",
          "template": "npcgen_warpman",
          "graphic": "16036"
        },
        {
          "id": "1014-14-20-7428",
          "name": "长毛象快递老板",
          "x": 14,
          "y": 20,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/newbie/worksell_1014.conf",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/newbie/newbie2.create",
          "script": "file:sa60/newbie/worksell_1014.conf",
          "template": "npcgen_warpman",
          "graphic": "16018"
        },
        {
          "id": "1014-10-15-6380",
          "name": "Warp",
          "x": 10,
          "y": 15,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1014-10-16-6379",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (63,118) | 入口 2 格 (10,15)-(10,16)",
          "to": "1000",
          "x": 10,
          "y": 16,
          "bounds": [
            10,
            15,
            10,
            16
          ],
          "target": [
            63,
            118
          ],
          "tiles": [
            {
              "x": 10,
              "y": 16,
              "target": [
                63,
                118
              ]
            },
            {
              "x": 10,
              "y": 15,
              "target": [
                63,
                118
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1020": {
      "id": "1020",
      "floorId": 1020,
      "name": "萨姆吉尔道场柜台",
      "mapFile": "/data/maps/1020.ls2map",
      "clientMapFile": "/data/client-maps/1020.dat",
      "clientMapSource": "公益石器时代/map/1020.dat",
      "summary": "萨姆吉尔道场柜台 | floor=1020 | 25x25 | ref___data/map/sainasu/samugiru/1020",
      "size": [
        25,
        25
      ],
      "spawn": [
        4,
        12
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1020-14-9-5709",
          "name": "看板",
          "x": 14,
          "y": 9,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_1020_14_9",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/signb_1020_14_9",
          "template": "npcgen_signboard",
          "graphic": "10096"
        },
        {
          "id": "1020-18-12-5708",
          "name": "道场的柜台",
          "x": 18,
          "y": 12,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_1020_18_12",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/wpm_1020_18_12",
          "template": "npcgen_warpman",
          "graphic": "16065",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 130
            },
            "free": "",
            "money": "LV*5",
            "cost": {
              "mode": "level-multiplier",
              "amount": 5
            },
            "deleteItems": [],
            "freeMessage": "＝＝＝＝＝＝道场的柜台＝＝＝＝＝＝",
            "payMessage": "＝＝＝＝＝＝道场的柜台＝＝＝＝＝＝ 这个道场可以容纳一百人 现在入场共人 道场的入场费个石头 的收费。可以吗？ 另外，离场后到医务室的话 不能再回到道场",
            "normalMessage": "",
            "moneyMessage": "＝＝＝＝＝＝道场的柜台＝＝＝＝＝＝ 对不起，金额不足。 请先存够钱后再入场。",
            "partyMessage": "＝＝＝＝＝＝道场的柜台＝＝＝＝＝＝ 团队的状况下不得入场 请先将团队解散后 一位一位入场",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_1020_18_12"
          }
        },
        {
          "id": "1020-4-12-6368",
          "name": "Warp",
          "x": 4,
          "y": 12,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1000-0",
          "label": "去 萨姆吉尔村",
          "detail": "萨姆吉尔村 | floor 1000 | 目标 (97,110) | 入口 (4,12)",
          "to": "1000",
          "x": 4,
          "y": 12,
          "bounds": [
            4,
            12,
            4,
            12
          ],
          "target": [
            97,
            110
          ],
          "tiles": [
            {
              "x": 4,
              "y": 12,
              "target": [
                97,
                110
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1021": {
      "id": "1021",
      "floorId": 1021,
      "name": "百人联手道场|00",
      "mapFile": "/data/maps/1021.ls2map",
      "clientMapFile": "/data/client-maps/1021.dat",
      "clientMapSource": "公益石器时代/map/1021.dat",
      "summary": "百人联手道场|00 | floor=1021 | 407x144 | ref___data/map/sainasu/samugiru/1021",
      "size": [
        407,
        144
      ],
      "spawn": [
        203,
        72
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1021-4-16-722",
          "name": "第 100 个弟子",
          "x": 4,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou100.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou100.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou100.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第100个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1008",
              "floor": 1008,
              "x": 20,
              "y": 20
            }
          }
        },
        {
          "id": "1021-48-16-692",
          "name": "第 90 个弟子",
          "x": 48,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou090.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou090.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou090.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第90个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 128
            }
          }
        },
        {
          "id": "1021-92-16-662",
          "name": "第 80 个弟子",
          "x": 92,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou080.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou080.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou080.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第80个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 128
            }
          }
        },
        {
          "id": "1021-136-16-632",
          "name": "第 70 个弟子",
          "x": 136,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou070.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou070.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou070.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第70个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 128
            }
          }
        },
        {
          "id": "1021-180-16-602",
          "name": "第 60 个弟子",
          "x": 180,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou060.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou060.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou060.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第60个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 128
            }
          }
        },
        {
          "id": "1021-224-16-572",
          "name": "第 50 个弟子",
          "x": 224,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou050.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou050.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou050.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第50个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 128
            }
          }
        },
        {
          "id": "1021-268-16-542",
          "name": "第 40 个弟子",
          "x": 268,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou040.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou040.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou040.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第40个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 128
            }
          }
        },
        {
          "id": "1021-312-16-512",
          "name": "第 30 个弟子",
          "x": 312,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou030.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou030.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou030.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第30个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 128
            }
          }
        },
        {
          "id": "1021-356-16-482",
          "name": "第 20 个弟子",
          "x": 356,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou020.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou020.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou020.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第20个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 128
            }
          }
        },
        {
          "id": "1021-400-16-452",
          "name": "第 10 个弟子",
          "x": 400,
          "y": 16,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou010.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou010.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou010.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第10个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 128
            }
          }
        },
        {
          "id": "1021-4-28-719",
          "name": "第 99 个弟子",
          "x": 4,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou099.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou099.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou099.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第99个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 18
            }
          }
        },
        {
          "id": "1021-48-28-689",
          "name": "第 89 个弟子",
          "x": 48,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou089.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou089.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou089.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第89个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 18
            }
          }
        },
        {
          "id": "1021-92-28-659",
          "name": "第 79 个弟子",
          "x": 92,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou079.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou079.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou079.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第79个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 18
            }
          }
        },
        {
          "id": "1021-136-28-629",
          "name": "第 69 个弟子",
          "x": 136,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou069.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou069.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou069.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第69个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 18
            }
          }
        },
        {
          "id": "1021-180-28-599",
          "name": "第 59 个弟子",
          "x": 180,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou059.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou059.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou059.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第59个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 18
            }
          }
        },
        {
          "id": "1021-224-28-569",
          "name": "第 49 个弟子",
          "x": 224,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou049.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou049.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou049.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第49个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 18
            }
          }
        },
        {
          "id": "1021-268-28-539",
          "name": "第 39 个弟子",
          "x": 268,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou039.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou039.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou039.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第39个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 18
            }
          }
        },
        {
          "id": "1021-312-28-509",
          "name": "第 29 个弟子",
          "x": 312,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou029.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou029.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou029.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第29个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 18
            }
          }
        },
        {
          "id": "1021-356-28-479",
          "name": "第 19 个弟子",
          "x": 356,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou019.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou019.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou019.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第19个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 18
            }
          }
        },
        {
          "id": "1021-400-28-449",
          "name": "第 9 个弟子",
          "x": 400,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou009.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou009.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou009.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第9个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 18
            }
          }
        },
        {
          "id": "1021-4-40-716",
          "name": "第 98 个弟子",
          "x": 4,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou098.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou098.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou098.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第98个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 30
            }
          }
        },
        {
          "id": "1021-48-40-686",
          "name": "第 88 个弟子",
          "x": 48,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou088.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou088.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou088.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第88个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 30
            }
          }
        },
        {
          "id": "1021-92-40-656",
          "name": "第 78 个弟子",
          "x": 92,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou078.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou078.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou078.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第78个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 30
            }
          }
        },
        {
          "id": "1021-136-40-626",
          "name": "第 68 个弟子",
          "x": 136,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou068.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou068.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou068.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第68个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 30
            }
          }
        },
        {
          "id": "1021-180-40-596",
          "name": "第 58 个弟子",
          "x": 180,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou058.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou058.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou058.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第58个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 30
            }
          }
        },
        {
          "id": "1021-224-40-566",
          "name": "第 48 个弟子",
          "x": 224,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou048.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou048.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou048.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第48个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 30
            }
          }
        },
        {
          "id": "1021-268-40-536",
          "name": "第 38 个弟子",
          "x": 268,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou038.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou038.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou038.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第38个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 30
            }
          }
        },
        {
          "id": "1021-312-40-506",
          "name": "第 28 个弟子",
          "x": 312,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou028.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou028.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou028.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第28个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 30
            }
          }
        },
        {
          "id": "1021-356-40-476",
          "name": "第 18 个弟子",
          "x": 356,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou018.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou018.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou018.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第18个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 30
            }
          }
        },
        {
          "id": "1021-400-40-446",
          "name": "第 8 个弟子",
          "x": 400,
          "y": 40,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou008.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou008.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou008.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第8个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 30
            }
          }
        },
        {
          "id": "1021-4-52-713",
          "name": "第 97 个弟子",
          "x": 4,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou097.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou097.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou097.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第97个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 42
            }
          }
        },
        {
          "id": "1021-48-52-683",
          "name": "第 87 个弟子",
          "x": 48,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou087.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou087.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou087.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第87个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 42
            }
          }
        },
        {
          "id": "1021-92-52-653",
          "name": "第 77 个弟子",
          "x": 92,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou077.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou077.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou077.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第77个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 42
            }
          }
        },
        {
          "id": "1021-136-52-623",
          "name": "第 67 个弟子",
          "x": 136,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou067.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou067.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou067.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第67个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 42
            }
          }
        },
        {
          "id": "1021-180-52-593",
          "name": "第 57 个弟子",
          "x": 180,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou057.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou057.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou057.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第57个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 42
            }
          }
        },
        {
          "id": "1021-224-52-563",
          "name": "第 47 个弟子",
          "x": 224,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou047.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou047.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou047.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第47个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 42
            }
          }
        },
        {
          "id": "1021-268-52-533",
          "name": "第 37 个弟子",
          "x": 268,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou037.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou037.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou037.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第37个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 42
            }
          }
        },
        {
          "id": "1021-312-52-503",
          "name": "第 27 个弟子",
          "x": 312,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou027.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou027.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou027.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第27个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 42
            }
          }
        },
        {
          "id": "1021-356-52-473",
          "name": "第 17 个弟子",
          "x": 356,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou017.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou017.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou017.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第17个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 42
            }
          }
        },
        {
          "id": "1021-400-52-443",
          "name": "第 7 个弟子",
          "x": 400,
          "y": 52,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou007.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou007.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou007.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第7个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 42
            }
          }
        },
        {
          "id": "1021-4-64-710",
          "name": "第 96 个弟子",
          "x": 4,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou096.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou096.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou096.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第96个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 54
            }
          }
        },
        {
          "id": "1021-48-64-680",
          "name": "第 86 个弟子",
          "x": 48,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou086.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou086.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou086.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第86个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 54
            }
          }
        },
        {
          "id": "1021-92-64-650",
          "name": "第 76 个弟子",
          "x": 92,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou076.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou076.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou076.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第76个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 54
            }
          }
        },
        {
          "id": "1021-136-64-620",
          "name": "第 66 个弟子",
          "x": 136,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou066.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou066.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou066.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第66个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 54
            }
          }
        },
        {
          "id": "1021-180-64-590",
          "name": "第 56 个弟子",
          "x": 180,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou056.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou056.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou056.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第56个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 54
            }
          }
        },
        {
          "id": "1021-224-64-560",
          "name": "第 46 个弟子",
          "x": 224,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou046.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou046.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou046.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第46个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 54
            }
          }
        },
        {
          "id": "1021-268-64-530",
          "name": "第 36 个弟子",
          "x": 268,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou036.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou036.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou036.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第36个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 54
            }
          }
        },
        {
          "id": "1021-312-64-500",
          "name": "第 26 个弟子",
          "x": 312,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou026.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou026.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou026.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第26个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 54
            }
          }
        },
        {
          "id": "1021-356-64-470",
          "name": "第 16 个弟子",
          "x": 356,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou016.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou016.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou016.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第16个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 54
            }
          }
        },
        {
          "id": "1021-400-64-440",
          "name": "第 6 个弟子",
          "x": 400,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou006.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou006.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou006.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第6个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 54
            }
          }
        },
        {
          "id": "1021-4-76-707",
          "name": "第 95 个弟子",
          "x": 4,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou095.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou095.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou095.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第95个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 66
            }
          }
        },
        {
          "id": "1021-48-76-677",
          "name": "第 85 个弟子",
          "x": 48,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou085.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou085.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou085.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第85个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 66
            }
          }
        },
        {
          "id": "1021-92-76-647",
          "name": "第 75 个弟子",
          "x": 92,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou075.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou075.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou075.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第75个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 66
            }
          }
        },
        {
          "id": "1021-136-76-617",
          "name": "第 65 个弟子",
          "x": 136,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou065.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou065.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou065.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第65个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 66
            }
          }
        },
        {
          "id": "1021-180-76-587",
          "name": "第 55 个弟子",
          "x": 180,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou055.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou055.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou055.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第55个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 66
            }
          }
        },
        {
          "id": "1021-224-76-557",
          "name": "第 45 个弟子",
          "x": 224,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou045.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou045.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou045.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第45个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 66
            }
          }
        },
        {
          "id": "1021-268-76-527",
          "name": "第 35 个弟子",
          "x": 268,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou035.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou035.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou035.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第35个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 66
            }
          }
        },
        {
          "id": "1021-312-76-497",
          "name": "第 25 个弟子",
          "x": 312,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou025.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou025.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou025.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第25个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 66
            }
          }
        },
        {
          "id": "1021-356-76-467",
          "name": "第 15 个弟子",
          "x": 356,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou015.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou015.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou015.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第15个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 66
            }
          }
        },
        {
          "id": "1021-400-76-437",
          "name": "第 5 个弟子",
          "x": 400,
          "y": 76,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou005.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou005.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou005.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第5个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 66
            }
          }
        },
        {
          "id": "1021-4-88-704",
          "name": "第 94 个弟子",
          "x": 4,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou094.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou094.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou094.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第94个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 78
            }
          }
        },
        {
          "id": "1021-48-88-674",
          "name": "第 84 个弟子",
          "x": 48,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou084.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou084.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou084.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第84个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 78
            }
          }
        },
        {
          "id": "1021-92-88-644",
          "name": "第 74 个弟子",
          "x": 92,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou074.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou074.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou074.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第74个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 78
            }
          }
        },
        {
          "id": "1021-136-88-614",
          "name": "第 64 个弟子",
          "x": 136,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou064.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou064.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou064.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第64个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 78
            }
          }
        },
        {
          "id": "1021-180-88-584",
          "name": "第 54 个弟子",
          "x": 180,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou054.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou054.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou054.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第54个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 78
            }
          }
        },
        {
          "id": "1021-224-88-554",
          "name": "第 44 个弟子",
          "x": 224,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou044.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou044.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou044.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第44个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 78
            }
          }
        },
        {
          "id": "1021-268-88-524",
          "name": "第 34 个弟子",
          "x": 268,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou034.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou034.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou034.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第34个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 78
            }
          }
        },
        {
          "id": "1021-312-88-494",
          "name": "第 24 个弟子",
          "x": 312,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou024.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou024.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou024.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第24个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 78
            }
          }
        },
        {
          "id": "1021-356-88-464",
          "name": "第 14 个弟子",
          "x": 356,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou014.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou014.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou014.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第14个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 78
            }
          }
        },
        {
          "id": "1021-400-88-434",
          "name": "第 4 个弟子",
          "x": 400,
          "y": 88,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou004.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou004.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou004.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第4个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 78
            }
          }
        },
        {
          "id": "1021-4-100-701",
          "name": "第 93 个弟子",
          "x": 4,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou093.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou093.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou093.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第93个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 90
            }
          }
        },
        {
          "id": "1021-48-100-671",
          "name": "第 83 个弟子",
          "x": 48,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou083.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou083.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou083.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第83个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 90
            }
          }
        },
        {
          "id": "1021-92-100-641",
          "name": "第 73 个弟子",
          "x": 92,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou073.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou073.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou073.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第73个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 90
            }
          }
        },
        {
          "id": "1021-136-100-611",
          "name": "第 63 个弟子",
          "x": 136,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou063.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou063.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou063.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第63个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 90
            }
          }
        },
        {
          "id": "1021-180-100-581",
          "name": "第 53 个弟子",
          "x": 180,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou053.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou053.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou053.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第53个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 90
            }
          }
        },
        {
          "id": "1021-224-100-551",
          "name": "第 43 个弟子",
          "x": 224,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou043.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou043.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou043.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第43个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 90
            }
          }
        },
        {
          "id": "1021-268-100-521",
          "name": "第 33 个弟子",
          "x": 268,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou033.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou033.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou033.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第33个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 90
            }
          }
        },
        {
          "id": "1021-312-100-491",
          "name": "第 23 个弟子",
          "x": 312,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou023.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou023.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou023.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第23个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 90
            }
          }
        },
        {
          "id": "1021-356-100-461",
          "name": "第 13 个弟子",
          "x": 356,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou013.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou013.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou013.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第13个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 90
            }
          }
        },
        {
          "id": "1021-400-100-431",
          "name": "第 3 个弟子",
          "x": 400,
          "y": 100,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou003.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou003.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou003.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第3个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 90
            }
          }
        },
        {
          "id": "1021-4-112-698",
          "name": "第 92 个弟子",
          "x": 4,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou092.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou092.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou092.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第92个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 102
            }
          }
        },
        {
          "id": "1021-48-112-668",
          "name": "第 82 个弟子",
          "x": 48,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou082.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou082.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou082.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第82个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 102
            }
          }
        },
        {
          "id": "1021-92-112-638",
          "name": "第 72 个弟子",
          "x": 92,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou072.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou072.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou072.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第72个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 102
            }
          }
        },
        {
          "id": "1021-136-112-608",
          "name": "第 62 个弟子",
          "x": 136,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou062.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou062.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou062.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第62个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 102
            }
          }
        },
        {
          "id": "1021-180-112-578",
          "name": "第 52 个弟子",
          "x": 180,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou052.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou052.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou052.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第52个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 102
            }
          }
        },
        {
          "id": "1021-224-112-548",
          "name": "第 42 个弟子",
          "x": 224,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou042.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou042.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou042.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第42个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 102
            }
          }
        },
        {
          "id": "1021-268-112-518",
          "name": "第 32 个弟子",
          "x": 268,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou032.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou032.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou032.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第32个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 102
            }
          }
        },
        {
          "id": "1021-312-112-488",
          "name": "第 22 个弟子",
          "x": 312,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou022.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou022.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou022.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第22个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 102
            }
          }
        },
        {
          "id": "1021-356-112-458",
          "name": "第 12 个弟子",
          "x": 356,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou012.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou012.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou012.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第12个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 102
            }
          }
        },
        {
          "id": "1021-400-112-428",
          "name": "第 2 个弟子",
          "x": 400,
          "y": 112,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou002.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou002.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou002.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第2个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 102
            }
          }
        },
        {
          "id": "1021-4-124-695",
          "name": "第 91 个弟子",
          "x": 4,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou091.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou091.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou091.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第91个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 4,
              "y": 114
            }
          }
        },
        {
          "id": "1021-48-124-665",
          "name": "第 81 个弟子",
          "x": 48,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou081.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou081.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou081.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第81个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 48,
              "y": 114
            }
          }
        },
        {
          "id": "1021-92-124-635",
          "name": "第 71 个弟子",
          "x": 92,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou071.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou071.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou071.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第71个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 92,
              "y": 114
            }
          }
        },
        {
          "id": "1021-136-124-605",
          "name": "第 61 个弟子",
          "x": 136,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou061.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou061.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou061.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第61个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 136,
              "y": 114
            }
          }
        },
        {
          "id": "1021-180-124-575",
          "name": "第 51 个弟子",
          "x": 180,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou051.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou051.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou051.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第51个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 180,
              "y": 114
            }
          }
        },
        {
          "id": "1021-224-124-545",
          "name": "第 41 个弟子",
          "x": 224,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou041.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou041.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou041.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第41个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 224,
              "y": 114
            }
          }
        },
        {
          "id": "1021-268-124-515",
          "name": "第 31 个弟子",
          "x": 268,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou031.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou031.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou031.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第31个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 268,
              "y": 114
            }
          }
        },
        {
          "id": "1021-312-124-485",
          "name": "第 21 个弟子",
          "x": 312,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou021.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou021.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou021.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第21个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 312,
              "y": 114
            }
          }
        },
        {
          "id": "1021-356-124-455",
          "name": "第 11 个弟子",
          "x": 356,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou011.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou011.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou011.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第11个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 356,
              "y": 114
            }
          }
        },
        {
          "id": "1021-400-124-425",
          "name": "第 1 个弟子",
          "x": 400,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "脚本入口：ref___data/npc/doujyou/samdou001.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "file:doujyou/samdou001.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/doujyou/samdou001.arg",
            "entype": 2,
            "enemyNos": [
              564,
              565,
              566,
              567,
              568,
              569,
              570,
              571,
              572,
              573,
              574,
              575,
              576,
              577,
              578,
              579,
              580
            ],
            "askBattleMessages": [],
            "startMessage": "我是第1个人",
            "deniedMessage": "",
            "endMessage": "",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "1021",
              "floor": 1021,
              "x": 400,
              "y": 114
            }
          }
        },
        {
          "id": "1021-10-18-723",
          "name": "跳跃点",
          "x": 10,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-54-18-693",
          "name": "跳跃点",
          "x": 54,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-98-18-663",
          "name": "跳跃点",
          "x": 98,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-142-18-633",
          "name": "跳跃点",
          "x": 142,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-186-18-603",
          "name": "跳跃点",
          "x": 186,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-230-18-573",
          "name": "跳跃点",
          "x": 230,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-274-18-543",
          "name": "跳跃点",
          "x": 274,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-318-18-513",
          "name": "跳跃点",
          "x": 318,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-362-18-483",
          "name": "跳跃点",
          "x": 362,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-406-18-453",
          "name": "跳跃点",
          "x": 406,
          "y": 18,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-10-19-724",
          "name": "跳跃点",
          "x": 10,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-54-19-694",
          "name": "跳跃点",
          "x": 54,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-98-19-664",
          "name": "跳跃点",
          "x": 98,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-142-19-634",
          "name": "跳跃点",
          "x": 142,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-186-19-604",
          "name": "跳跃点",
          "x": 186,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-230-19-574",
          "name": "跳跃点",
          "x": 230,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-274-19-544",
          "name": "跳跃点",
          "x": 274,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-318-19-514",
          "name": "跳跃点",
          "x": 318,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-362-19-484",
          "name": "跳跃点",
          "x": 362,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        },
        {
          "id": "1021-406-19-454",
          "name": "跳跃点",
          "x": 406,
          "y": 19,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/doujyou/samdou.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": "0"
        }
      ],
      "exits": []
    },
    "1040": {
      "id": "1040",
      "floorId": 1040,
      "name": "萨姆吉尔庄园",
      "mapFile": "/data/maps/1040.ls2map",
      "clientMapFile": "/data/client-maps/1040.dat",
      "clientMapSource": "公益石器时代/map/1040.dat",
      "summary": "萨姆吉尔庄园 | floor=1040 | 80x80 | ref___data/map/family/100/1040",
      "size": [
        80,
        80
      ],
      "spawn": [
        24,
        41
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1040-32-38-1389",
          "name": "通行证贩卖员",
          "x": 32,
          "y": 38,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/family/npc/familyshop1.create",
          "script": "file:family/npc/shop1_5",
          "template": "npcgen_shop",
          "graphic": "16036",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/family/npc/shop1_5",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "想要",
              "kau",
              "buy"
            ],
            "sellWords": [
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 19330,
                "name": "家族商店通行证",
                "secretName": "家族商店通行证",
                "description": "进入萨姆吉尔庄园专属商店必要的通行证明",
                "image": 24176,
                "cost": 1000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 1000
              }
            ]
          }
        },
        {
          "id": "1040-61-45-1463",
          "name": "骑乘训练师",
          "x": 61,
          "y": 45,
          "type": "Riderman",
          "dialogue": "2",
          "dialogueLines": [
            "2",
            "我是这个村子里的骑乘训练师！",
            "你想办什么吗？",
            "关于骑乘宠物",
            "查询可骑乘的宠物",
            "学习骑乘宠物",
            "你要参加那一种课程呢？",
            "初级班 (能骑乘 Lv40 以下的宠物)"
          ],
          "source": "ref___data/npc/family/riderman.create",
          "script": "conff:family/riderman.conf",
          "template": "riderman",
          "graphic": "16017"
        },
        {
          "id": "1040-48-25-4149",
          "name": "家族召唤员",
          "x": 48,
          "y": 25,
          "type": "FMPKCallMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_1040_48_25",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family.create",
          "script": "file:genout/wpm_1040_48_25",
          "template": "npcgen_fmpkcallman",
          "graphic": "16206",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "1040",
              "floor": 1040,
              "x": 47,
              "y": 25
            },
            "free": "",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "",
            "payMessage": "",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_1040_48_25"
          }
        },
        {
          "id": "1040-47-29-1467",
          "name": "踢馆登记人",
          "x": 47,
          "y": 29,
          "type": "ManorSman",
          "dialogue": "脚本入口：ref___data/npc/family/manorsman.arg1",
          "dialogueLines": [],
          "source": "ref___data/npc/family/scheduleman.create",
          "script": "file:family/manorsman.arg1",
          "template": "manorsman",
          "graphic": "16061"
        },
        {
          "id": "1040-28-43-4150",
          "name": "看板",
          "x": 28,
          "y": 43,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_1040_28_43",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family.create",
          "script": "file:genout/signb_1040_28_43",
          "template": "npcgen_signboard",
          "graphic": "10060"
        },
        {
          "id": "1040-23-20-1244",
          "name": "驯兽机暴",
          "x": 23,
          "y": 20,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/eden3/rider.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/eden3/rider.create",
          "script": "file:eden3/rider.arg",
          "template": "npcgen_warpman",
          "graphic": "100374"
        },
        {
          "id": "1040-47-23-4147",
          "name": "家族对战向导",
          "x": 47,
          "y": 23,
          "type": "FMWarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_1040_47_23",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family.create",
          "script": "file:genout/wpm_1040_47_23",
          "template": "npcgen_fmwarpman",
          "graphic": "16203"
        },
        {
          "id": "1040-28-32-1390",
          "name": "商店警卫",
          "x": 28,
          "y": 32,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/family/npc/wpm1_2",
          "dialogueLines": [],
          "source": "ref___data/npc/family/npc/familyshop1.create",
          "script": "file:family/npc/wpm1_2",
          "template": "npcgen_warpman",
          "graphic": "16128",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "1046",
              "floor": 1046,
              "x": 5,
              "y": 11
            },
            "free": "ITEM=19330",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "我是商店警卫！你要进入吗？",
            "payMessage": "我是商店警卫！你要进入吗？ 进入前请您确认身上拥有通行证，除非您是拥有该庄园的家族成员。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/family/npc/wpm1_2"
          }
        },
        {
          "id": "1040-59-37-1388",
          "name": "家族守门员",
          "x": 59,
          "y": 37,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/family/npc/wpm1_1",
          "dialogueLines": [],
          "source": "ref___data/npc/family/npc/familyshop1.create",
          "script": "file:family/npc/wpm1_1",
          "template": "npcgen_warpman",
          "graphic": "16207",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "1041",
              "floor": 1041,
              "x": 0,
              "y": 10
            },
            "free": "ITEM=19001",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "我是家族守护警卫！这里是族长的家，你要进入吗？",
            "payMessage": "这里是族长的家，想通过这里见族长，身分必须是家族正式成员或拥有邀请函才可进入。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/family/npc/wpm1_1"
          }
        },
        {
          "id": "1040-61-43-7436",
          "name": "虎的训练师",
          "x": 61,
          "y": 43,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/newbie/m_tiger",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/newbie/tiger.create",
          "script": "file:sa60/newbie/m_tiger",
          "template": "npcgen_warpman",
          "graphic": "16354"
        },
        {
          "id": "1040-25-53-1392",
          "name": "商店警卫",
          "x": 25,
          "y": 53,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/family/npc/wpm1_4",
          "dialogueLines": [],
          "source": "ref___data/npc/family/npc/familyshop1.create",
          "script": "file:family/npc/wpm1_4",
          "template": "npcgen_warpman",
          "graphic": "16127",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "1045",
              "floor": 1045,
              "x": 6,
              "y": 11
            },
            "free": "LV>0&MANOR=0",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "我是商店警卫！你要进入吗？",
            "payMessage": "我是商店警卫！你要进入吗？ 进入前请您确认您是拥有该庄园的家族成员。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/family/npc/wpm1_4"
          }
        },
        {
          "id": "1040-35-58-1391",
          "name": "商店警卫",
          "x": 35,
          "y": 58,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/family/npc/wpm1_3",
          "dialogueLines": [],
          "source": "ref___data/npc/family/npc/familyshop1.create",
          "script": "file:family/npc/wpm1_3",
          "template": "npcgen_warpman",
          "graphic": "16120",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "1047",
              "floor": 1047,
              "x": 0,
              "y": 7
            },
            "free": "ITEM=19330",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "我是商店警卫！你要进入吗？",
            "payMessage": "我是商店警卫！你要进入吗？ 进入前请您确认身上拥有通行证，除非您是拥有该庄园的家族成员。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/family/npc/wpm1_3"
          }
        },
        {
          "id": "1040-59-25-4226",
          "name": "Warp",
          "x": 59,
          "y": 25,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1040-60-25-4228",
          "name": "Warp",
          "x": 60,
          "y": 25,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1040-23-41-4219",
          "name": "Warp",
          "x": 23,
          "y": 41,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1040-23-42-4220",
          "name": "Warp",
          "x": 23,
          "y": 42,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1040-23-43-4221",
          "name": "Warp",
          "x": 23,
          "y": 43,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1040-23-44-4222",
          "name": "Warp",
          "x": 23,
          "y": 44,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1040-23-45-4223",
          "name": "Warp",
          "x": 23,
          "y": 45,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1040-51-56-4238",
          "name": "Warp",
          "x": 51,
          "y": 56,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1040-51-57-4240",
          "name": "Warp",
          "x": 51,
          "y": 57,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (606,563) | 入口 5 格 (23,41)-(23,45)",
          "to": "100",
          "x": 23,
          "y": 43,
          "bounds": [
            23,
            41,
            23,
            45
          ],
          "target": [
            606,
            563
          ],
          "tiles": [
            {
              "x": 23,
              "y": 41,
              "target": [
                606,
                561
              ]
            },
            {
              "x": 23,
              "y": 42,
              "target": [
                606,
                562
              ]
            },
            {
              "x": 23,
              "y": 43,
              "target": [
                606,
                563
              ]
            },
            {
              "x": 23,
              "y": 44,
              "target": [
                606,
                564
              ]
            },
            {
              "x": 23,
              "y": 45,
              "target": [
                606,
                565
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1043-1",
          "label": "去 萨姆吉尔庄园聊天柜台",
          "detail": "萨姆吉尔庄园聊天柜台 | floor 1043 | 目标 (5,11) | 入口 2 格 (59,25)-(60,25)",
          "to": "1043",
          "x": 60,
          "y": 25,
          "bounds": [
            59,
            25,
            60,
            25
          ],
          "target": [
            5,
            11
          ],
          "tiles": [
            {
              "x": 59,
              "y": 25,
              "target": [
                4,
                11
              ]
            },
            {
              "x": 60,
              "y": 25,
              "target": [
                5,
                11
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "1048-2",
          "label": "去 庄园素材贩售店|0",
          "detail": "庄园素材贩售店|0 | floor 1048 | 目标 (0,7) | 入口 2 格 (51,56)-(51,57)",
          "to": "1048",
          "x": 51,
          "y": 57,
          "bounds": [
            51,
            56,
            51,
            57
          ],
          "target": [
            0,
            7
          ],
          "tiles": [
            {
              "x": 51,
              "y": 56,
              "target": [
                0,
                6
              ]
            },
            {
              "x": 51,
              "y": 57,
              "target": [
                0,
                7
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1043": {
      "id": "1043",
      "floorId": 1043,
      "name": "萨姆吉尔庄园聊天柜台",
      "mapFile": "/data/maps/1043.ls2map",
      "clientMapFile": "/data/client-maps/1043.dat",
      "clientMapSource": "公益石器时代/map/1043.dat",
      "summary": "萨姆吉尔庄园聊天柜台 | floor=1043 | 12x12 | ref___data/map/family/100/1043",
      "size": [
        12,
        12
      ],
      "spawn": [
        4,
        11
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1043-4-3-4146",
          "name": "家族守门员",
          "x": 4,
          "y": 3,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_1043_4_3",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family.create",
          "script": "file:genout/wpm_1043_4_3",
          "template": "npcgen_warpman",
          "graphic": "16203",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "1044",
              "floor": 1044,
              "x": 16,
              "y": 30
            },
            "free": "ITEM=19001",
            "money": "",
            "cost": null,
            "deleteItems": [
              19001
            ],
            "freeMessage": "我是家族守护警卫！你要进入吗？",
            "payMessage": "我是商店警卫！你要进入吗？ 进入前请您确认身上拥有通行证，除非您是拥有该庄园的家族成员。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_1043_4_3"
          }
        },
        {
          "id": "1043-4-11-4227",
          "name": "Warp",
          "x": 4,
          "y": 11,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1043-5-11-4229",
          "name": "Warp",
          "x": 5,
          "y": 11,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1040-0",
          "label": "去 萨姆吉尔庄园",
          "detail": "萨姆吉尔庄园 | floor 1040 | 目标 (60,25) | 入口 2 格 (4,11)-(5,11)",
          "to": "1040",
          "x": 5,
          "y": 11,
          "bounds": [
            4,
            11,
            5,
            11
          ],
          "target": [
            60,
            25
          ],
          "tiles": [
            {
              "x": 4,
              "y": 11,
              "target": [
                59,
                25
              ]
            },
            {
              "x": 5,
              "y": 11,
              "target": [
                60,
                25
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1048": {
      "id": "1048",
      "floorId": 1048,
      "name": "庄园素材贩售店|0",
      "mapFile": "/data/maps/1048.ls2map",
      "clientMapFile": "/data/client-maps/1048.dat",
      "clientMapSource": "公益石器时代/map/1048.dat",
      "summary": "庄园素材贩售店|0 | floor=1048 | 12x12 | ref___data/map/family/100/1048",
      "size": [
        12,
        12
      ],
      "spawn": [
        0,
        6
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1048-6-6-1385",
          "name": "贩卖服务员",
          "x": 6,
          "y": 6,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/family/npc/familyshop1.create",
          "script": "file:family/npc/shop1_2",
          "template": "npcgen_shop",
          "graphic": "16033",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/family/npc/shop1_2",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "想要",
              "kau",
              "buy"
            ],
            "sellWords": [
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 11859,
                "name": "龙之爪",
                "secretName": "龙之爪",
                "description": "爪的成分 10",
                "image": 24109,
                "cost": 24750,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 24750
              },
              {
                "id": 13079,
                "name": "最强之爪",
                "secretName": "最强之爪",
                "description": "爪的成分 11",
                "image": 23905,
                "cost": 31000,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 31000
              }
            ]
          }
        },
        {
          "id": "1048-0-6-4239",
          "name": "Warp",
          "x": 0,
          "y": 6,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1048-0-7-4241",
          "name": "Warp",
          "x": 0,
          "y": 7,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "1040-0",
          "label": "去 萨姆吉尔庄园",
          "detail": "萨姆吉尔庄园 | floor 1040 | 目标 (51,57) | 入口 2 格 (0,6)-(0,7)",
          "to": "1040",
          "x": 0,
          "y": 7,
          "bounds": [
            0,
            6,
            0,
            7
          ],
          "target": [
            51,
            57
          ],
          "tiles": [
            {
              "x": 0,
              "y": 6,
              "target": [
                51,
                56
              ]
            },
            {
              "x": 0,
              "y": 7,
              "target": [
                51,
                57
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1100": {
      "id": "1100",
      "floorId": 1100,
      "name": "柯奥村�",
      "mapFile": "/data/maps/1100.ls2map",
      "clientMapFile": "/data/client-maps/1100.dat",
      "clientMapSource": "公益石器时代/map/1100.dat",
      "summary": "柯奥村� | floor=1100 | 130x150 | ref___data/map/sainasu/kuo/kuomura",
      "size": [
        130,
        150
      ],
      "spawn": [
        63,
        35
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1100-59-49-5810",
          "name": "特产品贩卖员",
          "x": 59,
          "y": 49,
          "type": "ItemShop",
          "dialogue": "欢迎光临",
          "dialogueLines": [
            "欢迎光临"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1100_59_49",
          "template": "npcgen_shop",
          "graphic": "16068",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1100_59_49",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临",
            "items": [
              {
                "id": 12093,
                "name": "柯奥产的红萝卜",
                "secretName": "柯奥产的红萝卜",
                "description": "红萝卜4",
                "image": 24238,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12097,
                "name": "柯奥产的青椒",
                "secretName": "柯奥产的青椒",
                "description": "青椒4",
                "image": 24093,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12105,
                "name": "柯奥产的茄子",
                "secretName": "柯奥产的茄子",
                "description": "茄子4",
                "image": 24237,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12109,
                "name": "柯奥产的包心菜",
                "secretName": "柯奥产的包心菜",
                "description": "包心菜4",
                "image": 24235,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12145,
                "name": "柯奥产的米",
                "secretName": "柯奥产的米",
                "description": "米4",
                "image": 24276,
                "cost": 40,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 40
              },
              {
                "id": 12225,
                "name": "柯奥产的白菜",
                "secretName": "柯奥产的白菜",
                "description": "白菜4",
                "image": 24560,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              }
            ]
          }
        },
        {
          "id": "1100-86-107-5724",
          "name": "贩卖通行证",
          "x": 86,
          "y": 107,
          "type": "ItemShop",
          "dialogue": "欢迎光临",
          "dialogueLines": [
            "欢迎光临"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1100_86_107",
          "template": "npcgen_shop",
          "graphic": "16018",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1100_86_107",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临",
            "items": [
              {
                "id": 2422,
                "name": "通行证",
                "secretName": "通行证",
                "description": "海底通路的通行许可证",
                "image": 24222,
                "cost": 200,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 200
              }
            ]
          }
        },
        {
          "id": "1100-59-63-7485",
          "name": "九兄弟之一",
          "x": 59,
          "y": 63,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality4.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality4.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "你的打架技巧不错喔！",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "1100-60-80-7492",
          "name": "九兄弟之一",
          "x": 60,
          "y": 80,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality11.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality11.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "你还真强啊！什么时候再来切磋切磋一下。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "1100-44-31-7562",
          "name": "梅尔吉",
          "x": 44,
          "y": 31,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/risk/risk1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/risk/risk.create",
          "script": "file:sa70/risk/risk1.arg",
          "template": "changeevent",
          "graphic": "16092"
        },
        {
          "id": "1100-78-55-7415",
          "name": "伊芙丽",
          "x": 78,
          "y": 55,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/gift/gift1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/gift/gift.create",
          "script": "file:sa60/gift/gift1.arg",
          "template": "changeevent",
          "graphic": "16030"
        },
        {
          "id": "1100-98-76-7679",
          "name": "检查员(C-2)",
          "x": 98,
          "y": 76,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_2c",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_2c",
          "template": "changeevent",
          "graphic": "16067"
        },
        {
          "id": "1100-50-91-6118",
          "name": "柯奥的储存点",
          "x": 50,
          "y": 91,
          "type": "SavePoint",
          "dialogue": "脚本入口：ref___data/npc/genout/sp_1100_50_91",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/sp.create",
          "script": "file:genout/sp_1100_50_91",
          "template": "npcgen_savepoint",
          "graphic": "10048"
        },
        {
          "id": "1100-86-99-7654",
          "name": "关怀老人的年轻人",
          "x": 86,
          "y": 99,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/event13_2",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/event13n.create",
          "script": "file:sainasu/event/event13_2",
          "template": "changeevent",
          "graphic": "16048"
        },
        {
          "id": "1100-68-36-1661",
          "name": "村庄小姑娘",
          "x": 68,
          "y": 36,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1100_68_36",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "file:genout/msg_1100_68_36",
          "template": "npcgen_man",
          "graphic": "16030"
        },
        {
          "id": "1100-50-51-1666",
          "name": "村庄老人",
          "x": 50,
          "y": 51,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1100_50_51",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "file:genout/msg_1100_50_51",
          "template": "npcgen_man",
          "graphic": "16001"
        },
        {
          "id": "1100-79-56-1665",
          "name": "村庄小姑娘",
          "x": 79,
          "y": 56,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1100_79_56",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "file:genout/msg_1100_79_56",
          "template": "npcgen_man",
          "graphic": "16033"
        },
        {
          "id": "1100-97-62-1667",
          "name": "村庄青年",
          "x": 97,
          "y": 62,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1100_97_62",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "file:genout/msg_1100_97_62",
          "template": "npcgen_man",
          "graphic": "16202"
        },
        {
          "id": "1100-99-77-5265",
          "name": "看板",
          "x": 99,
          "y": 77,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_1100_99_77",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_1100_99_77",
          "template": "npcgen_signboard",
          "graphic": "10062"
        },
        {
          "id": "1100-78-87-1671",
          "name": "柯奥的传言板",
          "x": 78,
          "y": 87,
          "type": "Dengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "npcgen_dengon",
          "template": "npcgen_dengon",
          "graphic": "10062"
        },
        {
          "id": "1100-53-95-1669",
          "name": "警卫人员",
          "x": 53,
          "y": 95,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1100_53_95",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "file:genout/msg_1100_53_95",
          "template": "npcgen_man",
          "graphic": "16204"
        },
        {
          "id": "1100-56-95-1670",
          "name": "警卫人员",
          "x": 56,
          "y": 95,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1100_56_95",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "file:genout/msg_1100_56_95",
          "template": "npcgen_man",
          "graphic": "16204"
        },
        {
          "id": "1100-65-108-1664",
          "name": "乌力斯坦",
          "x": 65,
          "y": 108,
          "type": "TownPeople",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "npcgen_man",
          "template": "npcgen_man",
          "graphic": "100252"
        },
        {
          "id": "1100-66-108-1663",
          "name": "青年",
          "x": 66,
          "y": 108,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1100_66_108",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "file:genout/msg_1100_66_108",
          "template": "npcgen_man",
          "graphic": "16056"
        },
        {
          "id": "1100-56-111-1662",
          "name": "村庄女孩",
          "x": 56,
          "y": 111,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1100_56_111",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1100npc_m.create",
          "script": "file:genout/msg_1100_56_111",
          "template": "npcgen_man",
          "graphic": "16036"
        },
        {
          "id": "1100-63-34-1564",
          "name": "Warp",
          "x": 63,
          "y": 34,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-64-34-1565",
          "name": "Warp",
          "x": 64,
          "y": 34,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-65-34-1566",
          "name": "Warp",
          "x": 65,
          "y": 34,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-66-34-1567",
          "name": "Warp",
          "x": 66,
          "y": 34,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-67-34-1568",
          "name": "Warp",
          "x": 67,
          "y": 34,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-96-62-2320",
          "name": "Warp",
          "x": 96,
          "y": 62,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-52-72-6385",
          "name": "Warp",
          "x": 52,
          "y": 72,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-68-77-6390",
          "name": "Warp",
          "x": 68,
          "y": 77,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-69-77-6388",
          "name": "Warp",
          "x": 69,
          "y": 77,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-88-79-6402",
          "name": "Warp",
          "x": 88,
          "y": 79,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-88-80-6400",
          "name": "Warp",
          "x": 88,
          "y": 80,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-54-93-6406",
          "name": "Warp",
          "x": 54,
          "y": 93,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-55-93-6404",
          "name": "Warp",
          "x": 55,
          "y": 93,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-68-97-6396",
          "name": "Warp",
          "x": 68,
          "y": 97,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-69-97-6398",
          "name": "Warp",
          "x": 69,
          "y": 97,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-61-109-6392",
          "name": "Warp",
          "x": 61,
          "y": 109,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-62-109-6394",
          "name": "Warp",
          "x": 62,
          "y": 109,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-82-112-6408",
          "name": "Warp",
          "x": 82,
          "y": 112,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1100-82-113-6410",
          "name": "Warp",
          "x": 82,
          "y": 113,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (472,630) | 入口 5 格 (63,34)-(67,34)",
          "to": "100",
          "x": 65,
          "y": 34,
          "bounds": [
            63,
            34,
            67,
            34
          ],
          "target": [
            472,
            630
          ],
          "tiles": [
            {
              "x": 63,
              "y": 34,
              "target": [
                470,
                630
              ]
            },
            {
              "x": 64,
              "y": 34,
              "target": [
                471,
                630
              ]
            },
            {
              "x": 65,
              "y": 34,
              "target": [
                472,
                630
              ]
            },
            {
              "x": 66,
              "y": 34,
              "target": [
                473,
                630
              ]
            },
            {
              "x": 67,
              "y": 34,
              "target": [
                474,
                630
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1300": {
      "id": "1300",
      "floorId": 1300,
      "name": "霍特尔村�",
      "mapFile": "/data/maps/1300.ls2map",
      "clientMapFile": "/data/client-maps/1300.dat",
      "clientMapSource": "公益石器时代/map/1300.dat",
      "summary": "霍特尔村� | floor=1300 | 100x100 | ref___data/map/sainasu/hotoru/hotoru",
      "size": [
        100,
        100
      ],
      "spawn": [
        24,
        59
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1300-37-26-1707",
          "name": "村庄小姑娘",
          "x": 37,
          "y": 26,
          "type": "TimeMan",
          "dialogue": "阳光太强对肌肤不好。所以我才躲在树下。",
          "dialogueLines": [
            "阳光太强对肌肤不好。所以我才躲在树下。",
            "这的岛的南边好像有迷宫哦。"
          ],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/tman_1300_37_26",
          "template": "npcgen_timeman",
          "graphic": "16033"
        },
        {
          "id": "1300-37-26-1709",
          "name": "村中少女",
          "x": 37,
          "y": 26,
          "type": "TimeMan",
          "dialogue": "阳光太强对肌肤不好。所以我才躲在树下。",
          "dialogueLines": [
            "阳光太强对肌肤不好。所以我才躲在树下。",
            "这的岛的南边好像有迷宫哦。"
          ],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/tman_1300_37_26",
          "template": "npcgen_timeman",
          "graphic": "16033"
        },
        {
          "id": "1300-56-55-5811",
          "name": "特产品贩卖员",
          "x": 56,
          "y": 55,
          "type": "ItemShop",
          "dialogue": "欢迎光临",
          "dialogueLines": [
            "欢迎光临"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_1300_56_55",
          "template": "npcgen_shop",
          "graphic": "16067",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1300_56_55",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临",
            "items": [
              {
                "id": 12113,
                "name": "霍特尔产的葱",
                "secretName": "霍特尔产的葱",
                "description": "葱4",
                "image": 24239,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12117,
                "name": "霍特尔产的大蒜",
                "secretName": "霍特尔产的大蒜",
                "description": "大蒜4",
                "image": 24096,
                "cost": 80,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 80
              },
              {
                "id": 12121,
                "name": "霍特尔产的豆子",
                "secretName": "霍特尔产的豆子",
                "description": "豆子4",
                "image": 24095,
                "cost": 30,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 30
              },
              {
                "id": 12133,
                "name": "霍特尔产的马铃薯",
                "secretName": "霍特尔产的马铃薯",
                "description": "马铃薯4",
                "image": 24192,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              },
              {
                "id": 12137,
                "name": "霍特尔产的地瓜",
                "secretName": "霍特尔产的地瓜",
                "description": "地瓜4",
                "image": 24286,
                "cost": 25,
                "type": 20,
                "useField": 1,
                "target": 0,
                "level": 0,
                "price": 25
              }
            ]
          }
        },
        {
          "id": "1300-39-26-7484",
          "name": "九兄弟之一",
          "x": 39,
          "y": 26,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality3.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality3.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "你还真强啊！什么时候再来切磋切磋一下。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "1300-54-80-7490",
          "name": "九兄弟之一",
          "x": 54,
          "y": 80,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality9.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality9.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "哇！你真的好强喔！",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "1300-29-23-6120",
          "name": "霍特尔的储存点",
          "x": 29,
          "y": 23,
          "type": "SavePoint",
          "dialogue": "脚本入口：ref___data/npc/genout/sp_1300_29_23",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/sp.create",
          "script": "file:genout/sp_1300_29_23",
          "template": "npcgen_savepoint",
          "graphic": "10048"
        },
        {
          "id": "1300-65-26-7686",
          "name": "检查员(C-9)",
          "x": 65,
          "y": 26,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_9c",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_9c",
          "template": "changeevent",
          "graphic": "16068"
        },
        {
          "id": "1300-18-42-7648",
          "name": "马提",
          "x": 18,
          "y": 42,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/event03_1",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/event03.create",
          "script": "file:sainasu/event/event03_1",
          "template": "changeevent",
          "graphic": "16048"
        },
        {
          "id": "1300-62-44-7563",
          "name": "契雷多",
          "x": 62,
          "y": 44,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/romance/romance1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/romance/romance.create",
          "script": "file:sa70/romance/romance1.arg",
          "template": "changeevent",
          "graphic": "16048"
        },
        {
          "id": "1300-70-51-1289",
          "name": "马祖",
          "x": 70,
          "y": 51,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/extra/event/marju",
          "dialogueLines": [],
          "source": "ref___data/npc/extra/event/marju.create",
          "script": "file:extra/event/marju",
          "template": "changeevent",
          "graphic": "16046"
        },
        {
          "id": "1300-65-65-7650",
          "name": "村姑",
          "x": 65,
          "y": 65,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/event10",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/event09-12.create",
          "script": "file:sainasu/event/event10",
          "template": "changeevent",
          "graphic": "16206"
        },
        {
          "id": "1300-66-26-5272",
          "name": "看板",
          "x": 66,
          "y": 26,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_1300_66_26",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_1300_66_26",
          "template": "npcgen_signboard",
          "graphic": "10063"
        },
        {
          "id": "1300-51-27-1714",
          "name": "警卫",
          "x": 51,
          "y": 27,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1300_51_27",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_51_27",
          "template": "npcgen_man",
          "graphic": "16203"
        },
        {
          "id": "1300-54-27-1713",
          "name": "警卫",
          "x": 54,
          "y": 27,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1300_54_27",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_54_27",
          "template": "npcgen_man",
          "graphic": "16202"
        },
        {
          "id": "1300-67-28-1708",
          "name": "村庄青年",
          "x": 67,
          "y": 28,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1300_67_28",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_67_28",
          "template": "npcgen_man",
          "graphic": "16046"
        },
        {
          "id": "1300-25-50-1705",
          "name": "村庄青年",
          "x": 25,
          "y": 50,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1300_25_50",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_25_50",
          "template": "npcgen_man",
          "graphic": "16049"
        },
        {
          "id": "1300-39-51-1715",
          "name": "霍特尔的传言板",
          "x": 39,
          "y": 51,
          "type": "Dengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "npcgen_dengon",
          "template": "npcgen_dengon",
          "graphic": "10063"
        },
        {
          "id": "1300-70-51-1704",
          "name": "村庄青年",
          "x": 70,
          "y": 51,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1300_70_51",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_70_51",
          "template": "npcgen_man",
          "graphic": "16046"
        },
        {
          "id": "1300-29-57-1703",
          "name": "村庄小姑娘",
          "x": 29,
          "y": 57,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1300_29_57",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_29_57",
          "template": "npcgen_man",
          "graphic": "16065"
        },
        {
          "id": "1300-35-60-1706",
          "name": "卡坦的商人",
          "x": 35,
          "y": 60,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1300_35_60",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_35_60",
          "template": "npcgen_man",
          "graphic": "16018"
        },
        {
          "id": "1300-38-68-1711",
          "name": "村庄少年",
          "x": 38,
          "y": 68,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1300_38_68",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_38_68",
          "template": "npcgen_man",
          "graphic": "16049"
        },
        {
          "id": "1300-40-69-1710",
          "name": "村庄少年",
          "x": 40,
          "y": 69,
          "type": "TownPeople",
          "dialogue": "脚本入口：file:genout/msg_1300_40_69",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_40_69",
          "template": "npcgen_man",
          "graphic": "16046"
        },
        {
          "id": "1300-40-71-1712",
          "name": "村庄少女",
          "x": 40,
          "y": 71,
          "type": "TownPeople",
          "dialogue": "脚本入口：file:genout/msg_1300_40_71",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1300npc_m.create",
          "script": "file:genout/msg_1300_40_71",
          "template": "npcgen_man",
          "graphic": "16033"
        },
        {
          "id": "1300-52-26-6434",
          "name": "Warp",
          "x": 52,
          "y": 26,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-53-26-6432",
          "name": "Warp",
          "x": 53,
          "y": 26,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-54-26-6436",
          "name": "Warp",
          "x": 54,
          "y": 26,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-33-42-6418",
          "name": "Warp",
          "x": 33,
          "y": 42,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-34-42-6416",
          "name": "Warp",
          "x": 34,
          "y": 42,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-66-42-6424",
          "name": "Warp",
          "x": 66,
          "y": 42,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-67-42-6426",
          "name": "Warp",
          "x": 67,
          "y": 42,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-23-43-6420",
          "name": "Warp",
          "x": 23,
          "y": 43,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-24-43-6422",
          "name": "Warp",
          "x": 24,
          "y": 43,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-43-43-6412",
          "name": "Warp",
          "x": 43,
          "y": 43,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-44-43-6414",
          "name": "Warp",
          "x": 44,
          "y": 43,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-68-44-6438",
          "name": "Warp",
          "x": 68,
          "y": 44,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-68-45-6440",
          "name": "Warp",
          "x": 68,
          "y": 45,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-54-49-6430",
          "name": "Warp",
          "x": 54,
          "y": 49,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-54-50-6428",
          "name": "Warp",
          "x": 54,
          "y": 50,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-23-59-1577",
          "name": "Warp",
          "x": 23,
          "y": 59,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-23-60-1578",
          "name": "Warp",
          "x": 23,
          "y": 60,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-23-61-1579",
          "name": "Warp",
          "x": 23,
          "y": 61,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-23-62-1580",
          "name": "Warp",
          "x": 23,
          "y": 62,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-23-63-1581",
          "name": "Warp",
          "x": 23,
          "y": 63,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-23-64-1582",
          "name": "Warp",
          "x": 23,
          "y": 64,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-23-65-1583",
          "name": "Warp",
          "x": 23,
          "y": 65,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1300-23-66-1584",
          "name": "Warp",
          "x": 23,
          "y": 66,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (621,194) | 入口 8 格 (23,59)-(23,66)",
          "to": "100",
          "x": 23,
          "y": 63,
          "bounds": [
            23,
            59,
            23,
            66
          ],
          "target": [
            621,
            194
          ],
          "tiles": [
            {
              "x": 23,
              "y": 59,
              "target": [
                621,
                190
              ]
            },
            {
              "x": 23,
              "y": 60,
              "target": [
                621,
                191
              ]
            },
            {
              "x": 23,
              "y": 61,
              "target": [
                621,
                192
              ]
            },
            {
              "x": 23,
              "y": 62,
              "target": [
                621,
                193
              ]
            },
            {
              "x": 23,
              "y": 63,
              "target": [
                621,
                194
              ]
            },
            {
              "x": 23,
              "y": 64,
              "target": [
                621,
                195
              ]
            },
            {
              "x": 23,
              "y": 65,
              "target": [
                621,
                196
              ]
            },
            {
              "x": 23,
              "y": 66,
              "target": [
                621,
                197
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "1400": {
      "id": "1400",
      "floorId": 1400,
      "name": "卡坦村温�",
      "mapFile": "/data/maps/1400.ls2map",
      "clientMapFile": "/data/client-maps/1400.dat",
      "clientMapSource": "公益石器时代/map/1400.dat",
      "summary": "卡坦村温� | floor=1400 | 150x150 | ref___data/map/sainasu/katan/katan",
      "size": [
        150,
        150
      ],
      "spawn": [
        70,
        115
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "1400-75-102-5982",
          "name": "少女",
          "x": 75,
          "y": 102,
          "type": "ItemShop",
          "dialogue": "我有卖很神奇的东西喔！",
          "dialogueLines": [
            "我有卖很神奇的东西喔！"
          ],
          "source": "ref___data/npc/genout/shop_nuke1.create",
          "script": "file:genout/ss_1400_75_102",
          "template": "npcgen_shop",
          "graphic": "16067",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_1400_75_102",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "我有卖很神奇的东西喔！",
            "items": [
              {
                "id": 13070,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至卡坦村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 2000
              }
            ]
          }
        },
        {
          "id": "1400-85-69-7491",
          "name": "九兄弟之一",
          "x": 85,
          "y": 69,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality10.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality10.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "呜！别在打我了喔！下次我可不客气了！",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "1400-83-87-7486",
          "name": "九兄弟之一",
          "x": 83,
          "y": 87,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality5.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality5.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "哇！你真的好强喔！",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "1400-94-73-7587",
          "name": "迪克",
          "x": 94,
          "y": 73,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/true/true1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/true/true.create",
          "script": "file:sa70/true/true1.arg",
          "template": "changeevent",
          "graphic": "16047"
        },
        {
          "id": "1400-71-76-7651",
          "name": "卡坦的年轻人",
          "x": 71,
          "y": 76,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/event11",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/event09-12.create",
          "script": "file:sainasu/event/event11",
          "template": "changeevent",
          "graphic": "16203"
        },
        {
          "id": "1400-95-81-7416",
          "name": "多吉尔",
          "x": 95,
          "y": 81,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/gift/gift2.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/gift/gift.create",
          "script": "file:sa60/gift/gift2.arg",
          "template": "changeevent",
          "graphic": "16049"
        },
        {
          "id": "1400-110-81-7689",
          "name": "检查员(C-12)",
          "x": 110,
          "y": 81,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_12c",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_12c",
          "template": "changeevent",
          "graphic": "16067"
        },
        {
          "id": "1400-69-89-7647",
          "name": "亚姆亚姆",
          "x": 69,
          "y": 89,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/event03_2",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/event03.create",
          "script": "file:sainasu/event/event03_2",
          "template": "changeevent",
          "graphic": "16057"
        },
        {
          "id": "1400-76-104-6121",
          "name": "卡坦的储存点",
          "x": 76,
          "y": 104,
          "type": "SavePoint",
          "dialogue": "脚本入口：ref___data/npc/genout/sp_1400_76_104",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/sp.create",
          "script": "file:genout/sp_1400_76_104",
          "template": "npcgen_savepoint",
          "graphic": "10048"
        },
        {
          "id": "1400-98-104-7414",
          "name": "塔可登",
          "x": 98,
          "y": 104,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/desert/desert1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/desert/desert.create",
          "script": "file:sa60/desert/desert1.arg",
          "template": "changeevent",
          "graphic": "16103"
        },
        {
          "id": "1400-78-70-1726",
          "name": "看板",
          "x": 78,
          "y": 70,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_1400_78_70",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/signb_1400_78_70",
          "template": "npcgen_signboard",
          "graphic": "10096"
        },
        {
          "id": "1400-81-71-1722",
          "name": "村庄青年",
          "x": 81,
          "y": 71,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1400_81_71",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_81_71",
          "template": "npcgen_man",
          "graphic": "16046"
        },
        {
          "id": "1400-110-82-5275",
          "name": "看板",
          "x": 110,
          "y": 82,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_1400_110_82",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_1400_110_82",
          "template": "npcgen_signboard",
          "graphic": "10062"
        },
        {
          "id": "1400-78-85-1720",
          "name": "村庄孩童",
          "x": 78,
          "y": 85,
          "type": "TownPeople",
          "dialogue": "脚本入口：file:genout/msg_1400_78_85",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_78_85",
          "template": "npcgen_man",
          "graphic": "16007"
        },
        {
          "id": "1400-80-87-1721",
          "name": "村庄孩童",
          "x": 80,
          "y": 87,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1400_80_87",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_80_87",
          "template": "npcgen_man",
          "graphic": "16010"
        },
        {
          "id": "1400-81-93-1718",
          "name": "村民",
          "x": 81,
          "y": 93,
          "type": "TownPeople",
          "dialogue": "脚本入口：file:genout/msg_1400_81_93",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_81_93",
          "template": "npcgen_man",
          "graphic": "16017"
        },
        {
          "id": "1400-68-96-1717",
          "name": "村庄小姑娘",
          "x": 68,
          "y": 96,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1400_68_96",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_68_96",
          "template": "npcgen_man",
          "graphic": "16037"
        },
        {
          "id": "1400-78-97-1727",
          "name": "卡坦的传言板",
          "x": 78,
          "y": 97,
          "type": "Dengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "npcgen_dengon",
          "template": "npcgen_dengon",
          "graphic": "10062"
        },
        {
          "id": "1400-69-99-1724",
          "name": "村庄少年",
          "x": 69,
          "y": 99,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1400_69_99",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_69_99",
          "template": "npcgen_man",
          "graphic": "16049"
        },
        {
          "id": "1400-70-100-1723",
          "name": "村庄少年",
          "x": 70,
          "y": 100,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1400_70_100",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_70_100",
          "template": "npcgen_man",
          "graphic": "16046"
        },
        {
          "id": "1400-70-108-1719",
          "name": "村庄青年",
          "x": 70,
          "y": 108,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1400_70_108",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_70_108",
          "template": "npcgen_man",
          "graphic": "16047"
        },
        {
          "id": "1400-74-109-1716",
          "name": "村庄青年",
          "x": 74,
          "y": 109,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1400_74_109",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_74_109",
          "template": "npcgen_man",
          "graphic": "16045"
        },
        {
          "id": "1400-75-112-1725",
          "name": "村庄少女",
          "x": 75,
          "y": 112,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1400_75_112",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/msg_1400_75_112",
          "template": "npcgen_man",
          "graphic": "16033"
        },
        {
          "id": "1400-100-97-1728",
          "name": "水井的看守",
          "x": 100,
          "y": 97,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_1400_100_97",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1400npc_m.create",
          "script": "file:genout/wpm_1400_100_97",
          "template": "npcgen_warpman",
          "graphic": "16209",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "10402",
              "floor": 10402,
              "x": 25,
              "y": 19
            },
            "free": "LV>0",
            "money": "-1",
            "cost": {
              "mode": "unavailable"
            },
            "deleteItems": [],
            "freeMessage": "======水井的看守====== 这里是迷幻洞窟 等级不够的话可就危险了 就算这样也没关系吗？",
            "payMessage": "＝＝＝＝＝＝ 水井的看守 ＝＝＝＝＝＝ 这里是举行成人仪式的场所 如果等级不到３０的话，是无法成功举行仪式的。",
            "normalMessage": "",
            "moneyMessage": "＝＝＝＝＝＝ 水井的看守 ＝＝＝＝＝＝ 你还不够资格进入这里 再回去多锻炼，下回再来！",
            "partyMessage": "＝＝＝＝＝＝ 水井的看守 ＝＝＝＝＝＝ 无法参加宴会",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_1400_100_97"
          }
        },
        {
          "id": "1400-89-76-6458",
          "name": "Warp",
          "x": 89,
          "y": 76,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-90-76-6460",
          "name": "Warp",
          "x": 90,
          "y": 76,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-81-83-6442",
          "name": "Warp",
          "x": 81,
          "y": 83,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-82-83-6444",
          "name": "Warp",
          "x": 82,
          "y": 83,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-87-84-6466",
          "name": "Warp",
          "x": 87,
          "y": 84,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-87-85-6462",
          "name": "Warp",
          "x": 87,
          "y": 85,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-88-85-6464",
          "name": "Warp",
          "x": 88,
          "y": 85,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-74-89-6454",
          "name": "Warp",
          "x": 74,
          "y": 89,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-75-89-6456",
          "name": "Warp",
          "x": 75,
          "y": 89,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-90-90-6446",
          "name": "Warp",
          "x": 90,
          "y": 90,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-90-91-6448",
          "name": "Warp",
          "x": 90,
          "y": 91,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-84-97-6450",
          "name": "Warp",
          "x": 84,
          "y": 97,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-84-98-6452",
          "name": "Warp",
          "x": 84,
          "y": 98,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-70-116-1588",
          "name": "Warp",
          "x": 70,
          "y": 116,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-71-116-1589",
          "name": "Warp",
          "x": 71,
          "y": 116,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "1400-72-116-1590",
          "name": "Warp",
          "x": 72,
          "y": 116,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (259,171) | 入口 3 格 (70,116)-(72,116)",
          "to": "100",
          "x": 71,
          "y": 116,
          "bounds": [
            70,
            116,
            72,
            116
          ],
          "target": [
            259,
            171
          ],
          "tiles": [
            {
              "x": 70,
              "y": 116,
              "target": [
                258,
                171
              ]
            },
            {
              "x": 71,
              "y": 116,
              "target": [
                259,
                171
              ]
            },
            {
              "x": 72,
              "y": 116,
              "target": [
                260,
                171
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2000": {
      "id": "2000",
      "floorId": 2000,
      "name": "玛丽娜丝渔村",
      "mapFile": "/data/maps/2000.ls2map",
      "clientMapFile": "/data/client-maps/2000.dat",
      "clientMapSource": "公益石器时代/map/2000.dat",
      "summary": "玛丽娜丝渔村 | floor=2000 | 150x150 | ref___data/map/sainasu/marinasu/marinasu",
      "size": [
        150,
        150
      ],
      "spawn": [
        72,
        33
      ],
      "encounterPets": [
        1018
      ],
      "npcs": [
        {
          "id": "2000-37-29-7100",
          "name": "瑞尔亚斯的武器店店员",
          "x": 37,
          "y": 29,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/my/ruieryasi/rui_shop.create",
          "script": "file:my/ruieryasi/weapon2shop.arg",
          "template": "npcgen_shop",
          "graphic": "16990",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/my/ruieryasi/weapon2shop.arg",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "想要",
              "kau",
              "buy"
            ],
            "sellWords": [
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 1929,
                "name": "苍绿之斧3",
                "secretName": "苍绿之斧3",
                "description": "攻+120 防+45 伤+150 敏-40",
                "image": 20075,
                "cost": 84500,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 84500
              },
              {
                "id": 1942,
                "name": "苍绿之枪3",
                "secretName": "苍绿之枪3",
                "description": "攻+100 防+45 伤+130 敏-20 魅+30",
                "image": 20475,
                "cost": 78000,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 78000
              },
              {
                "id": 1943,
                "name": "苍绿之棍3",
                "secretName": "苍绿之棍3",
                "description": "攻+80 防+45 伤+110",
                "image": 20700,
                "cost": 65000,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 65000
              },
              {
                "id": 1946,
                "name": "湛蓝之斧3",
                "secretName": "湛蓝之斧3",
                "description": "攻+120 伤+150 敏-40 HP+135",
                "image": 20075,
                "cost": 84500,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 84500
              },
              {
                "id": 1947,
                "name": "湛蓝之枪3",
                "secretName": "湛蓝之枪3",
                "description": "攻+100 伤+130 敏-20 魅+30 HP+135",
                "image": 20474,
                "cost": 78000,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 78000
              },
              {
                "id": 1948,
                "name": "湛蓝之棍3",
                "secretName": "湛蓝之棍3",
                "description": "攻+80 伤+110 HP+135",
                "image": 20701,
                "cost": 65000,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 65000
              },
              {
                "id": 1951,
                "name": "焰红之斧3",
                "secretName": "焰红之斧3",
                "description": "攻+165 伤+150 敏-40",
                "image": 20075,
                "cost": 84500,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 84500
              },
              {
                "id": 1952,
                "name": "焰红之枪3",
                "secretName": "焰红之枪3",
                "description": "攻+145 伤+130 敏-20 魅+30",
                "image": 20476,
                "cost": 78000,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 78000
              },
              {
                "id": 1953,
                "name": "焰红之棍3",
                "secretName": "焰红之棍3",
                "description": "攻+125 伤+110",
                "image": 20700,
                "cost": 65000,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 65000
              },
              {
                "id": 1956,
                "name": "岚黄之斧3",
                "secretName": "岚黄之斧3",
                "description": "攻+120 伤+150 敏+5",
                "image": 20075,
                "cost": 84500,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 84500
              },
              {
                "id": 1957,
                "name": "岚黄之枪3",
                "secretName": "岚黄之枪3",
                "description": "攻+100 伤+130 敏+25 魅+30",
                "image": 20476,
                "cost": 78000,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 78000
              },
              {
                "id": 1958,
                "name": "岚黄之棍3",
                "secretName": "岚黄之棍3",
                "description": "攻+80 伤+110 敏+45",
                "image": 20701,
                "cost": 65000,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 65000
              }
            ]
          }
        },
        {
          "id": "2000-38-29-7098",
          "name": "瑞尔亚斯的防具店店员",
          "x": 38,
          "y": 29,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/my/ruieryasi/rui_shop.create",
          "script": "file:my/ruieryasi/weapon1shop.arg",
          "template": "npcgen_shop",
          "graphic": "17072",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/my/ruieryasi/weapon1shop.arg",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "想要",
              "kau",
              "buy"
            ],
            "sellWords": [
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 1944,
                "name": "苍绿之兜3",
                "secretName": "苍绿之兜3",
                "description": "防+85 敏-8 伤-70",
                "image": 21599,
                "cost": 97500,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 97500
              },
              {
                "id": 1945,
                "name": "苍绿之铠3",
                "secretName": "苍绿之铠3",
                "description": "防+125 敏-20 伤-110",
                "image": 21108,
                "cost": 97500,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 97500
              },
              {
                "id": 1949,
                "name": "湛蓝之兜3",
                "secretName": "湛蓝之兜3",
                "description": "防+40 敏-8 伤-70 HP+135",
                "image": 21597,
                "cost": 97500,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 97500
              },
              {
                "id": 1950,
                "name": "湛蓝之铠3",
                "secretName": "湛蓝之铠3",
                "description": "防+80 敏-20 伤-110 HP+135",
                "image": 21104,
                "cost": 97500,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 97500
              },
              {
                "id": 1954,
                "name": "焰红之兜3",
                "secretName": "焰红之兜3",
                "description": "攻+45 防+40 敏-8 伤-70",
                "image": 21596,
                "cost": 97500,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 97500
              },
              {
                "id": 1955,
                "name": "焰红之铠3",
                "secretName": "焰红之铠3",
                "description": "攻+45 防+80 敏-20 伤-110",
                "image": 21112,
                "cost": 97500,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 97500
              },
              {
                "id": 1959,
                "name": "岚黄之兜3",
                "secretName": "岚黄之兜3",
                "description": "防+40 敏+37 伤-70",
                "image": 21598,
                "cost": 97500,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 97500
              },
              {
                "id": 1960,
                "name": "岚黄之铠3",
                "secretName": "岚黄之铠3",
                "description": "防+80 敏+25 伤-110",
                "image": 21111,
                "cost": 97500,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 110,
                "price": 97500
              }
            ]
          }
        },
        {
          "id": "2000-72-38-1485",
          "name": "特殊训练师",
          "x": 72,
          "y": 38,
          "type": "NPC_FreePetSkill",
          "dialogue": "准备好要学技能了吗？",
          "dialogueLines": [
            "准备好要学技能了吗？"
          ],
          "source": "ref___data/npc/freeshop/freeshop01.create",
          "script": "file:freeshop/freeshop05.arg",
          "template": "FreePetSkill",
          "graphic": "16096"
        },
        {
          "id": "2000-67-62-5974",
          "name": "巫女",
          "x": 67,
          "y": 62,
          "type": "ItemShop",
          "dialogue": "我有卖很神奇的东西喔！",
          "dialogueLines": [
            "我有卖很神奇的东西喔！"
          ],
          "source": "ref___data/npc/genout/shop_nuke1.create",
          "script": "file:genout/ss_2000_67_62",
          "template": "npcgen_shop",
          "graphic": "16300",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_2000_67_62",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "我有卖很神奇的东西喔！",
            "items": [
              {
                "id": 13062,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至玛丽娜丝渔村",
                "image": 24075,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 2000
              },
              {
                "id": 13061,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至萨姆吉尔村",
                "image": 24074,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 2000
              },
              {
                "id": 13063,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至加加村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 2000
              },
              {
                "id": 13064,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至卡鲁它那村",
                "image": 24077,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 2000
              }
            ]
          }
        },
        {
          "id": "2000-71-63-7726",
          "name": "百货店商人",
          "x": 71,
          "y": 63,
          "type": "ItemShop",
          "dialogue": "PK道具，恶魔宝石。",
          "dialogueLines": [
            "PK道具，恶魔宝石。"
          ],
          "source": "ref___data/npc/scipt_plus/test2nd/test2nd.create",
          "script": "file:scipt_plus/test2nd/c_can_mm",
          "template": "npcgen_shop",
          "graphic": "16191",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/scipt_plus/test2nd/c_can_mm",
            "buyRate": 24,
            "sellRate": 0.8,
            "buyWords": [
              "hi"
            ],
            "sellWords": [],
            "mainMessage": "PK道具，恶魔宝石。",
            "items": [
              {
                "id": 20172,
                "name": "恶魔宝石LV3",
                "secretName": "恶魔宝石",
                "description": "使用後可原地遇敌 使用次数100次",
                "image": 24702,
                "cost": 0,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 0
              },
              {
                "id": 2172,
                "name": "PK用气力回复药",
                "secretName": "PK用气力回复药",
                "description": "气力60前後回复",
                "image": 23007,
                "cost": 100,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 2400
              },
              {
                "id": 2173,
                "name": "PK用耐久力回复药",
                "secretName": "PK用耐久力回复药",
                "description": "耐久力800前後回复",
                "image": 23019,
                "cost": 100,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 2400
              },
              {
                "id": 2174,
                "name": "PK用豪华船生鱼片",
                "secretName": "PK用豪华船生鱼片",
                "description": "耐500回复(我方全体) 究极生鱼片",
                "image": 24439,
                "cost": 100,
                "type": 20,
                "useField": 1,
                "target": 2,
                "level": 0,
                "price": 2400
              },
              {
                "id": 2175,
                "name": "PK用麻辣什锦火锅",
                "secretName": "PK用麻辣什锦火锅",
                "description": "沉默状态回复(全体) 超级辣的大火锅",
                "image": 24431,
                "cost": 100,
                "type": 20,
                "useField": 1,
                "target": 2,
                "level": 0,
                "price": 2400
              },
              {
                "id": 2179,
                "name": "PK用缪雷金币",
                "secretName": "PK用缪雷金币",
                "description": "魅 +5 奥萝拉的精灵",
                "image": 24221,
                "cost": 100,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 70,
                "price": 2400
              },
              {
                "id": 2180,
                "name": "PK用阿鲁帖拉金币",
                "secretName": "PK用阿鲁帖拉金币",
                "description": "魅力 +5 彩虹的精灵",
                "image": 24221,
                "cost": 100,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 65,
                "price": 2400
              },
              {
                "id": 2181,
                "name": "PK用阿萨Lv5金币",
                "secretName": "PK用阿萨Lv5金币",
                "description": "魅 +5 大地的精灵 Lv5",
                "image": 24218,
                "cost": 100,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 60,
                "price": 2400
              },
              {
                "id": 2182,
                "name": "PK用阿昆尼斯Lv5金币",
                "secretName": "PK用阿昆尼斯Lv5金币",
                "description": "魅 +5 水的精灵 Lv5",
                "image": 24217,
                "cost": 100,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 60,
                "price": 2400
              },
              {
                "id": 2183,
                "name": "PK用芙雷美雅Lv5金币",
                "secretName": "PK用芙雷美雅Lv5金币",
                "description": "魅 +5 火炎的精灵 Lv5",
                "image": 24216,
                "cost": 100,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 60,
                "price": 2400
              },
              {
                "id": 2184,
                "name": "PK用温蒂妮Lv5的金币",
                "secretName": "PK用温蒂妮Lv5的金币",
                "description": "魅力 +5 疾风的精灵 Lv5",
                "image": 24220,
                "cost": 100,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 60,
                "price": 2400
              },
              {
                "id": 2185,
                "name": "PK用西鲁菲雅Lv2护身符",
                "secretName": "PK用西鲁菲雅Lv2护身符",
                "description": "魅 +1 高等净化精灵 Lv2",
                "image": 22019,
                "cost": 100,
                "type": 15,
                "useField": 0,
                "target": 0,
                "level": 20,
                "price": 2400
              }
            ]
          }
        },
        {
          "id": "2000-71-64-7727",
          "name": "羽毛店商人",
          "x": 71,
          "y": 64,
          "type": "ItemShop",
          "dialogue": "出售各种羽毛。",
          "dialogueLines": [
            "出售各种羽毛。"
          ],
          "source": "ref___data/npc/scipt_plus/test2nd/test2nd.create",
          "script": "file:scipt_plus/test2nd/item",
          "template": "npcgen_shop",
          "graphic": "16191",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/scipt_plus/test2nd/item",
            "buyRate": 6,
            "sellRate": 0.8,
            "buyWords": [
              "hi"
            ],
            "sellWords": [],
            "mainMessage": "出售各种羽毛。",
            "items": [
              {
                "id": 13061,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至萨姆吉尔村",
                "image": 24074,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13062,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至玛丽娜丝渔村",
                "image": 24075,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13063,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至加加村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13064,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至卡鲁它那村",
                "image": 24077,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13065,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至福尔德村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13066,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至奇喀喀村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13067,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至达那村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13068,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至柯奥村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13069,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至塔姆塔姆村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13070,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至卡坦村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13071,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至乌鲁力村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13072,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至霍特尔村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13073,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至多多村",
                "image": 24076,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13088,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至玄黄洞窟洞口",
                "image": 24381,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13089,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至琉璃洞窟洞口",
                "image": 24378,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13090,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至碧青洞窟洞口",
                "image": 24379,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13091,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至漆黑洞窟洞口",
                "image": 24377,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              },
              {
                "id": 13092,
                "name": "精灵的羽毛",
                "secretName": "精灵的羽毛",
                "description": "可单人瞬间飞行至深红洞窟洞口",
                "image": 24380,
                "cost": 2000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 12000
              }
            ]
          }
        },
        {
          "id": "2000-81-85-1735",
          "name": "村民",
          "x": 81,
          "y": 85,
          "type": "TimeMan",
          "dialogue": "一到晚上就回家的也大有人在。",
          "dialogueLines": [
            "一到晚上就回家的也大有人在。"
          ],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/tman_2000_81_85",
          "template": "npcgen_timeman",
          "graphic": "16016"
        },
        {
          "id": "2000-79-89-1734",
          "name": "村庄少女",
          "x": 79,
          "y": 89,
          "type": "TimeMan",
          "dialogue": "一到黑夜就变得跟白天判若两人的人也是不少，真可怕！当然一到晚上就回家的也大有人在。",
          "dialogueLines": [
            "一到黑夜就变得跟白天判若两人的人也是不少，真可怕！当然一到晚上就回家的也大有人在。",
            "最近一位叫里奥的，喜欢玩躲迷藏的小男孩很有名哦。"
          ],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/tman_2000_79_89",
          "template": "npcgen_timeman",
          "graphic": "16033"
        },
        {
          "id": "2000-80-97-1738",
          "name": "村民",
          "x": 80,
          "y": 97,
          "type": "TimeMan",
          "dialogue": "啊～真是太忙碌了…那些小鬼头不知跑到那儿去玩了。",
          "dialogueLines": [
            "啊～真是太忙碌了…那些小鬼头不知跑到那儿去玩了。",
            "天气很晴朗衣服一定很快就晒干了。"
          ],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/tman_2000_80_97",
          "template": "npcgen_timeman",
          "graphic": "16021"
        },
        {
          "id": "2000-63-112-7725",
          "name": "走私行李的阿赖",
          "x": 63,
          "y": 112,
          "type": "ItemShop",
          "dialogue": "好吧，我是走私的。",
          "dialogueLines": [
            "好吧，我是走私的。"
          ],
          "source": "ref___data/npc/scipt_plus/postman/postmanl.create",
          "script": "file:scipt_plus/postman/sell_at_2000",
          "template": "npcgen_shop",
          "graphic": "16024",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/scipt_plus/postman/sell_at_2000",
            "buyRate": 1.334,
            "sellRate": 0.8,
            "buyWords": [
              "收货"
            ],
            "sellWords": [],
            "mainMessage": "好吧，我是走私的。",
            "items": [
              {
                "id": 2407,
                "name": "往玛丽娜丝的行李",
                "secretName": "往玛丽娜丝的行李",
                "description": "加加到玛丽娜丝的行李",
                "image": 16071,
                "cost": 75,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 100
              }
            ]
          }
        },
        {
          "id": "2000-97-78-7483",
          "name": "九兄弟之一",
          "x": 97,
          "y": 78,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality2.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality2.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "呜！别在打我了喔！下次我可不客气了！",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "2000-95-97-7489",
          "name": "九兄弟之一",
          "x": 95,
          "y": 97,
          "type": "NPCEnemy",
          "dialogue": "你想找麻烦吗！",
          "dialogueLines": [
            "你想找麻烦吗！",
            "有什么事吗？还是你要找我们家另外八个兄弟。"
          ],
          "source": "ref___data/npc/sa70/actuality/actuality.create",
          "script": "file:sa70/actuality/actuality8.arg",
          "template": "sb_dou",
          "graphic": "100037",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/sa70/actuality/actuality8.arg",
            "entype": 2,
            "enemyNos": [
              2224
            ],
            "askBattleMessages": [
              "你想找麻烦吗！"
            ],
            "startMessage": "这是你自找的，我不会手下留情的，小鬼。",
            "deniedMessage": "有什么事吗？还是你要找我们家另外八个兄弟。",
            "endMessage": "你还真强啊！什么时候再来切磋切磋一下。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "2000-66-33-7317",
          "name": "药粉提炼师",
          "x": 66,
          "y": 33,
          "type": "ItemchangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa50/alchemy/alchemyhp",
          "dialogueLines": [],
          "source": "ref___data/npc/sa50/alchemy/alchemy.create",
          "script": "file:sa50/alchemy/alchemyhp",
          "template": "ITEMCHANGE",
          "graphic": "16095"
        },
        {
          "id": "2000-77-39-7733",
          "name": "英雄战场纪念碑",
          "x": 77,
          "y": 39,
          "type": "Alldoman",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/won/syu.create",
          "script": "npc_alldoman",
          "template": "npc_alldoman",
          "graphic": "10060"
        },
        {
          "id": "2000-49-47-7041",
          "name": "愿藏的祖母",
          "x": 49,
          "y": 47,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/king/event69_7",
          "dialogueLines": [],
          "source": "ref___data/npc/king/event69_alpha.create",
          "script": "file:king/event69_7",
          "template": "changeevent",
          "graphic": "16021"
        },
        {
          "id": "2000-50-48-7037",
          "name": "愿藏的祖父",
          "x": 50,
          "y": 48,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/king/event69_3",
          "dialogueLines": [],
          "source": "ref___data/npc/king/event69_alpha.create",
          "script": "file:king/event69_3",
          "template": "changeevent",
          "graphic": "16017"
        },
        {
          "id": "2000-67-58-6122",
          "name": "玛丽那斯的储存点",
          "x": 67,
          "y": 58,
          "type": "SavePoint",
          "dialogue": "脚本入口：ref___data/npc/genout/sp_2000_67_58",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/sp.create",
          "script": "file:genout/sp_2000_67_58",
          "template": "npcgen_savepoint",
          "graphic": "10048"
        },
        {
          "id": "2000-40-63-7662",
          "name": "老人",
          "x": 40,
          "y": 63,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/nevent01_1",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/nevent.create",
          "script": "file:sainasu/event/nevent01_1",
          "template": "changeevent",
          "graphic": "16064"
        },
        {
          "id": "2000-64-77-7529",
          "name": "凯丽",
          "x": 64,
          "y": 77,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/crisis/crisis1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/crisis/crisis.create",
          "script": "file:sa70/crisis/crisis1.arg",
          "template": "changeevent",
          "graphic": "16096"
        },
        {
          "id": "2000-87-78-112",
          "name": "门票贩卖员",
          "x": 87,
          "y": 78,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/chatroom/ticket2000",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/chatroom.create",
          "script": "file:chatroom/ticket2000",
          "template": "changeevent",
          "graphic": "16014"
        },
        {
          "id": "2000-89-79-7420",
          "name": "战斗技巧指导员",
          "x": 89,
          "y": 79,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/newbie/fighter",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/newbie/newbie.create",
          "script": "file:sa60/newbie/fighter",
          "template": "changeevent",
          "graphic": "16496"
        },
        {
          "id": "2000-84-86-7409",
          "name": "博士弟子",
          "x": 84,
          "y": 86,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa50/petfusion/petfusion",
          "dialogueLines": [],
          "source": "ref___data/npc/sa50/petfusion/petfusion.create",
          "script": "file:sa50/petfusion/petfusion",
          "template": "changeevent",
          "graphic": "16091"
        },
        {
          "id": "2000-85-86-7408",
          "name": "助手",
          "x": 85,
          "y": 86,
          "type": "PetFusion",
          "dialogue": "脚本入口：ref___data/npc/sa50/petfusion/petfusion.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa50/petfusion/petfusion.create",
          "script": "file:sa50/petfusion/petfusion.arg",
          "template": "npc_petfusion",
          "graphic": "16048"
        },
        {
          "id": "2000-55-92-7645",
          "name": "弥生",
          "x": 55,
          "y": 92,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/event02_1",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/event02.create",
          "script": "file:sainasu/event/event02_1",
          "template": "changeevent",
          "graphic": "16027"
        },
        {
          "id": "2000-67-93-7528",
          "name": "史比",
          "x": 67,
          "y": 93,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/collect/collect1.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/collect/collect.create",
          "script": "file:sa70/collect/collect1.arg",
          "template": "changeevent",
          "graphic": "16056"
        },
        {
          "id": "2000-87-95-1694",
          "name": "矿石研究者",
          "x": 87,
          "y": 95,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_1200_58_43",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/1200npc_m.create",
          "script": "file:genout/msg_1200_58_43",
          "template": "changeevent",
          "graphic": "16209"
        },
        {
          "id": "2000-77-109-7663",
          "name": "钓竿专家",
          "x": 77,
          "y": 109,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/nevent01_2",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/nevent.create",
          "script": "file:sainasu/event/nevent01_2",
          "template": "changeevent",
          "graphic": "16024"
        },
        {
          "id": "2000-80-115-7681",
          "name": "检查员(C-4)",
          "x": 80,
          "y": 115,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_4c",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_4c",
          "template": "changeevent",
          "graphic": "16067"
        },
        {
          "id": "2000-88-116-7703",
          "name": "检查员(D)",
          "x": 88,
          "y": 116,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sainasu/event/oev_edd",
          "dialogueLines": [],
          "source": "ref___data/npc/sainasu/event/oev2.create",
          "script": "file:sainasu/event/oev_edd",
          "template": "changeevent",
          "graphic": "16033"
        },
        {
          "id": "2000-69-33-1730",
          "name": "村民",
          "x": 69,
          "y": 33,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_69_33",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/msg_2000_69_33",
          "template": "npcgen_man",
          "graphic": "16019"
        },
        {
          "id": "2000-55-52-1736",
          "name": "警卫",
          "x": 55,
          "y": 52,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_55_52",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/msg_2000_55_52",
          "template": "npcgen_man",
          "graphic": "16204"
        },
        {
          "id": "2000-59-52-1737",
          "name": "警卫",
          "x": 59,
          "y": 52,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_59_52",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/msg_2000_59_52",
          "template": "npcgen_man",
          "graphic": "16204"
        },
        {
          "id": "2000-63-55-120",
          "name": "强者表",
          "x": 63,
          "y": 55,
          "type": "Duelranking",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/duelranking.create",
          "script": "duelranking",
          "template": "duelranking",
          "graphic": "10069"
        },
        {
          "id": "2000-72-55-1741",
          "name": "乌力",
          "x": 72,
          "y": 55,
          "type": "TownPeople",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "npcgen_man",
          "template": "npcgen_man",
          "graphic": "100251"
        },
        {
          "id": "2000-73-55-1740",
          "name": "青年",
          "x": 73,
          "y": 55,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_73_55",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/msg_2000_73_55",
          "template": "npcgen_man",
          "graphic": "16204"
        },
        {
          "id": "2000-73-69-1743",
          "name": "玛丽娜丝的传言板",
          "x": 73,
          "y": 69,
          "type": "Dengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "npcgen_dengon",
          "template": "npcgen_dengon",
          "graphic": "10062"
        },
        {
          "id": "2000-52-71-2185",
          "name": "看板",
          "x": 52,
          "y": 71,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_2000_52_71",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/chatkanban.create",
          "script": "file:genout/signb_2000_52_71",
          "template": "npcgen_signboard",
          "graphic": "10096"
        },
        {
          "id": "2000-38-78-1739",
          "name": "村庄青年",
          "x": 38,
          "y": 78,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_38_78",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/msg_2000_38_78",
          "template": "npcgen_man",
          "graphic": "16045"
        },
        {
          "id": "2000-81-78-121",
          "name": "强者表",
          "x": 81,
          "y": 78,
          "type": "Duelranking",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/duelranking.create",
          "script": "duelranking",
          "template": "duelranking",
          "graphic": "10070"
        },
        {
          "id": "2000-87-78-5788",
          "name": "竞技场前看板 ＝＝＝＝＝玛丽娜丝的竞技场＝＝＝＝＝\\n公开挑战对战的场所\\n会场战斗的排行榜前１０名和\\n等级２０的人可以免费入场\\n此外，排名第７７和７７７位也免费。",
          "x": 87,
          "y": 78,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_2000_87_78",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/signb_2000_87_78",
          "template": "npcgen_signboard",
          "graphic": "10061"
        },
        {
          "id": "2000-99-78-1729",
          "name": "村民",
          "x": 99,
          "y": 78,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_99_78",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/msg_2000_99_78",
          "template": "npcgen_man",
          "graphic": "16039"
        },
        {
          "id": "2000-97-85-1731",
          "name": "村庄少女",
          "x": 97,
          "y": 85,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_97_85",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/msg_2000_97_85",
          "template": "npcgen_man",
          "graphic": "16036"
        },
        {
          "id": "2000-101-86-2108",
          "name": "加美航空",
          "x": 101,
          "y": 86,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_101_86",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/airway.create",
          "script": "file:genout/msg_2000_101_86",
          "template": "npcgen_man",
          "graphic": "16026"
        },
        {
          "id": "2000-105-87-90",
          "name": "加美航空",
          "x": 105,
          "y": 87,
          "type": "Airplane",
          "dialogue": "脚本入口：ref___data/npc/chatroom/airplane.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/chatroom/airplane.create",
          "script": "file:chatroom/airplane.arg",
          "template": "airplane",
          "graphic": "100259"
        },
        {
          "id": "2000-106-87-2109",
          "name": "往奇努伊",
          "x": 106,
          "y": 87,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_2000_106_87",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/airway.create",
          "script": "file:genout/signb_2000_106_87",
          "template": "npcgen_signboard",
          "graphic": "10400"
        },
        {
          "id": "2000-87-92-1742",
          "name": "玛丽娜丝的传言板",
          "x": 87,
          "y": 92,
          "type": "Dengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "npcgen_dengon",
          "template": "npcgen_dengon",
          "graphic": "10062"
        },
        {
          "id": "2000-73-108-1733",
          "name": "村民",
          "x": 73,
          "y": 108,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_73_108",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/msg_2000_73_108",
          "template": "npcgen_man",
          "graphic": "16022"
        },
        {
          "id": "2000-59-109-1732",
          "name": "村中青年",
          "x": 59,
          "y": 109,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2000_59_109",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/2000npc_m.create",
          "script": "file:genout/msg_2000_59_109",
          "template": "npcgen_man",
          "graphic": "16046"
        },
        {
          "id": "2000-80-116-5267",
          "name": "看板",
          "x": 80,
          "y": 116,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_2000_80_116",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/oev2.create",
          "script": "file:genout/signb_2000_80_116",
          "template": "npcgen_signboard",
          "graphic": "10062"
        },
        {
          "id": "2000-62-33-7501",
          "name": "柯西",
          "x": 62,
          "y": 33,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/cat/cat.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/cat/cat.create",
          "script": "file:sa70/cat/cat.arg",
          "template": "npcgen_warpman",
          "graphic": "16084"
        },
        {
          "id": "2000-85-79-2264",
          "name": "斗技场向导",
          "x": 85,
          "y": 79,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_2000_85_79",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/duelroom.create",
          "script": "file:genout/wpm_2000_85_79",
          "template": "npcgen_warpman",
          "graphic": "16055",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "130",
              "floor": 130,
              "x": 57,
              "y": 22
            },
            "free": "ITEM=2598",
            "money": "-1",
            "cost": {
              "mode": "unavailable"
            },
            "deleteItems": [
              2521,
              2522,
              2523,
              2524,
              2602,
              2597,
              2599,
              2600,
              2601
            ],
            "freeMessage": "欢迎来到斗技场 现在斗技场有人的出席者。 请慢慢使用。",
            "payMessage": "没有门票。 请到那里购买门票。 现在的入场者有人。",
            "normalMessage": "",
            "moneyMessage": "不好意思请多关照。",
            "partyMessage": "以团队无法入场。 请把团队解散之后再个别 入场。",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_2000_85_79"
          }
        },
        {
          "id": "2000-74-33-1547",
          "name": "Warp",
          "x": 74,
          "y": 33,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-74-34-1548",
          "name": "Warp",
          "x": 74,
          "y": 34,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-74-35-1549",
          "name": "Warp",
          "x": 74,
          "y": 35,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-74-36-1550",
          "name": "Warp",
          "x": 74,
          "y": 36,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-56-48-6487",
          "name": "Warp",
          "x": 56,
          "y": 48,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-57-48-6489",
          "name": "Warp",
          "x": 57,
          "y": 48,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-58-48-6491",
          "name": "Warp",
          "x": 58,
          "y": 48,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-69-51-5289",
          "name": "Warp",
          "x": 69,
          "y": 51,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/quiz.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-75-57-6476",
          "name": "Warp",
          "x": 75,
          "y": 57,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-75-58-6478",
          "name": "Warp",
          "x": 75,
          "y": 58,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-50-71-6503",
          "name": "Warp",
          "x": 50,
          "y": 71,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-51-71-6505",
          "name": "Warp",
          "x": 51,
          "y": 71,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-73-73-6472",
          "name": "Warp",
          "x": 73,
          "y": 73,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-74-73-6474",
          "name": "Warp",
          "x": 74,
          "y": 73,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-92-77-6480",
          "name": "Warp",
          "x": 92,
          "y": 77,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-93-77-6482",
          "name": "Warp",
          "x": 93,
          "y": 77,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-108-79-1555",
          "name": "Warp",
          "x": 108,
          "y": 79,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-102-80-6500",
          "name": "Warp",
          "x": 102,
          "y": 80,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-103-80-6497",
          "name": "Warp",
          "x": 103,
          "y": 80,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-108-80-1556",
          "name": "Warp",
          "x": 108,
          "y": 80,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-108-81-1557",
          "name": "Warp",
          "x": 108,
          "y": 81,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-66-82-6485",
          "name": "Warp",
          "x": 66,
          "y": 82,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-108-82-1558",
          "name": "Warp",
          "x": 108,
          "y": 82,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/100warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-92-89-6468",
          "name": "Warp",
          "x": 92,
          "y": 89,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-92-90-6470",
          "name": "Warp",
          "x": 92,
          "y": 90,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-73-103-6492",
          "name": "Warp",
          "x": 73,
          "y": 103,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2000-73-104-6494",
          "name": "Warp",
          "x": 73,
          "y": 104,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2020-0",
          "label": "去 玛丽娜丝道场柜台",
          "detail": "玛丽娜丝道场柜台 | floor 2020 | 目标 (4,12) | 入口 (69,51)",
          "to": "2020",
          "x": 69,
          "y": 51,
          "bounds": [
            69,
            51,
            69,
            51
          ],
          "target": [
            4,
            12
          ],
          "tiles": [
            {
              "x": 69,
              "y": 51,
              "target": [
                4,
                12
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "100-1",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (79,616) | 入口 4 格 (74,33)-(74,36)",
          "to": "100",
          "x": 74,
          "y": 35,
          "bounds": [
            74,
            33,
            74,
            36
          ],
          "target": [
            79,
            616
          ],
          "tiles": [
            {
              "x": 74,
              "y": 33,
              "target": [
                79,
                614
              ]
            },
            {
              "x": 74,
              "y": 34,
              "target": [
                79,
                615
              ]
            },
            {
              "x": 74,
              "y": 35,
              "target": [
                79,
                616
              ]
            },
            {
              "x": 74,
              "y": 36,
              "target": [
                79,
                617
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "100-2",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (114,662) | 入口 7 格 (108,79)-(108,85)",
          "to": "100",
          "x": 108,
          "y": 82,
          "bounds": [
            108,
            79,
            108,
            85
          ],
          "target": [
            114,
            662
          ],
          "tiles": [
            {
              "x": 108,
              "y": 79,
              "target": [
                114,
                660
              ]
            },
            {
              "x": 108,
              "y": 80,
              "target": [
                114,
                661
              ]
            },
            {
              "x": 108,
              "y": 81,
              "target": [
                114,
                662
              ]
            },
            {
              "x": 108,
              "y": 82,
              "target": [
                114,
                663
              ]
            },
            {
              "x": 108,
              "y": 83,
              "target": [
                114,
                661
              ]
            },
            {
              "x": 108,
              "y": 84,
              "target": [
                114,
                662
              ]
            },
            {
              "x": 108,
              "y": 85,
              "target": [
                114,
                663
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2001-3",
          "label": "去 玛丽娜丝的武器店",
          "detail": "玛丽娜丝的武器店 | floor 2001 | 目标 (10,16) | 入口 2 格 (92,89)-(92,90)",
          "to": "2001",
          "x": 92,
          "y": 90,
          "bounds": [
            92,
            89,
            92,
            90
          ],
          "target": [
            10,
            16
          ],
          "tiles": [
            {
              "x": 92,
              "y": 89,
              "target": [
                10,
                15
              ]
            },
            {
              "x": 92,
              "y": 90,
              "target": [
                10,
                16
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2002-4",
          "label": "去 玛丽娜丝的道具店",
          "detail": "玛丽娜丝的道具店 | floor 2002 | 目标 (16,21) | 入口 2 格 (73,73)-(74,73)",
          "to": "2002",
          "x": 74,
          "y": 73,
          "bounds": [
            73,
            73,
            74,
            73
          ],
          "target": [
            16,
            21
          ],
          "tiles": [
            {
              "x": 73,
              "y": 73,
              "target": [
                15,
                21
              ]
            },
            {
              "x": 74,
              "y": 73,
              "target": [
                16,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2003-5",
          "label": "去 玛丽娜丝的宠物店|00b僾",
          "detail": "玛丽娜丝的宠物店|00b僾 | floor 2003 | 目标 (10,16) | 入口 2 格 (75,57)-(75,58)",
          "to": "2003",
          "x": 75,
          "y": 58,
          "bounds": [
            75,
            57,
            75,
            58
          ],
          "target": [
            10,
            16
          ],
          "tiles": [
            {
              "x": 75,
              "y": 57,
              "target": [
                10,
                15
              ]
            },
            {
              "x": 75,
              "y": 58,
              "target": [
                10,
                16
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2004-6",
          "label": "去 玛丽娜丝的肉店",
          "detail": "玛丽娜丝的肉店 | floor 2004 | 目标 (16,21) | 入口 4 格 (92,77)-(95,77)",
          "to": "2004",
          "x": 94,
          "y": 77,
          "bounds": [
            92,
            77,
            95,
            77
          ],
          "target": [
            16,
            21
          ],
          "tiles": [
            {
              "x": 92,
              "y": 77,
              "target": [
                15,
                21
              ]
            },
            {
              "x": 93,
              "y": 77,
              "target": [
                16,
                21
              ]
            },
            {
              "x": 94,
              "y": 77,
              "target": [
                15,
                21
              ]
            },
            {
              "x": 95,
              "y": 77,
              "target": [
                16,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2005-7",
          "label": "去 玛丽娜丝的医院|0V儑僢僾",
          "detail": "玛丽娜丝的医院|0V儑僢僾 | floor 2005 | 目标 (18,33) | 入口 2 格 (66,81)-(66,82)",
          "to": "2005",
          "x": 66,
          "y": 82,
          "bounds": [
            66,
            81,
            66,
            82
          ],
          "target": [
            18,
            33
          ],
          "tiles": [
            {
              "x": 66,
              "y": 82,
              "target": [
                10,
                16
              ]
            },
            {
              "x": 66,
              "y": 81,
              "target": [
                25,
                49
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2006-8",
          "label": "去 玛丽娜丝的村长家",
          "detail": "玛丽娜丝的村长家 | floor 2006 | 目标 (21,21) | 入口 3 格 (56,48)-(58,48)",
          "to": "2006",
          "x": 57,
          "y": 48,
          "bounds": [
            56,
            48,
            58,
            48
          ],
          "target": [
            21,
            21
          ],
          "tiles": [
            {
              "x": 56,
              "y": 48,
              "target": [
                20,
                21
              ]
            },
            {
              "x": 57,
              "y": 48,
              "target": [
                21,
                21
              ]
            },
            {
              "x": 58,
              "y": 48,
              "target": [
                21,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2020-9",
          "label": "去 玛丽娜丝道场柜台",
          "detail": "玛丽娜丝道场柜台 | floor 2020 | 目标 (4,12) | 入口 (75,51)",
          "to": "2020",
          "x": 75,
          "y": 51,
          "bounds": [
            75,
            51,
            75,
            51
          ],
          "target": [
            4,
            12
          ],
          "tiles": [
            {
              "x": 75,
              "y": 51,
              "target": [
                4,
                12
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2001-10",
          "label": "去 玛丽娜丝的武器店",
          "detail": "玛丽娜丝的武器店 | floor 2001 | 目标 (10,16) | 入口 2 格 (97,92)-(97,93)",
          "to": "2001",
          "x": 97,
          "y": 93,
          "bounds": [
            97,
            92,
            97,
            93
          ],
          "target": [
            10,
            16
          ],
          "tiles": [
            {
              "x": 97,
              "y": 92,
              "target": [
                10,
                15
              ]
            },
            {
              "x": 97,
              "y": 93,
              "target": [
                10,
                16
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2002-11",
          "label": "去 玛丽娜丝的道具店",
          "detail": "玛丽娜丝的道具店 | floor 2002 | 目标 (15,21) | 入口 (77,75)",
          "to": "2002",
          "x": 77,
          "y": 75,
          "bounds": [
            77,
            75,
            77,
            75
          ],
          "target": [
            15,
            21
          ],
          "tiles": [
            {
              "x": 77,
              "y": 75,
              "target": [
                15,
                21
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2003-12",
          "label": "去 玛丽娜丝的宠物店|00b僾",
          "detail": "玛丽娜丝的宠物店|00b僾 | floor 2003 | 目标 (10,16) | 入口 2 格 (86,60)-(87,60)",
          "to": "2003",
          "x": 87,
          "y": 60,
          "bounds": [
            86,
            60,
            87,
            60
          ],
          "target": [
            10,
            16
          ],
          "tiles": [
            {
              "x": 86,
              "y": 60,
              "target": [
                10,
                15
              ]
            },
            {
              "x": 87,
              "y": 60,
              "target": [
                10,
                16
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2001": {
      "id": "2001",
      "floorId": 2001,
      "name": "玛丽娜丝的武器店",
      "mapFile": "/data/maps/2001.ls2map",
      "clientMapFile": "/data/client-maps/2001.dat",
      "clientMapSource": "公益石器时代/map/2001.dat",
      "summary": "玛丽娜丝的武器店 | floor=2001 | 30x30 | ref___data/map/sainasu/marinasu/2001",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        15
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "2001-14-14-7637",
          "name": "村子里的万事通",
          "x": 14,
          "y": 14,
          "type": "Windowman",
          "dialogue": "你想知道关于武器的哪些事呢？",
          "dialogueLines": [
            "你想知道关于武器的哪些事呢？",
            "直接攻击武器",
            "间接攻击武器",
            "2",
            "直接攻击类的武器是吧？你想知道",
            "哪一种武器呢？",
            "棍棒",
            "斧头"
          ],
          "source": "ref___data/npc/sainasu/bukiya.create",
          "script": "conff:sainasu/bukiya01.conf",
          "template": "windowman",
          "graphic": "16203"
        },
        {
          "id": "2001-18-15-5772",
          "name": "玛丽娜丝的武器店",
          "x": 18,
          "y": 15,
          "type": "ItemShop",
          "dialogue": "欢迎光临",
          "dialogueLines": [
            "欢迎光临"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_2001_18_15",
          "template": "npcgen_shop",
          "graphic": "16017",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_2001_18_15",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临",
            "items": [
              {
                "id": 10,
                "name": "普通普通的斧头",
                "secretName": "普通普通的斧头",
                "description": "攻 +14 防 -5 敏 -5",
                "image": 20013,
                "cost": 260,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 260
              },
              {
                "id": 20,
                "name": "轻的斧头",
                "secretName": "轻的斧头",
                "description": "攻 +19 防 -7 敏 -6",
                "image": 20000,
                "cost": 1040,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 1040
              },
              {
                "id": 30,
                "name": "重的斧头",
                "secretName": "重的斧头",
                "description": "攻 +27 防 -9 敏 -10",
                "image": 20016,
                "cost": 2990,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 20,
                "price": 2990
              },
              {
                "id": 50,
                "name": "硬的斧头",
                "secretName": "硬的斧头",
                "description": "攻 +37 防 -12 敏 -12",
                "image": 20018,
                "cost": 11050,
                "type": 1,
                "useField": 0,
                "target": 0,
                "level": 30,
                "price": 11050
              },
              {
                "id": 100,
                "name": "小棍棒",
                "secretName": "小棍棒",
                "description": "攻 +4",
                "image": 20103,
                "cost": 50,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 50
              },
              {
                "id": 110,
                "name": "普通普通的棍棒",
                "secretName": "普通普通的棍棒",
                "description": "攻 +8",
                "image": 20102,
                "cost": 200,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 200
              },
              {
                "id": 120,
                "name": "轻的棍棒",
                "secretName": "轻的棍棒",
                "description": "攻 +11 敏 +1",
                "image": 20101,
                "cost": 800,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 800
              },
              {
                "id": 140,
                "name": "大的棍棒",
                "secretName": "大的棍棒",
                "description": "攻 +20",
                "image": 20112,
                "cost": 5000,
                "type": 2,
                "useField": 0,
                "target": 0,
                "level": 25,
                "price": 5000
              },
              {
                "id": 200,
                "name": "小的枪",
                "secretName": "小的枪",
                "description": "攻 +5 敏 -1 魅 +1",
                "image": 20402,
                "cost": 60,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 60
              },
              {
                "id": 210,
                "name": "普通普通的枪",
                "secretName": "普通普通的枪",
                "description": "攻 +10 敏 -2 魅 +1",
                "image": 20422,
                "cost": 240,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 240
              },
              {
                "id": 230,
                "name": "重的枪",
                "secretName": "重的枪",
                "description": "攻 +21 敏 -5 魅 +2",
                "image": 20408,
                "cost": 2760,
                "type": 3,
                "useField": 0,
                "target": 0,
                "level": 20,
                "price": 2760
              },
              {
                "id": 300,
                "name": "小的爪",
                "secretName": "小的爪",
                "description": "攻 +3 (x2)",
                "image": 20203,
                "cost": 55,
                "type": 0,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 55
              },
              {
                "id": 310,
                "name": "普通普通的爪",
                "secretName": "普通普通的爪",
                "description": "攻 +6 (x2)",
                "image": 20200,
                "cost": 220,
                "type": 0,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 220
              },
              {
                "id": 320,
                "name": "轻的爪",
                "secretName": "轻的爪",
                "description": "攻 +8 敏 +1 (x2)",
                "image": 20207,
                "cost": 880,
                "type": 0,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 880
              },
              {
                "id": 600,
                "name": "小的投掷斧头",
                "secretName": "小的投掷斧头",
                "description": "攻 +4",
                "image": 20508,
                "cost": 50,
                "type": 18,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 50
              },
              {
                "id": 610,
                "name": "普通普通的投掷斧头",
                "secretName": "普通普通的投掷斧头",
                "description": "攻 +8",
                "image": 20507,
                "cost": 200,
                "type": 18,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 200
              }
            ]
          }
        },
        {
          "id": "2001-18-18-5773",
          "name": "玛丽娜丝的防具店",
          "x": 18,
          "y": 18,
          "type": "ItemShop",
          "dialogue": "欢迎光临",
          "dialogueLines": [
            "欢迎光临"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_2001_18_18",
          "template": "npcgen_shop",
          "graphic": "16056",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_2001_18_18",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临",
            "items": [
              {
                "id": 800,
                "name": "粗杂的兜",
                "secretName": "粗杂的兜",
                "description": "防 +3",
                "image": 21541,
                "cost": 50,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 50
              },
              {
                "id": 810,
                "name": "普通普通的兜",
                "secretName": "普通普通的兜",
                "description": "防 +4",
                "image": 21540,
                "cost": 200,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 200
              },
              {
                "id": 820,
                "name": "轻的兜",
                "secretName": "轻的兜",
                "description": "防 +5",
                "image": 21510,
                "cost": 800,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 800
              },
              {
                "id": 842,
                "name": "爱鲁菲Lv1兜5",
                "secretName": "爱鲁菲Lv1兜5",
                "description": "防 +8 敏 -3 净化精灵(石化) Lv1",
                "image": 21518,
                "cost": 5625,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 25,
                "price": 5625
              },
              {
                "id": 900,
                "name": "破烂的帽子",
                "secretName": "破烂的帽子",
                "description": "防 +1",
                "image": 21508,
                "cost": 40,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 40
              },
              {
                "id": 914,
                "name": "渥鲁菲Lv2帽子2",
                "secretName": "渥鲁菲Lv2帽子2",
                "description": "防 +1 净化精灵(酒醉) Lv2",
                "image": 21503,
                "cost": 256,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 256
              },
              {
                "id": 920,
                "name": "普通普通的帽子",
                "secretName": "普通普通的帽子",
                "description": "防 +3",
                "image": 21530,
                "cost": 640,
                "type": 6,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 640
              },
              {
                "id": 1000,
                "name": "粗杂的铠",
                "secretName": "粗杂的铠",
                "description": "防 +4 敏 -1",
                "image": 21014,
                "cost": 75,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 75
              },
              {
                "id": 1010,
                "name": "普通普通的铠",
                "secretName": "普通普通的铠",
                "description": "防 +8 敏 -2",
                "image": 21026,
                "cost": 300,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 300
              },
              {
                "id": 1012,
                "name": "芙雷雅Lv1铠2",
                "secretName": "芙雷雅Lv1铠2",
                "description": "防 +5 敏 -2 滋润的精灵 Lv1",
                "image": 21027,
                "cost": 550,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 550
              },
              {
                "id": 1020,
                "name": "轻的铠",
                "secretName": "轻的铠",
                "description": "防 +11 敏 -2",
                "image": 21046,
                "cost": 1200,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 15,
                "price": 1200
              },
              {
                "id": 1100,
                "name": "破烂的服",
                "secretName": "破烂的服",
                "description": "防 +2",
                "image": 21041,
                "cost": 60,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 60
              },
              {
                "id": 1110,
                "name": "普通的服",
                "secretName": "普通的服",
                "description": "防 +5",
                "image": 21008,
                "cost": 240,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 240
              },
              {
                "id": 1111,
                "name": "哈鲁Lv1服2",
                "secretName": "哈鲁Lv1服2",
                "description": "防 +3 治愈的精灵 Lv1",
                "image": 21009,
                "cost": 340,
                "type": 7,
                "useField": 0,
                "target": 0,
                "level": 10,
                "price": 340
              }
            ]
          }
        },
        {
          "id": "2001-10-15-6469",
          "name": "Warp",
          "x": 10,
          "y": 15,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2001-10-16-6471",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2000-0",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (92,90) | 入口 2 格 (10,15)-(10,16)",
          "to": "2000",
          "x": 10,
          "y": 16,
          "bounds": [
            10,
            15,
            10,
            16
          ],
          "target": [
            92,
            90
          ],
          "tiles": [
            {
              "x": 10,
              "y": 15,
              "target": [
                92,
                89
              ]
            },
            {
              "x": 10,
              "y": 16,
              "target": [
                92,
                90
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2002": {
      "id": "2002",
      "floorId": 2002,
      "name": "玛丽娜丝的道具店",
      "mapFile": "/data/maps/2002.ls2map",
      "clientMapFile": "/data/client-maps/2002.dat",
      "clientMapSource": "公益石器时代/map/2002.dat",
      "summary": "玛丽娜丝的道具店 | floor=2002 | 30x30 | ref___data/map/sainasu/marinasu/2002",
      "size": [
        30,
        30
      ],
      "spawn": [
        15,
        21
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "2002-15-13-5774",
          "name": "玛丽娜丝的道具店",
          "x": 15,
          "y": 13,
          "type": "ItemShop",
          "dialogue": "欢迎",
          "dialogueLines": [
            "欢迎"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_2002_15_13",
          "template": "npcgen_shop",
          "graphic": "16035",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_2002_15_13",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎",
            "items": [
              {
                "id": 1213,
                "name": "牙的手环(绿)",
                "secretName": "牙的手环(绿)",
                "description": "攻 +5 防 -5 敏 +5 魅 +3",
                "image": 22073,
                "cost": 30000,
                "type": 8,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 30000
              },
              {
                "id": 1273,
                "name": "芙雷美雅Lv4竖琴",
                "secretName": "芙雷美雅Lv4竖琴",
                "description": "魅 +4 火炎的精灵 Lv4",
                "image": 24211,
                "cost": 3000,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 45,
                "price": 3000
              },
              {
                "id": 1280,
                "name": "芙雷美雅Lv5金币",
                "secretName": "芙雷美雅Lv5金币",
                "description": "魅 +5 火炎的精灵 Lv5",
                "image": 24216,
                "cost": 5000,
                "type": 9,
                "useField": 0,
                "target": 0,
                "level": 60,
                "price": 5000
              },
              {
                "id": 1311,
                "name": "小石细工戒指",
                "secretName": "小石细工戒指",
                "description": "魅 +2 会心一击率上升 +3",
                "image": 22102,
                "cost": 4500,
                "type": 11,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 4500
              },
              {
                "id": 1360,
                "name": "漂亮的黑色首饰",
                "secretName": "漂亮的黑色首饰",
                "description": "魅 +2 毒耐性 +60",
                "image": 22042,
                "cost": 11900,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 11900
              },
              {
                "id": 1361,
                "name": "红色美丽首饰",
                "secretName": "红色美丽首饰",
                "description": "魅 +2 石化耐性 +60",
                "image": 22038,
                "cost": 10500,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 10500
              },
              {
                "id": 1362,
                "name": "黄色美丽首饰",
                "secretName": "黄色美丽首饰",
                "description": "魅 +2 睡眠耐性 +60",
                "image": 22041,
                "cost": 9100,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 9100
              },
              {
                "id": 1363,
                "name": "绿色美丽首饰",
                "secretName": "绿色美丽首饰",
                "description": "魅 +2 混乱耐性 +60",
                "image": 22040,
                "cost": 14000,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 14000
              },
              {
                "id": 1364,
                "name": "青色美丽首饰",
                "secretName": "青色美丽首饰",
                "description": "魅 +2 酒醉耐性 +60",
                "image": 22039,
                "cost": 7000,
                "type": 10,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 7000
              },
              {
                "id": 1411,
                "name": "青色小耳环",
                "secretName": "青色小耳环",
                "description": "魅 +2 回避率上升 +3",
                "image": 22105,
                "cost": 4500,
                "type": 13,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 4500
              }
            ]
          }
        },
        {
          "id": "2002-17-15-7706",
          "name": "法术通",
          "x": 17,
          "y": 15,
          "type": "Windowman",
          "dialogue": "关于法术，你想知道哪些事情呢？",
          "dialogueLines": [
            "关于法术，你想知道哪些事情呢？",
            "关于法术的基本知识",
            "回复、复活系的法术",
            "状态异常系法术",
            "净化系法术",
            "属性变化系法术",
            "防御系法术",
            "‘关于法术的基本知识’"
          ],
          "source": "ref___data/npc/sainasu/jujutu.create",
          "script": "conff:sainasu/jujutu01.conf",
          "template": "windowman",
          "graphic": "16066"
        },
        {
          "id": "2002-15-21-6473",
          "name": "Warp",
          "x": 15,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2002-16-21-6475",
          "name": "Warp",
          "x": 16,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2000-0",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (74,73) | 入口 2 格 (15,21)-(16,21)",
          "to": "2000",
          "x": 16,
          "y": 21,
          "bounds": [
            15,
            21,
            16,
            21
          ],
          "target": [
            74,
            73
          ],
          "tiles": [
            {
              "x": 15,
              "y": 21,
              "target": [
                73,
                73
              ]
            },
            {
              "x": 16,
              "y": 21,
              "target": [
                74,
                73
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2003": {
      "id": "2003",
      "floorId": 2003,
      "name": "玛丽娜丝的宠物店|00b僾",
      "mapFile": "/data/maps/2003.ls2map",
      "clientMapFile": "/data/client-maps/2003.dat",
      "clientMapSource": "公益石器时代/map/2003.dat",
      "summary": "玛丽娜丝的宠物店|00b僾 | floor=2003 | 30x30 | ref___data/map/sainasu/marinasu/2003",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        15
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "2003-15-12-7714",
          "name": "村子里的万事通",
          "x": 15,
          "y": 12,
          "type": "Windowman",
          "dialogue": "关于特技你想知道什么吗？",
          "dialogueLines": [
            "关于特技你想知道什么吗？",
            "普通特技",
            "状态异常特技",
            "特殊攻击 1",
            "特殊攻击 2",
            "2",
            "关于普通特技是吗？",
            "普通特技共有下列几种技巧。"
          ],
          "source": "ref___data/npc/sainasu/wazaya.create",
          "script": "conff:sainasu/wazaya01.conf",
          "template": "windowman",
          "graphic": "16202"
        },
        {
          "id": "2003-18-14-5776",
          "name": "饲育员",
          "x": 18,
          "y": 14,
          "type": "PetSkillShop",
          "dialogue": "我是这个村里最棒的饲养人了。",
          "dialogueLines": [
            "我是这个村里最棒的饲养人了。",
            "那么，要让它学什么呢？"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/psks_2003_18_14",
          "template": "npcgen_petskillshop",
          "graphic": "16046"
        },
        {
          "id": "2003-18-17-5775",
          "name": "宠物店",
          "x": 18,
          "y": 17,
          "type": "PetShop",
          "dialogue": "玛丽娜丝～、宠物店～",
          "dialogueLines": [
            "玛丽娜丝～、宠物店～",
            "欢迎光临～"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ps_2003_18_17",
          "template": "npcgen_petshop",
          "graphic": "16036"
        },
        {
          "id": "2003-11-12-7424",
          "name": "宠物常识解说员",
          "x": 11,
          "y": 12,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/newbie/petmaster",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/newbie/newbie.create",
          "script": "file:sa60/newbie/petmaster",
          "template": "changeevent",
          "graphic": "16127"
        },
        {
          "id": "2003-13-12-5780",
          "name": "宠物店长",
          "x": 13,
          "y": 12,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2003_12_12",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/msg_2003_12_12",
          "template": "npcgen_man",
          "graphic": "16035"
        },
        {
          "id": "2003-19-12-5777",
          "name": "贝恩达斯",
          "x": 19,
          "y": 12,
          "type": "npcgen_mugon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_mugon",
          "template": "npcgen_mugon",
          "graphic": "100336"
        },
        {
          "id": "2003-13-19-5779",
          "name": "乌力乌力",
          "x": 13,
          "y": 19,
          "type": "npcgen_mugon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_mugon",
          "template": "npcgen_mugon",
          "graphic": "100251"
        },
        {
          "id": "2003-15-19-5778",
          "name": "乌力斯坦",
          "x": 15,
          "y": 19,
          "type": "npcgen_mugon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_mugon",
          "template": "npcgen_mugon",
          "graphic": "100252"
        },
        {
          "id": "2003-10-15-6477",
          "name": "Warp",
          "x": 10,
          "y": 15,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2003-10-16-6479",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2000-0",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (75,58) | 入口 2 格 (10,15)-(10,16)",
          "to": "2000",
          "x": 10,
          "y": 16,
          "bounds": [
            10,
            15,
            10,
            16
          ],
          "target": [
            75,
            58
          ],
          "tiles": [
            {
              "x": 10,
              "y": 15,
              "target": [
                75,
                57
              ]
            },
            {
              "x": 10,
              "y": 16,
              "target": [
                75,
                58
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2004": {
      "id": "2004",
      "floorId": 2004,
      "name": "玛丽娜丝的肉店",
      "mapFile": "/data/maps/2004.ls2map",
      "clientMapFile": "/data/client-maps/2004.dat",
      "clientMapSource": "公益石器时代/map/2004.dat",
      "summary": "玛丽娜丝的肉店 | floor=2004 | 30x30 | ref___data/map/sainasu/marinasu/2004",
      "size": [
        30,
        30
      ],
      "spawn": [
        15,
        21
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "2004-17-13-5781",
          "name": "玛丽那丝的肉店",
          "x": 17,
          "y": 13,
          "type": "ItemShop",
          "dialogue": "欢迎！",
          "dialogueLines": [
            "欢迎！"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_2004_17_13",
          "template": "npcgen_shop",
          "graphic": "16016",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_2004_17_13",
            "buyRate": 1,
            "sellRate": 1,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎！",
            "items": [
              {
                "id": 2344,
                "name": "小的肉",
                "secretName": "小的肉",
                "description": "耐久力20前後回复",
                "image": 24008,
                "cost": 12,
                "type": 20,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 12
              },
              {
                "id": 2345,
                "name": "乾燥肉",
                "secretName": "乾燥肉",
                "description": "耐久力35前後回复",
                "image": 24035,
                "cost": 18,
                "type": 20,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 18
              },
              {
                "id": 2346,
                "name": "大的肉",
                "secretName": "大的肉",
                "description": "耐久力65前後回复",
                "image": 24017,
                "cost": 30,
                "type": 20,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 30
              },
              {
                "id": 2347,
                "name": "高级肉",
                "secretName": "高级肉",
                "description": "耐久力80前後回复",
                "image": 24026,
                "cost": 48,
                "type": 20,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 48
              }
            ]
          }
        },
        {
          "id": "2004-15-21-6481",
          "name": "Warp",
          "x": 15,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2004-16-21-6483",
          "name": "Warp",
          "x": 16,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2000-0",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (93,77) | 入口 2 格 (15,21)-(16,21)",
          "to": "2000",
          "x": 16,
          "y": 21,
          "bounds": [
            15,
            21,
            16,
            21
          ],
          "target": [
            93,
            77
          ],
          "tiles": [
            {
              "x": 15,
              "y": 21,
              "target": [
                92,
                77
              ]
            },
            {
              "x": 16,
              "y": 21,
              "target": [
                93,
                77
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2005": {
      "id": "2005",
      "floorId": 2005,
      "name": "玛丽娜丝的医院|0V儑僢僾",
      "mapFile": "/data/maps/2005.ls2map",
      "clientMapFile": "/data/client-maps/2005.dat",
      "clientMapSource": "公益石器时代/map/2005.dat",
      "summary": "玛丽娜丝的医院|0V儑僢僾 | floor=2005 | 30x30 | ref___data/map/sainasu/marinasu/2005",
      "size": [
        30,
        30
      ],
      "spawn": [
        10,
        16
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "2005-15-7-5783",
          "name": "玛丽娜丝的药师",
          "x": 15,
          "y": 7,
          "type": "ItemShop",
          "dialogue": "欢迎",
          "dialogueLines": [
            "欢迎"
          ],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/ss_2005_15_7",
          "template": "npcgen_shop",
          "graphic": "16023",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/genout/ss_2005_15_7",
            "buyRate": 1,
            "sellRate": 0.2,
            "buyWords": [
              "买",
              "购买",
              "感谢您",
              "kau",
              "buy",
              "menu",
              "谢谢",
              "买东西"
            ],
            "sellWords": [
              "卖东西",
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎",
            "items": [
              {
                "id": 1500,
                "name": "耐久力回复药",
                "secretName": "耐久力回复药",
                "description": "耐久力100前後回复",
                "image": 23013,
                "cost": 25,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 25
              },
              {
                "id": 1501,
                "name": "耐久力回复药",
                "secretName": "耐久力回复药",
                "description": "耐久力200前後回复",
                "image": 23014,
                "cost": 50,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 50
              },
              {
                "id": 1510,
                "name": "气力回复药",
                "secretName": "气力回复药",
                "description": "气力20前後回复",
                "image": 23005,
                "cost": 80,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 80
              },
              {
                "id": 1511,
                "name": "气力回复药",
                "secretName": "气力回复药",
                "description": "气力40前後回复",
                "image": 23006,
                "cost": 160,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 160
              },
              {
                "id": 1512,
                "name": "气力回复药",
                "secretName": "气力回复药",
                "description": "气力60前後回复",
                "image": 23007,
                "cost": 250,
                "type": 16,
                "useField": 0,
                "target": 1,
                "level": 0,
                "price": 250
              },
              {
                "id": 1530,
                "name": "复活药(100)",
                "secretName": "复活药(100)",
                "description": "气绝回复成耐力100",
                "image": 23021,
                "cost": 100,
                "type": 16,
                "useField": 1,
                "target": 101,
                "level": 0,
                "price": 100
              },
              {
                "id": 1531,
                "name": "复活药(300)",
                "secretName": "复活药(300)",
                "description": "气绝回复成耐力300",
                "image": 23021,
                "cost": 300,
                "type": 16,
                "useField": 1,
                "target": 101,
                "level": 0,
                "price": 300
              },
              {
                "id": 1540,
                "name": "乌西摩尼叶",
                "secretName": "乌西摩尼叶",
                "description": "解毒的热带性植物",
                "image": 23026,
                "cost": 30,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 30
              },
              {
                "id": 1541,
                "name": "伊西娃丽索叶",
                "secretName": "伊西娃丽索叶",
                "description": "解除石化的潮湿地带植物",
                "image": 23027,
                "cost": 25,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 25
              },
              {
                "id": 1542,
                "name": "摩浦叶",
                "secretName": "摩浦叶",
                "description": "解除混乱的平原植物",
                "image": 23024,
                "cost": 20,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 20
              },
              {
                "id": 1543,
                "name": "西伦恩根",
                "secretName": "西伦恩根",
                "description": "解除酒醉的乾燥地带植物",
                "image": 23028,
                "cost": 20,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 20
              },
              {
                "id": 1545,
                "name": "菲恩叶",
                "secretName": "菲恩叶",
                "description": "解除睡眠的海边植物",
                "image": 23025,
                "cost": 30,
                "type": 16,
                "useField": 1,
                "target": 1,
                "level": 0,
                "price": 30
              }
            ]
          }
        },
        {
          "id": "2005-11-8-5782",
          "name": "玛丽娜丝的护士",
          "x": 11,
          "y": 8,
          "type": "WindowHealer",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_winhealer",
          "template": "npcgen_winhealer",
          "graphic": "16012"
        },
        {
          "id": "2005-18-7-5784",
          "name": "玛丽娜丝的医生",
          "x": 18,
          "y": 7,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2005_18_7",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/msg_2005_18_7",
          "template": "npcgen_man",
          "graphic": "16024"
        },
        {
          "id": "2005-19-15-5785",
          "name": "美容师",
          "x": 19,
          "y": 15,
          "type": "Charm",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "npcgen_charm",
          "template": "npcgen_charm",
          "graphic": "16065"
        },
        {
          "id": "2005-10-15-6484",
          "name": "Warp",
          "x": 10,
          "y": 15,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2005-10-16-6486",
          "name": "Warp",
          "x": 10,
          "y": 16,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2000-0",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (66,82) | 入口 2 格 (10,15)-(10,16)",
          "to": "2000",
          "x": 10,
          "y": 16,
          "bounds": [
            10,
            15,
            10,
            16
          ],
          "target": [
            66,
            82
          ],
          "tiles": [
            {
              "x": 10,
              "y": 15,
              "target": [
                66,
                82
              ]
            },
            {
              "x": 10,
              "y": 16,
              "target": [
                66,
                82
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2000-1",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (66,82) | 入口 2 格 (25,49)-(26,49)",
          "to": "2000",
          "x": 26,
          "y": 49,
          "bounds": [
            25,
            49,
            26,
            49
          ],
          "target": [
            66,
            82
          ],
          "tiles": [
            {
              "x": 25,
              "y": 49,
              "target": [
                66,
                81
              ]
            },
            {
              "x": 26,
              "y": 49,
              "target": [
                66,
                82
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2006": {
      "id": "2006",
      "floorId": 2006,
      "name": "玛丽娜丝的村长家",
      "mapFile": "/data/maps/2006.ls2map",
      "clientMapFile": "/data/client-maps/2006.dat",
      "clientMapSource": "公益石器时代/map/2006.dat",
      "summary": "玛丽娜丝的村长家 | floor=2006 | 40x30 | ref___data/map/sainasu/marinasu/2006",
      "size": [
        40,
        30
      ],
      "spawn": [
        20,
        21
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "2006-15-12-7138",
          "name": "战斗指导员",
          "x": 15,
          "y": 12,
          "type": "Familyman",
          "dialogue": "4",
          "dialogueLines": [
            "4",
            "我是这个村子的战斗指导员！你想了解如何快速获取经验以及了解人们都在哪里战斗吗？请选择你的等级我将告诉你哪里最适合你前往！",
            "《等级01～20》",
            "《等级20～40》",
            "《等级40～60》",
            "《等级60～80》",
            "2",
            "你想了解哪一方面。"
          ],
          "source": "ref___data/npc/newguest/familyman.create",
          "script": "conff:newguest/familyman.conf",
          "template": "familyman",
          "graphic": "16062"
        },
        {
          "id": "2006-25-15-7710",
          "name": "占卜师",
          "x": 25,
          "y": 15,
          "type": "LuckyMan",
          "dialogue": "想要我帮你占卜今日运势的话",
          "dialogueLines": [
            "想要我帮你占卜今日运势的话",
            "S是少不了的...。",
            "今天你的运势非常不好喔...。最好小心一点。",
            "凶...真糟糕...。",
            "虽然不是说非常好，不过只要你努力的话还是有机会的...。",
            "小吉....吧..",
            "嗯...普普通通啦！",
            "不好也不坏。"
          ],
          "source": "ref___data/npc/sainasu/uranai.create",
          "script": "file:sainasu/uranai",
          "template": "luckyman",
          "graphic": "16034"
        },
        {
          "id": "2006-29-16-1324",
          "name": "家族管理员",
          "x": 29,
          "y": 16,
          "type": "Familyman",
          "dialogue": "2",
          "dialogueLines": [
            "2",
            "我是这个村子里的家族管理员！",
            "有什么我可以为你服务的吗？",
            "介绍家族功能",
            "申请成立新的家族",
            "申请加入现有家族",
            "退出或者解散家族",
            "想离开你的族人们了吗？"
          ],
          "source": "ref___data/npc/family/familyman.create",
          "script": "conff:family/familyman.conf",
          "template": "familyman",
          "graphic": "16030"
        },
        {
          "id": "2006-14-18-7719",
          "name": "村子里的万事通",
          "x": 14,
          "y": 18,
          "type": "Windowman",
          "dialogue": "2",
          "dialogueLines": [
            "2",
            "我是这个村子里的万事通啦！",
            "你想知道什么吗？",
            "关于操作的方法",
            "关于系统按钮",
            "关于宠物",
            "关于对战",
            "关于操作吗？"
          ],
          "source": "ref___data/npc/sainasu/windowman.create",
          "script": "conff:sainasu/manual.conf",
          "template": "windowman",
          "graphic": "16002"
        },
        {
          "id": "2006-29-20-1315",
          "name": "家族银行",
          "x": 29,
          "y": 20,
          "type": "Bankman",
          "dialogue": "2",
          "dialogueLines": [
            "2",
            "我是这个家族的银行管理员！",
            "你想查看自己的存款金额吗？",
            "家族个人帐户",
            "家族共同帐户"
          ],
          "source": "ref___data/npc/family/bankman.create",
          "script": "conff:family/bankman.conf",
          "template": "bankman",
          "graphic": "16017"
        },
        {
          "id": "2006-23-14-5787",
          "name": "村长的儿子",
          "x": 23,
          "y": 14,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2006_23_14",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/msg_2006_23_14",
          "template": "changeevent",
          "graphic": "16203"
        },
        {
          "id": "2006-20-14-5786",
          "name": "玛丽娜丝的村长",
          "x": 20,
          "y": 14,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_2006_20_14",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/shop_m.create",
          "script": "file:genout/msg_2006_20_14",
          "template": "npcgen_man",
          "graphic": "16001"
        },
        {
          "id": "2006-23-19-1341",
          "name": "家族留言版",
          "x": 23,
          "y": 19,
          "type": "FmDengon",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/family/fmdengon.create",
          "script": "npcgen_fmdengon",
          "template": "npcgen_fmdengon",
          "graphic": "10062"
        },
        {
          "id": "2006-20-21-6488",
          "name": "Warp",
          "x": 20,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2006-21-21-6490",
          "name": "Warp",
          "x": 21,
          "y": 21,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/warp_y.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2000-0",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (57,48) | 入口 2 格 (20,21)-(21,21)",
          "to": "2000",
          "x": 21,
          "y": 21,
          "bounds": [
            20,
            21,
            21,
            21
          ],
          "target": [
            57,
            48
          ],
          "tiles": [
            {
              "x": 20,
              "y": 21,
              "target": [
                56,
                48
              ]
            },
            {
              "x": 21,
              "y": 21,
              "target": [
                57,
                48
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2020": {
      "id": "2020",
      "floorId": 2020,
      "name": "玛丽娜丝道场柜台",
      "mapFile": "/data/maps/2020.ls2map",
      "clientMapFile": "/data/client-maps/2020.dat",
      "clientMapSource": "公益石器时代/map/2020.dat",
      "summary": "玛丽娜丝道场柜台 | floor=2020 | 25x25 | ref___data/map/quiz/2020",
      "size": [
        25,
        25
      ],
      "spawn": [
        4,
        12
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "2020-18-11-7311",
          "name": "入场卷贩售人",
          "x": 18,
          "y": 11,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/quiz/uketuke",
          "dialogueLines": [],
          "source": "ref___data/npc/quiz/quiz.create",
          "script": "file:quiz/uketuke",
          "template": "changeevent",
          "graphic": "16065"
        },
        {
          "id": "2020-18-13-7310",
          "name": "入场卷贩售人",
          "x": 18,
          "y": 13,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/quiz/uketuke",
          "dialogueLines": [],
          "source": "ref___data/npc/quiz/quiz.create",
          "script": "file:quiz/uketuke",
          "template": "changeevent",
          "graphic": "16065"
        },
        {
          "id": "2020-11-9-5293",
          "name": "Warp",
          "x": 11,
          "y": 9,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/quiz.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2020-11-9-5295",
          "name": "Warp",
          "x": 11,
          "y": 9,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/quiz.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2020-12-9-5291",
          "name": "Warp",
          "x": 12,
          "y": 9,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/quiz.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2020-4-12-5290",
          "name": "Warp",
          "x": 4,
          "y": 12,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/quiz.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2000-0",
          "label": "去 玛丽娜丝渔村",
          "detail": "玛丽娜丝渔村 | floor 2000 | 目标 (69,51) | 入口 (4,12)",
          "to": "2000",
          "x": 4,
          "y": 12,
          "bounds": [
            4,
            12,
            4,
            12
          ],
          "target": [
            69,
            51
          ],
          "tiles": [
            {
              "x": 4,
              "y": 12,
              "target": [
                69,
                51
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2030": {
      "id": "2030",
      "floorId": 2030,
      "name": "玛丽娜丝的庄园",
      "mapFile": "/data/maps/2030.ls2map",
      "clientMapFile": "/data/client-maps/2030.dat",
      "clientMapSource": "公益石器时代/map/2030.dat",
      "summary": "玛丽娜丝的庄园 | floor=2030 | 80x80 | ref___data/map/family/200/2030",
      "size": [
        80,
        80
      ],
      "spawn": [
        65,
        62
      ],
      "encounterPets": [
        1018
      ],
      "npcs": [
        {
          "id": "2030-55-16-1464",
          "name": "骑乘训练师",
          "x": 55,
          "y": 16,
          "type": "Riderman",
          "dialogue": "2",
          "dialogueLines": [
            "2",
            "我是这个村子里的骑乘训练师！",
            "你想办什么吗？",
            "关于骑乘宠物",
            "查询可骑乘的宠物",
            "学习骑乘宠物",
            "你要参加那一种课程呢？",
            "初级班 (能骑乘 Lv40 以下的宠物)"
          ],
          "source": "ref___data/npc/family/riderman.create",
          "script": "conff:family/riderman.conf",
          "template": "riderman",
          "graphic": "16002"
        },
        {
          "id": "2030-63-58-1405",
          "name": "通行证贩卖员",
          "x": 63,
          "y": 58,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/family/npc/familyshop2.create",
          "script": "file:family/npc/shop2_5",
          "template": "npcgen_shop",
          "graphic": "16036",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/family/npc/shop2_5",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "想要",
              "kau",
              "buy"
            ],
            "sellWords": [
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 19331,
                "name": "家族商店通行证",
                "secretName": "家族商店通行证",
                "description": "进入玛丽娜丝庄园专属商店必要的通行证明",
                "image": 24176,
                "cost": 1000,
                "type": 16,
                "useField": 2,
                "target": 0,
                "level": 0,
                "price": 1000
              }
            ]
          }
        },
        {
          "id": "2030-60-41-1468",
          "name": "踢馆登记人",
          "x": 60,
          "y": 41,
          "type": "ManorSman",
          "dialogue": "脚本入口：ref___data/npc/family/manorsman.arg2",
          "dialogueLines": [],
          "source": "ref___data/npc/family/scheduleman.create",
          "script": "file:family/manorsman.arg2",
          "template": "manorsman",
          "graphic": "16061"
        },
        {
          "id": "2030-59-43-4155",
          "name": "家族召唤员",
          "x": 59,
          "y": 43,
          "type": "FMPKCallMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_2030_59_43",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family.create",
          "script": "file:genout/wpm_2030_59_43",
          "template": "npcgen_fmpkcallman",
          "graphic": "16203",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "2030",
              "floor": 2030,
              "x": 59,
              "y": 44
            },
            "free": "",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "",
            "payMessage": "",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_2030_59_43"
          }
        },
        {
          "id": "2030-62-61-4156",
          "name": "看板",
          "x": 62,
          "y": 61,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_2030_62_61",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family.create",
          "script": "file:genout/signb_2030_62_61",
          "template": "npcgen_signboard",
          "graphic": "10061"
        },
        {
          "id": "2030-58-16-7437",
          "name": "虎的训练师",
          "x": 58,
          "y": 16,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/sa60/newbie/m_tiger",
          "dialogueLines": [],
          "source": "ref___data/npc/sa60/newbie/tiger.create",
          "script": "file:sa60/newbie/m_tiger",
          "template": "npcgen_warpman",
          "graphic": "16354"
        },
        {
          "id": "2030-56-27-4151",
          "name": "家族守门员",
          "x": 56,
          "y": 27,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_2030_56_27",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family.create",
          "script": "file:genout/wpm_2030_56_27",
          "template": "npcgen_warpman",
          "graphic": "16207",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "2031",
              "floor": 2031,
              "x": 0,
              "y": 10
            },
            "free": "ITEM=19002",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "我是家族守护警卫！这里是族长的家，你要进入吗？",
            "payMessage": "这里是族长的家，想通过这里见族长，身分必须是家族正式成员或拥有邀请函才可进入。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_2030_56_27"
          }
        },
        {
          "id": "2030-61-45-4153",
          "name": "家族对战向导",
          "x": 61,
          "y": 45,
          "type": "FMWarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_2030_61_45",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family.create",
          "script": "file:genout/wpm_2030_61_45",
          "template": "npcgen_fmwarpman",
          "graphic": "16205"
        },
        {
          "id": "2030-30-52-1408",
          "name": "商店警卫",
          "x": 30,
          "y": 52,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/family/npc/wpm2_3",
          "dialogueLines": [],
          "source": "ref___data/npc/family/npc/familyshop2.create",
          "script": "file:family/npc/wpm2_3",
          "template": "npcgen_warpman",
          "graphic": "16126",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "2036",
              "floor": 2036,
              "x": 5,
              "y": 11
            },
            "free": "LV>0&MANOR=1",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "我是商店警卫！你要进入吗？",
            "payMessage": "我是商店警卫！你要进入吗？ 进入前请您确认您是拥有该庄园的家族成员。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/family/npc/wpm2_3"
          }
        },
        {
          "id": "2030-45-62-1406",
          "name": "商店警卫",
          "x": 45,
          "y": 62,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/family/npc/wpm2_1",
          "dialogueLines": [],
          "source": "ref___data/npc/family/npc/familyshop2.create",
          "script": "file:family/npc/wpm2_1",
          "template": "npcgen_warpman",
          "graphic": "16120",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "2037",
              "floor": 2037,
              "x": 0,
              "y": 6
            },
            "free": "ITEM=19331",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "我是商店警卫！你要进入吗？",
            "payMessage": "我是商店警卫！你要进入吗？ 进入前请您确认身上拥有通行证，除非您是拥有该庄园的家族成员。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/family/npc/wpm2_1"
          }
        },
        {
          "id": "2030-31-65-1407",
          "name": "商店警卫",
          "x": 31,
          "y": 65,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/family/npc/wpm2_2",
          "dialogueLines": [],
          "source": "ref___data/npc/family/npc/familyshop2.create",
          "script": "file:family/npc/wpm2_2",
          "template": "npcgen_warpman",
          "graphic": "16121",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "2038",
              "floor": 2038,
              "x": 0,
              "y": 7
            },
            "free": "ITEM=19331",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "我是商店警卫！你要进入吗？",
            "payMessage": "我是商店警卫！你要进入吗？ 进入前请您确认身上拥有通行证，除非您是拥有该庄园的家族成员。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/family/npc/wpm2_2"
          }
        },
        {
          "id": "2030-46-30-4258",
          "name": "Warp",
          "x": 46,
          "y": 30,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-47-30-4260",
          "name": "Warp",
          "x": 47,
          "y": 30,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-34-40-4264",
          "name": "Warp",
          "x": 34,
          "y": 40,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-35-40-4266",
          "name": "Warp",
          "x": 35,
          "y": 40,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-65-63-4249",
          "name": "Warp",
          "x": 65,
          "y": 63,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-64-64-4250",
          "name": "Warp",
          "x": 64,
          "y": 64,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-65-64-4253",
          "name": "Warp",
          "x": 65,
          "y": 64,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-63-65-4251",
          "name": "Warp",
          "x": 63,
          "y": 65,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-64-65-4254",
          "name": "Warp",
          "x": 64,
          "y": 65,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-62-66-4252",
          "name": "Warp",
          "x": 62,
          "y": 66,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2030-63-66-4255",
          "name": "Warp",
          "x": 63,
          "y": 66,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (72,588) | 入口 7 格 (62,63)-(65,66)",
          "to": "100",
          "x": 64,
          "y": 65,
          "bounds": [
            62,
            63,
            65,
            66
          ],
          "target": [
            72,
            588
          ],
          "tiles": [
            {
              "x": 65,
              "y": 63,
              "target": [
                74,
                586
              ]
            },
            {
              "x": 64,
              "y": 64,
              "target": [
                73,
                587
              ]
            },
            {
              "x": 63,
              "y": 65,
              "target": [
                72,
                588
              ]
            },
            {
              "x": 62,
              "y": 66,
              "target": [
                71,
                589
              ]
            },
            {
              "x": 65,
              "y": 64,
              "target": [
                73,
                587
              ]
            },
            {
              "x": 64,
              "y": 65,
              "target": [
                72,
                588
              ]
            },
            {
              "x": 63,
              "y": 66,
              "target": [
                71,
                589
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2033-1",
          "label": "去 玛丽娜丝庄园聊天柜台",
          "detail": "玛丽娜丝庄园聊天柜台 | floor 2033 | 目标 (5,11) | 入口 2 格 (46,30)-(47,30)",
          "to": "2033",
          "x": 47,
          "y": 30,
          "bounds": [
            46,
            30,
            47,
            30
          ],
          "target": [
            5,
            11
          ],
          "tiles": [
            {
              "x": 46,
              "y": 30,
              "target": [
                4,
                11
              ]
            },
            {
              "x": 47,
              "y": 30,
              "target": [
                5,
                11
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "2035-2",
          "label": "去 庄园素材贩售店|00",
          "detail": "庄园素材贩售店|00 | floor 2035 | 目标 (6,11) | 入口 2 格 (34,40)-(35,40)",
          "to": "2035",
          "x": 35,
          "y": 40,
          "bounds": [
            34,
            40,
            35,
            40
          ],
          "target": [
            6,
            11
          ],
          "tiles": [
            {
              "x": 34,
              "y": 40,
              "target": [
                5,
                11
              ]
            },
            {
              "x": 35,
              "y": 40,
              "target": [
                6,
                11
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2033": {
      "id": "2033",
      "floorId": 2033,
      "name": "玛丽娜丝庄园聊天柜台",
      "mapFile": "/data/maps/2033.ls2map",
      "clientMapFile": "/data/client-maps/2033.dat",
      "clientMapSource": "公益石器时代/map/2033.dat",
      "summary": "玛丽娜丝庄园聊天柜台 | floor=2033 | 12x12 | ref___data/map/family/200/2033",
      "size": [
        12,
        12
      ],
      "spawn": [
        4,
        11
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "2033-4-3-4152",
          "name": "家族守门员",
          "x": 4,
          "y": 3,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/genout/wpm_2033_4_3",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family.create",
          "script": "file:genout/wpm_2033_4_3",
          "template": "npcgen_warpman",
          "graphic": "16203",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "2034",
              "floor": 2034,
              "x": 10,
              "y": 18
            },
            "free": "ITEM=19002",
            "money": "",
            "cost": null,
            "deleteItems": [
              19002
            ],
            "freeMessage": "我是家族守护警卫！你要进入吗？",
            "payMessage": "我是商店警卫！你要进入吗？ 进入前请您确认身上拥有通行证，除非您是拥有该庄园的家族成员。",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "无法以团队入场。 请把团队解散之后再个别入场。",
            "warpMessage": "",
            "source": "ref___data/npc/genout/wpm_2033_4_3"
          }
        },
        {
          "id": "2033-4-11-4259",
          "name": "Warp",
          "x": 4,
          "y": 11,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2033-5-11-4261",
          "name": "Warp",
          "x": 5,
          "y": 11,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2030-0",
          "label": "去 玛丽娜丝的庄园",
          "detail": "玛丽娜丝的庄园 | floor 2030 | 目标 (47,30) | 入口 2 格 (4,11)-(5,11)",
          "to": "2030",
          "x": 5,
          "y": 11,
          "bounds": [
            4,
            11,
            5,
            11
          ],
          "target": [
            47,
            30
          ],
          "tiles": [
            {
              "x": 4,
              "y": 11,
              "target": [
                46,
                30
              ]
            },
            {
              "x": 5,
              "y": 11,
              "target": [
                47,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "2035": {
      "id": "2035",
      "floorId": 2035,
      "name": "庄园素材贩售店|00",
      "mapFile": "/data/maps/2035.ls2map",
      "clientMapFile": "/data/client-maps/2035.dat",
      "clientMapSource": "公益石器时代/map/2035.dat",
      "summary": "庄园素材贩售店|00 | floor=2035 | 12x12 | ref___data/map/family/200/2035",
      "size": [
        12,
        12
      ],
      "spawn": [
        5,
        11
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "2035-8-8-1402",
          "name": "贩卖服务员",
          "x": 8,
          "y": 8,
          "type": "ItemShop",
          "dialogue": "欢迎光临！",
          "dialogueLines": [
            "欢迎光临！"
          ],
          "source": "ref___data/npc/family/npc/familyshop2.create",
          "script": "file:family/npc/shop2_2",
          "template": "npcgen_shop",
          "graphic": "16018",
          "trade": {
            "kind": "shop",
            "source": "ref___data/npc/family/npc/shop2_2",
            "buyRate": 1,
            "sellRate": 0.5,
            "buyWords": [
              "买",
              "想要",
              "kau",
              "buy"
            ],
            "sellWords": [
              "卖",
              "sell",
              "uru"
            ],
            "mainMessage": "欢迎光临！",
            "items": [
              {
                "id": 11879,
                "name": "千年龟的壳",
                "secretName": "千年龟的壳",
                "description": "壳的成分 10",
                "image": 24148,
                "cost": 27000,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 27000
              },
              {
                "id": 13081,
                "name": "未知的壳",
                "secretName": "未知的壳",
                "description": "壳的成分 11",
                "image": 23907,
                "cost": 34000,
                "type": 16,
                "useField": 0,
                "target": 0,
                "level": 0,
                "price": 34000
              }
            ]
          }
        },
        {
          "id": "2035-5-11-4265",
          "name": "Warp",
          "x": 5,
          "y": 11,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "2035-6-11-4267",
          "name": "Warp",
          "x": 6,
          "y": 11,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/family_warp.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "2030-0",
          "label": "去 玛丽娜丝的庄园",
          "detail": "玛丽娜丝的庄园 | floor 2030 | 目标 (35,40) | 入口 2 格 (5,11)-(6,11)",
          "to": "2030",
          "x": 6,
          "y": 11,
          "bounds": [
            5,
            11,
            6,
            11
          ],
          "target": [
            35,
            40
          ],
          "tiles": [
            {
              "x": 5,
              "y": 11,
              "target": [
                34,
                40
              ]
            },
            {
              "x": 6,
              "y": 11,
              "target": [
                35,
                40
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "8200": {
      "id": "8200",
      "floorId": 8200,
      "name": "英雄战场|8",
      "mapFile": "/data/maps/8200.ls2map",
      "clientMapFile": "/data/client-maps/8200.dat",
      "clientMapSource": "公益石器时代/map/8200.dat",
      "summary": "英雄战场|8 | floor=8200 | 220x160 | ref___data/map/hero/8200",
      "size": [
        220,
        160
      ],
      "spawn": [
        216,
        6
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "8200-30-3-6825",
          "name": "守灵者十",
          "x": 30,
          "y": 3,
          "type": "NPCEnemy",
          "dialogue": "你知道你闯入宾登斯家族支系之贝瑞达家族，乱闯入者死路一条。",
          "dialogueLines": [
            "你知道你闯入宾登斯家族支系之贝瑞达家族，乱闯入者死路一条。"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic10.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic10.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "你知道你闯入宾登斯家族支系之贝瑞达家族，乱闯入者死路一条。"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第十一层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8200",
              "floor": 8200,
              "x": 25,
              "y": 87
            }
          }
        },
        {
          "id": "8200-96-6-6822",
          "name": "守灵者七",
          "x": 96,
          "y": 6,
          "type": "NPCEnemy",
          "dialogue": "墓园的秘密你永远也别想知道！因为？？？你的实力只够给我打二拳而已。",
          "dialogueLines": [
            "墓园的秘密你永远也别想知道！因为？？？你的实力只够给我打二拳而已。"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic7.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic7.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "墓园的秘密你永远也别想知道！因为？？？你的实力只够给我打二拳而已。"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第八层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8200",
              "floor": 8200,
              "x": 71,
              "y": 74
            }
          }
        },
        {
          "id": "8200-216-28-6816",
          "name": "守灵者一",
          "x": 216,
          "y": 28,
          "type": "NPCEnemy",
          "dialogue": "你知道你闯入宾登斯家族支系之贝瑞达家族，乱闯入者死路一条。",
          "dialogueLines": [
            "你知道你闯入宾登斯家族支系之贝瑞达家族，乱闯入者死路一条。",
            "完全看不出来你像个英雄，再去练个几年再来吧。"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic1.arg",
          "template": "sb_dou",
          "graphic": "100091",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "8200",
              "floor": 8200,
              "x": 191,
              "y": 90
            },
            "free": "LV>0",
            "money": "",
            "cost": null,
            "deleteItems": [],
            "freeMessage": "",
            "payMessage": "",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "",
            "warpMessage": "",
            "source": "ref___data/npc/heroic/heroic1.arg"
          },
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic1.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2289
            ],
            "askBattleMessages": [
              "你知道你闯入宾登斯家族支系之贝瑞达家族，乱闯入者死路一条。"
            ],
            "startMessage": "",
            "deniedMessage": "完全看不出来你像个英雄，再去练个几年再来吧。",
            "endMessage": "就算你打败我了！在第二层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": null
          }
        },
        {
          "id": "8200-158-33-6819",
          "name": "守灵者四",
          "x": 158,
          "y": 33,
          "type": "NPCEnemy",
          "dialogue": "咦！有没有听到墓园里灵魂的哀嚎声呢？你也想当下一个吗？哈哈哈～～～～",
          "dialogueLines": [
            "咦！有没有听到墓园里灵魂的哀嚎声呢？你也想当下一个吗？哈哈哈～～～～"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic4.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic4.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "咦！有没有听到墓园里灵魂的哀嚎声呢？你也想当下一个吗？哈哈哈～～～～"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第五层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8200",
              "floor": 8200,
              "x": 128,
              "y": 90
            }
          }
        },
        {
          "id": "8200-8-64-6826",
          "name": "守灵者十一",
          "x": 8,
          "y": 64,
          "type": "NPCEnemy",
          "dialogue": "你用走的进来，我就让你飞着出去！",
          "dialogueLines": [
            "你用走的进来，我就让你飞着出去！"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic11.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic11.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "你用走的进来，我就让你飞着出去！"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第十二层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8212",
              "floor": 8212,
              "x": 197,
              "y": 29
            }
          }
        },
        {
          "id": "8200-153-66-6820",
          "name": "守灵者五",
          "x": 153,
          "y": 66,
          "type": "NPCEnemy",
          "dialogue": "小心一点！我可不会手下留情的。",
          "dialogueLines": [
            "小心一点！我可不会手下留情的。"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic5.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic5.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "小心一点！我可不会手下留情的。"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第六层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8200",
              "floor": 8200,
              "x": 132,
              "y": 152
            }
          }
        },
        {
          "id": "8200-212-66-6817",
          "name": "守灵者二",
          "x": 212,
          "y": 66,
          "type": "NPCEnemy",
          "dialogue": "依我看来你的战斗力好像还蛮强的（我要小心应付才行）。",
          "dialogueLines": [
            "依我看来你的战斗力好像还蛮强的（我要小心应付才行）。"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic2.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic2.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "依我看来你的战斗力好像还蛮强的（我要小心应付才行）。"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第三层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8200",
              "floor": 8200,
              "x": 193,
              "y": 145
            }
          }
        },
        {
          "id": "8200-96-80-6823",
          "name": "守灵者八",
          "x": 96,
          "y": 80,
          "type": "NPCEnemy",
          "dialogue": "这里不是你该来的地方，快回去吧！否则别怪我～～～出手啰！",
          "dialogueLines": [
            "这里不是你该来的地方，快回去吧！否则别怪我～～～出手啰！"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic8.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic8.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "这里不是你该来的地方，快回去吧！否则别怪我～～～出手啰！"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第九层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8200",
              "floor": 8200,
              "x": 72,
              "y": 153
            }
          }
        },
        {
          "id": "8200-150-124-6821",
          "name": "守灵者六",
          "x": 150,
          "y": 124,
          "type": "NPCEnemy",
          "dialogue": "请问你是来观光的吗？滚回去吧！",
          "dialogueLines": [
            "请问你是来观光的吗？滚回去吧！"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic6.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic6.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "请问你是来观光的吗？滚回去吧！"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第七层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8200",
              "floor": 8200,
              "x": 71,
              "y": 28
            }
          }
        },
        {
          "id": "8200-97-130-6824",
          "name": "守灵者九",
          "x": 97,
          "y": 130,
          "type": "NPCEnemy",
          "dialogue": "杀！！",
          "dialogueLines": [
            "杀！！"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic9.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic9.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "杀！！"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第十层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8200",
              "floor": 8200,
              "x": 24,
              "y": 30
            }
          }
        },
        {
          "id": "8200-216-152-6818",
          "name": "守灵者三",
          "x": 216,
          "y": 152,
          "type": "NPCEnemy",
          "dialogue": "想和我过招还怕没有机会吗，只怕你不堪一击！！！",
          "dialogueLines": [
            "想和我过招还怕没有机会吗，只怕你不堪一击！！！"
          ],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic3.arg",
          "template": "sb_dou",
          "graphic": "101490",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/heroic/heroic3.arg",
            "entype": 2,
            "enemyNos": [
              2262,
              2263,
              2264,
              2265,
              2266,
              2267,
              2268,
              2269,
              2270,
              2271,
              2272,
              2273,
              2274,
              2275,
              2276,
              2277,
              2278,
              2279,
              2280,
              2281,
              2282,
              2283,
              2284,
              2285
            ],
            "askBattleMessages": [
              "想和我过招还怕没有机会吗，只怕你不堪一击！！！"
            ],
            "startMessage": "",
            "deniedMessage": "",
            "endMessage": "就算你打败我了！在第四层楼还是会有人守护着。",
            "dieAct": 1,
            "respawnSeconds": 0,
            "warp": {
              "mapId": "8200",
              "floor": 8200,
              "x": 135,
              "y": 23
            }
          }
        },
        {
          "id": "8200-215-11-6815",
          "name": "英雄战场公告",
          "x": 215,
          "y": 11,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/heroic/heroic.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "file:heroic/heroic.arg",
          "template": "changeevent",
          "graphic": "10069"
        },
        {
          "id": "8200-208-29-6949",
          "name": "小护士",
          "x": 208,
          "y": 29,
          "type": "WindowHealer",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/heroic/heroic.create",
          "script": "npcgen_winhealer",
          "template": "npcgen_winhealer",
          "graphic": "16012"
        },
        {
          "id": "8200-210-29-7736",
          "name": "英雄战场纪念碑",
          "x": 210,
          "y": 29,
          "type": "Alldoman",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/won/syu.create",
          "script": "npc_alldoman",
          "template": "npc_alldoman",
          "graphic": "10061"
        }
      ],
      "exits": [
        {
          "id": "8200-0",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (194,84)",
          "to": "8200",
          "x": 194,
          "y": 84,
          "bounds": [
            194,
            84,
            194,
            84
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 194,
              "y": 84,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-1",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (196,139)",
          "to": "8200",
          "x": 196,
          "y": 139,
          "bounds": [
            196,
            139,
            196,
            139
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 196,
              "y": 139,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-2",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (149,3)",
          "to": "8200",
          "x": 149,
          "y": 3,
          "bounds": [
            149,
            3,
            149,
            3
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 149,
              "y": 3,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-3",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (133,64)",
          "to": "8200",
          "x": 133,
          "y": 64,
          "bounds": [
            133,
            64,
            133,
            64
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 133,
              "y": 64,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-4",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (143,150)",
          "to": "8200",
          "x": 143,
          "y": 150,
          "bounds": [
            143,
            150,
            143,
            150
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 143,
              "y": 150,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-5",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (69,18)",
          "to": "8200",
          "x": 69,
          "y": 18,
          "bounds": [
            69,
            18,
            69,
            18
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 69,
              "y": 18,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-6",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (72,68)",
          "to": "8200",
          "x": 72,
          "y": 68,
          "bounds": [
            72,
            68,
            72,
            68
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 72,
              "y": 68,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-7",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (71,151)",
          "to": "8200",
          "x": 71,
          "y": 151,
          "bounds": [
            71,
            151,
            71,
            151
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 71,
              "y": 151,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-8",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (19,17)",
          "to": "8200",
          "x": 19,
          "y": 17,
          "bounds": [
            19,
            17,
            19,
            17
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 19,
              "y": 17,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "8200-9",
          "label": "去 英雄战场|8",
          "detail": "英雄战场|8 | floor 8200 | 目标 (210,30) | 入口 (25,86)",
          "to": "8200",
          "x": 25,
          "y": 86,
          "bounds": [
            25,
            86,
            25,
            86
          ],
          "target": [
            210,
            30
          ],
          "tiles": [
            {
              "x": 25,
              "y": 86,
              "target": [
                210,
                30
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        },
        {
          "id": "100-10",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (396,186) | 入口 (216,6)",
          "to": "100",
          "x": 216,
          "y": 6,
          "bounds": [
            216,
            6,
            216,
            6
          ],
          "target": [
            396,
            186
          ],
          "tiles": [
            {
              "x": 216,
              "y": 6,
              "target": [
                396,
                186
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "8216": {
      "id": "8216",
      "floorId": 8216,
      "name": "白狼勇士公会",
      "mapFile": "/data/maps/8216.ls2map",
      "clientMapFile": "/data/client-maps/8216.dat",
      "clientMapSource": "公益石器时代/map/8216.dat",
      "summary": "白狼勇士公会 | floor=8216 | 40x40 | ref___data/map/union/8216",
      "size": [
        40,
        40
      ],
      "spawn": [
        2,
        22
      ],
      "encounterPets": [],
      "npcs": [
        {
          "id": "8216-26-20-7566",
          "name": "技能导师肯尔特",
          "x": 26,
          "y": 20,
          "type": "welfare",
          "dialogue": "这是白狼勇士工公会，准备好要学技能了吗？",
          "dialogueLines": [
            "这是白狼勇士工公会，准备好要学技能了吗？"
          ],
          "source": "ref___data/npc/sa70/skill.create",
          "script": "file:sa70/warsk",
          "template": "ProfessionShop",
          "graphic": "16185"
        },
        {
          "id": "8216-19-11-7628",
          "name": "凯莉",
          "x": 19,
          "y": 11,
          "type": "ItemchangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa80/classeq/wareq.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa80/classeq/classeq.create",
          "script": "file:sa80/classeq/wareq.arg",
          "template": "ITEMCHANGE",
          "graphic": "16916"
        },
        {
          "id": "8216-6-23-7516",
          "name": "公会解说员",
          "x": 6,
          "y": 23,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/class/war3",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/class/war.create",
          "script": "file:sa70/class/war3",
          "template": "changeevent",
          "graphic": "16183"
        },
        {
          "id": "8216-25-30-7517",
          "name": "马尔",
          "x": 25,
          "y": 30,
          "type": "ExChangeMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/class/clean",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/class/war.create",
          "script": "file:sa70/class/clean",
          "template": "changeevent",
          "graphic": "16339"
        },
        {
          "id": "8216-28-23-7514",
          "name": "拉斐尔",
          "x": 28,
          "y": 23,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/class/war.arg",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/class/war.create",
          "script": "file:sa70/class/war.arg",
          "template": "npcgen_warpman",
          "graphic": "16181",
          "warp": {
            "kind": "warpman",
            "target": {
              "mapId": "8219",
              "floor": 8219,
              "x": 153,
              "y": 5
            },
            "free": "LV>29&ENDEV!=4",
            "money": "",
            "cost": null,
            "deleteItems": [
              2112
            ],
            "freeMessage": "还没通过成人礼的试炼就想来就职，你也未免太自满了？",
            "payMessage": "",
            "normalMessage": "",
            "moneyMessage": "",
            "partyMessage": "请一个一个来嘿！！",
            "warpMessage": "",
            "source": "ref___data/npc/sa70/class/war.arg"
          }
        },
        {
          "id": "8216-26-26-7515",
          "name": "就职导师吉可因",
          "x": 26,
          "y": 26,
          "type": "WarpMan",
          "dialogue": "脚本入口：ref___data/npc/sa70/class/war2",
          "dialogueLines": [],
          "source": "ref___data/npc/sa70/class/war.create",
          "script": "file:sa70/class/war2",
          "template": "npcgen_warpman",
          "graphic": "16182"
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (653,609) | 入口 3 格 (2,22)-(2,24)",
          "to": "100",
          "x": 2,
          "y": 23,
          "bounds": [
            2,
            22,
            2,
            24
          ],
          "target": [
            653,
            609
          ],
          "tiles": [
            {
              "x": 2,
              "y": 22,
              "target": [
                653,
                608
              ]
            },
            {
              "x": 2,
              "y": 23,
              "target": [
                653,
                609
              ]
            },
            {
              "x": 2,
              "y": 24,
              "target": [
                653,
                610
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "10001": {
      "id": "10001",
      "floorId": 10001,
      "name": "阿布的洞窟地下１楼|00",
      "mapFile": "/data/maps/10001.ls2map",
      "clientMapFile": "/data/client-maps/10001.dat",
      "clientMapSource": "公益石器时代/map/10001.dat",
      "summary": "阿布的洞窟地下１楼|00 | floor=10001 | 50x50 | ref___data/map/sainasu/dungeon/dan_1-00-01",
      "size": [
        50,
        50
      ],
      "spawn": [
        40,
        3
      ],
      "encounterPets": [
        183,
        188,
        192
      ],
      "npcs": [
        {
          "id": "10001-16-4-1488",
          "name": "查罕族青年",
          "x": 16,
          "y": 4,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_10001_16_4",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/10000npc.create",
          "script": "file:genout/msg_10001_16_4",
          "template": "npcgen_man",
          "graphic": "16044"
        },
        {
          "id": "10001-40-3-2298",
          "name": "Warp",
          "x": 40,
          "y": 3,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "10001-25-42-2299",
          "name": "Warp",
          "x": 25,
          "y": 42,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (191,365) | 入口 (40,3)",
          "to": "100",
          "x": 40,
          "y": 3,
          "bounds": [
            40,
            3,
            40,
            3
          ],
          "target": [
            191,
            365
          ],
          "tiles": [
            {
              "x": 40,
              "y": 3,
              "target": [
                191,
                365
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "10101": {
      "id": "10101",
      "floorId": 10101,
      "name": "往柯尔克的道路１楼|00",
      "mapFile": "/data/maps/10101.ls2map",
      "clientMapFile": "/data/client-maps/10101.dat",
      "clientMapSource": "公益石器时代/map/10101.dat",
      "summary": "往柯尔克的道路１楼|00 | floor=10101 | 50x50 | ref___data/map/sainasu/dungeon/dan_1-01-01",
      "size": [
        50,
        50
      ],
      "spawn": [
        14,
        49
      ],
      "encounterPets": [
        206,
        209,
        210,
        213,
        216
      ],
      "npcs": [
        {
          "id": "10101-41-40-2314",
          "name": "Warp",
          "x": 41,
          "y": 40,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "10101-14-49-2313",
          "name": "Warp",
          "x": 14,
          "y": 49,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (318,428) | 入口 (14,49)",
          "to": "100",
          "x": 14,
          "y": 49,
          "bounds": [
            14,
            49,
            14,
            49
          ],
          "target": [
            318,
            428
          ],
          "tiles": [
            {
              "x": 14,
              "y": 49,
              "target": [
                318,
                428
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "10701": {
      "id": "10701",
      "floorId": 10701,
      "name": "盗贼的洞窟地下１楼|0K",
      "mapFile": "/data/maps/10701.ls2map",
      "clientMapFile": "/data/client-maps/10701.dat",
      "clientMapSource": "公益石器时代/map/10701.dat",
      "summary": "盗贼的洞窟地下１楼|0K | floor=10701 | 80x80 | ref___data/map/sainasu/dungeon/10701",
      "size": [
        80,
        80
      ],
      "spawn": [
        76,
        67
      ],
      "encounterPets": [
        380,
        383
      ],
      "npcs": [
        {
          "id": "10701-23-51-22",
          "name": "怪力的小阵",
          "x": 23,
          "y": 51,
          "type": "NPCEnemy",
          "dialogue": "那、那是我们的脚印…",
          "dialogueLines": [
            "那、那是我们的脚印…",
            "你做什么？我可是很忙的。到那边去。真是麻烦的家伙…。"
          ],
          "source": "ref___data/npc/100/sb_nusu.create",
          "script": "file:100/sb_nusu1.arg",
          "template": "sb_n1",
          "graphic": "100405",
          "npcEnemy": {
            "kind": "NPCEnemy",
            "source": "ref___data/npc/100/sb_nusu1.arg",
            "entype": 2,
            "enemyNos": [
              513,
              516
            ],
            "askBattleMessages": [
              "那、那是我们的脚印…",
              "被发现了就没办法了。",
              "过来！抢走它！！"
            ],
            "startMessage": "嘿嘿嘿。现在才道歉已经太晚了。",
            "deniedMessage": "你做什么？我可是很忙的。到那边去。真是麻烦的家伙…。",
            "endMessage": "畜、畜生…",
            "dieAct": 0,
            "respawnSeconds": 300,
            "warp": null
          }
        },
        {
          "id": "10701-12-4-1620",
          "name": "Warp",
          "x": 12,
          "y": 4,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/10701d.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "10701-76-67-1619",
          "name": "Warp",
          "x": 76,
          "y": 67,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/10701d.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (132,421) | 入口 (76,67)",
          "to": "100",
          "x": 76,
          "y": 67,
          "bounds": [
            76,
            67,
            76,
            67
          ],
          "target": [
            132,
            421
          ],
          "tiles": [
            {
              "x": 76,
              "y": 67,
              "target": [
                132,
                421
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "10901": {
      "id": "10901",
      "floorId": 10901,
      "name": "柯尔克的大坑道１楼",
      "mapFile": "/data/maps/10901.ls2map",
      "clientMapFile": "/data/client-maps/10901.dat",
      "clientMapSource": "公益石器时代/map/10901.dat",
      "summary": "柯尔克的大坑道１楼 | floor=10901 | 50x50 | ref___data/map/sainasu/dungeon/dan_1-09-01",
      "size": [
        50,
        50
      ],
      "spawn": [
        25,
        49
      ],
      "encounterPets": [
        424
      ],
      "npcs": [
        {
          "id": "10901-26-5-1634",
          "name": "看板",
          "x": 26,
          "y": 5,
          "type": "SignBoard",
          "dialogue": "脚本入口：ref___data/npc/genout/signb_10901_26_5",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/10900npc.create",
          "script": "file:genout/signb_10901_26_5",
          "template": "npcgen_signboard",
          "graphic": "10096"
        },
        {
          "id": "10901-46-6-1635",
          "name": "饲育员",
          "x": 46,
          "y": 6,
          "type": "TownPeople",
          "dialogue": "脚本入口：ref___data/npc/genout/msg_10901_46_6",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/10900npc.create",
          "script": "file:genout/msg_10901_46_6",
          "template": "npcgen_man",
          "graphic": "16209"
        },
        {
          "id": "10901-46-4-2416",
          "name": "Warp",
          "x": 46,
          "y": 4,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "10901-25-49-2393",
          "name": "Warp",
          "x": 25,
          "y": 49,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "10901-26-49-2395",
          "name": "Warp",
          "x": 26,
          "y": 49,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (237,445) | 入口 2 格 (25,49)-(26,49)",
          "to": "100",
          "x": 26,
          "y": 49,
          "bounds": [
            25,
            49,
            26,
            49
          ],
          "target": [
            237,
            445
          ],
          "tiles": [
            {
              "x": 25,
              "y": 49,
              "target": [
                237,
                445
              ]
            },
            {
              "x": 26,
              "y": 49,
              "target": [
                237,
                445
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "11001": {
      "id": "11001",
      "floorId": 11001,
      "name": "柯奥山的小洞窟１楼",
      "mapFile": "/data/maps/11001.ls2map",
      "clientMapFile": "/data/client-maps/11001.dat",
      "clientMapSource": "公益石器时代/map/11001.dat",
      "summary": "柯奥山的小洞窟１楼 | floor=11001 | 50x50 | ref___data/map/sainasu/dungeon/dan_1-10-01",
      "size": [
        50,
        50
      ],
      "spawn": [
        0,
        43
      ],
      "encounterPets": [
        361,
        364
      ],
      "npcs": [
        {
          "id": "11001-44-5-2434",
          "name": "Warp",
          "x": 44,
          "y": 5,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "11001-0-43-2431",
          "name": "Warp",
          "x": 0,
          "y": 43,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "11001-0-44-2433",
          "name": "Warp",
          "x": 0,
          "y": 44,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon00.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (328,633) | 入口 2 格 (0,43)-(0,44)",
          "to": "100",
          "x": 0,
          "y": 44,
          "bounds": [
            0,
            43,
            0,
            44
          ],
          "target": [
            328,
            633
          ],
          "tiles": [
            {
              "x": 0,
              "y": 43,
              "target": [
                328,
                633
              ]
            },
            {
              "x": 0,
              "y": 44,
              "target": [
                328,
                633
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    },
    "31401": {
      "id": "31401",
      "floorId": 31401,
      "name": "奇努伊的海底通路|10",
      "mapFile": "/data/maps/31401.ls2map",
      "clientMapFile": "/data/client-maps/31401.dat",
      "clientMapSource": "公益石器时代/map/31401.dat",
      "summary": "奇努伊的海底通路|10 | floor=31401 | 120x40 | ref___data/map/giiru/dungeon/dun_3-14-01",
      "size": [
        120,
        40
      ],
      "spawn": [
        12,
        2
      ],
      "encounterPets": [
        473,
        475,
        477,
        1218,
        1232,
        472
      ],
      "npcs": [
        {
          "id": "31401-12-2-2865",
          "name": "Warp",
          "x": 12,
          "y": 2,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon03.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        },
        {
          "id": "31401-94-27-2866",
          "name": "Warp",
          "x": 94,
          "y": 27,
          "type": "Warp",
          "dialogue": "脚本入口：未配置脚本参数",
          "dialogueLines": [],
          "source": "ref___data/npc/genout/dungeon03.create",
          "script": "npcgen_warp",
          "template": "npcgen_warp",
          "graphic": ""
        }
      ],
      "exits": [
        {
          "id": "100-0",
          "label": "去 萨伊那斯",
          "detail": "萨伊那斯 | floor 100 | 目标 (666,235) | 入口 (12,2)",
          "to": "100",
          "x": 12,
          "y": 2,
          "bounds": [
            12,
            2,
            12,
            2
          ],
          "target": [
            666,
            235
          ],
          "tiles": [
            {
              "x": 12,
              "y": 2,
              "target": [
                666,
                235
              ]
            }
          ],
          "source": "ref___data/map/mapwarp.txt"
        }
      ]
    }
  },
  "quests": {
    "samugiru-field-practice": {
      "id": "samugiru-field-practice",
      "title": "萨姆吉尔野外练习",
      "description": "萨姆吉尔的老师让新来的冒险者到村外确认野外宠物资料，完成一次战斗或捕获后回来报告。",
      "steps": [
        "向萨姆吉尔的老师打招呼。",
        "离开萨姆吉尔村，前往有野外遇敌资料的地图。",
        "击败或捕获一只野外宠物。",
        "回到萨姆吉尔的老师身边报告。"
      ],
      "reward": "经验 40 / 石币 120",
      "expReward": 40,
      "stoneReward": 120,
      "startNpcId": "1000-42-72-1505",
      "returnNpcId": "1000-42-72-1505",
      "objectives": {
        "visitEncounterMap": true,
        "fieldWin": true
      },
      "source": "ref___data/npc/genout/1000npc_m.create + ref___data/encount.txt"
    }
  }
};
