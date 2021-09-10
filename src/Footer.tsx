import React from 'react';
import Divider from '@material-ui/core/Divider';
import './Footer.css';

export default function Footer() {
  return (
    <div className="Footer">
      <Divider />
      <div className="Footer-text">
        Credits to Laurent Houmeau from
        {' '}
        <a href="https://soclassiq.com" target="_blank" rel="noopener noreferrer">soclassiq.com</a>
        {' '}
        for the original timeline style
      </div>
    </div>
  );
}
