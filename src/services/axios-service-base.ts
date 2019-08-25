import axios, { AxiosInstance } from 'axios';

export default abstract class AxiosServiceBase {
    private static _axios: AxiosInstance;

    private get axios(): AxiosInstance {
        if (!AxiosServiceBase._axios) {
            AxiosServiceBase._axios = axios.create();
        }
        return AxiosServiceBase._axios;
    }

    protected async request<T>(url: string, method: 'GET' | 'POST', data?: any) : Promise<T> {
        const result = await this.axios.request<T>({
            baseURL: this.baseUrl,
            headers: this.headers,
            url,
            method,
            data,
        });

        return result.data;
    }

    protected async get<T>(url: string): Promise<T> {
        return await this.request<T>(url, 'GET');
    }

    protected async post<T>(url: string, data?: any): Promise<T> {
        return await this.request<T>(url, 'POST', data);
    }

    protected abstract get baseUrl(): string;

    protected abstract get headers(): any;
}
