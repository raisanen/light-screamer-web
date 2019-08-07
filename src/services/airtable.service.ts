import Airtable from 'airtable';
import { Page, Testimonial, Video, Release, Meta, Post, Photo, Link, Splash } from '@/models/dtos';

export default class AirtableService {
    private airtable: Airtable.Base;
    private cache: {[key: string]: any[]} = {};

    constructor() {
        this.airtable = new Airtable({
            apiKey: 'keyQv7zDQbinENVcQ' // Readonly key -- OK to leak
        }).base('appxuBPxu0RLPPdpO');
    }
    private async query(tableName: string): Promise<any[]> {
        if (this.cache[tableName]) {
            return new Promise((resolve) => resolve(this.cache[tableName]));
        }
        const result = await this.airtable(tableName).select().all();
        this.cache[tableName] = result.map((r) => ({ id: r.id, fields: r.fields }));
        return this.cache[tableName];
    }

    async pages(): Promise<Page[]> {
        const result = await this.query('pages');
        return result.map((r) => Page.fromRecord(r.id, r.fields));
    }

    async testimonials(): Promise<Testimonial[]> {
        const result = await this.query('testimonials');
        return result.map((r) => Testimonial.fromRecord(r.id, r.fields));
    }

    async videos(): Promise<Video[]> {
        const result = await this.query('videos');
        return result.map((r) => Video.fromRecord(r.id, r.fields));
    }

    async releases(): Promise<Release[]> {
        const result = await this.query('releases');
        return result.map((r) => Release.fromRecord(r.id, r.fields));
    }

    async posts(): Promise<Post[]> {
        const result = await this.query('posts');
        return result.map((r) => Post.fromRecord(r.id, r.fields));
    }

    async photos(): Promise<Photo[]> {
        const result = await this.query('photos');
        return result.map((r) => Photo.fromRecord(r.id, r.fields));
    }

    async links(): Promise<Link[]> {
        const result = await this.query('links');
        return result.map((r) => Link.fromRecord(r.id, r.fields));
    }

    async splashes(): Promise<Splash[]> {
        const result = await this.query('splashes');
        return result.map((r) => Splash.fromRecord(r.id, r.fields));
    }

    async meta(): Promise<Meta> {
        const result = await this.query('meta');
        console.log(result);
        return Meta.fromRecord(result[0].fields);
    }
}
