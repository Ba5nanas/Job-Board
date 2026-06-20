# Landingpage User System - Progress

## ✅ เสร็จแล้ว

### Backend
- [x] แก้ไข JobsService syntax error (dangling return statement)
- [x] สร้าง JobLimitsModule (service, controller, module) - จัดการ limit การประกาศงานของแต่ละบริษัท
- [x] เพิ่ม CompanyUsersModule + JobLimitsModule เข้า BackOfficeModule
- [x] สร้าง UserTypeGuard - แยก user admin/backoffice จาก landingpage (job_seeker, employer)
- [x] สร้าง LandingpageModule พร้อม API:
  - `POST /landingpage/register/job-seeker` - ลงทะเบียนคนหางาน
  - `POST /landingpage/register/employer` - ลงทะเบียนบริษัท (สร้าง company + job limit อัตโนมัติ)
  - `GET /landingpage/profile` - ดู profile (job_seeker ได้ resumes + experiences ไปด้วย)
  - `PUT /landingpage/profile` - แก้ไข profile
  - `GET/POST/PUT/DELETE /landingpage/work-experiences` - CRUD ประวัติการทำงาน
  - `GET/POST/PUT/DELETE /landingpage/resumes` - CRUD resume
- [x] เพิ่ม LandingpageModule เข้า AppModule

### Frontend (Landingpage)
- [x] สร้าง AuthContext - จัดการ login, register, logout, token
- [x] อัปเดต layout.js - เพิ่ม AuthProvider, เปลี่ยนลิงก์
- [x] สร้างหน้า Login (`/login`)
- [x] สร้างหน้า Register (`/register`) - เลือก role ระหว่าง Job Seeker / Employer

## ⏳ เหลือต้องทำ

### Backend
- [ ] เพิ่ม methods ใน LandingpageService สำหรับ work-experiences และ resumes (controller มีแล้วแต่ service ยังไม่มี methods เหล่านี้)
  - `getWorkExperiences(userId)`
  - `createWorkExperience(userId, data)`
  - `updateWorkExperience(userId, id, data)`
  - `deleteWorkExperience(userId, id)`
  - `getResumes(userId)`
  - `createResume(userId, data)`
  - `updateResume(userId, id, data)`
  - `deleteResume(userId, id)`

### Frontend (Landingpage)
- [ ] สร้างหน้า Profile Job Seeker (`/profile`) - แสดงข้อมูลส่วนตัว + ประวัติการทำงาน
- [ ] สร้างหน้า Resume Builder (`/profile/resume`) - สร้าง/แก้ไข resume
- [ ] สร้างหน้า Company Profile (`/companies/[id]`) - แสดง about บริษัท
- [ ] สร้างหน้า Employer Dashboard (`/employer/dashboard`) - ประกาศงาน, จัดการทีม, ดู job limits
- [ ] สร้างระบบ Company User roles (owner, hr, recruiter) ในฝั่ง frontend

## 📋 Architecture Summary

```
User Types:
├── admin / backoffice → เข้า backoffice เท่านั้น (มี roles แยก permission)
└── landingpage users
    ├── job_seeker (คนหางาน)
    │   ├── ประวัติการทำงาน (work experiences)
    │   └── สร้าง resume ได้
    └── employer (บริษัท)
        ├── มี role ในบริษัท: owner, hr, recruiter
        ├── ประกาศงานได้ > 1 (มี limit จาก backoffice)
        └── มี about บริษัท
```
