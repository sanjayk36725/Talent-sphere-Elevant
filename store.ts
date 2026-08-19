import {
  User,
  StudentProfile,
  Course,
  Assessment,
  AssessmentAttempt,
  NotificationItem,
  UnlockRequest,
  SecurityEvent,
  Enrollment,
  AttendanceRecord,
  Announcement,
  MockInterview,
  CourseMaterial,
} from '../types';
import { hashPassword } from './security';
import { emailService } from './email_service';

class Store {
  public users: User[] = [];
  public studentProfiles: Map<string, StudentProfile> = new Map();
  public courses: Course[] = [];
  public assessments: Assessment[] = [];
  public assessmentAttempts: AssessmentAttempt[] = [];
  public notifications: NotificationItem[] = [];
  public unlockRequests: UnlockRequest[] = [];
  public securityEvents: SecurityEvent[] = [];
  public enrollments: Enrollment[] = [];
  public attendance: AttendanceRecord[] = [];
  public announcements: Announcement[] = [];
  public mockInterviews: MockInterview[] = [];
  public courseMaterials: CourseMaterial[] = [];

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    // 1. Seed Users
    const studentUser: User = {
      id: 'USR_STUDENT_1',
      name: 'Sanjay Kumar',
      email: 'sanjayk36725@gmail.com', // User's registered email
      passwordHash: hashPassword('password123'),
      role: 'STUDENT',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 1, // Starts at Day 1
      createdAt: '2026-08-01T08:00:00.000Z',
    };

    const teacherUser: User = {
      id: 'USR_TEACHER_1',
      name: 'Dr. Sarah Jenkins',
      email: 'teacher@talentsphere.edu',
      passwordHash: hashPassword('teacher123'),
      role: 'TEACHER',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 3,
      createdAt: '2026-07-15T08:00:00.000Z',
    };

    const adminUser: User = {
      id: 'USR_ADMIN_1',
      name: 'System Administrator',
      email: 'admin@talentsphere.edu',
      passwordHash: hashPassword('admin123'),
      role: 'ADMIN',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 3,
      createdAt: '2026-07-01T08:00:00.000Z',
    };

    // Cohort Students from Video Demonstration
    const studentAlex: User = {
      id: 'USR_STU_ALEX',
      name: 'Alex Johnson',
      email: 'alex@talentsphere.edu',
      passwordHash: hashPassword('password123'),
      role: 'STUDENT',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 4,
      createdAt: '2026-08-01T08:00:00.000Z',
    };

    const studentSarah: User = {
      id: 'USR_STU_SARAH',
      name: 'Sarah Connor',
      email: 'sarah@talentsphere.edu',
      passwordHash: hashPassword('password123'),
      role: 'STUDENT',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 3,
      createdAt: '2026-08-01T08:00:00.000Z',
    };

    const studentDavid: User = {
      id: 'USR_STU_DAVID',
      name: 'David Kim',
      email: 'david@talentsphere.edu',
      passwordHash: hashPassword('password123'),
      role: 'STUDENT',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 2,
      createdAt: '2026-08-01T08:00:00.000Z',
    };

    const studentPriya: User = {
      id: 'USR_STU_PRIYA',
      name: 'Priya Sharma',
      email: 'priya@talentsphere.edu',
      passwordHash: hashPassword('password123'),
      role: 'STUDENT',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 4,
      createdAt: '2026-08-01T08:00:00.000Z',
    };

    const studentLucas: User = {
      id: 'USR_STU_LUCAS',
      name: 'Lucas Miller',
      email: 'lucas@talentsphere.edu',
      passwordHash: hashPassword('password123'),
      role: 'STUDENT',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 1,
      createdAt: '2026-08-01T08:00:00.000Z',
    };

    // Faculty members from Roster
    const facultyEleanor: User = {
      id: 'USR_FACULTY_ELEANOR',
      name: 'Prof. Eleanor Vance',
      email: 'teacher@school.edu',
      passwordHash: hashPassword('teacher123'),
      role: 'TEACHER',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 20,
      createdAt: '2026-01-15T08:00:00.000Z',
    };

    const facultyMarcus: User = {
      id: 'USR_FACULTY_MARCUS',
      name: 'Dr. Marcus Brady',
      email: 'marcusbrady@school.edu',
      passwordHash: hashPassword('teacher123'),
      role: 'TEACHER',
      isVerified: true,
      twoFactorEnabled: false,
      currentUnlockedDay: 20,
      createdAt: '2026-03-01T08:00:00.000Z',
    };

    this.users = [
      studentUser,
      studentAlex,
      studentSarah,
      studentDavid,
      studentPriya,
      studentLucas,
      teacherUser,
      facultyEleanor,
      facultyMarcus,
      adminUser,
    ];

    // 2. Student Profile
    const profile: StudentProfile = {
      userId: studentUser.id,
      college: 'Indian Institute of Technology / Talent Sphere Academy',
      degree: 'Bachelor of Technology',
      department: 'Computer Science & AI',
      year: '3rd Year',
      cgpa: 8.9,
      skills: [
        { name: 'Performance Management', level: 'Intermediate', score: 82 },
        { name: 'Data Analytics & KPIs', level: 'Intermediate', score: 78 },
        { name: 'OKRs & Goal Setting', level: 'Advanced', score: 90 },
        { name: 'Python & Data Structures', level: 'Intermediate', score: 85 },
        { name: 'Competency Mapping', level: 'Beginner', score: 60 },
        { name: 'Leadership & 360 Review', level: 'Beginner', score: 50 },
      ],
      interests: ['AI in HR Tech', 'Talent Analytics', 'Full Stack Development', 'Career Pathing Systems'],
      projects: [
        {
          id: 'PRJ_1',
          title: 'Talent Sphere Elevate Core Platform',
          description: 'A full-stack AI-powered talent development platform with progressive day-wise RAG, OCR, and email notifications.',
          technologies: ['React', 'FastAPI', 'Gemini AI', 'Tailwind CSS', 'TypeScript', 'Vector Store'],
          githubUrl: 'https://github.com/talentsphere/elevate-platform',
          demoUrl: 'https://ais-dev-5pjymq2ug6pdyoxcqthqwg-310532687854.asia-southeast1.run.app',
        },
        {
          id: 'PRJ_2',
          title: 'Predictive Competency & Skill Gap Analyzer',
          description: 'Engineered a machine learning tool that analyzes assessment performance to calculate real-time career readiness.',
          technologies: ['Python', 'Pandas', 'Scikit-Learn', 'FastAPI'],
          githubUrl: 'https://github.com/talentsphere/skill-gap-analyzer',
        },
      ],
      certificates: [
        {
          id: 'CRT_1',
          name: 'Certified Talent Management & Performance Specialist',
          issuer: 'Global HR Tech Institute',
          date: '2026-06-15',
          url: 'https://credentials.talentsphere.edu/verify/CRT_1',
        },
        {
          id: 'CRT_2',
          name: 'AI & Data-Driven Career Pathing Architect',
          issuer: 'Google AI Studio Academy',
          date: '2026-07-20',
          url: 'https://credentials.talentsphere.edu/verify/CRT_2',
        },
      ],
      careerGoal: 'To become a Principal AI Talent Architect and Lead Employee Performance Strategist.',
      targetRole: 'AI Talent Architect & Employee Performance Strategist',
      learningStreak: 12,
      publicPortfolio: true,
      bio: 'Enthusiastic developer and talent growth strategist passionate about AI, employee performance frameworks, and structured career acceleration.',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA / Online',
    };

    this.studentProfiles.set(studentUser.id, profile);

