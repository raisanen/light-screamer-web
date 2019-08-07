import moment from 'moment';

export interface AirtableEntry {
    id: string;
}
export interface AirtableTextEntry {
    title: string;
    description: string;
}
export interface AirtableImageEntry {
    imageUrl: string;
}
export interface AirtableDateEntry {
    date: moment.Moment;
    dateString: string;
}
export interface AirtableTestimonialEntry {
    testimonialIds: string[];
    testimonials: Testimonial[];
}
export interface AirtablePostEntry {
    postLink: string;
}

type recordTypes = 'all' | 'post' | 'text' | 'date' | 'image' | 'testimonial';

const parseRecord = {
    all: (id: string) => (<AirtableEntry>{ id }),
    text: (record: any) => (<AirtableTextEntry>{
        title: record.title,
        description: record.description
    }),
    date: (record: any) => {
        const d = moment.utc(record.date);
        return <AirtableDateEntry>{ date:  d, dateString: d.format('YYYY-MM-DD')};
    },
    image: (record: any) => (<AirtableImageEntry>{ imageUrl: record.image ? record.image[0].url : ''}),
    testimonial: (record: any) => (<AirtableTestimonialEntry>{testimonialIds: record.testimonials}),
    post: (record: any) => (<AirtablePostEntry>{postLink: record['post-link']}),

    parse: (id: string, record: string, ...types: recordTypes[]) => {
        return {
            ...parseRecord.all(id),
            ...types.reduce((p, c) => {
                return {...p, ...parseRecord[c](record)};
            }, {})
        };
    }
};

export class Testimonial implements AirtableEntry {
    public id = '';
    public quote: string = '';
    public source: string = '';
    public sourceUrl: string = '';

    public static fromRecord(id: string, record: any): Testimonial {
        return <Testimonial>{
            ...parseRecord.all(id),
            quote: record.quote,
            source: record.source,
            sourceUrl: record['source-url']
        }
    }
}

export class Release implements AirtableEntry, AirtableImageEntry, AirtableTextEntry, AirtableTestimonialEntry, AirtableDateEntry {
    public id = '';
    public title: string = '';
    public imageUrl: string = '';
    public date: moment.Moment = moment.utc();
    public dateString: string = '';
    public description: string = '';
    public spotify?: string;
    public bandcamp?: string;
    public testimonialIds: string[] = [];
    public testimonials: Testimonial[] = [];
    public videoIds: string[] = [];
    public videos: Video[] = [];
    public tracks: string[] = [];

    public get hasVideos(): boolean {
        return this.videos && this.videos.length > 0;
    }
    public get hasTracks(): boolean {
        return this.tracks && this.tracks.length > 0;
    }
    public get hasTestimonials(): boolean {
        return this.testimonials && this.testimonials.length > 0;
    }


    public static fromRecord(id: string, record: any): Release {
        return <Release>{
            ...parseRecord.parse(id, record, 'text', 'image', 'date', 'testimonial'),
            spotify: record.spotify || null,
            bandcamp: record.bandcamp || null,
            videoIds: record.videos || [],
            tracks: (record.tracks || '').split('\n')
                .map((t: string) => (t || '').trim().replace(/^\d+\.\s+/, ''))
                .filter((t: string) => t !== '')
        }
    }
}

export class Video implements AirtableEntry, AirtableDateEntry, AirtableTextEntry {
    public id = '';
    public url: string = '';
    public date: moment.Moment = moment.utc();
    public dateString: string = '';
    public title: string = '';
    public description: string = '';
    public embed: string = '';
    public releaseIds: string[] = [];
    public releases: Release[] = [];

    public get hasReleases(): boolean {
        return this.releases && this.releases.length > 0;
    }

    public static fromRecord(id: string, record: any): Video {
        const baseObj = parseRecord.parse(id, record, 'text', 'date'); 
        return <Video>{
            ...new Video(),
            ...baseObj,
            title: (record.title || '').replace(/^Light Screamer\s+\-\s+/, '').replace(/\s*\(official[^)]+\)/i, ''),
            url: record.url,
            embed: record.embed,
            releaseIds: record.releases
        };
    }
}

export enum PageType {
    Unknown = '',
    Text = 'text',
    Videos = 'videos',
    Releases = 'releases',
    Photos = 'photos',
    Posts = 'posts',
    Contact = 'contact-form'
}

export class Link implements AirtableEntry, AirtableTextEntry {
    id: string = '';
    title: string = '';
    description: string = '';

    type: string = '';
    url: string = '';

    public static fromRecord(id: string, record: any): Link {
        const linkType = record['link-type'];
        return <Link>{
            ...parseRecord.parse(id, record, 'text'),
            type: linkType + (linkType === 'facebook' ? '-square' : ''),
            url: record.url
        }
    }
}

export class Splash implements AirtableEntry, AirtableTextEntry {
    id: string = '';
    title: string = '';
    description: string = '';

    link: string = '';
    label: string = '';
    classes: string = '';
    icon: string = '';

    public static fromRecord(id: string, record: any): Splash {
        return <Splash>{
            ...parseRecord.parse(id, record, 'text'),
            link: record.link,
            label: record.label,
            classes: record.classes,
            icon: record.icon
        };
    }
}

export class Page implements AirtableEntry, AirtableTextEntry, AirtableImageEntry, AirtableTestimonialEntry {
    public id = '';
    public slug: string = '';
    public title: string = '';
    public description: string = '';
    public testimonialIds: string[] = [];
    public testimonials: Testimonial[] = [];

    public linksTitle: string = '';
    public linkIds: string[] = [];
    public links: Link[] = [];

    public shouldShow: boolean = true;

    public sort: number = 0;

    public imageUrl: string = '';
    public type: PageType = PageType.Unknown;
    public splashId: string = '';
    public splash?: Splash;

    public get hasLinks(): boolean {
        return this.links && this.links.length > 0;
    }
    public get hasTestimonials(): boolean {
        return this.testimonials && this.testimonials.length > 0;
    }

    public static fromRecord(id: string, record: any) {
        console.log(record);
        return <Page>{
            ...parseRecord.parse(id, record, 'text', 'image', 'testimonial'),
            slug: record.slug,
            sort: record.sort,
            type: record.type,
            linksTitle: record['links-title'] || null,
            linkIds: record.links,
            splashId: record.splash && record.splash.length > 0 ? record.splash[0] : null
        }
    }
}

export class Post implements AirtableEntry, AirtableDateEntry, AirtableTextEntry, AirtablePostEntry {
    postLink: string = '';
    title: string = '';
    description: string = '';
    public date: moment.Moment = moment.utc();
    public dateString: string = '';

    id: string = '';

    public static fromRecord(id: string, record: any): Post {
        return <Post>{
            ...parseRecord.parse(id, record, 'date', 'text', 'post')
        };
    }
}
export class Photo extends Post {
    imageUrl: string = '';

    public static fromRecord(id: string, record: any): Photo {
        return <Photo>{
            ...Post.fromRecord(id, record),
            imageUrl: record['image-url'] || ''
        };
    }
}

export class Meta {
    siteName: string = '';
    logoUrl: string = '';
    footerText: string = '';

    public static fromRecord(record: any) {
        return <Meta>{
            siteName: record['site-name'],
            logoUrl: record.logo ? record.logo[0].url : '',
            footerText: record['footer-text']
        };
    }
}