// Firebase Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
getStorage,
ref as storageRef,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDnrjs5t1HJU9SCHg7gznPSsveEbRLpHans",
  authDomain: "ps-smartphone-shop.firebaseapp.com",
  databaseURL: "https://ps-smartphone-shop-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ps-smartphone-shop",
  storageBucket: "ps-smartphone-shop.firebasestorage.app",
  messagingSenderId: "255669720374",
  appId: "1:255669720374:web:3f877e01751fb8b2688f97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// BOOK NOW
function bookNow() {

  let name = document.querySelector('input[placeholder="Full Name"]').value;
  let mobile = document.querySelector('input[placeholder="Mobile Number"]').value;
  let device = document.querySelector('select').value;

  if (name == "" || mobile == "" || device == "Select Device") {
    alert("Please fill all required details first");
    return;
  }

  let id = "PSR-" + Math.floor(Math.random() * 900000 + 100000);

  // Save to Firebase
  let problem = document.querySelector('textarea').value;
let image = document.querySelector('input[type="file"]').files[0];
let imageURL = image ? URL.createObjectURL(image) : "";

  set(ref(db, 'bookings/' + id), {
    bookingId: id,
    name: name,
    mobile: mobile,
    device: device,
    problem:problem,
    image:imageURL,
    status: "Pending",
    date:new Date().toLocaleString()
  });

  document.getElementById("bookingId").innerHTML = id;
  document.getElementById("confirmBox").style.display = "block";
}

// TRACK
function trackNow() {

 let bookingId = document.getElementById("trackInput").value;

 if (bookingId == "") {
   alert("Enter Booking ID");
   return;
 }

 get(ref(db, 'bookings/' + bookingId))
 .then((snapshot) => {

   if (snapshot.exists()) {

     let data = snapshot.val();

     document.getElementById("statusBox").style.display = "block";
     document.getElementById("statusBox").innerHTML =
     "Repair Status: <b>" + data.status + "</b>";

   } else {

     alert("Booking ID not found");

   }

 });
}
window.bookNow = bookNow;
window.trackNow = trackNow;

document.getElementById("confirmBtn")
.addEventListener("click", bookNow);

window.deleteBooking = function(id){
    console.log("Delete Clicked:", id);

    if(confirm("Delete booking?")){
        remove(ref(db, "bookings/" + id))
        .then(()=>{
            alert("Booking Deleted");
            location.reload();
        })
        .catch((error)=>{
            console.log(error);
            alert(error.message);
        });
    }
}