# Maestrale Kit for Azurlane

西北风套件，分为视图无关的核心和基于核心实现的视图两部分。

主要用于模拟碧蓝航线中舰船面板属性的计算、编队配置等。可调整舰船的等级、突破等级、好感、强化值、改造进度等所有参与白值运算的数值，可携带装备与兵装，可自由调整舰队科技提供的属性值，并实时计算舰船的最终面板。

## 安装

```shell
pnpm i maestrale
```

## 使用方式

加载游戏数据：

```ts
import { ShareCfg } from "maestrale";

await ShareCfg.load();
```

初始化舰队科技对象：

```ts
import { useTechnology } from "maestrale";

const technology = useTechnology();
```

现在可以创建我们的第一艘舰船了：

```ts
import { createShip } from "maestrale";

const ship = createShip(60104, {
  technology
});
```

第一个参数为舰船的 ID，可以通过检查数据源中的 `ship_data_statistics.json` 文件获取。由于其键值的最后一位始终表示舰船的突破等级，因此我们使用截去最后一位的数值作为舰船的 ID。

如果要在初始化舰船时为她添加装备，可以向配置项中的 `equips` 字段传入一个数组，每个下标位分别表示对应装备槽上的装备对象或 ID，如果传入 `null` 则表示置空。同样，它可以通过检查数据源中的 `equip_data_statistics.json` 文件获取；兵装同理，检查 `spweapon_data_statistics.json` 文件即可：

```ts
import { createEquip, createSPWeapon } from "maestrale";

const ship = createShip(60104, {
  technology,
  equips: [
    null,
    createEquip(35340),
    null,
    2640,
    2640
  ],
  spweapon: createSPWeapon(10180)
});
```

## 开发

```shell
# 安装依赖
pnpm i

# 修剪游戏数据
pnpm vvvip

# 启动开发服务器
pnpm -C simulator dev
```