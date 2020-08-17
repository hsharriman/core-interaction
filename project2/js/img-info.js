const info = {
    0: {
        title: 'Konstruktive Grafik',
        year: '1958',
        author: 'Hans Neuberg',
        url: 'https://www.internationalposter.com/product/konstruktive-grafik/',
        attributes: ['graphic elements, rectangle', 'overlap', '3 font sizes', 'black text', 'yellow background', 'additional colors: white']
    },
    1: {
        title: 'Schutzenfest',
        year: '1963',
        author: 'Fridolin Muller',
        url: 'https://posterhouse.org/blog/exhibition/the-swiss-grid/',
        attributes: ['graphic elements, circle', '1 font size', 'white background', 'flush left, ragged right', 'red text', 'additional colors: black']
    },
    2: {
        title: 'vegh-quartett musica viva',
        year: '1958',
        author: 'Josef Muller-Brockman',
        url: 'https://i1.wp.com/www.grapheine.com/wp-content/uploads/2013/03/MULLER_BROCKMANN_18.jpg?quality=90&strip=all&ssl=1',
        attributes: ['graphic elements, rectangle', '2 font sizes', 'transparency', 'overlap', 'rotated grid', 'blue background', 'black text', 'additional colors: purple, green']
    },
    3: {
        title: 'Kunsthalle Basel Gubler Zurkinden',
        year: '1959',
        author: 'Armin Hofmann',
        url: 'https://www.emuseum.ch/objects/71505/max-gubler--irene-zurkinden--kunsthalle-basel--24okrt-',
        attributes: ['1 font size', 'blue background', 'flush left, ragged right', 'black text']
    },
    4: {
        title: 'Der Film',
        year: '1960',
        author: 'Josef Muller-Brockman',
        url: 'https://i1.wp.com/www.grapheine.com/wp-content/uploads/2013/03/MULLER_BROCKMANN_16.jpg?quality=90&strip=all&ssl=1',
        attributes: ['graphic elements, text', '2 font sizes', 'active whitespace', 'overlap', 'red text', 'black background', 'white text', 'additional colors: gray']
    },
    5: {
        title: 'musica viva poster',
        year: '1958',
        author: 'Josef Muller-Brockman',
        url: 'http://www.vangeva.com/josef-muller-brockmann/nggallery/page/1',
        attributes: ['graphic elements, circle', 'transparency', 'overlap', 'black text', 'flush left, ragged right', 'white background', 'additional colors: blue, orange']
    },
    6: {
        title: 'Poster, Knoll International',
        year: '1967',
        author: 'Massimo Vignelli',
        url: 'https://collection.cooperhewitt.org/objects/18734823/',
        attributes: ['graphic elements, text', '3 font sizes', 'transparency', 'overlap', 'black text', 'white background', 'additional colors: blue, pink, yellow, green, orange, purple']
    },
    7: {
        title: 'C. Chevalier Jaarverslagen',
        year: '1930',
        author: 'Paul Schuitema',
        url: 'http://oa.letterformarchive.org/item?workID=lfa_schuitema_0009&LFAPics=Yes',
        attributes: ['3 font sizes', 'overlap', 'white background', 'black text', 'red text', 'vertical text']
    },
    8: {
        title: 'D, Deutsche Kunstler der Gegenwart, Kunsthalle Basel, 11.6 bis 12.7',
        year: '1960',
        author: 'Armin Hofmann',
        url: 'https://www.moma.org/collection/works/7738?date_begin=Pre-1850&date_end=2020&locale=en&page=1&q=armin+hofmann&with_images=1',
        attributes: ['graphic elements, text', '2 font sizes', 'yellow background', 'black text', 'flush left, ragged right']
    }
}

