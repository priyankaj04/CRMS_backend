CREATE DATABASE crms;

CREATE TABLE demo (
    student_id UUID PRIMARY KEY,
    email VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    password VARCHAR(255),
    register_no VARCHAR(255)
);

CREATE TABLE talent(
    talent_id UUID,
    profile_url BYTEA,
    email VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    password VARCHAR(255),
    register_no VARCHAR(255) PRIMARY KEY,
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
    url JSON
);

//profile image, url, created_At

CREATE TABLE resume(
    resume_id UUID PRIMARY KEY,
    talent_id UUID,
    education JSON[], 10th
    job JSON[],
    internship JSON[],
    position_of_responsibility JSON[],
    cerficate JSON[],
    project JSON[],
    skill JSON[],
    accomplishment JSON[],
    datetime VARCHAR(255)
);