import {useEffect, useState} from 'react'
import './Timeline.css'

function Timeline() {
  const [state, setState] = useState({
    centuries: [],
    periods: [],
    people: []
  });

  const getTimelineRange = (items) => {  
    const max = items.reduce((acc, val) => val.end > acc ? val.end:acc, 0)
    const min = items.reduce((acc, val) => val.start < acc ? val.start:acc, 10000)

    // Computing the range to include boundaring centuries
    return {'min': Math.floor(min/100)*100, 'max': Math.ceil(max/100)*100}
  }

  const computeCenturies = (min, max) => {
    let centuries = []

    for(let c=min ; c<max ; c+=100) {
      const id = (c - min) / 100
      const width = 100 / ( (max - min)/100)
      const left = width * id
      centuries.push({id, width, left, year: c})
    }
    return centuries
  }

  const computePeriods = (items, min, max) => {
    let periods = []

    for(const item of items) {
      const width = 100 * (item.end - item.start) / (max - min)
      const left = 100 * (item.start - min) / (max - min)
      periods.push({width, left, name: item.name, start: item.start, end: item.end})
    }

    return periods
  }

  const computePeople = (items, min, max) => {
    let people = []

    // const minPeople = items.reduce((acc, val) => val.start < acc ? val.start:acc, 100000)

    for(let i=0 ; i< items.length ; i++) {
      const item = items[i]
      const width = 100 * (item.end - item.start) / (max - min)
      const left = 100 * (item.start - min) / (max - min)
      const marginTop = 12 + ((38 * i)/items.length)
      people.push({width, left, name: item.name, start: item.start, end: item.end, marginTop})
    }

    return people
  }

  useEffect(() => {
    fetch('/items.json')
        .then(response => response.json())
        .then((data) => {
            const {min, max} = getTimelineRange(data.periods.concat(data.people));
            const centuries = computeCenturies(min, max);
            const periods = computePeriods(data.periods, min, max);
            const people = computePeople(data.people, min, max);

            const s = {min, max, centuries, periods, people};
            setState(s);
        });
  }, []);

  return (
    <div className="App">
      {
        state.centuries.map(c => 
          <a key={c.year} className="Centuries" style={{width: `${c.width}%`, left: `${c.left}%`}}>{c.year}</a>
        )
      }
      {
        state.periods.map(i => 
          <a key={i.start} className="Periods" style={{width: `${i.width}%`, left: `${i.left}%`}}><div className="Left">{i.start}</div><div className="Centered">{i.name}</div><div className="Right">{i.end}</div></a>
        )
      }
      {
        state.people.map(i => 
          <a key={i.start} className="People" style={{width: `${i.width}%`, left: `${i.left}%`, "marginTop": `${i.marginTop}%`}}><div className="Left">{i.start}</div><div className="Centered">{i.name}</div><div className="Right">{i.end}</div></a>
        )
      }
    </div>
  );
}



export default Timeline;
