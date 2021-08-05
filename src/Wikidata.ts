const endpoint = "https://query.wikidata.org/sparql?format=json"

const getPeople = async (name: string) => {
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

    const people = await response.json();
    const res = people.results.bindings
    console.log(res)
    return res
}

export {getPeople}