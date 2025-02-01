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
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const expandSearch = () => {
    setIsSearchExpanded(true); // Only expands, doesn't toggle
  };

  const hideSearch = () => {
    setIsSearchExpanded(false); // Only hides when clicking cancel
  };

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
        className="container-fluid d-flex flex-row mt-1"
        style={{
          height: "calc(100vh - 90px)",
          borderTop: ".5px solid #E5E7EB",
        }}
      >
        {/* Left Section */}
        <div
          className={`col-12 overflow-hidden col-md-3 bg-white p-3 d-flex flex-column ${isMobileView ? "d-none " : ""}`}
          style={{ height: "calc(100vh - 90px)" }}
        >
          <div className="p-1 d-flex align-items-center">
            {/* Messenger Title and Search Box */}
            <h4
              className={`me-3 ${isSearchExpanded ? "d-none" : ""}`}
              style={{ flex: 1 }}
            >
              {t("title")}
            </h4>

            <div className="position-relative flex-grow-1 mb-2">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search"
                aria-label="Search"
                className={`search-input ${isSearchExpanded ? "show-searchbar" : "hide-searchbar"}`}
              />

              {/* Search Icon */}
              <svg
                onClick={expandSearch}
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                className="search-icon bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>

              {/* Cancel Button */}
              {isSearchExpanded && (
                <button
                  className="btn btn-link position-absolute"
                  onClick={hideSearch}
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "1rem",
                    padding: 0,
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons (all/unread) */}
          <div className="d-flex mb-3">
            <button
              className={`btn px-3 ${selectedFilter === "all" ? "btn-black" : "btn-white"}`}
              onClick={() => setSelectedFilter("all")}
              style={{
                backgroundColor: selectedFilter === "all" ? "black" : "white",
                color: selectedFilter === "all" ? "white" : "black",
                border: "1px solid #D1D5DB",
                borderRadius: "20px",
              }}
            >
              All
            </button>
            <button
              className={`btn ${selectedFilter === "unread" ? "btn-black" : "btn-white"}`}
              onClick={() => setSelectedFilter("unread")}
              style={{
                backgroundColor:
                  selectedFilter === "unread" ? "black" : "white",
                color: selectedFilter === "unread" ? "white" : "black",
                border: "1px solid #D1D5DB",
                borderRadius: "20px",
                marginLeft: "10px",
              }}
            >
              Unread
            </button>
          </div>

          <div className="flex-grow-1 overflow-y-auto">
            <ul className="list-group overflow-hidden">
              {threads.map((thread) => (
                <li
                  key={thread.thread_id}
                  className={`list-group-item list-group-item-action border-0 rounded ${selectedThread?.thread_id === thread.thread_id ? "selected-bg" : ""}`}
                  style={{
                    backgroundColor:
                      selectedThread?.thread_id === thread.thread_id
                        ? "#f7f7f7"
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

                  <h5 className="mt-2 fw-500 text-wrap">
                    {thread.dwelling_title}
                  </h5>

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
          className={`col-12 col-md-6 d-flex flex-column ${isMobileView || selectedThread ? "" : "d-none"}`}
          style={{
            opacity: isMobileView || selectedThread ? 1 : 0,
            borderLeft: ".5px solid #E5E7EB",
            borderRight: ".5px solid #E5E7EB",
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
                          chat.direction === "sent" ? "#d1e7ff" : "#f1f1f1",
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
                  height: "120px",
                  border: "1px solid #ccc",
                  borderRadius: "30px",
                  background: "white",
                  marginBottom: "25px",
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
            <div className="col-md-3 bg-white border-end d-flex flex-column p-2 d-none d-md-block">
              {property?.title && (
                <Link
                  href={`/${locale}/listings/${selectedThread.dwelling_slug}`}
                >
                  <h3 className=" text-start fw-400 text-underline-hover">
                    {property.title}
                  </h3>
                </Link>
              )}
              {property.image_url && (
                <img
                  src={property.image_url}
                  alt="Property Image"
                  className="img-fluid mb-3"
                  style={{ width: "400px", height: "200px" }}
                />
              )}

              {property?.location && <p>{property.location}</p>}
            </div>
          )}
      </div>

      <style jsx>
        {`
          /* Search Input - Initially Hidden */
          .search-input {
            width: 0;
            opacity: 0;
            border: 2px solid #ccc;
            border-radius: 50px;
            padding: 0;
            font-size: 14px;
            height: 36px;
            transition:
              width 0.4s ease-in-out,
              opacity 0.3s ease-in-out;
            transform-origin: left;
            transform: scaleX(0);
            position: relative;
          }

          /* Expanded Search Input */
          .show-searchbar {
            width: 80%;
            opacity: 1;
            padding-left: 40px;
            transform: scaleX(1);
          }

          /* Search Icon - Default (Outside) */
          .search-icon {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            cursor: pointer;
            background-color: #f5f5f5;
            padding: 8px;
            border-radius: 50%;
            width: 35px;
            height: 35px;
          }

          /* Move Search Icon Inside the Input When Expanded */
          .show-searchbar ~ .search-icon {
            left: 12px; /* Moves inside the search bar */
            right: auto;
            background: transparent;
            padding: 0;
            color: #666;
            height: 20px;
            width: 20px;
          }

          /* Hide Icon on Collapse */
          .hide-searchbar ~ .search-icon {
            opacity: 1;
            transition: none;
          }

          @media (max-width: 768px) {
            /* Initially hide the middle section off-screen */
            .col-md-6 {
              padding: 0 !important; /* Remove any padding */
              margin: 0 !important; /* Remove any margin */
              width: 100vw;
              order: 1; /* Ensure the middle section stays above */
            }

            /* Optionally, hide the left section when viewing the middle section */
            .d-none {
              display: none !important;
            }
            .container-fluid {
              padding: 0 !important; /* Remove padding from the container */
            }
            .show-searchbar {
              width: 320px; /* Adjust width for mobile view */
            }
          }
        `}
      </style>
    </>
  );
};

export default MessengerPage;
