const voiceSelect = document.getElementById("voiceSelect");
const convertBtn = document.getElementById("convert");
const audioElement = document.getElementById("audio");
const textInput = document.getElementById("text");

async function loadVoices() {
  try {
    const response = await fetch("/api/voices");
    const data = await response.json();
    console.log("Voices JSON:", data);

    // Depending on the shape: { voices: [...] }
    const voices = data.voices || data;

    voiceSelect.innerHTML = ""; // clear old options
    voices.forEach(voice => {
      const option = document.createElement("option");
      option.value = voice.voice_id;
      option.textContent = voice.name;
      voiceSelect.appendChild(option);
    });
  } catch (err) {
    alert("Error fetching voices: " + err.message);
  }
}

convertBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();
  const voiceId = voiceSelect.value;

  if (!text) {
    alert("Please enter some text");
    return;
  }

  convertBtn.disabled = true;
  convertBtn.textContent = "Converting...";

  try {
    const response = await fetch("/api/voices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voiceId })
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const audioData = await response.arrayBuffer();
    const blob = new Blob([audioData], { type: "audio/mpeg" });
    audioElement.src = URL.createObjectURL(blob);
    audioElement.play();
  } catch (error) {
    alert("Error converting text to speech: " + error.message);
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = "Play";
  }
});

// Load voices when page loads
window.addEventListener("DOMContentLoaded", loadVoices);    alert("Error converting text to speech: " + error.message);
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = "Play";
  }
});
