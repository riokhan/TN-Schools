const XLSX = require("xlsx");

const headers = [
  "Student Name", 
  "Roll Number", 
  "Class & Section", 
  "Phone Number", 
  "Parent Name", 
  "District", 
  "State", 
  "City", 
  "Pincode", 
  "Risk Level"
];

const testData = [
  {
    "Student Name": "Ramesh Kumar",
    "Roll Number": "HM10105",
    "Class & Section": "Class 10A",
    "Phone Number": "9876543210",
    "Parent Name": "Kumarasamy K.",
    "District": "Coimbatore",
    "State": "Tamil Nadu",
    "City": "Coimbatore",
    "Pincode": "641001",
    "Risk Level": "High"
  },
  {
    "Student Name": "Anitha S.",
    "Roll Number": "HM11202",
    "Class & Section": "Class 11B",
    "Phone Number": "9876543212",
    "Parent Name": "Senthil S.",
    "District": "Coimbatore",
    "State": "Tamil Nadu",
    "City": "Coimbatore",
    "Pincode": "641003",
    "Risk Level": "Medium"
  },
  {
    "Student Name": "", // Invalid row (missing name)
    "Roll Number": "HM12101",
    "Class & Section": "Class 12A",
    "Phone Number": "9876543215",
    "Parent Name": "Ramasamy A.",
    "District": "Coimbatore",
    "State": "Tamil Nadu",
    "City": "Coimbatore",
    "Pincode": "641004",
    "Risk Level": "Medium"
  }
];

const worksheet = XLSX.utils.json_to_sheet(testData, { header: headers });
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Test Students");
XLSX.writeFile(workbook, "test_students.xlsx");
console.log("Created test_students.xlsx successfully!");
