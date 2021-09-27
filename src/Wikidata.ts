import { People } from './types';
import { attributes, Qualifier } from './wikidata_attributes';

const endpoint = 'https://query.wikidata.org/sparql?format=json';

// https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q129857&sitefilter=frwiki&languages=fr&format=json

// https://www.wikidata.org/w/api.php?action=wbsearchentities&search=cice&language=fr&strictlanguage=true&format=json

const getYear = (date:string) => {
  if (!date) {
    return '';
  }
  const bce = date.match(/^-/);

  let sanitizedDate = date;
  if (bce) {
    sanitizedDate = sanitizedDate.substring(1);
  }

  const year = (new Date(sanitizedDate)).getFullYear();
  return bce ? year * -1 : year;
};

const getField = (obj: any, key :string) => {
  let ret = '';

  if (obj[key]) {
    ret = obj[key].datatype === 'http://www.w3.org/2001/XMLSchema#dateTime'
      ? getYear(obj[key].value) : obj[key].value;
  }

  return ret;
};

const capitalize = (s: string) : string => s.charAt(0).toUpperCase() + s.slice(1);

const getPeople = async (name: string, signal: AbortSignal) : Promise<People[]> => {
  const query = `SELECT DISTINCT ?item ?label ?desc ?birth ?death ?picture ?wikipedia ?wikiquote WHERE {
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
            OPTIONAL {
                ?wikipedia schema:about ?item .
                ?wikipedia schema:inLanguage "fr" .
                ?wikipedia schema:isPartOf <https://fr.wikipedia.org/> .
            }
            OPTIONAL {
                ?wikiquote schema:about ?item .
                ?wikiquote schema:inLanguage "fr" .
                ?wikiquote schema:isPartOf <https://fr.wikiquote.org/> .
            }
            ?item schema:description ?desc .
            FILTER(LANG(?label) = "fr" )
            FILTER(LANG(?desc) = "fr" )
          } ORDER BY ASC(?num) 
          LIMIT 8`;

  const body = new URLSearchParams();
  body.append('query', query);

  const response = await fetch(`${endpoint}&${body.toString()}`, { signal });
  const json = await response.json();

  let people = json.results.bindings.map((i:any) => ({
    qid: getField(i, 'item').replace('http://www.wikidata.org/entity/', ''),
    name: getField(i, 'label'),
    bornDate: getField(i, 'birth'),
    deathDate: getField(i, 'death'),
    picture: getField(i, 'picture'),
    wikipedia: getField(i, 'wikipedia'),
    wikiquote: getField(i, 'wikiquote'),
    description: capitalize(getField(i, 'desc')),
    categories: []
  }));

  people = people.filter((v:any, i:any, a:any) => a.findIndex((t:any) => (t.name === v.name)) === i);
  return people;
};

const getAttrKey = (a:any) => Object.keys(a)[0];
const getAttrValue = (a:any) => a[Object.keys(a)[0]];

const getQualifiers = async (qid: string, qualifier: Qualifier) => {
  const optProps = qualifier.attr.map((p) => `?q_stmt pq:${getAttrValue(p)} ?${getAttrKey(p)}.`).join('\n');

  const query = `SELECT DISTINCT ?name${qualifier.attr.map((p) => `?${getAttrKey(p)}`).join(' ')
  } WHERE {
        VALUES  ?item                   {wd:${qid}}

        ?item   p:${qualifier.value}    ?q_stmt. 
        ?q_stmt ps:${qualifier.value}   ?q.
        ?q      rdfs:label              ?name.
        ${optProps}
        FILTER(LANG(?name) = "fr" )
    }`;
  const body = new URLSearchParams();
  body.append('query', query);

  const response = await fetch(`${endpoint}&${body.toString()}`);
  const json = await response.json();

  // Maybe one of the most awful function of my life
  return json.results.bindings.map((i:any) => ({
    value: getField(i, 'name'),
    ...(qualifier.attr.map((a) => ({ [getAttrKey(a)]: getField(i, getAttrKey(a)) }))
      .reduce((b, c) => ({
        ...b,
        [getAttrKey(c)]: getAttrValue(c),
      }), {})),
  }));
};

// Qualifier
const getPeopleDetails = async (qid: string) => {
  const res = await Promise.all(attributes.map(async (a) => ({
    [a.key]: await getQualifiers(qid, a),
  })));
  const peopleDetails = res.reduce((a, b) => ({
    ...a,
    [getAttrKey(b)]: getAttrValue(b),
  }));

  return peopleDetails;
};

export { getPeople, getPeopleDetails };
