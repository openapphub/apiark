# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in ApiArk, please report it responsibly.

**DO NOT** open a public GitHub issue for security vulnerabilities.

### How to Report

1. **Email**: Send a detailed report to **security@apiark.dev**
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours of your report
- **Assessment**: Within 7 days, we will assess the severity and confirm the vulnerability
- **Fix**: Critical vulnerabilities will be patched within 14 days
- **Disclosure**: We will coordinate with you on public disclosure timing

### Scope

The following are in scope:
- ApiArk desktop application (Tauri backend + React frontend)
- ApiArk CLI tool (`apiark`)
- Official website (apiark.dev)

The following are **out of scope**:
- Third-party plugins
- User-created mock servers
- Issues in upstream dependencies (report to the respective project)

### Safe Harbor

We will not take legal action against researchers who:
- Make a good faith effort to avoid privacy violations, data destruction, or service disruption
- Only interact with accounts they own or with explicit permission
- Report vulnerabilities through the process described above
- Allow reasonable time for remediation before disclosure

## Security Architecture

ApiArk is designed with security as a core principle:

- **Local-first**: All data stays on your machine. No cloud sync, no telemetry.
- **No eval()**: The frontend CSP prohibits `eval()` and remote scripts.
- **Capability-based permissions**: Tauri v2 restricts IPC commands per window.
- **Secret redaction**: Auth tokens are replaced with `[REDACTED]` in history.
- **Atomic writes**: File saves use write-to-temp + rename to prevent corruption.
- **Dependency auditing**: `cargo audit` and `pnpm audit` run in CI.
