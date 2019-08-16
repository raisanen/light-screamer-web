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
