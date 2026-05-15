import type { PublicNews, PublicProduct, PublicSiteConfig } from "./types";

export const fallbackSiteConfig: PublicSiteConfig = {
  siteId: 1,
  slug: "chunchang",
  name: "山东春昌食品科技股份有限公司",
  description: "黄油等乳制品相关产品与食品科技服务",
  siteType: "CORPORATE",
  seoConfig: {
    title: "山东春昌食品科技股份有限公司",
    description: "绿色健康乳制品供应与合作服务",
  },
  themeConfig: {
    primary: "#2F7D4A",
    cream: "#FFF8E7",
    butterGold: "#D9A441",
    text: "#1F2933",
    muted: "#64748B",
  },
  navigationConfig: {
    items: [
      { label: "首页", href: "#top" },
      { label: "产品服务", href: "#products" },
      { label: "关于我们", href: "#about" },
      { label: "合作机会", href: "#cooperation" },
      { label: "最近动态", href: "#news" },
      { label: "联系我们", href: "#contact" },
    ],
  },
  customConfig: {
    mobileContactBar: true,
    leadEntryPoints: ["phone", "wechat", "message"],
  },
  brandConfig: {
    companyName: "山东春昌食品科技股份有限公司",
    shortName: "春昌食品科技",
    logoUrl: null,
    brandWords: ["绿色", "健康", "生态", "专业稳重", "简洁", "亲民"],
    businessDirection: "黄油等乳制品相关产品与食品科技服务",
  },
  contentConfig: {
    hero: {
      headline: "绿色健康乳制品供应与合作服务",
      subheadline:
        "面向食品加工、烘焙餐饮、经销批发和渠道合作客户，提供黄油等乳制品相关产品与咨询合作服务。",
      primaryCta: "提交合作咨询",
      secondaryCta: "查看产品服务",
    },
    about: {
      summary:
        "山东春昌食品科技股份有限公司专注黄油等乳制品相关产品与食品科技服务。当前页面使用已确认业务方向和占位内容展示，电话、地址、资质、案例和产品规格等待企业真实资料补充。",
    },
    cooperation: {
      title: "合作机会",
      description:
        "欢迎食品加工、烘焙餐饮、经销批发和渠道合作客户留下需求，我们会根据真实资料补充后完善合作流程。",
      items: ["企业采购", "经销批发", "渠道合作", "产品咨询"],
    },
    contact: {
      phone: null,
      wechat: null,
      wechatQrUrl: null,
      address: null,
      notice: "电话、微信、地址和二维码等待企业真实资料补充。",
      messageEnabled: true,
    },
  },
};

export const fallbackProducts: PublicProduct[] = [
  {
    id: 1,
    name: "黄油产品",
    summary: "适用于烘焙、餐饮、食品加工等场景的黄油相关产品。",
    description:
      "具体规格、包装、保质期、储运条件等待企业真实产品资料补充。页面先保留产品方向，避免编造参数。",
    scenarios: ["烘焙生产", "餐饮门店", "食品加工"],
    sortOrder: 1,
  },
  {
    id: 2,
    name: "乳制品原料",
    summary: "面向食品加工客户的乳制品相关原料咨询与供应服务。",
    description:
      "可根据客户用途沟通产品类型、采购频率和合作方式，详细资料后续由企业补充。",
    scenarios: ["工厂采购", "配方研发", "稳定供应"],
    sortOrder: 2,
  },
  {
    id: 3,
    name: "企业采购服务",
    summary: "为企业客户提供采购咨询、需求沟通和合作对接。",
    description:
      "支持通过电话、微信或留言提交采购需求，后台可统一跟进线索状态。",
    scenarios: ["批量采购", "长期合作", "需求评估"],
    sortOrder: 3,
  },
  {
    id: 4,
    name: "渠道合作",
    summary: "面向经销、批发和区域渠道伙伴的合作机会。",
    description:
      "合作政策、区域要求和资质材料等待企业确认后补充到正式页面。",
    scenarios: ["经销批发", "区域渠道", "合作洽谈"],
    sortOrder: 4,
  },
];

export const fallbackNews: PublicNews[] = [
  {
    id: 1,
    title: "企业动态资料待补充",
    slug: "company-news-placeholder",
    summary:
      "这里将展示山东春昌食品科技股份有限公司的真实动态、产品知识和合作信息。",
    content:
      "当前不编造企业新闻。请后续补充真实动态、产品知识或行业资讯后再发布到前台。",
    category: "公司动态",
    publishedAt: "2026-05-15T00:00:00",
  },
  {
    id: 2,
    title: "产品知识栏目准备中",
    slug: "product-knowledge-placeholder",
    summary:
      "后续可围绕黄油等乳制品使用场景、储运注意事项和采购建议发布内容。",
    content:
      "内容需要基于企业真实产品资料和专业审核，当前仅展示栏目占位。",
    category: "产品知识",
    publishedAt: "2026-05-15T00:00:00",
  },
];
