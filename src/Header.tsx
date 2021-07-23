import Divider from '@material-ui/core/Divider';
import {
    Link
  } from "react-router-dom";
import './Header.css'

export default function Header() {

    return (
        <div>
            <div className="Header">
                <Link style={{ textDecoration: 'none', color: '#666' }} to="/">TimelinesJS</Link>
            </div>
            <Divider/>
        </div>
    )
}