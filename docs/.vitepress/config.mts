import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid(
  defineConfig({
    title: 'Personal Website — Developer Docs',
    description: 'Technical architecture, multi-agent system, workflows, and data dictionary for PersonalWebsite portfolio.',
    mermaid: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        primaryColor: '#3b82f6',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#60a5fa',
        lineColor: '#94a3b8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
      },
    },
    themeConfig: {
      nav: [
        { text: 'Overview', link: '/overview' },
        { text: 'Features', link: '/features' },
        { text: 'Workflows', link: '/workflows' },
        { text: 'Agents & Skills', link: '/agents' },
        { text: 'Data Dictionary', link: '/data-dictionary' },
        { text: 'Roadmap', link: '/github_issues_roadmap' },
      ],
      sidebar: [
        {
          text: 'Architecture & Guides',
          items: [
            { text: 'Overview & Tech Stack', link: '/overview' },
            { text: 'Portfolio Features', link: '/features' },
            { text: 'Interactive Workflows', link: '/workflows' },
            { text: 'Data Dictionary (Database)', link: '/data-dictionary' },
          ]
        },
        {
          text: 'AI Multi-Agent System',
          items: [
            { text: 'Specialized Subagents', link: '/agents' },
            { text: 'Progressive Skills Catalog', link: '/skills' },
            { text: 'ADR 0001: Project-Scoped Agents', link: '/adr/0001-project-scoped-agents' },
            { text: 'ADR 0002: Live Step Logging & Handoff', link: '/adr/0002-real-time-step-logging-and-session-handoff' },
            { text: 'ADR 0003: Modular Architecture & File Locks', link: '/adr/0003-modular-clean-code-and-cross-cli-file-locking' },
          ]
        },
        {
          text: 'Roadmap & Tracking',
          items: [
            { text: 'GitHub Issues & Milestones', link: '/github_issues_roadmap' },
          ]
        }
      ],
      socialLinks: [
        { icon: 'github', link: 'https://github.com/savewaris/PersonalWebsiteFullStack' }
      ],
      footer: {
        message: 'Internal Developer Documentation & AI Engineering Hub',
        copyright: 'Copyright © 2026 Personal Website Team'
      }
    }
  })
);
