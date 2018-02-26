import scrapeIt from 'scrape-it';
import debounce from 'debounce';
import icon from './icon.png';

export const options = (url) => ({
    url: 'https://www.thingiverse.com' + url,
    headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'}
});


const plugin = async ({display, term, hide, actions}) => {

    if (!/thing .+/.test(term)) return;

    const query = term.split('thing ')[1];

    const schema = {
        things: {
            listItem: '.thing',
            data: {
                id: {selector: '.thing-img-wrapper', attr: 'href'},
                title: {selector: '.thing-name'},
                subtitle: {selector: '.creator-name a'},
                image: {selector: '.thing-img', attr: 'src'}
            }
        }
    };

    display([
        {id: 'loading', title: `Searching ${query}`, subtitle: 'thingiverse', icon}
    ]);

    const result = await scrapeIt(options('/search?q=' + query), schema);

    hide('loading');

    display(result.data.things.map(it =>
        ({
            ...it,
            icon,
            getPreview: () => <div>
                <center>
                    <img src={it.image}/><p>{it.title}</p>
                    <small>by {it.subtitle}</small>
                </center>
            </div>,
            onSelect: () => actions.open(options(it.id).url)
        })
    ));

};


export const fn = debounce(plugin, 200);