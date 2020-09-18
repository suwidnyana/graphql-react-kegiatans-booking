import React from 'react'
import './EventList.css'
import EventItem from './EventItem/EventItem'

const eventList = props =>  {
 
    const events = props.events.map(event => 
      
      {
         return <EventItem
         key={event._id} 
         eventId={event._id} 
         judul={event.judul}
         userId={props.authUserId}
         date={event.date}
         harga={event.harga}
         creatorId={event.creator._id}
         onDetail={props.onViewDetail}         
         /> 
      });

    return (
        <ul className="events__list">
                {events}
        </ul>
    );
}   


export default eventList;