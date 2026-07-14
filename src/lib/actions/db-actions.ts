"use server";

import { Role, Status, LeadStatus } from "@/types";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

// Public CRM B2B Lead Submission
export async function createB2BLead(formData: {
  companyName: string;
  contactEmail: string;
  interestType: string;
  notes?: string;
}) {
  if (!formData.companyName || !formData.contactEmail || !formData.interestType) {
    throw new Error("Missing required parameters: companyName, contactEmail, or interestType.");
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to submit lead to backend database.");
    }

    revalidatePath("/admin");
    return { success: true, leadId: data.leadId };
  } catch (error: any) {
    console.error("Error creating B2B Lead:", error);
    throw new Error(error.message || "Failed to submit lead. Pipeline connection failed.");
  }
}

// Update Lead Status (Admin Only)
export async function updateB2BLeadStatus(leadId: string, status: LeadStatus) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update lead status on backend.");
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating B2B Lead Status:", error);
    throw new Error(error.message || "Failed to update status.");
  }
}

// Add New Society (Admin Only)
export async function createSocietyAction(data: {
  name: string;
  address: string;
  city: string;
  flatCount: number;
  rooftopSolarKw: number;
  dailySurplusUnits: number;
  netMeteringRate: number;
  discomImportRate: number;
  revenueSplitCustomerPct: number;
  revenueSplitCompanyPct: number;
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  status: Status;
}) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/societies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to create society on backend.");
    }

    revalidatePath("/admin");
    return { success: true, societyId: result.societyId };
  } catch (error: any) {
    console.error("Error creating society:", error);
    throw new Error(error.message || "Failed to create society in database.");
  }
}

// Update Society (Admin Only)
export async function updateSocietyAction(
  id: string,
  data: {
    name?: string;
    address?: string;
    city?: string;
    flatCount?: number;
    rooftopSolarKw?: number;
    dailySurplusUnits?: number;
    netMeteringRate?: number;
    discomImportRate?: number;
    revenueSplitCustomerPct?: number;
    revenueSplitCompanyPct?: number;
    contactPersonName?: string;
    contactEmail?: string;
    contactPhone?: string;
    status?: Status;
    internalNotes?: string;
  }
) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/societies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to update society details on backend.");
    }

    revalidatePath("/admin");
    revalidatePath(`/admin/society/${id}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating society:", error);
    throw new Error(error.message || "Failed to update society details.");
  }
}

// Delete Society (Admin Only)
export async function deleteSocietyAction(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/societies/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to delete society on backend.");
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting society:", error);
    throw new Error(error.message || "Failed to delete society.");
  }
}