    // 3. Courses
    const course1: Course = {
      id: 'CRS_TALENT_101',
      title: 'Talent Management Platform for Employee Performance and Career Growth',
      description: 'Master the full lifecycle of employee performance evaluation, OKRs, dynamic competency mapping, progressive day-wise skill building, and AI-assisted career pathing.',
      category: 'Talent & HR Tech',
      difficulty: 'Intermediate',
      instructor: 'Dr. Sarah Jenkins',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      enrolledCount: 142,
      modules: [
        {
          id: 'MOD_DAY1',
          dayId: 1,
          weekId: 1,
          dayLabel: 'Week 1 Day 1',
          title: 'Week 1 Day 1: Performance Management Foundations & Goal Alignment',
          description: 'Explore modern continuous performance frameworks, KPI setting, and sprint-based review check-ins.',
          lessons: [
            { id: 'LES_1_1', title: 'Introduction to Continuous Performance Reviews', content: 'Modern employee performance moves away from static annual reviews to sprint check-ins...', duration: '15 Mins' },
            { id: 'LES_1_2', title: 'Crafting Measurable OKRs & Key Metrics', content: 'Learn to define actionable Key Results linked to business strategy...', duration: '20 Mins' },
          ],
          documents: [
            {
              id: 'DOC_DAY1_1',
              filename: 'Day1_Performance_Management_Foundations.pdf',
              fileType: 'pdf',
              ownerId: 'USR_TEACHER_1',
              uploadedBy: 'Dr. Sarah Jenkins',
              courseId: 'CRS_TALENT_101',
              dayId: 1,
              weekId: 1,
              dayLabel: 'Week 1 Day 1',
              category: 'Talent & Performance',
              status: 'Completed',
              pageCount: 14,
              vectorChunkCount: 4,
              accessLevel: 'unlocked_students',
              uploadDate: '2026-08-01',
            },
            {
              id: 'DOC_DAY1_2',
              filename: 'Day1_OKRs_and_KPI_Setting_Guide.pdf',
              fileType: 'pdf',
              ownerId: 'USR_TEACHER_1',
              uploadedBy: 'Dr. Sarah Jenkins',
              courseId: 'CRS_TALENT_101',
              dayId: 1,
              weekId: 1,
              dayLabel: 'Week 1 Day 1',
              category: 'Goal Alignment',
              status: 'Completed',
              pageCount: 10,
              vectorChunkCount: 3,
              accessLevel: 'unlocked_students',
              uploadDate: '2026-08-01',
            },
          ],
          assessmentId: 'ASM_W1_D1',
        },
        {
          id: 'MOD_DAY2',
          dayId: 2,
          weekId: 1,
          dayLabel: 'Week 1 Day 2',
          title: 'Week 1 Day 2: AI-Assisted Career Pathing & Competency Mapping',
          description: 'Learn how AI models construct skill gap roadmaps and dynamically compute career readiness scores.',
          lessons: [
            { id: 'LES_2_1', title: 'Competency Framework Architecture', content: 'Classifying skills into core technical proficiencies, soft skills, and leadership signals...', duration: '25 Mins' },
            { id: 'LES_2_2', title: 'AI-Driven Gap Analysis & Pathing', content: 'Using vector similarity and assessment metrics to map student trajectories...', duration: '30 Mins' },
          ],
          documents: [
            {
              id: 'DOC_DAY2_1',
              filename: 'Day2_AI_Assisted_Career_Pathing.pdf',
              fileType: 'pdf',
              ownerId: 'USR_TEACHER_1',
              uploadedBy: 'Dr. Sarah Jenkins',
              courseId: 'CRS_TALENT_101',
              dayId: 2,
              weekId: 1,
              dayLabel: 'Week 1 Day 2',
              category: 'Career Growth',
              status: 'Completed',
              pageCount: 18,
              vectorChunkCount: 4,
              accessLevel: 'unlocked_students',
              uploadDate: '2026-08-02',
            },
            {
              id: 'DOC_DAY2_2',
              filename: 'Day2_Competency_Mapping_Framework.pdf',
              fileType: 'pdf',
              ownerId: 'USR_TEACHER_1',
              uploadedBy: 'Dr. Sarah Jenkins',
              courseId: 'CRS_TALENT_101',
              dayId: 2,
              weekId: 1,
              dayLabel: 'Week 1 Day 2',
              category: 'Skill Matrix',
              status: 'Completed',
              pageCount: 12,
              vectorChunkCount: 3,
              accessLevel: 'unlocked_students',
              uploadDate: '2026-08-02',
            },
          ],
          assessmentId: 'ASM_W1_D2',
        },
        {
          id: 'MOD_DAY3',
          dayId: 3,
          weekId: 1,
          dayLabel: 'Week 1 Day 3',
          title: 'Week 1 Day 3: Advanced 360 Feedback, Leadership & Succession Planning',
          description: 'Deploy multi-stakeholder peer evaluation systems, leadership readiness indexes, and talent pipeline management.',
          lessons: [
            { id: 'LES_3_1', title: '360-Degree Feedback System Design', content: 'Integrating peer, mentor, and direct report evaluations into actionable growth loops...', duration: '30 Mins' },
            { id: 'LES_3_2', title: 'Executive Talent Succession Pipelines', content: 'Building resilient leadership pipelines using dynamic skill scores...', duration: '25 Mins' },
          ],
          documents: [
            {
              id: 'DOC_DAY3_1',
              filename: 'Day3_Advanced_360_Feedback_and_Leadership.pdf',
              fileType: 'pdf',
              ownerId: 'USR_TEACHER_1',
              uploadedBy: 'Dr. Sarah Jenkins',
              courseId: 'CRS_TALENT_101',
              dayId: 3,
              weekId: 1,
              dayLabel: 'Week 1 Day 3',
              category: 'Leadership & Feedback',
              status: 'Completed',
              pageCount: 22,
              vectorChunkCount: 5,
              accessLevel: 'unlocked_students',
              uploadDate: '2026-08-03',
            },
          ],
          assessmentId: 'ASM_W1_D3',
        },
        {
          id: 'MOD_DAY4',
          dayId: 4,
          weekId: 1,
          dayLabel: 'Week 1 Day 4',
          title: 'Week 1 Day 4: Agile Continuous Appraisal & Sprint Reviews',
          description: 'Calibrate sprint retrospectives with employee growth benchmarks and continuous competency reviews.',
          lessons: [
            { id: 'LES_4_1', title: 'Agile Performance Check-in Sprints', content: 'Bi-weekly calibration loops that align team velocity with talent growth...', duration: '20 Mins' },
          ],
          documents: [
            {
              id: 'DOC_DAY4_1',
              filename: 'Day4_Agile_Continuous_Appraisal_and_Sprints.pdf',
              fileType: 'pdf',
              ownerId: 'USR_TEACHER_1',
              uploadedBy: 'Dr. Sarah Jenkins',
              courseId: 'CRS_TALENT_101',
              dayId: 4,
              weekId: 1,
              dayLabel: 'Week 1 Day 4',
              category: 'Agile Performance',
              status: 'Completed',
              pageCount: 16,
              vectorChunkCount: 4,
              accessLevel: 'unlocked_students',
              uploadDate: '2026-08-04',
            },
          ],
          assessmentId: 'ASM_W1_D4',
        },
        {
          id: 'MOD_DAY5',
          dayId: 5,
          weekId: 1,
          dayLabel: 'Week 1 Day 5',
          title: 'Week 1 Day 5: Talent Analytics, KPI Dashboards & Retention Modeling',
          description: 'Leverage quantitative workforce telemetry, turnover prediction algorithms, and performance ROI dashboards.',
          lessons: [
            { id: 'LES_5_1', title: 'Employee Flight Risk & Retention Models', content: 'Machine learning approaches to predict talent churn and recommend interventions...', duration: '30 Mins' },
          ],
          documents: [
            {
              id: 'DOC_DAY5_1',
              filename: 'Day5_Talent_Analytics_and_Retention_Modeling.pdf',
              fileType: 'pdf',
              ownerId: 'USR_TEACHER_1',
              uploadedBy: 'Dr. Sarah Jenkins',
              courseId: 'CRS_TALENT_101',
              dayId: 5,
              weekId: 1,
              dayLabel: 'Week 1 Day 5',
              category: 'Talent Analytics',
              status: 'Completed',
              pageCount: 20,
              vectorChunkCount: 4,
              accessLevel: 'unlocked_students',
              uploadDate: '2026-08-05',
            },
          ],
          assessmentId: 'ASM_W1_D5',
        },
        {
          id: 'MOD_DAY6',
          dayId: 6,
          weekId: 2,
          dayLabel: 'Week 2 Day 1',
          title: 'Week 2 Day 1: Enterprise Talent Architecture & Role Competencies',
          description: 'Align corporate promotion ladders with enterprise skill taxonomy and cross-departmental talent mobility.',
          lessons: [
            { id: 'LES_6_1', title: 'Enterprise Skill Taxonomy & Leveling', content: 'Structuring engineering IC tracks and leadership ladders...', duration: '25 Mins' },
          ],
          documents: [
            {
              id: 'DOC_DAY6_1',
              filename: 'Week2_Day1_Enterprise_Talent_Architecture.pdf',
              fileType: 'pdf',
              ownerId: 'USR_TEACHER_1',
              uploadedBy: 'Dr. Sarah Jenkins',
              courseId: 'CRS_TALENT_101',
              dayId: 6,
              weekId: 2,
              dayLabel: 'Week 2 Day 1',
              category: 'Enterprise Strategy',
              status: 'Completed',
              pageCount: 24,
              vectorChunkCount: 4,
              accessLevel: 'unlocked_students',
              uploadDate: '2026-08-06',
            },
          ],
          assessmentId: 'ASM_W2_D1',
        },
        {
          id: 'MOD_DAY7',
          dayId: 7,
          weekId: 2,
          dayLabel: 'Week 2 Day 2',
          title: 'Week 2 Day 2: Predictive Talent Pipelines & AI Learning Roadmaps',
          description: 'Deploy generative AI models that craft personalized learning interventions and career transition roadmaps.',
          lessons: [
            { id: 'LES_7_1', title: 'Autonomous Career Roadmap Generation', content: 'Using LLM reasoning loops to evaluate skill gaps and synthesize targeted learning paths...', duration: '35 Mins' },
          ],
          documents: [
            {
              id: 'DOC_DAY7_1',
              filename: 'Week2_Day2_Predictive_Talent_Pipeline_and_AI.pdf',
              fileType: 'pdf',
              ownerId: 'USR_TEACHER_1',
              uploadedBy: 'Dr. Sarah Jenkins',
              courseId: 'CRS_TALENT_101',
              dayId: 7,
              weekId: 2,
              dayLabel: 'Week 2 Day 2',
              category: 'AI Pipeline',
              status: 'Completed',
              pageCount: 21,
              vectorChunkCount: 4,
              accessLevel: 'unlocked_students',
              uploadDate: '2026-08-07',
            },
          ],
          assessmentId: 'ASM_W2_D2',
        },
      ],
    };

