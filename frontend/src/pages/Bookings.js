import React, { Component } from 'react'
import AuthContext from '../context/auth-context'
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList'
import BookingChart from '../components/Bookings/BookingChart/BookingChart'
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls'

class Bookings extends Component {

    state = {
    
        isLoading: false,
        bookings: [],
        outputType: 'list'
      };

      static contextType = AuthContext;

      componentDidMount() {
        this.fetchBookings();
      }

      fetchBookings = () => {
        this.setState({ isLoading: true });
        const requestBody = {
          
          query: `
              query {
                bookings {
                    _id
                    createdAt
                    event {
                      _id
                      judul
                      date
                      harga
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
            const bookings = resData.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
           
            console.log(resData) 
          })
          .catch(err => {
            console.log(err);
          });
      }

      deleteBookingHandler = (bookingId) => {
        this.setState({ isLoading: true });
        const requestBody = {
          query: `
              mutation {
                cancelBooking(bookingId: "${bookingId}") {
                _id
                 judul
                }
              }
            `
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
            this.setState(prevState => {
              const updatedBookings = prevState.bookings.filter(booking => {
                return booking._id !== bookingId;
              });
              return { bookings: updatedBookings, isLoading: false };
            });
          }) 
          .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
      

      changeOutputTypeHandler = (outputType) => {
        if(outputType === 'list')
        {
          this.setState({outputType: 'list'});
        } else 
        {
          this.setState({outputType: 'chart'});
        }
      }


    render()
    {
      let content = <Spinner/>
      if(!this.state.isLoading) {  
        content = (
          <>
              <BookingsControls
                activeOutputType={this.state.outputType}
                onChange={this.changeOutputTypeHandler}
              />

              <div>
                {this.state.outputType === 'list' 
                ? 
                (
                <BookingList
                  bookings={this.state.bookings}
                  onDelete={this.deleteBookingHandler}
                />
                ) : (
               <BookingChart
                bookings={this.state.bookings}
               />
                )}
              </div>
          </>
        );

      }

        return (
        
          <>
             {content}
           </>

        );
    }
}


export default Bookings;