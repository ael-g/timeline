import db from '../src/config/firebase';
import * as fs from 'fs';

const collections = [
    'people',
    'timelineLists',
    'categories'
]

collections.forEach(async c => {
    const col = await db.collection(c).get()
    const data = col.docs.map(p => {return {id: p.id, ...p.data()}})
    fs.writeFile(`./migration/data/${c}.json`, JSON.stringify(data, null, 2), (err) => {console.log(err)})
})