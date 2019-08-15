import moment from 'moment';
import { AirtableRecord } from '@/services/airtable.service';

export interface AirtableEntry {
    id: string;
}
export interface AirtableTextEntry extends AirtableEntry {
    title: string;
    description: string;
}
export interface AirtableImageEntry extends AirtableEntry  {
    imageUrl: string;
    thumbnailSmallUrl: string;
    thumbnailLargeUrl: string;
}
export interface AirtableDateEntry extends AirtableEntry  {
    date: moment.Moment;
    dateString: string;
}
export interface AirtableTestimonialEntry extends AirtableEntry  {
    testimonialIds: string[];
    testimonials: Testimonial[];
}
export interface AirtablePostEntry extends AirtableEntry  {
    postLink: string;
}
export interface AirtableUrlEntry extends AirtableEntry  {
    url: string;
}

export interface Testimonial extends AirtableEntry {
    quote: string;
    source: string;
    sourceUrl: string;
}

export interface Release extends AirtableImageEntry, AirtableTextEntry, AirtableTestimonialEntry, AirtableDateEntry {
    spotify?: string;
    bandcamp?: string;
    videoIds: string[];
    videos: Video[];
    tracks: string[];
}
export interface Video extends AirtableDateEntry, AirtableImageEntry, AirtableUrlEntry, AirtableTextEntry {
    embed: string;
    releaseIds: string[];
    releases: Release[];
}

export interface Link extends AirtableTextEntry, AirtableUrlEntry {
    type: string;
}
export interface Meta extends AirtableImageEntry, AirtableTextEntry {
    footerText: string;
    footerLinks: Link[];
    footerLinkIds: string[];
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
export interface Splash extends AirtableTextEntry {
    link: string;
    label: string;
    classes: string;
    icon: string;
}

export interface Page extends AirtableEntry, AirtableTextEntry, AirtableImageEntry, AirtableTestimonialEntry {
    slug: string;

    linksTitle: string;
    linkIds: string[];
    links: Link[];

    active: boolean;

    sort: number;

    type: PageType;
    splashId: string;
    splash?: Splash;
}
export interface Post extends AirtableDateEntry, AirtableTextEntry, AirtablePostEntry { }
export interface Photo extends Post, AirtableImageEntry { 
    type: 'instagram' | 'facebook';
}

//#region Container classes
export abstract class AirtableDtoContainer<T> {
    public readonly data: T;

    constructor(data: AirtableRecord) {
        this.data = this.parseData(data);
    }

    protected abstract parseData(record: AirtableRecord): T;
}

class RecordParser {
    private static parsers: any = {
        Date: (fields: any) => {
            const d = moment.utc(fields.date);
            return <AirtableDateEntry>{ date:  d, dateString: d.format('YYYY-MM-DD')};
        },
        Image: (fields: any) => {
            const img = fields.image && Array.isArray(fields.image) ? fields.image[0] : null,
                imageUrl = img && img.url ? img.url : '',
                thumbnailLargeUrl = img && img.thumbnails && img.thumbnails.large ? img.thumbnails.large.url : '',
                thumbnailSmallUrl = img && img.thumbnails && img.thumbnails.small ? img.thumbnails.small.url : '';
            return <AirtableImageEntry>{ imageUrl, thumbnailLargeUrl, thumbnailSmallUrl };
        },
        Post: (fields: any) => (<AirtablePostEntry>{postLink: fields['post-link']}),    
        Testimonial: (fields: any) => (<AirtableTestimonialEntry>{testimonialIds: fields.testimonials}),
        Text: (fields: any) => (<AirtableTextEntry>{
            title: fields.title,
            description: fields.description
        }),
    }

    private static toCamel(s: string): string {
        return s.replace(/([-_][a-z])/ig, ($1) => {
            return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
        });
    }

    private static getProperty(fields: any, prop: string): any {
        const result: {[key: string]: any} = {},
            propertyName = prop.replace('*', ''),
            ourKey = this.toCamel(propertyName),
            theirKey = propertyName.replace(/Ids$/, 's');

        result[ourKey] = fields[theirKey] || null;

        return result;
    }

