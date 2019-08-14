//https://socializegraph-web.azurewebsites.net/api/v2/instagram/render/9b2b7c02-e093-42f1-13c9-08d6f31a070e
import axios, { AxiosInstance } from 'axios';

export interface InstagramPost {
    id: string;
    postByUser: string;
    postByUserFullName?: string;
    postByUserId?: string;
    posted: Date;
    postLink: string;
    message: string;
    tags: string[];
    imageLargeUrl: string;
    imageMediumUrl: string;
    imageSmallUrl: string;
    videoLowResUrl: string;
    videoHighResUrl: string;
    type: string;
    locationName: string;
    from: string;
    internalId: string;
    likeCount: number;
    commentsCount: number;
}

export interface RenderRequest {
    guid: string;
    mode: 'nofilter' | 'invert' | 'normal';
    live: boolean;
    take: number;
}

export interface RenderResult {
    id: string;
    name: string;
    result: InstagramPost[];
}

export default class SocializerService {
    private readonly axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: process.env.NODE_ENV === 'production' 
                ? '/proxy/?endpoint=instagram'
                : 'https://socializegraph-web.azurewebsites.net/api/v2/instagram/render/9b2b7c02-e093-42f1-13c9-08d6f31a070e?take=30'
        });
    }

    public async getRequest(): Promise<RenderResult> {
        const response = await this.axios.get('');
        return <RenderResult>response.data;
    }

    public async get(): Promise<InstagramPost[]> {
        const result = await this.getRequest();
        console.log(result);
        return result.result;
    }
}
