import { supabase } from "@/lib/supabase/db";

export const getAllExtensions = async () => {
  let { data, error } = await supabase.from("extensions").select("*");

  return { data, error };
};

export const getCommandExtensions = async () => {
  let { data, error } = await supabase
    .from("extensions")
    .select("*")
    .eq("type", "command");

  return { data, error };
};

export const getExeExtensions = async () => {
  let { data, error } = await supabase
    .from("extensions")
    .select("*")
    .eq("type", "exe");

  return { data, error };
};

export const insertExtensions = async (row: any) => {
  const { data, error } = await supabase
    .from("extensions")
    .insert([row])
    .select();

  return { data, error };
};

export const uploadExtensions = async (file: any, filename: string) => {
  const { data, error } = await supabase.storage
    .from("extensions")
    .upload(`exe/${filename}`, file);
  if (error) {
    console.log(error);
  } else {
    console.log("업로드 성공!");
    console.log(data);
  }

  return { data, error };
};
