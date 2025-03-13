chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    
    if (request.action === "open_month_dropdown") {
        let dropdown = document.querySelector(".slicer-dropdown-menu");

        if (!dropdown) {
            console.error("Không tìm thấy dropdown tháng!");
            sendResponse({ success: false });
            return;
        }

        if (!dropdown.classList.contains("open")) {
            dropdown.click();
            console.log("Đã mở dropdown...");
        }

        sendResponse({ success: true });
    }

    if (request.action === "get_months") {
        try {
            let monthElements = document.querySelectorAll(".slicerText");

            let months = Array.from(monthElements).map(el => el.innerText.trim());

            console.log("Các tháng lấy được:", months);
            sendResponse({ success: true, months: months });

        } catch (error) {
            console.error("Lỗi khi lấy tháng:", error);
            sendResponse({ success: false, months: [] });
        }
        return true;
    }

    if (request.action === "get_token") {
        try {
            let keyResult = sessionStorage.key(1);
            let token = sessionStorage.getItem(keyResult);

            if (token) {
                const tokenObject = JSON.parse(token);
                sendResponse({ secret: tokenObject.secret });
            } else {
                alert("Không tìm thấy token trong sessionStorage!");
                console.error("Không tìm thấy token trong sessionStorage!");
                sendResponse({ secret: null });
            }
        } catch (error) {
            alert("Lỗi khi lấy token:", error);
            console.error("Lỗi khi lấy token:", error);
            sendResponse({ secret: null });
        }
    }

    if (request.action === "call_api") {

        try {
            const selectedMonths = request.months || [
                [
                    {
                        "Literal": {
                            "Value": "'2025 Feb'"
                        }
                    }
                ]
            ];

            const filtersDescription = `Applied filters:\nYear Month is ${selectedMonths.join(" or ")}\nRole Code is ROLE-A-SIP`;

            const formattedMonths = selectedMonths.map(month => [
                {
                    "Literal": {
                        "Value": `'${month}'`
                    }
                }
            ]);


            const exportResponse = await fetch(
                "https://wabi-north-europe-redirect.analysis.windows.net/export/xlsx",
                {
                    method: "POST",
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "content-type": "application/json;charset=UTF-8",
                        "authorization": `Bearer ${request.token}`,
                        "origin": "https://app.powerbi.com",
                        "referer": "https://app.powerbi.com/"
                    },
                    body: JSON.stringify({
                        "exportDataType": 2,
                        "executeSemanticQueryRequest": {
                            "version": "1.0.0",
                            "queries": [
                                {
                                    "Query": {
                                        "Commands": [
                                            {
                                                "SemanticQueryDataShapeCommand": {
                                                    "Query": {
                                                        "Version": 2,
                                                        "From": [
                                                            {
                                                                "Name": "d1",
                                                                "Entity": "Dim_Date",
                                                                "Type": 0
                                                            },
                                                            {
                                                                "Name": "d2",
                                                                "Entity": "Dim_Employee",
                                                                "Type": 0
                                                            },
                                                            {
                                                                "Name": "d",
                                                                "Entity": "Dim_Store",
                                                                "Type": 0
                                                            },
                                                            {
                                                                "Name": "f",
                                                                "Entity": "Fact_PJP",
                                                                "Type": 0
                                                            },
                                                            {
                                                                "Name": "d11",
                                                                "Entity": "Dim_Salesforce",
                                                                "Type": 0
                                                            }
                                                        ],
                                                        "Select": [
                                                            {
                                                                "Column": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "d1"
                                                                        }
                                                                    },
                                                                    "Property": "Date"
                                                                },
                                                                "Name": "Dim_Date.Date"
                                                            },
                                                            {
                                                                "Column": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "d2"
                                                                        }
                                                                    },
                                                                    "Property": "Employee"
                                                                },
                                                                "Name": "Dim_Employee.Employee"
                                                            },
                                                            {
                                                                "Column": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "d"
                                                                        }
                                                                    },
                                                                    "Property": "Store"
                                                                },
                                                                "Name": "Dim_Store.Store"
                                                            },
                                                            {
                                                                "Aggregation": {
                                                                    "Expression": {
                                                                        "Column": {
                                                                            "Expression": {
                                                                                "SourceRef": {
                                                                                    "Source": "f"
                                                                                }
                                                                            },
                                                                            "Property": "First CI Time"
                                                                        }
                                                                    },
                                                                    "Function": 3
                                                                },
                                                                "Name": "Min(Fact_PJP.First CI Time)"
                                                            },
                                                            {
                                                                "Aggregation": {
                                                                    "Expression": {
                                                                        "Column": {
                                                                            "Expression": {
                                                                                "SourceRef": {
                                                                                    "Source": "f"
                                                                                }
                                                                            },
                                                                            "Property": "First CO Time"
                                                                        }
                                                                    },
                                                                    "Function": 3
                                                                },
                                                                "Name": "Min(Fact_PJP.First CO Time)"
                                                            },
                                                            {
                                                                "Aggregation": {
                                                                    "Expression": {
                                                                        "Column": {
                                                                            "Expression": {
                                                                                "SourceRef": {
                                                                                    "Source": "f"
                                                                                }
                                                                            },
                                                                            "Property": "Last CI Time"
                                                                        }
                                                                    },
                                                                    "Function": 4
                                                                },
                                                                "Name": "Max(Fact_PJP.Last CI Time)"
                                                            },
                                                            {
                                                                "Aggregation": {
                                                                    "Expression": {
                                                                        "Column": {
                                                                            "Expression": {
                                                                                "SourceRef": {
                                                                                    "Source": "f"
                                                                                }
                                                                            },
                                                                            "Property": "Last CO Time"
                                                                        }
                                                                    },
                                                                    "Function": 4
                                                                },
                                                                "Name": "Max(Fact_PJP.Last CO Time)"
                                                            },
                                                            {
                                                                "Measure": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "f"
                                                                        }
                                                                    },
                                                                    "Property": "%PJP"
                                                                },
                                                                "Name": "Fact_PJP.%PJP",
                                                                "NativeReferenceName": "%PJP"
                                                            },
                                                            {
                                                                "Column": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "d2"
                                                                        }
                                                                    },
                                                                    "Property": "Partner Code"
                                                                },
                                                                "Name": "Dim_Employee.Partner Code",
                                                                "NativeReferenceName": "Partner Code"
                                                            },
                                                            {
                                                                "Column": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "d2"
                                                                        }
                                                                    },
                                                                    "Property": "Employee Code"
                                                                },
                                                                "Name": "Dim_Employee.Employee Code",
                                                                "NativeReferenceName": "Employee Code"
                                                            },
                                                            {
                                                                "Column": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "d2"
                                                                        }
                                                                    },
                                                                    "Property": "Role Code"
                                                                },
                                                                "Name": "Dim_Employee.Role Code",
                                                                "NativeReferenceName": "Role Code"
                                                            },
                                                            {
                                                                "Column": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "d"
                                                                        }
                                                                    },
                                                                    "Property": "Store Code"
                                                                },
                                                                "Name": "Dim_Store.Store Code",
                                                                "NativeReferenceName": "Store Code"
                                                            },
                                                            {
                                                                "Column": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "d2"
                                                                        }
                                                                    },
                                                                    "Property": "Line Manager Code"
                                                                },
                                                                "Name": "Dim_Employee.Line Manager Code",
                                                                "NativeReferenceName": "Line Manager Code"
                                                            },
                                                            {
                                                                "Column": {
                                                                    "Expression": {
                                                                        "SourceRef": {
                                                                            "Source": "d"
                                                                        }
                                                                    },
                                                                    "Property": "KA"
                                                                },
                                                                "Name": "Dim_Store.KA",
                                                                "NativeReferenceName": "KA"
                                                            }
                                                        ],
                                                        "Where": [
                                                            {
                                                                "Condition": {
                                                                    "In": {
                                                                        "Expressions": [
                                                                            {
                                                                                "Column": {
                                                                                    "Expression": {
                                                                                        "SourceRef": {
                                                                                            "Source": "d1"
                                                                                        }
                                                                                    },
                                                                                    "Property": "Year Month"
                                                                                }
                                                                            }
                                                                        ],
                                                                        "Values": formattedMonths
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                "Condition": {
                                                                    "In": {
                                                                        "Expressions": [
                                                                            {
                                                                                "Column": {
                                                                                    "Expression": {
                                                                                        "SourceRef": {
                                                                                            "Source": "f"
                                                                                        }
                                                                                    },
                                                                                    "Property": "Role Code"
                                                                                }
                                                                            }
                                                                        ],
                                                                        "Values": [
                                                                            [
                                                                                {
                                                                                    "Literal": {
                                                                                        "Value": "'ROLE-A-SIP'"
                                                                                    }
                                                                                }
                                                                            ]
                                                                        ]
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                "Condition": {
                                                                    "Comparison": {
                                                                        "ComparisonKind": 0,
                                                                        "Left": {
                                                                            "Column": {
                                                                                "Expression": {
                                                                                    "SourceRef": {
                                                                                        "Source": "f"
                                                                                    }
                                                                                },
                                                                                "Property": "Leave Request Flag"
                                                                            }
                                                                        },
                                                                        "Right": {
                                                                            "Literal": {
                                                                                "Value": "0L"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                "Condition": {
                                                                    "In": {
                                                                        "Expressions": [
                                                                            {
                                                                                "Column": {
                                                                                    "Expression": {
                                                                                        "SourceRef": {
                                                                                            "Source": "d11"
                                                                                        }
                                                                                    },
                                                                                    "Property": "ROLE PJP"
                                                                                }
                                                                            }
                                                                        ],
                                                                        "Values": [
                                                                            [
                                                                                {
                                                                                    "Literal": {
                                                                                        "Value": "'MER'"
                                                                                    }
                                                                                }
                                                                            ],
                                                                            [
                                                                                {
                                                                                    "Literal": {
                                                                                        "Value": "'SABA'"
                                                                                    }
                                                                                }
                                                                            ],
                                                                            [
                                                                                {
                                                                                    "Literal": {
                                                                                        "Value": "'SIP'"
                                                                                    }
                                                                                }
                                                                            ],
                                                                            [
                                                                                {
                                                                                    "Literal": {
                                                                                        "Value": "'SR'"
                                                                                    }
                                                                                }
                                                                            ]
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        ],
                                                        "OrderBy": [
                                                            {
                                                                "Direction": 1,
                                                                "Expression": {
                                                                    "Measure": {
                                                                        "Expression": {
                                                                            "SourceRef": {
                                                                                "Source": "f"
                                                                            }
                                                                        },
                                                                        "Property": "%PJP"
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    "Binding": {
                                                        "Primary": {
                                                            "Groupings": [
                                                                {
                                                                    "Projections": [
                                                                        0,
                                                                        1,
                                                                        2,
                                                                        3,
                                                                        4,
                                                                        5,
                                                                        6,
                                                                        7,
                                                                        8,
                                                                        9,
                                                                        10,
                                                                        11,
                                                                        12,
                                                                        13
                                                                    ],
                                                                    "Subtotal": 1
                                                                }
                                                            ]
                                                        },
                                                        "DataReduction": {
                                                            "Primary": {
                                                                "Top": {
                                                                    "Count": 1000000
                                                                }
                                                            },
                                                            "Secondary": {
                                                                "Top": {
                                                                    "Count": 100
                                                                }
                                                            }
                                                        },
                                                        "Version": 1
                                                    }
                                                }
                                            },
                                            {
                                                "ExportDataCommand": {
                                                    "Columns": [
                                                        {
                                                            "QueryName": "Dim_Date.Date",
                                                            "Name": "Date"
                                                        },
                                                        {
                                                            "QueryName": "Dim_Employee.Employee",
                                                            "Name": "Employee"
                                                        },
                                                        {
                                                            "QueryName": "Dim_Store.Store",
                                                            "Name": "Store"
                                                        },
                                                        {
                                                            "QueryName": "Min(Fact_PJP.First CI Time)",
                                                            "Name": "First CI"
                                                        },
                                                        {
                                                            "QueryName": "Min(Fact_PJP.First CO Time)",
                                                            "Name": "First CO"
                                                        },
                                                        {
                                                            "QueryName": "Max(Fact_PJP.Last CI Time)",
                                                            "Name": "Last CI"
                                                        },
                                                        {
                                                            "QueryName": "Max(Fact_PJP.Last CO Time)",
                                                            "Name": "Last CO"
                                                        },
                                                        {
                                                            "QueryName": "Fact_PJP.%PJP",
                                                            "Name": "%PJP"
                                                        },
                                                        {
                                                            "QueryName": "Dim_Employee.Partner Code",
                                                            "Name": "Partner Code"
                                                        },
                                                        {
                                                            "QueryName": "Dim_Employee.Employee Code",
                                                            "Name": "Employee Code"
                                                        },
                                                        {
                                                            "QueryName": "Dim_Employee.Role Code",
                                                            "Name": "Role Code"
                                                        },
                                                        {
                                                            "QueryName": "Dim_Store.Store Code",
                                                            "Name": "Store Code"
                                                        },
                                                        {
                                                            "QueryName": "Dim_Employee.Line Manager Code",
                                                            "Name": "Line Manager Code"
                                                        },
                                                        {
                                                            "QueryName": "Dim_Store.KA",
                                                            "Name": "KA"
                                                        }
                                                    ],
                                                    "Ordering": [
                                                        8,
                                                        0,
                                                        9,
                                                        1,
                                                        10,
                                                        11,
                                                        2,
                                                        3,
                                                        4,
                                                        5,
                                                        6,
                                                        7,
                                                        12,
                                                        13
                                                    ],
                                                    "FiltersDescription": filtersDescription
                                                }
                                            }
                                        ]
                                    }
                                }
                            ],
                            "cancelQueries": [],
                            "modelId": 20237961,
                            "userPreferredLocale": "en-US"
                        },
                        "artifactId": 19644382
                    })
                }
            );

            if (exportResponse.ok) {
                const blob = await exportResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "exportPJPExtension.xlsx";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert("Tải file thành công!")
                console.log("Tải file thành công!");
            } else {
                alert("Lỗi khi xuất dữ liệu:");
                console.error("Lỗi khi xuất dữ liệu:", await exportResponse.text());
            }
        } catch (error) {
            alert("Lỗi khi gọi API:", error);
            console.error("Lỗi khi gọi API:", error);
        }
    }

    return true;
});