# 🔍 Complete Schema Analysis — Every Model, Every Gap

> **No changes made. Read-only deep inspection of `schema.prisma`.**

---

## 🏛️ Real-World Tamil Nadu Education Hierarchy

First, the full chain of command this system must support:

```
👨‍💼 MINISTER (Education Minister of Tamil Nadu)
       │  oversees entire state
       ▼
👨‍💼 COMMISSIONER (Commissioner of School Education)
       │  oversees all districts
       ▼
👨‍💼 DEO (District Education Officer)
       │  oversees one district (e.g. Coimbatore District)
       │  manages all BEOs in that district
       ▼
👨‍💼 BEO (Block Education Officer)
       │  oversees one block (e.g. Coimbatore North Block)
       │  manages all schools in that block
       ▼
🏫 HEADMASTER
       │  manages one school
       │  responsible for Staff, Students, Assets, Meals, Events
       ▼
┌──────────────────────┐
│  👩‍🏫 TEACHERS        │   each teacher → subjects → classes
│  📋 TEMP STAFF        │
│  🧹 NON-TEACHING STAFF│
└──────────────────────┘
       │
       ▼
🎒 STUDENTS  ←────────────► 👨‍👩‍👧 PARENTS
   (class, section, roll)        (can view child info)
```

---

## ✅ What the Role Enum has vs ❌ What's backed by a real model

```
enum Role {
  STUDENT      → ✅ has Student model
  PARENT       → ⚠️  has HeadmasterParent (not linked to User)
  TEACHER      → ✅ has Teacher model
  HEADMASTER   → ❌ NO Headmaster profile model
  BEO          → ❌ NO BEO profile model
  DEO          → ❌ NO DEO profile model
  COMMISSIONER → ❌ NO Commissioner profile model
  MINISTER     → ❌ NO Minister profile model
  SUPERADMIN   → ❌ NO SuperAdmin profile model
}
```

**5 out of 9 roles have no profile model.** They can log in (via User) but have nothing to store about themselves — no jurisdiction, no contact, no assigned schools/blocks/districts.

---

---

## 🔬 MODEL-BY-MODEL ANALYSIS

---

### 1. `User` — Auth Identity

```prisma
model User {
  id           String   — ✅ UUID primary key
  emisId       String?  — ✅ EMIS student ID (unique)
  aadhaarHash  String?  — ✅ hashed aadhaar (secure)
  mobile       String?  — ✅ unique mobile
  name         String   — ✅ full name
  email        String?  — ✅ unique email
  passwordHash String?  — ✅ hashed password
  role         Role     — ✅ role enum
  isActive     Boolean  — ✅ can deactivate accounts
  schoolId     String?  — ✅ linked to school
  student      Student? — ✅ 1:1 student profile
  teacher      Teacher? — ✅ 1:1 teacher profile
  notifications Notification[] — ✅ system notifications
}
```

| What's there | What's missing |
|---|---|
| Auth fields (password, email, mobile) | `headmasterId` — no 1:1 headmaster profile link |
| School link | `districtId` / `blockId` — for DEO/BEO users |
| Role-based relations to Student & Teacher | Profile links for Headmaster, BEO, DEO, Commissioner, Minister |
| `emisId` for EMIS tracking | `lastLoginAt` — no login activity tracking |
| | `photoUrl` — profile photo |
| | `designation` — for staff display |

---

### 2. `School` — The Central Hub

```prisma
model School {
  dise                String   — ✅ DISE code (unique ID)
  name                String   — ✅
  district            String   — ✅
  block               String   — ✅
  headmasterName      String?  — ⚠️ JUST TEXT, not a FK
  classes             String[] — ⚠️ just an array of strings
}
```

| What's there | What's missing |
|---|---|
| DISE code (correct unique ID) | `headmasterId FK → User.id` — must be a real link |
| district + block stored | `beoId FK` — which BEO oversees this school |
| School type, medium of instruction | `deoId FK` — which DEO oversees this block |
| Users, Students, Teachers linked | `taluk` — Tamil Nadu uses taluk-level geography |
| | `totalStudents`, `totalTeachers` (computed or cached) |
| | `latitude`, `longitude` — for geo-mapping |
| | `establishedYear` |
| | `affiliationBoard` — State Board, CBSE, ICSE |
| | `phone`, `email` — school contact info |
| | `noOfClassrooms`, `hasLibrary`, `hasCompLab` |

