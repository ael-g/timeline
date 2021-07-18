import {useEffect, useState} from 'react'
import db from './config/firebase';
import './Timeline.css'
import {GenericTimelineObject, People} from './types'

function Timeline() {
  const [state, setState] = useState<{
    centuries: Array<GenericTimelineObject>,
    periods: Array<GenericTimelineObject>,
    people: Array<GenericTimelineObject>
   }>({
    centuries: [],
    periods: [],
    people: []
  });

  const getTimelineRange = (items :People[]) => {  
    const max = items.reduce((acc, val) => val.deathDate > acc ? val.deathDate:acc, 0)
    const min = items.reduce((acc, val) => val.bornDate < acc ? val.bornDate:acc, 10000)

    // Computing the range to include boundaring centuries
    return {'min': Math.floor(min/100)*100, 'max': Math.ceil(max/100)*100}
  }

  const computeCenturies = (min:number, max:number) => {
    let centuries = []

    for(let c=min ; c<max ; c+=100) {
      const id = (c - min) / 100
      const width = 100 / ( (max - min)/100)
      const left = width * id
      centuries.push({id, width, left, year: c})
    }
    return centuries
  }

  const computePeriods = (items: any, min: number, max: number) => {
    let periods = []

    for(const item of items) {
      const width = 100 * (item.end - item.start) / (max - min)
      const left = 100 * (item.start - min) / (max - min)
      periods.push({width, left, name: item.name, start: item.start, end: item.end})
    }

    return periods
  }

  const computePeople = (items: any, min: number, max: number) => {
    let people = []

    for(let i=0 ; i< items.length ; i++) {
      const item = items[i]
      const width = 100 * (item.deathDate - item.bornDate) / (max - min)
      const left = 100 * (item.bornDate - min) / (max - min)
      const marginTop = 4 + ((60 * i)/items.length)
      people.push({width, left, name: item.name, start: item.bornDate, end: item.deathDate, marginTop})
    }

    return people
  }

  const getPeople = async () => {
    const col = await db.collection('people').get();
    return col.docs.map(p => {return {id: p.id, ...p.data()} as People})
  }

  useEffect(() => {
    ( async () => {
      const data = await getPeople()
      const {min, max} = getTimelineRange(data);
      const centuries = computeCenturies(min, max);
      const people = computePeople(data, min, max);
      const s = {min, max, centuries, periods:[], people};
      setState(s as any);
      console.log(data)
    })()
  }, []);

  return (
    <div style={{position: 'absolute', width: '80%'}}>
      {
        state.centuries.map(c => 
          <a key={c.year} className="Centuries" style={{width: `${c.width}%`, left: `${c.left}%`}}>{c.year}</a>
        )
      }
      {
        state.periods.map(i => 
          <a key={i.name} className="Periods" style={{width: `${i.width}%`, left: `${i.left}%`}}><div className="Left">{i.start}</div><div className="Centered">{i.name}</div><div className="Right">{i.end}</div></a>
        )
      }
      {
        state.people.map(i => 
          <a key={i.name} className="People" style={{width: `${i.width}%`, left: `${i.left}%`, "marginTop": `${i.marginTop}%`}}><div className="Left">{i.start}</div><div className="Centered">{i.name}</div><div className="Right">{i.end}</div></a>
        )
      }
    </div>
  );
}

export default Timeline;