const genInfo = {
    '01': {
        title: 'Swiss Intl.',
        year: '2020',
        attributes: ['graphic elements, rectangle', '3 font sizes', 'yellow background', 'black text', 'vertical text', 'rotated grid', 'overlap', 'transparency', 'additional colors: gray, red, green']
    },

    '02': {
        title: 'Swiss Style',
        year: '2020',
        attributes: ['graphic elements, rectangle', '2 font sizes', 'white background', 'black text', 'overlap', 'transparency', 'additional colors: red, orange']
    },
    '03': {
        title: 'Swiss Style, Modernism Generator',
        year: '2020',
        attributes: ['graphic elements, rectangle', '2 font sizes', 'red background', 'black text', 'overlap', 'transparency', 'additional colors: white']
    },
    '04': {
        title: 'Stars',
        year: '2020',
        attributes: ['graphic elements, rectangle', '3 font sizes', 'yellow background', 'black text', 'overlap', 'additional colors: gray, white']
    },
    '05': {
        title: 'Ruler',
        year: '2020',
        attributes: ['graphic elements, rectangle', '2 font sizes', 'yellow background', 'black text', 'rotated grid', 'overlap', 'transparency', 'additional colors: red, white']
    },
    '06': {
        title: 'Ruler #2',
        year: '2020',
        attributes: ['graphic elements, rectangle', '3 font sizes', 'black background', 'white text', 'overlap', 'transparency', 'additional colors: yellow, red, blue']
    },
    '07': {
        title: 'Ruler #3',
        year: '2020',
        attributes: ['graphic elements, rectangle', '3 font sizes', 'yellow background', 'black text', 'vertical text', 'overlap', 'transparency', 'additional colors: red, orange, white, gray']
    },
    '08': {
        title: 'The Moon',
        year: '2020',
        attributes: ['graphic elements, rectangle', '2 font sizes', 'white background', 'black text', 'overlap', 'transparency', 'additional colors: red, yellow']
    },
    '09': {
        title: 'The Moon #2',
        year: '2020',
        attributes: ['graphic elements, rectangle', '2 font sizes', 'yellow background', 'black text', 'overlap', 'transparency', 'additional colors: blue, white']
    },
    '010': {
        title: 'Konstruktive',
        year: '2020',
        attributes: ['graphic elements, rectangle', '3 font sizes', 'yellow background', 'black text', 'overlap', 'transparency', 'additional colors: red, orange, gray']
    },
    '11': {
        title: 'Swiss Intl.',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'red background', 'black text', 'additional colors: white']
    },
    '12': {
        title: 'Swiss Intl. #2',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'white background', 'black text', 'overlap', 'additional colors: red']
    },
    '13': {
        title: 'Beep Boop',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'green background', 'black text', 'overlap', 'additional colors: yellow']
    },
    '14': {
        title: 'Beep Boop #2',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'black background', 'vertical text', 'white text', 'overlap', 'transparency', 'additional colors: blue']
    },
    '15': {
        title: 'Beep Boop #3',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'white background', 'vertical text', 'black text', 'overlap', 'additional colors: red']
    },
    '16': {
        title: 'Mango',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'black background', 'white text', 'additional colors: green']
    },
    '17': {
        title: 'Jupiter',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'white background', 'black text', 'vertical text', 'overlap', 'additional colors: green']
    },
    '18': {
        title: 'black hole',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'red background', 'black text', 'additional colors: white']
    },
    '19': {
        title: "It's Just a Big Black Hole",
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'black background', 'vertical text', 'white text', 'additional colors: green']
    },
    '110': {
        title: "It's Just a Big Black Hole #2",
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'blue background', 'vertical text', 'black text']
    },
    '21': {
        title: 'Ruler',
        year: '2020',
        attributes: ['graphic elements, rectangle', '3 font sizes', 'green background', 'black text', 'overlap', 'transparency', 'additional colors: red, white']
    },
    '22': {
        title: 'Backyard Birds',
        year: '2020',
        attributes: ['graphic elements, rectangle', '2 font sizes', 'red background', 'rotated grid', 'black text', 'overlap', 'transparency', 'additional colors: yellow, green']
    },
    '23': {
        title: 'Curiosity',
        year: '2020',
        attributes: ['graphic elements, rectangle', '3 font sizes', 'black background', 'white text', 'overlap', 'transparency', 'additional colors: blue']
    },
    '24': {
        title: 'Modernism Generator',
        year: '2020',
        attributes: ['graphic elements, rectangle', '2 font sizes', 'white background', 'black text', 'rotated grid', 'additional colors: red', 'flush left, ragged right']
    },
    '25': {
        title: 'Dumplings',
        year: '2020',
        attributes: ['graphic elements, rectangle', '2 font sizes', 'white background', 'vertical text', 'black text', 'rotated grid', 'overlap', 'transparency', 'additional colors: green']
    },
    '51': {
        title: 'Remove Before Flight',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'white background', 'vertical text', 'black text', 'overlap', 'transparency', 'additional colors: green, red, blue, yellow']
    },
    '52': {
        title: 'Spaceship',
        year: '2020',
        attributes: ['graphic elements, circle', '2 font sizes', 'red background', 'black text', 'overlap', 'transparency', 'additional colors: white, yellow']
    },
    '53': {
        title: 'Beep Boop',
        year: '2020',
        attributes: ['graphic elements, circle', '2 font sizes', 'red background', 'black text', 'overlap', 'transparency', 'additional colors: green, yellow, white']
    },
    '54': {
        title: 'Beep Boop #2',
        year: '2020',
        attributes: ['graphic elements, circle', '2 font sizes', 'black background', 'white text', 'overlap', 'transparency', 'additional colors: green, yellow, blue, red, orange']
    },
    '55': {
        title: 'Beep Boop #3',
        year: '2020',
        attributes: ['graphic elements, circle', '2 font sizes', 'white background', 'vertical text', 'black text', 'overlap', 'transparency', 'additional colors: green, blue, green, orange, red']
    },
    '56': {
        title: 'Beep Boop #4',
        year: '2020',
        attributes: ['graphic elements, circle', '1 font size', 'yellow background', 'black text', 'overlap', 'transparency', 'additional colors: red, gray, white']
    },
    '57': {
        title: 'Royals',
        year: '2020',
        attributes: ['graphic elements, circle', '2 font sizes', 'black background', 'vertical text', 'white text', 'additional colors: green, red']
    },
    '81': {
        title: 'Mango',
        year: '2020',
        attributes: ['graphic elements, text', '1 font sizes', 'red background', 'vertical text', 'black text', 'overlap', 'additional colors: white']
    },
    '82': {
        title: 'Man',
        year: '2020',
        attributes: ['graphic elements, text', '1 font size', 'yellow background', 'black text', 'rotated grid', 'additional colors: red']
    },
    '83': {
        title: 'Jupiter',
        year: '2020',
        attributes: ['graphic elements, text', '1 font size', 'black background', 'white text', 'overlap', 'additional colors: gray']
    }
}