import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import {
    Link
  } from "react-router-dom";
import './Header.css'
import {TimelineList} from './types'

type HeaderParams = {
    // timelineList: TimelineList
}

export default function Header(params : HeaderParams) {
    // const {timelineList} = params;

    return (
        <div>
            <div className="Header">
                <Link style={{ textDecoration: 'none', color: '#666' }} to="/">TimelinesJS</Link>
                {/* <Typography>{timelineList.name}</Typography> */}
            </div>
            <Divider/>
        </div>
    )
}