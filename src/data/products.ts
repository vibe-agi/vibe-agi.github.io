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
  src: LocalizedText;
  previewSrc: LocalizedText;
  eyebrow: LocalizedText;
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

export interface ProductStep {
  title: LocalizedText;
  body: LocalizedText;
  command?: string;
}

export interface ProductLink {
  label: LocalizedText;
  href: LocalizedText;
}

export interface ProductIntro {
  title: LocalizedText;
  body: LocalizedText;
  steps: readonly ProductStep[];
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
  boundaryLabel?: LocalizedText;
  intro?: ProductIntro;
  audiences?: readonly ProductFeature[];
  platform: LocalizedText;
  install: string;
  setupPaths?: readonly ProductSetupPath[];
  start?: readonly ProductStep[];
  repository: string;
  release: string;
  featuresLabel?: LocalizedText;
  features: readonly ProductFeature[];
  links?: readonly ProductLink[];
  diagram: ProductDiagram;
  screenshots?: readonly ProductScreenshot[];
}

const localized = (en: string, zh: string): LocalizedText => ({ en, zh });

// Screenshots are rendered per language by tool/product-screenshots in the
// ViberMate repository, 2400 pixels wide with a 1280 pixel preview.
const screenshot = (
  name: string,
  height: number,
  text: Pick<ProductScreenshot, "eyebrow" | "title" | "body" | "alt">,
): ProductScreenshot => ({
  src: localized(
    `/images/vibermate/${name}-en-2400.webp`,
    `/images/vibermate/${name}-zh-2400.webp`,
  ),
  previewSrc: localized(
    `/images/vibermate/${name}-en-1280.webp`,
    `/images/vibermate/${name}-zh-1280.webp`,
  ),
  width: 2400,
  height,
  ...text,
});

