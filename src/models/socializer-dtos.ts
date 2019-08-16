import moment from 'moment';
import { Video, makeImageItem, Photo } from './airtable-record';

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

const mapInstagramItem = (item: InstagramPost): any => {
    const date = moment.utc(item.posted);
    return {
        id: item.id,
        date: date.format('YYYY-MM-DD'),
        dateMoment: date,
        formattedDate: date.format('YYYY-MM-DD'),
        url: item.postLink,
        title: item.postByUser,
        type: 'instagram',
        description: item.message
            .replace(/#(\S+)/g, '<a href="https://instagram.com/explore/tags/$1/" rel="noreferrer" target="_blank">#$1</a>')
            .replace(/@(\S+)/g, '<a href="https://instagram.com/$1" rel="noreferrer" target="_blank">@$1</a>')
    }
};

export const instagramItemToVideo = (item: InstagramPost): Video => {
    return {
        ...mapInstagramItem(item),
        entityType: 'video',
        embed: `<video controls><source src="${item.videoHighResUrl}"></video>`,
    };
};

export const instagramItemToPhoto = (item: InstagramPost): Photo => {
    const imageItem = makeImageItem(item.postLink, item.imageLargeUrl, item.imageMediumUrl, item.imageSmallUrl); 

    return {
      ...mapInstagramItem(item),
      entityType: 'photo',
      type: 'instagram',
      image: [imageItem],
      imageItem,
      imageThumbnails: imageItem.thumbnails
    };
};