    public static parse(record: AirtableRecord, ...typesOrKeys: string[]): any {
        const { id, fields } = record;

        return {
            id,
            ...(typesOrKeys || []).reduce((res, curr) => {
                return { 
                    ...res, 
                    ...(
                        this.parsers.hasOwnProperty(curr) 
                            ? this.parsers[curr](fields) 
                            : this.getProperty(fields, curr)
                    ) 
                };
            }, {})
        };
    }
};

export class LinkContainer extends AirtableDtoContainer<Link> {
    protected parseData(record: AirtableRecord) {
        const { fields } = record,
            linkType = fields['link-type'];

        return (<Link>{
            ...RecordParser.parse(record, 'Text', '*url'),
            type: linkType + (linkType === 'facebook' ? '-square' : '')
        });
    }
}

export class MetaContainer extends AirtableDtoContainer<Meta> {
    protected parseData(record: AirtableRecord) {
        return (<Meta>{
            ...RecordParser.parse(record, 'Text', 'Image', '*footer-text', '*footer-linkIds')
        });
    }
}

export class PageContainer extends AirtableDtoContainer<Page> {
    protected parseData(record: AirtableRecord) {
        const { splash } = record.fields;
        return (<Page>{
            ...RecordParser.parse(record, 
                'Text', 'Image', 'Testimonial',
                'active', 'slug', 'sort', 'type', 'links-title', 'linkIds'
            ),
            splashId: splash && Array.isArray(splash) && splash.length > 0 ? splash[0] : null
        });
    }
}

export class PostContainer extends AirtableDtoContainer<Post> {
    protected parseData(record: AirtableRecord) {
        return (<Post>{
            ...RecordParser.parse(record, 'Date', 'Text', 'Post')
        })
    }
}

export class PhotoContainer extends AirtableDtoContainer<Photo> {
    protected parseData(record: AirtableRecord) {
        return (<Photo>{
            ...RecordParser.parse(record, 'Date', 'Text', 'Post', 'Image'),
            type: 'facebook'
        })
    }
}

export class ReleaseContainer extends AirtableDtoContainer<Release> {
    protected parseData(record: AirtableRecord) {
        return (<Release>{
            ...RecordParser.parse(
                record, 
                'Text', 'Image', 'Date', 'Testimonial',
                '*spotify', '*bandcamp', '*videoIds'
            ),
            tracks: (record.fields.tracks || '').split('\n')
                .map((t: string) => (t || '').trim().replace(/^\d+\.\s+/, ''))
                .filter((t: string) => t !== '')
        });
    }
}

export class SplashContainer extends AirtableDtoContainer<Splash> {
    protected parseData(record: AirtableRecord) {
        return (<Splash>{
            ...RecordParser.parse(record, 'Text', '*link', '*label', '*classes', '*icon')
        });
    }
}

export class TestimonialContainer extends AirtableDtoContainer<Testimonial> {
    protected parseData(record: AirtableRecord) {
        return (<Testimonial>{
            ...RecordParser.parse(record, '*quote', '*source', '*source-url')
        });
    }
}

export class VideoContainer extends AirtableDtoContainer<Video> {
    protected parseData(record: AirtableRecord) {
        const baseObj = RecordParser.parse(record, 'Text', 'Date', '*url', '*embed', '*releaseIds'),
            ytId = (baseObj.url || '').replace(
                /https?\:\/\/www\.youtube\.com\/watch\?v\=(.+)/,
                '$1'
            );
        return (<Video>{
            ...baseObj,
            title: (baseObj.title || '').replace(/^Light Screamer\s+\-\s+/, '').replace(/\s*\(official[^)]+\)/i, ''),
            imageUrl: `https://img.youtube.com/vi/${ytId}/0.jpg`,
            thumbnailSmallUrl: `https://img.youtube.com/vi/${ytId}/4.jpg`,
            thumbnailLargeUrl: `https://img.youtube.com/vi/${ytId}/1.jpg`,
        });
    }
}

//#endregion
