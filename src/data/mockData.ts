export interface TermItem {
  term: string
  translation: string
  example: string
}

export interface ScamItem {
  title: string
  description: string
  voiceText: string
}

export interface VerifyItem {
  name: string
  passed: boolean
}

export interface MockAccount {
  id: string
  game: string
  server: string
  level: string
  description: string
  price: number
  verifyScore: number
  verifyItems: VerifyItem[]
  imageTags: string[]
}

export interface StepItem {
  name: string
  status: 'completed' | 'active' | 'pending' | 'timeout'
  time?: string
  hint?: string
}

export interface MockOrder {
  id: string
  type: 'sell' | 'buy'
  game: string
  status: '进行中' | '已完成' | '异常超时'
  currentStep: number
  totalSteps: number
  amount: number
  createdAt: string
  completedAt?: string
  steps: StepItem[]
}

export interface FAQItem {
  category: string
  question: string
  answer: string
}

export const terms: TermItem[] = [
  {
    term: '验号',
    translation: '检查账号里东西齐不齐',
    example: '买号前一定要先验号，看看皮肤、铭文、段位都在不在',
  },
  {
    term: '换绑',
    translation: '把账号绑到你的手机上',
    example: '买完号要换绑手机号，不然卖家还能登进去',
  },
  {
    term: '担保交易',
    translation: '钱先给平台保管，办完事再给对方',
    example: '就像买房走资金监管，你没拿到号之前钱不会到卖家手里',
  },
  {
    term: '区服',
    translation: '游戏里你在哪个区、哪个服务器',
    example: '王者荣耀有微信区和QQ区，每个区里还分不同服务器',
  },
  {
    term: '皮肤',
    translation: '游戏角色的衣服装扮',
    example: '有的皮肤免费，有的要花钱买，稀有限定皮肤很值钱',
  },
  {
    term: '铭文',
    translation: '给角色加能力的装备',
    example: '铭文等级越高，角色战斗力越强，满级铭文很难攒',
  },
  {
    term: '首充号',
    translation: '已经充过一次钱的账号',
    example: '有些游戏首充会送限定奖励，首充号比白号值钱',
  },
  {
    term: '白板号',
    translation: '什么都没有的新号',
    example: '白板号就是刚注册的，没皮肤没铭文，价格最便宜',
  },
  {
    term: '实名认证',
    translation: '用身份证证明你是谁',
    example: '国家规定玩游戏要实名，账号都绑了身份证',
  },
  {
    term: '走平台',
    translation: '在平台上完成交易，有保障',
    example: '走平台交易出问题可以找客服，私下交易没人管',
  },
]

export const scams: ScamItem[] = [
  {
    title: '对方让你先转账',
    description: '任何人让你直接转账都是骗子，平台担保交易不用私下转账',
    voiceText: '对方让你先转账？千万别转！只要不经过平台的转账都是骗子！钱一旦转出去就找不回来了。',
  },
  {
    title: '要验证码',
    description: '验证码=你的银行卡密码，谁要都不能给',
    voiceText: '验证码就是你的钱袋子钥匙！谁跟你要验证码，谁就是骗子！不管是卖家还是客服，都不能给！',
  },
  {
    title: '私下交易更便宜',
    description: '离开平台=没有保障=钱打水漂',
    voiceText: '说私下交易更便宜的，都是想骗你的钱！离开平台就没有任何保障，出了问题你找谁？还是走平台最安全！',
  },
  {
    title: '冒充客服加你微信',
    description: '真客服只在平台内联系你，不会加微信',
    voiceText: '有人加你微信说自己是客服？假的！我们平台的客服只在App里跟你说话，不会加微信、不会打电话让你转账！',
  },
  {
    title: '账号已出要紧急处理',
    description: '催你赶紧操作的都是套路，慢慢来别着急',
    voiceText: '有人说你的账号出了问题要赶紧处理？别急！这是骗子在催你，让你来不及想清楚就上当。慢慢来，先联系平台客服确认！',
  },
]