const productCatalog: readonly Product[] = [
  {
    slug: "vibermate",
    index: "01",
    name: "ViberMate",
    tone: "vibermate",
    role: localized(
      "For people who use Claude Code or Codex",
      "给使用 Claude Code 或 Codex 的人",
    ),
    status: localized(
      "macOS + Linux · v0.1.19",
      "macOS + Linux · v0.1.19",
    ),
    version: "0.1.19",
    headline: localized(
      "See and steer your coding agent.",
      "看清并掌控你的 AI 编程助手。",
    ),
    summary: localized(
      "ViberMate sits between Claude Code or Codex and the AI service. It records each conversation, lets you choose which account answers, can ask you before the agent reaches somewhere new, and adds up tokens and cost, on your Mac or on one server for your team.",
      "ViberMate 位于 Claude Code、Codex 与 AI 服务之间：记录每一段对话，由你决定哪个账号来应答，Agent 访问新地址前可以先问你，并统计 Token 与费用。可以装在你的 Mac 上，也可以部署一台服务器给整个团队用。",
    ),
    intro: {
      title: localized(
        "A dashcam and a steering wheel for your coding agent.",
        "AI 编程助手的行车记录仪和方向盘。",
      ),
      body: localized(
        "Claude Code and Codex talk to an AI service over the network. Normally you can't see those messages or decide where they go. ViberMate stands in the middle, and you keep using your agent exactly as before.",
        "Claude Code 和 Codex 通过网络与 AI 服务对话，平时你既看不到这些消息，也决定不了它们发往哪里。ViberMate 站在两者之间，而你照常使用编程助手，什么都不用改。",
      ),
      steps: [
        {
          title: localized(
            "Start your agent through ViberMate",
            "通过 ViberMate 启动编程助手",
          ),
          body: localized(
            "Use this instead of your usual command; for Codex, end it with codex. Your agent, account and settings stay the same.",
            "用它代替平时的启动命令；使用 Codex 时把结尾换成 codex。编程助手、账号和设置都保持不变。",
          ),
          command: "vibermate run -- claude",
        },
        {
          title: localized(
            "Every request passes through it",
            "每个请求都经过 ViberMate",
          ),
          body: localized(
            "ViberMate runs on your Mac or your team's server. It records what goes back and forth and applies the rules you set.",
            "ViberMate 运行在你的 Mac 或团队服务器上，记录往来的内容，并执行你设定的规则。",
          ),
        },
        {
          title: localized(
            "Open the workbench",
            "打开工作台",
          ),
          body: localized(
            "Read each conversation, switch accounts, approve new connections, and check usage and cost, in the App or a browser.",
            "在 App 或浏览器里查看每段对话、切换账号、审批新的连接、查看用量与费用。",
          ),
        },
      ],
    },
    audiences: [
      {
        title: localized("Developers", "个人开发者"),
        body: localized(
          "See exactly what your agent sent and received, and keep a searchable history of every session.",
          "看清编程助手到底发出和收到了什么，并保留每次会话的可搜索记录。",
        ),
      },
      {
        title: localized("People with several accounts", "有多个账号的人"),
        body: localized(
          "Send requests to the account or service you choose, see each account's remaining quota, and switch without editing config files.",
          "把请求发给你选定的账号或服务，查看每个账号的剩余额度，切换时不用改配置文件。",
        ),
      },
      {
        title: localized("Teams", "团队"),
        body: localized(
          "Run one server for everyone. Each person signs in with their own account; the owner decides who may use which policies and sees usage by person, project and model.",
          "一台服务器全员共用。每人用自己的账号登录，所有者决定谁能使用哪些策略，并按人员、项目和模型查看用量。",
        ),
      },
    ],
    boundaryLabel: localized("What it is not", "它不是什么"),
    boundary: localized(
      "ViberMate is not an AI agent or a model provider. It only sees traffic that goes through it, and it never sends your data to a service of its own.",
      "ViberMate 不是 AI 编程助手，也不是模型服务商。它只能看到经过它的流量，也从不把你的数据发往它自己的服务。",
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
          "For using ViberMate on your own Mac. The App includes everything it needs.",
          "在自己的 Mac 上使用。App 自带运行所需的一切。",
        ),
        command: "brew install --cask vibe-agi/tap/vibermate",
      },
      {
        title: localized("Linux server", "Linux 服务器"),
        platform: localized(
          "Linux x86-64 and ARM64",
          "Linux x86-64 与 ARM64",
        ),
        body: localized(
          "For a team, or to use ViberMate from a browser. Download the archive from the release page, extract it, start the server, and open http://127.0.0.1:9666. The key for the first owner account comes from ./vibermated server recovery-key.",
          "给团队使用，或想在浏览器里使用时选择。从版本页面下载压缩包，解压后启动服务器，打开 http://127.0.0.1:9666；第一个所有者账号所需的密钥由 ./vibermated server recovery-key 给出。",
        ),
        command: "./vibermated server",
      },
    ],
    start: [
      {
        title: localized("Connect your terminal", "接入终端"),
        body: localized(
          "In the App, open Settings → Access & launch → Terminal command and set up the vibermate command. With a server, sign in once instead.",
          "在 App 中打开“设置 → 接入与启动 → 终端命令”，设置好 vibermate 命令。使用服务器时，改为登录一次即可。",
        ),
        command: "vibermate login --server http://127.0.0.1:9666",
      },
      {
        title: localized("Start your agent", "启动编程助手"),
        body: localized(
          "Run it from your project. Add --server <address> when you use a server. Then open the workbench to watch the conversation arrive.",
          "在项目目录运行。使用服务器时加上 --server <地址>。然后打开工作台，看对话实时出现。",
        ),
        command: "vibermate run -- claude",
      },
    ],
    repository: "https://github.com/vibe-agi/vibermate",
    release: "https://github.com/vibe-agi/vibermate/releases/tag/v0.1.19",
    featuresLabel: localized("Good to know", "值得了解"),
    features: [
      {
        title: localized("Your agent works as before", "编程助手照常工作"),
        body: localized(
          "ViberMate doesn't replace Claude Code, Codex or your AI provider. Without your own policy it records traffic and passes it through unchanged.",
          "ViberMate 不替代 Claude Code、Codex 或你的 AI 服务商。没有设置自己的策略时，它只记录流量，原样转发。",
        ),
      },
      {
        title: localized("Your data stays with you", "数据留在你手里"),
        body: localized(
          "Records live in a database on your Mac or your server. There is no ViberMate cloud, and you choose what is recorded and for how long.",
          "记录保存在你的 Mac 或服务器上的数据库里。ViberMate 没有云服务；记录什么、保留多久由你决定。",
        ),
      },
      {
        title: localized("Credentials stay out of records", "凭据不进记录"),
        body: localized(
          "API keys and sign-in tokens are stored separately and are never written into policies or recorded conversations.",
          "API Key 和登录令牌单独保存，不会写进策略或记录下来的对话。",
        ),
      },
      {
        title: localized("Numbers you can trust", "数字说真话"),
        body: localized(
          "Token counts come from what the provider reports, and costs are labelled as estimates. Missing data is shown as missing, never guessed.",
          "Token 数来自服务商的返回，费用明确标为估算。缺少的数据就显示为缺少，从不猜测。",
        ),
      },
      {
        title: localized("Runs on your own network", "在你自己的网络里运行"),
        body: localized(
          "The server and its web workbench are self-contained: use it on one computer, inside a private network, or over HTTPS on a public domain, and choose which networks may connect with an IP allowlist.",
          "服务器和 Web 工作台自成一体：可以只在一台电脑上用，也可以在内网里用，或通过公网域名以 HTTPS 访问，并用 IP 白名单决定哪些网络可以连接。",
        ),
      },
      {
        title: localized("Scripts for special cases", "特殊需求用脚本"),
        body: localized(
          "Small JavaScript rules can hide personal details or block leaked secrets. They run in a sandbox with no network or file access.",
          "简短的 JavaScript 规则可以隐藏个人信息、拦截泄露的密钥。它们运行在沙箱中，无法访问网络或文件。",
        ),
      },
    ],
    links: [
      {
        label: localized("Deployment and HTTPS", "部署与 HTTPS"),
        href: localized(
          "https://github.com/vibe-agi/vibermate/blob/main/docs/deployment.md",
          "https://github.com/vibe-agi/vibermate/blob/main/docs/deployment.zh-CN.md",
        ),
      },
      {
        label: localized("Docker", "Docker"),
        href: localized(
          "https://github.com/vibe-agi/vibermate/blob/main/docs/docker.md",
          "https://github.com/vibe-agi/vibermate/blob/main/docs/docker.zh-CN.md",
        ),
      },
      {
        label: localized("Backup and restore", "备份与恢复"),
        href: localized(
          "https://github.com/vibe-agi/vibermate/blob/main/docs/backup-and-restore.md",
          "https://github.com/vibe-agi/vibermate/blob/main/docs/backup-and-restore.zh-CN.md",
        ),
      },
      {
        label: localized("What is supported today", "当前支持范围"),
        href: localized(
          "https://github.com/vibe-agi/vibermate/blob/main/docs/capability-support.md",
          "https://github.com/vibe-agi/vibermate/blob/main/docs/capability-support.md",
        ),
      },
      {
        label: localized("Security policy", "安全策略"),
        href: localized(
          "https://github.com/vibe-agi/vibermate/blob/main/SECURITY.md",
          "https://github.com/vibe-agi/vibermate/blob/main/SECURITY.md",
        ),
      },
    ],
    diagram: {
      label: localized("Where ViberMate sits", "ViberMate 在哪里"),
      nodes: [
        localized("Claude / Codex", "Claude / Codex"),
        localized("ViberMate", "ViberMate"),
        localized("AI service", "AI 服务"),
      ],
      caption: localized(
        "Your agent → ViberMate records and decides → the AI service you choose.",
        "编程助手 → ViberMate 记录并决定去向 → 你选定的 AI 服务。",
      ),
    },
    screenshots: [
      screenshot("conversation", 1340, {
        eyebrow: localized("See", "看清"),
        title: localized("Every conversation, turn by turn", "逐轮看清每段对话"),
        body: localized(
          "Each session shows what you asked, what the model answered, which tools it used, and which account and model handled it. The raw request is one click away.",
          "每次会话都能看到你问了什么、模型答了什么、用了哪些工具，以及由哪个账号和模型处理。原始请求一点即开。",
        ),
        alt: localized(
          "A Claude Code session in ViberMate with its conversation shown turn by turn",
          "ViberMate 中按轮次展示的一次 Claude Code 会话",
        ),
      }),
      screenshot("approval", 700, {
        eyebrow: localized("Approve", "审批"),
        title: localized(
          "Decide before your agent goes somewhere new",
          "Agent 去新地方之前，先由你决定",
        ),
        body: localized(
          "When the agent tries to reach a site your policy hasn't decided, ViberMate holds the connection and asks. Allow it once, refuse it, or save a rule.",
          "当 Agent 想访问策略里尚未决定的网站时，ViberMate 会先拦住连接并询问你：本次允许、本次拒绝，或者保存为规则。",
        ),
        alt: localized(
          "A pending network access approval for github.com in ViberMate",
          "ViberMate 中一条待审批的 github.com 网络访问请求",
        ),
      }),
      screenshot("routes", 1340, {
        eyebrow: localized("Steer", "掌控去向"),
        title: localized(
          "Choose which account and service answers",
          "决定由哪个账号和服务应答",
        ),
        body: localized(
          "A traffic policy connects each agent to an upstream service and account. Change it here, and running sessions follow on their next request.",
          "流量策略把每个编程助手连到一个上游服务和账号。在这里修改后，正在运行的会话从下一个请求起生效。",
        ),
        alt: localized(
          "The Work traffic policy routing Anthropic and OpenAI requests to chosen accounts",
          "Work 流量策略把 Anthropic 与 OpenAI 请求路由到选定的账号",
        ),
      }),
      screenshot("accounts", 1340, {
        eyebrow: localized("Accounts", "账号"),
        title: localized(
          "All your upstream accounts in one place",
          "所有上游账号集中管理",
        ),
        body: localized(
          "Add API keys, or sign in to Codex with ChatGPT. Quota windows and reset times stay visible, and Codex sign-ins can refresh automatically.",
          "添加 API Key，或用 ChatGPT 登录 Codex。额度窗口和重置时间一目了然，Codex 登录可以自动续期。",
        ),
        alt: localized(
          "Upstream accounts in ViberMate, including a ChatGPT account with its quota",
          "ViberMate 的上游账号列表，其中 ChatGPT 账号显示了额度",
        ),
      }),
      screenshot("usage", 1340, {
        eyebrow: localized("Measure", "算清用量"),
        title: localized("Know the usage and the cost", "知道用了多少、花了多少"),
        body: localized(
          "Count requests, tokens and estimated cost by project, branch, model, account or person. Costs come from public prices and are marked as estimates, not a bill.",
          "按项目、分支、模型、账号或人员统计请求数、Token 和估算费用。费用按公开价格估算，并明确标注不是账单。",
        ),
        alt: localized(
          "The ViberMate usage overview with requests, tokens and estimated cost",
          "ViberMate 使用概览，显示请求数、Token 与估算费用",
        ),
      }),
      screenshot("scripts", 1340, {
        eyebrow: localized("Customize", "定制"),
        title: localized("Small scripts for special cases", "特殊需求用小脚本解决"),
        body: localized(
          "Start from built-in examples that hide personal details, block leaked secrets or set a reply language, and test them before you turn them on.",
          "从内置示例开始：隐藏个人信息、拦截泄露的密钥、设定回复语言，并在启用前先测试。",
        ),
        alt: localized(
          "The ViberMate script library with built-in JavaScript examples",
          "ViberMate 脚本库中的内置 JavaScript 示例",
        ),
      }),
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