    this.courses = [course1];

    // 4. Enrollments
    this.enrollments.push({
      id: 'ENR_1',
      userId: studentUser.id,
      courseId: course1.id,
      unlockedDay: 1, // Currently Day 1 unlocked
      completedLessons: ['LES_1_1', 'LES_1_2'],
      enrolledAt: '2026-08-01T10:00:00.000Z',
      lastActivity: new Date().toISOString(),
    });

    // 5. Week & Day-wise Assessments
    const asmW1D1: Assessment = {
      id: 'ASM_W1_D1',
      title: 'Week 1 Day 1 Evaluation: Performance Foundations & OKRs',
      description: 'Test your comprehension of continuous reviews, KPI setting, and SMART objective alignment.',
      subject: 'Talent & Performance',
      courseId: course1.id,
      dayId: 1,
      weekId: 1,
      dayLabel: 'Week 1 Day 1',
      difficulty: 'Medium',
      durationMinutes: 15,
      totalMarks: 30,
      passingMarks: 20,
      attemptLimit: 3,
      questions: [
        {
          id: 'Q1_1',
          text: 'Which pillar replaces traditional annual performance reviews in modern talent management?',
          options: ['Static yearly appraisal forms', 'Continuous sprint-based check-ins and real-time skill verification', 'Manager-only subjective rating', 'Seniority-based rankings'],
          correctAnswer: 1,
          type: 'MCQ',
          marks: 10,
        },
        {
          id: 'Q1_2',
          text: 'What is a core requirement for a Key Result in OKR goal setting?',
          options: ['Must be generic and unmeasured', 'Must be measurable, ambitious, and time-bounded', 'Must be confidential to management', 'Must never change'],
          correctAnswer: 1,
          type: 'MCQ',
          marks: 10,
        },
        {
          id: 'Q1_3',
          text: 'Skill scores in Talent Sphere Elevate automatically update upon completion of evaluated assessments.',
          options: ['True', 'False'],
          correctAnswer: 0,
          type: 'TRUE_FALSE',
          marks: 10,
        },
      ],
    };

    const asmW1D2: Assessment = {
      id: 'ASM_W1_D2',
      title: 'Week 1 Day 2 Evaluation: AI Career Pathing & Competency Mapping',
      description: 'Evaluate your understanding of AI skill gap analysis, readiness indexes, and competency mapping.',
      subject: 'Career Growth & AI',
      courseId: course1.id,
      dayId: 2,
      weekId: 1,
      dayLabel: 'Week 1 Day 2',
      difficulty: 'Hard',
      durationMinutes: 20,
      totalMarks: 30,
      passingMarks: 20,
      attemptLimit: 3,
      questions: [
        {
          id: 'Q2_1',
          text: 'How does the AI Personalization Engine construct a student skill gap roadmap?',
          options: ['By randomly picking courses', 'By comparing current assessment scores against target role competency profiles', 'By using student age only', 'By requiring manual admin approval'],
          correctAnswer: 1,
          type: 'MCQ',
          marks: 10,
        },
        {
          id: 'Q2_2',
          text: 'Which factors contribute to a student Career Readiness Score out of 100?',
          options: ['Only assessment scores', 'Assessment scores, project complexity, certificate verifications, and learning streak consistency', 'Only college GPA', 'Social media activity'],
          correctAnswer: 1,
          type: 'MCQ',
          marks: 10,
        },
        {
          id: 'Q2_3',
          text: 'ChromaDB vector search queries must enforce a strict metadata filter where day_id <= user_current_unlocked_day.',
          options: ['True', 'False'],
          correctAnswer: 0,
          type: 'TRUE_FALSE',
          marks: 10,
        },
      ],
    };

    const asmW1D3: Assessment = {
      id: 'ASM_W1_D3',
      title: 'Week 1 Day 3 Evaluation: 360 Feedback & Leadership Readiness',
      description: 'Test your mastery of multi-stakeholder 360 evaluations, peer review loops, and leadership pipeline development.',
      subject: 'Leadership & Feedback',
      courseId: course1.id,
      dayId: 3,
      weekId: 1,
      dayLabel: 'Week 1 Day 3',
      difficulty: 'Hard',
      durationMinutes: 20,
      totalMarks: 30,
      passingMarks: 20,
      attemptLimit: 3,
      questions: [
        {
          id: 'Q3_1',
          text: 'What is the primary advantage of a 360-degree feedback loop over top-down appraisal?',
          options: ['It takes less time to fill out', 'It synthesizes multi-perspective inputs from peers, leads, and self-assessment', 'It eliminates the need for objective KPIs', 'It guarantees an immediate promotion'],
          correctAnswer: 1,
          type: 'MCQ',
          marks: 10,
        },
        {
          id: 'Q3_2',
          text: 'Succession planning in modern talent systems relies on dynamic skill readiness indexes rather than tenure alone.',
          options: ['True', 'False'],
          correctAnswer: 0,
          type: 'TRUE_FALSE',
          marks: 10,
        },
        {
          id: 'Q3_3',
          text: 'How should leadership feedback be translated into actionable growth for students and employees?',
          options: ['By filing it away unread', 'By synthesizing qualitative comments into prioritized competency roadmaps', 'By only celebrating high scores', 'By publicly ranking all participants'],
          correctAnswer: 1,
          type: 'MCQ',
          marks: 10,
        },
      ],
    };

    const asmW1D4: Assessment = {
      id: 'ASM_W1_D4',
      title: 'Week 1 Day 4 Evaluation: Agile Performance & Sprint Retrospectives',
      description: 'Evaluate your understanding of agile sprint appraisals and continuous talent calibration.',
      subject: 'Agile Performance',
      courseId: course1.id,
      dayId: 4,
      weekId: 1,
      dayLabel: 'Week 1 Day 4',
      difficulty: 'Medium',
      durationMinutes: 15,
      totalMarks: 30,
      passingMarks: 20,
      attemptLimit: 3,
      questions: [
        {
          id: 'Q4_1',
          text: 'How frequently are agile performance check-in sprint cycles typically conducted?',
          options: ['Every 5 years', 'Every 2 to 4 weeks alongside development sprints', 'Only upon employee resignation', 'Annually on January 1st'],
          correctAnswer: 1,
          type: 'MCQ',
          marks: 10,
        },
        {
          id: 'Q4_2',
          text: 'Continuous agile calibration allows mentors to identify blockers and adapt learning paths early.',
          options: ['True', 'False'],
          correctAnswer: 0,
          type: 'TRUE_FALSE',
          marks: 10,
        },
        {
          id: 'Q4_3',
          text: 'What should be the primary deliverable of a sprint talent retrospective?',
          options: ['A punitive letter', 'A concrete list of targeted skill adjustments and verified milestone outcomes', 'A salary decrease', 'A generic survey'],
          correctAnswer: 1,
          type: 'MCQ',
          marks: 10,
        },
      ],
    };

    const asmW1D5: Assessment = {
      id: 'ASM_W1_D5',
      title: 'Week 1 Day 5 Evaluation: Talent Analytics & Retention Modeling',
      description: 'Test your understanding of workforce telemetry, retention metrics, and predictive HR analytics.',
      subject: 'Talent Analytics',
      courseId: course1.id,
      dayId: 5,
      weekId: 1,
      dayLabel: 'Week 1 Day 5',
      difficulty: 'Hard',
      durationMinutes: 20,
      totalMarks: 30,
      passingMarks: 20,
      attemptLimit: 3,
      questions: [
        {
          id: 'Q5_1',
          text: 'Which statistical metric is widely used to evaluate employee retention stability across departments?',
          options: ['Voluntary Turnover Rate & Churn Hazard Ratio', 'Website pageview count', 'Total lines of code written', 'Number of coffee breaks'],
          correctAnswer: 0,
          type: 'MCQ',
          marks: 10,
        },
        {
          id: 'Q5_2',
          text: 'Predictive talent analytics models use assessment participation momentum as an indicator of engagement.',
          options: ['True', 'False'],
          correctAnswer: 0,
          type: 'TRUE_FALSE',
          marks: 10,
        },
        {
          id: 'Q5_3',
          text: 'What is the best intervention strategy when an AI model signals an employee flight risk due to skill stagnation?',
          options: ['Terminate the employee immediately', 'Offer targeted upskilling, mentorship, and clear internal mobility paths', 'Ignore the signal', 'Assign repetitive manual tasks'],
          correctAnswer: 1,
          type: 'MCQ',
          marks: 10,
        },
      ],
    };

