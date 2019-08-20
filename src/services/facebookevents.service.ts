import { Event, makeImageItem } from '@/models/airtable-record';
import moment from 'moment';

const data: any = require('./events.json');

export default class FacebookEventsService {
    public async get(): Promise<Event[]> {
        return new Promise((resolve, reject) => {
            if (data && data.events && data.events.data) {
                resolve(
                    data.events.data.map((e: any) => {
                        const img = e.cover ? makeImageItem(e.cover.source) : null;

                        return <Event>{
                            title: e.name,
                            description: e.description,
                            date: e.start_time,
                            venue: e.place ? e.place.name : '',
                            image: img ? [img] : [],
                            imageItem: img,
                            imageThumbnails: img ? img.thumbnails : null,
                            dateMoment: moment.utc(e.start_time),
                            formattedDate: moment.utc(e.start_time).format('YYYY-MM-DD'),
                            entityType: 'event',
                            id: e.id,
                            url: `https://www.facebook.com/events/${e.id}/`
                        };
                    })
                );
            } else {
                reject();
            }
        });
    }
}