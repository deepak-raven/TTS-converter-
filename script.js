document.addEventListener("DOMContentLoaded", () => {
  // Get references to the HTML elements
  const text = document.querySelector("#text");
  const voiceSelect = document.querySelector("#voiceSelect");
  const convertBtn = document.querySelector("#convert");
  const audio = document.querySelector("#audio");

  // Function to populate the voice select dropdown by calling our secure API endpoint
  const getVoices = async () => {
    try {
      // Call our own serverless function to get the voices
      const response = await fetch("/api/get-voices");

      if (!response.ok) {
        throw new Error("Failed to fetch voices from the server.");
      }

      const data = await response.json();

      voiceSelect.innerHTML = ''; // Clear existing options
      data.voices.forEach(voice => {
        const option = document.createElement("option");
        option.value = voice.voice_id;
        option.textContent = `${voice.name} (${voice.labels.accent || 'N/A'})`;
        voiceSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching voices:", error);
      alert("Could not load voices. Please check the server and try again.");
    }
  };

  // Event listener for the "Play" button
  convertBtn.addEventListener("click", async () => {
    const selectedVoiceId = voiceSelect.value;
    const textToConvert = text.value.trim();

    if (!selectedVoiceId || !textToConvert) {
      alert("Please select a voice and enter some text.");
      return;
    }

    // Disable button and show loading state
    convertBtn.disabled = true;
    convertBtn.textContent = "Loading...";

    try {
      // Call our own serverless function for TTS conversion
      const response = await fetch(`/api/voices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToConvert,
          voiceId: selectedVoiceId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audio.src = audioUrl;
      audio.play();

    } catch (error) {
      console.error("Error converting text to speech:", error);
      alert("Failed to convert text to speech. Please try again.");
    } finally {
      // Re-enable button and restore original text
      convertBtn.disabled = false;
      convertBtn.textContent = "Play";
    }
  });

  // Load the voices when the page loads
  getVoices();
});
