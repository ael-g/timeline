import {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {Add as AddIcon, Remove as RemoveIcon} from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import {People, Category, Event} from './types';
import PeopleEditor from './PeopleEditor';
import PeopleBar from './PeopleBar';
import PeopleDetails from './PeopleDetails';
import {getSignedInUserWithoutSignin} from './Authentication';
import { TimelineList } from './types';
import db from './config/firebase';


import './Timeline.css'

type TimelineParams = {
  people: People[];
  setPeople: Function;
  categories: Category[];
  events: Event[];
}

type TimelineRouterParams = {
  timelineId: string;
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

const expandPeople = (people: any) => {
  return people
  const ret = people.map( (p:any) => p['positionHeld'] ? p['positionHeld'].map( (q:any) => (
  {
    name: p.name,
    description: q.value,
    bornDate: q.start,
    deathDate: q.end,
  }) ).concat([p]) : p ).flat().sort((a:any, b:any) => {return a.name < b.name ? -1:1})
  return ret
}

const units = [ 10, 25, 50, 100 ]

function Timeline(params: TimelineParams) {
  const { timelineId } = useParams<TimelineRouterParams>();

  const { people, setPeople } = params;

  // const peopleExpanded = expandPeople(people)

  const [peopleSelected, setPeopleSelected] = useState<People>(makeDefaultPeople())
  const [isOpenPeopleEditor, setIsOpenPeopleEditor] = useState<boolean>(false)
  const [isOpenPeopleDetails, setIsOpenPeopleDetails] = useState<boolean>(false)
  const [isOwnTimeline, setIsOwnTimeline] = useState<boolean>(false)
  console.log(isOwnTimeline)

  const [unit, setUnit] = useState<number>(25)

  const setPeopleSelectedLocal = (p: People) => {
    setPeopleSelected(p)
    setIsOpenPeopleDetails(true)
  }

  useEffect(() => {
    getIsOwnTimeline();
  }, []);

  const getIsOwnTimeline = async () => {
      const user = await getSignedInUserWithoutSignin()
      const timeline = await db.collection('timelineLists').doc(timelineId).get();
      const t = {id: timeline.id, ...timeline.data()} as TimelineList
      const iot = (user && user.email === t.userEmail) || false
      setIsOwnTimeline(iot)
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

      people.push({
        width, 
        left, 
        id: item.id, 
        name: item.name, 
        bornDate: item.bornDate, 
        deathDate: item.deathDate, 
        picture: item.picture, 
        description: item.description,
        wikipedia: item.wikipedia, 
        wikiquote: item.wikiquote, 
        marginTop})
    }

    return people
  }

  const {min, max} = getTimelineRange(people);
  const centuries = computeCenturies(min, max);
  const peopleComputed = computePeople(people, min, max);
  // const height = computeHeight(peopleComputed);
  const s = {min, max, centuries, periods:[], people: peopleComputed};

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
        isOwnTimeline ? 
        <div className="AddItem">
          <AddIcon onClick={() => setIsOpenPeopleEditor(true)}/>
        </div> : <></>
      }
      {
        s.centuries.map(c => 
          <a key={c.year} className="Centuries" style={{width: `${c.width}%`, left: `${c.left}%`, height: `100%`}}>{c.year}</a>
        )
      }
      {
        <PeopleEditor timelineId={timelineId} setPeople={setPeople} open={isOpenPeopleEditor} onClose={() => setIsOpenPeopleEditor(false)}/>
      }
      {
        <PeopleDetails open={isOpenPeopleDetails} onClose={() => setIsOpenPeopleDetails(false)} people={peopleSelected}/>
      }
      {
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {
            s.people.map(i => <PeopleBar people={i} setPeopleSelected={setPeopleSelectedLocal}/>)
          }
        </div>
      }
    </div>
  );
}

export default Timeline;
