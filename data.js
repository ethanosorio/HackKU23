import { supabase } from "./config/supabaseClient";

let currentDate = new Date().toJSON().slice(0, 10);
console.log(currentDate)

const useData = async () => {
  const { data, error } = await supabase
    .from("Words")
    .select()
    .order('day',{ascending: false})
    .limit(1);      // .eq('day', currentDate);
  console.log("data: ", data);
  console.log("word: ", data[0].word);
};
useData()