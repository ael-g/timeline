import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

type AddPeopleModalParamsType = {
    db: any
}

export default function AddPeopleModal(params : AddPeopleModalParamsType) {

    const onSubmitPeople = async () => {
        // const p = {...selectedPeopleModified, timelineLists: [selectedTimelineList.id]}
        // if(p.name && p.bornDate && p.deathDate && p.timelineLists.length && p.timelineLists[0]) {
        //     const existing = await db.collection('people').where('name', '==', p.name).get();
        //     if(!existing.docs.length) {
        //         await db.collection('people').add(p);
        //         // await getPeople(selectedTimelineList)
        //     }
        // } 
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            {/* <TextField id="name" onChange={(e:any) => {selectedPeopleModified.name=e.target.value; setSelectedPeople(selectedPeopleModified)}} label="Name" value={selectedPeople.name}/>
            <TextField id="bornDate" onChange={(e:any) => {selectedPeopleModified.bornDate=e.target.value; setSelectedPeople(selectedPeopleModified)}} label="Born date" type="number" value={selectedPeople.bornDate}/>
            <TextField id="deathDate" onChange={(e:any) => {selectedPeopleModified.deathDate=e.target.value; setSelectedPeople(selectedPeopleModified)}} label="Death date" type="number" value={selectedPeople.deathDate}/>
            <Button variant="contained" color="primary" onClick={onSubmitPeople}>Add</Button> */}
        </div>
    )
}