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

    protected cacheValid(tableName: string): boolean {
        return this.cache[tableName] && this.cache[tableName].length > 0 &&
            this.lastUpdate[tableName].add(6, 'hours').isAfter(this.now);
    }

    protected async fetch(tableName: string): Promise<AirtableResponse> {
        const result = await this.axios.get<AirtableResponse>(tableName);
        return result.data;
    }

    public async get(tableName: string): Promise<AirtableRecord[]> {
        if (!this.cacheValid(tableName)) {
            const data = await this.fetch(tableName);
            this.cache[tableName] = data.records;
            this.lastUpdate[tableName] = this.now;
        }
        return this.cache[tableName];
    }

    public async pages(): Promise<Page[]> { return (await this.get('pages')).map((r) => new PageContainer(r).data); }
    public async photos(): Promise<Photo[]> { return (await this.get('photos')).map((r) => new PhotoContainer(r).data); }
    public async posts(): Promise<Post[]> { return (await this.get('posts')).map((r) => new PostContainer(r).data); }
    public async releases(): Promise<Release[]> { return (await this.get('releases')).map((r) => new ReleaseContainer(r).data); }
    public async testimonials(): Promise<Testimonial[]> { return (await this.get('testimonials')).map((r) => new TestimonialContainer(r).data); }
    public async videos(): Promise<Video[]> { return (await this.get('videos')).map((r) => new VideoContainer(r).data); }
    public async links(): Promise<Link[]> { return (await this.get('links')).map((r) => new LinkContainer(r).data); }
    public async splashes(): Promise<Splash[]> { return (await this.get('splashes')).map((r) => new SplashContainer(r).data); }
    public async meta(): Promise<Meta[]> { return (await this.get('meta')).map((r) => new MetaContainer(r).data); }
}
