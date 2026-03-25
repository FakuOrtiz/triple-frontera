import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.comparapix.ar/quotes", {
      headers: {
        "User-Agent": "Triple Frontera App",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error fetching PIX rates" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching PIX rates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
