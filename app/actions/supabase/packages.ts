"use server";
import { PURCHASE_TYPES } from "@/lib/config/pricing.config";
import { createClient, ENVType } from "@/lib/utils/supabase/server";

// SERVER & CLIENT
export async function getUserPackageRecord(
  userId: string | undefined,
  SUPABASE_SECRET_KEY?: ENVType,
): Promise<Packages | null> {
  const supabase = await createClient(SUPABASE_SECRET_KEY);

  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) return null;
    return data;
  } catch (error) {
    throw error;
  }
}

// SERVER ONLY
export async function upsertUserPackageRecord({
  userId,
  packageName,
  inquiryCount,
  SUPABASE_SECRET_KEY,
}: {
  userId: string | undefined;
  packageName: Packages["package_name"];
  inquiryCount: number;
  SUPABASE_SECRET_KEY?: ENVType;
}): Promise<{ success: boolean; data: Packages } | null> {
  const supabase = await createClient(SUPABASE_SECRET_KEY);

  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }

    if (inquiryCount <= 0) throw new Error("Inquiry count must be positive");
    if (!["gold", "silver", "bronze"].includes(packageName))
      throw new Error("Invalid package name");

    // TODO: THIS MAY NOT BE COMPLETELY TYPE-SAFE, PLEASE REMEMBER TO REVISIT.
    const { data, error } = await supabase
      .rpc("upsert_packages", {
        p_inquiry_count: inquiryCount,
        p_package_name: packageName,
        p_user_id: userId,
      })
      .single();

    if (error) {
      throw error;
    }
    if (!data) return null;
    return { success: true, data };
  } catch (error) {
    throw { success: false, error };
  }
}

// CLIENT
export async function updateUserPackageInquiries(
  userId: string | undefined,
  addedInquires: number,
  tableColumn: "total_inquiries" | "used_inquiries",
  SUPABASE_SECRET_KEY?: ENVType,
): Promise<{ success: boolean; data: Packages } | null> {
  const supabase = await createClient(SUPABASE_SECRET_KEY);

  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }

    // TODO: THIS MAY NOT BE COMPLETELY TYPE-SAFE, PLEASE REMEMBER TO REVISIT.
    const { data, error } = await supabase
      .rpc("update_column_value", {
        table_name: "packages",
        table_column: tableColumn,
        increment: addedInquires,
        user_id: userId,
      })
      .single();

    if (error) {
      throw error;
    }
    if (!data) return null;
    return { success: true, data };
  } catch (error) {
    throw { success: false, error };
  }
}
