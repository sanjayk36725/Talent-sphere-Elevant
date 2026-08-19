import { DocumentChunk, DocumentItem } from '../types';

export class VectorStore {
  private chunks: DocumentChunk[] = [];
  private documents: DocumentItem[] = [];

  constructor() {
    this.seedKnowledgeBase();
  }

  private seedKnowledgeBase() {
    const seedDocs: DocumentItem[] = [];
    const seedChunks: DocumentChunk[] = [];

    // Pre-seed curriculum data across all 4 weeks (Days 1 to 20)
    const curriculumTopics = [
      // WEEK 1
      { day: 1, week: 1, name: 'Performance Management & SMART Goal Alignment', cat: 'Goal Alignment', pages: 14, chunks: 4, summary: 'SMART goal setting, OKR alignment, and continuous sprint-based check-ins.' },
      { day: 2, week: 1, name: 'AI Career Pathing & Competency Rubrics', cat: 'Skill Matrix', pages: 18, chunks: 4, summary: 'AI-assisted skill gap analysis, role profiles, and dynamic competency maps.' },
      { day: 3, week: 1, name: '360-Degree Feedback & Leadership Assessment', cat: 'Leadership & Feedback', pages: 22, chunks: 5, summary: 'Multi-rater feedback, peer evaluations, and mentor calibration.' },
      { day: 4, week: 1, name: 'Agile Continuous Appraisal & Performance Sprints', cat: 'Agile Performance', pages: 16, chunks: 4, summary: 'Sprint retrospectives, iterative KPI tracking, and real-time coaching.' },
      { day: 5, week: 1, name: 'Talent Analytics & Retention Modeling', cat: 'Talent Analytics', pages: 20, chunks: 4, summary: 'Predictive analytics, burnout indicators, and high-potential candidate retention.' },
      // WEEK 2
      { day: 6, week: 2, name: 'Enterprise Talent Architecture & Mobility', cat: 'Enterprise Strategy', pages: 24, chunks: 4, summary: 'Global talent mobility, engineering leveling rubrics, and internal job markets.' },
      { day: 7, week: 2, name: 'Predictive Pipeline & Neural Career Matchers', cat: 'AI Pipeline', pages: 21, chunks: 4, summary: 'Vector embeddings for job-candidate fit, skill decay algorithms, and adaptive learning.' },
      { day: 8, week: 2, name: '9-Box Talent Matrix & Succession Planning', cat: 'Succession Planning', pages: 19, chunks: 4, summary: 'Performance vs Potential grid calibration and leadership bench strength.' },
      { day: 9, week: 2, name: 'Psychometric Assessments & Cognitive Profiling', cat: 'Cognitive Testing', pages: 25, chunks: 5, summary: 'Behavioral traits, situational judgment tests, and problem-solving benchmarks.' },
      { day: 10, week: 2, name: 'Compensation, Merit Matrix & Equity Structuring', cat: 'Compensation & Rewards', pages: 22, chunks: 4, summary: 'Total rewards, merit-based compensation curves, and performance bonuses.' },
      // WEEK 3
      { day: 11, week: 3, name: 'Technical Upskilling & Micro-Credentials Architecture', cat: 'L&D Architecture', pages: 26, chunks: 5, summary: 'Micro-learning modules, automated badge issuance, and verifiable digital credentials.' },
      { day: 12, week: 3, name: 'Peer Review Calibration & Bias Mitigation', cat: 'Evaluation Ethics', pages: 18, chunks: 4, summary: 'Statistical normalization, recency bias mitigation, and inclusive evaluation rubrics.' },
      { day: 13, week: 3, name: 'High-Impact Mentorship & 1-on-1 Coaching Framework', cat: 'Mentorship', pages: 20, chunks: 4, summary: 'GROW model coaching, mentor-mentee pairing algorithms, and actionable goal check-ins.' },
      { day: 14, week: 3, name: 'Remote & Distributed Team Performance Tracking', cat: 'Remote Work', pages: 23, chunks: 4, summary: 'Asynchronous work analytics, output-focused KPIs, and team cohesion metrics.' },
      { day: 15, week: 3, name: 'Data-Driven Retention & Attrition Forecasting', cat: 'Predictive HR', pages: 27, chunks: 5, summary: 'Survival curves, engagement score telemetry, and early flight-risk mitigation.' },
      // WEEK 4
      { day: 16, week: 4, name: 'Organizational Network Analysis & Influence Mapping', cat: 'Network Analysis', pages: 28, chunks: 5, summary: 'Informal collaboration networks, knowledge silos, and cross-functional leadership.' },
      { day: 17, week: 4, name: 'Executive Succession & C-Suite Competency Standards', cat: 'Executive Strategy', pages: 24, chunks: 4, summary: 'Board-level succession readiness, enterprise transformation, and crisis leadership.' },
      { day: 18, week: 4, name: 'AI Ethics, Compliance & Equal Opportunity in Talent', cat: 'Ethics & Compliance', pages: 22, chunks: 4, summary: 'Algorithmic auditing, fairness metrics, EEOC guidelines, and transparent AI governance.' },
      { day: 19, week: 4, name: 'Global Talent Relocation & Cross-Border Compliance', cat: 'Global Operations', pages: 25, chunks: 4, summary: 'Visa pathways, remote entity employer-of-record models, and international tax frameworks.' },
      { day: 20, week: 4, name: 'Capstone Synthesis & Enterprise Talent Mastery', cat: 'Mastery & Capstone', pages: 30, chunks: 6, summary: 'Holistic system design, end-to-end talent platform deployment, and executive defense.' },
    ];

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    curriculumTopics.forEach((t) => {
      const dayInWeek = ((t.day - 1) % 5) + 1;
      const dayName = dayNames[dayInWeek - 1];
      const dayLabel = `Week ${t.week} Day ${dayInWeek} (${dayName})`;
      const docId = `DOC_DAY_${t.day}_1`;
      const filename = `Day${t.day}_${t.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

      const docItem: DocumentItem = {
        id: docId,
        filename,
        fileType: 'pdf',
        ownerId: 'TEACHER_1',
        uploadedBy: 'Dr. Sarah Jenkins (Lead Mentor)',
        courseId: 'CRS_TALENT_101',
        dayId: t.day,
        weekId: t.week,
        dayLabel,
        category: t.cat,
        status: 'Completed',
        pageCount: t.pages,
        vectorChunkCount: t.chunks,
        accessLevel: 'unlocked_students',
        uploadDate: '2026-08-01',
      };
      seedDocs.push(docItem);

      // Create rich chunks for each document
      for (let i = 1; i <= t.chunks; i++) {
        const pageNum = Math.min(t.pages, Math.max(1, Math.round((i / t.chunks) * t.pages)));
        seedChunks.push({
          id: `CHK_D${t.day}_0${i}`,
          documentId: docId,
          docName: filename,
          dayId: t.day,
          weekId: t.week,
          dayLabel,
          pageNumber: pageNum,
          content: `[Day ${t.day} Core Module: ${t.name} - Part ${i}] ${t.summary} Key operational focus: Master practical metrics, vector similarity calculations, and real-time appraisal standards for ${t.cat}. Page reference: ${pageNum}/${t.pages}.`,
          accessLevel: 'unlocked_students',
          courseId: 'CRS_TALENT_101',
          ownerId: 'TEACHER_1',
        });
      }
    });

    this.documents = seedDocs;
    this.chunks = seedChunks;
  }

  /**
   * SECURITY CRITICAL: Strict Filter enforcing day_id <= unlockedDay
   * Optional targetDay or targetWeek restricts scope while upholding unlock boundaries.
   */
  public search(
    query: string,
    unlockedDay: number,
    courseId?: string,
    limit: number = 4,
    targetDay?: number,
    targetWeek?: number
  ): DocumentChunk[] {
    const keywords = query.toLowerCase().split(/\s+/).filter((k) => k.length > 2);

    // 1. HARD SECURITY FILTER: strictly exclude chunks from locked days (dayId > unlockedDay)
    const eligibleChunks = this.chunks.filter((chk) => {
      if (chk.dayId > unlockedDay) return false;
      if (courseId && chk.courseId !== courseId) return false;
      if (targetDay !== undefined && targetDay !== null && targetDay > 0) {
        if (chk.dayId !== targetDay) return false;
      }
      if (targetWeek !== undefined && targetWeek !== null && targetWeek > 0) {
        if (chk.weekId !== targetWeek) return false;
      }
      return true;
    });

    // If query is empty or general, return top eligible chunks
    if (keywords.length === 0) {
      return eligibleChunks.slice(0, limit);
    }

    // 2. Compute similarity / relevance score based on keyword and semantic match
    const scored = eligibleChunks.map((chunk) => {
      let score = 0;
      const lowerContent = chunk.content.toLowerCase();
      const lowerDocName = chunk.docName.toLowerCase();
      const lowerLabel = (chunk.dayLabel || '').toLowerCase();

      keywords.forEach((word) => {
        if (lowerContent.includes(word)) score += 3;
        if (lowerDocName.includes(word)) score += 4;
        if (lowerLabel.includes(word)) score += 2;
      });

      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const matches = scored.filter((item) => item.score > 0).map((item) => item.chunk);
    return matches.length > 0 ? matches.slice(0, limit) : eligibleChunks.slice(0, limit);
  }

  public getDocumentsForUser(unlockedDay: number): DocumentItem[] {
    return this.documents.filter((doc) => doc.dayId <= unlockedDay);
  }

  public getAllDocuments(): DocumentItem[] {
    return this.documents;
  }

  public getChunksForDocument(docId: string, unlockedDay?: number): DocumentChunk[] {
    return this.chunks.filter((chk) => {
      if (chk.documentId !== docId) return false;
      if (unlockedDay !== undefined && chk.dayId > unlockedDay) return false;
      return true;
    });
  }

  public getChunksForDay(dayId: number, unlockedDay?: number): DocumentChunk[] {
    return this.chunks.filter((chk) => {
      if (chk.dayId !== dayId) return false;
      if (unlockedDay !== undefined && chk.dayId > unlockedDay) return false;
      return true;
    });
  }

  public getAllChunks(unlockedDay?: number): DocumentChunk[] {
    if (unlockedDay !== undefined) {
      return this.chunks.filter((chk) => chk.dayId <= unlockedDay);
    }
    return this.chunks;
  }

  public addDocument(doc: DocumentItem, chunks: DocumentChunk[]) {
    this.documents.push(doc);
    this.chunks.push(...chunks);
  }

  public addChunks(chunks: DocumentChunk[]) {
    this.chunks.push(...chunks);
  }
}

export const vectorStore = new VectorStore();
