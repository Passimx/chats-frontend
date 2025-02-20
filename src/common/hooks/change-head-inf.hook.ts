export const changeHead = (title: string = 'Passim', description?: string) => {
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', window.location.href);
    document.querySelector('meta[property="al:web:url"]')?.setAttribute('content', window.location.href);
    document.querySelector('meta[name="twitter:url"]')?.setAttribute('content', window.location.href);
    document.querySelector('meta[itemprop="url"]')?.setAttribute('href', window.location.href);

    if (title?.length) {
        document.title = title;
        document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
        document.querySelector('meta[itemprop="name"]')?.setAttribute('content', title);
    }

    if (description) {
        document.querySelector('meta[name="description"]')?.setAttribute('content', description);
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
        document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
        document.querySelector('meta[itemprop="description"]')?.setAttribute('content', description);
    }
};
