"use client";

import { useSession } from "next-auth/react";
import { useMessages, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import useMessenger from "@/hooks/useMessenger";
import { ImageUpload } from "ckeditor5";
import PricingCard from "@/components/common/card/price-card";
import { useSearchParams } from "next/navigation";
import { MdOutlineAttachFile } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";




const MessengerPage = ({ locale }) => {
  const t = useTranslations("messenger");
  const { data: session } = useSession();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPhoneScreen, setIsPhoneScreen] = useState(true);
  const [threadID, setThreadId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isActive, setIsActive] = useState(false); // NEW

  const toggleDetailsModal = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (!showDetailsModal) {
      // Start open process
      setShowDetailsModal(true); // Mount modal first

      setTimeout(() => {
        setIsActive(true); // Trigger entry animation
      }, 20);

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    } else {
      // Start closing
      setIsActive(false); // Remove active class (starts slide-out)

      setTimeout(() => {
        setShowDetailsModal(false); // Unmount after animation
        setIsAnimating(false);
      }, 500);
    }
  };


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
    if (file) {
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(file.type)) {
        alert("Only image files (JPG, PNG, GIF, WEBP) are allowed.");
        event.target.value = null; // Reset input field
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        alert("Image size should not exceed 8MB.");
        event.target.value = null; // Reset input field
        return;
      }
      setImageFile(file);
    }
    event.target.value = null; // Reset input field after selecting the image
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
  style="color: #F59024; font-weight: bold; text-decoration: none;">${polishListingTitle}</a>`;

    let html = `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px 20px; text-align: center;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://lrfrmfqpppxjbxetsgcu.supabase.co/storage/v1/object/public/chat-images//test.png"
          alt="Workerhomes" style="max-width: 200px; display: block; margin: 0;"/>
      </div>

      <!-- Title (Listing Name) -->
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">You have recieved a new message in Workerhomes for ${span}</h2>

      <!-- Reply Name -->
      <p style="font-size: 16px; font-weight: bold; color: #555;"> ${selectedThread.name} </p>

      <!-- Message Content -->
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        ${newMessage
        ? `<p style="margin: 0; font-size: 14px; color: #333;">${newMessage}</p>`
        : ""
      }
      </div>

      <!-- Image (if any) -->
      ${imageUrl
        ? `
        <div style="margin-bottom: 20px; text-align: center;">
          <img src="${imageUrl}" alt="Sent image" style="max-width: 40%; border-radius: 8px; border: 1px solid #ccc; padding: 5px;"/>
        </div>
      `
        : ""
      }

      <!-- Button -->
      <div style="text-align: center;">
        <a href="https://workerhomes-two.vercel.app/${locale}/dashboard/messenger?thread=${selectedThread.thread_id
      }"
          style="display: inline-block; background-color: #F59024; color: white; text-decoration: none; padding: 12px 20px;
          border-radius: 5px; font-size: 16px; margin-top: 20px;">
          Reply to the chat
        </a>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; width: 600px;">

          <!-- Left side: Logo + Company Address -->
          <div style="text-align: left;">
            <img src="https://lrfrmfqpppxjbxetsgcu.supabase.co/storage/v1/object/public/chat-images//test.png"
              alt="Workerhomes" style="max-width: 100px;"/>
            <p style="font-size: 12px; color: #888; margin-top: 5px;">   Workerhomes Placeholder UC,
                  <br/>
                  8 Test Street,
                  <br/>
                  Munich, Germany</p>
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

    let toOwner = session.user.email !== selectedThread.owner.email;
    let emailHeaders = await functions.getEmailHeader(
      selectedThread.thread_id,
      toOwner,
    );

    console.log("Email Headers: ", emailHeaders);

    // Sending the email
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        headers: emailHeaders || {},
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
        className="tw:flex tw:flex-row tw:gap-4 tw:ml-4 tw:mr-4 tw:max-h-[calc(100vh_-_90px)] font-secondary tw:mt-20  tw:bg-white "
      >
        {/* Left Section */}
        <div
          className={`tw:w-full tw:md:w-[600px]  tw:shadow-[4px_0px_16px_0px_rgba(0,0,0,0.06)] tw:flex tw:flex-col ${isMobileView ? "tw:hidden tw:md:flex" : "tw:flex"
            }`}
          style={{ height: "calc(100vh - 90px)" }}
        >
          <div
            className="tw:flex tw:items-center  tw:h-[72px] tw:bg-[#FAFBFC]"
          >
            <h4
              className={`tw:mt-2 tw:font-semibold tw:text-[18px] tw:text-[var(--color-font-regular)] tw:pl-4 ${isSearchExpanded ? "tw:hidden" : ""}`}

            >
              {t("title")}
            </h4>

            <div className="tw:relative tw:flex-grow ">
              <input
                type="text"
                placeholder="Search"
                aria-label="Search"
                className={`search-input ${isSearchExpanded ? "show-searchbar" : "hide-searchbar"
                  }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <svg
                onClick={expandSearch}
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="#B7B7B7"
                className="search-icon bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>

              {/* Cancel Button */}
              {isSearchExpanded && (
                <button
                  className="tw:btn tw:btn-link tw:absolute tw:hover:underline tw:focus:outline-none"
                  onClick={hideSearch}
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    padding: 0,
                    textDecoration: "none",
                    color: "#B7B7B7",
                  }}
                >
                  <IoMdClose  className="tw:text-[#B7B7B7] tw:w-[24px] tw:h-[24px] tw:md:w-[30px] tw:md:h-[30px]" />
                </button>
              )}
            </div>
          </div>

          <div className="tw:flex tw:mb-3 tw:mt-2 tw:pl-4">
            <button
              className={`tw:btn tw:px-6 tw:py-1 ${selectedFilter === "all" ? "tw:bg-[#FF780B] tw:text-white" : "tw:bg-white tw:text-[#FF780B]"
                }`}
              onClick={() => setSelectedFilter("all")}
              style={{
                border: "1px solid #FF780B",
                borderRadius: "16px",
                fontSize: "14px",
                padding: "6px 18px",
              }}
            >
              {t("all")}
            </button>
            <button
              className={`tw:btn tw:px-3 tw:py-1 tw:ml-2 ${selectedFilter === "unread" ? "tw:bg-[#FF780B] tw:text-white" : "tw:bg-white tw:text-[#FF780B]"
                }`}
              onClick={() => setSelectedFilter("unread")}
              style={{
                border: "1px solid #FF780B",
                borderRadius: "16px",
                fontSize: "14px",
                padding: "6px 12px",
              }}
            >
              {t("unread")}
            </button>
          </div>

          <div className="tw:flex-grow tw:overflow-y-auto">
            <ul className="tw:p-2 tw:overflow-hidden">
              {[...threads]
                .toSorted(
                  (a, b) =>
                    new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
                )
                .map((thread) => {
                  const isUnread = !thread.seen;
                  const initials = thread.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);
                  return (
                    <li
                      key={thread.thread_id}
                      className={`tw:flex tw:items-start tw:p-2 tw:rounded-lg tw:cursor-pointer ${selectedThread?.thread_id === thread.thread_id
                        ? "tw:bg-[#FFEBDD] tw:border tw:border-[#FF780B]"
                        : "tw:bg-white"
                        }`}
                      onClick={() => handlethreadselect(thread)}
                    >
                      {/* Avatar */}
                      <div className={`tw:w-[40px] tw:h-[40px] tw:rounded-full tw:border ${selectedThread?.thread_id === thread.thread_id
                        ? "tw:border-[#FF780B] tw:text-[#FF780B]"
                        : "tw:border-[#D8E0ED] tw:text-[var(--color-font-regular)]"
                        } tw:bg-[#F8F9FB] tw:flex tw:items-center tw:justify-center tw:text-[14px] tw:font-medium tw:mr-3 tw:flex-shrink-0`}>
                        {initials}
                      </div>

                      {/* Content */}
                      <div className="tw:flex-1 tw:min-w-0">

                        <h5
                          className={`tw:text-[18px] tw:font-medium ${selectedThread?.thread_id === thread.thread_id
                            ? "tw:text-[#FF780B]"
                            : "tw:text-[var(--color-font-dark)]"
                            } tw:truncate`}
                          title={thread.dwelling_title}
                        >
                          {thread.dwelling_title}
                        </h5>


                        <div className="tw:flex tw:justify-between tw:items-baseline">
                          <h5 className="tw:text-[16px] tw:font-medium tw:text-[var(--color-font-regular)] tw:truncate">
                            {thread.name}
                          </h5>
                          <div className="tw:flex tw:items-center tw:gap-2">
                            <p className="tw:text-[14px] tw:text-[var(--color-font-light)] tw:font-medium tw:whitespace-nowrap tw:leading-none">
                              {new Date(thread.lastMessageTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="tw:flex tw:justify-between">
                          <div className="tw:text-[16px] tw:font-medium tw:text-[var(--color-font-regular)] tw:truncate">
                            {thread?.lastMessage?.includes("https")
                              ? "Attachment"
                              : thread.lastMessage.slice(0, 40) + "..."}
                          </div>
                          <div className="tw:pl-2">
                            {isUnread ? (
                              <span className="tw:inline-block tw:w-2 tw:h-2 tw:bg-[#FF780B] tw:rounded-full"></span>
                            ) : (
                              <p className="tw:text-xs tw:text-gray-500">
                                {thread.status}
                              </p>
                            )}
                          </div>
                        </div>
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
          className={`tw:flex tw:flex-col ${isMobileView ? "tw:flex tw:w-full" : "tw:hidden tw:md:flex tw:md:flex-1"
            }`}
          style={{
            opacity: isMobileView || selectedThread ? 1 : 0,
            boxShadow: "-4px 0px 16px 0px rgba(0,0,0,0.06)",
            height: "calc(100vh - 90px)",
          }}
        >
          {selectedThread ? (
            <>
              <div className="tw:flex tw:p-4 tw:items-center tw:h-[72px] tw:bg-[#FAFBFC]">
                <button
                  className="tw:btn tw:md:hidden"
                  onClick={handleBack}
                  style={{
                    padding: "5px",
                    borderRadius: "10px",
                    marginRight: "5px",
                  }}
                >
                  <FaChevronLeft size={24} className="tw:text-[#B7B7B7]" />

                </button>
                <div className="tw:w-[40px] tw:h-[40px] tw:rounded-full tw:border tw:border-[#D8E0ED] tw:bg-[#F8F9FB] tw:flex tw:items-center tw:justify-center tw:text-[12px] tw:text-[var(--color-font-regular)] tw:font-medium tw:mr-3 tw:flex-shrink-0">
                  {selectedThread.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>

                <strong className="tw:text-[var(--color-font-dark)] tw:font-semibold tw:text-[14px] tw:flex-grow">
                  {selectedThread.name}
                </strong>
                <div
                  className="tw:text-[#040342] tw:font-medium tw:text-[16px] tw:hover:underline tw:ml-auto tw:cursor-pointer"
                  onClick={toggleDetailsModal}
                >
                  {t("details")}
                </div>
              </div>

              {(showDetailsModal || isAnimating) && (
                <div className={`modal-container ${isActive ? 'active' : 'closing'}`}>
                  {/* Overlay */}
                  <div className="modal-overlay" onClick={toggleDetailsModal}></div>

                  {/* Drawer */}
                  <div className="modal-drawer">
                    <div className="tw:flex tw:items-center tw:bg-[#FAFBFC] tw:justify-between  tw:p-4">
                      <h3 className="tw:text-[18px] tw:font-semibold ">
                        {t("details")}
                      </h3>
                      <button
                        className="close-button"
                        onClick={toggleDetailsModal}
                      >
                        <IoMdClose size={24} />
                      </button>
                    </div>

                    <div className="tw:flex tw:p-6 tw:flex-col tw:justify-center tw:items-center">
                      {/* Property details */}
                      {property &&
                        selectedThread &&
                        selectedThread.dwelling_title === property.title &&
                        !propertyLoading && (
                          <div
                            className=" tw:bg-white tw:md:block tw:pr-1"
                            style={{
                              height: "calc(100vh - 90px)",
                              overflowY: "auto",
                            }}
                          >
                            <Link
                              href={`/${locale}/listings/${selectedThread.dwelling_slug}`}
                            >
                              {property.image_url && (
                                <img
                                  src={property.image_url}
                                  alt="Property Image"
                                  className="tw:mb-4 "
                                  style={{
                                    width: "456px",
                                    height: "220px",
                                  }}
                                />
                              )}
                            </Link>
                            <div className="tw:gap-2 tw:flex tw:flex-col">
                              {property?.title && (
                                <h4 className="tw:text-start tw:font-semibold tw:text-[16px] tw:text-[#3B3B3B]">{property.title}</h4>
                              )}

                              {property?.location && (
                                <p className="tw:mx-auto tw:font-normal tw:text-[14px] tw:text-[#797979]">{property.location}</p>
                              )}
                            </div>

                            {property?.data?.prices?.length > 0 && (
                              <div
                                className="tw:w-full tw:p-0 tw:flex tw:flex-col tw:gap-5 tw:mt-5 tw:mb-5"
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
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}

              <div className="tw:flex-grow tw:p-4" style={{ overflowY: "auto" }}>
                {messages.map((chat, index) => {
                  let imageUrl = null;
                  let textContent = null;
                  const prevChat = index > 0 ? messages[index - 1] : null;
                  const currentDate = new Date(chat.timestamp).toDateString();
                  const prevDate = prevChat ? new Date(prevChat.timestamp).toDateString() : null;


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
                    <div key={index}>
                      {(!prevChat || currentDate !== prevDate) && (
                        <p style={{
                          fontFamily: 'Roboto',
                          fontWeight: 500,
                          fontSize: '12px',
                          lineHeight: '100%',
                          letterSpacing: '0.3em',
                          color: '#3B3B3B',
                          margin: '24px 0',
                          textAlign: 'center'
                        }}>
                          {new Date(chat.timestamp).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}, {new Date(chat.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      )}
                      <div

                        className={`tw:mb-3 tw:flex ${chat.direction === "sent"
                          ? "tw:justify-end"
                          : "tw:justify-start"
                          }`}
                      >
                        <div
                          style={{
                            maxWidth: "60%",
                            padding:
                              chat.type === "image" || chat.type === "image_and_text"
                                ? "0"
                                : "0",
                            borderRadius:
                              chat.type === "image" || chat.type === "image_and_text"
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
                          {(chat.type === "image" || chat.type === "image_and_text") && (
                            <div>
                              {chat.direction !== "sent" && (
                                <div className="tw:flex tw:items-baseline tw:gap-2">
                                  <h5 className="tw:text-[16px] tw:text-[#3B3B3B] tw:font-semibold">
                                    {selectedThread.name}
                                  </h5>
                                  <div
                                    className="tw:text-[#B7B7B7] tw:font-medium tw:text-[12px] tw:mt-[2px]"
                                  >
                                    {chat.time}
                                  </div>
                                </div>
                              )}

                              {chat.direction === "sent" && (
                                <div
                                  className="tw:text-[#B7B7B7] tw:font-medium tw:text-[12px] tw:text-end"
                                >
                                  {chat.time} <span className="tw:text-[16px] tw:ml-2 tw:text-[#3B3B3B] tw:font-semibold">You</span>
                                </div>
                              )}

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems:
                                    chat.direction === "sent" ? "flex-end" : "flex-start",
                                }}
                              >
                                <img
                                  src={chat.type === "image" ? chat.message : imageUrl}
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
                                      chat.type === "image" ? chat.message : imageUrl,
                                      "_blank",
                                    )
                                  }
                                />

                                {chat.type === "image_and_text" && (
                                  <div>

                                    <div
                                      className={`tw:p-2 tw:rounded ${chat.direction === "sent"
                                        ? "tw:bg-[#FAFBFC]"
                                        : "tw:bg-[#FAFBFC]"
                                        }`}
                                      style={{
                                        width: "max-content",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      <p className="tw:mb-0">{textContent}</p>

                                    </div>
                                  </div>
                                )}

                                {chat.type === "image" && (

                                  <div>

                                    <div
                                      style={{
                                        borderRadius: "10px",
                                        width: "max-content",
                                        maxWidth: "100%",
                                      }}
                                    >
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {chat.type === "text" && (
                            <div>
                              {/* Received Messages (left-aligned) */}
                              {chat.direction !== "sent" && (
                                <div className="tw:flex tw:items-baseline tw:gap-2">
                                  <h5 className="tw:text-[16px] tw:text-[#3B3B3B] tw:font-semibold">
                                    {selectedThread.name}
                                  </h5>
                                  <div
                                    className="tw:text-[#B7B7B7] tw:font-medium tw:text-[12px] tw:mt-[2px]"
                                  >
                                    {chat.time}
                                  </div>
                                </div>
                              )}

                              {/* Sent Messages (right-aligned) */}
                              {chat.direction === "sent" && (
                                <div className="tw:flex tw:flex-col tw:items-end">
                                  <div
                                    className="tw:text-[#B7B7B7] tw:font-medium tw:text-[12px] tw:mb-1"
                                  >
                                    {chat.time} <span className="tw:text-[16px] tw:ml-2 tw:text-[#3B3B3B] tw:font-semibold">You</span>
                                  </div>
                                  <div
                                    className={`tw:p-[10px] tw:text-[#797979] tw:font-normal tw:text-[12px] tw:rounded tw:bg-[#FAFBFC]`}
                                    style={{
                                      width: "max-content",
                                      maxWidth: "100%",
                                    }}
                                  >
                                    <p className="tw:mb-0">{chat.message}</p>
                                  </div>
                                </div>
                              )}

                              {/* Received Message Bubble (only if not sent) */}
                              {chat.direction !== "sent" && (
                                <div
                                  className={`tw:p-[10px] tw:text-[#797979] tw:font-normal tw:text-[12px] tw:rounded tw:bg-[#FAFBFC]`}
                                  style={{
                                    width: "max-content",
                                    maxWidth: "100%",
                                  }}
                                >
                                  <p className="tw:mb-0">{chat.message}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={messengerData.scrollRef}></div>
              </div>

              <div className="tw:pb-2">
                <div
                  className="tw:relative tw:flex tw:items-center"
                  style={{
                    borderTop: "1px solid #D8E0ED",
                    padding: "10px",
                    backgroundColor: "#ffffff",
                    height: "140px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <label
                    htmlFor="imageUpload"
                    className="tw:me-2"
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                    }}
                  >
                    <MdOutlineAttachFile size={24} className="tw:text-[#B7B7B7]" />

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
                      className="tw:absolute"
                      style={{
                        top: "10px",
                        left: "10px",
                        width: "70px",
                        height: "70px",
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
                          top: "-8px",
                          right: "-8px",
                          background: "red",
                          color: "white",
                          borderRadius: "50%",
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold",
                          border: "1px solid white",
                          zIndex: 10,
                          lineHeight: "1",
                        }}
                      >
                        ✕
                      </span>
                    </div>
                  )}

                  <textarea
                    className="tw:flex-grow tw:placeholder:text-[14px] tw:placeholder:font-normal tw:placeholder:text-[#B7B7B7] tw:font-normal tw:text-[14px] tw:text-[#333]"
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
                    className="tw:flex tw:items-center"
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
                      className="tw:text-gray-500"
                      style={{
                        fontSize: "0.75rem",
                        textAlign: "right",
                        width: "max",
                      }}
                    >
                      {newMessage.length}/4096
                    </div>

                    <button
                      className="tw:bg-[#FF780B] tw:text-white"
                      onClick={handleSendMessage}
                      disabled={newMessage.length === 0 && !imageFile}
                      style={{
                        height: "40px",
                        paddingTop: "10px",
                        paddingRight: "25px",
                        paddingBottom: "10px",
                        paddingLeft: "25px",
                      }}
                    >
                      <LuSend size={20} />

                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Show placeholder when no thread is selected
            <div className="tw:md:flex tw:hidden  tw:flex-col tw:items-center tw:justify-center tw:text-center tw:mt-[80px]">
              <img
                src="/assets/IllustrationsForEmptyMessage.png"
                alt="No conversation selected"
                className="tw:w-[300px] tw:h-[300px] "
              />
              <h3 className="tw:text-[14px] tw:font-medium tw:text-[#3B3B3B] tw:mb-[10px]">
                  {t("empty")}
              </h3>
                <p className="tw:text-[14px] tw:font-medium tw:text-[#797979] ">
                  {t("noMessagesDescription")}
              </p>
            </div>
          )}
        </div>

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
            margin-left: 14px; /* Adjust padding for mobile view */
          }

          .show-searchbar {
            width: calc(100% - 60px); /* Adjust based on padding/margins */
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
            padding: 8px;
            width: 35px;
            height: 35px;
          }

          /* Move Search Icon Inside the Input When Expanded */
          .show-searchbar ~ .search-icon {
            left: 26px; /* Moves inside the search bar */
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



          .property-image:hover {
            transform: scale(1.01);
          }


          .modal-container {
              position: fixed;
              inset: 0;
              z-index: 50;
              overflow: hidden;
              display: block;
              pointer-events: none;
            }

            .modal-container.active {
              pointer-events: auto;
            }

            .modal-overlay {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.3);
              opacity: 0;
              transition: opacity 0.5s cubic-bezier(0.33, 1, 0.68, 1);
            }

            .modal-container.active .modal-overlay {
              opacity: 1;
            }

            .modal-drawer {
  position: fixed;
  top: 0;
  height: 100%;
  background: white;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.5s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: transform;
  overflow: hidden;

  /* Mobile styles (default) */
  right: 0;
  width: 100%;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;

  /* Desktop styles */
  @media (min-width: 768px) {
    width: 500px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
}

            .modal-container.active .modal-drawer {
              transform: translateX(0);
            }

            /* Closing animation */
            .modal-container.closing .modal-overlay {
              opacity: 0;
            }

            .modal-container.closing .modal-drawer {
              transform: translateX(100%);
            }

            .close-button {
              padding: 0.25rem;
              background: transparent;
              border: none;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            }


            .modal-content {
              height: 100%;
              overflow-y: auto;
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
              width: 280px; /* Adjust width for mobile view */
              margin-left: 10px; /* Adjust padding for mobile view */
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
