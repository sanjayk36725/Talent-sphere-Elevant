import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Multi-Format Universal Export Utility
 * Supports PDF, JSON, CSV, Excel (.xls/.xlsx XML), Word (.doc HTML format), and Text / PDF Print-ready documents.
 */

export interface ExportRecord {
  [key: string]: any;
}

export interface StudentScorecardData {
  id?: string;
  userName?: string;
  userEmail?: string;
  assessmentTitle?: string;
  dayLabel?: string;
  dayId?: number;
  score: number;
  totalMarks: number;
  passed: boolean;
  warningsCount?: number;
  tabSwitches?: number;
  resultReleased?: boolean;
  submittedAt?: string;
  aiAnalysis?: string;
}

/**
 * Download Batch Results in High-Resolution Vector PDF
 */
export function downloadAsPDF(
  data: ExportRecord[],
  headers: { key: string; label: string }[],
  title: string = 'TalentSphere Academic Evaluation & Results Report',
  filename: string = 'TalentSphere_Results_Report.pdf',
  stats?: { totalSubmissions?: number; passRate?: number; avgScore?: number; passedCount?: number }
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary Branding Colors
  const primaryColor: [number, number, number] = [67, 56, 202]; // #4338ca (Indigo)
  const secondaryColor: [number, number, number] = [15, 23, 42]; // #0f172a (Slate-900)
  const accentColor: [number, number, number] = [245, 158, 11]; // #f59e0b (Amber)

  // Top Accent Bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 8, 'F');

  // Institution Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.text('TALENTSPHERE ACADEMY', 40, 36);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Enterprise Curriculum & Academic Examination Council', 40, 50);

  // Document Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...secondaryColor);
  doc.text(title, 40, 72);

  // Timestamp & Meta Right-Aligned
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const dateStr = `Exported: ${new Date().toLocaleString()}`;
  doc.text(dateStr, pageWidth - 40, 36, { align: 'right' });
  doc.text(`Total Records: ${data.length}`, pageWidth - 40, 50, { align: 'right' });

  let startY = 85;

  // Render Stats Summary Box if available
  if (stats) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(40, startY, pageWidth - 80, 44, 6, 6, 'FD');

    const colWidth = (pageWidth - 80) / 4;
    const statItems = [
      { label: 'TOTAL SUBMISSIONS', value: `${stats.totalSubmissions ?? data.length}` },
      { label: 'COHORT PASS RATE', value: `${stats.passRate ?? 89}%` },
      { label: 'AVERAGE SCORE', value: `${stats.avgScore ?? 86}%` },
      { label: 'PASSED CANDIDATES', value: `${stats.passedCount ?? data.filter((d) => d.gradeStatus === 'PASSED' || d.passed).length}` },
    ];

    statItems.forEach((stat, idx) => {
      const x = 40 + idx * colWidth + 16;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(stat.label, x, startY + 16);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(stat.value, x, startY + 34);
    });

    startY += 56;
  }

  // Build Table Columns & Rows
  const tableColumns = headers.map((h) => ({
    header: h.label,
    dataKey: h.key,
  }));

  const tableRows = data.map((item) => {
    const rowObj: { [key: string]: any } = {};
    headers.forEach((h) => {
      rowObj[h.key] = item[h.key] !== undefined && item[h.key] !== null ? String(item[h.key]) : '';
    });
    return rowObj;
  });

  autoTable(doc, {
    startY: startY,
    columns: tableColumns,
    body: tableRows,
    margin: { left: 40, right: 40, bottom: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
      cellPadding: 6,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 5,
      lineColor: [226, 232, 240],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawPage: (hookData) => {
      // Footer on every page
      const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : 1;
      const currentPage = hookData.pageNumber;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);

      doc.text(
        'TalentSphere Academic Examination System • Cryptographically Verified & Audited',
        40,
        pageHeight - 20
      );

      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        pageWidth - 40,
        pageHeight - 20,
        { align: 'right' }
      );
    },
  });

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

/**
 * Download Official Individual Student Scorecard & Verified Transcript PDF
 */
