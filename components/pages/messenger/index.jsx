"use client";

import { useSession } from "next-auth/react";
import { useMessages, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import useMessenger from "@/hooks/useMessenger";

const MessengerPage = ({ locale }) => {
  const t = useTranslations("messenger");
  const { data: session } = useSession();

  const { data: messengerData, functions } = useMessenger(
    "messenger",
    session,
    locale,
  );

  const threads = messengerData?.threads || [];
  let selectedThread = messengerData?.selectedThread || null;
  let setselectedThread = messengerData?.setselectedThread || null;
  let messages = messengerData?.messages || [];
  messages = messages.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );
  const property = messengerData?.property || null;
  const propertyLoading = messengerData?.propertyLoading || false;

  console.log("messengerData", messengerData);

  const [newMessage, setNewMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);

  const middleSectionRef = useRef(null);

  const { data } = useMessenger("messages");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setselectedThread(threads[0]);
        setIsMobileView(true);
      } else {
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      functions.sendMessage({
        thread_id: selectedThread.thread_id,
        content: newMessage,
        type: "text",
        sender: {
          email: session.user.email,
          username: session.user.username || session.user.name,
        },
        recipient: {
          email:
            session.user.email === selectedThread.owner.email
              ? selectedThread.user.email
              : selectedThread.owner.email,
          username:
            session.user.email === selectedThread.owner.email
              ? selectedThread.user.username
              : selectedThread.owner.username,
        },
      });
      setNewMessage("");
    }
  };

  const handlethreadselect = (thread) => {
    setselectedThread(thread);
    setIsMobileView(true);

    if (middleSectionRef.current) {
      middleSectionRef.current.classList.add("show-middle");
      setTimeout(() => {
        middleSectionRef?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  };

  const handleBack = () => {
    setIsMobileView(false);
    setselectedThread(null);
    if (middleSectionRef.current) {
      middleSectionRef.current.classList.remove("show-middle");
    }
  };

  return (
    <>
      <div
        className="container-fluid border-top d-flex flex-row"
        style={{ height: "calc(100vh - 90px)" }}
      >
        {/* Left Section */}
        <div
          className={`col-12 overflow-hidden col-md-3 bg-white border-end p-3 d-flex flex-column ${isMobileView ? "d-none" : ""}`}
          style={{ height: "calc(100vh - 90px)" }}
        >
          <div className="p-3 border-bottom position-relative">
            <input
              type="text"
              className="form-control pe-5"
              placeholder="Search by Username / Email"
              aria-label="Search"
              style={{ border: "1px solid #ccc", padding: "10px" }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search position-absolute"
              style={{
                top: "50%",
                right: "30px",
                transform: "translateY(-50%)",
              }}
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </div>
          <div className="flex-grow-1 overflow-y-auto">
            <ul className="list-group overflow-hidden">
              {threads.map((thread) => (
                <li
                  key={thread.thread_id}
                  className={`list-group-item list-group-item-action p-2 ${selectedThread?.thread_id === thread.thread_id ? "bg-light" : ""}`}
                  style={{
                    backgroundColor:
                      selectedThread?.thread_id === thread.thread_id
                        ? "#eff0f8"
                        : "#fff",
                  }}
                  onClick={() => handlethreadselect(thread)}
                >
                  <div className="d-flex align-items-center">
                    <div>
                      <strong>{thread.name}</strong>
                      <div className="text-muted text-wrap">
                        {thread.lastMessage.slice(0, 40) + "..."}
                      </div>
                    </div>
                  </div>

                  <Link href={`/${locale}/listings/${thread.dwelling_slug}`}>
                    <p
                      className="mt-2 text-muted
                      text-underline-hover text-wrap
                      "
                    >
                      {thread.dwelling_title}
                    </p>
                  </Link>
                  <div
                    className="mt-auto text-end text-muted"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {thread.created_at}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Section */}
        <div
          ref={middleSectionRef || null}
          className={`col-12 col-md-6 bg-light d-flex flex-column ${isMobileView || selectedThread ? "" : "d-none"}`}
          style={{
            backgroundColor: "#eff0f8",
            transition: "opacity 0.3s ease-in-out",
            opacity: isMobileView || selectedThread ? 1 : 0,
          }}
        >
          {selectedThread && (
            <>
              <div className="d-flex p-2 align-items-center mt-2 border-bottom pb-2">
                <button
                  className="btn  d-md-none"
                  onClick={handleBack}
                  style={{
                    padding: "5px",
                    borderRadius: "10px",
                    marginRight: "5px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                    />
                  </svg>
                </button>
                <strong>{selectedThread.name}</strong>
              </div>

              <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
                {messages.map((chat, index) => (
                  <div
                    key={index}
                    className={`mb-3 d-flex ${chat.direction === "sent" ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "10px",
                        borderRadius: "10px",
                        display: "inline-block",
                        fontSize: "0.875rem",
                        backgroundColor:
                          chat.direction === "sent" ? "#e0e2ef" : "#fff",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <p
                        className="mb-0"
                        style={{
                          margin: 0,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {chat.message}
                      </p>
                      <div
                        className="text-end text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {chat.time}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messengerData.scrollRef}></div>
              </div>

              <div
                className="p-3 d-flex align-items-center"
                style={{
                  position: "relative",
                  height: "180px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  background: "white",
                  marginBottom: "15px",
                  marginLeft: "15px",
                  marginRight: "15px",
                }}
              >
                {/* Scrollable container */}
                <div
                  style={{
                    flex: "1",
                    overflowY: "auto", // Scrollable
                    padding: "10px",
                    marginBottom: "35px", // Space for the button
                  }}
                >
                  <textarea
                    className=""
                    placeholder="Write your message"
                    aria-label="Message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      outline: "none",
                      resize: "none",
                      background: "transparent",
                      // overflow: "hidden",
                    }}
                  ></textarea>
                </div>

                {/* Fixed Button */}
                <button
                  className="btn btn-primary"
                  onClick={handleSendMessage}
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    height: "40px",
                    padding: "0 15px",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ marginRight: "6px" }}>Send</span>
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
          )}
        </div>

        {property &&
          selectedThread &&
          selectedThread.dwelling_title === property.title &&
          !propertyLoading && (
            <div className="col-md-3 bg-white border-end d-flex align-items-center flex-column p-3 d-none d-md-block">
              {property.image_url && (
                <img
                  src={property.image_url}
                  alt="Property Image"
                  className="img-fluid mb-3"
                  style={{ width: "400px", height: "200px" }}
                />
              )}
              {property?.title && (
                <Link
                  href={`/${locale}/listings/${selectedThread.dwelling_slug}`}
                >
                  <h5 className="text-center text-18 fw-500 text-underline-hover">
                    {property.title}
                  </h5>
                </Link>
              )}
              {property?.location && <p>{property.location}</p>}
            </div>
          )}
      </div>

      <style jsx>
        {`
          @media (max-width: 768px) {
            /* Initially hide the middle section off-screen */
            .col-md-6 {
              padding: 0 !important; /* Remove any padding */
              margin: 0 !important; /* Remove any margin */
              width: 100%;
              order: 1; /* Ensure the middle section stays above */
              transform: translateX(100%); /* Start off-screen to the right */
              transition: transform 0.1s ease-out; /* Slider effect */
            }

            /* When middle section is visible, slide it in */
            .show-middle {
              transform: translateX(0); /* Slide in */
            }

            /* Optionally, hide the left section when viewing the middle section */
            .d-none {
              display: none !important;
            }
            .container-fluid {
              padding: 0 !important; /* Remove padding from the container */
            }
          }
        `}
      </style>
    </>
  );
};

export default MessengerPage;
