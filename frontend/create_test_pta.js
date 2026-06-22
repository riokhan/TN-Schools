const XLSX = require("xlsx");

const headers = [
  "Parent Name", 
  "Committee Role", 
  "Phone Number", 
  "Email Address", 
  "Ward Name", 
  "Ward Class & Section", 
  "Committee Term",
  "Password"
];

const testData = [
  {
    "Parent Name": "Mrs. Chitra J.",
    "Committee Role": "Joint Secretary (Parent)",
    "Phone Number": "+91 98765 43212",
    "Email Address": "chitra.j@gmail.com",
    "Ward Name": "J. Vignesh",
    "Ward Class & Section": "Class 10B",
    "Committee Term": "2025-26",
    "Password": "password123"
  },
  {
    "Parent Name": "Mr. Nagarajan P.",
    "Committee Role": "Treasurer (Parent)",
    "Phone Number": "+91 98765 43213",
    "Email Address": "nagarajan.p@gmail.com",
    "Ward Name": "N. Priya",
    "Ward Class & Section": "Class 11A",
    "Committee Term": "2025-26",
    "Password": "password123"
  },
  {
    "Parent Name": "", // Invalid row
    "Committee Role": "Member (Parent)",
    "Phone Number": "+91 98765 43214",
    "Email Address": "invalid@gmail.com",
    "Ward Name": "I. Test",
    "Ward Class & Section": "Class 9C",
    "Committee Term": "2025-26",
    "Password": "password123"
  }
];

const worksheet = XLSX.utils.json_to_sheet(testData, { header: headers });
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Test PTA");
XLSX.writeFile(workbook, "test_pta.xlsx");
console.log("Created test_pta.xlsx successfully!");
