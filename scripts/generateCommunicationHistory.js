"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var types_1 = require("../src/types");
// Helper function to generate a random time between 9 AM and 6 PM
var getRandomTime = function () {
    var hours = Math.floor(Math.random() * (18 - 9) + 9);
    var minutes = Math.floor(Math.random() * 60);
    return "".concat(hours.toString().padStart(2, '0'), ":").concat(minutes.toString().padStart(2, '0'));
};
// Helper function to add days to a date
var addDays = function (date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
// Helper function to format date to ISO string without time
var formatDate = function (date) { return date.toISOString().split('T')[0]; };
var generateOutreachMessage = function (job, candidate) {
    return "Hi ".concat(candidate.name, ",\n\nI hope this message finds you well! I'm reaching out from ").concat(job.company, " regarding our ").concat(job.title, " position. Your background in ").concat(candidate.skills.slice(0, 2).join(' and '), " caught our attention, and we believe you could be a great fit for our team.\n\nThe role involves ").concat(job.description.split('.')[0], ". Given your experience at ").concat(candidate.currentCompany, ", I'd love to discuss this opportunity with you.\n\nWould you be interested in learning more about this position?\n\nBest regards,\n").concat(job.recruiter, "\n").concat(job.company);
};
var generateApplicationMessage = function (job, candidate) {
    return "Thank you for your interest in the ".concat(job.title, " position at ").concat(job.company, ". \n\nI'm excited about your application and your experience with ").concat(candidate.skills.slice(0, 3).join(', '), ". We'll review your application and get back to you soon.\n\nBest regards,\n").concat(job.recruiter);
};
var generateShortlistMessage = function (job, candidate) {
    return "Dear ".concat(candidate.name, ",\n\nGreat news! After reviewing your application for the ").concat(job.title, " position, we're impressed with your profile and would like to move forward with the interview process.\n\nThe next step would be a technical assessment followed by an interview with our team. Could you please let us know your availability for the coming week?\n\nBest regards,\n").concat(job.recruiter);
};
var generateInterviewSchedule = function (job, candidate, interviewDate) {
    return "Dear ".concat(candidate.name, ",\n\nYour interview for the ").concat(job.title, " position has been scheduled for:\n\nDate: ").concat(formatDate(interviewDate), "\nTime: ").concat(getRandomTime(), "\nLocation: Virtual (Zoom)\n\nInterviewers:\n- ").concat(job.hiringManager, " (Hiring Manager)\n- ").concat(job.recruiter, " (Recruiter)\n\nPlease confirm if this works for you.\n\nBest regards,\n").concat(job.recruiter);
};
var generateOfferMessage = function (job, candidate) {
    return "Dear ".concat(candidate.name, ",\n\nI'm delighted to inform you that we would like to extend an offer for the position of ").concat(job.title, " at ").concat(job.company, ".\n\nWe were particularly impressed with your ").concat(candidate.skills.slice(0, 2).join(' and '), " skills and believe you'll be a valuable addition to our team.\n\nWe'll send the formal offer letter shortly with all the details. Looking forward to your positive response.\n\nBest regards,\n").concat(job.hiringManager, "\n").concat(job.company);
};
var generateCommunicationHistory = function (candidate, job) {
    var _a;
    var communications = [];
    var startDate = new Date(candidate.appliedDate);
    startDate.setDate(startDate.getDate() - 5); // Set outreach date 5 days before application
    var currentDate = startDate;
    // Initial outreach
    communications.push({
        id: "".concat(candidate.id, "-1"),
        date: formatDate(currentDate),
        time: getRandomTime(),
        type: 'email',
        channel: 'Email',
        subject: "Opportunity: ".concat(job.title, " at ").concat(job.company),
        content: generateOutreachMessage(job, candidate),
        direction: 'outbound',
        status: 'delivered',
        sender: job.recruiter,
        recipient: candidate.email
    });
    // Candidate response (1 day later)
    currentDate = addDays(currentDate, 1);
    communications.push({
        id: "".concat(candidate.id, "-2"),
        date: formatDate(currentDate),
        time: getRandomTime(),
        type: 'email',
        channel: 'Email',
        subject: "Re: Opportunity: ".concat(job.title, " at ").concat(job.company),
        content: 'Thank you for reaching out! Yes, I would be interested in learning more about this opportunity.',
        direction: 'inbound',
        status: 'read',
        sender: candidate.email,
        recipient: job.recruiter
    });
    // Application received (3 days later)
    currentDate = addDays(currentDate, 3);
    communications.push({
        id: "".concat(candidate.id, "-3"),
        date: formatDate(currentDate),
        time: getRandomTime(),
        type: 'system',
        channel: 'ATS',
        subject: 'Application Submitted',
        content: "Application received for ".concat(job.title),
        direction: 'system',
        status: 'completed',
        metadata: {
            applicationId: "APP-".concat(candidate.id),
            source: candidate.source
        }
    });
    // Application acknowledgment
    communications.push({
        id: "".concat(candidate.id, "-4"),
        date: formatDate(currentDate),
        time: getRandomTime(),
        type: 'email',
        channel: 'Email',
        subject: "Application Received - ".concat(job.title),
        content: generateApplicationMessage(job, candidate),
        direction: 'outbound',
        status: 'delivered',
        sender: job.recruiter,
        recipient: candidate.email
    });
    if ([
        types_1.RecruitmentStage.SHORTLISTED,
        types_1.RecruitmentStage.INTERVIEWED,
        types_1.RecruitmentStage.OFFER_EXTENDED,
        types_1.RecruitmentStage.OFFER_REJECTED,
        types_1.RecruitmentStage.HIRED
    ].includes(candidate.stage)) {
        // Shortlist notification (2 days later)
        currentDate = addDays(currentDate, 2);
        communications.push({
            id: "".concat(candidate.id, "-5"),
            date: formatDate(currentDate),
            time: getRandomTime(),
            type: 'email',
            channel: 'Email',
            subject: "Next Steps - ".concat(job.title, " Position"),
            content: generateShortlistMessage(job, candidate),
            direction: 'outbound',
            status: 'delivered',
            sender: job.recruiter,
            recipient: candidate.email
        });
        // Candidate availability response
        currentDate = addDays(currentDate, 1);
        communications.push({
            id: "".concat(candidate.id, "-6"),
            date: formatDate(currentDate),
            time: getRandomTime(),
            type: 'whatsapp',
            channel: 'WhatsApp',
            subject: 'Interview Availability',
            content: "I'm available next week on Tuesday and Wednesday between 10 AM and 4 PM.",
            direction: 'inbound',
            status: 'read',
            sender: candidate.phone,
            recipient: job.recruiter
        });
    }
    if ([
        types_1.RecruitmentStage.INTERVIEWED,
        types_1.RecruitmentStage.OFFER_EXTENDED,
        types_1.RecruitmentStage.OFFER_REJECTED,
        types_1.RecruitmentStage.HIRED
    ].includes(candidate.stage)) {
        // Interview schedule
        currentDate = addDays(currentDate, 2);
        var interviewDate = addDays(currentDate, 3);
        communications.push({
            id: "".concat(candidate.id, "-7"),
            date: formatDate(currentDate),
            time: getRandomTime(),
            type: 'calendar',
            channel: 'Email',
            subject: "Interview Schedule - ".concat(job.title),
            content: generateInterviewSchedule(job, candidate, interviewDate),
            direction: 'outbound',
            status: 'scheduled',
            sender: job.recruiter,
            recipient: candidate.email,
            metadata: {
                eventType: 'interview',
                zoomLink: 'https://zoom.us/j/123456789'
            }
        });
        // Interview confirmation
        currentDate = addDays(currentDate, 1);
        communications.push({
            id: "".concat(candidate.id, "-8"),
            date: formatDate(currentDate),
            time: getRandomTime(),
            type: 'whatsapp',
            channel: 'WhatsApp',
            subject: 'Interview Confirmation',
            content: 'Thank you for the schedule. I confirm my availability for the interview.',
            direction: 'inbound',
            status: 'read',
            sender: candidate.phone,
            recipient: job.recruiter
        });
        // Interview reminder
        currentDate = addDays(currentDate, 2);
        communications.push({
            id: "".concat(candidate.id, "-9"),
            date: formatDate(currentDate),
            time: getRandomTime(),
            type: 'system',
            channel: 'Email',
            subject: 'Interview Reminder',
            content: "Reminder: Interview tomorrow for ".concat(job.title),
            direction: 'outbound',
            status: 'delivered',
            sender: 'system',
            recipient: candidate.email
        });
        // Interview completed
        currentDate = addDays(currentDate, 1);
        communications.push({
            id: "".concat(candidate.id, "-10"),
            date: formatDate(currentDate),
            time: getRandomTime(),
            type: 'assessment',
            channel: 'ATS',
            subject: 'Interview Completed',
            content: 'Technical interview completed',
            direction: 'system',
            status: 'completed',
            metadata: {
                interviewType: 'technical',
                duration: '45 minutes',
                overallScore: (_a = candidate.assessment) === null || _a === void 0 ? void 0 : _a.score
            }
        });
    }
    if ([
        types_1.RecruitmentStage.OFFER_EXTENDED,
        types_1.RecruitmentStage.OFFER_REJECTED,
        types_1.RecruitmentStage.HIRED
    ].includes(candidate.stage)) {
        // Offer extension
        currentDate = addDays(currentDate, 2);
        communications.push({
            id: "".concat(candidate.id, "-11"),
            date: formatDate(currentDate),
            time: getRandomTime(),
            type: 'email',
            channel: 'Email',
            subject: "Offer Letter - ".concat(job.title, " at ").concat(job.company),
            content: generateOfferMessage(job, candidate),
            direction: 'outbound',
            status: 'delivered',
            sender: job.hiringManager,
            recipient: candidate.email,
            attachments: [{
                    name: 'Offer_Letter.pdf',
                    type: 'application/pdf',
                    size: '156 KB'
                }]
        });
        if (candidate.stage === types_1.RecruitmentStage.HIRED) {
            // Offer acceptance
            currentDate = addDays(currentDate, 2);
            communications.push({
                id: "".concat(candidate.id, "-12"),
                date: formatDate(currentDate),
                time: getRandomTime(),
                type: 'email',
                channel: 'Email',
                subject: "Re: Offer Letter - ".concat(job.title, " at ").concat(job.company),
                content: 'I am pleased to accept the offer. Thank you for this opportunity.',
                direction: 'inbound',
                status: 'read',
                sender: candidate.email,
                recipient: job.hiringManager,
                attachments: [{
                        name: 'Signed_Offer_Letter.pdf',
                        type: 'application/pdf',
                        size: '180 KB'
                    }]
            });
        }
        else if (candidate.stage === types_1.RecruitmentStage.OFFER_REJECTED) {
            // Offer rejection
            currentDate = addDays(currentDate, 2);
            communications.push({
                id: "".concat(candidate.id, "-12"),
                date: formatDate(currentDate),
                time: getRandomTime(),
                type: 'email',
                channel: 'Email',
                subject: "Re: Offer Letter - ".concat(job.title, " at ").concat(job.company),
                content: 'Thank you for the offer. However, I have decided to pursue another opportunity that better aligns with my career goals.',
                direction: 'inbound',
                status: 'read',
                sender: candidate.email,
                recipient: job.hiringManager
            });
        }
    }
    return communications;
};
var updateCandidatesWithCommunication = function () {
    // Read the jobs.ts file
    var filePath = path_1.default.join(process.cwd(), 'src', 'data', 'jobs.ts');
    var content = fs_1.default.readFileSync(filePath, 'utf8');
    try {
        // Import the jobs array directly
        var jobs_1 = require('../src/data/jobs').jobs;
        // Create candidates array if it doesn't exist
        var candidatesMatch = content.match(/export\s+const\s+candidates:\s*Candidate\[\]\s*=\s*\[([\s\S]*?)\];/);
        var candidates = void 0;
        if (!candidatesMatch) {
            // If candidates array doesn't exist, create it with sample data
            candidates = jobs_1.flatMap(function (job) {
                var numCandidates = Math.floor(Math.random() * 10) + 5; // 5-15 candidates per job
                return Array.from({ length: numCandidates }, function (_, i) {
                    var _a;
                    return ({
                        id: "".concat(job.id, "-").concat(i + 1),
                        name: "Candidate ".concat(i + 1, " for ").concat(job.title),
                        email: "candidate".concat(i + 1, "@example.com"),
                        phone: "+91 ".concat(Math.floor(Math.random() * 9000000000) + 1000000000),
                        currentTitle: 'Software Engineer',
                        currentCompany: 'Tech Company',
                        location: job.location,
                        experience: Math.floor(Math.random() * 10) + 2,
                        skills: ((_a = job.skills) === null || _a === void 0 ? void 0 : _a.slice(0, 3)) || ['JavaScript', 'TypeScript', 'React'],
                        education: [{
                                degree: 'B.Tech in Computer Science',
                                institution: 'Top University',
                                year: 2020
                            }],
                        resume: 'path/to/resume.pdf',
                        source: 'LinkedIn',
                        appliedDate: new Date(job.postedDate).toISOString().split('T')[0],
                        stage: types_1.RecruitmentStage.SHORTLISTED,
                        jobId: job.id,
                        assessment: {
                            score: Math.floor(Math.random() * 30) + 70,
                            feedback: 'Good technical skills',
                            completed: true
                        }
                    });
                });
            });
            // Add candidates array to the file
            content = content.replace(/export const jobs: Job\[\] = \[([\s\S]*?)\];/, "export const jobs: Job[] = [$1];\n\nexport const candidates: Candidate[] = ".concat(JSON.stringify(candidates, null, 2), ";"));
        }
        else {
            // Parse existing candidates array
            var candidatesContent = candidatesMatch[1];
            candidates = JSON.parse("[".concat(candidatesContent, "]"));
        }
        // Generate communication timeline for each candidate
        candidates = candidates.map(function (candidate) {
            var job = jobs_1.find(function (j) { return j.id === candidate.jobId; });
            if (!job)
                return candidate;
            return __assign(__assign({}, candidate), { communicationTimeline: generateCommunicationHistory(candidate, job) });
        });
        // Update the candidates array in the file
        var updatedContent = content.replace(/export\s+const\s+candidates:\s*Candidate\[\]\s*=\s*\[([\s\S]*?)\];/, "export const candidates: Candidate[] = ".concat(JSON.stringify(candidates, null, 2), ";"));
        // Write the updated content back to the file
        fs_1.default.writeFileSync(filePath, updatedContent, 'utf8');
        console.log("Updated ".concat(candidates.length, " candidates with communication history"));
    }
    catch (error) {
        console.error('Error processing candidates:', error);
    }
};
// Run the update
updateCandidatesWithCommunication();
