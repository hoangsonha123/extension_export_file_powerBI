document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
            console.error("Không tìm thấy tab nào!");
            return;
        }

        console.log("Danh sách tabs:", tabs);


        chrome.tabs.sendMessage(tabs[0].id, { action: "open_month_dropdown" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Lỗi gửi message:", chrome.runtime.lastError.message);
                return;
            }

            if (!response || !response.success) {
                console.error("Không thể mở dropdown tháng!");
                return;
            }

            console.log("Dropdown đã mở, đợi 2 giây...");


            setTimeout(() => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "get_months" }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Lỗi gửi message:", chrome.runtime.lastError.message);
                        return;
                    }

                    if (!response || !response.success) {
                        console.error("Không lấy được danh sách tháng!");
                        return;
                    }

                    console.log("Danh sách tháng nhận được:", response.months);
                    updateMonthDropdown(response.months);
                });
            }, 2000);
        });
    });


    function updateMonthDropdown(months) {
        const dropdown = document.getElementById("monthDropdown");
        dropdown.innerHTML = "";

        months.forEach(month => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" value="${month}"> ${month}`;
            dropdown.appendChild(label);
            dropdown.appendChild(document.createElement("br"));
        });


        const checkboxes = document.querySelectorAll("#monthDropdown input");

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                const selectedMonths = Array.from(checkboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);

                console.log("Tháng đã chọn:", selectedMonths);
            });
        });
    }

    document.getElementById("exportBtn").addEventListener("click", () => {
        const checkboxes = document.querySelectorAll("#monthDropdown input:checked");
        const selectedMonths = Array.from(checkboxes).map(cb => cb.value);

        if (selectedMonths.length === 0) {
            alert("Vui lòng chọn ít nhất một tháng!");
            return;
        }

        console.log("Đang gửi yêu cầu export_excel...");

        chrome.runtime.sendMessage({ action: "export_excel", months: selectedMonths });

        setTimeout(() => {
            if (chrome.runtime.lastError) {
                alert("Lỗi khi gửi message!");
                console.error("Lỗi khi gửi message:", chrome.runtime.lastError.message);
            } else {
                alert("Gửi thành công!");
                console.log("Gửi thành công!");
            }
        }, 500);
    });
});







// document.addEventListener("DOMContentLoaded", () => {


//     // const dropdown = document.querySelector(".dropdown");
//     // const dropbtn = document.querySelector(".dropbtn");
//     const checkboxes = document.querySelectorAll(".label input");

//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         if (!tabs || tabs.length === 0) {
//             console.error("Không tìm thấy tab nào!");
//             return;
//         }

//         console.log("Danh sách tabs:", tabs); // Debug: kiểm tra tabs

//         // Bước 1: Gửi message để mở dropdown
//         chrome.tabs.sendMessage(tabs[0].id, { action: "open_month_dropdown" }, (response) => {
//             if (chrome.runtime.lastError) {
//                 console.error("Lỗi gửi message:", chrome.runtime.lastError.message);
//                 return;
//             }

//             if (!response || !response.success) {
//                 console.error("Không thể mở dropdown tháng!");
//                 return;
//             }

//             console.log("Dropdown đã mở, đợi 2 giây...");

//             // Bước 2: Chờ 2 giây rồi gửi request lấy danh sách tháng
//             setTimeout(() => {
//                 chrome.tabs.sendMessage(tabs[0].id, { action: "get_months" }, (response) => {
//                     if (chrome.runtime.lastError) {
//                         console.error("Lỗi gửi message:", chrome.runtime.lastError.message);
//                         return;
//                     }

//                     if (!response || !response.success) {
//                         console.error("Không lấy được danh sách tháng!");
//                         return;
//                     }

//                     console.log("Danh sách tháng nhận được:", response.months);
//                     updateMonthDropdown(response.months);
//                 });
//             }, 2000);
//         });
//     });


//     // dropbtn.addEventListener("click", (event) => {
//     //     event.stopPropagation();
//     //     dropdown.classList.toggle("active");
//     // });

//     checkboxes.forEach(checkbox => {
//         checkbox.addEventListener("change", () => {
//             const selectedMonths = Array.from(checkboxes)
//                 .filter(cb => cb.checked)
//                 .map(cb => cb.value);

//             dropbtn.textContent = selectedMonths.length
//                 ? selectedMonths.join(", ")
//                 : "Chọn tháng ▼";
//         });
//     });

//     // document.addEventListener("click", (event) => {
//     //     if (!dropdown.contains(event.target)) {
//     //         dropdown.classList.remove("active");
//     //     }
//     // });


//     document.getElementById("exportBtn").addEventListener("click", () => {


//         const selectedMonths = Array.from(checkboxes)
//             .filter(cb => cb.checked)
//             .map(cb => cb.value);

//         if (selectedMonths.length === 0) {
//             alert("Vui lòng chọn ít nhất một tháng!");
//             return;
//         }


//         console.log("Đang gửi yêu cầu export_excel...");

//         chrome.runtime.sendMessage({ action: "export_excel", months: selectedMonths });

//         setTimeout(() => {
//             if (chrome.runtime.lastError) {
//                 alert("Lỗi khi gửi message at popup.js line 8!");
//                 console.error("Lỗi khi gửi message:", chrome.runtime.lastError.message);
//             } else {
//                 alert("Gửi thành công!");
//                 console.log("Gửi thành công!");
//             }
//         }, 500);
//     });
// });


// function updateMonthDropdown(months) {
//     const dropdown = document.getElementById("monthDropdown");
//     dropdown.innerHTML = "";

//     months.forEach(month => {
//         const label = document.createElement("label");
//         label.innerHTML = `<input type="checkbox" value="${month}"> ${month}`;
//         dropdown.appendChild(label);
//         dropdown.appendChild(document.createElement("br"));
//     });
// }


