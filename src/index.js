import debounce from 'debounce';
import icon from './icon.png';
import axios from 'axios';


const plugin = async ({display, term, hide, actions}) => {

    if (!/thing .+/.test(term)) return;

    const query = term.split('thing ')[1];

    display([
        {id: 'loading', title: `Searching ${query}`, subtitle: 'thingiverse', icon}
    ]);

    const {data} = await axios.get(`https://api.thingiverse.com/search/${query}?page=1&per_page=30&sort=relevant&type=things`, {
        headers: {
            'Authorization': 'Bearer 56edfc79ecf25922b98202dd79a291aa',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    const things = data.hits.map(it => ({
        id: it.id,
        title: it.name,
        image: it.preview_image,
        url: it.public_url,
        subtitle: it.creator.name
    }));

    hide('loading');

    display(things.map(it =>
        ({
            ...it,
            icon,
            getPreview: () => <div>
                <center>
                    <img src={it.image}/><p>{it.title}</p>
                    <small>by <b>{it.subtitle}</b></small>
                </center>
            </div>,
            onSelect: () => actions.open(it.url)
        })
    ));

};

export const fn = debounce(plugin, 200);
