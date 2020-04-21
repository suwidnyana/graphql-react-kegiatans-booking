import React from 'react'
import './EventItem.css'

const eventItem = props =>  (
    <li key={props.eventId} className="events__list-item">
          <div>
                <h1>{props.judul}</h1>
                <h2>Rp{props.harga} - {new Date(props.date).toLocaleDateString()}</h2>
          </div>
          <div>
              {props.userId === props.creatorId 
              
              ?
              <p>Owner</p>
             
              :
              <button className="btn" 
                onClick={props.onDetail.bind(this, props.eventId)}>
                    View Details
                </button>
              }
             
              
          </div>
            
        
    </li>
);


export default eventItem;