// Domain
import {
  type Experiment,
  ExperimentArchitecture,
  ExperimentCategory,
  ExperimentContext,
  ExperimentStatus,
} from "../../domain/experiment";

const REPOSITORY_BASE_URL = "https://github.com/jterrazz/";

const experiments: Experiment[] = [
  {
    category: ExperimentCategory.App,
    components: [
      {
        architectures: [],
        description: "Open protocol specification for AI agent labor markets.",
        name: "HIRE Protocol",
        sourceUrl: new URL("https://github.com/clawrr/hire"),
        status: ExperimentStatus.Building,
      },
      {
        architectures: [],
        description: "The primary registry implementing HIRE.",
        name: "Registry",
        sourceUrl: new URL("https://github.com/clawrr/clawrr"),
        status: ExperimentStatus.Building,
      },
      {
        architectures: [],
        description: "Minimal SDK for agents to receive and handle tasks.",
        name: "Worker SDK",
        sourceUrl: new URL("https://github.com/clawrr/worker"),
        status: ExperimentStatus.Building,
      },
      {
        architectures: [],
        description: "Internal knowledge base and documentation.",
        isPrivate: true,
        name: "Wiki",
        sourceUrl: new URL("https://github.com/clawrr/wiki"),
        status: ExperimentStatus.Building,
      },
    ],
    context: ExperimentContext.Personal,
    description: "The marketplace where AI agents find work using the HIRE protocol.",
    tagline: "AI agent marketplace and registry.",
    iconUrl: "/assets/icons/appicon-clawrr.jpg",
    longDescription:
      "A registry and discovery layer for autonomous AI agents. Clawrr provides the infrastructure for agents to advertise their capabilities, find work, and build reputation, powered by the HIRE protocol and x402 payments.",
    name: "Clawrr",
    slug: "clawrr",
    status: ExperimentStatus.Building,
    year: 2026,
  },
  {
    category: ExperimentCategory.App,
    components: [
      {
        architectures: [
          ExperimentArchitecture.Atomic,
          ExperimentArchitecture.Clean,
          ExperimentArchitecture.Spectrum,
        ],
        description: "React Native Application.",
        name: "Mobile Client",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}capitaine-mobile`),
        status: ExperimentStatus.Building,
      },
    ],
    context: ExperimentContext.Personal,
    description: "A day to day copilot for your life.",
    tagline: "Your personal growth companion.",
    iconUrl: "/assets/icons/appicon-capitaine.png",
    longDescription:
      "Capitaine helps you build lasting habits through daily check-ins and progress insights. Track your goals, visualize streaks, and understand your patterns over time, a personal copilot for continuous improvement.",
    name: "Capitaine",
    slug: "capitaine",
    status: ExperimentStatus.Building,
    storeLinks: {
      web: "https://capitaine.app",
    },
    year: 2026,
  },
  {
    category: ExperimentCategory.App,
    components: [
      {
        architectures: [
          ExperimentArchitecture.DomainInfrastructure,
          ExperimentArchitecture.Hexagonal,
        ],
        description: "News processing platform with AI pipeline.",
        isPrivate: true,
        name: "API",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}n00-api`),
        status: ExperimentStatus.Active,
      },
      {
        architectures: [
          ExperimentArchitecture.Atomic,
          ExperimentArchitecture.DomainInfrastructure,
          ExperimentArchitecture.Spectrum,
        ],
        description: "React Native app built with Expo.",
        isPrivate: true,
        name: "Mobile",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}n00-mobile`),
        status: ExperimentStatus.Active,
      },
    ],
    context: ExperimentContext.Personal,
    description: "Your personal intelligence bureau, scanning global signals 24/7.",
    tagline: "AI-powered news with an intelligence agency aesthetic.",
    hasPrivacyPolicy: true,
    iconUrl: "/assets/icons/appicon-signews.png",
    longDescription:
      "Stop scrolling through noise. SigNews is your personal intelligence bureau, AI agents work around the clock to scan global signals and deliver what actually matters. Watch events unfold on a live map. Test your knowledge with quizzes. This isn't just reading the news. It's training your mind to see the world clearly.",
    name: "SigNews",
    slug: "signews",
    status: ExperimentStatus.Active,
    storeLinks: {
      appStore: "https://apps.apple.com/us/app/ai-news-smart-world-news/id6742116038",
      playStore: "https://play.google.com/store/apps/details?id=com.jterrazz.signews",
    },
    year: 2025,
  },
  {
    category: ExperimentCategory.App,
    components: [
      {
        architectures: [
          ExperimentArchitecture.Atomic,
          ExperimentArchitecture.Clean,
          ExperimentArchitecture.Spectrum,
        ],
        description: "Next.js application with Tailwind CSS.",
        name: "Web Client",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}jterrazz-web`),
        status: ExperimentStatus.Active,
      },
    ],
    context: ExperimentContext.Personal,
    description: "Personal space for experiments, articles, and projects.",
    tagline: "Where ideas take shape.",
    iconUrl: "/assets/icons/appicon-jterrazz.png",
    longDescription:
      "A place to share what I build and learn. Browse experiments, read articles, and explore photographs, all in one personal space.",
    name: "Jterrazz",
    slug: "jterrazz",
    status: ExperimentStatus.Active,
    storeLinks: {
      web: "https://jterrazz.com",
    },
    year: 2024,
  },
  {
    category: ExperimentCategory.Tool,
    components: [
      {
        architectures: [],
        description: "Shared TypeScript configuration.",
        name: "Typescript",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-typescript`),
        status: ExperimentStatus.Active,
      },
      {
        architectures: [],
        description: "Shared ESLint and Prettier configuration.",
        name: "Codestyle",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-quality`),
        status: ExperimentStatus.Active,
      },
      {
        architectures: [],
        description: "Jest configuration and test utilities.",
        name: "Test",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-test`),
        status: ExperimentStatus.Active,
      },
      {
        architectures: [],
        description: "Structured logging utility.",
        name: "Logger",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-logger`),
        status: ExperimentStatus.Active,
      },

      {
        architectures: [],
        description: "Composable AI-agent toolkit for TypeScript apps.",
        name: "Intelligence",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-intelligence`),
        status: ExperimentStatus.Active,
      },
    ],
    context: ExperimentContext.Personal,
    description: "A collection of typescript packages for building my node.js applications.",
    tagline: "Shared configs and utilities.",
    longDescription:
      "A collection of reusable packages to keep my projects consistent. Shared linting rules, test setups, logging, and HTTP utilities, everything needed to bootstrap new apps without reinventing the wheel.",
    name: "Typescript",
    slug: "typescript-packages",
    status: ExperimentStatus.Active,
    year: 2024,
  },
  {
    category: ExperimentCategory.Hackathon,
    components: [
      {
        architectures: [],
        description: "Synthetic asset platform with Chainlink oracles.",
        name: "Defy Dy",
        sourceUrl: new URL("https://devpost.com/software/defy-dy"),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.Hackathon,
    description: "Synthetic asset platform leveraging Chainlink oracles.",
    tagline: "DeFi with real-world assets.",
    longDescription:
      "Trade synthetic versions of real-world assets on the blockchain. Defy-Dy brings stock prices and other off-chain data on-chain through oracles, letting you gain exposure to traditional markets in a decentralized way.",
    name: "Defy Dy",
    slug: "defy-dy",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.Hackathon,
    components: [
      {
        architectures: [],
        description: "Blockchain crowdfunding platform using CVT tokens.",
        name: "CVT Crowdfunding",
        sourceUrl: new URL("https://devpost.com/software/ethparis"),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.Hackathon,
    description: "Blockchain-based crowdfunding platform using CVT tokens.",
    tagline: "Decentralized fundraising.",
    longDescription:
      "A transparent crowdfunding platform where every transaction is on-chain. Backers can track exactly where funds go, and creators get paid automatically when milestones are met, no middlemen, full accountability.",
    name: "CVT Crowdfunding",
    slug: "cvt-crowdfunding",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.Tool,
    components: [
      {
        architectures: [],
        description: "Infrastructure as Code for personal projects.",
        name: "Infra",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}jterrazz-infra`),
        status: ExperimentStatus.Active,
      },
    ],
    context: ExperimentContext.Personal,
    description: "Infrastructure as Code for my personal cloud environment.",
    tagline: "Automated cloud provisioning.",
    longDescription:
      "One-command deployment for my entire cloud setup. Servers, databases, networking, and security configurations, all versioned and reproducible. Spin up or tear down environments in minutes.",
    name: "Infrastructure",
    slug: "infrastructure",
    status: ExperimentStatus.Active,
    year: 2024,
  },
  {
    category: ExperimentCategory.App,
    components: [
      {
        architectures: [],
        description: "AI Agents framework and implementations.",
        name: "Agents",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}jterrazz-agents`),
        status: ExperimentStatus.Active,
      },
    ],
    context: ExperimentContext.Personal,
    description: "Experimental framework for building autonomous AI agents.",
    tagline: "Autonomous AI workflows.",
    longDescription:
      "A playground for autonomous AI workflows. Agents that can browse the web, write code, manage files, and chain actions together, experimenting with how far LLMs can go when given tools and memory.",
    name: "AI Agents",
    slug: "ai-agents",
    status: ExperimentStatus.Active,
    year: 2024,
  },
  // 42 Projects Flattened
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Backward chaining algorithm implementation.",
        name: "Inference Engine",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-expert-system`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description:
      "Backward chaining rule based system in Python. RPN, Tree resolver, Tree representation, logic rule system, prompt.",
    tagline: "Propositional logic inference.",
    longDescription:
      "Feed it rules and facts, ask it questions. This expert system reasons backward from goals to find what's true, handling complex logical relationships to deduce answers automatically.",
    name: "Expert System",
    slug: "expert-system",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Binary exploitation and reverse engineering.",
        name: "Exploits",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-override`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description:
      "Advanced binary security experiment - Exploits and reverse engineering - x86 and x86-64 binaries.",
    tagline: "Advanced binary exploitation.",
    longDescription:
      "The final security gauntlet, 14 levels of increasingly protected binaries to crack. Bypass modern protections, exploit race conditions, and chain vulnerabilities to escalate privileges on each level.",
    name: "Override",
    slug: "override",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Binary analysis and exploitation.",
        name: "Exploits",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-rainfall`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description:
      "Intermediate cybersecurity experiment, and an introduction to binary analysis - X86 binaries.",
    tagline: "Binary analysis fundamentals.",
    longDescription:
      "Exploit your way through 14 vulnerable programs. Each level hides a password protected by a different flaw, buffer overflows, format strings, heap corruption. Find the weakness, craft the exploit, level up.",
    name: "Rainfall",
    slug: "rainfall",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Buffer overflow and shellcode injection.",
        name: "Exploits",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-snowcrash`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description: "Entry level cybersecurity experiment - X86 binaries.",
    tagline: "Introduction to reverse engineering.",
    longDescription:
      "A capture-the-flag introduction to security. 14 levels mixing reverse engineering, privilege escalation, and classic exploits. Find the flag, unlock the next level, learn how systems break.",
    name: "Snowcrash",
    slug: "snowcrash",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Process virtual machine implementation.",
        name: "Virtual Machine",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-corewar`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description:
      "Virtual machine simulating basic processors operations, with basic notions of Assembly. Written in C.",
    tagline: "VM and assembly arena.",
    longDescription:
      "Write tiny warrior programs in assembly and watch them battle for memory. Champions compete in a shared arena, overwriting each other, replicating, and fighting to be the last one standing.",
    name: "Corewar",
    slug: "corewar",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Mach-O binary parser.",
        name: "Binary Parser",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-nm-otool`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description:
      "Nm and otool implementation in C. Parse Mach-o files, supports fat binaries, archives and corrupted binaries.",
    tagline: "Mach-O binary parser.",
    longDescription:
      "Peek inside macOS binaries. List symbols, inspect segments, and understand what's packed inside executables, handling universal binaries, archives, and edge cases along the way.",
    name: "NM Otool",
    slug: "nm-otool",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "MD5 and SHA-256 implementation.",
        name: "Hashing Lib",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-ssl-md5`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description:
      "OpenSSL implementation in C. Supports md5, sha1, sha256, sha224, sha512 and sha384 algorithms.",
    tagline: "Cryptographic hashing from scratch.",
    longDescription:
      "Hash anything with MD5, SHA-256, and the full SHA-2 family. Feed it files or strings, get cryptographic fingerprints, built from scratch to understand how hashing really works.",
    name: "MD5 & SHA256",
    slug: "md5-sha256",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Dynamic memory allocator implementation.",
        name: "Allocator",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-malloc`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description: "C implementation of the malloc library using mmap.",
    tagline: "Dynamic memory allocator.",
    longDescription:
      "A memory allocator that manages heap space directly. Allocate, free, and reallocate memory efficiently, handling fragmentation, thread safety, and performance without relying on the standard library.",
    name: "Malloc",
    slug: "malloc",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Self-replicating programs.",
        name: "Quines",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-dr-quine`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description:
      "This experiment addresses auto-replication issues, and confronts you the Kleene's recursion theorem.",
    tagline: "Self-replicating programs.",
    longDescription:
      "Programs that print themselves. Write code that outputs its own source, no cheating, no reading files. An exercise in self-reference and the strange loops at the heart of computation.",
    name: "Dr Quine",
    slug: "dr-quine",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Backtracking algorithm.",
        name: "Solver",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-fillit`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description: "Algorithmic C experiment for the 42 Paris School",
    tagline: "Tetrimino packing solver.",
    longDescription:
      "Pack Tetris pieces into the smallest possible square. Given any set of tetriminos, find the tightest arrangement, a puzzle solver that brute-forces its way to the optimal fit.",
    name: "Fillit",
    slug: "fillit",
    status: ExperimentStatus.Completed,
    year: 2017,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Format string parser and output formatter.",
        name: "Printf",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-ft-printf`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description: "Custom printf implementation in C.",
    tagline: "Variadic string formatting.",
    longDescription:
      "A printf that handles all the formatting you'd expect, integers, strings, pointers, hex, with full support for width, precision, and padding. Drop-in replacement for the standard version.",
    name: "Ft Printf",
    slug: "ft-printf",
    status: ExperimentStatus.Completed,
    year: 2017,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Buffered file reader implementation.",
        name: "File Reader",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-get-next-line`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description: "Read lines from a file descriptor.",
    tagline: "Buffered file reading.",
    longDescription:
      "Read files line by line, no matter the buffer size. A simple function that handles the messy details of file I/O, buffering, partial reads, and memory, so you don't have to.",
    name: "Get Next Line",
    slug: "get-next-line",
    status: ExperimentStatus.Completed,
    year: 2017,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Max-flow algorithm implementation.",
        name: "Graph Solver",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-lem-in`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description: "Handle a virtual anthill efficiently.",
    tagline: "Graph max-flow algorithm.",
    longDescription:
      "Move ants through a maze as fast as possible. Given rooms and tunnels, find the optimal paths to get everyone from start to finish in the fewest turns, a traffic optimization puzzle.",
    name: "Lem In",
    slug: "lem-in",
    status: ExperimentStatus.Completed,
    year: 2018,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "x86 Assembly implementation of libc functions.",
        name: "ASM Lib",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-libft-asm`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description: "Basic functions implemented in Assembly using the x86 Intel syntax.",
    tagline: "x86 Assembly libc.",
    longDescription:
      "Standard string functions rewritten at the lowest level. strlen, strcpy, strcmp, all in raw assembly, talking directly to the CPU and kernel.",
    name: "Libft ASM",
    slug: "libft-asm",
    status: ExperimentStatus.Completed,
    year: 2019,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Standard C library implementation.",
        name: "Std Lib",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-libft`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description: "The basic libc library used in all the 42 school experiments.",
    tagline: "C standard library.",
    longDescription:
      "A personal C library used across all projects. String manipulation, memory utilities, linked lists, the building blocks for everything else.",
    name: "Libft",
    slug: "libft",
    status: ExperimentStatus.Completed,
    year: 2017,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Stack sorting algorithm.",
        name: "Sorter",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-push-swap`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description:
      "Sorts data on a stack, with a limited set of instructions and limited number of moves. In C.",
    tagline: "Stack-based sorting.",
    longDescription:
      "Sort a stack with the fewest moves possible. Only swaps, rotates, and pushes allowed, find the most efficient sequence to get everything in order.",
    name: "Push Swap",
    slug: "push-swap",
    status: ExperimentStatus.Completed,
    year: 2018,
  },
  {
    category: ExperimentCategory.System,
    components: [
      {
        architectures: [],
        description: "Basic C programming exercises.",
        name: "Exercises",
        sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-piscine-reloaded`),
        status: ExperimentStatus.Completed,
      },
    ],
    context: ExperimentContext.School42,
    description: "My 42 paris school entry test.",
    tagline: "C programming fundamentals.",
    longDescription:
      "A refresher on C fundamentals. Pointers, loops, types, and compilation, exercises to sharpen the basics before diving deeper.",
    name: "Piscine Reloaded",
    slug: "piscine-reloaded",
    status: ExperimentStatus.Completed,
    year: 2017,
  },
];

export const experimentsRepository = {
  getAll: (): Experiment[] => experiments,
  getBySlug: (slug: string): Experiment | undefined => experiments.find((e) => e.slug === slug),
};