    const asmW2D1: Assessment = {
      id: 'ASM_W2_D1',
      title: 'Week 2 Day 1 Evaluation: Enterprise Talent Architecture',
      description: 'Assess enterprise competency leveling, promotion rubrics, and organizational design frameworks.',
      subject: 'Enterprise Architecture',
      courseId: course1.id,
      dayId: 6,
      weekId: 2,
      dayLabel: 'Week 2 Day 1',
      difficulty: 'Hard',
      durationMinutes: 25,
      totalMarks: 30,
      passingMarks: 20,
      attemptLimit: 3,
      questions: [
        {
          id: 'Q6_1',
          text: 'What is the purpose of an enterprise skill taxonomy in a global corporation?',
          options: ['To standardize competencies across business units and facilitate internal talent mobility', 'To make job titles as confusing as possible', 'To limit employee transfers', 'To replace human managers entirely'],
          correctAnswer: 0,
          type: 'MCQ',
          marks: 10,
        },
        {
          id: 'Q6_2',
          text: 'Dual-track career ladders allow technical individual contributors to advance without becoming people managers.',
          options: ['True', 'False'],
          correctAnswer: 0,
          type: 'TRUE_FALSE',
          marks: 10,
        },
        {
          id: 'Q6_3',
          text: 'Which rubric element distinguishes a Principal Engineer from a Senior Engineer in competency mapping?',
          options: ['Organization-wide strategic impact and technical mentorship breadth', 'Total hours spent typing', 'Age and tenure at the company', 'Office desk location'],
          correctAnswer: 0,
          type: 'MCQ',
          marks: 10,
        },
      ],
    };

    const asmW2D2: Assessment = {
      id: 'ASM_W2_D2',
      title: 'Week 2 Day 2 Evaluation: Predictive Talent Pipelines & AI Roadmaps',
      description: 'Master generative LLM integration for adaptive learning, automated rubrics, and talent recommendations.',
      subject: 'AI Pipelines',
      courseId: course1.id,
      dayId: 7,
      weekId: 2,
      dayLabel: 'Week 2 Day 2',
      difficulty: 'Hard',
      durationMinutes: 25,
      totalMarks: 30,
      passingMarks: 20,
      attemptLimit: 3,
      questions: [
        {
          id: 'Q7_1',
          text: 'How does a Retrieval-Augmented Generation (RAG) agent maintain strict learning boundaries for students?',
          options: ['By grounding responses strictly on documents from unlocked weeks and days via metadata filters', 'By guessing answers without documents', 'By giving all answers to locked exams immediately', 'By turning off AI safety checks'],
          correctAnswer: 0,
          type: 'MCQ',
          marks: 10,
        },
        {
          id: 'Q7_2',
          text: 'Automated skill roadmaps update dynamically as students clear evaluation milestones in the Exam Portal.',
          options: ['True', 'False'],
          correctAnswer: 0,
          type: 'TRUE_FALSE',
          marks: 10,
        },
        {
          id: 'Q7_3',
          text: 'What is the primary role of teacher control in automated talent progression systems?',
          options: ['Teachers calibrate unlock schedules, verify curriculum rigor, and mentor students through skill gaps', 'Teachers have no role in AI systems', 'Teachers only enter grades manually on paper', 'Teachers must write all code from scratch'],
          correctAnswer: 0,
          type: 'MCQ',
          marks: 10,
        },
      ],
    };

    this.assessments = [asmW1D1, asmW1D2, asmW1D3, asmW1D4, asmW1D5, asmW2D1, asmW2D2];

    // Seed Initial Attempts
    this.assessmentAttempts.push({
      id: 'ATT_1',
      assessmentId: asmW1D1.id,
      assessmentTitle: asmW1D1.title,
      userId: studentUser.id,
      userName: studentUser.name,
      userEmail: studentUser.email,
      dayId: 1,
      weekId: 1,
      dayLabel: 'Week 1 Day 1 (Mon)',
      score: 30,
      totalMarks: 30,
      passed: true,
      answers: { Q1_1: 1, Q1_2: 1, Q1_3: 0 },
      aiAnalysis: 'Outstanding performance! You have mastered Week 1 Day 1 Foundations & OKRs with 100% accuracy.',
      submittedAt: '2026-08-05T14:30:00.000Z',
      resultReleased: true,
      releasedAt: '2026-08-05T14:35:00.000Z',
    });

    this.assessmentAttempts.push({
      id: 'ATT_2',
      assessmentId: asmW1D2.id,
      assessmentTitle: asmW1D2.title,
      userId: studentUser.id,
      userName: studentUser.name,
      userEmail: studentUser.email,
      dayId: 2,
      weekId: 1,
      dayLabel: 'Week 1 Day 2 (Tue)',
      score: 28,
      totalMarks: 30,
      passed: true,
      answers: { Q2_1: 0, Q2_2: 0, Q2_3: 0 },
      aiAnalysis: 'Strong mastery of Competency Mapping frameworks. Minor review advised on behavioral taxonomy matrices.',
      submittedAt: '2026-08-06T10:15:00.000Z',
      resultReleased: false, // Locked until teacher unlocks!
    });

    // Seed attempts for cohort students to populate Result Hub analytics
    this.assessmentAttempts.push(
      {
        id: 'ATT_ALEX_W1D1',
        assessmentId: 'ASM_W1_D1',
        assessmentTitle: 'Week 1 Day 1 Evaluation: Performance Foundations & OKRs',
        userId: studentAlex.id,
        userName: studentAlex.name,
        userEmail: studentAlex.email,
        dayId: 1,
        weekId: 1,
        dayLabel: 'Week 1 Day 1 (Mon)',
        score: 30,
        totalMarks: 30,
        passed: true,
        answers: { Q1_1: 1, Q1_2: 0, Q1_3: 1 },
        aiAnalysis: 'Flawless answers on OKR formulation and key result scoring metrics.',
        submittedAt: '2026-08-04T09:30:00.000Z',
        resultReleased: true,
      },
      {
        id: 'ATT_SARAH_W1D1',
        assessmentId: 'ASM_W1_D1',
        assessmentTitle: 'Week 1 Day 1 Evaluation: Performance Foundations & OKRs',
        userId: studentSarah.id,
        userName: studentSarah.name,
        userEmail: studentSarah.email,
        dayId: 1,
        weekId: 1,
        dayLabel: 'Week 1 Day 1 (Mon)',
        score: 25,
        totalMarks: 30,
        passed: true,
        answers: { Q1_1: 1, Q1_2: 0, Q1_3: 0 },
        aiAnalysis: 'Great performance. Recommended review on outcome-based milestones.',
        submittedAt: '2026-08-04T10:15:00.000Z',
        resultReleased: true,
      },
      {
        id: 'ATT_DAVID_W1D1',
        assessmentId: 'ASM_W1_D1',
        assessmentTitle: 'Week 1 Day 1 Evaluation: Performance Foundations & OKRs',
        userId: studentDavid.id,
        userName: studentDavid.name,
        userEmail: studentDavid.email,
        dayId: 1,
        weekId: 1,
        dayLabel: 'Week 1 Day 1 (Mon)',
        score: 18,
        totalMarks: 30,
        passed: false,
        answers: { Q1_1: 0, Q1_2: 1, Q1_3: 1 },
        aiAnalysis: 'Passing score not achieved. Suggest reviewing Day 1 study notes and re-attempting.',
        submittedAt: '2026-08-04T11:00:00.000Z',
        resultReleased: true,
      },
      {
        id: 'ATT_PRIYA_W1D1',
        assessmentId: 'ASM_W1_D1',
        assessmentTitle: 'Week 1 Day 1 Evaluation: Performance Foundations & OKRs',
        userId: studentPriya.id,
        userName: studentPriya.name,
        userEmail: studentPriya.email,
        dayId: 1,
        weekId: 1,
        dayLabel: 'Week 1 Day 1 (Mon)',
        score: 30,
        totalMarks: 30,
        passed: true,
        answers: { Q1_1: 1, Q1_2: 0, Q1_3: 1 },
        aiAnalysis: 'Exceptional comprehension of talent development pipelines.',
        submittedAt: '2026-08-04T11:45:00.000Z',
        resultReleased: true,
      },
      {
        id: 'ATT_LUCAS_W1D1',
        assessmentId: 'ASM_W1_D1',
        assessmentTitle: 'Week 1 Day 1 Evaluation: Performance Foundations & OKRs',
        userId: studentLucas.id,
        userName: studentLucas.name,
        userEmail: studentLucas.email,
        dayId: 1,
        weekId: 1,
        dayLabel: 'Week 1 Day 1 (Mon)',
        score: 22,
        totalMarks: 30,
        passed: true,
        answers: { Q1_1: 1, Q1_2: 0, Q1_3: 2 },
        aiAnalysis: 'Solid grasp of foundational terminology.',
        submittedAt: '2026-08-04T13:20:00.000Z',
        resultReleased: true,
      }
    );

