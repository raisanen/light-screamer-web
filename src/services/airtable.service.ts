import axios, { AxiosInstance } from 'axios';
import moment from 'moment';

import { Post, PostContainer, PageContainer, Page, Testimonial, TestimonialContainer, PhotoContainer, Photo, Release, ReleaseContainer, Video, VideoContainer, Link, LinkContainer, Splash, SplashContainer, Meta, MetaContainer } from '@/models/dtos';

const apiKey = 'keyQv7zDQbinENVcQ',
    appId = 'appxuBPxu0RLPPdpO';

export interface AirtableRecord {
    id: string;
    fields: any;
    createdTime: string;
}
export interface AirtableResponse {
    records: AirtableRecord[];
}
export default class AirtableService {
    private readonly axios: AxiosInstance;
    protected readonly cache: { [key: string]: AirtableRecord[] };
    protected readonly lastUpdate: { [key: string]: moment.Moment };

    constructor() {
        this.axios = axios.create({
            baseURL: process.env.NODE_ENV === 'production' 
                ? '/proxy/?endpoint='
                : `https://api.airtable.com/v0/${appId}/`
        });
        this.axios.defaults.headers.common = { Authorization: `Bearer ${apiKey}` };
        this.cache = {};
        this.lastUpdate = {};
    }

    protected get now(): moment.Moment { return moment.utc(); }

    protected tableUrl(tableName: string, overwrite: boolean = false): string {
        const separator = process.env.NODE_ENV === 'production' ? '&' : '?';
        return `${tableName}` + (overwrite ? `${separator}overwrite=true` : '');
    }

    protected cacheValid(tableName: string): boolean {
        return this.cache[tableName] && this.cache[tableName].length > 0 &&
            this.lastUpdate[tableName].add(6, 'hours').isAfter(this.now);
    }

    protected async fetch(tableName: string, overwrite: boolean = false): Promise<AirtableResponse> {
        const result = await this.axios.get<AirtableResponse>(this.tableUrl(tableName, overwrite));
        return result.data;
    }

    public async get(tableName: string, overwrite: boolean = false): Promise<AirtableRecord[]> {
        if (!this.cacheValid(tableName) || overwrite) {
            const data = await this.fetch(tableName, overwrite);
            this.cache[tableName] = data.records;
            this.lastUpdate[tableName] = this.now;
        }
        return this.cache[tableName];
    }

    public async pages(overwrite: boolean = false): Promise<Page[]> { return (await this.get('pages', overwrite)).map((r) => new PageContainer(r).data); }
    public async photos(overwrite: boolean = false): Promise<Photo[]> { return (await this.get('photos', overwrite)).map((r) => new PhotoContainer(r).data); }
    public async posts(overwrite: boolean = false): Promise<Post[]> { return (await this.get('posts', overwrite)).map((r) => new PostContainer(r).data); }
    public async releases(overwrite: boolean = false): Promise<Release[]> { return (await this.get('releases', overwrite)).map((r) => new ReleaseContainer(r).data); }
    public async testimonials(overwrite: boolean = false): Promise<Testimonial[]> { return (await this.get('testimonials', overwrite)).map((r) => new TestimonialContainer(r).data); }
    public async videos(overwrite: boolean = false): Promise<Video[]> { return (await this.get('videos', overwrite)).map((r) => new VideoContainer(r).data); }
    public async links(overwrite: boolean = false): Promise<Link[]> { return (await this.get('links', overwrite)).map((r) => new LinkContainer(r).data); }
    public async splashes(overwrite: boolean = false): Promise<Splash[]> { return (await this.get('splashes', overwrite)).map((r) => new SplashContainer(r).data); }
    public async meta(overwrite: boolean = false): Promise<Meta[]> { return (await this.get('meta', overwrite)).map((r) => new MetaContainer(r).data); }
}
