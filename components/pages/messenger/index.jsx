"use client";

import { useSession } from "next-auth/react";
import { useMessages, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import useMessenger from "@/hooks/useMessenger";
import { ImageUpload } from "ckeditor5";
import PricingCard from "@/components/common/card/price-card";
import { useSearchParams } from "next/navigation";

const MessengerPage = ({ locale }) => {
  const t = useTranslations("messenger");
  const { data: session } = useSession();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPhoneScreen, setIsPhoneScreen] = useState(true);
  const [threadID, setThreadId] = useState(null);

  const searchParams = useSearchParams();
  useEffect(() => {
    let thread_id = searchParams.get("thread") || null;
    setThreadId(thread_id);
  }, [searchParams]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsPhoneScreen(true);
    } else {
      setIsPhoneScreen(false);
    }
  }, []);

  const { data: messengerData, functions } = useMessenger(
    "messenger",
    threadID,
    selectedFilter,
    searchQuery,
    isPhoneScreen,
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

  const [newMessage, setNewMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);

  const middleSectionRef = useRef(null);

  const { data } = useMessenger("messages");
  const [imageFile, setImageFile] = useState(null); // New state for image file

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 8 * 1024 * 1024) {
      // Check for max size of 8MB
      setImageFile(file);
    } else {
      alert("Image size should not exceed 8MB.");
    }
    event.target.value = null; // Reset the input field after selecting the image
  };

  const handleImageRemove = () => {
    setImageFile(null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !imageFile) return; // Prevent sending empty messages

    let imageUrl = null;

    // Send both image and text together if both are present
    if (imageFile || newMessage.trim()) {
      const response = await functions.sendMessage({
        thread_id: selectedThread.thread_id,
        content: newMessage.trim(), // Include the text content here
        type: imageFile ? "image_and_text" : "text", // Use a type that handles both image and text
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
        imageFile: imageFile || null, // Include the image file if present
      });

      // If an image was uploaded, get the image URL from the response
      if (imageFile) {
        imageUrl = response.imageUrl;
      }
    }

    setImageFile(null); // Clear the image after sending
    setNewMessage(""); // Clear the text input after sending

    let polishListingTitle = selectedThread.dwelling_titles.find(
      (title) => title.locale === "pl",
    )?.value;

    let polishSlug = selectedThread.dwelling_slugs.find(
      (slug) => slug.locale === "pl",
    )?.value;

    let span = `<a href="https://workerhomes-two.vercel.app/pl/listings/${polishSlug}"
  style="color: #ff5a5f; font-weight: bold; text-decoration: none;">${polishListingTitle}</a>`;

    let html = `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px 20px; text-align: center;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://lrfrmfqpppxjbxetsgcu.supabase.co/storage/v1/object/public/chat-images//test.webp"
          alt="Workerhomes" style="max-width: 200px; display: block; margin: 0;"/>
      </div>

      <!-- Title (Listing Name) -->
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">You have recieved a new message in Workerhomes for ${span}</h2>

      <!-- Reply Name -->
      <p style="font-size: 16px; font-weight: bold; color: #555;"> ${selectedThread.name} </p>

      <!-- Message Content -->
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        ${
          newMessage
            ? `<p style="margin: 0; font-size: 14px; color: #333;">${newMessage}</p>`
            : ""
        }
      </div>

      <!-- Image (if any) -->
      ${
        imageUrl
          ? `
        <div style="margin-bottom: 20px; text-align: center;">
          <img src="${imageUrl}" alt="Sent image" style="max-width: 40%; border-radius: 8px; border: 1px solid #ccc; padding: 5px;"/>
        </div>
      `
          : ""
      }

      <!-- Button -->
      <div style="text-align: center;">
        <a href="https://workerhomes-two.vercel.app/${locale}/dashboard/messenger?thread=${
          selectedThread.thread_id
        }"
          style="display: inline-block; background-color: #ff5a5f; color: white; text-decoration: none; padding: 12px 20px;
          border-radius: 5px; font-size: 16px; margin-top: 20px;">
          Reply to the chat
        </a>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; width: 600px;">

          <!-- Left side: Logo + Company Address -->
          <div style="text-align: left;">
            <img src="https://lrfrmfqpppxjbxetsgcu.supabase.co/storage/v1/object/public/chat-images//test.webp"
              alt="Workerhomes" style="max-width: 100px;"/>
            <p style="font-size: 12px; color: #888; margin-top: 5px;">123 Placeholder Street, City, Country</p>
          </div>

          <!-- Right side: Social Media Icons -->
          <div style="display: flex; margin-left: auto; gap: 10px;">
            <a href="https://facebook.com" style="text-decoration: none; margin-left: 10px;">
              <img src="https://cdn-icons-png.flaticon.com/512/145/145802.png" alt="Facebook" width="20"/>
            </a>
            <a href="https://instagram.com" style="text-decoration: none; margin-left: 10px;">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="20"/>
            </a>
            <a href="https://x.com" style="text-decoration: none; margin-left: 10px;">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="X" width="20"/>
            </a>
          </div>

        </div>
      </div>
    </div>
  </div>
`;

    // Sending the email
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to:
          session.user.email === selectedThread.owner.email
            ? selectedThread.user.email
            : selectedThread.owner.email,
        from: {
          email: `${selectedThread.thread_id}@parse.workerhomes.pl`,
          name: "Workerhomes",
        },
        subject: `RE: You received a new message from Workerhomes for "${polishListingTitle}"`,
        text: imageUrl
          ? imageUrl + (newMessage ? `\n\n${newMessage}` : "")
          : newMessage,
        html: html,
      }),
    });
  };

  const handlethreadselect = (thread) => {
    setselectedThread(thread);
    setIsMobileView(true);

    if (middleSectionRef.current) {
      middleSectionRef.current.classList.add("show-middle");
      setTimeout(() => {
        middleSectionRef?.current?.scrollIntoView({
          // behavior: "smooth",
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
        className="d-flex flex-row"
        style={{
          height: "calc(100vh - 90px)",
        }}
      >
        {/* Left Section */}
        <div
          className={`col-12 overflow-hidden col-md-3 bg-white d-flex flex-column ${
            isMobileView ? "d-none " : ""
          }`}
          style={{ height: "calc(100vh - 90px)" }}
        >
          <div
            className="p-1 d-flex align-items-center"
            style={{
              borderTop: "1px solid #E5E7EB",
            }}
          >
            <h4
              className={`me-3 pl-10 ${isSearchExpanded ? "d-none" : ""}`}
              style={{ flex: 1 }}
            >
              {t("title")}
            </h4>

            <div className="position-relative flex-grow-1 mb-2">
              <input
                type="text"
                placeholder="Search"
                aria-label="Search"
                className={`search-input ${
                  isSearchExpanded ? "show-searchbar" : "hide-searchbar"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

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

          <div className="d-flex mb-3 pl-10">
            <button
              className={`btn px-6 py-1 ${
                selectedFilter === "all" ? "btn-black" : "btn-white"
              }`}
              onClick={() => setSelectedFilter("all")}
              style={{
                backgroundColor: selectedFilter === "all" ? "black" : "white",
                color: selectedFilter === "all" ? "white" : "black",
                border: "1px solid #D1D5DB",
                borderRadius: "16px",
                fontSize: "14px",
                padding: "6px 18px",
              }}
            >
              {t("all")}
            </button>
            <button
              className={`btn px-3 py-1 ${
                selectedFilter === "unread" ? "btn-black" : "btn-white"
              }`}
              onClick={() => setSelectedFilter("unread")}
              style={{
                backgroundColor:
                  selectedFilter === "unread" ? "black" : "white",
                color: selectedFilter === "unread" ? "white" : "black",
                border: "1px solid #D1D5DB",
                borderRadius: "16px",
                fontSize: "14px",
                padding: "6px 12px",
                marginLeft: "8px",
              }}
            >
              {t("unread")}
            </button>
          </div>

          <div className="flex-grow-1 overflow-y-auto">
            <ul className="list-group overflow-hidden">
              {[...threads]
                .toSorted(
                  (a, b) =>
                    new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
                )
                .map((thread) => {
                  const isUnread = !thread.seen;
                  return (
                    <li
                      key={thread.thread_id}
                      className={`list-group-item list-group-item-action border-0 rounded ${
                        selectedThread?.thread_id === thread.thread_id
                          ? "selected-bg"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          selectedThread?.thread_id === thread.thread_id
                            ? "#f7f7f7"
                            : "#fff",
                      }}
                      onClick={() => handlethreadselect(thread)}
                    >
                      <div className="d-flex align-items-center">
                        <div style={{ width: "100%" }}>
                          <div className="d-flex align-items-center justify-content-between w-100">
                            <h5
                              className="mt-2 fw-500 text-truncate"
                              style={{
                                maxWidth: "70%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={thread.dwelling_title}
                            >
                              {thread.dwelling_title}
                            </h5>
                            <p>
                              {new Date(
                                thread.lastMessageTime,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ width: "100%" }}>
                            <strong>{thread.name}</strong>
                          </div>
                          <div className="text-muted text-wrap">
                            {thread?.lastMessage?.includes("https")
                              ? "Attachment"
                              : thread.lastMessage.slice(0, 40) + "..."}
                          </div>
                        </div>
                      </div>

                      <div
                        className="mt-auto text-end "
                        style={{ fontSize: "0.75rem" }}
                      >
                        {isUnread ? (
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              backgroundColor: "blue",
                              borderRadius: "50%",
                              display: "inline-block",
                            }}
                          ></span>
                        ) : (
                          <p
                            className="mb-0 text-muted"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {thread.status}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>

        {/* Middle Section */}
        <div
          ref={middleSectionRef || null}
          className={`col-12 col-md-6 d-flex flex-column ${
            isMobileView || selectedThread ? "" : "d-none"
          }`}
          style={{
            opacity: isMobileView || selectedThread ? 1 : 0,
            borderLeft: ".5px solid #E5E7EB",
            borderRight: ".5px solid #E5E7EB",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          {selectedThread && (
            <>
              <div className="d-flex p-3 align-items-center  border-bottom ">
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
                    style={{
                      transform: "scale(1.2)",
                      fontWeight: "bold",
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                    />
                  </svg>
                </button>
                <strong>{selectedThread.name}</strong>
              </div>

              <div
                className="p-2 mobile-only "
                style={{
                  borderBottom: "1px solid #E5E7EB",
                  backgroundColor: "#EFEFEF",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(233, 233, 233, 0.1)",
                }}
              >
                {property &&
                  selectedThread.dwelling_title === property.title && (
                    <div
                      className="d-flex align-items-center text-start"
                      style={{
                        gap: "10px",
                        flexWrap: "wrap",
                        position: "relative",
                      }}
                    >
                      {property.image_url && (
                        <img
                          src={property.image_url}
                          alt="Property Image"
                          className="img-fluid"
                          style={{
                            width: "80px",
                            height: "60px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                            flexShrink: 0,
                            minWidth: "80px",
                          }}
                        />
                      )}
                      <h6
                        className="mb-0 "
                        style={{
                          wordBreak: "break-word",
                          flex: 1,
                          whiteSpace: "normal",
                          position: "relative",
                          width: "80%",
                          maxWidth: "calc(100% - 90px)",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginRight: "30px",
                        }}
                      >
                        {property.title}
                      </h6>
                      <Link
                        href={`/${locale}/listings/${selectedThread.dwelling_slug}`}
                        style={{
                          position: "absolute",
                          right: "0",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "18px",
                          color: "#333",
                          textDecoration: "none",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-chevron-right"
                          viewBox="0 0 16 16"
                          style={{
                            transform: "scale(1.5)",
                            fontWeight: "bold",
                          }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0L10.293 8l-5.647 5.646a.5.5 0 0 1-.708-.708l5-5a.5.5 0 0 1 0-.708l-5-5a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </Link>
                    </div>
                  )}
              </div>

              <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
                {messages.map((chat, index) => {
                  let imageUrl = null;
                  let textContent = null;

                  if (chat.type === "image_and_text") {
                    try {
                      const parsedContent = JSON.parse(chat.message);
                      textContent = parsedContent.text;
                      imageUrl = parsedContent.imageUrl;
                    } catch (error) {
                      console.error("Error parsing message content:", error);
                    }
                  }

                  return (
                    <div
                      key={index}
                      className={`mb-3 d-flex ${
                        chat.direction === "sent"
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div
                        style={{
                          maxWidth: "60%",
                          padding:
                            chat.type === "image" ||
                            chat.type === "image_and_text"
                              ? "0"
                              : "0",
                          borderRadius:
                            chat.type === "image" ||
                            chat.type === "image_and_text"
                              ? "0"
                              : "10px",
                          display: "inline-block",
                          fontSize: "0.875rem",
                          backgroundColor: "transparent",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap",
                          textAlign: "left",
                        }}
                      >
                        {/* Render image if type is "image" or "image_and_text" */}
                        {(chat.type === "image" ||
                          chat.type === "image_and_text") && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems:
                                chat.direction === "sent"
                                  ? "flex-end"
                                  : "flex-start",
                            }}
                          >
                            <img
                              src={
                                chat.type === "image" ? chat.message : imageUrl
                              }
                              alt="Sent image"
                              style={{
                                maxWidth: "40%",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                display: "block",
                                border: "1px solid #ccc",
                                padding: "5px",
                                marginBottom: "5px",
                              }}
                              onClick={() =>
                                window.open(
                                  chat.type === "image"
                                    ? chat.message
                                    : imageUrl,
                                  "_blank",
                                )
                              }
                            />

                            {/* Render text if type is "image_and_text" */}
                            {chat.type === "image_and_text" && (
                              <div
                                style={{
                                  backgroundColor:
                                    chat.direction === "sent"
                                      ? "#d1e7ff"
                                      : "#f1f1f1",
                                  padding: "10px",
                                  borderRadius: "10px",
                                  width: "max-content",
                                  maxWidth: "100%",
                                }}
                              >
                                <p className="mb-0">{textContent}</p>
                                {/* Render timestamp */}
                                <div
                                  className={`text-muted ml-auto ${
                                    chat.direction !== "sent"
                                      ? "text-start"
                                      : "text-end"
                                  }`}
                                  style={{
                                    fontSize: "0.75rem",
                                    width: "100%",
                                  }}
                                >
                                  {chat.time}
                                </div>
                              </div>
                            )}

                            {chat.type === "image" && (
                              <div
                                style={{
                                  borderRadius: "10px",
                                  width: "max-content",
                                  maxWidth: "100%",
                                }}
                              >
                                {/* Render timestamp */}
                                <div
                                  className={`text-muted ml-auto ${
                                    chat.direction !== "sent"
                                      ? "text-start"
                                      : "text-end"
                                  }`}
                                  style={{
                                    fontSize: "0.75rem",
                                    width: "100%",
                                  }}
                                >
                                  {chat.time}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Render text if type is "text" */}
                        {chat.type === "text" && (
                          <div
                            style={{
                              backgroundColor:
                                chat.direction === "sent"
                                  ? "#d1e7ff"
                                  : "#f1f1f1",
                              padding: "10px",
                              borderRadius: "10px",
                              width: "max-content",
                              maxWidth: "100%",
                            }}
                          >
                            <p className="mb-0">{chat.message}</p>
                            <div
                              className={`text-muted ml-auto ${
                                chat.direction !== "sent"
                                  ? "text-start"
                                  : "text-end"
                              }`}
                              style={{
                                fontSize: "0.75rem",
                                width: "100%",
                              }}
                            >
                              {chat.time}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={messengerData.scrollRef}></div>
              </div>

              <div className="p-3">
                <div
                  className="position-relative d-flex align-items-center"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    backgroundColor: "#fff",
                    height: "140px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <label
                    htmlFor="imageUpload"
                    className="me-2"
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      className="bi bi-card-image"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                      <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
                    </svg>
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />

                  {imageFile && (
                    <div
                      className="position-absolute"
                      style={{
                        top: "10px",
                        left: "10px",
                        width: "70px",
                        height: "70px",
                        // backgroundImage: `url(${URL.createObjectURL(imageFile)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Sent image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                      <span
                        onClick={handleImageRemove}
                        style={{
                          position: "absolute",
                          top: "1px",
                          right: "1px",
                          background: "red",
                          color: "white",
                          borderRadius: "50%",
                          cursor: "pointer",
                          width: "18px",
                          height: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold",
                          border: "2px solid white",
                          zIndex: 10,
                        }}
                      >
                        ✕
                      </span>
                    </div>
                  )}

                  <textarea
                    className="flex-grow-1"
                    placeholder={imageFile ? "" : t("write")}
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value.slice(0, 4096));
                    }}
                    style={{
                      width: "100%",
                      maxHeight: "70px",
                      height: "auto",
                      border: "none",
                      outline: "none",
                      resize: "none",
                      paddingLeft: imageFile ? "85px" : "12px",
                      paddingRight: "20px",
                      background: "transparent",
                      textAlign: "left",
                      overflowY: "auto",
                      marginBottom: "40px",
                      position: "absolute",
                      top: "10px",
                      left: imageFile ? "10px" : "5px",
                      right: "10px",
                    }}
                  />

                  <div
                    className="d-flex align-items-center"
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      display: "flex",
                      width: "max-content",
                      gap: "10px",
                    }}
                  >
                    <div
                      className="text-muted"
                      style={{
                        fontSize: "0.75rem",
                        textAlign: "right",
                        width: "max",
                      }}
                    >
                      {newMessage.length}/4096
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={handleSendMessage}
                      disabled={newMessage.length === 0 && !imageFile}
                      style={{
                        height: "40px",
                        padding: "0 15px",
                        borderRadius: "10px",
                      }}
                    >
                      <span style={{ marginRight: "6px" }}>{t("send")}</span>
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
                </div>
              </div>
            </>
          )}
        </div>

        {property &&
          selectedThread &&
          selectedThread.dwelling_title === property.title &&
          !propertyLoading && (
            <div
              className="col-md-3 bg-white border-end d-flex flex-column p-4 d-none d-md-block"
              style={{
                height: "calc(100vh - 90px)",
                overflowY: "auto",
                borderTop: "1px solid #E5E7EB",
              }}
            >
              {property?.title && (
                <h4 className=" text-start mb-10 fw-500">{property.title}</h4>
              )}
              <Link
                href={`/${locale}/listings/${selectedThread.dwelling_slug}`}
              >
                {property.image_url && (
                  <img
                    src={property.image_url}
                    alt="Property Image"
                    className="img-fluid mb-3 property-image"
                    style={{
                      width: "400px",
                      height: "200px",
                      borderRadius: "10px",
                      boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
                      transition: "transform 0.4s ease-in-out",
                    }}
                  />
                )}
              </Link>

              {property?.data?.prices?.length > 0 && (
                <div
                  style={{
                    width: "100%",
                    padding: "0px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  {property?.data?.prices?.length > 0 &&
                    property?.data?.prices.map((p, idx) => (
                      <PricingCard
                        key={idx}
                        adults={p.adult}
                        amountNote={p.note}
                        guests={p.guest}
                        minStay={p.min_stay}
                        price={p.amount}
                        type={p.total ? `${p.total} X ${p.type}` : p.type}
                      />
                    ))}
                </div>
              )}
              {property?.location && (
                <p className="mx-auto">{property.location}</p>
              )}
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

          .show-searchbar {
            width: calc(100% - 70px); /* Adjust based on padding/margins */
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

          /* View Details Button */
          .view-details-button {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 10px;
            padding: 10px;
            padding-top: 5px;
            padding-bottom: 5px;
            cursor: pointer;
            width: 80%;
            margin-left: auto;
            margin-right: auto;
            margin-top: 10px;
            background-color: #ff7504;
          }

          .property-image:hover {
            transform: scale(1.01);
          }

          @media (max-width: 768px) {
            /* Initially hide the middle section off-screen */
            .col-md-6 {
              padding: 0 !important; /* Remove any padding */
              margin: 0 !important; /* Remove any margin */
              width: 100vw;
              order: 1; /* Ensure the middle section stays above */
            }
               .mobile-only {
                  display: block;
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
            @media (min-width: 769px) {
              .mobile-only {
                  display: none !important; /* Hide elements with this class on larger screens */
              }
        `}
      </style>
    </>
  );
};

export default MessengerPage;
