# Campus Recruitment Management System - Backend


### 📌 Requirements

The backend of the Campus Recruitment Management System (CRMS) supports four types of user logins: Students, HODs, Admins, and Recruiters.


* User Flows
    * Log in to the app using a password.
    * Build a resume and fill in all necessary details.
    * Apply for job openings.
    * Wait for application selection.
    * Upon selection, receive an interview slot.
    * After the interview, receive an email notification regarding the outcome.


* Recruiter Flow
    * Log in to the app using a password.
    * Fill in company details.
    * Create job applications.
    * Wait for application approval by the Admin.
    * After approval, select applicants based on their resumes.
    * Schedule interview meetings and make hiring decisions (hire or reject).


* Admin Flow
    * Add students by class and section.
    * Respond to queries from both students and recruiters.
    * Approve job applications posted by recruiters.
    * Monitor all activities by students and recruiters.


* HOD Flow
    * Respective HODs create and edit their subject chapter details.
 

## ER Diagram


You can view the Entity-Relationship (ER) Diagram of the CRMS to understand the structure and relationships within the system's database. The diagram provides a visual representation of the data model and is available [here](https://github.com/priyankaj04/CRMS_backend/blob/master/erdiagram.pdf).


## DB Schema
```sql
CREATE DATABASE crms;

CREATE TABLE talent(
    talent_id UUID NOT NULL REFERENCES users (id),
    profile_url TEXT,
    email VARCHAR(255) NOT NULL REFERENCES student (email),
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    register_no VARCHAR(255) PRIMARY KEY NOT NULL,
    semester VARCHAR(255),
    branch VARCHAR(255),
    fieldofexpertise VARCHAR(255),
    about VARCHAR(255),
    college VARCHAR(255),
    contactno VARCHAR(255),
    whatappno VARCHAR(255),
    enable BOOL,
    saved VARCHAR(255)[],
    datetime VARCHAR(255),
    url JSON,
    resume_id UUID,
    city VARCHAR(255),
    otp VARCHAR(255),
    auth VARCHAR(255)
);

CREATE TABLE admin(
    admin_id UUID NOT NULL REFERENCES users(id),
    email VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    contactno VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE resume(
    resume_id UUID PRIMARY KEY NOT NULL,
    register_no UUID NOT NULL REFERENCES talent(register_no),
    education JSON[], 
    job JSON[],
    internship JSON[],
    position_of_responsibility JSON[],
    cerficate JSON[],
    project JSON[],
    skill JSON[],
    accomplishment JSON[],
    datetime VARCHAR(255)
);

CREATE TABLE recruiter(
    recruiter_id UUID NOT NULL REFERENCES users(id),
    logo_url BYTEA,
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    description TEXT,
    industry VARCHAR(255),
    noofemployees VARCHAR(255),
    city VARCHAR(255),
    address VARCHAR(255),
    contactno VARCHAR(255),
    enable BOOL,
    datetime VARCHAR(255),
    url VARCHAR(255),
    socialmedia VARCHAR(255),
    otp VARCHAR(255),
    auth VARCHAR(255)
);

CREATE TABLE application(
    application_id UUID NOT NULL,
    recruiter_id UUID NOT NULL REFERENCES recruiter (recruiter_id),
    opportunity_type VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    skills VARCHAR(255),
    job_type VARCHAR(255),
    number_of_openings VARCHAR(255),
    job_start_date VARCHAR(255),
    ctc1 VARCHAR(255),
    ctc2 VARCHAR(255),
    job_description TEXT,
    preference VARCHAR(255),
    stipend_type VARCHAR(255),
    stipend_amt VARCHAR(255),
    stipend_per VARCHAR(255),
    perks1 VARCHAR(255),
    perks2 VARCHAR(255),
    perks3 VARCHAR(255),
    perks4 VARCHAR(255),
    perks5 VARCHAR(255),
    perks6 VARCHAR(255),
    perks7 VARCHAR(255),
    ctc_breakup VARCHAR(255),
    fixed_pay VARCHAR(255),
    variable_pay VARCHAR(255),
    other_incentives VARCHAR(255),
    alternate_mobile VARCHAR(255),
    eligibility VARCHAR(255),
    enable VARCHAR(255),
    due_date VARCHAR(255),
    status VARCHAR(255),
    rounds VARCHAR(255),
    round VARCHAR(255),
    round_name VARCHAR(255),
    created_at VARCHAR(255),
    updated_at VARCHAR(255),
    location VARCHAR(255)
);

CREATE TABLE applicants(
    applicant_id UUID NOT NULL PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES application (application_id),
    status VARCHAR(255),
    result VARCHAR(255),
    remarks TEXT,
    registerno VARCHAR(255),
    pitching TEXT,
    resume_id UUID NOT NULL REFERENCES resume (resume_id),
    talent_id UUID NOT NULL REFERENCES talent (talent_id),
    selected_slot_date VARCHAR(255),
    selected_slot_timings VARCHAR(255)
);

CREATE TABLE query(
    query_id UUID NOT NULL PRIMARY KEY,
    type VARCHAR(255),
    id VARCHAR(255) REFERENCES users(id),
    email VARCHAR(255),
    fullname VARCHAR(255),
    contact_no VARCHAR(255),
    message VARCHAR(255),
    reply TEXT,
    status VARCHAR(255),
    created_at VARCHAR(255),
    updated_at VARCHAR(255)
);

CREATE TABLE student(
    student_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES subject(course_id),
    register_no VARCHAR(255) NOT NULL,
    class VARCHAR(255),
    degree VARCHAR(255),
    stream VARCHAR(255),
    semester VARCHAR(255),
    CGPA VARCHAR(255),
    backlog_number VARCHAR(255),
    backlog_subject VARCHAR(255),
    email VARCHAR(255) PRIMARY KEY NOT NULL,
    tenth_details JSON,
    twelth_details JSON,
    ug_details JSON,
    created_by UUID,
    subject_marks JSON[],
    batch VARCHAR(255)
);

CREATE TABLE logger(
    member VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    datetime TIMESTAMP
);

CREATE TABLE interview(
    interview_id UUID NOT NULL,
    application_id UUID NOT NULL REFERENCES application (application_id),
    talent_id UUID NOT NULL REFERENCES talent (talent_id),
    slot_timings VARCHAR(255),
    slot_time VARCHAR(255)[],
    slot_dates VARCHAR(255)[],
    link VARCHAR(255),
    description TEXT,
    slots JSON[]
);

CREATE TABLE subjects(
    department VARCHAR(255) NOT NULL REFERENCES hod (department),
    course_id UUID PRIMARY KEY,
    course VARCHAR(255),
    subject JSON,
    academic_year VARCHAR(255)
);

CREATE TABLE hod(
    department VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255)
);


CREATE TABLE users(
    id UUID PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);

--12 tables
```

### Thankyou so much :)
