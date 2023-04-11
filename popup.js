chrome.storage.local.get("apiKey", (data) => {
    if (data.apiKey) {
      document.getElementById("apiKey").value = data.apiKey;
    }
  });
  
document.getElementById("submitQuestion").addEventListener("click", () => {
    const question = document.getElementById("question").value;
    const apiKey = document.getElementById("apiKey").value;
  
    if (question && apiKey) {
        // Save the API key to local storage
  chrome.storage.local.set({ apiKey: apiKey }, () => {
    console.log("API key saved to local storage");
  });

      getAnswerFromOpenAI(apiKey, question, window.pageContent)
        .then((answer) => {
          document.getElementById("response").value = answer;
        })
        .catch((error) => {
          console.error("Error getting answer from OpenAI API:", error);
          document.getElementById("response").value = "Error: " + error.message;
        });
    } else {
      document.getElementById("response").value = "Please enter a question and API key.";
    }
  });
  
  function getAnswerFromOpenAI(apiKey, question, pageContent) {
    return new Promise(async (resolve, reject) => {
        const apiURL = "https://api.openai.com/v1/engines/text-davinci-002/completions";
  
      const prompt = `The following text is extracted from a web page: ${pageContent}\n\nQuestion: ${question}\nAnswer:`;
  
      try {
        const response = await fetch(apiURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: prompt,
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.8,
          }),
        });
  
        if (response.status !== 200) {
            const errorText = await response.text();
            reject(new Error(`Failed to get a response from the OpenAI API. Status: ${response.status}, Message: ${errorText}`));
          return;
        }
  
        const data = await response.json();
        const answer = data.choices && data.choices[0] && data.choices[0].text.trim();
        resolve(answer);
      } catch (error) {
        reject(error);
      }
    });
  }