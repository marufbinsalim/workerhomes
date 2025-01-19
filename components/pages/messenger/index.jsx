"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Link from "next/link";

const MessengerPage = ({ locale }) => {
  const t = useTranslations("messenger");
  const { data: session } = useSession();

  // Dummy Data for Users, Chats, and Property
  const users = [
    { id: 1, name: "John", image: "https://randomuser.me/api/portraits/men/1.jpg", lastMessage: "Hello!", date: "2025-01-19" },
    { id: 2, name: "Anney", image: "https://randomuser.me/api/portraits/women/1.jpg", lastMessage: "How are you?", date: "2025-01-18" },
    { id: 3, name: "Dube", image: "https://randomuser.me/api/portraits/men/3.jpg", lastMessage: "Let's meet up!", date: "2025-01-17" },
  ];

  const initialChats = [
    { sender: "User 1", message: "Hey, how's it going?", time: "10:30 AM", direction: "received" },
    { sender: "User 2", message: "What's up?", time: "10:31 AM", direction: "sent" },
    { sender: "User 1", message: "Just working on a project!", time: "10:32 AM", direction: "received" },
  ];

  const propertyDetails = {
    image: "/image.png",
    title: "Beautiful Apartment",
    address: "123 Main St, Cityville",
  };

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [chats, setChats] = useState(initialChats);
  const [newMessage, setNewMessage] = useState("");

 

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sentMessage = {
        sender: "You",
        message: newMessage,
        time: currentTime,
        direction: "sent"
      };
      setChats([...chats, sentMessage]);
      setNewMessage("");
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (chats[user.id]) {
      setChats(chats); 
    }
  };



  return (
    <>
      <div className="container-fluid border-top d-flex flex-row" style={{ height: "90vh" }}>
        {/* Left Section */}
        <div
          className="col-3 bg-white border-end p-3 d-flex justify-content-center flex-column"
          style={{ overflowY: "auto" }}
        >
          <div className="p-3 border-bottom position-relative">
            <input
              type="text"
              className="form-control pe-5"
              placeholder="Search in my messages"
              aria-label="Search"
              style={{ border: '1px solid #ccc', padding: '10px' }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search position-absolute" style={{ top: '50%', right: '30px', transform: 'translateY(-50%)' }} viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </div>
          <div className="flex-grow-1">
            <ul className="list-group">
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`list-group-item list-group-item-action p-2 ${selectedUser?.id === user.id ? 'bg-light' : ''}`}
                  style={{ backgroundColor: selectedUser?.id === user.id ? "#eff0f8" : "#fff" }}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="d-flex align-items-center">
                    <img src={user.image} alt={user.name} className="rounded-circle me-3" width="50" height="50" />
                    <div>
                      <strong>{user.name}</strong>
                      <div className="text-muted">{user.lastMessage}</div> 
                    </div>
                  </div>

                  <p className="mt-2 text-muted">{propertyDetails.title}</p>

                  <div className="mt-auto text-end text-muted" style={{ fontSize: '0.75rem' }}>
                    {user.date} 
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>


        <div
          className="col-6 bg-light border-end d-flex flex-column"
          style={{ backgroundColor: "#eff0f8" }}
        >
          {selectedUser ? (
            <>
              <div className="p-2 border-bottom">
                <div className="d-flex align-items-center">
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <strong>{selectedUser.name}</strong>
                </div>
              </div>
              <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
                {chats.map((chat, index) => (
                  <div key={index} className={`mb-3 d-flex ${chat.direction === 'sent' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "10px",
                        borderRadius: "10px",
                        display: "inline-block",
                        wordWrap: "break-word",
                        fontSize: "0.875rem",
                        backgroundColor: chat.direction === 'sent' ? "#e0e2ef" : "#fff"

                      }}
                    >
                      <p className="mb-0">{chat.message}</p>
                      <div className="text-end text-muted" style={{ fontSize: '0.75rem' }}>
                        {chat.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 d-flex align-items-center" style={{ position: 'relative' }}>
                <textarea
                  className="form-control"
                  placeholder="Write your message"
                  aria-label="Message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)} 
                  style={{
                    background: 'white',
                    border: '1px solid #ccc',
                    padding: '15px',
                    borderRadius: '10px',
                    flex: '1',
                    resize: 'none', 
                    height: '140px',
                    marginBottom: '20px',
                  }}
                ></textarea>

                <button
                  className="btn btn-primary ms-2"
                  onClick={handleSendMessage}
                  style={{
                    position: 'absolute',
                    bottom: '50px', 
                    right: '30px', 
                    height: '40px',
                    padding: '0 15px',
                    borderRadius: '10px',
                  }}
                >
                  <span style={{ marginRight: '6px' }}>Send</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-send"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.356 3.748 3.038-7.457-3.773 1.033-2.047 2.457Z" />
                  </svg>
                </button>
              </div>
            </>
        ) : (
          <div className="flex-grow-1 p-3 d-flex justify-content-center align-items-center">
            <p>Select a user to start chatting</p>
          </div>
        )}
        </div>

        <div
          className="col-3 bg-white d-flex ustify-content-start flex-column align-items-center p-3"
        >
          <div className="d-flex flex-column align-items-center">
            <img
              src={propertyDetails.image}
              alt="Property"
              className="img-fluid mb-3"
              style={{ borderRadius: "10px", width: "400px", height: "240px" }}
            />
            <h5 className="text-center">{propertyDetails.title}</h5>
            <p className="text-center">{propertyDetails.address}</p>
            <button className="btn btn-secondary">View Property Details</button>
          </div>
        </div>

      </div>
    </>
  );
};

export default MessengerPage;
