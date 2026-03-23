import type { TStory } from '../types';

export const stories: TStory[] = [
  {
    id: '1',
    title: '浴室里的秘密',
    difficulty: 'easy',
    surface: '一个男人在浴室里死了，地上有碎玻璃和一片水渍。',
    bottom:
      '男人是花样滑冰运动员，在冰面上表演后去浴室。地上的是冰碎，不是玻璃。',
    hintCount: 3,
    tags: ['推理', '日常'],
    createdAt: Date.now(),
  },
  {
    id: '4',
    title: '楼道的脚步声',
    difficulty: 'easy',
    surface: '半夜十二点，楼道里持续传来脚步声，但打开门却什么都没有。',
    bottom:
      '只是隔壁洗衣机在烘干阶段反复启动，震动通过管道传到楼道，形成“脚步节奏”。',
    hintCount: 3,
    tags: ['日常', '悬疑'],
    createdAt: Date.now(),
  },
  {
    id: '5',
    title: '抽屉里的月光',
    difficulty: 'easy',
    surface: '窗关着，却有人发现抽屉里散落着一片“月光”。',
    bottom:
      '月光其实是夜灯的反光投影。抽屉表面的细微刮痕把光线“折”成了看似月色的形状。',
    hintCount: 3,
    tags: ['日常', '温情'],
    createdAt: Date.now(),
  },
  {
    id: '6',
    title: '咖啡杯的倒影',
    difficulty: 'easy',
    surface: '咖啡喝完后杯底的倒影显示“另一个人”的侧脸，房间却只有我。',
    bottom:
      '侧脸来自落地镜的倒影。杯底弧面把光线重新映射，误导了观察角度。',
    hintCount: 3,
    tags: ['推理', '日常'],
    createdAt: Date.now(),
  },
  {
    id: '7',
    title: '锁住的午后',
    difficulty: 'easy',
    surface: '我明明把门锁上了，可下午回家门却开着。',
    bottom:
      '家里有备用智能锁卡。门并非被撬开，而是有人用临时卡完成了远程开锁。',
    hintCount: 3,
    tags: ['悬疑', '日常'],
    createdAt: Date.now(),
  },
  {
    id: '8',
    title: '便利店的找零',
    difficulty: 'easy',
    surface: '我付了钱却被找错零。第二天才发现账单对得上，但零钱不对。',
    bottom:
      '找零机器先按“纸币张数”纠正找零。你拿走的并不是错误零，而是上一位顾客找错后留在柜台的。',
    hintCount: 3,
    tags: ['推理', '日常'],
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: '深夜的电梯',
    difficulty: 'medium',
    surface: '深夜停电后，电梯却在三楼停住，门自动打开。可里面没有任何人。',
    bottom:
      '其实电梯并未通电运行，是三楼地库的应急系统开启了门锁。打开后只有监控维护人员的影像投影在井内。',
    hintCount: 2,
    tags: ['悬疑', '科技'],
    createdAt: Date.now(),
  },
  {
    id: '9',
    title: '走廊的白噪声',
    difficulty: 'medium',
    surface: '医院走廊每隔几分钟就传来同样的白噪声，像有人在按节拍。',
    bottom:
      '是放疗设备的散射声在不同走廊拐角产生相位叠加，听感会“像节拍”。每次启动周期刚好对应。',
    hintCount: 2,
    tags: ['悬疑', '科幻'],
    createdAt: Date.now(),
  },
  {
    id: '10',
    title: '失真的录音',
    difficulty: 'medium',
    surface: '录音里那段告白清晰无比，但说话人的照片却显示对方没在场。',
    bottom:
      '告白音轨来自公开宣传素材。你把它当作现场录音合成到视频里，照片来自另一段采集。',
    hintCount: 2,
    tags: ['悬疑', '日常'],
    createdAt: Date.now(),
  },
  {
    id: '11',
    title: '没有电的夜灯',
    difficulty: 'medium',
    surface: '夜灯没有接电，却在深夜持续发出微光，亮度忽明忽暗。',
    bottom:
      '灯体内置蓄光材料。白天吸收过强光源，夜里释放；忽明忽暗是因为门外车灯扫过反射。',
    hintCount: 2,
    tags: ['科技', '悬疑'],
    createdAt: Date.now(),
  },
  {
    id: '12',
    title: '雨水里的脚印',
    difficulty: 'medium',
    surface: '雨停后，窗外地面出现一串鞋印，方向却通向一堵墙。',
    bottom:
      '脚印是从上方雨棚的积水形成的水纹。真正的通路在另一侧，鞋印是落水形成的“假方向”。',
    hintCount: 2,
    tags: ['推理', '恐怖'],
    createdAt: Date.now(),
  },
  {
    id: '13',
    title: '断网的聊天框',
    difficulty: 'medium',
    surface: '手机断网了，我仍能看到聊天框里“对方正在输入”。',
    bottom:
      '是离线缓存触发的“输入指示”残留动画。对方并未在线，你看到的是本地脚本延迟更新的结果。',
    hintCount: 2,
    tags: ['科技', '日常'],
    createdAt: Date.now(),
  },
  {
    id: '3',
    title: '雨伞与指纹',
    difficulty: 'hard',
    surface: '雨停后，桌上多了一把干燥的雨伞，上面却只有一枚“早就不存在的人”的指纹。',
    bottom:
      '指纹来自仓库里封存的旧手套。那天的雨伞被使用过的消毒液处理过，导致伞面后续看起来“干燥”，但指纹仍保留在封存阶段。',
    hintCount: 1,
    tags: ['恐怖', '推理'],
    createdAt: Date.now(),
  },
  {
    id: '14',
    title: '墙里传来的咳嗽',
    difficulty: 'hard',
    surface: '夜里墙体里传来咳嗽声，房间里却没有任何人。',
    bottom:
      '咳嗽声来自隔壁施工通风管道的回声。墙体中空夹层把声波“放大定向”，让你误以为在同一房间。',
    hintCount: 1,
    tags: ['恐怖', '悬疑'],
    createdAt: Date.now(),
  },
  {
    id: '15',
    title: '倒着走的时钟',
    difficulty: 'hard',
    surface: '时钟的秒针每隔一段时间会倒退，然后又继续向前。',
    bottom:
      '时钟同步任务受到定时切换影响：夏令时/时区切换导致系统时间校正“回拨”了一小段。',
    hintCount: 1,
    tags: ['科幻', '悬疑'],
    createdAt: Date.now(),
  },
  {
    id: '16',
    title: '失踪的钥匙孔',
    difficulty: 'hard',
    surface: '锁上没有钥匙孔的那扇门却能被打开，门内还留着新鲜的灰尘脚印。',
    bottom:
      '钥匙孔被隐藏在门板的装饰条后面：脚印来自最近安装人员。你观察到的是“装饰遮挡”，不是不存在。',
    hintCount: 1,
    tags: ['推理', '恐怖'],
    createdAt: Date.now(),
  },
  {
    id: '17',
    title: '玻璃上的白雾字迹',
    difficulty: 'hard',
    surface: '窗户上起雾后出现一串字迹，雾散开时字迹却仍清晰。',
    bottom:
      '字迹是温度差触发的相变膜显色。白雾只是触发显示的“条件”，散开后仍因材料残留显示。',
    hintCount: 1,
    tags: ['科幻', '推理'],
    createdAt: Date.now(),
  },
  {
    id: '18',
    title: '消失的第七个台阶',
    difficulty: 'hard',
    surface: '楼梯每走到第七阶就会脚下一空，然而地面并没有任何缺口。',
    bottom:
      '第七阶是活动踏板，平时用磁吸固定；当你触碰特定位置时磁力失效，踏板暂时“翻下”，形成脚下一空的错觉。',
    hintCount: 1,
    tags: ['恐怖', '悬疑'],
    createdAt: Date.now(),
  },
];

