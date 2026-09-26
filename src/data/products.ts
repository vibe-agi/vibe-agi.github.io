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
  previewSrc: string;
  title: LocalizedText;
  body: LocalizedText;
  alt: LocalizedText;
  width: number;
  height: number;
}

export interface ProductSetupPath {
  title: LocalizedText;
  platform: LocalizedText;
  body: LocalizedText;
  command: string;
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
  setupPaths?: readonly ProductSetupPath[];
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
    status: localized(
      "macOS + Linux · v0.1.14",
      "macOS + Linux · v0.1.14",
    ),
    version: "0.1.14",
    headline: localized(
      "See every turn. Choose every route.",
      "看清每个 Turn，决定每条去向。",
    ),
    summary: localized(
      "See and control how Claude Code and Codex CLI connect to AI services.",
      "看清并控制 Claude Code 和 Codex CLI 如何连接 AI 服务。",
    ),
    boundary: localized(
      "ViberMate owns the boundary between a coding agent and its AI provider. The macOS App and Linux Web Runtime expose the same capture, routing, account, message-rule, and evidence model to one or many Runtime Users.",
      "ViberMate 管理编程 Agent 与 AI 服务之间的边界。macOS App 与 Linux Web Runtime 为一个或多个 Runtime User 提供相同的捕获、路由、账号、消息规则和证据模型。",
    ),
    platform: localized(
      "macOS 14+ App · Linux x86-64/ARM64 Server + Web",
      "macOS 14+ App · Linux x86-64/ARM64 Server + Web",
    ),
    install: "brew install --cask vibe-agi/tap/vibermate",
    setupPaths: [
      {
        title: localized("macOS App", "macOS App"),
        platform: localized(
          "macOS 14+ · Apple silicon and Intel",
          "macOS 14+ · Apple 芯片与 Intel",
        ),
        body: localized(
          "Install the App with its local Runtime. Set up the Terminal command under Settings → Access & launch, then start Claude or Codex. The same page provides the Web workbench address.",
          "安装自带本地 Runtime 的 App。在“设置 → 接入与启动”中配置终端命令，再启动 Claude 或 Codex；同一页面也提供 Web 工作台地址。",
        ),
        command: "brew install --cask vibe-agi/tap/vibermate",
      },
      {
        title: localized("Linux Server + Web", "Linux Server + Web"),
        platform: localized(
          "Linux x86-64 and ARM64",
          "Linux x86-64 与 ARM64",
        ),
        body: localized(
          "Extract the matching archive and start the Server. Open http://127.0.0.1:9666, then use the setup key from ./vibermated server recovery-key to create your owner login. Local use needs no domain or certificate.",
          "解压对应架构的压缩包并启动 Server。打开 http://127.0.0.1:9666，用 ./vibermated server recovery-key 获取的初始化密钥创建所有者账号。本机使用无需域名或证书。",
        ),
        command:
          "./vibermated server",
      },
    ],
    repository: "https://github.com/vibe-agi/vibermate",
    release: "https://github.com/vibe-agi/vibermate/releases/tag/v0.1.14",
    features: [
      {
        title: localized("Keep the normal workflow", "保留原来的使用方式"),
        body: localized(
          "Launch Claude Code or Codex from Terminal and inspect the same run in the macOS App or Web workbench.",
          "从终端启动 Claude Code 或 Codex，再在 macOS App 或 Web 工作台查看同一次运行。",
        ),
      },
      {
        title: localized("Route with intent", "按你的逻辑选择去向"),
        body: localized(
          "Choose an Endpoint, account, model mapping, or bounded JavaScript selector, then dry-run one synthetic request before publishing.",
          "选择上游服务、账号、模型映射或受限的 JavaScript 选择器，并在发布前用一条合成请求试跑。",
        ),
      },
      {
        title: localized("Leave useful evidence", "留下真正有用的证据"),
        body: localized(
          "Search retained metadata, compare HTTP stages, preview redacted diagnostics, and make verified backups. Full recording retains semantic bodies for the configured period.",
          "搜索已保留的元数据、比较 HTTP 阶段、预览脱敏诊断并创建可验证备份。Full 录制会按配置期限保留语义正文。",
        ),
      },
      {
        title: localized("Manage upstream accounts", "集中管理上游账号"),
        body: localized(
          "Use experimental Codex OAuth, import an authorization file, or enter credentials manually. Link accounts to services, add searchable notes, and refresh managed tokens without editing routing policies.",
          "通过实验性 Codex OAuth、导入授权文件或手动填写添加账号。账号可关联到上游服务、添加可搜索的备注，并独立刷新托管令牌，无需修改流量策略。",
        ),
      },
      {
        title: localized("Read account quota clearly", "看清账号额度"),
        body: localized(
          "Inspect available token metadata and explicitly query upstream quota or account history. These upstream figures stay separate from ViberMate's own traffic statistics.",
          "查看令牌中的可用资料，按需查询上游额度和账号历史用量。上游数据与 ViberMate 自身的流量统计明确区分。",
        ),
      },
      {
        title: localized("Choose a deployment that fits", "按场景部署"),
        body: localized(
          "Run the native Server or Docker locally without a domain. Remote deployments support private-CA host or IP certificates, automatic HTTPS, or existing certificates; Owners can deliver revocable proxy logins and the Proxy CA from Web.",
          "本机原生 Server 或 Docker 无需域名。远程部署支持私有 CA 域名/IP 证书、自动 HTTPS 或已有证书；Owner 可从 Web 交付可撤销的代理登录与 Proxy CA。",
        ),
      },
      {
        title: localized("Choose what the Agent inherits", "选择 Agent 继承哪些变量"),
        body: localized(
          "Block environment variables by name or add explicit overrides. Launcher snapshots contain names only, including for remote terminals. Changes apply to new launches; filtering is not a sandbox.",
          "按名称屏蔽环境变量，或添加覆盖值。启动快照只采集变量名，也适用于远程终端。规则对新启动生效；变量过滤并非沙箱。",
        ),
      },
      {
        title: localized("Know where your data lives", "清楚数据存在哪里"),
        body: localized(
          "See the runtime data directory and SQLite path in Settings. The local App can move the complete directory with integrity checks and startup recovery; Web displays the server-side location.",
          "在设置中查看运行时数据目录和 SQLite 路径。本机 App 可迁移完整目录，并进行校验与启动恢复；Web 明确展示服务器上的位置。",
        ),
      },
      {
        title: localized("Observe ACP editors", "观察 ACP 编辑器"),
        body: localized(
          "Experimentally retain bounded ACP session and prompt outcomes through App or Server without pretending HTTP routing and account policy also apply.",
          "通过 App 或 Server 实验性保留有界的 ACP 会话与 Prompt 结果，并明确说明 HTTP 路由与账号策略不会因此生效。",
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
        src: "/images/vibermate/capture-timeline-2400.webp",
        previewSrc: "/images/vibermate/capture-timeline-1280.webp",
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
        width: 2400,
        height: 1341,
      },
      {
        src: "/images/vibermate/raw-evidence-2400.webp",
        previewSrc: "/images/vibermate/raw-evidence-1280.webp",
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
        width: 2400,
        height: 1341,
      },
      {
        src: "/images/vibermate/traffic-policies-2400.webp",
        previewSrc: "/images/vibermate/traffic-policies-1280.webp",
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
        width: 2400,
        height: 1341,
      },
      {
        src: "/images/vibermate/script-library-2400.webp",
        previewSrc: "/images/vibermate/script-library-1280.webp",
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
        width: 2400,
        height: 1341,
      },
      {
        src: "/images/vibermate/team-insights-2400.webp",
        previewSrc: "/images/vibermate/team-insights-1280.webp",
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
        width: 2400,
        height: 1341,
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
