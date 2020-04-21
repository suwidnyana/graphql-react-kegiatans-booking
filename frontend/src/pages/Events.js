import React, { Component } from 'react'
import './Events.css';

import Modal from '../components/Modal/Modal'

import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'

import EventList from '../components/Events/EventList/EventList'
import Spinner from '../components/Spinner/Spinner';
class Events extends Component {
   
  
      state = {
        creating: false,
        kegiatans: [],
        isLoading: false,
        selectedEvent: null
      };
      isActive = true;
    
      static contextType = AuthContext;
    
      constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
      }
    
      componentDidMount() {
        this.fetchEvents();
      }
    
      startCreateEventHandler = () => {
        this.setState({ creating: true });
      };
    
      modalConfirmHandler = () => {
        this.setState({ creating: false });
        const judul = this.titleElRef.current.value;
        const harga = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const deskripsi = this.descriptionElRef.current.value;
    
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
    
        const token = this.context.token;
    
        fetch('http://localhost:8000/graphql', {
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
          .then(resData => {
            // this.fetchEvents();
            // console.log(resData)
            this.setState(stateSebelumnya => {
              const updateEvents = [...stateSebelumnya.kegiatans];
              updateEvents.push({
                  _id : resData.data.buatEvent._id,
                  judul: resData.data.buatEvent.judul,
                  deskripsi: resData.data.buatEvent.deskripsi,
                  date: resData.data.buatEvent.date,
                  harga: resData.data.buatEvent.harga,
                  creator: {
                    _id: this.context.userId
                  }
              });
              return {kegiatans: updateEvents};
            })
          })
          .catch(err => {
            console.log(err);
          });
      };


      fetchEvents() {
        this.setState({ isLoading: true });
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
        };
    
       
    
        fetch('http://localhost:8000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
           
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            const events = resData.data.kegiatans;
            if (this.isActive) {
              this.setState({ kegiatans: events, isLoading: false });
            }
            console.log(resData) 
          })
          .catch(err => {
            console.log(err);
            if(this.isActive) {
              this.setState({ isLoading: false})
            }
          });
      }
    
      modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null });
      };

      showDetailHandler = eventId => {
        this.setState(stateSebelumnya => {
          const selectedEvent = stateSebelumnya.kegiatans.find(
            e => e._id === eventId
            )
            return {selectedEvent: selectedEvent}
        })
      }
    

      bookEventHandler = () => {
        if(!this.context.token) {
          this.setState({selectedEvent: null})
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
              id: this.state.selectedEvent._id
            }
        };
    
        fetch('http://localhost:8000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.context.token
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            this.setState({ selectedEvent: null });
            console.log(resData) 
          })
          .catch(err => {
            console.log(err);
          });
      }
  
      componentWillUnmount() {
        this.isActive = false;
      }

        render() {
            return (
              <>
                 {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
                {this.state.creating && (
                  <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={this.modalCancelHandler}
                    onConfirm={this.modalConfirmHandler}
                    ConfirmText="Confirm"
                  >
                      <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                {/* <input type="datetime-local" id="date" ref={this.dateElRef} /> */}
                <input type="date" id="date" ref={this.dateElRef} />

              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
                )}

                {this.state.selectedEvent && (
                   <Modal
                   title={this.state.selectedEvent.judul}
                   canCancel
                   canConfirm
                   onCancel={this.modalCancelHandler}
                   onConfirm={this.bookEventHandler}
                   ConfirmText={!this.context.token ? "Confirm" : "Book" }
                 >

                <h1>{this.state.selectedEvent.judul}</h1>
                <h2>
                  Rp {this.state.selectedEvent.harga} -{' '}
                  {new Date(this.state.selectedEvent.date).toLocaleDateString()}
                </h2>
                <p>{this.state.selectedEvent.deskripsi}</p>
            
            </Modal>
                )}


                {this.context.token && (
                <div className="events-control">
                  <p>Share your own Events!</p>
                  <button className="btn" onClick={this.startCreateEventHandler}>
                    Buat Event
                  </button>
                </div>

                )}
                
                {
                  this.state.isLoading 
                    ? 
                    <Spinner/>
                      :
                  <EventList 
                    events={this.state.kegiatans} 
                    authUserId={this.context.userId}
                    onViewDetail={this.showDetailHandler}
                  />

                }
              </>
            );
          }
        }


export default Events;