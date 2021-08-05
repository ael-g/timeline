import {useState} from 'react';
import {Add as AddIcon, Remove as RemoveIcon} from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import {People, Category, Event} from './types'
import PeopleEditor from './PeopleEditor'
import PeopleDetails from './PeopleDetails'
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

const units = [ 10, 25, 50, 100 ]

function Timeline(params: TimelineParams) {
  const { people, categories, events } = params;
  const timelineIdMatch = window.location.pathname.match(/timelines\/(.+)$/)
  const timelineId = timelineIdMatch ? timelineIdMatch[1]:''

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

  const findMarginTop = (items: any, item: any, i: number) => {
    let marginTop : number = 30
    
    for (let ii = 0 ; ii<=i ; ii++) {
      marginTop = 30 + ((70 * ii))

      const predecessor = items.filter((p:any) => (
        p.marginTop === marginTop && p.deathDate > (item.bornDate - 10)
      ))

      if (! predecessor.length) {
        break
      }
    }
    
    return marginTop
  }

  const computePeople = (items: any, min: number, max: number) => {
    let people = []
    for(let i=0 ; i< items.length ; i++) {
      const item = items[i]
      
      const width = 100 * (item.deathDate - item.bornDate) / (max - min)
      const left = 100 * (item.bornDate - min) / (max - min)
      const marginTop = findMarginTop(people, item, i)

      people.push({width, left, id: item.id, name: item.name, bornDate: item.bornDate, deathDate: item.deathDate, picture: item.picture, description: item.description, marginTop})
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
    const i = units.indexOf(unit) + val
    if (i < units.length && i >= 0) {
      setUnit(units[i])
    }
  }

  return (
    <div className="Timeline">
      {
        <div className="Zoom">
          <AddIcon className="ZoomAction" onClick={() => onChangeUnit(-1)}/>
          <Divider/>
          <RemoveIcon className="ZoomAction" onClick={() => onChangeUnit(1)}/>
        </div>
      }
      {
        <div className="AddItem">
          <AddIcon onClick={() => setIsOpenPeopleEditor(true)}/>
        </div>
      }
      {
        s.centuries.map(c => 
          <a key={c.year} className="Centuries" style={{width: `${c.width}%`, left: `${c.left}%`, height: `100%`}}>{c.year}</a>
        )
      }
      {
        <PeopleEditor open={isOpenPeopleEditor} onClose={() => setIsOpenPeopleEditor(false)} timelineId={timelineId}/>
      }
      {
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {
            s.people.map(i => <PeopleDetails people={i} setPeopleSelected={setPeopleSelectedLocal}/>)
          }
        </div>
      }
    </div>
  );
}

export default Timeline;
