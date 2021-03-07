import React, {useContext,useState, useEffect, createRef} from 'react'
import { useQuery,gql } from '@apollo/client';

import './Events.css';

import Modal from '../components/Modal/Modal'

import Backdrop from '../components/Backdrop/Backdrop'
import {AuthContext} from '../context/auth-context'

import EventList from '../components/Events/EventList/EventList'
import Spinner from '../components/Spinner/Spinner';

import withAuth from './withAuth';


const getEventsQuery = gql`
  {
    kegiatans {
      _id
      judul
      deskripsi
      date
      harga
      creator {
        _id
        email
      }
    }
  }
  `

const Events = () =>  {
  
  const { loading, data, error } = useQuery(getEventsQuery)

  const context = useContext(AuthContext);

  const [creating, setCreating] = useState(false);
  const [kegiatans,setKegiatans] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  const [selectedEvent,setselectedEvent] = useState(null)

  const titleEl = createRef()
  const priceEl = createRef()
  const dateEl = createRef()
  const descriptionEl = createRef()



  const fetchEvents = async () => { 
        try {
          setIsLoading(true)      
          const requestBody = {
            query: `
                query {
                  kegiatans {
                    _id
                    judul
                    deskripsi
                    date
                    harga
                    creator {
                      _id
                      email
                    }
                  }
                }
              `
          }
         const request = await fetch(`${process.env.REACT_APP_API}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
              'Content-Type': 'application/json',
            }
          })
  
          if (request.status !== 200 && request.status !== 201) {
            throw new Error('Failed!')
          }
          
          const response = await request.json()
          console.log(response)
          setKegiatans(response.data.kegiatans)
          setIsLoading(false)
         
        }catch(err){
          setIsLoading(false) 
      }
    }
      
  const startCreateEventHandler = () => {
       setCreating(true);
    };
    
      const modalConfirmHandler = async () => {

        try {
          setCreating(false);
          const judul = titleEl.current.value;
          const harga = +priceEl.current.value;
          const date = dateEl.current.value;
          const deskripsi = descriptionEl.current.value;

          
    
          if (
            judul.trim().length === 0 ||
            harga <= 0 ||
            date.trim().length === 0 ||
            deskripsi.trim().length === 0
          ) {
            return;
          }
      
          const event = { judul, harga, date, deskripsi };
          console.log(event);
      
          const requestBody = {
            query: `
                mutation {
                  buatEvent(eventInput: {judul: "${judul}", deskripsi: "${deskripsi}", harga: ${harga}, date: "${date}"}) {
                    _id
                    judul
                    deskripsi
                    date
                    harga
                    creator {
                      _id
                      email
                    }
                  }
                }
              `
          };
      
          const token = context.token;
      
          const request = await fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token
            }
          })
            .then(res => {
              if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
              }
              return res.json();
            })

            // .then(resData => {
            //   // this.fetchEvents();
            //   // console.log(resData)
            //   this.setState(stateSebelumnya => {
            //     const updateEvents = [...stateSebelumnya.kegiatans];
            //     updateEvents.push({
            //         _id : resData.data.buatEvent._id,
            //         judul: resData.data.buatEvent.judul,
            //         deskripsi: resData.data.buatEvent.deskripsi,
            //         date: resData.data.buatEvent.date,
            //         harga: resData.data.buatEvent.harga,
            //         creator: {
            //           _id: this.context.userId
            //         }
            //     });
            //     return {kegiatans: updateEvents};
            //   })
            // })
            // .catch(err => {
            //   console.log(err);
            // });

            const response  = await request.json()
            setKegiatans(prevEvents=>[...prevEvents, response.data.buatEvent])
        }catch(err)
        { console.log(err)}
       
      };

      const modalCancelHandler = () => {
        setCreating(false)
        setselectedEvent(null)
      };

    const showDetailHandler = eventId =>{
      const currentEvent = kegiatans.find(event=>event._id === eventId)
     setselectedEvent(currentEvent)
    }

    const bookEventHandler = () => {
        if(!context.token) {
          // this.setState({selectedEvent: null})
          setselectedEvent(null)
          return;
        }
        const requestBody = {
          query: `
              mutation bookEvent($id: ID!) {
                bookKegiatan(eventId: $id) {
                  _id
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: {
              id: selectedEvent._id
            }
        };
    
        fetch('http://localhost:8000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + context.token
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            // this.setState({ selectedEvent: null });
            setselectedEvent(null)
            console.log(resData) 
          })
          .catch(err => {
            console.log(err);
          });
    }
  
      // componentWillUnmount() {
      //   this.isActive = false;
      // }

    
      useEffect(() => {
        if (!!data) {
          const evenstData = data.kegiatans.map((event, key) => {
            return {
              key,
              ...event,
            }
          })
          console.log(evenstData)
    
          setKegiatans(evenstData)
         
        }
      }, [data]);

            return (
           
              <>
              {(creating || selectedEvent) && <Backdrop />}
             {creating && (
               <Modal
                 title="Add Event"
                 canCancel
                 canConfirm
                 onCancel={modalCancelHandler}
                 onConfirm={modalConfirmHandler}
                 ConfirmText="Confirm"
               >
                   <form>
           <div className="form-control">
             <label htmlFor="title">Title</label>
             <input type="text" id="title" ref={titleEl} />
           </div>
           <div className="form-control">
             <label htmlFor="price">Price</label>
             <input type="number" id="price" ref={priceEl} />
           </div>
           <div className="form-control">
             <label htmlFor="date">Date</label>
             {/* <input type="datetime-local" id="date" ref={this.dateElRef} /> */}
             <input type="date" id="date" ref={dateEl} />

           </div>
           <div className="form-control">
             <label htmlFor="description">Description</label>
             <textarea
               id="description"
               rows="4"
               ref={descriptionEl}
             />
           </div>
         </form>
       </Modal>
             )}

             {selectedEvent && (
                <Modal
                title={selectedEvent.judul}
                canCancel
                canConfirm
                onCancel={modalCancelHandler}
                onConfirm={bookEventHandler}
                ConfirmText={!context.token ? "Confirm" : "Book" }
              >

             <h1>{selectedEvent.judul}</h1>
             <h2>
               Rp {selectedEvent.harga} -{' '}
               {new Date(selectedEvent.date).toLocaleDateString()}
             </h2>
             <p>{selectedEvent.deskripsi}</p>
         
         </Modal>
             )}


             {context.token && (
             <div className="events-control">
               <p>Share your own Events!</p>
               <button className="btn" onClick={startCreateEventHandler}>
                 Buat Event
               </button>
             </div>

             )}
             
             {
               isLoading 
                 ? 
                 <Spinner/>
                   :
               <EventList 
                 events={kegiatans} 
                 onViewDetail={showDetailHandler}
               />

             }
           </>
            );
          
        }

      //}
export default withAuth(Events);