    // 6. Course Materials (Collection Data)
    this.courseMaterials = [
      {
        id: 'MAT_1',
        title: 'Talent Management & Performance Foundations',
        filename: 'Talent_Management_Foundations_W1.pdf',
        fileType: 'application/pdf',
        fileSize: '2.4 MB',
        summary: 'Core principles of organizational talent mapping, competency matrices, and performance appraisal frameworks.',
        uploadedBy: 'Prof. Eleanor Vance',
        uploadedAt: '2026-08-01T10:00:00.000Z',
        week: 1,
        day: 1,
        topic: 'Performance Management',
        status: 'Ready',
        chunkCount: 5,
        lineCount: 342,
        wordCount: 4180,
        pictureCount: 4,
        pictures: [
          {
            id: 'PIC_1_1',
            title: 'SMART OKR Alignment Hierarchy',
            type: 'diagram',
            pageNumber: 3,
            caption: 'Visual diagram illustrating top-down organizational objectives cascading into measurable key results.',
          },
          {
            id: 'PIC_1_2',
            title: 'Talent Competency Matrix Grid',
            type: 'table',
            pageNumber: 7,
            caption: 'Four-quadrant matrix detailing functional skill levels against leadership potential benchmarks.',
          },
          {
            id: 'PIC_1_3',
            title: 'Appraisal Feedback Cycle Flowchart',
            type: 'chart',
            pageNumber: 11,
            caption: 'Continuous bi-weekly calibration workflow from goal setting to quarterly review.',
          },
          {
            id: 'PIC_1_4',
            title: 'Employee Growth Trajectory Curve',
            type: 'diagram',
            pageNumber: 14,
            caption: 'Mathematical curve representing learning velocity versus tenure in high-performing cohorts.',
          },
        ],
        rawContent: `TALENT MANAGEMENT & PERFORMANCE FOUNDATIONS (WEEK 1 DAY 1)
Author: Prof. Eleanor Vance | Faculty Department of Human Capital Engineering

SECTION 1: ORGANIZATIONAL TALENT ARCHITECTURE
Performance management systems serve as the operational backbone of modern enterprises. The objective is aligning individual employee velocity with high-level corporate key results (OKRs).
Traditional annual performance reviews suffer from recency bias and lack actionable feedback. In contrast, agile continuous calibration breaks evaluation into 2-week sprint intervals.

SECTION 2: SMART OBJECTIVES & MEASURABLE TARGETS
1. Specific: Targets must delineate precise deliverables without ambiguity.
2. Measurable: Quantified by leading indicators (e.g. daily active modules, code review velocity) rather than subjective feelings.
3. Achievable: Calibrated within realistic bandwidth without inducing burnout.
4. Relevant: Linked directly to enterprise strategic initiatives.
5. Time-bound: Bound by clear milestone deadlines.

SECTION 3: 360-DEGREE FEEDBACK & MULTI-RATER SYNTHESIS
Integrating peer, subordinate, and manager observations produces a holistic talent score. Biases are normalized using z-score standardization across rating cohorts.`,
      },
      {
        id: 'MAT_2',
        title: 'OKR Formulation & Metric Alignment Guide',
        filename: 'OKR_Strategic_Alignment_Handbook.pdf',
        fileType: 'application/pdf',
        fileSize: '3.8 MB',
        summary: 'Comprehensive guidelines for setting quantifiable OKRs, avoiding vanity metrics, and driving quarterly progress.',
        uploadedBy: 'Dr. Marcus Brady',
        uploadedAt: '2026-08-02T14:30:00.000Z',
        week: 1,
        day: 2,
        topic: 'Goal Setting & OKRs',
        status: 'Ready',
        chunkCount: 4,
        lineCount: 285,
        wordCount: 3620,
        pictureCount: 3,
        pictures: [
          {
            id: 'PIC_2_1',
            title: 'Objective to Key Result Mapping Matrix',
            type: 'diagram',
            pageNumber: 2,
            caption: 'Diagram showing departmental goals mapped into three verifiable metrics per quarter.',
          },
          {
            id: 'PIC_2_2',
            title: 'Leading vs Lagging Indicator Comparison',
            type: 'chart',
            pageNumber: 6,
            caption: 'Comparative visual showing velocity inputs vs revenue trailing outputs.',
          },
          {
            id: 'PIC_2_3',
            title: 'Quarterly OKR Scoring Grading Rubric',
            type: 'table',
            pageNumber: 10,
            caption: '0.0 to 1.0 scoring scale guidelines for moonshot and committed goals.',
          },
        ],
        rawContent: `OKR FORMULATION & METRIC ALIGNMENT GUIDE (WEEK 1 DAY 2)
Author: Dr. Marcus Brady | Talent Sphere Academy

SECTION 1: THE ANATOMY OF AN EFFECTIVE OKR
Objectives describe where we want to go; Key Results measure whether we got there.
- Objectives are qualitative, ambitious, and inspirational.
- Key Results are strictly numeric, verifiable, and binary in accomplishment proof.

SECTION 2: COMMITTED VS ASPIRATIONAL GOALS
Committed OKRs require 1.0 (100%) completion for success. Aspirational (moonshot) OKRs are expected to land around 0.7 (70%), driving innovation without fear of penalty for daring goals.

SECTION 3: AVOIDING VANITY METRICS
Metrics must correlate with genuine business value. Output metrics (tickets closed) must be balanced with outcome metrics (customer satisfaction, defect reduction rate).`,
      },
      {
        id: 'MAT_3',
        title: '360 Degree Feedback & Leadership Readiness Matrix',
        filename: 'Leadership_Readiness_Framework.pdf',
        fileType: 'application/pdf',
        fileSize: '1.9 MB',
        summary: 'Detailed methodologies for synthesizing peer and upward feedback into personalized executive coaching plans.',
        uploadedBy: 'Prof. Eleanor Vance',
        uploadedAt: '2026-08-03T09:15:00.000Z',
        week: 1,
        day: 3,
        topic: 'Leadership & 360 Feedback',
        status: 'Ready',
        chunkCount: 5,
        lineCount: 310,
        wordCount: 3890,
        pictureCount: 3,
        pictures: [
          {
            id: 'PIC_3_1',
            title: 'Multi-Stakeholder Feedback Radar Chart',
            type: 'chart',
            pageNumber: 4,
            caption: 'Radar plot contrasting self-perception scores against peer and upward leadership evaluations.',
          },
          {
            id: 'PIC_3_2',
            title: 'Leadership Pipeline Succession Tree',
            type: 'diagram',
            pageNumber: 9,
            caption: 'Organizational hierarchy displaying candidate bench readiness for executive transition.',
          },
          {
            id: 'PIC_3_3',
            title: 'Coaching GROW Model Interaction Cycle',
            type: 'diagram',
            pageNumber: 15,
            caption: 'Goal, Reality, Options, and Way Forward interactive coaching loop schema.',
          },
        ],
        rawContent: `360-DEGREE FEEDBACK & LEADERSHIP READINESS MATRIX (WEEK 1 DAY 3)
Author: Prof. Eleanor Vance | Human Resource Analytics Lab

SECTION 1: 360-DEGREE SYSTEM DESIGN
Evaluating an individual from four quadrants: Direct Manager, Peer Colleagues, Direct Reports, and Self.
Discrepancies between Self and Peer evaluations reveal hidden blind spots and unacknowledged strengths.

SECTION 2: SUCCESSION PLANNING & READINESS SCORING
Leadership potential is calculated as a composite index of technical mastery, emotional quotient (EQ), conflict de-escalation, and strategic vision.
Candidates in the talent pipeline receive individualized growth sprints to close identified competency gaps.`,
      },
      {
        id: 'MAT_4',
        title: 'Agile Performance Calibration & Sprint Sprints',
        filename: 'Agile_Talent_Retrospectives.pdf',
        fileType: 'application/pdf',
        fileSize: '4.1 MB',
        summary: 'Short-cycle continuous feedback loops and milestone appraisals aligned with modern agile sprints.',
        uploadedBy: 'Dr. Marcus Brady',
        uploadedAt: '2026-08-04T16:00:00.000Z',
        week: 1,
        day: 4,
        topic: 'Agile Performance',
        status: 'Ready',
        chunkCount: 4,
        lineCount: 290,
        wordCount: 3450,
        pictureCount: 2,
        pictures: [
          {
            id: 'PIC_4_1',
            title: 'Agile Sprint Appraisal Cadence Timeline',
            type: 'diagram',
            pageNumber: 3,
            caption: 'Bi-weekly retrospective and calibration synchronization with software sprint deliveries.',
          },
          {
            id: 'PIC_4_2',
            title: 'Continuous Competency Check-In Board',
            type: 'table',
            pageNumber: 8,
            caption: 'Visual kanban board mapping skill progression stages from Novice to Subject Matter Expert.',
          },
        ],
        rawContent: `AGILE PERFORMANCE CALIBRATION & SPRINT APPRAISALS (WEEK 1 DAY 4)
Author: Dr. Marcus Brady | Faculty of Engineering Management

SECTION 1: CONTINUOUS FEEDBACK LOOPS
Traditional performance appraisal fails in fast-paced software environments. Agile talent calibration embeds 15-minute 1-on-1 coaching at the close of each sprint iteration.

SECTION 2: SPRINT RETROSPECTIVES AS TALENT SENSORS
Sprint retrospectives serve as real-time sensors for psychological safety, workload distribution anomalies, and emerging skill blockers.

SECTION 3: ACTIONABLE SKILL ADJUSTMENTS
Deliverables from each calibration cycle include concrete micro-learning milestones and pairing with senior domain mentors.`,
      },
    ];

