const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request) {
    console.log("BACKEND URL USED BY /api/session:", backendUrl);
    try {
        const body = await request.json();

        const res = await fetch(`${backendUrl}/layout/calc`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
    });

    const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error in /api/layout/calc", err);
        return new Response(JSON.stringify({ message: "Backend unavailable" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
