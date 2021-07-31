import {useState} from 'react';
import {People, Category} from './types'
import PeopleEditor from './PeopleEditor'
import PeopleDetails from './PeopleDetails'
import './Timeline.css'

type TimelineParams = {
  people: People[];
  categories: Category[];
}

const makeDefaultPeople = () : People => {
  return {
    id: '',
    name: "",
    bornDate: 0,
    deathDate: 0,
    picture: ""
  }
}

function Timeline(params: TimelineParams) {
  const { people, categories } = params;

  const [peopleSelected, setPeopleSelected] = useState<People>(makeDefaultPeople())
  const [isOpenPeopleEditor, setIsOpenPeopleEditor] = useState<boolean>(false)

  const unit = 25

  const setPeopleSelectedLocal = (p: People) => {
    setPeopleSelected(p)
    setIsOpenPeopleEditor(true)
  }

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
      periods.push({width, left, name: item.name, bornDate: item.bornDate, deathDate: item.deathDate})
    }

    return periods
  }

  const computePeople = (items: any, min: number, max: number) => {
    let people = []
    for(let i=0 ; i< items.length ; i++) {
      const item = items[i]
      
      const width = 100 * (item.deathDate - item.bornDate) / (max - min)
      const left = 100 * (item.bornDate - min) / (max - min)
      const marginTop = 30 + ((40 * i))

      people.push({width, left, id: item.id, name: item.name, bornDate: item.bornDate, deathDate: item.deathDate, picture: item.picture, marginTop})
    }

    return people
  }

  const computeHeight = (people: any[]) => {
    return people.reduce((acc, val) => val.marginTop > acc ? val.marginTop:acc, -10000)
  }

  const {min, max} = getTimelineRange(people);
  const centuries = computeCenturies(min, max);
  const peopleComputed = computePeople(people, min, max);
  const height = computeHeight(peopleComputed);
  console.log(height)
  const s = {min, max, centuries, periods:[], people: peopleComputed};

  return (
    <div className="Timeline">
      {
        s.centuries.map(c => 
          <a key={c.year} className="Centuries" style={{width: `${c.width}%`, left: `${c.left}%`, height: `${height}px`}}>{c.year}</a>
        )
      }
      {/* {
        s.periods.map(i => 
          <a key={i.name} className="Periods" style={{width: `${i.width}%`, left: `${i.left}%`}}><div className="Left">{i.start}</div><div className="Centered">{i.name}</div><div className="Right">{i.end}</div></a>
        )
      } */}
      {
        <PeopleEditor open={isOpenPeopleEditor} onClose={() => setIsOpenPeopleEditor(false)} people={peopleSelected} categories={categories}/>
      }
      {
        s.people.map(i => <PeopleDetails people={i} setPeopleSelected={setPeopleSelectedLocal}/>)
      }
    </div>
  );
}

export default Timeline;