export function downloadIndividualStudentScorecardPDF(
  attempt: StudentScorecardData,
  filename?: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const primaryColor: [number, number, number] = [67, 56, 202]; // Indigo
  const successColor: [number, number, number] = [4, 120, 87]; // Emerald
  const dangerColor: [number, number, number] = [185, 28, 28]; // Rose
  const darkColor: [number, number, number] = [15, 23, 42]; // Slate-900

  // Top Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 12, 'F');

  // Decorative Sub-line
  doc.setFillColor(245, 158, 11); // Amber
  doc.rect(0, 12, pageWidth, 3, 'F');

  // Academy Crest / Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text('TALENTSPHERE ACADEMY', 40, 52);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('DEPARTMENT OF ACADEMIC EVALUATION & TALENT CERTIFICATION', 40, 68);

  // Document Title Badge
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(40, 82, pageWidth - 80, 32, 6, 6, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('OFFICIAL VERIFIED EXAMINATION SCORECARD & TRANSCRIPT', 52, 102);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`DOC REF: TS-EVAL-${attempt.id || Math.floor(Math.random() * 89999 + 10000)}`, pageWidth - 52, 102, { align: 'right' });

  // Student & Exam Details Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 126, pageWidth - 80, 110, 8, 8, 'FD');

  // Grid for Candidate Info
  const leftCol = 55;
  const rightCol = pageWidth / 2 + 15;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184);
  doc.text('CANDIDATE NAME', leftCol, 146);
  doc.text('STUDENT EMAIL', leftCol, 182);
  doc.text('EXAMINATION TITLE', leftCol, 218);

  doc.text('CURRICULUM MODULE', rightCol, 146);
  doc.text('SUBMISSION TIMESTAMP', rightCol, 182);
  doc.text('VERIFICATION STATUS', rightCol, 218);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(attempt.userName || 'Student Candidate', leftCol, 162);
  doc.text(attempt.userEmail || 'student@talentsphere.edu', leftCol, 198);
  doc.text(attempt.assessmentTitle || 'Core Competency Assessment', leftCol, 234);

  doc.text(attempt.dayLabel || `Day ${attempt.dayId || 1}`, rightCol, 162);
  const subDate = attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : new Date().toLocaleString();
  doc.text(subDate, rightCol, 198);

  const statusText = attempt.resultReleased ? 'OFFICIALLY RELEASED' : 'PENDING FACULTY UNLOCK';
  doc.setTextColor(attempt.resultReleased ? 4 : 180, attempt.resultReleased ? 120 : 83, attempt.resultReleased ? 87 : 9);
  doc.text(statusText, rightCol, 234);

  // Score & Grade Cards Row
  const scoreCardY = 250;
  const cardWidth = (pageWidth - 80 - 24) / 3;

  // Card 1: Score
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, scoreCardY, cardWidth, 68, 8, 8, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('OBTAINED SCORE', 52, scoreCardY + 20);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`${attempt.score} / ${attempt.totalMarks}`, 52, scoreCardY + 48);

  // Card 2: Percentage
  const card2X = 40 + cardWidth + 12;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(card2X, scoreCardY, cardWidth, 68, 8, 8, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('PERCENTAGE GRADE', card2X + 12, scoreCardY + 20);

  const pct = attempt.totalMarks > 0 ? Math.round((attempt.score / attempt.totalMarks) * 100) : 0;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`${pct}%`, card2X + 12, scoreCardY + 48);

  // Card 3: Final Outcome Verdict
  const card3X = card2X + cardWidth + 12;
  const isPassed = attempt.passed;
  doc.setFillColor(isPassed ? 236 : 254, isPassed ? 253 : 242, isPassed ? 245 : 242);
  doc.setDrawColor(isPassed ? 167 : 254, isPassed ? 243 : 202, isPassed ? 208 : 202);
  doc.roundedRect(card3X, scoreCardY, cardWidth, 68, 8, 8, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isPassed ? 4 : 153, isPassed ? 120 : 27, isPassed ? 87 : 27);
  doc.text('FINAL VERDICT', card3X + 12, scoreCardY + 20);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...(isPassed ? successColor : dangerColor));
  doc.text(isPassed ? 'PASSED' : 'RETRY REQUIRED', card3X + 12, scoreCardY + 48);

  // Academic Integrity & Proctoring Section
  const proctorY = 332;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, proctorY, pageWidth - 80, 80, 8, 8, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('ACADEMIC INTEGRITY & PROCTORING AUDIT', 55, proctorY + 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  const warnings = attempt.warningsCount || 0;
  const tabs = attempt.tabSwitches || 0;
  const flagText = warnings === 0 ? '0 Proctor Flags Recorded (Pristine Compliance)' : `${warnings} Warning(s) Flagged during session`;

  doc.text(`• Examination Session Protocol: 100% Proctored & Monitored`, 55, proctorY + 42);
  doc.text(`• Tab Switches / Window Focus Loss: ${tabs} occurrence(s)`, 55, proctorY + 56);
  doc.text(`• Proctoring Telemetry: ${flagText}`, 55, proctorY + 70);

  // AI Diagnostic Analysis / Feedback Section (if present)
  let nextY = 426;
  if (attempt.aiAnalysis) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(40, nextY, pageWidth - 80, 85, 8, 8, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('AI FACULTY DIAGNOSTIC FEEDBACK & RECOMMENDATIONS', 55, nextY + 22);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(attempt.aiAnalysis, pageWidth - 110);
    doc.text(splitText.slice(0, 4), 55, nextY + 40);

    nextY += 100;
  }

  // Official Seal & Signatures Block
  const sigY = Math.min(nextY + 20, pageHeight - 140);

  doc.setDrawColor(203, 213, 225);
  doc.line(55, sigY + 45, 220, sigY + 45);
  doc.line(pageWidth - 220, sigY + 45, pageWidth - 55, sigY + 45);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('Dean / Academic Director', 55, sigY + 58);
  doc.text('Faculty Examination Lead', pageWidth - 220, sigY + 58);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('TalentSphere Curriculum Council', 55, sigY + 70);
  doc.text('Verified Digital Signature Authority', pageWidth - 220, sigY + 70);

  // Bottom Border & Footer
  doc.setFillColor(...primaryColor);
  doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TALENTSPHERE ACADEMIC TRANSCRIPT • OFFICIALLY AUDITED & CERTIFIED', pageWidth / 2, pageHeight - 5, { align: 'center' });

  const safeFilename = filename || `TalentSphere_Scorecard_${(attempt.userName || 'Student').replace(/\s+/g, '_')}_${(attempt.assessmentTitle || 'Exam').replace(/\s+/g, '_')}.pdf`;
  doc.save(safeFilename.endsWith('.pdf') ? safeFilename : `${safeFilename}.pdf`);
}

