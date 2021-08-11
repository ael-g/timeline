import {People} from './types'

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

const sendQuery = async (q: string) => {
    const body = new URLSearchParams();
    body.append('query', q);

    const response = await fetch(`${endpoint}&${body.toString()}`);
    const json = await response.json();

    return json.results.bindings
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

    const people = (await sendQuery(query)).map( (i:any) => ({
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

const getOccupation = async (qid: string) => {
    const query = `SELECT DISTINCT ?occupation_label WHERE {
        VALUES ?item {wd:${qid}}
        OPTIONAL { ?item p:P106 ?occupation_stmt. }
        OPTIONAL { ?occupation_stmt ps:P106 ?occupation.}
        OPTIONAL { ?occupation rdfs:label ?occupation_label . }

        FILTER(LANG(?occupation_label) = "fr" )
    }`

    return (await sendQuery(query)).map( (i:any) => ({
        occupation: capitalize(getField(i, 'occupation_label'))
    }))
}

const getPositionHeld = async (qid: string) => {
    const query = `SELECT DISTINCT ?position_held_label ?start ?end WHERE {
        VALUES ?item {wd:${qid}}

        OPTIONAL { ?item p:P39 ?position_held_stmt. }
        OPTIONAL { ?position_held_stmt ps:P39 ?position_held. }
        OPTIONAL { ?position_held rdfs:label ?position_held_label. }
        OPTIONAL { ?position_held_stmt pq:P580 ?start. }
        OPTIONAL { ?position_held_stmt pq:P582 ?end. }

        FILTER(LANG(?position_held_label) = "fr" )
    }`

    return (await sendQuery(query)).map( (i:any) => { return {
        positionHeld: capitalize(getField(i, "position_held_label")),
        start: getYear(getField(i, "start")),
        end: getYear(getField(i, "end")),
    }})
}

// Qualifier
const getPeopleDetails = async (qid: string) => {
    const occupations = await getOccupation(qid);
    const positionHeld = await getPositionHeld(qid);
    return {
        occupations,
        positionHeld,
    }
}

export {getPeople, getPeopleDetails}