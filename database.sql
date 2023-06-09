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
    resume_id UUID
);

-- profile image, url, created_At

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
    email VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) PRIMARY KEY,
    description TEXT,
    industry VARCHAR(255),
    noofemployees VARCHAR(255),
    city VARCHAR(255),
    address VARCHAR(255),
    contactno VARCHAR(255),
    enable BOOL,
    datetime VARCHAR(255),
    url VARCHAR(255),
    socialmedia VARCHAR(255)
);

--company email, social media json object


CREATE TABLE application(
    application_id UUID NOT NULL PRIMARY KEY,
    status VARCHAR(255),
    profile_primary VARCHAR(255),
    skills VARCHAR(255)[],
    type VARCHAR(255),
    part_full VARCHAR(255),
    location VARCHAR(255), 
    open_positions VARCHAR(255),
    start_date VARCHAR(255),
    start_date_1 VARCHAR(255),
    fixed_duration_value VARCHAR(255),
    duration_scale VARCHAR(255),
    description TEXT,
    who_can_apply VARCHAR(255)[],
    additional_details TEXT,
    learning_and_mentoring_description JSON,
    selection_procedure_description JSON, 
    rewards_and_incentives_description JSON,
    stipend_type VARCHAR(255),
    salary JSON,
    certificate VARCHAR(255),
    perks VARCHAR(255)[],
    ppo_prospect VARCHAR(255),
    show_cover_letter_internship VARCHAR(255),
    questions JSON[],
    job_poc_country_code VARCHAR(255),
    job_poc_contact_no VARCHAR(255),
    job_location VARCHAR(255)[],
    posted_at VARCHAR(255),
    applicants_id VARCHAR(255),
    talent_id UUID NOT NULL,
    recruiter_id UUID NOT NULL
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
    pitching TEXT,
    resume_id UUID NOT NULL,
    talent_id UUID NOT NULL
);

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

CREATE TABLE admin(
    admin_id UUID NOT NULL,
    userID VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255)
);

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