export const gameList: string[] = [
  '王者荣耀',
  '和平精英',
  '原神',
  '英雄联盟',
  '蛋仔派对',
  '我的世界',
]

export const mockOrders: MockOrder[] = [
  {
    id: 'ORD20260601001',
    type: 'sell',
    game: '王者荣耀',
    status: '进行中',
    currentStep: 3,
    totalSteps: 5,
    amount: 680,
    createdAt: '2026-06-01 14:30',
    steps: [
      { name: '提交账号信息', status: 'completed', time: '2026-06-01 14:30', hint: '您已提交，平台正在审核' },
      { name: '平台验号', status: 'completed', time: '2026-06-01 15:20', hint: '验号通过，账号信息真实' },
      { name: '买家付款至担保', status: 'active', hint: '正在等买家付款，平台保管钱，您不用着急' },
      { name: '卖家换绑账号', status: 'pending', hint: '等买家付完款，客服会电话教您怎么换绑' },
      { name: '平台放款', status: 'pending', hint: '换绑完成后，平台把钱打到您的账户' },
    ],
  },
  {
    id: 'ORD20260602002',
    type: 'buy',
    game: '原神',
    status: '异常超时',
    currentStep: 4,
    totalSteps: 5,
    amount: 1200,
    createdAt: '2026-06-02 09:15',
    steps: [
      { name: '选购账号', status: 'completed', time: '2026-06-02 09:15', hint: '您已选定账号' },
      { name: '确认购买', status: 'completed', time: '2026-06-02 09:40', hint: '购买已确认' },
      { name: '付款至担保账户', status: 'completed', time: '2026-06-02 10:05', hint: '您的钱已在平台保管，安全' },
      { name: '卖家换绑账号', status: 'timeout', time: '2026-06-02 14:00', hint: '卖家换绑超时了！您的钱还在平台，不会丢。建议联系客服催促卖家' },
      { name: '买家验收确认', status: 'pending', hint: '等卖家换绑完成后，您确认没问题才算完成' },
    ],
  },
  {
    id: 'ORD20260603003',
    type: 'sell',
    game: '和平精英',
    status: '已完成',
    currentStep: 5,
    totalSteps: 5,
    amount: 350,
    createdAt: '2026-05-28 11:00',
    completedAt: '2026-05-28 17:00',
    steps: [
      { name: '提交账号信息', status: 'completed', time: '2026-05-28 11:00', hint: '您已提交' },
      { name: '平台验号', status: 'completed', time: '2026-05-28 12:30', hint: '验号通过' },
      { name: '买家付款至担保', status: 'completed', time: '2026-05-28 14:00', hint: '买家已付款' },
      { name: '卖家换绑账号', status: 'completed', time: '2026-05-28 16:20', hint: '换绑完成' },
      { name: '平台放款', status: 'completed', time: '2026-05-28 17:00', hint: '钱已到您账户' },
    ],
  },
]

