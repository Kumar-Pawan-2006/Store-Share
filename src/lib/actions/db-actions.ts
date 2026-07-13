"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Role, Status, LeadStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Guard helper for admin server actions
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized access. Admin role required.");
  }
}

// CRM Lead Submission (Publicly accessible)
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
    const lead = await db.b2BLead.create({
      data: {
        companyName: formData.companyName,
        contactEmail: formData.contactEmail,
        interestType: formData.interestType,
        notes: formData.notes || "",
        status: LeadStatus.NEW,
      },
    });

    revalidatePath("/admin");
    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error("Error creating B2B Lead:", error);
    throw new Error("Failed to submit lead. Database error.");
  }
}

// Update Lead Status (Admin Only)
export async function updateB2BLeadStatus(leadId: string, status: LeadStatus) {
  await requireAdmin();

  try {
    await db.b2BLead.update({
      where: { id: leadId },
      data: { status },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating B2B Lead Status:", error);
    throw new Error("Failed to update status.");
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
  await requireAdmin();

  try {
    const society = await db.society.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        flatCount: data.flatCount,
        rooftopSolarKw: data.rooftopSolarKw,
        dailySurplusUnits: data.dailySurplusUnits,
        netMeteringRate: data.netMeteringRate,
        discomImportRate: data.discomImportRate,
        revenueSplitCustomerPct: data.revenueSplitCustomerPct,
        revenueSplitCompanyPct: data.revenueSplitCompanyPct,
        contactPersonName: data.contactPersonName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        status: data.status,
      },
    });

    revalidatePath("/admin");
    return { success: true, societyId: society.id };
  } catch (error) {
    console.error("Error creating society:", error);
    throw new Error("Failed to create society in database.");
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
  await requireAdmin();

  try {
    await db.society.update({
      where: { id },
      data,
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/society/${id}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating society:", error);
    throw new Error("Failed to update society details.");
  }
}

// Delete Society (Admin Only)
export async function deleteSocietyAction(id: string) {
  await requireAdmin();

  try {
    await db.society.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting society:", error);
    throw new Error("Failed to delete society.");
  }
}
