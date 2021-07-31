import db from '../src/config/firebase';
import * as fs from 'fs';

const collections = [
    'people',
    'timelineLists',
    'categories',
    'events'
]

collections.forEach(async c => {
    const data = JSON.parse(fs.readFileSync(`./migration/data/${c}.json`, 'utf8'))

    data.forEach(async (o: any) => {
        const owoid = {...o}
        delete owoid.id
        await db.collection(c).doc(o.id).set(owoid)
    })
})