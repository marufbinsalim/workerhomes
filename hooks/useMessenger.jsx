import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function useMessenger(page) {
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from("threads").select("*");
      if (error) {
        console.error("error", error);
      }
      console.log("data", data);
    };
    fetchMessages();
  }, []);

  async function createThread(thread) {
    const { data, error } = await supabase
      .from("threads")
      .upsert([thread])
      .select();

    if (error) {
      console.error("error", error);
    }
    console.log("data", data);
  }

  return {
    data: "hello",
    functions: {
      createThread,
    },
  };
}
