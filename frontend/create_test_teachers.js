const XLSX = require("xlsx");

const headers = [
  "Teacher Name", 
  "EMIS ID", 
  "Subject Speciality", 
  "Phone Number", 
  "Email Address", 
  "Attendance Rate (%)", 
  "Performance Index", 
  "Leave Balance Used"
];

const testData = [
  {
    "Teacher Name": "Mrs. Aarthi R.",
    "EMIS ID": "TCH206",
    "Subject Speciality": "English",
    "Phone Number": "9876543225",
    "Email Address": "aarthi@emis.tn.gov.in",
    "Attendance Rate (%)": 100,
    "Performance Index": "Excellent",
    "Leave Balance Used": 0
  },
  {
    "Teacher Name": "Mr. Vijayakumar S.",
    "EMIS ID": "TCH207",
    "Subject Speciality": "Mathematics",
    "Phone Number": "9876543226",
    "Email Address": "vijay@emis.tn.gov.in",
    "Attendance Rate (%)": 97,
    "Performance Index": "Good",
    "Leave Balance Used": 1
  },
  {
    "Teacher Name": "", // Invalid row (missing name)
    "EMIS ID": "TCH208",
    "Subject Speciality": "Tamil",
    "Phone Number": "9876543227",
    "Email Address": "invalid@emis.tn.gov.in",
    "Attendance Rate (%)": 90,
    "Performance Index": "Average",
    "Leave Balance Used": 2
  }
];

const worksheet = XLSX.utils.json_to_sheet(testData, { header: headers });
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Test Teachers");
XLSX.writeFile(workbook, "test_teachers.xlsx");
console.log("Created test_teachers.xlsx successfully!");
