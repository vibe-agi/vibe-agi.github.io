export type Locale = "en" | "zh";

export type LocalizedText = Readonly<Record<Locale, string>>;

export type ProductTone = "vibermate" | "beacon";

export interface ProductFeature {
  title: LocalizedText;
  body: LocalizedText;
}

export interface ProductDiagram {
  label: LocalizedText;
  nodes: readonly [LocalizedText, LocalizedText, LocalizedText];
  caption: LocalizedText;
}

export interface ProductScreenshot {
  src: string;
  title: LocalizedText;
  body: LocalizedText;
  alt: LocalizedText;
  width: number;
  height: number;
}

export interface Product {
  slug: "vibermate" | "hideout";
  index: string;
  name: string;
  tone: ProductTone;
  role: LocalizedText;
  status: LocalizedText;
  version: string;
  headline: LocalizedText;
  summary: LocalizedText;
  boundary: LocalizedText;
  platform: LocalizedText;
  install: string;
  repository: string;
  release: string;
  features: readonly ProductFeature[];
  diagram: ProductDiagram;
  screenshots?: readonly ProductScreenshot[];
}

const localized = (en: string, zh: string): LocalizedText => ({ en, zh });

const productCatalog: readonly Product[] = [
  {
    slug: "vibermate",
    index: "01",
    name: "ViberMate",
    tone: "vibermate",
    role: localized(
      "Traffic runtime for coding agents",
      "编程 Agent 的流量运行时",
    ),
    status: localized("macOS preview · v0.1.0", "macOS 预览版 · v0.1.0"),
    version: "0.1.0",
    headline: localized(
      "See every turn. Choose every route.",
      "看清每个 Turn，决定每条去向。",
    ),
    summary: localized(
      "See and control how Claude Code and Codex CLI connect to AI services.",
      "看清并控制 Claude Code 和 Codex CLI 如何连接 AI 服务。",
    ),
    boundary: localized(
      "ViberMate owns the boundary between a coding agent and its AI provider: capture, routing, account choice, message rules, and local evidence stay visible in one macOS app.",
      "ViberMate 管理编程 Agent 与 AI 服务之间的边界：捕获、路由、账号选择、消息规则和本地证据都集中在一个 macOS App 中。",
    ),
    platform: localized(
      "macOS 14+ · Apple Silicon + Intel",
      "macOS 14+ · Apple 芯片 + Intel",
    ),
    install: "brew install --cask vibe-agi/tap/vibermate",
    repository: "https://github.com/vibe-agi/vibermate",
    release: "https://github.com/vibe-agi/vibermate/releases/tag/v0.1.0",
    features: [
      {
        title: localized("Keep the normal workflow", "保留原来的使用方式"),
        body: localized(
          "Launch Claude Code or Codex from Terminal and inspect the same run in ViberMate.",
          "从终端启动 Claude Code 或 Codex，再回到 ViberMate 查看同一次运行。",
        ),
      },
      {
        title: localized("Route with intent", "按你的逻辑选择去向"),
        body: localized(
          "Choose an Endpoint, account, model mapping, or a bounded JavaScript selector.",
          "选择上游服务、账号、模型映射，或者编写受限的 JavaScript 选择器。",
        ),
      },
      {
        title: localized("Leave useful evidence", "留下真正有用的证据"),
        body: localized(
          "Control redaction and retention while keeping provider credentials outside evidence.",
          "明确控制脱敏与保留周期，同时让服务凭据始终留在证据之外。",
        ),
      },
    ],
    diagram: {
      label: localized("One visible request path", "一条看得见的请求路径"),
      nodes: [
        localized("Claude / Codex", "Claude / Codex"),
        localized("ViberMate policy", "ViberMate 策略"),
        localized("AI provider", "AI 服务"),
      ],
      caption: localized(
        "Capture → decide → send, with one Turn of shared context.",
        "捕获 → 决策 → 发送，并用同一个 Turn Context 串联前后。",
      ),
    },
    screenshots: [
      {
        src: "/images/vibermate/capture-timeline.png",
        title: localized(
          "Follow one Capture, Turn by Turn",
          "沿着一次 Capture，逐个查看 Turn",
        ),
        body: localized(
          "Keep the conversation, frozen routing decision, model request, and outcome in one readable timeline.",
          "把对话、冻结的路由决策、模型请求与结果放在同一条清晰时间线上。",
        ),
        alt: localized(
          "ViberMate Capture view showing Claude Code and Codex conversations as a Turn timeline",
          "ViberMate 捕获视图，以 Turn 时间线展示 Claude Code 与 Codex 对话",
        ),
        width: 4018,
        height: 2244,
      },
      {
        src: "/images/vibermate/raw-evidence.png",
        title: localized(
          "Inspect the evidence behind a Turn",
          "检查一个 Turn 背后的证据",
        ),
        body: localized(
          "Open retained HTTP boundaries only when needed, with redacted diagnostics and exact test samples close at hand.",
          "需要时再展开保留的 HTTP 边界，并随手复制脱敏诊断或精确测试样本。",
        ),
        alt: localized(
          "Expanded ViberMate Turn showing frozen routing evidence and retained raw HTTP boundaries",
          "展开后的 ViberMate Turn，显示冻结路由证据与保留的原始 HTTP 边界",
        ),
        width: 4018,
        height: 2244,
      },
      {
        src: "/images/vibermate/traffic-policies.png",
        title: localized(
          "Make every route explicit",
          "让每条路由都有明确规则",
        ),
        body: localized(
          "Bind client protocols and origins to the intended upstream service, account, and policy revision.",
          "把客户端协议与来源明确绑定到目标上游服务、账号和策略版本。",
        ),
        alt: localized(
          "ViberMate Traffic policies view with Anthropic, OpenAI, and ChatGPT client routes",
          "ViberMate 流量策略视图，展示 Anthropic、OpenAI 与 ChatGPT 客户端路由",
        ),
        width: 4018,
        height: 2244,
      },
      {
        src: "/images/vibermate/script-library.png",
        title: localized(
          "Turn JavaScript into reusable policy",
          "把 JavaScript 变成可复用策略",
        ),
        body: localized(
          "Start from readable built-ins, edit in a bounded sandbox, and test before creating a saved copy.",
          "从可读的内置示例开始，在受限沙箱中修改并测试，再决定是否保存副本。",
        ),
        alt: localized(
          "ViberMate Script library with message transform examples and syntax highlighted JavaScript",
          "ViberMate 脚本库，展示消息变换示例与带语法高亮的 JavaScript",
        ),
        width: 4018,
        height: 2244,
      },
      {
        src: "/images/vibermate/team-insights.png",
        title: localized(
          "See usage from retained evidence",
          "从保留证据看清团队使用情况",
        ),
        body: localized(
          "Review calls and protocol-declared tokens by runtime user without pretending partial evidence is billing data.",
          "按运行时用户查看调用量与协议声明的 Token，并明确区分局部证据和计费数据。",
        ),
        alt: localized(
          "ViberMate Team insights view with API call activity and token totals for one runtime user",
          "ViberMate 团队洞察视图，显示一名运行时用户的 API 调用活动与 Token 汇总",
        ),
        width: 4018,
        height: 2244,
      },
    ],
  },
  {
    slug: "hideout",
    index: "02",
    name: "Hideout",
    tone: "beacon",
    role: localized("A room for untrusted tools", "给陌生工具的一间安全工作室"),
    status: localized(
      "supervised alpha · v0.1.0-alpha.3",
      "监督式 Alpha · v0.1.0-alpha.3",
    ),
    version: "0.1.0-alpha.3",
    headline: localized(
      "Give tools a project. Not your whole Mac.",
      "把项目交给工具，而不是整台 Mac。",
    ),
    summary: localized(
      "Run AI agents and unfamiliar CLIs in a local VM without losing host-native workflows.",
      "让 AI Agent 和陌生 CLI 在本地虚拟机中工作，同时保留宿主机原生开发体验。",
    ),
    boundary: localized(
      "Hideout owns the execution boundary. A tool works inside a real local VM with the selected project, while host files, apps, and exports cross through narrow, recorded bridges.",
      "Hideout 管理执行边界。工具在真实的本地虚拟机里操作指定项目；宿主机文件、应用和导出只能通过狭窄且留痕的桥接能力跨越边界。",
    ),
    platform: localized(
      "Apple Silicon macOS · Lima VM",
      "Apple 芯片 Mac · Lima 虚拟机",
    ),
    install: "brew install vibe-agi/tap/hideout",
    repository: "https://github.com/vibe-agi/hideout",
    release:
      "https://github.com/vibe-agi/hideout/releases/tag/v0.1.0-alpha.3",
    features: [
      {
        title: localized("Use a real VM boundary", "使用真实虚拟机边界"),
        body: localized(
          "Agent and CLI processes run under a separate guest kernel instead of your host process space.",
          "Agent 与 CLI 运行在独立的客体内核中，而不是宿主机的进程空间里。",
        ),
      },
      {
        title: localized("Keep the project practical", "项目仍然好用"),
        body: localized(
          "The chosen checkout stays writable and controlled bridges can open supported host tools.",
          "选中的代码目录保持可写，受控桥接能力仍可打开支持的宿主机工具。",
        ),
      },
      {
        title: localized("See what crossed", "看清跨越了什么"),
        body: localized(
          "Host access, approvals, and exports leave local audit evidence.",
          "宿主机访问、审批与导出都会留下本地审计证据。",
        ),
      },
    ],
    diagram: {
      label: localized("A narrow host bridge", "一座狭窄的宿主机桥梁"),
      nodes: [
        localized("macOS terminal", "macOS 终端"),
        localized("Hideout control", "Hideout 控制面"),
        localized("Lima VM", "Lima 虚拟机"),
      ],
      caption: localized(
        "The workspace crosses by policy; generic host execution does not.",
        "工作区按策略进入，通用的宿主机执行能力不会跟着进去。",
      ),
    },
  },
] as const;

export const products: readonly Product[] = productCatalog;

export function copy(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export function productHref(product: Product, locale: Locale): string {
  const prefix = locale === "zh" ? "/zh" : "";
  return `${prefix}/products/${product.slug}/`;
}

export function productBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
