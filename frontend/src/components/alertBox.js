import React from 'react';
import {Snippet} from "@nextui-org/react";

export const NotificationBox = ({notification}) => {
    return (
    <Snippet className="anim-snippet" variant="shadow" hideCopyButton hideSymbol style={{position:'fixed', top: 0,right: 0, zIndex:'99999', margin:'15px', padding:'10px'}}>
        <div className='snippet-notification'>
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> 
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> <path class="checkmark__check" 
            fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <p>{notification}</p>
        </div>
    </Snippet>
    );
}

export const Error = ({error}) => {
    return (
    <Snippet className="anim-snippet" variant="shadow" hideCopyButton hideSymbol style={{position:'fixed', right: 0, zIndex:'99999', margin:'15px', padding:'10px'}}>
        <div className='snippet-notification'>
        <svg class="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="crossmark_circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="crossmark_check" fill="none" d="M14.1 14.1l23.8 23.8 m0,-23.8 l-23.8,23.8"/>
        </svg>
        <p>{error}</p>
        </div>
    </Snippet>
    );
}