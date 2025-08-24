async function loadVoices() {
  try {
    const response = await fetch("/api/voices");
    const data = await response.json();
    const voices = data.voices;

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
  const text = document.getElementById("text").value;
  const voiceId = voiceSelect.value;

  convertBtn.disabled = true;
  convertBtn.textContent = "Converting...";

  try {
    const response = await fetch("/api/voices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voiceId })
    });

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
