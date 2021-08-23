import { Dialog, List, ListItem } from '@material-ui/core';
import './PeopleDetails.css'
import { People } from './types'

type PeopleDetailsParamsType = {
    people: People;
    open: boolean;
    onClose: any;
}

const PeopleDetails = (params: PeopleDetailsParamsType) => {
    const {people, open, onClose} = params;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            // style={{margin: '10px'}}
            fullWidth={true}
        >
            <div>{people.name}</div>
        {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="PeopleDetails">
                hello
            </div>
        </div> */}
        </Dialog>
    )
}

export default PeopleDetails