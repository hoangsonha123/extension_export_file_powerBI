document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("exportBtn").addEventListener("click", () => {
        console.log("Đang gửi yêu cầu export_excel...");
        chrome.runtime.sendMessage({ action: "export_excel" });

        setTimeout(() => {
            if (chrome.runtime.lastError) {
                alert("Lỗi khi gửi message at popup.js line 8!");
                console.error("Lỗi khi gửi message:", chrome.runtime.lastError.message);
            } else {
                alert("Gửi thành công!");
                console.log("Gửi thành công!");
            }
        }, 500);
    });
});