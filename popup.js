document.addEventListener("DOMContentLoaded", () => {
    const tokenBox = document.getElementById("tokenBox");
    const getTokenBtn = document.getElementById("getTokenBtn");
    const copyBtn = document.getElementById("copyBtn");
    const notification = document.getElementById("notification");

    function showNotification(message, isSuccess) {
        notification.textContent = message;
        notification.className = isSuccess ? "success" : "error";
        notification.style.display = "block";
        
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }

    getTokenBtn.addEventListener("click", async () => {
        try {
            showNotification("Đang lấy token...", true);
            
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) {
                showNotification("Không tìm thấy tab Power BI", false);
                return;
            }

            const response = await chrome.tabs.sendMessage(tab.id, { action: "get_token" });
            
            if (response?.token) {
                tokenBox.value = response.token;
                showNotification("Lấy token thành công!", true);
            } else {
                throw new Error(response?.error || "Không nhận được token");
            }
        } catch (error) {
            console.error("Lỗi khi lấy token:", error);
            tokenBox.value = "";
            showNotification(`Lỗi: ${error.message}`, false);
        }
    });

    copyBtn.addEventListener("click", () => {
        if (!tokenBox.value.trim()) {
            showNotification("Không có token để copy!", false);
            return;
        }
        
        tokenBox.select();
        document.execCommand("copy");
        showNotification("Đã copy token vào clipboard!", true);
    });
});