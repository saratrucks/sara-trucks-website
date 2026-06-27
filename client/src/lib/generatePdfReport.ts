import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface AnalyticsData {
  pageviews: { value: number; change: number };
  visitors: { value: number; change: number };
  bounceRate: { value: number; change: number };
  avgTime: { value: string; change: number };
}

interface PageView {
  page: string;
  views: number;
  percentage: number;
}

interface CountryStats {
  country: string;
  flag: string;
  visitors: number;
  percentage: number;
}

interface DailyStats {
  date: string;
  pageviews: number;
  visitors: number;
}

export function generateAnalyticsReport(
  analyticsData: AnalyticsData,
  topPages: PageView[],
  countryStats: CountryStats[],
  dailyStats: DailyStats[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(40, 40, 40);
  doc.text("Sara Trucks - Analytics Report", pageWidth / 2, 20, { align: "center" });
  
  // Subtitle with date
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${today}`, pageWidth / 2, 30, { align: "center" });
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, pageWidth - 20, 35);
  
  // Overview Section
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text("Overview", 20, 45);
  
  // Overview table
  autoTable(doc, {
    startY: 50,
    head: [["Metric", "Value", "Change"]],
    body: [
      ["Page Views", analyticsData.pageviews.value.toLocaleString(), `${analyticsData.pageviews.change > 0 ? "+" : ""}${analyticsData.pageviews.change}%`],
      ["Unique Visitors", analyticsData.visitors.value.toLocaleString(), `${analyticsData.visitors.change > 0 ? "+" : ""}${analyticsData.visitors.change}%`],
      ["Bounce Rate", `${analyticsData.bounceRate.value}%`, `${analyticsData.bounceRate.change > 0 ? "+" : ""}${analyticsData.bounceRate.change}%`],
      ["Avg. Session Time", analyticsData.avgTime.value, `${analyticsData.avgTime.change > 0 ? "+" : ""}${analyticsData.avgTime.change}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [212, 160, 23], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
  });
  
  // Top Pages Section
  const topPagesY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text("Top Pages", 20, topPagesY);
  
  autoTable(doc, {
    startY: topPagesY + 5,
    head: [["#", "Page", "Views", "Percentage"]],
    body: topPages.map((page, index) => [
      index + 1,
      page.page,
      page.views.toLocaleString(),
      `${page.percentage}%`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [212, 160, 23], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
  });
  
  // Country Stats Section
  const countryY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text("Visitors by Country", 20, countryY);
  
  autoTable(doc, {
    startY: countryY + 5,
    head: [["Country", "Visitors", "Percentage"]],
    body: countryStats.map((country) => [
      country.country,
      country.visitors.toLocaleString(),
      `${country.percentage}%`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [212, 160, 23], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
  });
  
  // Check if we need a new page for daily stats
  const dailyY = (doc as any).lastAutoTable.finalY + 15;
  if (dailyY > 250) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Daily Statistics (Last 7 Days)", 20, 20);
    
    autoTable(doc, {
      startY: 25,
      head: [["Date", "Page Views", "Visitors"]],
      body: dailyStats.map((day) => [
        day.date,
        day.pageviews.toLocaleString(),
        day.visitors.toLocaleString(),
      ]),
      theme: "striped",
      headStyles: { fillColor: [212, 160, 23], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
    });
  } else {
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Daily Statistics (Last 7 Days)", 20, dailyY);
    
    autoTable(doc, {
      startY: dailyY + 5,
      head: [["Date", "Page Views", "Visitors"]],
      body: dailyStats.map((day) => [
        day.date,
        day.pageviews.toLocaleString(),
        day.visitors.toLocaleString(),
      ]),
      theme: "striped",
      headStyles: { fillColor: [212, 160, 23], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} - International Sara Trucks SRL`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  
  // Save the PDF
  const fileName = `sara-trucks-analytics-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
