import { type Photograph } from '../../domain/photograph';

const photographs: Photograph[] = [
    {
        contentUrl:
            'https://images.pexels.com/photos/19094327/pexels-photo-19094327/free-photo-of-moon-in-night-sky-over-alley-in-rome-italy.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 0,
        metadata: {
            description: 'Moon in night sky over alley in Rome, Italy',
            socials: {
                pexels: 'https://www.pexels.com/photo/moon-in-night-sky-over-alley-in-rome-italy-19094327/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/19846475/pexels-photo-19846475/free-photo-of-back-view-of-a-woman-and-girl-walking-in-a-park.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 1,
        metadata: {
            description: 'Back view walking in a park',
            socials: {
                pexels: 'https://www.pexels.com/photo/back-view-of-a-woman-and-girl-walking-in-a-park-19846475/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/19108889/pexels-photo-19108889/free-photo-of-ornamented-cathedral-interior.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 2,
        metadata: {
            description: 'Ornamented cathedral interior',
            socials: {
                pexels: 'https://www.pexels.com/photo/ornamented-cathedral-interior-19108889/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/19094424/pexels-photo-19094424/free-photo-of-moon-and-classical-columns-illuminated-at-night.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 3,
        metadata: {
            description: 'Moon and classical columns illuminated at night',
            socials: {
                pexels: 'https://www.pexels.com/photo/moon-and-classical-columns-illuminated-at-night-19094424/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/13712672/pexels-photo-13712672.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 4,
        metadata: {
            description: 'Aerial view of city buildings',
            socials: {
                pexels: 'https://www.pexels.com/photo/aerial-view-of-city-buildings-13712672/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/13617320/pexels-photo-13617320.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 5,
        metadata: {
            description: 'City of Florence',
            socials: {
                pexels: 'https://www.pexels.com/photo/city-of-florence-13617320/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/13915404/pexels-photo-13915404.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 6,
        metadata: {
            description: 'Paris at night',
            socials: {
                pexels: 'https://www.pexels.com/photo/paris-at-night-13915404/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/17649860/pexels-photo-17649860/free-photo-of-interior-of-the-gallery-of-great-battles-in-the-palace-of-versailles-france.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 7,
        metadata: {
            description:
                'Interior of the gallery of great battles in the palace of Versailles, France',
            socials: {
                pexels: 'https://www.pexels.com/photo/interior-of-the-gallery-of-great-battles-in-the-palace-of-versailles-france-17649860/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/18937019/pexels-photo-18937019/free-photo-of-waves-on-a-shore.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 8,
        metadata: {
            description: 'Waves on a shore',
            socials: {
                pexels: 'https://www.pexels.com/photo/waves-on-a-shore-18937019/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/17504999/pexels-photo-17504999/free-photo-of-boats-on-sea-shore-in-town.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 9,
        metadata: {
            description: 'Boats on sea shore in town',
            socials: {
                pexels: 'https://www.pexels.com/photo/boats-on-sea-shore-in-town-17504999/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/13617322/pexels-photo-13617322.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 10,
        metadata: {
            description: 'Sunset walking',
            socials: {
                pexels: 'https://www.pexels.com/photo/sunset-walking-13617322/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/13897947/pexels-photo-13897947.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 11,
        metadata: {
            description: 'Louvre',
            socials: {
                pexels: 'https://www.pexels.com/photo/louvre-13897947/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/13657047/pexels-photo-13657047.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 12,
        metadata: {
            description: 'Paris grande roue',
            socials: {
                pexels: 'https://www.pexels.com/photo/paris-grande-roue-13657047/',
            },
        },
    },
    {
        contentUrl:
            'https://images.pexels.com/photos/13616781/pexels-photo-13616781.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load',
        index: 13,
        metadata: {
            description: 'Florence market',
            socials: {
                pexels: 'https://www.pexels.com/photo/florence-market-13616781/',
            },
        },
    },
];

export const photographsRepository = {
    getAll: (): Photograph[] => photographs,
    getByIndex: (index: string): Photograph | undefined =>
        photographs.find((photograph) => String(photograph.index) === index),
};
