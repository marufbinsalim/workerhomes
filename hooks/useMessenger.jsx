import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "@/config";
import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function useMessenger(
  page,
  threadID,
  filter,
  query,
  isPhone,
  session,
  locale,
) {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setselectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [property, setProperty] = useState(null);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const scrollRef = useRef();
  const [refreshThreads, setRefreshThreads] = useState(false);

  async function seeThread(threadID) {
    const { data, error } = await supabase
      .from("threads")
      .update({ seen: true })
      .eq("thread_id", threadID);
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const threadsListener = supabase
      .channel("public:threads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "threads" },
        (payload) => {
          let currentThreads = [...threads];
          if (payload.eventType === "INSERT") {
            currentThreads = [payload.new, ...currentThreads];
          } else if (payload.eventType === "UPDATE") {
            const index = currentThreads.findIndex(
              (thread) => thread.thread_id === payload.new.thread_id,
            );
            currentThreads[index] = payload.new;
          } else if (payload.eventType === "DELETE") {
            currentThreads = currentThreads.filter(
              (thread) => thread.thread_id !== payload.old.thread_id,
            );
          }
          setThreads(currentThreads);
        },
      )
      .subscribe();

    return () => {
      threadsListener.unsubscribe();
    };
  }, [threads]);

  useEffect(() => {
    if (!selectedThread) return;

    async function seenThread() {
      let isRecipient =
        session?.user.email !== selectedThread.lastMessageSender;

      if (!isRecipient) return;
      const { data, error } = await supabase
        .from("threads")
        .update({ seen: true })
        .eq("thread_id", selectedThread.thread_id);
    }

    seenThread();
  }, [selectedThread]);

  useEffect(() => {
    if (page !== "messenger") return;
    const messagesListener = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          let currentMessages = [...messages];
          if (payload.eventType === "INSERT") {
            if (payload.new.thread_id === selectedThread?.thread_id) {
              currentMessages = [payload.new, ...currentMessages];
              currentMessages = currentMessages.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
              });
              seeThread(selectedThread.thread_id);
              setRefreshThreads(!refreshThreads);
            }
          }
          setMessages(currentMessages);
        },
      )
      .subscribe();

    return () => {
      messagesListener.unsubscribe();
    };
  }, [messages, selectedThread, page]);

  useEffect(() => {
    if (page === "messenger" && selectedThread) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("thread_id", selectedThread.thread_id);
        if (data) {
          setMessages(data);
        }
      };

      fetchMessages();
    }
  }, [page, selectedThread]);

  useEffect(() => {
    const fetchListingBySlug = async (slug, locale) => {
      setPropertyLoading(true);
      // Fetch listing by slug
      const res = await fetch(
        api +
          `/api/dwellings?filters[slug][$eq]=${slug}&populate=galleries.image,features.icon,seo,location,contact,amenities,category,prices,subscription.package,owner,subscription.package.icon,localizations&locale=${locale}`,
        {
          next: {
            revalidate: 0,
          },
        },
      );
      const data = await res.json();
      setPropertyLoading(false);
      return data?.data?.[0] || [];
    };

    if (page === "messenger" && selectedThread) {
      fetchListingBySlug(
        selectedThread.dwelling_slugs?.find((slug) => slug.locale === locale)
          ?.value,
        locale,
      ).then((data) => {
        setProperty(data);
      });
    }
  }, [page, selectedThread, locale]);

  useEffect(() => {
    if (page === "messenger") {
      const fetchThreads = async () => {
        const { data, error } = await supabase.from("threads").select("*");
        if (data) {
          setThreads(data);

          let userThreads = data.filter((thread) => {
            return (
              thread.user.email === session?.user.email ||
              thread.owner.email === session?.user.email
            );
          });

          // get the first thread where the last message was sent the most recently

          let firstThread =
            userThreads.toSorted((a, b) => {
              return (
                new Date(b.last_message.timestamp) -
                new Date(a.last_message.timestamp)
              );
            })[0] || null;

          let currentThread = data.find((thread) => {
            return thread.thread_id === threadID;
          });

          if (!isPhone) {
            if (currentThread) {
              setselectedThread(generateThreadType(currentThread));
            } 
          } else {
            if (currentThread) {
              setselectedThread(generateThreadType(currentThread));
            }
          }
        }
      };
      fetchThreads();
    }
  }, [page, session, isPhone, refreshThreads, threadID]);

  // on change of selected thread, change the search param

  const searchParams = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    if (selectedThread) {
      const params = new URLSearchParams(searchParams);
      params.set("thread", selectedThread.thread_id);

      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [selectedThread, router, searchParams]);

  async function createThread(thread) {
    const { data, error } = await supabase
      .from("threads")
      .upsert([thread])
      .select();
  }

  async function sendMessage(message) {
    let imageUrl = null;

    if (message.imageFile) {
      const fileExt = message.imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from("chat-images")
        .upload(filePath, message.imageFile);

      if (error) {
        console.error("Image upload failed:", error.message);
        return { messageData: null, error };
      }

      imageUrl = supabase.storage.from("chat-images").getPublicUrl(filePath)
        .data.publicUrl;
    }

    // Prepare the message content
    let content = message.content;
    let type = "text";

    if (imageUrl && message.content) {
      // If both image and text are present, combine them
      content = JSON.stringify({
        text: message.content,
        imageUrl: imageUrl,
      });
      type = "image_and_text";
    } else if (imageUrl) {
      content = imageUrl;
      type = "image";
    }

    const newMessage = {
      thread_id: message.thread_id,
      content: content,
      type: type,
      sender: message.sender,
      recipient: message.recipient,
    };

    const { data: messageData, error: insertError } = await supabase
      .from("messages")
      .upsert([newMessage])
      .select();

    if (insertError) {
      console.error("Error saving message:", insertError.message);
      return { messageData, error: insertError };
    }

    if (page === "messenger" && selectedThread) {
      let newMessages = [
        ...messages,
        {
          ...newMessage,
          id: messageData[0].id,
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(newMessages);

      // Update last message in the thread
      const { data: threadData, error: threadError } = await supabase
        .from("threads")
        .update({
          last_message: {
            ...newMessage,
            id: messageData[0].id,
            timestamp: new Date().toISOString(),
          },
          seen: false,
        })
        .eq("thread_id", message.thread_id);

      if (threadError) {
        console.error("Error updating thread:", threadError.message);
      }
    }

    return { messageData, error: insertError, imageUrl };
  }

  useEffect(() => {
    // get all the unread status threads and print the count
    let unreadThreads = [...threads]
      .map(generateThreadType)
      .filter((thread) => {
        if (!thread) return false;
        if (thread.seen) return false;
        return (
          thread.user.email === session?.user.email ||
          thread.owner.email === session?.user.email
        );
      })
      .toSorted((a, b) => {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      });
  }, [threads]);

  function generateThreadType(thread) {
    if (!thread) return null;

    if (query && query !== "" && thread.user && thread.owner) {
      let userNameIncludesQuery = thread.user.username
        .toLowerCase()
        .includes(query.toLowerCase());

      let ownerNameIncludesQuery = thread.owner.username
        .toLowerCase()
        .includes(query.toLowerCase());

      if (!userNameIncludesQuery && !ownerNameIncludesQuery) {
        return null;
      }
    }

    return {
      thread_id: thread.thread_id,
      user: thread.user,
      owner: thread.owner,
      name:
        session?.user.email === thread.user.email
          ? thread.owner.username
          : thread.user.username,
      lastMessage: thread.last_message?.content,
      lastMessageSender: thread.last_message?.sender?.email,
      lastMessageTime: thread.last_message?.timestamp,
      created_at: thread.last_message
        ? new Date(thread.last_message.timestamp).toLocaleDateString()
        : new Date(thread.created_at).toLocaleDateString(),
      dwelling_title:
        thread.dwelling_title.find((title) => title.locale === locale)?.value ||
        "",
      dwelling_slug:
        thread.dwelling_slug.find((slug) => slug.locale === locale)?.value ||
        "",
      dwelling_titles: thread.dwelling_title,
      dwelling_slugs: thread.dwelling_slug,
      seen:
        session?.user.email === thread?.last_message?.sender?.email
          ? true
          : thread.seen,
      status:
        session?.user.email === thread?.last_message?.sender?.email
          ? thread.seen
            ? "seen"
            : "sent"
          : thread.seen
            ? "seen"
            : "unread",
    };
  }

  function generateMessageType(message) {
    return {
      message_id: message.id,
      thread_id: message.thread_id,
      sender: message.sender,
      recipient: message.recipient,
      message: message.content,
      type: message.type,
      time: new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: message.timestamp,
      direction:
        session?.user.email === message.sender.email ? "sent" : "received",
    };
  }

  function generatePropertyType(property, selectedThread) {
    if (!property) return null;
    return {
      data: property,
      title: selectedThread?.dwelling_titles.find(
        (title) => title.locale === locale,
      )?.value,

      image_url: `${api}${property?.galleries?.[0]?.image?.url}` || "",
      location:
        property?.location && property.location.length > 0
          ? `${property.location[0].street_one}, ${property.location[0].zip_code || ""}, ${property.location[0].city || ""}, ${property.location[0].country || ""}`
          : "",
    };
  }

  async function addEmailToDatabase(id, thread_id, toOwner) {
    const { error } = await supabase.from("emails").insert([
      {
        id: id,
        thread_id: thread_id,
        toOwner: toOwner,
      },
    ]);

    return error;
  }

  function randomString(length) {
    var result = [];
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength)),
      );
    }
    return result.join("");
  }

  async function getEmailHeader(emailThreadID, toOwner) {
    let messageId = `<${randomString(15)}@workerhomes.pl>`;

    const { data, error } = await supabase
      .from("emails")
      .select("*")
      .eq("toOwner", toOwner)
      .eq("thread_id", emailThreadID)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return {
        "Message-ID": messageId,
      };
    }
    let referenceId = data[0]?.id;
    await addEmailToDatabase(messageId, emailThreadID, toOwner);

    return {
      "Message-ID": messageId,
      "In-Reply-To": referenceId,
      References: referenceId,
    };
  }

  return {
    data: {
      property: generatePropertyType(property, selectedThread),
      propertyLoading: propertyLoading,
      threads:
        filter === "all"
          ? threads
              .map(generateThreadType)
              .filter((thread) => {
                if (!thread) return false;
                return (
                  thread.user.email === session?.user.email ||
                  thread.owner.email === session?.user.email
                );
              })
              .sort((a, b) => {
                return (
                  new Date(a.lastMessageTime) - new Date(b.lastMessageTime)
                );
              })
          : threads
              .map(generateThreadType)

              .filter((thread) => {
                if (!thread) return false;
                if (thread.seen) return false;
                return (
                  thread.user.email === session?.user.email ||
                  thread.owner.email === session?.user.email
                );
              })
              .toSorted((a, b) => {
                return (
                  new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                );
              }),
      // make sure  message_id is unique
      messages: messages
        .map(generateMessageType)
        .filter(
          (message, index, self) =>
            index ===
            self.findIndex((t) => t.message_id === message.message_id),
        ),
      selectedThread: selectedThread,
      setselectedThread: setselectedThread,
      scrollRef: scrollRef,
    },

    functions: {
      createThread,
      sendMessage,
      addEmailToDatabase,
      getEmailHeader,
    },
  };
}