export const mockAccounts: MockAccount[] = [
  {
    id: 'ACC001',
    game: '王者荣耀',
    server: '微信区-最强王者1服',
    level: '最强王者',
    description: '全皮肤账号，含多款限定皮肤，铭文全满，贵族8',
    price: 2800,
    verifyScore: 95,
    verifyItems: [
      { name: '皮肤是否齐全', passed: true },
      { name: '铭文是否满级', passed: true },
      { name: '段位是否真实', passed: true },
      { name: '是否可换绑', passed: true },
      { name: '有无封禁记录', passed: true },
    ],
    imageTags: ['全皮肤', '满铭文', '贵8', '有限定'],
  },
  {
    id: 'ACC002',
    game: '原神',
    server: '天空岛服务器',
    level: '冒险等级58',
    description: '5星角色20+，专武齐全，深渊满星，月卡党',
    price: 1200,
    verifyScore: 82,
    verifyItems: [
      { name: '5星角色数量', passed: true },
      { name: '专武是否齐全', passed: true },
      { name: '原石余额', passed: false },
      { name: '是否可换绑', passed: true },
      { name: '有无封禁记录', passed: true },
    ],
    imageTags: ['5星角色多', '有专武', '深渊满星'],
  },
  {
    id: 'ACC003',
    game: '和平精英',
    server: '微信区',
    level: '无敌战神',
    description: '多套军需皮肤，载具皮肤齐全，极少上线可出',
    price: 650,
    verifyScore: 73,
    verifyItems: [
      { name: '军需皮肤完整性', passed: true },
      { name: '载具皮肤', passed: true },
      { name: '段位是否真实', passed: false },
      { name: '是否可换绑', passed: true },
      { name: '有无封禁记录', passed: true },
    ],
    imageTags: ['军需皮肤', '载具皮肤', '战神段位'],
  },
  {
    id: 'ACC004',
    game: '蛋仔派对',
    server: '官方服务器',
    level: '超级蛋15级',
    description: '限定外观多，联动皮肤齐全，活跃度高',
    price: 380,
    verifyScore: 88,
    verifyItems: [
      { name: '限定外观是否齐全', passed: true },
      { name: '联动皮肤', passed: true },
      { name: '活跃等级', passed: true },
      { name: '是否可换绑', passed: true },
      { name: '有无封禁记录', passed: true },
    ],
    imageTags: ['限定外观', '联动皮肤', '活跃号'],
  },
]

export const faqItems: FAQItem[] = [
  {
    category: '卖号相关',
    question: '卖号需要准备什么？',
    answer: '准备好你的游戏账号信息，包括游戏名、区服、角色等级、有哪些皮肤和装备。还要确保你能提供换绑需要的手机号或邮箱。',
  },
  {
    category: '卖号相关',
    question: '账号大概能卖多少钱？',
    answer: '价格取决于游戏类型、角色等级、皮肤数量和稀有程度。发布后系统会给你一个参考价格区间，最终价格由你和买家商量决定。',
  },
  {
    category: '卖号相关',
    question: '换绑操作不会弄怎么办？',
    answer: '不用担心！我们有专门的换绑指导电话，客服会一步一步教你操作。点击页面上的"需要帮助"按钮就能拨打。',
  },
  {
    category: '买号相关',
    question: '买号安不安全？',
    answer: '走平台担保交易很安全。你的钱先由平台保管，等卖家把账号换绑到你手机上、你确认没问题了，平台才会把钱给卖家。',
  },
  {
    category: '买号相关',
    question: '验号结果怎么看？',
    answer: '验号结果用一个分数表示，90分以上是绿色代表很安全，70到90分是黄色需要注意，70分以下红色表示有风险不建议购买。下面还有每一项的详细检查结果。',
  },
  {
    category: '买号相关',
    question: '买完号卖家找回怎么办？',
    answer: '平台有售后保障期，如果卖家找回账号，平台会全额退款并追究卖家责任。所以一定要走平台交易，私下买没有任何保障。',
  },
  {
    category: '安全相关',
    question: '为什么不能私下转账？',
    answer: '私下转账没有任何保障，对方收钱后可以不给你账号，或者给你一个有问题的账号，你找都找不到人。走平台担保，钱由平台保管，出了问题平台帮你解决。',
  },
  {
    category: '安全相关',
    question: '验证码能给别人吗？',
    answer: '绝对不能！验证码就像你银行卡的密码，给了别人就等于把你的钱和账号都交出去了。不管是卖家、买家还是自称客服的人，都不能给验证码。',
  },
  {
    category: '安全相关',
    question: '有人加我微信说是客服怎么办？',
    answer: '假的！我们的客服只在App里面跟你联系，不会加微信也不会打电话让你转账。遇到这种情况，请直接在App里联系官方客服核实。',
  },
  {
    category: '安全相关',
    question: '交易过程遇到问题找谁？',
    answer: '随时可以在App里点击"客服帮助"，一键拨打客服电话或在线聊天。我们的客服会手把手帮你解决问题，不用不好意思问。',
  },
]
