import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "@/config";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function useMessenger(page, session, locale) {
  // effect to fetch threads in the messenger page in realtime
  //
  const [threads, setThreads] = useState([]);
  const [selectedThread, setselectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const threadsListener = supabase
      .channel("public:threads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "threads" },
        (payload) => {
          let currentThreads = [...threads];
          console.log("Change received!", payload);
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

  // effect to fetch messages in the messenger page in realtime
  //

  useEffect(() => {
    const messagesListener = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          let currentMessages = [...messages];
          console.log("Change received!", payload);
          if (payload.eventType === "INSERT") {
            if (payload.new.thread_id === selectedThread.thread_id) {
              currentMessages = [payload.new, ...currentMessages];
            }
          }
          setMessages(currentMessages);
        },
      )
      .subscribe();

    return () => {
      messagesListener.unsubscribe();
    };
  }, [messages, selectedThread]);

  useEffect(() => {
    console.log("selectedThread", selectedThread);
    if (page === "messenger" && selectedThread) {
      const fetchMessages = async () => {
        console.log("fetching messages");
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
      return data?.data?.[0] || [];
    };

    if (page === "messenger" && selectedThread) {
      console.log("fetching property", selectedThread);
      fetchListingBySlug(
        selectedThread.dwelling_slugs?.find((slug) => slug.locale === locale)
          ?.value,
        locale,
      ).then((data) => {
        setProperty(data);
      });
    }
  }, [page, selectedThread]);

  useEffect(() => {
    if (page === "messenger") {
      const fetchThreads = async () => {
        const { data, error } = await supabase.from("threads").select("*");
        if (data) {
          setThreads(data);
          setselectedThread(generateThreadType(data[0]));
        }
      };
      fetchThreads();
    }
  }, [page]);

  async function createThread(thread) {
    const { data, error } = await supabase
      .from("threads")
      .upsert([thread])
      .select();
  }

  async function sendMessage(message) {
    const { data, error } = await supabase
      .from("messages")
      .upsert([message])
      .select();

    if (page === "messenger" && selectedThread) {
      let newMessages = [
        ...messages,
        {
          ...message,
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(newMessages);

      // change last message in the thread to the new message
      const { data, error } = await supabase
        .from("threads")
        .update({
          last_message: message,
        })
        .eq("thread_id", message.thread_id);
    }

    return { data, error };
  }

  function generateThreadType(thread) {
    return {
      thread_id: thread.thread_id,
      user: thread.user,
      owner: thread.owner,
      name:
        session?.user.email === thread.user.email
          ? thread.owner.username
          : thread.user.username,
      lastMessage: thread.last_message.content,
      created_at: new Date(thread.created_at).toLocaleDateString(locale),
      dwelling_title:
        thread.dwelling_title.find((title) => title.locale === locale)?.value ||
        "",
      dwelling_slug:
        thread.dwelling_slug.find((slug) => slug.locale === locale)?.value ||
        "",
      dwelling_titles: thread.dwelling_title,
      dwelling_slugs: thread.dwelling_slug,
    };
  }

  function generateMessageType(message) {
    return {
      message_id: message.id,
      thread_id: message.thread_id,
      sender: message.sender,
      recipient: message.recipient,
      message: message.content,
      time: new Date(message.timestamp).toLocaleTimeString(),
      direction:
        session?.user.email === message.sender.email ? "sent" : "received",
    };
  }

  function generatePropertyType(property, selectedThread) {
    if (!property) return null;
    return {
      title: selectedThread?.dwelling_titles.find(
        (title) => title.locale === locale,
      )?.value,

      image_url: `${api}${property?.galleries?.[0]?.image?.url}` || "",
      location:
        property?.location.length !== 0
          ? `${property.location[0].street_one}, ${property.location[0].zip_code || ""}, ${property.location[0].city || ""}, ${property.location[0].country || ""}`
          : "",
    };
  }

  return {
    data: {
      property: generatePropertyType(property, selectedThread),
      threads: threads.map(generateThreadType).filter((thread) => {
        return (
          thread.user.email === session?.user.email ||
          thread.owner.email === session?.user.email
        );
      }),
      messages: messages.map(generateMessageType).sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
      }),
      selectedThread: selectedThread,
      setselectedThread: setselectedThread,
    },
    functions: {
      createThread,
      sendMessage,
    },
  };
}
