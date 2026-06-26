# 🏫 TN-Schools — Database Structure Overview

## 1. High-Level Entity Map

```mermaid
graph TD
    SCHOOL["🏫 School\n(Central Hub)"]
    USER["👤 User\n(Auth Layer)"]
    STUDENT["🎒 Student"]
    TEACHER["📚 Teacher"]
    PARENT["👨‍👩‍👧 HeadmasterParent"]
    PSL["🔗 ParentStudentLink\n(Join Table)"]

    SCHOOL -->|"has many"| USER
    SCHOOL -->|"has many"| STUDENT
    SCHOOL -->|"has many"| TEACHER
    USER -->|"1-to-1"| STUDENT
    USER -->|"1-to-1"| TEACHER
    PARENT -->|"through PSL"| PSL
    STUDENT -->|"through PSL"| PSL
```

---

## 2. Full Entity-Relationship Diagram

```mermaid
erDiagram
    School {
        String id PK
        String dise UK
        String name
        String district
        String block
        String headmasterName
        String[] classes
    }

    User {
        String id PK
        String emisId UK
        String mobile UK
        String email UK
        String name
        Role   role
        String schoolId FK
    }

    Student {
        String id PK
        String userId FK
        String schoolId FK
        String class
        String section
        String rollNumber
        String caste
        String parentName
    }

    Teacher {
        String id PK
        String userId FK
        String schoolId FK
        String employeeId UK
        String[] subjects
        String qualification
    }

    HeadmasterParent {
        String id PK
        String name
        String phone
        String studentName
        String schoolId FK
    }

    ParentStudentLink {
        String id PK
        String parentId FK
        String studentId FK
        Boolean isPrimary
    }

    ParentNotification {
        String id PK
        String parentId FK
        String studentId
        String type
        String title
        Boolean isRead
    }

    Attendance {
        String id PK
        String studentId FK
        String schoolId FK
        DateTime date
        AttendanceStatus status
        String method
    }

    Mark {
        String id PK
        String studentId FK
        String subject
        String examType
        Int scored
        String academicYear
    }

    Scholarship {
        String id PK
        String studentId FK
        String scheme
        Float amount
        ScholarshipStatus status
    }

    LeaveRequest {
        String id PK
        String type
        String duration
        String reason
        String studentName
        String status
        String schoolId FK
    }

    Timetable {
        String id PK
        String schoolId FK
        String class
        String section
        Int dayOfWeek
        Int period
        String subject
        String teacherId FK
    }

    Homework {
        String id PK
        String schoolId FK
        String title
        String className
        String dueDate
        String status
    }

    HomeworkSubmission {
        String id PK
        String homeworkId FK
        String rollNo
        String name
        String status
    }

    PTAMeeting {
        String id PK
        String schoolId FK
        String title
        DateTime meetingDate
        String status
    }

    Club {
        String id PK
        String schoolId FK
        String name
        String category
    }

    ClubMember {
        String id PK
        String clubId FK
        String studentId FK
        String role
    }

    Portfolio {
        String id PK
        String studentId FK
        String bio
        String stream
    }

    SportsProfile {
        String id PK
        String studentId FK
    }

    School ||--o{ User : "has users"
    School ||--o{ Student : "enrolls"
    School ||--o{ Teacher : "employs"
    School ||--o{ Attendance : "tracks"
    School ||--o{ Timetable : "schedules"
    School ||--o{ LeaveRequest : "receives"
    School ||--o{ Homework : "assigns"
    School ||--o{ PTAMeeting : "hosts"
    School ||--o{ Club : "runs"

    User ||--o| Student : "is a student"
    User ||--o| Teacher : "is a teacher"

    Student ||--o{ Attendance : "has attendance"
    Student ||--o{ Mark : "has marks"
    Student ||--o{ Scholarship : "applies for"
    Student ||--o{ ClubMember : "joins clubs"
    Student ||--o| Portfolio : "has portfolio"
    Student ||--o| SportsProfile : "has sports profile"
    Student ||--o{ ParentStudentLink : "linked to parents"

    HeadmasterParent ||--o{ ParentStudentLink : "linked to students"
    HeadmasterParent ||--o{ ParentNotification : "receives alerts"

    Homework ||--o{ HomeworkSubmission : "has submissions"
    Club ||--o{ ClubMember : "has members"
```

---

## 3. Core Entity Relationships — Explained

