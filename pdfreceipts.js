const fs = require('fs-extra');
const path = require('path')
const {niceInvoice} = require('./nice-invoice');
let {firebase,firestore,Timesatmp} = require('../config/firebase.pk');

const invoiceDetail = {
    shipping: {
      name: "Micheal",
      address: "1234 Main Street",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      postal_code: 94111
    },
    items: [
      {
        item: "Chair",
        description: "Wooden chair",
        quantity: 1,
        price: 50.00, 
        tax: "10%"
      },
      {
        item: "Watch",
        description: "Wall watch for office",
        quantity: 2,
        price: 30.00,
        tax: "10%"
      },
      {
        item: "Water Glass Set",
        description: "Water glass set for office",
        quantity: 1,
        price: 35.00,
        tax: ""
      }
    ],
    subtotal: 156,
    total: 156,
    order_number: 1234222,
    header:{
        company_name: "School Name",
        company_logo: "logo.png",
        company_address: "123 William Street1th Floor New York, NY 123456"
    },
    footer:{
      text: "motto - A school motto or something "
    },
    currency_symbol:"Ksh", 
    // date: {
    //   billing_date: "08 August 2020",
    //   due_date: "10 September 2020",
    // }
};



const pathUniform ='../public/uniformreceipt/uniformreceipt.pdf'
const pathfee ='../public/uniformreceipt/feereceipts.pdf'
const tripreceipts ='../../public/tripreceipts.pdf'





function makeFeeReceipt(){

  // console.log(transdetails)
  const invoiceDetail = {
    shipping: {
          name: `Marion Starlet`,
          admissionnumber:"234r3",
          grade:"Grade 2",
          term:"term 1",
          stampDate:new Date().toDateString(),
          contact: "padi@gmail.com",
          Means_of_Payment:'MpesaOnline',
      
         
        },
    items: [
      {
             description : "Fee payment",
             reference:"REHHGJ",
             amount:"343" ,
              means: "Mpesa",
              tax: "0%"
      },
     
    
    ],
    subtotal:"40,123",
    total: "30,123",
    order_number: 1234222,
    header:{
            company_name: "Halisi  Academy",
            company_logo: "D:/SilverBaller/Skew/skew/database/pdf/halisibadge-removebg-preview.png",
            company_address: "123 Westlands Road, KE 123456"
        },
        footer:{
          text: "motto - A school motto or something "
        },
    currency_symbol:"", 
    date: {
      Paid_date: new Date().toLocaleDateString(),
      Recorded_date: new Date().toLocaleDateString(),
    }
};

niceInvoice(invoiceDetail, tripreceipts)
console.log('done')
}
makeFeeReceipt()

// makeFeeReceipt()

// firestore.collection('fee_transaction').where('admissionnumber','==','244234RT').orderBy("storedTime",'desc').limit(1).get()
// .then(snap=>{
//   snap.forEach(doc=>{
//     const docdata = doc.data()
//     console.log(doc.data().transId)
//     makeFeeReceipt(docdata)
//     // makereceipt(docdata)
  

// }) 
// })
// .catch(err=>{
//   console.log(err)
// })

module.exports ={makeFeeReceipt}
