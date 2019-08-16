import moment from 'moment';

export interface AirtableImageSource {
    url: string;
    width?: number;
    height?: number;
}

export interface Thumbnails {
    small: AirtableImageSource;
    large: AirtableImageSource;
    full: AirtableImageSource;
}

export interface AirtableImageItem {
    id?: string;
    url: string;
    filename?: string;
    size?: number;
    type?: string;
    thumbnails: Thumbnails;
}

export interface AirtableEntry {
    id?: string;
    entityType?: string;
}

export interface AirtableEntryWithDate extends AirtableEntry {
    date: string;
}
export interface AirtableEntryWithTitle extends AirtableEntry {
    title: string;
}
export interface AirtableEntryWithLabel extends AirtableEntry {
    label: string;
}
export interface AirtableEntryWithDescription extends AirtableEntry {
    description: string;
}
export interface AirtableEntryWithTitleAndDescription extends AirtableEntryWithTitle, AirtableEntryWithDescription {
}
export interface AirtableEntryWithUrl extends AirtableEntry {
    url: string;
}
export interface AirtableEntryWithType extends AirtableEntry {
    type: string;
}

export interface AirtableEntryWithImages extends AirtableEntry {
    image?: AirtableImageItem[];
    imageThumbnails?: Thumbnails;
}
export interface AirtableEntryWithLinks extends AirtableEntry {
    linksTitle?: string;
    links?: string[];
}
export interface AirtableEntryWithReleases extends AirtableEntry {
    releases?: string[];
}
export interface AirtableEntryWithSplash extends AirtableEntry {
    splash?: string[];
}
export interface AirtableEntryWithTestimonials extends AirtableEntry {
    testimonials?: string[];
}
export interface AirtableEntryWithVideos extends AirtableEntry {
    videos?: string[];
}


/*
 * 
 */

export interface AirtableLink
    extends
    AirtableEntryWithUrl,
    AirtableEntryWithTitleAndDescription,
    AirtableEntryWithType { }

export interface AirtableMeta
    extends
    AirtableEntryWithImages,
    AirtableEntryWithLinks,
    AirtableEntryWithTitleAndDescription {
    footerText: string;
}


export interface AirtablePage
    extends
    AirtableEntryWithTitleAndDescription,
    AirtableEntryWithTestimonials,
    AirtableEntryWithLinks,
    AirtableEntryWithImages,
    AirtableEntryWithType,
    AirtableEntryWithSplash {
    sort: number;
    slug: string;
    active?: boolean;
}


export interface AirtablePost
    extends
    AirtableEntryWithDate,
    AirtableEntryWithTitleAndDescription,
    AirtableEntryWithUrl { }

export interface AirtablePhoto
    extends
    AirtablePost,
    AirtableEntryWithImages,
    AirtableEntryWithType { }

export interface AirtableRelease
    extends
    AirtableEntryWithDate,
    AirtableEntryWithImages,
    AirtableEntryWithTitleAndDescription,
    AirtableEntryWithTestimonials,
    AirtableEntryWithVideos {
    spotify?: string;
    bandcamp?: string;
    tracks?: string;
}

export interface AirtableSplash
    extends
    AirtableEntryWithDescription,
    AirtableEntryWithLabel,
    AirtableEntryWithType,
    AirtableEntryWithUrl {
}

export interface AirtableTestimonial
    extends
    AirtableEntryWithDescription,
    AirtableEntryWithLabel,
    AirtableEntryWithUrl {
    key: number;
}

export interface AirtableVideo
    extends
    AirtableEntryWithDate,
    AirtableEntryWithImages,
    AirtableEntryWithUrl,
    AirtableEntryWithReleases,
    AirtableEntryWithTitleAndDescription,
    AirtableEntryWithType {
    embed: string;
}

/*
 * 
 */
export interface Entity extends AirtableEntry {
}

