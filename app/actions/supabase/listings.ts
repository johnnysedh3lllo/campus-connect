"use server";

import { createClient } from "@/utils/supabase/server";

export async function insertProperty(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .insert([
      {
        landlord_id: userId,
        title: "Strange House",
        description: "Spooky house on the hill",
        location: "On the hill, duh!",
        price: 200.0,
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting property:", error);
  } else {
    console.log("Property inserted:", data);
  }
}
