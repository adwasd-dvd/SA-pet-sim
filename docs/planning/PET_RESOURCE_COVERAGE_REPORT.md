# Pet Resource Coverage Report

Generated: 2026-05-19T08:37:15.544Z
Slim guide revision: `b1239ae2293c443473af36dc8626e87279d4d00b`

## Summary

- Atlas frames: 6803
- Enemybase static ImgNo coverage: 610/610 present, 0 missing.
- Classic-core encounter static ImgNo coverage: 34/34 present.
- Classic-core pet-like NPC graphics: 38
- Profile texture packs: 90

## Runtime Status

- Static pet frames: present and packed
- Field animation frames: not yet split into a pet-field-animation domain
- Battle animation frames: not yet split into a pet-battle-animation domain
- Current visual risk: The runtime can now find enemybase ImgNo frames, but map pets and pet panels still resolve to one static ImgNo instead of the original walk/stand/battle animation sets from spr_115/spradrn_115.
- Next step: Parse and map source animation records for classic-core pets, then add pet-field-animation and pet-battle-animation pack domains before switching runtime sprites away from static ImgNo fallbacks.

## Pack Domains

| Domain | IDs | Present | Missing |
| --- | ---: | ---: | ---: |
| ui-field | 36 | 36 | 0 |
| player-core | 72 | 72 | 0 |
| map-tiles | 3757 | 3757 | 0 |
| npc-field | 165 | 165 | 0 |
| pets-encounter | 34 | 34 | 0 |
| pets-static | 610 | 610 | 0 |

## Important Models

| TempNo | Name | ImgNo | Static Frame | Packs |
| ---: | --- | ---: | --- | --- |
| 1 | 乌力 | 100250 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 2 | 乌力乌力 | 100251 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 3 | 乌力斯坦 | 100252 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 4 | 乌力布鲁 | 100253 | yes | pets-static-all:pets-static |
| 5 | 黑乌力 | 100388 | yes | npc-field-core:npc-field, pets-static-all:pets-static |
| 6 | 乌力斯坦 | 100252 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 11 | 布比 | 100254 | yes | pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 12 | 金布伊 | 100255 | yes | pets-static-all:pets-static |
| 13 | 布伊 | 100256 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 14 | 布伊比 | 100257 | yes | npc-field-core:npc-field, pets-static-all:pets-static |
| 15 | 卡布伊 | 100258 | yes | pets-static-all:pets-static |
| 21 | 加美 | 100259 | yes | npc-field-core:npc-field, pets-static-all:pets-static |
| 23 | 加比奥 | 100261 | yes | pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 32 | 威威 | 100264 | yes | pets-static-all:pets-static |
| 39 | 猪雀 | 100370 | yes | pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 97 | 森林乌力 | 100250 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 100 | 奥卡洛斯 | 100371 | yes | pets-static-all:pets-static |
| 112 | 凯比 | 100296 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 114 | 凯比特 | 100298 | yes | pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 170 | 乌力王 | 101766 | yes | pets-static-all:pets-static |
| 252 | 布林帖斯 | 100352 | yes | pets-static-all:pets-static |
| 301 | 奥卡洛斯 | 100371 | yes | pets-static-all:pets-static |
| 311 | 布伊德 | 100375 | yes | pets-static-all:pets-static |
| 371 | 米恩斯特 | 101459 | yes | pets-static-all:pets-static |
| 586 | 乌力斯坦 | 100252 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 667 | 加比奥 | 100261 | yes | pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 678 | 乌力斯坦 | 100252 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static |
| 707 | 布伊德 | 100375 | yes | pets-static-all:pets-static |
| 725 | 扑满乌力 | 100820 | yes | pets-static-all:pets-static |
| 726 | 乌力莱德 | 100821 | yes | pets-static-all:pets-static |

## Classic Families

| Family | Rows | ImgNos | Static Missing | Packed Frames |
| --- | ---: | ---: | ---: | ---: |
| 乌力 | 21 | 11 | 0 | 11 |
| 布伊 | 10 | 7 | 0 | 7 |
| 加美/加比 | 12 | 7 | 0 | 7 |
| 威威 | 6 | 4 | 0 | 4 |
| 猪雀/火鸡 | 4 | 2 | 0 | 2 |
| 凯比 | 4 | 2 | 0 | 2 |
| 人龙 | 10 | 4 | 0 | 4 |
| 暴龙 | 6 | 3 | 0 | 3 |
| 雷龙 | 1 | 1 | 0 | 1 |
| 鲨鱼 | 4 | 2 | 0 | 2 |

## Pet-Like NPC Graphics

