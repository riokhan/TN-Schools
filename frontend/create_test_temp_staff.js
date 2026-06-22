const XLSX = require("xlsx");

const headers = [
  "Staff Name", 
  "Designated Role", 
  "Source / Agency", 
  "Joined Date", 
  "Phone Number", 
  "Email Address", 
  "Contract Duration", 
  "Monthly Stipend",
  "Password"
];

const testData = [
  {
    "Staff Name": "Mrs. Kalaivani A.",
    "Designated Role": "Security Officer",
    "Source / Agency": "TN Outsourcing Ltd",
    "Joined Date": "Feb 2026",
    "Phone Number": "9876543250",
    "Email Address": "kalaivani@outsource.tn.gov.in",
    "Contract Duration": "12 Months",
    "Monthly Stipend": "₹11,000",
    "Password": "password123"
  },
  {
    "Staff Name": "Mr. Srinivasan K.",
    "Designated Role": "Lab Assistant",
    "Source / Agency": "Direct Contract",
    "Joined Date": "Jan 2026",
    "Phone Number": "9876543251",
    "Email Address": "srini.lab@gmail.com",
    "Contract Duration": "6 Months",
    "Monthly Stipend": "₹12,500",
    "Password": "password123"
  },
  {
    "Staff Name": "", // Invalid row
    "Designated Role": "Data Operator",
    "Source / Agency": "Direct Contract",
    "Joined Date": "Jan 2026",
    "Phone Number": "9876543252",
    "Email Address": "invalid@gmail.com",
    "Contract Duration": "12 Months",
    "Monthly Stipend": "₹14,000",
    "Password": "password123"
  }
];

const worksheet = XLSX.utils.json_to_sheet(testData, { header: headers });
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Test Temp Staff");
XLSX.writeFile(workbook, "test_temp_staff.xlsx");
console.log("Created test_temp_staff.xlsx successfully!");
