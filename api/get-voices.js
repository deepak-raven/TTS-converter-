export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const API_KEY = process.env.ELEVENLABS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is not configured." });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch voices from ElevenLabs API.");
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
