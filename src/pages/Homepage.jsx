// import React from 'react'; // Import necessary modules from React
// import io from 'socket.io-client'; // Import the socket.io client library

// // Establish a socket connection to the server at the specified URL
// const socket = io.connect('http://localhost:3000');

// export default function App() {

//   // Function to send a message
//   const sendMessage = async () => {

//     // Emit a socket event with the message details
//     socket.emit("send_message", {
//       senderId: "123",     // ID of the sender
//       receiverId: "456", // ID of the receiver
//       message: "Bang ufdah bang"   // The actual message content
//     });

//   }

//   return (
//     <div>
//        <button onClick={sendMessage}>send message</button> {/* Button to trigger sending a message */}
//     </div>
//   );
// }
