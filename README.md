# Jterrazz Web

My corner of the internet — [jterrazz.com](https://www.jterrazz.com). Articles on software and AI, the experiments behind them, and a photography gallery. Every article is cryptographically signed and anchored to Bitcoin.

![Node.js](https://img.shields.io/badge/node-24.x-brightgreen)
![Next.js](https://img.shields.io/badge/next.js-16-blue)
![React](https://img.shields.io/badge/react-19-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Quick start

```sh
git clone https://github.com/jterrazz/jterrazz-web.git && cd jterrazz-web
npm install
npm run dev            # http://localhost:3000
```

| Command        | Does                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| `npm run dev`  | Development server                                                                                            |
| `npm test`     | Everything — unit tests + the rendered site driven in a real browser (`npx playwright install chromium` once) |
| `npm run lint` | `typescript check`: types, lint, format, unused code, spec conventions                                        |
| `npm run sync` | Refresh `assets/` from the notes library                                                                      |

## How it works

The repo brief — architecture, the content pipeline, attestation, the testing doctrine — lives in [`AGENTS.md`](AGENTS.md).

Built on the `@jterrazz` stack: [`@jterrazz/typescript`](https://github.com/jterrazz/package-typescript), [`@jterrazz/test`](https://github.com/jterrazz/package-test), [`@jterrazz/manifest`](https://github.com/jterrazz/package-manifest), [`@jterrazz/attestation`](https://github.com/jterrazz/package-attestation).

## License

MIT — see [LICENSE](LICENSE).
