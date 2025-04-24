"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var updateCandidatesStage = function () {
    // Read the jobs.ts file
    var filePath = path_1.default.join(process.cwd(), 'src', 'data', 'jobs.ts');
    var content = fs_1.default.readFileSync(filePath, 'utf8');
    // Find all shortlisted candidates and replace their stage
    var count = 0;
    var maxUpdates = 50;
    content = content.replace(/stage:\s*RecruitmentStage\.SHORTLISTED/g, function (match) {
        if (count < maxUpdates) {
            count++;
            return 'stage: RecruitmentStage.OUTREACHED';
        }
        return match;
    });
    // Write the updated content back to the file
    fs_1.default.writeFileSync(filePath, content, 'utf8');
    console.log("Updated ".concat(count, " candidates from SHORTLISTED to OUTREACHED stage"));
};
// Run the update
updateCandidatesStage();
