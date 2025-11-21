const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const res = await fetch(`${backendUrl}/session_id/${id}`);
        const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
    });
    } catch (err) {
        console.error("Error in /api/session_id/:id GET", err);
        return new Response(JSON.stringify({ message: "Backend unavailable" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
