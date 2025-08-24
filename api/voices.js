export default async function handler(req, res) {
  try {
    // Fetch voice list
    if (req.method === "GET") {
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": process.env.ELEVEN_API_KEY,
        },
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    // Convert text to speech
    if (req.method === "POST") {
      const { text, voiceId } = req.body;

      if (!text || !voiceId) {
        return res.status(400).json({ error: "Missing text or voiceId" });
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.ELEVEN_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voice_settings: {
              stability: 0.1,
              similarity_boost: 0.8,
            },
          }),
        }
      );

      const audioBuffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "audio/mpeg");
      return res.status(200).send(Buffer.from(audioBuffer));
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}      const audioBuffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "audio/mpeg");
      return res.status(200).send(Buffer.from(audioBuffer));
    }

    // Any other method not allowed
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}      res.setHeader("Content-Type", "audio/mpeg");
      return res.status(200).send(Buffer.from(audioBuffer));
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
