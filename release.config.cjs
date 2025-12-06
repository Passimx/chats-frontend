module.exports = {
    branches: ['main'],
    tagFormat: '${version}',
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                releaseRules: [
                    { tag: 'breaking', release: 'major' },
                    { tag: 'feat', release: 'minor' },
                    { tag: 'fix', release: 'patch' },
                    { tag: 'refactor', release: 'patch' },
                    { tag: 'security', release: 'patch' },
                    { tag: 'style', release: 'patch' },
                    { tag: 'chore', release: false },
                    { tag: 'ci', release: false },
                    { tag: 'docs', release: false },
                    { tag: 'test', release: false },
                ],
            },
        ],
        '@semantic-release/release-notes-generator',
        ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
        ['@semantic-release/npm', { npmPublish: false }],
        [
            '@semantic-release/git',
            {
                assets: ['package.json', 'package-lock.json'],
                message: 'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}',
            },
        ],
        ['@semantic-release/github', { assets: ['CHANGELOG.md'] }],
    ],
};
