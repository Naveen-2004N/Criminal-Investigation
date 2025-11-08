import fetch from 'node-fetch';

if (!process.env.STABILITY_API_KEY || process.env.STABILITY_API_KEY === "sk-es59TTETt8D8eTSkhVel9CWMmerpwk4LrwXpnRrxNcStBOuW") {
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error("ERROR: STABILITY_API_KEY is not set in your backend/.env file.");
  console.error("Please add your Stability AI key to the .env file and restart the server.");
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
} else {
  console.log("Stability AI API Key loaded successfully.");
}

const generateSketch = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  const engineId = 'stable-diffusion-xl-1024-v1-0'; 
  const apiHost = 'https://api.stability.ai';
  const apiKey = process.env.STABILITY_API_KEY;

  try {
    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024, // Using 1024x1024 for this XL model
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Stability AI:", errorText);
      throw new Error(`Non-200 response from Stability AI: ${errorText}`);
    }

    const responseJSON = await response.json();
    
    const base64Image = responseJSON.artifacts[0].base64;
    
    // Create the data URL to send to the frontend
    const dataUrl = `data:image/png;base64,${base64Image}`;

    res.json({ image: dataUrl });

  } catch (error) {
    console.error("Error generating sketch:", error.message);
    res.status(500).json({ message: `Error generating sketch: ${error.message}` });
  }
};

export { generateSketch };