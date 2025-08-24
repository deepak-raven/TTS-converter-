export default async function handler(req, res) {
  const { text, voiceId } = req.method === "POST" ? req.body : {};

  try {
    if (req.method === "GET") {
      // Get all voices
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": process.env.ELEVEN_API_KEY
        }
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      // Convert text to speech
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": process.env.ELEVEN_API_KEY
          },
          body: JSON.stringify({
            text,
            voice_settings: {
              stability: 0.1,
              similarity_boost: 0.8
            }
          })
        }
      );

      const audioBuffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "audio/mpeg");
      return res.status(200).send(Buffer.from(audioBuffer));
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
