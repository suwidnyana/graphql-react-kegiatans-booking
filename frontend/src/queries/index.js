import { gql } from '@apollo/client';


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


  const getBookingsQuery =  gql`
  {
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
  `;

  const addEventMutation = gql`
    mutation AddEventData($judul: String!, $deskripsi: String!, $harga: Float!, $date: String!){
      buatEvent(judul: $judul, deskripsi: $deskripsi, harga: $harga, date: $date){
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
;




  export {getEventsQuery, getBookingsQuery, addEventMutation};