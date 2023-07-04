const express = require('express');
const app = express.Router();
const pool = require('../database');

const student = [
    {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        subject_marks: [
            {
                "I": [
                    { subject: "Machine learning", marks: "89" },
                    { subject: "Artificial intelligence", marks: "90" }
                ]
            },
            {
                "II": [
                    { subject: "Machine learning", marks: "90" },
                    { subject: "Artificial intelligence", marks: "85" }
                ]
            }
        ]
    },
    {
        id: 1,
        name: 'John',
        email: 'priyankaj@gmail.com',
        subject_marks: [
            {
                "I": [
                    { subject: "Machine learning", marks: "100" },
                    { subject: "Artificial intelligence", marks: "90" }
                ]
            },
            {
                "II": [
                    { subject: "ADA", marks: "100" },
                    { subject: "OS", marks: "85" }
                ]
            }
        ]
    },
    {
        id: 1,
        name: 'John',
        email: 'yahsu@gmail.com.com',
        subject_marks: [
            {
                "I": [
                    { subject: "Machine learning", marks: "69" },
                    { subject: "Artificial intelligence", marks: "90" }
                ]
            },
            {
                "II": [
                    { subject: "ADA", marks: "90" },
                    { subject: "OS", marks: "85" }
                ]
            }
        ]
    },
    {
        id: 1,
        name: 'John',
        email: 'abhi@gmail.com',
        subject_marks: [
            {
                "I": [
                    { subject: "ADA", marks: "89" },
                    { subject: "OS", marks: "90" }
                ]
            },
            {
                "II": [
                    { subject: "ADA", marks: "90" },
                    { subject: "OS", marks: "85" }
                ]
            }
        ]
    },
    {
        id: 1,
        name: 'John',
        email: 'appaamma@gmail.com',
        subject_marks: [
            {
                "I": [
                    { subject: "Machine learning", marks: "70" },
                    { subject: "Artificial intelligence", marks: "90" }
                ]
            },
            {
                "II": [
                    { subject: "ADA", marks: "90" },
                    { subject: "OS", marks: "85" }
                ]
            }
        ]
    },
    // ... (other student objects)
];

const talent = [
    { id: 1, email: 'john@example.com', talent_id: 'T1' },
    { id: 2, email: 'priyankaj@gmail.com', talent_id: 'T2' },
    { id: 3, email: 'yahsu@gmail.com', talent_id: 'T3' },
    { id: 4, email: 'abhi@gmail.com', talent_id: 'T4' },
    { id: 5, email: 'appaamma@gmail.com', talent_id: 'T5' },
    // ... (other talent objects)
];

// "GET" method for getting query details by talent id
app.route('/queries').get(async (req, res) => {
    const { type, subject, marks, relation } = req.query;
    try {
        // const student = await pool.query('SELECT * FROM students');
        // const talent = await pool.query('SELECT * FROM talent');
        if (type == 'subject') {
            const filteredStudents = student.filter(student => {
                const subjectMarks = student.subject_marks;

                for (const marksArray of subjectMarks) {
                    for (const key in marksArray) {
                        const subjects = marksArray[key];
                        for (const subjectMark of subjects) {
                            console.log("subjectMark", subjectMark.subject.toLowerCase(), subject.toLowerCase())
                            if (relation == 'greater') {
                                if (subjectMark.subject.toLowerCase() === subject.toLowerCase() && parseInt(subjectMark.marks) >= parseInt(marks)) {
                                    return true;
                                }
                            } else if (relation == 'lesser') {
                                if (subjectMark.subject.toLowerCase() === subject.toLowerCase() && parseInt(subjectMark.marks) <= parseInt(marks)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            });

            console.log('filtered students', filteredStudents);
            const studentEmails = filteredStudents.map(student => student.email);

            // Searching talent based on student emails
            const filteredTalent = talent.filter(t => studentEmails.includes(t.email));

            // Collecting talent IDs from filtered talent
            const talentIds = filteredTalent.map(t => t.talent_id);

            console.log(talentIds);
            res.json({ status: 1, data: talentIds });
        } else if (type == 'cgpa') {
            
        } else if (type == 'backlog') {
            
        } else if (type == 'course') {
            
        }
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

module.exports = app;