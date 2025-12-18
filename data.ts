import { Dimension, ResultCategory } from './types';

export const dimensions: Dimension[] = [
  {
    id: 'product',
    title: '维度一：产品竞争力',
    description: '决定能否卖出去',
    questions: [
      {
        id: 1,
        text: '您的产品在国际市场上有价格优势吗？',
        options: [
          { label: 'A. 不清楚海外同类产品价格', score: 0 },
          { label: 'B. 比同行贵，但品质更好', score: 2 },
          { label: 'C. 比海外竞品便宜20%以上', score: 3 },
          { label: 'D. 价格相当，无明显优势', score: 1 },
        ],
      },
      {
        id: 2,
        text: '您的产品是否具备出口基础资质？',
        options: [
          { label: 'A. 完全不了解需要什么认证', score: 0 },
          { label: 'B. 已了解目标市场认证要求', score: 2 },
          { label: 'C. 已通过CE/FCC等核心认证', score: 3 },
          { label: 'D. 产品不需要特殊认证', score: 2 },
        ],
      },
      {
        id: 3,
        text: '您的产品在供应链上是否具备快速响应能力？',
        options: [
          { label: 'A. 现款现结，从不压库存', score: 0 },
          { label: 'B. 打样需要30天以上', score: 1 },
          { label: 'C. 小批量订单（<500件）可15天交货', score: 2 },
          { label: 'D. 有柔性生产线，支持小单快返', score: 3 },
        ],
      },
      {
        id: 4,
        text: '您是否有产品在海外使用的真实场景数据？',
        options: [
          { label: 'A. 完全不清楚海外怎么用', score: 0 },
          { label: 'B. 通过客户反馈了解过', score: 1 },
          { label: 'C. 有海外客户试用报告', score: 2 },
          { label: 'D. 产品已出口部分零件/代工', score: 3 },
        ],
      },
      {
        id: 5,
        text: '您的产品属于以下哪类？',
        options: [
          { label: 'A. 纯定制，无标准品', score: 1 },
          { label: 'B. 行业专用设备', score: 2 },
          { label: 'C. 日用消费品/标准工业品', score: 3 },
          { label: 'D. 季节性/潮流性产品', score: 1 },
        ],
      },
    ],
  },
  {
    id: 'finance',
    title: '维度二：资金准备度',
    description: '决定能撑多久',
    questions: [
      {
        id: 6,
        text: '您为外贸转型准备了多少"无回报承受资金"？',
        options: [
          { label: 'A. 10万以内', score: 0 },
          { label: 'B. 10-30万', score: 1 },
          { label: 'C. 30-50万', score: 2 },
          { label: 'D. 50万以上', score: 3 },
        ],
      },
      {
        id: 7,
        text: '您的企业目前现金流状况？',
        options: [
          { label: 'A. 靠赊销维持，回款困难', score: 0 },
          { label: 'B. 收支平衡，略有盈余', score: 2 },
          { label: 'C. 现金流健康，可支撑6个月亏损', score: 3 },
          { label: 'D. 靠贷款/融资维持运营', score: 0 },
        ],
      },
      {
        id: 8,
        text: '您是否了解外贸业务的资金占用周期？',
        options: [
          { label: 'A. 以为和国内一样现款现货', score: 0 },
          { label: 'B. 知道有账期，但不知具体多久', score: 1 },
          { label: 'C. 清楚30-90天账期+海运周期', score: 2 },
          { label: 'D. 已测算过完整现金流模型', score: 3 },
        ],
      },
      {
        id: 9,
        text: '您能承受多久"零外贸订单"的状态？',
        options: [
          { label: 'A. 1个月', score: 0 },
          { label: 'B. 3个月', score: 1 },
          { label: 'C. 6个月', score: 2 },
          { label: 'D. 12个月', score: 3 },
        ],
      },
      {
        id: 10,
        text: '外贸投入占您可投资金的比例？',
        options: [
          { label: 'A. 全部身家', score: 0 },
          { label: 'B. 超过50%', score: 1 },
          { label: 'C. 30-50%', score: 2 },
          { label: 'D. 30%以内，有明确止损线', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'determination',
    title: '维度三：老板决心',
    description: '决定转型成败最关键因素',
    questions: [
      {
        id: 11,
        text: '您每天能投入多少时间在外贸上？',
        options: [
          { label: 'A. 没时间，想完全委托他人', score: 0 },
          { label: 'B. 每周1-2小时听汇报', score: 1 },
          { label: 'C. 每天1小时深度参与', score: 2 },
          { label: 'D. 投入50%以上精力，亲自抓', score: 3 },
        ],
      },
      {
        id: 12,
        text: '如果外贸6个月没订单，您会？',
        options: [
          { label: 'A. 立即砍掉，止损', score: 0 },
          { label: 'B. 再试3个月，不行就撤', score: 1 },
          { label: 'C. 复盘问题，调整策略继续', score: 2 },
          { label: 'D. 坚持到底，至少试18个月', score: 3 },
        ],
      },
      {
        id: 13,
        text: '您家人/合伙人对转型的态度？',
        options: [
          { label: 'A. 强烈反对', score: 0 },
          { label: 'B. 观望，不支持也不反对', score: 1 },
          { label: 'C. 支持但有保留', score: 2 },
          { label: 'D. 全力支持，达成共识', score: 3 },
        ],
      },
      {
        id: 14,
        text: '您是否能接受"先慢后快"的外贸规律？',
        options: [
          { label: 'A. 希望3个月见效', score: 0 },
          { label: 'B. 可以接受6个月孵化期', score: 2 },
          { label: 'C. 想快速铺货，大干快上', score: 0 },
          { label: 'D. 理解需要12-18个月沉淀', score: 3 },
        ],
      },
      {
        id: 15,
        text: '您学习外贸知识的主动性如何？',
        options: [
          { label: 'A. 等人来教，不想自己学', score: 0 },
          { label: 'B. 参加展会/培训，被动接收', score: 1 },
          { label: 'C. 主动加入社群，请教同行', score: 2 },
          { label: 'D. 系统学习课程，研究平台规则', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'team',
    title: '维度四：团队能力',
    description: '决定执行效果',
    questions: [
      {
        id: 16,
        text: '您目前的外贸团队配置？',
        options: [
          { label: 'A. 无任何人懂外贸', score: 0 },
          { label: 'B. 有1名兼职/助理', score: 1 },
          { label: 'C. 有1-2名全职新手', score: 2 },
          { label: 'D. 有3年以上经验的外贸经理', score: 3 },
        ],
      },
      {
        id: 17,
        text: '您的团队是否具备英语/多语言基础？',
        options: [
          { label: 'A. 无人会用英语沟通', score: 0 },
          { label: 'B. 有1人会基础英语', score: 1 },
          { label: 'C. 能用工具+简单英语交流', score: 2 },
          { label: 'D. 有专业外贸业务员/海归', score: 3 },
        ],
      },
      {
        id: 18,
        text: '您是否有数字化/电商运营经验？',
        options: [
          { label: 'A. 纯传统线下销售', score: 0 },
          { label: 'B. 有1688/淘宝运营经验', score: 2 },
          { label: 'C. 有亚马逊/跨境经验', score: 3 },
          { label: 'D. 完全不懂线上运营', score: 0 },
        ],
      },
      {
        id: 19,
        text: '团队的学习能力和执行力？',
        options: [
          { label: 'A. 抵触新事物，习惯旧模式', score: 0 },
          { label: 'B. 愿意尝试，但需手把手教', score: 1 },
          { label: 'C. 能自主学习，主动解决问题', score: 2 },
          { label: 'D. 有强烈的进取心和抗压能力', score: 3 },
        ],
      },
      {
        id: 20,
        text: '您能为核心外贸人才提供什么？',
        options: [
          { label: 'A. 固定工资，无提成', score: 0 },
          { label: 'B. 底薪+销售额提成', score: 2 },
          { label: 'C. 底薪+利润分成', score: 3 },
          { label: 'D. 低于市场水平的薪酬', score: 0 },
        ],
      },
    ],
  },
  {
    id: 'learning',
    title: '维度五：学习与应变能力',
    description: '决定成长速度',
    questions: [
      {
        id: 21,
        text: '您获取外贸知识的渠道有哪些？（多选，最高3分）',
        type: 'multiple',
        maxScore: 3,
        options: [
          { label: 'A. 只听朋友介绍', score: 0.5 },
          { label: 'B. 关注10个以上外贸公众号', score: 1 },
          { label: 'C. 参加过3次以上外贸培训', score: 1.5 },
          { label: 'D. 研究过海关数据/行业报告', score: 1 },
          { label: 'E. 有固定的外贸导师/顾问', score: 2 },
        ],
      },
      {
        id: 22,
        text: '您如何验证一个"外贸机会"的真伪？',
        options: [
          { label: 'A. 直接相信，马上投钱', score: 0 },
          { label: 'B. 问3个以上同行意见', score: 2 },
          { label: 'C. 先小批量测试', score: 3 },
          { label: 'D. 看服务商怎么说的', score: 1 },
        ],
      },
      {
        id: 23,
        text: '面对平台政策变化（如亚马逊封号），您会？',
        options: [
          { label: 'A. 惊慌失措，放弃该平台', score: 0 },
          { label: 'B. 找服务商花钱解决', score: 1 },
          { label: 'C. 研究规则，调整策略', score: 2 },
          { label: 'D. 提前布局多渠道，分散风险', score: 3 },
        ],
      },
      {
        id: 24,
        text: '您是否有数据分析和复盘习惯？',
        options: [
          { label: 'A. 从不看数据，凭感觉', score: 0 },
          { label: 'B. 每月看一次销售报表', score: 1 },
          { label: 'C. 每周分析客户来源和转化率', score: 2 },
          { label: 'D. 有完整的数据看板，日更', score: 3 },
        ],
      },
      {
        id: 25,
        text: '您是否了解目标市场的文化/法律差异？',
        options: [
          { label: 'A. 以为全世界都一样', score: 0 },
          { label: 'B. 知道一些基础差异', score: 1 },
          { label: 'C. 专门学习过GDPR/CP65等法规', score: 2 },
          { label: 'D. 有当地合作伙伴提供咨询', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'compliance',
    title: '维度六：合规风控意识',
    description: '决定能走多远',
    questions: [
      {
        id: 26,
        text: '您了解国际贸易的付款方式风险排序吗？',
        options: [
          { label: 'A. 完全不懂，只接受全款', score: 0 },
          { label: 'B. 知道信用证，但不熟悉操作', score: 1 },
          { label: 'C. 能区分TT/LC/OA的风险等级', score: 2 },
          { label: 'D. 有信用保险和风控流程', score: 3 },
        ],
      },
      {
        id: 27,
        text: '您如何处理知识产权问题？',
        options: [
          { label: 'A. 不知道需要注册商标', score: 0 },
          { label: 'B. 国内有商标，但没注册海外', score: 1 },
          { label: 'C. 已在主要市场注册商标', score: 2 },
          { label: 'D. 有完整的专利/商标布局策略', score: 3 },
        ],
      },
      {
        id: 28,
        text: '您是否了解出口产品责任险？',
        options: [
          { label: 'A. 没听过', score: 0 },
          { label: 'B. 听说过，但觉得没必要', score: 1 },
          { label: 'C. 知道重要性，准备购买', score: 2 },
          { label: 'D. 已购买，覆盖主要市场', score: 3 },
        ],
      },
      {
        id: 29,
        text: '您对报关/外汇/退税的熟悉程度？',
        options: [
          { label: 'A. 完全不懂，靠货代代操作', score: 0 },
          { label: 'B. 知道基本流程', score: 1 },
          { label: 'C. 有1-2次操作经验', score: 2 },
          { label: 'D. 有专业财务/关务人员', score: 3 },
        ],
      },
      {
        id: 30,
        text: '您是否有应对突发风险的资金/预案？',
        options: [
          { label: 'A. 没有预案，走一步算一步', score: 0 },
          { label: 'B. 有风险意识，但没具体措施', score: 1 },
          { label: 'C. 准备了备用金', score: 2 },
          { label: 'D. 购买了中信保/有法律预案', score: 3 },
        ],
      },
    ],
  },
];

export const results: ResultCategory[] = [
  {
    min: 90,
    max: 105, // Cap buffer
    title: '立即行动型 (黄金选手)',
    stars: 5,
    priority: '产品好、资金足、老板狠、团队强',
    description: '您已具备极高的出海成功率，建议立即行动。',
    advice: [
      '立即启动多平台布局（阿里国际站+独立站+社交媒体）',
      '投资10-15万参加海外专业展会',
      '3个月内组建完整外贸团队（经理+业务+跟单）',
      '重点市场注册商标和专利',
    ],
    outcome: '6个月内可出首单，12个月实现盈亏平衡',
  },
  {
    min: 70,
    max: 89,
    title: '快速迭代型 (重点培养)',
    stars: 4,
    priority: '可能在团队或合规上略有不足',
    description: '基础良好，补齐短板后可快速启动。',
    advice: [
      '立即补足最大短板（如招人/学习/注册认证）',
      '小步快跑：选择1个低成本渠道（如LinkedIn）测试',
      '降低初期目标：首单金额目标设为1万美元以内',
      '找导师：花2-3万请资深外贸顾问陪跑3个月',
    ],
    outcome: '9-12个月出首单，需持续迭代',
  },
  {
    min: 50,
    max: 69,
    title: '准备就绪型 (需补足短板)',
    stars: 3,
    priority: '2个以上维度严重不足',
    description: '切勿盲目从众，建议先进行3-6个月的内功修炼。',
    advice: [
      '老板亲自学习：参加外贸总裁班，理解底层逻辑',
      '产品改造：根据出口标准调整产品设计和包装',
      '团队储备：内部选拔1名高潜力员工专门学习',
      '资金储备：确保50万备用金到位',
    ],
    outcome: '警告：此刻强行出海，90%概率亏损离场',
  },
  {
    min: 30,
    max: 49,
    title: '谨慎观望型 (谨慎观望)',
    stars: 2,
    priority: '老板决心或资金存在严重问题',
    description: '建议将外贸作为"副业"探索，不要All in。',
    advice: [
      '不要All in：将外贸作为"副业"探索',
      '轻模式试水：找外贸公司合作代销，不做投入',
      '学习为主：参加行业峰会，结交转型成功者',
      '等待时机：内贸业务稳定、资金充裕后再启动',
    ],
    outcome: '观望期至少12-18个月',
  },
  {
    min: 0,
    max: 29,
    title: '暂不适宜型 (暂不适合)',
    stars: 1,
    priority: '心态、认知、资源均未准备好',
    description: '核心任务是活下去。把内贸做到区域前三再考虑出海。',
    advice: [
      '先活下去：把内贸做到区域前三，现金流健康',
      '重塑认知：深度陪跑3家转型企业，理解真实难度',
      '禁止投入：任何付费平台/展会都别碰，纯粹浪费钱',
      '最低成本：尝试跨境一件代发（dropshipping），零库存测试',
    ],
    outcome: '至少2年后重新测评',
  },
];
