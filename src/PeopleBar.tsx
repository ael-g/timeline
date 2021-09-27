import React, {useState} from 'react';

import { Add as AddIcon} from '@material-ui/icons';
import randomcolor from 'randomcolor';
import './PeopleBar.css';


type PeopleBarParamsType = {
    people: PeopleDisplayType;
    setPeopleSelected: Function;
    setCategoriesMenuPeople: Function;
}

type PeopleDisplayType = {
    id: string;
    name: string;
    width: number;
    left: number;
    marginTop: number;
    bornDate: number;
    deathDate: number;
    picture: string;
    description?: string;
    categories?: string[];
}

export default function PeopleBar(params : PeopleBarParamsType) {
  const { people, setPeopleSelected, setCategoriesMenuPeople } = params;
  const [displayAddCategory, setDisplayAddCategory] = useState<boolean>(false)


  return (
    <div
      key={people.name}
      onMouseEnter={() => setDisplayAddCategory(true)}
      onMouseLeave={() => setDisplayAddCategory(false)}
      className="People"
      style={{ width: `${people.width}%`, left: `${people.left}%`, marginTop: `${people.marginTop}px` }}
    >
      <div className="Left">{people.bornDate}</div>
      <div className="Centered" onClick={() => setPeopleSelected(people)}>
        <div style={{ fontWeight: 'bold' }}>{people.name}</div>
        <div style={{ fontSize: 'min(3vw, 0.8rem)' }}>{people.description}</div>
      </div>
      <div className="Categories" onClick={() => setCategoriesMenuPeople(people)}>
          {people.categories ? people.categories.map( (c) => (
            <div style={{
              backgroundColor: randomcolor({seed: c}),
              width: '20px',
              height: '20px',
              borderRadius: '8px',
              marginRight: '5px'
            }}></div>
          )): <></>}
        <div className={displayAddCategory ? 'CategoriesAdd-fadeIn': 'CategoriesAdd-fadeOut'}>
          <AddIcon/>
        </div>
      </div>
      <div className="Right">{people.deathDate}</div>
    
    </div>
  );
}
