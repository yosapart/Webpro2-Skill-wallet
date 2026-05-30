// frontend/workers/background-upload.worker.ts

self.addEventListener('message', async (event: MessageEvent) => {
  const { file, token, payload, uploadUrl, createRequestUrl } = event.data;

  try {
    let evidence_link = "";

    // 1. Upload the file if present
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();
      if (uploadResult.status === "success" && uploadResult.url) {
        evidence_link = uploadResult.url;
      } else {
        throw new Error(uploadResult.message || "Failed to retrieve uploaded file URL");
      }
    }

    // 2. Build final request payload
    const finalPayload = {
      ...payload,
      evidence_link: evidence_link
    };

    // 3. Create the Badge Request in the Database
    const requestResponse = await fetch(createRequestUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finalPayload)
    });

    if (!requestResponse.ok) {
      throw new Error(`Failed to create request with status ${requestResponse.status}`);
    }

    const requestResult = await requestResponse.json();
    if (requestResult.status === "success") {
      self.postMessage({ status: "success", data: requestResult });
    } else {
      throw new Error(requestResult.message || "Failed to create badge request in database");
    }

  } catch (error: any) {
    self.postMessage({ status: "error", error: error.message });
  }
});