### 🏫 School → The Central Hub
Every major entity links back to `School` via `schoolId`.  
This means **all data is school-scoped** — a teacher, student, attendance record, timetable, leave request, etc. all belong to exactly one school.

| Relationship | Field | Type |
|---|---|---|
| School → Users | `User.schoolId` | FK → `School.id` |
| School → Students | `Student.schoolId` | FK → `School.id` |
| School → Teachers | `Teacher.schoolId` | FK → `School.id` |
| School → Timetables | `Timetable.schoolId` | FK → `School.id` |
| School → Attendance | `Attendance.schoolId` | FK → `School.id` |
| School → Leave Requests | `LeaveRequest.schoolId` | FK → `School.id` |

---

### 👤 User → The Authentication Layer
`User` is the **login/auth identity**. A User can be a Student, Teacher, Parent, Headmaster, BEO, DEO, etc. (via `role` enum).

```
User (role=STUDENT) ──1:1──► Student profile
User (role=TEACHER) ──1:1──► Teacher profile
User (role=HEADMASTER) → no linked profile table yet
```

| Field | Description |
|---|---|
| `User.id` | Primary key, UUID |
| `User.emisId` | EMIS Student ID (for students) |
| `User.role` | Determines what the user can access |
| `User.schoolId` | Which school this user belongs to |

---

### 🎒 Student → The Academic Core
The `Student` record holds all academic info. It is linked 1:1 to a `User` for login.

```
User ──1:1──► Student ──1:N──► Attendance
                         ──1:N──► Marks
                         ──1:N──► Scholarships
                         ──1:N──► ClubMemberships
                         ──1:1──► Portfolio
                         ──1:1──► SportsProfile
                         ──1:N──► ParentStudentLink
```

| FK | Points to | Purpose |
|---|---|---|
| `Student.userId` | `User.id` | Login identity |
| `Student.schoolId` | `School.id` | School enrollment |

---

### 📚 Teacher → Staff Record
`Teacher` is linked 1:1 to a `User` for authentication.

```
User ──1:1──► Teacher ──(teacherId referenced in)──► Timetable
```

| FK | Points to | Purpose |
|---|---|---|
| `Teacher.userId` | `User.id` | Login identity |
| `Teacher.schoolId` | `School.id` | Employment school |

> ⚠️ Note: `Timetable.teacherId` stores the teacher reference but is not enforced via a Prisma relation (no `@relation` decorator). It is a loose string FK currently.

---

### 👨‍👩‍👧 Parent → The HeadmasterParent Model

Parents are stored in `HeadmasterParent` (not linked to `User` for auth yet).  
The connection between **Parent ↔ Student** is via the **join table** `ParentStudentLink`.

```
HeadmasterParent ──1:N──► ParentStudentLink ◄──N:1── Student
                  ──1:N──► ParentNotification
```

| Field | Description |
|---|---|
| `ParentStudentLink.parentId` | FK → `HeadmasterParent.id` |
| `ParentStudentLink.studentId` | FK → `Student.id` |
| `ParentStudentLink.isPrimary` | Marks the primary child |

This **many-to-many** design supports one parent with multiple children and one child with multiple parents.

---

### 📋 Notifications Flow

```
Attendance updated ──triggers──► ParentNotification
Mark updated       ──triggers──► ParentNotification
Homework assigned  ──triggers──► ParentNotification
PTA Meeting created──triggers──► ParentNotification
```

`ParentNotification` always targets a specific `parentId` and optionally a `studentId` to identify which child it is about.

---

## 4. Data Flow Diagram