    // 7. Student Attendance Tracking Matrix
    const studentList = [studentUser, studentAlex, studentSarah, studentDavid, studentPriya, studentLucas];
    const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    let attCounter = 1;
    for (let w = 1; w <= 4; w++) {
      for (const d of days) {
        for (const st of studentList) {
          const isPresent = (attCounter % 7 !== 0 && attCounter % 11 !== 0);
          const isLate = (attCounter % 11 === 0);
          const status: 'Present' | 'Absent' | 'Late' = isPresent ? 'Present' : isLate ? 'Late' : 'Absent';
          
          this.attendance.push({
            id: `ATT_REC_${w}_${d}_${st.id}`,
            studentId: st.id,
            studentName: st.name,
            studentUniqueId: `STU-${st.id.slice(-4)}`,
            department: 'Computer Science & AI',
            week: w,
            day: d,
            scheduleLabel: `Week ${w} • ${d}`,
            status,
            updatedAt: new Date(2026, 7, w * 5).toISOString(),
          });
          attCounter++;
        }
      }
    }

    // 8. Announcements
    this.announcements = [
      {
        id: 'ANN_1',
        title: 'Week 1 Day 1 Evaluation is Live: Performance Foundations & OKRs',
        message: 'The Week 1 Day 1 proctored exam is now published and open for all enrolled students. Please review the study notes before beginning.',
        createdBy: 'Prof. Eleanor Vance',
        creatorRole: 'Lead Instructor',
        targetWeek: 1,
        targetDay: 1,
        dayLabel: 'Week 1 Day 1 (Mon)',
        examId: 'ASM_W1_D1',
        examTitle: 'Week 1 Day 1 Evaluation: Performance Foundations & OKRs',
        topic: 'Performance Foundations',
        isLiveExam: true,
        createdAt: '2026-08-04T08:00:00.000Z',
      },
      {
        id: 'ANN_2',
        title: 'Day 6 AI Face-to-Face Mock Interview Hub Unlocked',
        message: 'Students who have cleared all 5 daily exams for Week 1 can now launch their personalized AI oral interview in the Mock Interview Hub.',
        createdBy: 'Dr. Marcus Brady',
        creatorRole: 'Faculty Director',
        targetWeek: 1,
        targetDay: 6,
        dayLabel: 'Week 1 Day 6 (Face-to-Face)',
        topic: 'AI Voice Mock Interview',
        isLiveExam: false,
        createdAt: '2026-08-05T12:00:00.000Z',
      },
      {
        id: 'ANN_3',
        title: 'Study Materials Uploaded: 360 Feedback Framework',
        message: 'New syllabus documents have been added to the course knowledge base. AI assistant vectors have been updated.',
        createdBy: 'Prof. Eleanor Vance',
        creatorRole: 'Lead Instructor',
        targetWeek: 1,
        targetDay: 3,
        dayLabel: 'Week 1 Day 3 (Wed)',
        topic: '360 Feedback & Leadership',
        isLiveExam: false,
        createdAt: '2026-08-06T09:00:00.000Z',
      },
    ];

    // 9. Mock Interviews
    this.mockInterviews = [
      {
        id: 'MOCK_1',
        studentId: studentUser.id,
        studentName: studentUser.name,
        targetWeek: 1,
        resumeFilename: 'Sanjay_Kumar_Talent_Engineer_Resume.pdf',
        overallScore: 88,
        communicationScore: 92,
        technicalDepthScore: 85,
        confidenceScore: 88,
        summaryText: 'Excellent articulation of OKR alignment and agile feedback loops. Demonstrates mature problem solving and strong technical depth.',
        questionsAnsweredCount: 4,
        totalQuestions: 4,
        completedAt: '2026-08-06T15:30:00.000Z',
      },
      {
        id: 'MOCK_2',
        studentId: studentAlex.id,
        studentName: studentAlex.name,
        targetWeek: 1,
        resumeFilename: 'Alex_Johnson_CV.pdf',
        overallScore: 84,
        communicationScore: 86,
        technicalDepthScore: 82,
        confidenceScore: 85,
        summaryText: 'Clear responses with structured thinking. Good grasp of talent metrics and retention hazards.',
        questionsAnsweredCount: 4,
        totalQuestions: 4,
        completedAt: '2026-08-06T16:00:00.000Z',
      },
    ];

    // 10. Notifications
    this.notifications = [
      {
        id: 'NOTIF_1',
        userId: studentUser.id,
        title: 'Welcome to Talent Sphere Elevate!',
        message: 'Your account is active. Day 1 content is unlocked. Explore courses and start your talent growth ascent.',
        type: 'unlock',
        readStatus: false,
        createdAt: '2026-08-01T08:05:00.000Z',
      },
      {
        id: 'NOTIF_2',
        userId: studentUser.id,
        title: 'Assessment Cleared with Honors',
        message: 'You scored 30/30 on Day 1 Evaluation: Performance Foundations & OKRs. Skill score updated!',
        type: 'assessment',
        readStatus: false,
        createdAt: '2026-08-05T14:31:00.000Z',
      },
    ];

