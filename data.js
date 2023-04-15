import { supabase } from "./config/supabaseClient";

let currentDate = new Date().toJSON().slice(0, 10);

const useData = async () => {
  const { data, error } = await supabase
    .from("Words")
    .select()
    .eq('day', currentDate);
  console.log(data);
};
useData()