**Biggest gap:** `headmasterName` is a plain string. If the headmaster changes, this goes stale. It should be `headmasterId → User.id`.

---

### 3. `Student` — Academic Profile

```prisma
model Student {
  userId       — ✅ links to login
  schoolId     — ✅ links to school
  class        String — ⚠️ plain text "10"
  section      String — ⚠️ plain text "A"
  rollNumber   String? — ✅
  dob, gender, religion, caste — ✅
  parentName   String? — ⚠️ duplicate of HeadmasterParent.name
  parentMobile String? — ⚠️ duplicate of HeadmasterParent.phone
}
```

| What's there | What's missing |
|---|---|
| School + User link | No `classRoomId FK` — can't link to ClassRoom model |
| Demographics (gender, caste, DOB) | `aadharNumber` (hashed) |
| Roll number | `admissionNumber` (school's internal number) |
| Relations to Attendance, Marks, etc. | `admissionDate` |
| | `bloodGroup` |
| | `address`, `pincode` |
| | `previousSchool` |
| | `isDropout`, `dropoutReason` |
| | `transferCertificateNo` |

**Key duplication:** `Student.parentName` + `Student.parentMobile` are plain text duplicates of `HeadmasterParent.name` and `.phone`. These will go out of sync.

---

### 4. `Teacher` — Staff Profile

```prisma
model Teacher {
  userId      — ✅ links to login
  schoolId    — ✅ links to school
  employeeId  String? — ✅
  subjects    String[] — ⚠️ no class link
  qualification — ✅
  joiningDate — ✅
}
```

| What's there | What's missing |
|---|---|
| School + User link | `classTeacherOf` — which class/section this teacher is class teacher of |
| `subjects[]` (list of what they teach) | No link to `Timetable` (teacherId in Timetable is plain string) |
| Employment date + qualification | `designation` — HM, PG Teacher, BT Teacher, etc. |
| | `specialization` |
| | `payScale` |
| | `retirementDate` |
| | `inchargeRoles` — "Sports Coach", "Lab InCharge" |

**Biggest gap:** `Timetable.teacherId` is a `String?` with no `@relation` — Prisma will not enforce FK integrity. A teacher can be deleted and old timetables still reference a ghost ID.

---

### 5. `ClassRoom` — ⚠️ Orphaned Model

```prisma
model ClassRoom {
  schoolId     String — ⚠️ loose string, no @relation
  teacherId    String? — ⚠️ loose string, no @relation
  className    String
  section      String
  subject      String  — ⚠️ one subject per row, not full class
  roomNumber   String?
  totalStudents Int
}
```

This model exists but is **completely disconnected**:

| Problem | Impact |
|---|---|
| `schoolId` has no `@relation` | Not enforced; can store invalid school IDs |
| `teacherId` has no `@relation` | Not enforced; teacher deletions leave ghost references |
| It's not linked FROM `Student` | Can't know "which classroom does Arjun belong to?" |
| It's not linked FROM `Timetable` | Two systems describe classes independently |
| `totalStudents` is stored as Int | Will go stale — should be a `count()` query |
| One row = one subject | A class needs multiple subjects, so multiple rows needed |

**ClassRoom should replace `Student.class + Student.section` strings. Right now ClassRoom exists but is unused as a FK in Student.**

---

### 6. `HeadmasterParent` — Parent Record

```prisma
model HeadmasterParent {
  name         String — ✅
  phone        String — ✅
  email        String? — ✅
  studentName  String — ⚠️ TEXT DUPLICATE
  studentClass String — ⚠️ TEXT DUPLICATE
  term         String — ❓ unclear what this means
  password     String @default("123456") — 🚨 SECURITY RISK
  role         String — ⚠️ already in User.role enum
  schoolId     String? — ⚠️ loose string, no @relation
}
```

| What's there | What's missing |
|---|---|
| Name, phone, email | `userId FK → User.id` — parents cannot log in via User auth |
| ParentStudentLink (✅ correct design) | `occupation` |
| Notifications | `annualIncome` (for scholarship eligibility) |
| | `relationship` — "Father", "Mother", "Guardian" |
| | `aadhaarHash` |
| | `address` |

**Security issue:** `password String @default("123456")` — plaintext default password stored in DB. Should be `passwordHash` with bcrypt.

**`studentName` and `studentClass` are text fields that duplicate real Student data** — these will go out of sync when a student moves to the next class.

**`term` field** — unclear what this represents (academic term? role term?). Needs clarification.

---

### 7. `HeadmasterStaff` — ⚠️ Shadow Duplicate of `Teacher`

```prisma
model HeadmasterStaff {
  name        String — same as User.name
  emisId      String @unique — same as User.emisId
  subject     String — same as Teacher.subjects
  phone       String — same as User.mobile
  email       String? — same as User.email
  attendance  Float — should come from Attendance table
  performance String — should come from evaluations
  leaveUsed   Int — should come from LeaveRequest table
  password    String @default("123456") — 🚨 SECURITY RISK
  schoolId    String? — loose string, no @relation
}
```

**This is a FULL DUPLICATE of `Teacher`+`User` data maintained separately.**

| Problem | Impact |
|---|---|
| Stores name, email, phone, emisId | All already in `User` table |
| `attendance Float` | Stale immediately — Attendance table is the real source |
| `leaveUsed Int` | Stale immediately — should count from `LeaveRequest` |
| `password` plain text default | Security risk |
| Not linked to `Teacher` or `User` | Two separate records for the same person |

**Real-world scenario:** A teacher's email changes. Admin updates `User.email`. But `HeadmasterStaff.email` still shows the old one. Two different pages show different data.

---

### 8. `HeadmasterTempStaff` — Temporary Contract Staff

```prisma
model HeadmasterTempStaff {
  name     — ✅
  role     — ✅ (e.g. "Lab Assistant")
  agency   — ✅
  joined   String — ⚠️ should be DateTime
  phone    — ✅
  salary   String — ⚠️ should be Float/Int
  password String @default("123456") — 🚨 SECURITY RISK
  schoolId String? — loose string, no @relation
}
```

| What's there | What's missing |
|---|---|
| Agency, duration, salary | `contractEndDate DateTime` |
| Role/designation | `userId FK` (if temp staff needs portal access) |
| Status (Active/Inactive) | `documentUrl` (contract scan) |
| | `salary` should be `Float` not `String` |
| | `joined` should be `DateTime` not `String` |

---

### 9. `WatchlistStudent` — ⚠️ Shadow Duplicate of `Student`

```prisma
model WatchlistStudent {
  name       String — same as Student→User.name
  rollNumber String — same as Student.rollNumber
  class      String — same as Student.class
  phone      String — same as Student.parentMobile
  parentName String — same as Student.parentName
  risk       String — "High" | "Medium"
  schoolId   String? — loose string, no @relation
}
```

**This is another duplicate.** A watchlist should be a **flag on Student**, not a separate table that copies student data.

| Problem | Impact |
|---|---|
| Duplicates name, rollNo, class, phone from Student | Two sources of truth; data goes stale |
| No `studentId FK` | Can't link to the real student record |
| `schoolId` loose string | No enforced FK |

**Should be:** `WatchlistEntry { studentId FK, risk, reason, addedByUserId, createdAt }` — just a flag/tag on the existing student.

---

### 10. `Attendance` — ✅ Well Structured

```prisma
model Attendance {
  studentId — ✅ FK to Student
  schoolId  — ✅ FK to School
  date      — ✅ DateTime
  status    — ✅ AttendanceStatus enum (PRESENT/ABSENT/LATE/LEAVE)
  method    — ✅ "QR", "RFID", "Biometric", "Manual"
  @@unique([studentId, date]) — ✅ one record per student per day
}
```

| What's there | What's missing |
|---|---|
| Student + School FK | `markedByUserId FK → User.id` (who marked it?) |
| Proper unique constraint | `subject` — for subject-wise attendance (colleges do this) |
| Attendance method | `remarks` — reason for absence |
| Enum for status | `classId` — which class period was this for |

**Most complete model in the schema. Only minor additions needed.**

---

### 11. `Timetable` — ⚠️ Orphaned teacherId

```prisma
model Timetable {
  schoolId  — ✅ FK to School
  class     String — ⚠️ plain text
  section   String — ⚠️ plain text
  subject   String — ⚠️ plain text
  teacherId String? — ⚠️ NO @relation to Teacher
  dayOfWeek Int — ✅ 0=Mon..4=Fri
  period    Int — ✅ 1-8
  startTime String — ✅
  endTime   String — ✅
}
```

| What's there | What's missing |
|---|---|
| School FK | `teacher Teacher? @relation(...)` — proper FK to Teacher |
| Day + period + time | `classRoomId FK → ClassRoom.id` |
| Unique constraint per slot | `academicYear` — timetable changes each year |
| | `isActive` — flag for substitutions |
| | `substituteTeacherId` — for absent teacher replacements |
| | `roomNumber` — which room this period is in |

---

### 12. `Mark` — Academic Results

```prisma
model Mark {
  studentId  — ✅ FK to Student
  subject    String — ⚠️ plain text
  examType   String — ⚠️ plain text "Unit1", "Midterm"
  maxMarks   Int @default(100)
  scored     Int
  grade      String?
  academicYear String @default("2024-25")
}
```

| What's there | What's missing |
|---|---|
| Student link + exam type | `teacherId FK` — who entered/graded this |
| Academic year | `section`, `class` — must re-derive from Student |
| Grade field | `rank` — class rank for that exam |
| | `remarks` — teacher comment |
| | `isAbsent` — student absent for exam |
| | `examDate DateTime` |
| | `verifiedBy` — headmaster verification |

---

### 13. `LeaveRequest` — ⚠️ Disconnected from Student

```prisma
model LeaveRequest {
  type        String — ⚠️ e.g. "Sick", "Personal"
  duration    String — ⚠️ should be Int (days) or date range
  reason      String
  studentName String @default("Unknown") — ⚠️ TEXT NOT FK
  status      String @default("Pending")
  schoolId    String? — ⚠️ loose string
}
```

| What's there | What's missing |
|---|---|
| Type, reason, status | `studentId FK → Student.id` — critical missing link |
| School link (loose) | `appliedById FK → User.id` (who submitted?) |
| | `approvedById FK → User.id` (who approved?) |
| | `fromDate DateTime`, `toDate DateTime` — proper date range |
| | `attachmentUrl` — medical certificate, etc. |
| | `approvedAt DateTime` |
| | `remarks` — headmaster's comment on approval |

**`studentName` is plain text — you can never filter "show all leaves for Arjun" by student ID.**

---

### 14. `Homework` — Assignment Model

```prisma
model Homework {
  title       — ✅
  className   String — ⚠️ plain text (no FK)
  dueDate     String — ⚠️ should be DateTime
  description — ✅
  status      — ✅ "active/draft/completed"
  schoolId    String? — ⚠️ loose string
}
```

| What's there | What's missing |
|---|---|
| Title, description, status | `teacherId FK → Teacher.id` — who assigned it? |
| School link (loose) | `subject` — which subject? |
| Submissions relation | `section` — which sections? |
| | `dueDate` should be `DateTime` not `String` |
| | `classRoomId FK → ClassRoom.id` |

---

### 15. `HomeworkSubmission` — Student Submission

```prisma
model HomeworkSubmission {
  homeworkId — ✅ FK to Homework
  rollNo     String — ⚠️ not linked to Student
  name       String — ⚠️ text copy of student name
  status     — ✅
  score      String? — ⚠️ should be Float
}
```

| Problem | What it should be |
|---|---|
| `rollNo` is plain text | `studentId FK → Student.id` |
| `name` is text copy | Remove — derive from `Student → User.name` |
| `score String?` | `score Float?` |
| | `submittedAt DateTime` |
| | `fileUrl` — submitted file |
| | `teacherRemarks` |

---

### 16. `EvaluationSubmission` — AI OCR Grading

```prisma
model EvaluationSubmission {
  studentName String — ⚠️ text copy
  rollNo      String — ⚠️ no FK
  ocrContent  Json   — ✅ AI OCR data
  schoolId    String? — loose string
}
```

Same issue as HomeworkSubmission — `studentName` and `rollNo` are text copies with no FK to `Student`.

---

### 17. `MidDayMeal` — MDM Tracking

```prisma
model MidDayMeal {
  schoolId       String — ✅ (but no @relation)
  date           DateTime — ✅
  studentsServed Int — ✅
  menuItems      String[] — ✅
  stockUsedKg    Float? — ✅
  supplierId     String? — ⚠️ no Supplier model
}
```

| What's there | What's missing |
|---|---|
| Date, menu, stock tracking | `schoolId` has no `@relation` directive |
| Waste percentage | `supplierName` (or a real Supplier model) |
| Students served count | `recordedByUserId FK` — who entered the data? |
| | `qualityRating` |
| | `remarks` |

---

### 18. `SchoolAsset` — Asset Management

```prisma
model SchoolAsset {
  schoolId     String — ⚠️ no @relation
  category     String — "SmartClassroom", "Computer", etc.
  name         String
  quantity     Int
  condition    String @default("Good")
  purchaseDate DateTime?
  value        Float?
}
```

| What's there | What's missing |
|---|---|
| Category, quantity, condition | `schoolId` has no `@relation` |
| Purchase date + value | `assetTag` — unique tag per asset |
| | `warrantyExpiry DateTime` |
| | `lastMaintenanceDate DateTime` |
| | `vendorName` |
| | `invoiceNumber` |
| | `location` — which room/lab |

---

### 19. `PTAMeeting` — Parent-Teacher Association

```prisma
model PTAMeeting {
  schoolId    String? — ⚠️ loose string
  title, description, meetingDate, venue, status — ✅
  agenda      String[] — ✅
}
```

| What's there | What's missing |
|---|---|
| All basic meeting info | `schoolId` has no `@relation` |
| Agenda as array | `createdByUserId FK` — who created? |
| Status tracking | `minutesUrl` — link to meeting minutes |
| | `attendeeCount` |
| | `parentAttendance` — which parents attended |

---

### 20. `Announcement` — Broadcast Messages

```prisma
model Announcement {
  target       String — ⚠️ plain text "Class 10A Parents"
  sender       String — ⚠️ plain text "You (Science Specialist)"
  readReceipts String? @default("0/40 read") — ⚠️ text counter
  schoolId     String? — ⚠️ loose
}
```

| Problem | What it should be |
|---|---|
| `target` is plain text | `targetRole Role[]`, `targetClass String?`, `targetSection String?` |
| `sender` is plain text | `senderUserId FK → User.id` |
| `readReceipts` is a string counter | A separate `AnnouncementRead { userId, announcementId, readAt }` table |
| | `attachmentUrl` |
| | `expiresAt DateTime` |

---

### 21. `StudyMaterial` — Learning Resources

```prisma
model StudyMaterial {
  classSection String — ⚠️ plain text "Class 10A"
  format       String — ⚠️ plain text "PDF"
  size         String — ⚠️ plain text "2.4 MB"
  date         String @default("Today") — ⚠️ should be DateTime
  schoolId     String? — ⚠️ loose
}
```

| What's there | What's missing |
|---|---|
| Title, category, format | `uploadedByUserId FK → Teacher.id` |
| School link (loose) | `fileUrl` — actual file storage URL |
| | `classSection` should be `class + section` fields or `classRoomId FK` |
| | `date` should be `DateTime` |
| | `size` should be `Int` (bytes) |
| | `downloadCount Int` |

---

### 22. `LessonPlan` — Teacher Planning

```prisma
model LessonPlan {
  syllabus, grade, subject, topic, duration — ✅
  planData  Json — ✅
  schoolId  String? — ⚠️ loose
}
```

| What's there | What's missing |
|---|---|
| Core lesson plan fields | `teacherId FK → Teacher.id` |
| JSON for flexible AI content | `classRoomId FK` |
| | `status` — "Draft", "Approved", "Archived" |
| | `approvedByUserId FK → User.id` (headmaster approval) |
| | `academicYear` |

---

### 23. `Question` + `StudentBadge` + `LabEquipment`

**Question:**
- Missing: `createdByUserId FK → Teacher.id`
- Missing: `approvedBy` (for moderation)
- `schoolId` is loose

**StudentBadge:**
- Has `studentId` but no `@relation` to Student model declared
- `studentName`, `classSection` are text copies
- Missing: `awardedByUserId FK → Teacher.id`
- Missing: `awardDate DateTime` (only has `createdAt`)

**LabEquipment:**
- `classSection String` — plain text, not linked to ClassRoom
- `date String` — should be `DateTime`
- Missing: `safetyInspectorId FK → Teacher.id`
- `schoolId` is loose

---

### 24. `Notification` vs `ParentNotification` — Two Notification Systems

```
Notification        → linked to User (generic system notification)
ParentNotification  → linked to HeadmasterParent (parent-specific)
```

| Problem | Impact |
|---|---|
| Two separate notification systems | Different code paths, inconsistent behaviour |
| `ParentNotification` is not linked to `User` | Parents using `User` auth won't get `ParentNotification` |
| `Notification` has only `message` | No `type`, no `title`, no `link/action` |
| Neither has `priority` | Can't distinguish urgent alerts |

---

---

## 📊 Master Gap Summary Table

| Model | Severity | Main Issues |
|---|---|---|
| **User** | 🟡 Medium | No profile models for Headmaster/BEO/DEO/Commissioner/Minister |
| **School** | 🔴 High | `headmasterName` is text; no `beoId`/`deoId` hierarchy FKs |
| **Student** | 🟡 Medium | `parentName/Mobile` duplicated; no `classRoomId`; missing fields |
| **Teacher** | 🟡 Medium | `subjects[]` not class-linked; `Timetable.teacherId` unenforceable |
| **ClassRoom** | 🔴 High | Exists but completely orphaned — not used as FK anywhere |
| **HeadmasterParent** | 🔴 High | No `userId`; plain-text password; text duplicates of student data |
| **HeadmasterStaff** | 🔴 High | Full duplicate of Teacher+User; stale computed fields; plain-text password |
| **HeadmasterTempStaff** | 🟡 Medium | `joined`/`salary` wrong types; plain-text password |
| **WatchlistStudent** | 🔴 High | Full duplicate of Student data; no `studentId FK` |
| **Attendance** | 🟢 Low | Well structured; minor additions only |
| **Timetable** | 🟡 Medium | `teacherId` is plain string with no `@relation` |
| **Mark** | 🟡 Medium | Missing `teacherId`, `examDate`, subject-class link |
| **LeaveRequest** | 🔴 High | No `studentId FK`; `studentName` is plain text |
| **Homework** | 🟡 Medium | No `teacherId`; `dueDate` is String; no subject |
| **HomeworkSubmission** | 🔴 High | `rollNo`/`name` plain text copies; no `studentId FK` |
| **EvaluationSubmission** | 🔴 High | `studentName`/`rollNo` plain text; no `studentId FK` |
| **MidDayMeal** | 🟢 Low | `schoolId` lacks `@relation`; no recorder FK |
| **SchoolAsset** | 🟡 Medium | `schoolId` lacks `@relation`; missing maintenance tracking |
| **PTAMeeting** | 🟢 Low | `schoolId` lacks `@relation`; minor additions |
| **Announcement** | 🟡 Medium | `target`/`sender` plain text; `readReceipts` is a string counter |
| **StudyMaterial** | 🟡 Medium | Wrong field types (`date`, `size`); no file URL; no teacher FK |
| **LessonPlan** | 🟡 Medium | Missing `teacherId FK` |
| **StudentBadge** | 🟡 Medium | `studentId` not formally declared as `@relation` to Student |
| **LabEquipment** | 🟡 Medium | `date` is String; `schoolId` loose |
| **Question** | 🟢 Low | Missing `teacherId FK` |
| **Notification** | 🟡 Medium | Two notification systems; inconsistent; no `type`/`title` |

---

## 🔴 Top 5 Most Critical Issues

```
1. HeadmasterStaff = duplicate Teacher
   → Same teacher exists in TWO tables with diverging data

2. WatchlistStudent = duplicate Student  
   → Copy of student data that goes stale immediately

3. HeadmasterParent has no userId
   → Parents cannot log in; password stored as plain text "123456"

4. ClassRoom model exists but is never used as a FK
   → Student.class is still a plain string "10"; ClassRoom is orphaned

5. No hierarchy models for Headmaster/BEO/DEO/Commissioner/Minister
   → 5 roles in the enum have no profile, no jurisdiction, no data
```

---

## 🌊 Data Flow Gaps Per Hierarchy Level

```
MINISTER
  → Can see all districts         ✅ (via User.role = MINISTER)
  → Has a profile with contact    ❌ No Minister model
  → Manages Commissioners         ❌ No link

COMMISSIONER
  → Oversees all DEOs             ❌ No Commissioner model
  → Assigned to a region          ❌ No region field

DEO
  → Oversees a district           ❌ No DEO model; no districtId
  → Manages BEOs in district      ❌ No link to BEO

BEO
  → Oversees a block              ❌ No BEO model; no blockId
  → Manages schools in block      ❌ School has no beoId FK

HEADMASTER
  → Manages one school            ⚠️ School.headmasterName is text only
  → Views all teachers/students   ✅ via schoolId
  → Approves leave                ❌ LeaveRequest has no approvedById

TEACHER
  → Teaches specific classes      ⚠️ Timetable.teacherId is not enforced
  → Enters marks                  ⚠️ Mark has no teacherId
  → Assigns homework              ⚠️ Homework has no teacherId

STUDENT
  → Belongs to a class            ⚠️ class is plain text, ClassRoom unused
  → Has parents linked            ✅ via ParentStudentLink

PARENT
  → Sees child's details          ✅ via ParentStudentLink → Student
  → Can log in                    ❌ No userId on HeadmasterParent
  → Gets notifications            ✅ ParentNotification works
```
