const XLSX = require("xlsx");

const headers = ["Student Name", "Class & Section", "Risk Level", "Reason / Note"];
const testData = [
  {
    "Student Name": "Ramesh Kumar",
    "Class & Section": "Class 10A",
    "Risk Level": "High",
    "Reason / Note": "Failed to attend EMIS profile update"
  },
  {
    "Student Name": "Anitha S.",
    "Class & Section": "Class 11B",
    "Risk Level": "Medium",
    "Reason / Note": "Repeated absent warnings from teacher"
  },
  {
    "Student Name": "", // Invalid row (missing name)
    "Class & Section": "Class 12A",
    "Risk Level": "Low",
    "Reason / Note": "Missing name test"
  }
];

const worksheet = XLSX.utils.json_to_sheet(testData, { header: headers });
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Test Students");
XLSX.writeFile(workbook, "test_students.xlsx");
console.log("Created test_students.xlsx successfully!");
