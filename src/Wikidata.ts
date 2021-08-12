import {People} from './types'
import {attributes, Qualifier} from './wikidata_attributes';

const endpoint = "https://query.wikidata.org/sparql?format=json"

const getYear = (date:string) => {
    const bce = date.match(/^-/);

    let sanitizedDate = date
    if(bce) {
        sanitizedDate = sanitizedDate.substring(1);
    }

    const year = (new Date(sanitizedDate)).getFullYear()
    return bce ? year * -1 : year;
}

const getField = (obj: any, key :string ) => {
    return (obj[key]) ? obj[key].value:'';
}

const capitalize = (s: string) : string => s.charAt(0).toUpperCase() + s.slice(1)

const getPeople = async (name: string) : Promise<People[]> => {
    const query = `SELECT DISTINCT ?item ?label ?desc ?birth ?death ?picture WHERE {
            SERVICE wikibase:mwapi {
                bd:serviceParam wikibase:endpoint "www.wikidata.org";
                                wikibase:api "EntitySearch";
                                mwapi:search "${name}";
                                mwapi:language "fr".
                ?item wikibase:apiOutputItem mwapi:item.
                ?num wikibase:apiOrdinal true.
            }
            ?item wdt:P31 wd:Q5.
            ?item rdfs:label ?label .
            OPTIONAL { ?item wdt:P569 ?birth. }
            OPTIONAL { ?item wdt:P570 ?death. }
            OPTIONAL { ?item wdt:P18 ?picture. }
            ?item schema:description ?desc .
            FILTER(LANG(?label) = "fr" )
            FILTER(LANG(?desc) = "fr" )
          } ORDER BY ASC(?num) 
          LIMIT 5`

    const body = new URLSearchParams();
    body.append('query', query);

    const response = await fetch(`${endpoint}&${body.toString()}`);
    const json = await response.json();

    const people = json.results.bindings.map( (i:any) => ({
            qid: getField(i, "item").replace("http://www.wikidata.org/entity/", ""),
            name: getField(i, "label"),
            bornDate: getYear(getField(i, "birth")),
            deathDate: getYear(getField(i, "death")),
            picture: getField(i, "picture"),
            description: capitalize(getField(i, "desc"))
        }))
    console.log(people)
    return people
}

const getAttrKey   = (a:any) => Object.keys(a)[0]
const getAttrValue = (a:any) => a[Object.keys(a)[0]]

const getQualifiers = async (qid: string, qualifier: Qualifier) => {
    const optProps = qualifier.attr.map(p => `?q_stmt pq:${getAttrValue(p)} ?${getAttrKey(p)}.`).join('\n')

    const query = `SELECT DISTINCT ?name ` + qualifier.attr.map(p => `?${getAttrKey(p)}`).join(' ') + 
    ` WHERE {
        VALUES  ?item                   {wd:${qid}}

        ?item   p:${qualifier.value}    ?q_stmt. 
        ?q_stmt ps:${qualifier.value}   ?q.
        ?q      rdfs:label              ?name.
        ${optProps}
        FILTER(LANG(?name) = "fr" )
    }`
    const body = new URLSearchParams();
    body.append('query', query);

    const response = await fetch(`${endpoint}&${body.toString()}`);
    const json = await response.json();

    // Maybe one of the most awful function of my life
    return json.results.bindings.map( (i:any) => ({
        value: getField(i, 'name'),
        ...( qualifier.attr.map( a => ({[getAttrKey(a)]: getField(i, getAttrKey(a))}) ).reduce( (b,c) => ({
            ...b,
            [getAttrKey(c)]: getAttrValue(c)
        }), {}))
    }) );
}

// Qualifier
const getPeopleDetails = async (qid: string) => {
    const res = await Promise.all(attributes.map( async a => {
        return {[a.key]: await getQualifiers(qid, a)}
    } ))
    const peopleDetails = res.reduce( (a,b) => {
        return {
            ...a,
            [getAttrKey(b)]: getAttrValue(b)
        }
    })
    console.log(peopleDetails)

    // return peopleDetails
}

export {getPeople, getPeopleDetails}