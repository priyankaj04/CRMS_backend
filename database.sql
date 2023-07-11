CREATE DATABASE crms;

CREATE TABLE talent(
    talent_id UUID NOT NULL,
    profile_url BYTEA,
    email VARCHAR(255) NOT NULL,
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

-- profile image, url, created_At


CREATE TABLE admin(
    admin_id UUID NOT NULL,
    email VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    contactno VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE resume(
    resume_id UUID PRIMARY KEY NOT NULL,
    talent_id UUID NOT NULL,
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
    recruiter_id UUID NOT NULL,
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
--change database to email primary key
--company email, social media json object


CREATE TABLE application(
    application_id UUID NOT NULL,
    recruiter_id UUID NOT NULL,
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

--job_type, opportunity_type, skills, number_of_openings, job_description,
--eligibility, preferences, ctc, ctc_breakup, fixed_pay, variable_pay, 
--other_incentives,perks, coverletter, availability, assessment_questions,alternate_mode


CREATE TABLE applicants(
    applicant_id UUID NOT NULL PRIMARY KEY,
    application_id UUID NOT NULL,
    status VARCHAR(255),
    result VARCHAR(255),
    remarks TEXT,
    registerno VARCHAR(255),
    pitching TEXT,
    resume_id UUID NOT NULL,
    talent_id UUID NOT NULL,
    selected_slot_date VARCHAR(255),
    selected_slot_timings VARCHAR(255)
);

--email varchar(255)

CREATE TABLE query(
    query_id UUID NOT NULL PRIMARY KEY,
    type VARCHAR(255),
    id VARCHAR(255),
    email VARCHAR(255),
    fullname VARCHAR(255),
    contact_no VARCHAR(255),
    message VARCHAR(255),
    reply TEXT,
    status VARCHAR(255),
    created_at VARCHAR(255),
    updated_at VARCHAR(255)
);

--CREATE TABLE admin(
--    admin_id UUID NOT NULL,
--    userID VARCHAR(255) PRIMARY KEY,
--    password VARCHAR(255)
--);

--  salary_currency VARCHAR(255),
--     salary VARCHAR(255),
--     salary2 VARCHAR(255),
--     salary_scale VARCHAR(255),
--     salary_currency_min_assured VARCHAR(255),
--     salary_min_assured VARCHAR(255),
--     salary_scale_min_assured VARCHAR(255),
--     salary_currency_incentive_based VARCHAR(255),
--     salary_incentive_based VARCHAR(255),
--     salary2_incentive_based VARCHAR(255),
--     salary_performance_scale_incentive_based VARCHAR(255),
--     salary_performance_scale_others_incentive_based: VARCHAR(255),


CREATE TABLE student(
    student_id UUID NOT NULL,
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
    subject_marks JSON[]
);
--subject_marks JSON[],
--tenth_details(school, percentage, year, boards)
--12th_details(college, percentage, year, boards, stream)

CREATE TABLE logger(
    member VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    datetime TIMESTAMP
);


CREATE TABLE interview(
    interview_id UUID NOT NULL,
    application_id UUID NOT NULL,
    talent_id UUID NOT NULL,
    slot_timings VARCHAR(255),
    slot_time VARCHAR(255)[],
    slot_dates VARCHAR(255)[],
    link VARCHAR(255),
    description VARCHAR(255),
    slots JSON[]
);

--interview results


CREATE TABLE subjects(
    course_id UUID PRIMARY KEY,
    course VARCHAR(255),
    subject JSON,
    academic_year VARCHAR(255)
);

CREATE TABLE rectification_query(
    rec_id UUID NOT NULL,
    query TEXT,
    talent_id UUID,
    reply TEXT,
    created_at VARCHAR(255),
    updated_at VARCHAR(255) 
);

CREATE TABLE hod(
    hod_id UUID NOT NULL,
    department VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255)
);