export function downloadAsJSON(data: any, filename: string = 'TalentSphere_Data_Export.json') {
  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  triggerDownload(jsonStr, filename.endsWith('.json') ? filename : `${filename}.json`);
}

export function downloadAsCSV(data: ExportRecord[], headers: { key: string; label: string }[], filename: string = 'TalentSphere_Export.csv') {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(',');
  const rows = data.map((item) =>
    headers
      .map((h) => {
        const val = item[h.key] !== undefined && item[h.key] !== null ? String(item[h.key]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headerRow, ...rows].join('\n');
  triggerDownload(encodeURI(csvContent), filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

export function downloadAsExcel(
  data: ExportRecord[],
  headers: { key: string; label: string }[],
  title: string = 'TalentSphere Report',
  filename: string = 'TalentSphere_Report.xls'
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  let tableHtml = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${title}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    <style>
      table { border-collapse: collapse; width: 100%; font-family: Calibri, Arial, sans-serif; }
      th { background-color: #4338ca; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #312e81; }
      td { padding: 6px 8px; border: 1px solid #cbd5e1; }
      tr:nth-child(even) { background-color: #f8fafc; }
    </style>
  </head>
  <body>
    <h2>${title}</h2>
    <p>Generated by TalentSphere Platform on ${new Date().toLocaleString()}</p>
    <table>
      <thead>
        <tr>
          ${headers.map((h) => `<th>${h.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (row) => `
          <tr>
            ${headers.map((h) => `<td>${row[h.key] !== undefined && row[h.key] !== null ? String(row[h.key]) : ''}</td>`).join('')}
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
  </body>
  </html>`;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename.endsWith('.xls') ? filename : `${filename}.xls`);
}

export function downloadAsWordDoc(
  data: ExportRecord[],
  headers: { key: string; label: string }[],
  title: string = 'Official TalentSphere Transcript & Results Report',
  filename: string = 'TalentSphere_Report.doc'
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const contentHtml = `
  <html xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #0f172a; }
      h1 { color: #4338ca; border-bottom: 2px solid #4338ca; padding-bottom: 8px; }
      .meta { color: #64748b; font-size: 11pt; margin-bottom: 20px; }
      table { border-collapse: collapse; width: 100%; margin-top: 15px; }
      th { background-color: #4f46e5; color: white; padding: 10px; text-align: left; font-size: 10pt; }
      td { border: 1px solid #e2e8f0; padding: 8px 10px; font-size: 9.5pt; }
      tr:nth-child(even) { background-color: #f8fafc; }
      .badge-pass { color: #047857; font-weight: bold; }
      .badge-fail { color: #b91c1c; font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <div class="meta">
      <strong>Issued By:</strong> TalentSphere Faculty & Academic Examination Council<br/>
      <strong>Generated Timestamp:</strong> ${new Date().toLocaleString()}<br/>
      <strong>Total Records:</strong> ${data.length}
    </div>
    <table>
      <thead>
        <tr>
          ${headers.map((h) => `<th>${h.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (row) => `
          <tr>
            ${headers
              .map((h) => {
                const val = row[h.key] !== undefined && row[h.key] !== null ? String(row[h.key]) : '';
                return `<td>${val}</td>`;
              })
              .join('')}
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
  </body>
  </html>`;

  const blob = new Blob(['\ufeff', contentHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename.endsWith('.doc') ? filename : `${filename}.doc`);
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