```mermaid
flowchart LR
    subgraph SCHOOL["🏫 School"]
        direction TB
        SCH[School Record\nid · dise · district]
    end

    subgraph AUTH["🔐 Auth Layer"]
        direction TB
        USR[User\nid · role · emisId]
    end

    subgraph STAFF["👩‍🏫 Staff"]
        direction TB
        TCH[Teacher\nid · subjects · employeeId]
    end

    subgraph ACADEMIC["🎒 Students & Academics"]
        direction TB
        STU[Student\nid · class · section]
        ATT[Attendance]
        MRK[Marks]
        SCH2[Scholarship]
        HW[Homework\nSubmissions]
        LV[Leave Requests]
    end

    subgraph PARENT["👨‍👩‍👧 Parents"]
        direction TB
        PAR[HeadmasterParent]
        PSL[ParentStudentLink]
        NTF[ParentNotification]
    end

    subgraph EXTRACURRICULAR["⚽ Extracurricular"]
        direction TB
        CLB[Clubs]
        PRT[Portfolio]
        SPT[SportsProfile]
    end

    SCH -->|schoolId| USR
    SCH -->|schoolId| TCH
    SCH -->|schoolId| STU
    SCH -->|schoolId| ATT
    SCH -->|schoolId| LV
    SCH -->|schoolId| HW

    USR -->|userId 1:1| STU
    USR -->|userId 1:1| TCH

    STU -->|studentId| ATT
    STU -->|studentId| MRK
    STU -->|studentId| SCH2
    STU -->|studentId| HW
    STU -->|studentId| PSL
    STU -->|studentId| CLB
    STU -->|studentId| PRT
    STU -->|studentId| SPT

    PAR -->|parentId| PSL
    PAR -->|parentId| NTF

    ATT -.->|triggers| NTF
    MRK -.->|triggers| NTF
```

---

## 5. Primary & Foreign Key Map

| Table | Primary Key | Foreign Keys |
|---|---|---|
| `School` | `id` | — |
| `User` | `id` | `schoolId → School.id` |
| `Student` | `id` | `userId → User.id`, `schoolId → School.id` |
| `Teacher` | `id` | `userId → User.id`, `schoolId → School.id` |
| `Attendance` | `id` | `studentId → Student.id`, `schoolId → School.id` |
| `Mark` | `id` | `studentId → Student.id` |
| `Scholarship` | `id` | `studentId → Student.id` |
| `Timetable` | `id` | `schoolId → School.id` |
| `Homework` | `id` | `schoolId → School.id` |
| `HomeworkSubmission` | `id` | `homeworkId → Homework.id` |
| `LeaveRequest` | `id` | `schoolId → School.id` |
| `HeadmasterParent` | `id` | `schoolId → School.id` (loose) |
| `ParentStudentLink` | `id` | `parentId → HeadmasterParent.id`, `studentId → Student.id` |
| `ParentNotification` | `id` | `parentId → HeadmasterParent.id` |
| `PTAMeeting` | `id` | `schoolId → School.id` (loose) |
| `Club` | `id` | `schoolId → School.id` (loose) |
| `ClubMember` | `id` | `clubId → Club.id`, `studentId → Student.id` |
| `Portfolio` | `id` | `studentId → Student.id` |
| `SportsProfile` | `id` | `studentId → Student.id` |

> **"loose"** = `schoolId` is stored as a plain `String?` without a Prisma `@relation` directive, so Prisma won't enforce referential integrity on these.

---

## 6. What Can Be Accessed Through Each Relationship

| Starting From | You Can Access |
|---|---|
| **School** | All users, students, teachers, attendance records, timetables, leave requests, homework, PTA meetings |
| **User** | Their student profile OR teacher profile (via 1:1 relation) |
| **Student** | Their school, their user/login, all attendance, all marks, all scholarships, club memberships, portfolio, sports profile, parent links |
| **Teacher** | Their school, their user/login |
| **HeadmasterParent** | All linked students (via ParentStudentLink), all their notifications |
| **ParentStudentLink** | The parent record + the student record (bridging both sides) |
| **ParentNotification** | The parent it targets |
| **Attendance** | The student + the school |
| **Mark** | The student |
| **Scholarship** | The student |
| **Homework** | The school + all its submissions |
| **HomeworkSubmission** | Its homework |
| **Club** | All its members (students) and events |
| **ClubMember** | The club + the student |
| **Portfolio** | The student + skills, projects, achievements |
| **SportsProfile** | The student + teams, fitness stats, events, health logs |

---

## 7. ⚠️ Current Structural Gaps / Proposed Improvements

| Issue | Current State | Suggested Improvement |
|---|---|---|
| **Parent Auth** | `HeadmasterParent` has no `userId` link | Add `userId FK → User.id` so parents can log in |
| **Timetable.teacherId** | Plain `String?`, no Prisma relation | Add `@relation` to `Teacher` model |
| **LeaveRequest** | No `studentId` FK | Add `studentId FK → Student.id` for direct student linkage |
| **Headmaster profile** | No dedicated model; uses `User.role=HEADMASTER` | Add `Headmaster` model for profile data |
| **schoolId loose FKs** | Several models use `String? schoolId` without `@relation` | Enforce with Prisma `@relation` for data integrity |