    // 11. Security Logs
    this.securityEvents.push({
      id: 'SEC_1',
      userId: studentUser.id,
      eventType: 'USER_REGISTERED',
      ip: '127.0.0.1',
      details: 'Account created with verified status. Day 1 unlocked.',
      timestamp: '2026-08-01T08:00:00.000Z',
    });
  }

  /**
   * TRANSACTIONAL TEACHER UNLOCK FUNCTION: Unlocks Week/Day for specific student or all students
   */
  public async unlockDayByTeacher(
    targetDayId: number,
    courseId: string = 'CRS_TALENT_101',
    studentId?: string,
    teacherName: string = 'Dr. Sarah Jenkins'
  ): Promise<{ success: boolean; targetDayId: number; message: string; affectedStudentsCount: number }> {
    const weekNum = Math.ceil(targetDayId / 5) || 1;
    const dayInWeek = ((targetDayId - 1) % 5) + 1;
    const dayLabel = `Week ${weekNum} Day ${dayInWeek}`;

    const targetStudents = studentId
      ? this.users.filter((u) => u.id === studentId)
      : this.users.filter((u) => u.role === 'STUDENT');

    if (targetStudents.length === 0) {
      return { success: false, targetDayId, message: 'No eligible students found.', affectedStudentsCount: 0 };
    }

    let affectedCount = 0;

    for (const student of targetStudents) {
      // Set unlocked day to targetDayId (allow teacher to unlock forward or set exact day level)
      if (student.currentUnlockedDay < targetDayId) {
        student.currentUnlockedDay = targetDayId;
      }

      // Update enrollments
      const enrollment = this.enrollments.find((e) => e.userId === student.id && e.courseId === courseId);
      if (enrollment) {
        if (enrollment.unlockedDay < targetDayId) {
          enrollment.unlockedDay = targetDayId;
        }
        enrollment.lastActivity = new Date().toISOString();
      }

      // Create rich in-app notification in student portal
      const notification: NotificationItem = {
        id: 'NOTIF_TEACHER_UNLOCK_' + Date.now() + '_' + student.id,
        userId: student.id,
        title: `🔓 ${dayLabel} (Day ${targetDayId}) Unlocked by Instructor!`,
        message: `Instructor ${teacherName} has unlocked ${dayLabel} course modules, study PDFs, and the Day ${targetDayId} Test in the Exam Portal. Knowledge vectors are now active in TalentSphere AI for research queries.`,
        type: 'unlock',
        readStatus: false,
        createdAt: new Date().toISOString(),
      };
      this.notifications.unshift(notification);

      // Audit log
      this.securityEvents.unshift({
        id: 'SEC_' + Date.now() + '_' + student.id,
        userId: student.id,
        eventType: 'TEACHER_DAY_UNLOCKED',
        ip: '127.0.0.1',
        details: `Instructor ${teacherName} unlocked ${dayLabel} (Day ${targetDayId}) for student ${student.name} (${student.email}).`,
        timestamp: new Date().toISOString(),
      });

      // Send verification ESMTP Email
      emailService
        .sendEmail({
          to: student.email,
          recipientName: student.name,
          subject: `[Talent Sphere] 🔓 ${dayLabel} Unlocked by Instructor ${teacherName}`,
          emailType: 'DAY_UNLOCK',
          title: `${dayLabel} Released: Modules & Exam Ready`,
          mainMessage: `Hello ${student.name},\n\nYour instructor ${teacherName} has unlocked ${dayLabel} (Day ${targetDayId}) in the Talent Management Platform.\n\nYou can now:\n1. Review the newly unlocked ${dayLabel} study PDFs.\n2. Query TalentSphere AI with these documents in your study session.\n3. Take the ${dayLabel} evaluation in your Exam Portal.\n\nBest of luck with your tests!`,
          badgeText: `UNLOCKED: ${dayLabel.toUpperCase()}`,
          actionText: 'Go to Exam Portal',
          actionUrl: `${process.env.APP_URL || 'http://localhost:3000'}/exam-portal`,
        })
        .catch((err) => console.warn('Teacher unlock email dispatch warning:', err));

      affectedCount++;
    }

    return {
      success: true,
      targetDayId,
      message: `Successfully unlocked ${dayLabel} (Day ${targetDayId}) for ${affectedCount} student(s)! In-app notifications and email alerts dispatched.`,
      affectedStudentsCount: affectedCount,
    };
  }

  /**
   * TEACHER LOCK / SET DAY LEVEL FUNCTION: Allows teacher to lock or unlock up to any day level
   */
  public async setDayLockByTeacher(
    targetDayId: number,
    courseId: string = 'CRS_TALENT_101',
    studentId?: string,
    teacherName: string = 'Dr. Sarah Jenkins'
  ): Promise<{ success: boolean; targetDayId: number; message: string; affectedStudentsCount: number }> {
    const clampedDayId = Math.max(0, Math.min(20, targetDayId));
    const weekNum = clampedDayId > 0 ? (Math.ceil(clampedDayId / 5) || 1) : 0;
    const dayInWeek = clampedDayId > 0 ? (((clampedDayId - 1) % 5) + 1) : 0;
    const dayLabel = clampedDayId > 0 ? `Week ${weekNum} Day ${dayInWeek}` : 'All Days Locked (Day 0)';

    const targetStudents = studentId && studentId !== 'all'
      ? this.users.filter((u) => u.id === studentId)
      : this.users.filter((u) => u.role === 'STUDENT');

    if (targetStudents.length === 0) {
      return { success: false, targetDayId: clampedDayId, message: 'No eligible students found.', affectedStudentsCount: 0 };
    }

    let affectedCount = 0;

    for (const student of targetStudents) {
      const prevDay = student.currentUnlockedDay || 1;
      student.currentUnlockedDay = clampedDayId;

      const enrollment = this.enrollments.find((e) => e.userId === student.id && e.courseId === courseId);
      if (enrollment) {
        enrollment.unlockedDay = clampedDayId;
        enrollment.lastActivity = new Date().toISOString();
      }

      const isUnlock = clampedDayId >= prevDay;

      // In-app notification
      this.notifications.unshift({
        id: 'NOTIF_TEACHER_SET_LOCK_' + Date.now() + '_' + student.id,
        userId: student.id,
        title: isUnlock
          ? `🔓 ${dayLabel} (Day ${clampedDayId}) Unlocked by Instructor!`
          : `🔒 Access Updated: Locked to Day ${clampedDayId} by Instructor`,
        message: isUnlock
          ? `Instructor ${teacherName} has unlocked ${dayLabel} course modules, study PDFs, and evaluations for you.`
          : `Instructor ${teacherName} has updated curriculum access level to Day ${clampedDayId}.`,
        type: 'unlock',
        readStatus: false,
        createdAt: new Date().toISOString(),
      });

      // Audit log
      this.securityEvents.unshift({
        id: 'SEC_' + Date.now() + '_' + student.id,
        userId: student.id,
        eventType: isUnlock ? 'TEACHER_DAY_UNLOCKED' : 'TEACHER_DAY_LOCKED',
        ip: '127.0.0.1',
        details: `Instructor ${teacherName} set day level to Day ${clampedDayId} for student ${student.name}.`,
        timestamp: new Date().toISOString(),
      });

      affectedCount++;
    }

    return {
      success: true,
      targetDayId: clampedDayId,
      message: `Successfully set curriculum access level to Day ${clampedDayId} (${dayLabel}) for ${affectedCount} student(s)!`,
      affectedStudentsCount: affectedCount,
    };
  }

  /**
   * TRANSACTIONAL & IDEMPOTENT DAY UNLOCK FUNCTION
   */
  public async unlockDay(userId: string, courseId: string, dayId: number): Promise<{ success: boolean; newUnlockedDay: number; message: string }> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      return { success: false, newUnlockedDay: 1, message: 'User not found' };
    }

    if (user.currentUnlockedDay >= dayId) {
      // Idempotent: already unlocked, no duplicate emails or state mutations
      return {
        success: true,
        newUnlockedDay: user.currentUnlockedDay,
        message: `Day ${dayId} is already unlocked!`,
      };
    }

    // Mutate state transactionally
    user.currentUnlockedDay = dayId;

    const enrollment = this.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
    if (enrollment) {
      enrollment.unlockedDay = dayId;
      enrollment.lastActivity = new Date().toISOString();
    }

    const weekNum = Math.ceil(dayId / 5) || 1;
    const dayInWeek = ((dayId - 1) % 5) + 1;
    const dayLabel = `Week ${weekNum} Day ${dayInWeek}`;

    // Create in-app notification
    const notification: NotificationItem = {
      id: 'NOTIF_' + Date.now(),
      userId: user.id,
      title: `🎉 ${dayLabel} (Day ${dayId}) Module Unlocked!`,
      message: `Congratulations! You have unlocked ${dayLabel} learning material, study PDFs, and evaluation tests. Knowledge base vectors are now queryable via TalentSphere AI.`,
      type: 'unlock',
      readStatus: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notification);

    // Audit log
    this.securityEvents.unshift({
      id: 'SEC_' + Date.now(),
      userId: user.id,
      eventType: 'DAY_MODULE_UNLOCKED',
      ip: '127.0.0.1',
      details: `User unlocked ${dayLabel} (Day ${dayId}) content for course ${courseId}.`,
      timestamp: new Date().toISOString(),
    });

    // Send SMTP Email Notification (Async)
    emailService
      .sendEmail({
        to: user.email,
        recipientName: user.name,
        subject: `[Talent Sphere Elevate] ${dayLabel} (Day ${dayId}) Module Unlocked!`,
        emailType: 'DAY_UNLOCK',
        title: `${dayLabel} Learning Module Unlocked!`,
        mainMessage: `Great news! You have successfully unlocked ${dayLabel} of the Talent Management Platform course. You now have access to ${dayLabel} PDFs, video lessons, and vector search query capabilities in TalentSphere AI.`,
        badgeText: `UNLOCKED: ${dayLabel.toUpperCase()}`,
        actionText: 'View Unlocked Day Content',
        actionUrl: `${process.env.APP_URL || 'http://localhost:3000'}/courses/${courseId}`,
      })
      .catch((err) => console.warn('Unlock email dispatch warning:', err));

    return {
      success: true,
      newUnlockedDay: dayId,
      message: `${dayLabel} (Day ${dayId}) unlocked successfully! Verification email dispatched.`,
    };
  }

  /**
   * TEACHER RESULT UNLOCK: Releases student scorecard and triggers notifications
   */
  public async unlockResultByTeacher(
    attemptId: string,
    teacherName: string = 'Dr. Sarah Jenkins'
  ): Promise<{ success: boolean; attempt?: AssessmentAttempt; message: string }> {
    const attempt = this.assessmentAttempts.find((a) => a.id === attemptId);
    if (!attempt) {
      return { success: false, message: 'Attempt record not found.' };
    }

    attempt.resultReleased = true;
    attempt.releasedAt = new Date().toISOString();

    const student = this.users.find((u) => u.id === attempt.userId);
    const assessment = this.assessments.find((a) => a.id === attempt.assessmentId);
    const title = attempt.assessmentTitle || assessment?.title || 'Exam';

    // In-app notification for the student
    if (student) {
      this.notifications.unshift({
        id: 'NOTIF_RES_' + Date.now() + '_' + student.id,
        userId: student.id,
        title: `🏆 Exam Results Released: ${title}`,
        message: `Instructor ${teacherName} has reviewed and released your results for ${title}. Your verified score is ${attempt.score}/${attempt.totalMarks} (${Math.round((attempt.score / attempt.totalMarks) * 100)}%). View your scorecard in Results Hub!`,
        type: 'assessment',
        readStatus: false,
        createdAt: new Date().toISOString(),
      });

      // Send ESMTP Email to student
      emailService
        .sendEmail({
          to: student.email,
          recipientName: student.name,
          subject: `[Talent Sphere] 🏆 Scorecard Released: ${title}`,
          emailType: 'ASSESSMENT_RESULT',
          title: `Exam Results Released by Instructor`,
          mainMessage: `Hello ${student.name},\n\nYour instructor ${teacherName} has reviewed and officially released the results for "${title}".\n\nFinal Score: ${attempt.score} / ${attempt.totalMarks} Marks (${Math.round((attempt.score / attempt.totalMarks) * 100)}%)\nStatus: ${attempt.passed ? 'PASSED ✅' : 'RETRY REQUIRED ⚠️'}\n\nYour verified digital scorecard and transcript are now accessible in the Results Hub.`,
          badgeText: attempt.passed ? 'PASSED' : 'RETRY REQUIRED',
          actionText: 'View Verified Scorecard',
          actionUrl: `${process.env.APP_URL || 'http://localhost:3000'}/exam-portal`,
        })
        .catch((err) => console.warn('Scorecard release email warning:', err));
    }

    return {
      success: true,
      attempt,
      message: `Successfully released results for ${student?.name || 'student'} (${title}).`,
    };
  }

  /**
   * TEACHER RESULT LOCK: Re-locks student scorecard
   */
  public lockResultByTeacher(attemptId: string): { success: boolean; attempt?: AssessmentAttempt; message: string } {
    const attempt = this.assessmentAttempts.find((a) => a.id === attemptId);
    if (!attempt) {
      return { success: false, message: 'Attempt record not found.' };
    }
    attempt.resultReleased = false;
    return { success: true, attempt, message: 'Result locked.' };
  }

  /**
   * TEACHER UNLOCK ALL RESULTS: Releases all pending attempts
   */
  public async unlockAllResults(
    teacherName: string = 'Dr. Sarah Jenkins'
  ): Promise<{ success: boolean; count: number; message: string }> {
    const pending = this.assessmentAttempts.filter((a) => a.resultReleased !== true);
    let count = 0;

    for (const att of pending) {
      await this.unlockResultByTeacher(att.id, teacherName);
      count++;
    }

    return {
      success: true,
      count,
      message: `Successfully released ${count} student exam result(s)! Notifications and emails dispatched.`,
    };
  }

  /**
   * ANNOUNCE EXAM TO STUDENTS: Publishes exam and broadcasts alert to student cohort
   */
  public async announceExamToStudents(
    assessmentId: string,
    teacherName: string = 'Dr. Sarah Jenkins'
  ): Promise<{ success: boolean; assessment?: Assessment; message: string }> {
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    if (!assessment) {
      return { success: false, message: 'Assessment not found.' };
    }

    assessment.isPublished = true;
    assessment.status = 'Published';
    assessment.announcedAt = new Date().toISOString();

    // Unlock this day for students so they can access it
    await this.unlockDayByTeacher(assessment.dayId, assessment.courseId || 'CRS_TALENT_101', undefined, teacherName);

    const students = this.users.filter((u) => u.role === 'STUDENT');
    for (const student of students) {
      this.notifications.unshift({
        id: 'NOTIF_EXAM_ANN_' + Date.now() + '_' + student.id,
        userId: student.id,
        title: `📢 New Exam Announced: ${assessment.title}`,
        message: `Instructor ${teacherName} has published the ${assessment.dayLabel || `Day ${assessment.dayId}`} evaluation (${assessment.questions.length} questions, ${assessment.durationMinutes} mins). Take the test in your Exam Portal!`,
        type: 'assessment',
        readStatus: false,
        createdAt: new Date().toISOString(),
      });

      emailService
        .sendEmail({
          to: student.email,
          recipientName: student.name,
          subject: `[Talent Sphere] 📢 New Exam Published: ${assessment.title}`,
          emailType: 'ASSESSMENT_RESULT',
          title: `New Exam Announced for ${assessment.dayLabel || `Day ${assessment.dayId}`}`,
          mainMessage: `Hello ${student.name},\n\nYour instructor ${teacherName} has created and published a new exam:\n\n"${assessment.title}"\n- Week/Day: ${assessment.dayLabel || `Day ${assessment.dayId}`}\n- Duration: ${assessment.durationMinutes} Minutes\n- Total Marks: ${assessment.totalMarks}\n- Questions: ${assessment.questions.length} MCQs\n\nLog in now to review the unlocked study materials and take the test in your Exam Portal.`,
          badgeText: 'EXAM PUBLISHED',
          actionText: 'Take Exam Now',
          actionUrl: `${process.env.APP_URL || 'http://localhost:3000'}/exam-portal`,
        })
        .catch((err) => console.warn('Exam announcement email warning:', err));
    }

    return {
      success: true,
      assessment,
      message: `Exam "${assessment.title}" announced & published to all ${students.length} students!`,
    };
  }

  /**
   * STUDENT REQUESTS UNLOCK: Student asks teacher to unlock a day or test
   */
  public async requestUnlockByStudent(
    studentId: string,
    dayId: number,
    assessmentId?: string,
    message?: string
  ): Promise<{ success: boolean; request: UnlockRequest; message: string }> {
    const student = this.users.find((u) => u.id === studentId);
    if (!student) {
      throw new Error('Student user not found');
    }

    const weekNum = Math.ceil(dayId / 5) || 1;
    const dayInWeek = ((dayId - 1) % 5) + 1;
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const dayName = dayNames[dayInWeek - 1] || `Day ${dayInWeek}`;
    const dayLabel = `Week ${weekNum} Day ${dayInWeek} (${dayName})`;

    const assessment = assessmentId
      ? this.assessments.find((a) => a.id === assessmentId)
      : this.assessments.find((a) => a.dayId === dayId);

    // Check if an active pending request already exists
    const existing = this.unlockRequests.find(
      (r) => r.studentId === studentId && r.dayId === dayId && r.status === 'PENDING'
    );
    if (existing) {
      return {
        success: true,
        request: existing,
        message: `You already have a pending unlock request for ${dayLabel}. Your instructor has been notified!`,
      };
    }

    const reqId = 'REQ_UNL_' + Date.now();
    const newRequest: UnlockRequest = {
      id: reqId,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      dayId,
      weekId: weekNum,
      dayLabel,
      assessmentId: assessment?.id,
      assessmentTitle: assessment?.title || `Day ${dayId} Test`,
      message: message || `Student requested access to take the ${dayLabel} exam and study resources.`,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };

    this.unlockRequests.unshift(newRequest);

    // Create notifications for all instructors & admins
    const teachers = this.users.filter((u) => u.role === 'TEACHER' || u.role === 'ADMIN');
    teachers.forEach((t) => {
      this.notifications.unshift({
        id: 'NOTIF_REQ_' + Date.now() + '_' + t.id,
        userId: t.id,
        title: `🔓 Unlock Request: ${student.name} for ${dayLabel}`,
        message: `${student.name} (${student.email}) has asked to take the ${assessment?.title || `${dayLabel} Exam`}. Click to approve & unlock.`,
        type: 'unlock',
        readStatus: false,
        createdAt: new Date().toISOString(),
      });
    });

    return {
      success: true,
      request: newRequest,
      message: `Unlock request sent to your teacher. You will be notified immediately once approved!`,
    };
  }

  /**
   * TEACHER APPROVES UNLOCK REQUEST
   */
  public async approveUnlockRequest(
    requestId: string,
    teacherName: string = 'Dr. Sarah Jenkins',
    forAllStudents: boolean = false
  ): Promise<{ success: boolean; request: UnlockRequest; message: string }> {
    const reqItem = this.unlockRequests.find((r) => r.id === requestId);
    if (!reqItem) {
      throw new Error('Unlock request not found.');
    }

    reqItem.status = 'APPROVED';
    reqItem.approvedAt = new Date().toISOString();
    reqItem.approvedBy = teacherName;

    // Unlock the target day for the student or for all
    await this.unlockDayByTeacher(
      reqItem.dayId,
      'CRS_TALENT_101',
      forAllStudents ? undefined : reqItem.studentId,
      teacherName
    );

    // Notify the requesting student
    const student = this.users.find((u) => u.id === reqItem.studentId);
    if (student) {
      this.notifications.unshift({
        id: 'NOTIF_APP_' + Date.now() + '_' + student.id,
        userId: student.id,
        title: `🎉 Test Unlocked by Instructor ${teacherName}!`,
        message: `Your instructor ${teacherName} approved your unlock request for ${reqItem.dayLabel || `Day ${reqItem.dayId}`}. You can now start the exam and review study documents in your portal.`,
        type: 'unlock',
        readStatus: false,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      request: reqItem,
      message: `Request approved! ${reqItem.dayLabel || `Day ${reqItem.dayId}`} is now unlocked for ${forAllStudents ? 'all students' : student?.name || 'the student'}.`,
    };
  }
}

export const store = new Store();
