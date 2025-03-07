chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Nhận được yêu cầu:", request);
    
    if (request.action === "export_excel") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                console.error("Không tìm thấy tab nào!");
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, { action: "get_token" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Lỗi khi gửi tin nhắn đến content.js:", chrome.runtime.lastError.message);
                } else if (!response || !response.secret) {
                    console.error("Không nhận được token từ content.js");
                } else {
                    console.log("Token nhận được:", response.secret);
                    chrome.tabs.sendMessage(tabs[0].id, { action: "call_api", token: response.secret });
                }
            });
        });
    }
});