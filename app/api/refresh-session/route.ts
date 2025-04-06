import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Make sure this file exists at app/api/set-onboarding-complete/route.ts
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For debugging - let's just return success without trying to update metadata
    console.log("Would update onboarding status for user:", userId);

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: String(error) },
      { status: 500 }
    );
  }
}
