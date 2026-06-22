const XLSX = require("xlsx");

const headers = [
  "Alumni Name", 
  "Batch Year", 
  "Current Role", 
  "Phone Number", 
  "Email Address", 
  "Current Location", 
  "Contribution Value", 
  "Contribution Details"
];

const testData = [
  {
    "Alumni Name": "Dr. M. Senthil Kumar",
    "Batch Year": "1996",
    "Current Role": "Senior Research Fellow",
    "Phone Number": "9876543265",
    "Email Address": "senthil@gmail.com",
    "Current Location": "Bangalore",
    "Contribution Value": "₹1,00,000",
    "Contribution Details": "Sponsored laboratory glassware worth ₹1 Lakh"
  },
  {
    "Alumni Name": "Mrs. Subha R.",
    "Batch Year": "2003",
    "Current Role": "High School Principal",
    "Phone Number": "9876543266",
    "Email Address": "subha.r@gmail.com",
    "Current Location": "Madurai",
    "Contribution Value": "₹50,000",
    "Contribution Details": "Donated 100 library science volumes"
  },
  {
    "Alumni Name": "", // Invalid row
    "Batch Year": "2010",
    "Current Role": "Entrepreneur",
    "Phone Number": "9876543267",
    "Email Address": "invalid@gmail.com",
    "Current Location": "Coimbatore",
    "Contribution Value": "₹20,000",
    "Contribution Details": ""
  }
];

const worksheet = XLSX.utils.json_to_sheet(testData, { header: headers });
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Test Alumni");
XLSX.writeFile(workbook, "test_alumni.xlsx");
console.log("Created test_alumni.xlsx successfully!");
