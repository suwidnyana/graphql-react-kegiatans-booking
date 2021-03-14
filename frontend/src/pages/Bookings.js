import React, {useState, useEffect, useContext } from 'react'
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList'
import BookingChart from '../components/Bookings/BookingChart/BookingChart'
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls'

import {AuthContext} from '../context/auth-context';
import { useQuery,gql } from '@apollo/client';
import {getBookingsQuery} from '../queries/index'


const Bookings = () => {

  const [isLoading, setLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const [outPutType, setOutPutType] = useState('list')
  const context = useContext(AuthContext)


  const { data } = useQuery(getBookingsQuery)


  useEffect(() => {
    fetchBookings()
    
    }, []);


  const fetchBookings = () => {
    try {
      setLoading(true) 
      if (!!data) {
        const response = data.kegiatans.map((event, key) => {
          return {
            key,
            ...event,
          }
        })
        console.log(response)
    
        setBookings(response)
        setLoading(false)
       
      }
    } catch (error) {
      setLoading(false) 
    }
  } 
     
    // const fetchBookings = () => {
    //   setLoading(true)
    //   const requestBody = {
        
    //     query: `
    //         query {
    //           bookings {
    //               _id
    //               createdAt
    //               event {
    //                 _id
    //                 judul
    //                 date
    //                 harga
    //               }
    //           }
    //         }
    //       `
    //   };
  
     
  
    //   fetch(`${process.env.REACT_APP_API}`, {
    //     method: 'POST',
    //     body: JSON.stringify(requestBody),
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: 'Bearer ' + context.token
    //     }
    //   })
    //     .then(res => {
    //       if (res.status !== 200 && res.status !== 201) {
    //         throw new Error('Failed!');
    //       }
    //       return res.json();
    //     })
    //     .then(resData => {
    //       const bookings = resData.data.bookings;
    //   // this.setState({ bookings: bookings, isLoading: false });
    //      setBookings(bookings)
    //      setLoading(false)
    //       console.log(resData) 
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // }

     // eslint-disable-line react-hooks/exhaustive-deps

      const  deleteBookingHandler = (bookingId) => {
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
    
        fetch(`${process.env.REACT_APP_API}`, {
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
      

      const  changeOutputTypeHandler = (outputType) => {
        if(outputType === 'list')
        {
          // this.setState({outputType: 'list'});
          setOutPutType('list')
        } else 
        {
          // this.setState({outputType: 'chart'});
          setOutPutType('chart')
        }
      }


    
    
        return (
          <>
             <ul>
               {
                 isLoading 
                 ?
                 <Spinner /> :
                <>
                <BookingsControls
                      activeOutputType={outPutType}
                      onChange={changeOutputTypeHandler}
                    />

                    <div>
                      {outPutType === 'list' 
                      ? 
                      (
                      <BookingList
                        bookings={bookings}
                        onDelete={deleteBookingHandler}
                      />
                      ) : (
                    <BookingChart
                      bookings={bookings}
                    />
                      )}
                    </div>
                </>
                
                }
             </ul>
            
           </>

        );
    }



export default Bookings;