import './PeopleBar.css';

type PeopleBarParamsType = {
    people: PeopleDisplayType;
    setPeopleSelected: Function;
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
}


export default function PeopleBar(params : PeopleBarParamsType) {
    const {people, setPeopleSelected} = params;

    return (
        <div>
            <a  key={people.name}
                onClick={() => setPeopleSelected(people)}
                className="People" style={{width: `${people.width}%`, left: `${people.left}%`, "marginTop": `${people.marginTop}px`}}>
                <div className="Left">{people.bornDate}</div>
                <div className="Centered">
                    <div style={{fontWeight: "bold"}}>{people.name}</div>
                    <div>{people.description}</div>
                </div>
                <div className="Right">{people.deathDate}</div>
            </a>
        </div>
    )
}

