const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
    try {
        const res = await fetch(`${backendUrl}/sessions`);
        const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error in /api/sessions", err);
        return new Response(JSON.stringify({ message: "Backend unavailable" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
