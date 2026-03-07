import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProjectComparisonData } from "@/lib/project-comparison";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const comparisonData = await getProjectComparisonData(projectId, session.user.email);

    if (!comparisonData) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(comparisonData, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch comparison data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
