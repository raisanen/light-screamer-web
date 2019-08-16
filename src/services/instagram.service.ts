import { RenderResult, InstagramPost } from '@/models/socializer-dtos';
import AxiosServiceBase from './axios-service-base';

export default class SocializerService extends AxiosServiceBase {
    protected get headers(): any {
        return undefined;
    }
    protected get baseUrl(): string {
        return process.env.NODE_ENV === 'production' 
            ? '/proxy/?endpoint=instagram'
            : 'https://socializegraph-web.azurewebsites.net/api/v2/instagram/render/9b2b7c02-e093-42f1-13c9-08d6f31a070e?take=30';
    }

    public async render(): Promise<InstagramPost[]> {
        const result = await this.get<RenderResult>('');
        return result.result;
    }
}
