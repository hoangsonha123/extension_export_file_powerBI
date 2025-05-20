chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get_token") {
        try {

            const keys = Object.keys(sessionStorage);
            
            const tokenKey = keys.find(key => key.includes("token"));
            if (!tokenKey) {
                throw new Error("Không tìm thấy token trong sessionStorage");
            }

            const tokenData = JSON.parse(sessionStorage.getItem(tokenKey));
            if (!tokenData?.secret) {
                throw new Error("Token không hợp lệ");
            }

            sendResponse({ token: tokenData.secret });
        } catch (error) {
            console.error("Lỗi khi lấy token:", error);
            sendResponse({ error: error.message });
        }
        return true;
    }
});
