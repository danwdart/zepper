import Spider from 'node-spider';

const strURL = process.argv[2],
    pSpider = strURL => new Promise(
        (res, rej) => {
            const spider = new Spider(
                    {
                        concurrent: 5,
                        delay: 0,
                        logs: process.stderr,
                        allowDuplicates: false,
                        catchErrors: true,
                        addReferrer: false,
                        xhr: false,
                        keepAlive: false,
                        error: (err, url) => rej(err),
                        // Called when there are no more requests
                        done: spider => res(spider),
                        //- All options are passed to `request` module, for example:
                        headers: { 'user-agent': 'node-spider' },
                        encoding: 'utf8'
                    }
                ),
                handleRequest = doc => doc.$('a').each(
                    (i, elem) => {
                        const href = doc.$(elem).attr('href').split('#')[0],
                            strLocalURL = doc.resolve(href);

                        spider.queue(strLocalURL, handleRequest);
                    }
                );
            spider.queue(strURL, handleRequest);
        }
    );
(async () => {
    try {
        const spiderResult = await pSpider(strURL);
    } catch (err) {
        console.error(err);
    }

    console.log(spiderResult);
})();