| Graphic | Names | Frame | Packs | Sample Source |
| ---: | --- | --- | --- | --- |
| 100015 | 古瓜, 沃喀 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 100 萨伊那斯 里奥 |
| 100037 | 九兄弟之一 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 1000 萨姆吉尔村 九兄弟之一 |
| 100110 | - | yes | npc-field-core:npc-field | 100 萨伊那斯 姆哈萨 |
| 100195 | - | yes | npc-field-core:npc-field | 3400 奇喀喀村鐋0 水的使者 |
| 100250 | 乌力, 森林乌力, 小乌乌, 禧 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1003 萨姆吉尔的宠物店 乌力 |
| 100251 | 乌力乌力 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 2000 玛丽娜丝渔村 乌力 |
| 100252 | 乌力斯坦, 小坦坦 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1003 萨姆吉尔的宠物店 乌力斯坦 |
| 100256 | 布伊 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1103 柯奥的宠物店 布伊 |
| 100257 | 布伊比 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 3103 塔姆塔姆的宠物店 布伊比 |
| 100259 | 加美, 爱丽儿队的加美 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 1212 柯尔克坑道管理事务所 加美 |
| 100265 | 乌卡鲁 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 1212 柯尔克坑道管理事务所 乌卡鲁 |
| 100267 | 贝洛恩 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 1203 柯尔克的宠物店 贝洛恩 |
| 100271 | 龟之盾, 龟之助 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1103 柯奥的宠物店 龟之盾 |
| 100277 | 特洛昆 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1203 柯尔克的宠物店 小特洛昆 |
| 100278 | 达克尔 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 3100 塔姆塔姆村 达克尔 |
| 100280 | 呼拔拔, 呼拔吉, 盗贼呼拔拔, 逃走呼拔拔 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1203 柯尔克的宠物店 呼拔拔 |
| 100291 | 克雷尔 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 3303 乌鲁力的宠物店 克雷尔 |
| 100293 | 克洛尔 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 3003 加加的宠物店 克洛尔 |
| 100294 | 里斯基, 利斯基 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 1212 柯尔克坑道管理事务所 利士奇 |
| 100295 | 卡比特 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1303 霍特尔的宠物店 卡比特 |
| 100296 | 凯比 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1303 霍特尔的宠物店 凯比 |
| 100297 | 昆伊 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1303 霍特尔的宠物店 昆伊 |
| 100326 | 卡拉卡利 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 1212 柯尔克坑道管理事务所 卡拉卡利 |
| 100335 | 多利诺布斯 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 1303 霍特尔的宠物店 多利诺布斯 |
| 100336 | 贝恩达斯 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 2003 玛丽娜丝的宠物店 贝恩达斯 |
| 100339 | 克邦凯斯 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 3203 多多的宠物店 克邦凯斯 |
| 100355 | 巨大玛恩摩, 玛恩摩 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 100 萨伊那斯 を禜そó |
| 100367 | 火鸡 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1303 霍特尔的宠物店 火鸡 |
| 100384 | 邦洛洛克斯, 钢格之龙 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 1403 卡坦的宠物店 邦洛洛克斯 |
| 100388 | 黑乌力 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 1000 萨姆吉尔村 黑乌力 |
| 100401 | 坏心眼的愿藏, 坑夫巴卡斯, PC团盗贼老大, 迪欧, 海盗喽罗 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 100 萨伊那斯 坏心眼的愿藏 |
| 100431 | 恶霸老大, 哥达, 哥达喽啰, 查罕乌鲁夫, 盗贼, 路痴的盗贼 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 10007 阿布的洞窟地下７楼 查罕·乌尔夫 |
| 100432 | 唐, 戴斯, 鲁乌 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 100 萨伊那斯 戴斯 |
| 100433 | - | yes | npc-field-core:npc-field | 100 萨伊那斯 盗贼 |
| 100434 | 达兹 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 100 萨伊那斯 达姿 |
| 100436 | 小毛贼, 尊尼, 恶霸老三, 查罕鲁德, 铁壁的小玛摩, JBA审查员 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 100 萨伊那斯 宝卡 |
| 100439 | 恶霸老二, 查罕奇鲁, 悟, 不良少年, 巴克的跟班 | yes | npc-field-core:npc-field, pets-static-all:pets-static | 10007 阿布的洞窟地下７楼 查罕·吉鲁 |
| 101178 | 吉比, 老鼠 | yes | npc-field-core:npc-field, pets-encounter-core:pets-encounter, pets-static-all:pets-static | 3000 加加村 偷吃的老鼠 |

## Animation Source Files

| File | Present | Bytes |
| --- | --- | ---: |
| spr_115.bin | yes | 8427600 |
| spradrn_115.bin | yes | 20316 |
| adrn_136.bin | yes | 31818080 |
| real_136.bin | yes | 1526587910 |

## Notes

- This report intentionally separates static enemybase ImgNo coverage from true field/battle animation coverage.
- Passing static coverage means PET STATUS and fallback field sprites can show original-source images; it does not prove walk/battle action sets are wired.
- Follow the slim guide by adding separate lazy packs for pet field animation and pet battle animation, rather than enlarging the boot atlas again.

