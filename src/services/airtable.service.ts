import moment from 'moment';

import { 
    AirtableResponse,
    mapRecordToEntity,
    Entity
} from '@/models/airtable-record';

import AxiosServiceBase from './axios-service-base';

const apiKey = 'keyQv7zDQbinENVcQ',
    appId = 'appxuBPxu0RLPPdpO';


export default class AirtableService extends AxiosServiceBase {
    protected get baseUrl(): string {
        return process.env.NODE_ENV === 'production' 
            ? '/proxy/?endpoint='
            : `https://api.airtable.com/v0/${appId}/`;
    }
    protected get headers(): any {
        return { Authorization: `Bearer ${apiKey}` };
    }

    protected get now(): moment.Moment { return moment.utc(); }

    protected tableUrl(tableName: string, overwrite: boolean = false): string {
        const separator = process.env.NODE_ENV === 'production' ? '&' : '?';
        return `${tableName}` + (overwrite ? `${separator}overwrite=true` : '');
    }

    public async fetch<T extends Entity>(tableName: string): Promise<T[]> {
        const result = await this.get<AirtableResponse>(this.tableUrl(tableName));
        return result.records.map((r: any) => mapRecordToEntity<T>(r));
    }
}
