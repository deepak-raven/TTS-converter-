const voiceSelect = document.getElementById("voiceSelect");
const convertBtn = document.getElementById("convert");
const audioElement = document.getElementById("audio");
const downloadLink = document.getElementById("download");
const textArea = document.getElementById("text");

// Load voices into dropdown
async function loadVoices() {
  try {
    const response = await fetch("/api/voices");
    const data = await response.json();

    console.log("Voices response:", data);

    // Adjust based on API response shape
    const voices = data.voices || data;

    voiceSelect.innerHTML = "";
    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.voice_id;
      option.textContent = voice.name;
      voiceSelect.appendChild(option);
    });
  } catch (err) {
    alert("Error fetching voices: " + err.message);
  }
}

// Handle text-to-speech conversion
convertBtn.addEventListener("click", async () => {
  const text = textArea.value.trim();
  const voiceId = voiceSelect.value;

  if (!text) {
    alert("Please enter some text.");
    return;
  }

  convertBtn.disabled = true;
  convertBtn.textContent = "Converting...";

  try {
    const response = await fetch("/api/voices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voiceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Conversion failed");
    }

    const audioData = await response.arrayBuffer();
    const blob = new Blob([audioData], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    // Play audio
    audioElement.src = url;
    audioElement.play();

    // Prepare download link
    downloadLink.href = url;
    downloadLink.download = "speech.mp3";
    downloadLink.style.display = "inline";
    downloadLink.textContent = "Download MP3";
  } catch (err) {
    alert("Error converting text to speech: " + err.message);
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = "Play";
  }
});

// Load voices on page load
loadVoices();  convertBtn.textContent = "Converting...";

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
