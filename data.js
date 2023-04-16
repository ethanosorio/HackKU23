import { supabase } from "./config/supabaseClient";

let currentDate = new Date().toJSON().slice(0, 10);
console.log(currentDate)

const useData = async () => {
  const { data, error } = await supabase
    .from("Words")
    .select();
    // .eq('day', currentDate);
  console.log("data: ",data);
};
useData()