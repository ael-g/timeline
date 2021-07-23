import './Timeline.css'
import {People} from './types'

type TimelineParams = {
  people: People[]
}

function Timeline(params: TimelineParams) {
  const { people } = params;

  const unit = 25

  const getTimelineRange = (items :People[]) => {  
    const max = items.reduce((acc, val) => val.deathDate > acc ? val.deathDate:acc, -10000)
    const min = items.reduce((acc, val) => val.bornDate < acc ? val.bornDate:acc, 10000)

    // Computing the range to include boundaring centuries
    return {'min': Math.floor(min/unit)*unit, 'max': Math.ceil(max/unit)*unit}
  }

  const computeCenturies = (min:number, max:number) => {
    let centuries = []

    for(let c=min ; c<max ; c+=unit) {
      const id = (c - min) / unit
      const width = 100 / ( (max - min)/unit)
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
      const marginTop = 4 + ((80 * i)/items.length)
      people.push({width, left, name: item.name, start: item.bornDate, end: item.deathDate, marginTop})
    }

    return people
  }

  const {min, max} = getTimelineRange(people);
  const centuries = computeCenturies(min, max);
  const peopleComputed = computePeople(people, min, max);
  const s = {min, max, centuries, periods:[], people: peopleComputed};

  return (
    <div style={{position: 'absolute', width: '80%'}}>
      {
        s.centuries.map(c => 
          <a key={c.year} className="Centuries" style={{width: `${c.width}%`, left: `${c.left}%`}}>{c.year}</a>
        )
      }
      {/* {
        s.periods.map(i => 
          <a key={i.name} className="Periods" style={{width: `${i.width}%`, left: `${i.left}%`}}><div className="Left">{i.start}</div><div className="Centered">{i.name}</div><div className="Right">{i.end}</div></a>
        )
      } */}
      {
        s.people.map(i => 
          <a key={i.name} className="People" style={{width: `${i.width}%`, left: `${i.left}%`, "marginTop": `${i.marginTop}vh`}}><div className="Left">{i.start}</div><div className="Centered">{i.name}</div><div className="Right">{i.end}</div></a>
        )
      }
    </div>
  );
}

export default Timeline;
