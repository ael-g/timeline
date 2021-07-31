import {useState} from 'react';
import {Add as AddIcon, Remove as RemoveIcon} from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import {People, Category, Event} from './types'
import PeopleEditor from './PeopleEditor'
import PeopleDetails from './PeopleDetails'
import EventDetails from './EventDetails'
import './Timeline.css'

type TimelineParams = {
  people: People[];
  categories: Category[];
  events: Event[];
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
  const { people, categories, events } = params;

  const [peopleSelected, setPeopleSelected] = useState<People>(makeDefaultPeople())
  const [isOpenPeopleEditor, setIsOpenPeopleEditor] = useState<boolean>(false)
  const [unit, setUnit] = useState<number>(25)

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

  const computePeople = (items: any, min: number, max: number) => {
    let people = []
    for(let i=0 ; i< items.length ; i++) {
      const item = items[i]
      
      const width = 100 * (item.deathDate - item.bornDate) / (max - min)
      const left = 100 * (item.bornDate - min) / (max - min)
      const marginTop = 30 + ((45 * i))

      people.push({width, left, id: item.id, name: item.name, bornDate: item.bornDate, deathDate: item.deathDate, picture: item.picture, marginTop})
    }

    return people
  }

  const computeEvents = (items: Event[], min: number, max: number) => {
    let events = []
    for(let i=0 ; i< items.length ; i++) {
      const item = items[i]
      
      const left = 100 * (item.date - min) / (max - min)
      const marginTop = 30 + ((45 * i))

      events.push({left, id: item.id, name: item.name, date: item.date, marginTop})
    }

    return events
  }

  const computeHeight = (people: any[]) => {
    return people.reduce((acc, val) => val.marginTop > acc ? val.marginTop:acc, -10000)
  }

  const {min, max} = getTimelineRange(people);
  const centuries = computeCenturies(min, max);
  const peopleComputed = computePeople(people, min, max);
  const eventsComputed = computeEvents(events, min, max);
  const height = computeHeight(peopleComputed);
  const s = {min, max, centuries, periods:[], people: peopleComputed, events: eventsComputed};

  const onChangeUnit = (val:number) => {
    let newUnit = unit + val;
    newUnit = newUnit < 25 ? 25: newUnit;
    newUnit = newUnit > 100 ? 100: newUnit;
    setUnit(newUnit)
  }

  return (
    <div className="Timeline">
      {
        <div className="Zoom">
          <AddIcon className="ZoomAction" onClick={() => onChangeUnit(25)}/>
          <Divider/>
          <RemoveIcon className="ZoomAction" onClick={() => onChangeUnit(-25)}/>
        </div>
      }
      {
        <div className="AddItem">
          <AddIcon onClick={() => setIsOpenPeopleEditor(true)}/>
        </div>
      }
      {
        s.centuries.map(c => 
          <a key={c.year} className="Centuries" style={{width: `${c.width}%`, left: `${c.left}%`, height: `${height}px`}}>{c.year}</a>
        )
      }
      {
        <PeopleEditor open={isOpenPeopleEditor} onClose={() => setIsOpenPeopleEditor(false)} people={peopleSelected} categories={categories}/>
      }
      {/* {
        s.events.map(i => <EventDetails event={i}/>)
      } */}
      {
        s.people.map(i => <PeopleDetails people={i} setPeopleSelected={setPeopleSelectedLocal}/>)
      }
    </div>
  );
}

export default Timeline;