export interface EntityWithImage extends AirtableEntryWithImages {
    imageItem?: AirtableImageItem;
}
export interface EntityWithDate extends AirtableEntryWithDate {
    dateMoment?: moment.Moment;
    formattedDate?: string;
}
export interface EntityWithLinks extends AirtableEntryWithLinks {
    linkItems?: AirtableLink[];
}
export interface EntityWithReleases extends AirtableEntryWithReleases {
    releaseItems?: AirtableRelease[];
}
export interface EntityWithSplash extends AirtableEntryWithSplash {
    splashItem?: AirtableSplash;
}
export interface EntityWithTestimonials extends AirtableEntryWithTestimonials {
    testimonialItems?: AirtableTestimonial[];
}
export interface EntityWithVideos extends AirtableEntryWithVideos {
    videoItems?: AirtableVideo[];
}



export interface Link
    extends Entity, AirtableLink {
}

export interface Meta
    extends Entity, EntityWithImage, EntityWithLinks, AirtableMeta {
}

export interface Page
    extends Entity, EntityWithImage, EntityWithLinks, EntityWithTestimonials, AirtablePage {
}

export interface Post
    extends Entity, AirtablePost {
}

export interface Photo
    extends Entity, EntityWithImage, AirtablePhoto {
}

export interface Release
    extends Entity, EntityWithImage, EntityWithVideos, AirtableRelease {
    trackList?: string[];

}

export interface Splash
    extends Entity, AirtableSplash {
}

export interface Testimonial
    extends Entity, AirtableTestimonial {
}

export interface Video
    extends Entity, EntityWithImage, EntityWithReleases, AirtableVideo {
}



export interface AirtableRecord {
    id: string;
    fields: any;
    createdTime: Date;
}

export interface AirtableResponse {
    records: AirtableRecord[];
}

export const makeImageItem = (url: string, full?: string, large?: string, small?: string): AirtableImageItem => {
    return <AirtableImageItem>{
        url: url,
        thumbnails: <Thumbnails>{
            full: <AirtableImageSource>{ url: full || url },
            large: <AirtableImageSource>{ url: large || full || url },
            small: <AirtableImageSource>{ url: small || large || full || url }
        }
    };
}

export const mapRecordToEntity = <T extends Entity>(source: AirtableRecord): T => {
    const returnObj = <T>{ id: source.id, ...source.fields };
    let extraObj: any = {};

    if (source.fields.entityType === 'video') {
        const ytUrl = 'https://img.youtube.com/vi/' + (source.fields.url || '').replace(
            /https?\:\/\/www\.youtube\.com\/watch\?v\=(.+)/,
            '$1'
        ),
            imgItem = makeImageItem(`${ytUrl}/0.jpg`, `${ytUrl}/0.jpg`, `${ytUrl}/0.jpg`, `${ytUrl}/2.jpg`);

        extraObj = {
            ...extraObj,
            title: (source.fields.title || '').replace(/^light screamer -/i, '').replace(/\([\w\s]+\)$/, ''),
            image: [imgItem],
            imageItem: imgItem,
            imageThumbnails: imgItem.thumbnails,
            type: 'youtube'
        };
    } else if (source.fields.entityType === 'photo') {
        const imageItem = makeImageItem(source.fields.image);
        extraObj = <Photo>{ ...extraObj, image: [imageItem], imageItem, imageThumbnails: imageItem.thumbnails };
    } else if (source.fields.image && Array.isArray(source.fields.image)) {
        const image = <EntityWithImage>{ ...source.fields };
        if (image.image && image.image.length > 0) {
            image.imageItem = image.image[0];
            image.imageThumbnails = image.image[0].thumbnails;
            extraObj = { ...extraObj, ...image };
        }
    } else if (source.fields.date) {
        const mom = moment.utc(source.fields.date);
        if (mom.isValid()) {
            extraObj = {
                ...extraObj,
                dateMoment: mom,
                formattedDate: mom.format('YYYY-MM-DD')
            };    
        }
    }

    return <T>{ ...returnObj, ...extraObj };
};
