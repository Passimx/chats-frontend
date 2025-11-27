module.exports = {
    branches: ['main'],
    plugins: [
        '@semantic-release/commit-analyzer', // анализ коммитов
        '@semantic-release/release-notes-generator', // генерация заметок
        [
            '@semantic-release/changelog', // обновление CHANGELOG.md
            {
                changelogFile: 'CHANGELOG.md',
            },
        ],
        [
            '@semantic-release/github', // пуш релиза на GitHub через API
            {
                assets: ['CHANGELOG.md'], // CHANGELOG включается в релиз
            },
        ],
    ],
};
