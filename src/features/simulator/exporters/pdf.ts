import { saveFile } from '../../../shared/utils/saveFile';
import { calculateTotalInvestment } from '../../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';
import type { SimulationData } from '../../../types/simulation';

// The app's orange and navy, adapted to white paper. Orange is an accent;
// small text remains navy/slate for contrast when printed.
const palette = {
  brand: '#F97316',
  ink: '#0F172A',
  muted: '#475569',
  line: '#CBD5E1',
  paper: '#FFFFFF',
  soft: '#F8FAFC',
};

const displayDate = (date: string) => {
  const parts = date.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : date;
};

export const buildPDF = async (data: SimulationData) => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = width - margin * 2;
  const totalInvestment = calculateTotalInvestment(data.propertyPrice, data.costs);
  const principal = Math.max(0, totalInvestment - data.initialContribution);
  const interest = data.amortizationTable.reduce((sum, row) => sum + row.interest, 0);
  const financing = data.propertyPrice > 0 ? formatPercentage(principal / data.propertyPrice * 100) : 'No disponible';
  const generatedOn = new Date().toLocaleDateString('es-ES');
  doc.setProperties({ title: `HipotecaLab · ${data.name || 'Simulación hipotecaria'}`, subject: 'Resumen, costes y amortización de la hipoteca', creator: 'HipotecaLab' });

  const text = (value: string, x: number, y: number, size = 10, color = palette.ink, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(color);
    doc.text(value, x, y);
  };
  const paragraph = (value: string, y: number, maxWidth = contentWidth, size = 10) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(palette.muted);
    const lines: string[] = doc.splitTextToSize(value, maxWidth);
    doc.text(lines, margin, y, { lineHeightFactor: 1.4 });
    return y + lines.length * size * 0.3528 * 1.4;
  };
  const rule = (y: number) => {
    doc.setDrawColor(palette.line);
    doc.setLineWidth(0.2);
    doc.line(margin, y, width - margin, y);
  };
  const title = (number: string, label: string, y: number) => {
    text(number, margin, y, 10, palette.brand, true);
    text(label, margin + 10, y, 14, palette.ink, true);
  };
  const metric = (x: number, y: number, w: number, label: string, value: string, note: string) => {
    doc.setFillColor(palette.paper);
    doc.setDrawColor(palette.line);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, y, w, 35, 3, 3, 'FD');
    doc.setFillColor(palette.brand);
    doc.roundedRect(x + 5, y + 6, 8, 1, 0.5, 0.5, 'F');
    text(label, x + 5, y + 13, 9, palette.muted);
    doc.setFont('helvetica', 'bold');
    // Long monetary values fit their card instead of crossing its border.
    let size = 19;
    doc.setFontSize(size);
    while (doc.getTextWidth(value) > w - 10 && size > 9) doc.setFontSize(--size);
    text(value, x + 5, y + 23, size, palette.ink, true);
    text(note, x + 5, y + 30, 8, palette.muted);
  };
  const detailRow = (label: string, value: string, y: number, bold = false) => {
    text(label, margin, y, 10, palette.muted);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(11);
    doc.setTextColor(palette.ink);
    doc.text(value, width - margin, y, { align: 'right' });
    rule(y + 4);
  };

  // Page 1: a scan-friendly overview, without repeating the same tables.
  text('TU CASA, EN NÚMEROS', margin, 42, 9, palette.muted, true);
  text('Tu simulación hipotecaria', margin, 54, 24, palette.ink, true);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const nameLines: string[] = doc.splitTextToSize(data.name.trim() || 'Mi simulación', contentWidth);
  // Names can be user-entered paragraphs. Keep a bounded cover; retain the full
  // name in PDF metadata without pushing the financial summary off the page.
  const displayName = nameLines.slice(0, 2);
  if (nameLines.length > 2) displayName[1] = `${displayName[1].slice(0, -3)}...`;
  doc.setTextColor(palette.muted);
  doc.text(displayName, margin, 64);

  const gap = 4;
  const cardWidth = (contentWidth - gap * 2) / 3;
  metric(margin, 79, cardWidth, 'Cuota de la hipoteca', formatCurrency(data.monthlyPayment), 'Al mes · sin otros gastos');
  metric(margin + cardWidth + gap, 79, cardWidth, 'Préstamo solicitado', formatCurrency(principal), `${financing} del precio`);
  metric(margin + (cardWidth + gap) * 2, 79, cardWidth, 'Plazo del préstamo', `${data.loanTerm} años`, `TIN ${formatPercentage(data.tin)}`);

  title('01', 'La compra y la financiación', 130);
  detailRow('Precio de la vivienda', formatCurrency(data.propertyPrice), 143);
  detailRow('Gastos e impuestos de compra', formatCurrency(totalInvestment - data.propertyPrice), 155);
  detailRow('Inversión inicial total', formatCurrency(totalInvestment), 167, true);
  detailRow('Aportación inicial de tus ahorros', formatCurrency(data.initialContribution), 179);
  detailRow('Intereses de la hipoteca', formatCurrency(interest), 191);
  detailRow('Compra y financiación: inversión + intereses', formatCurrency(totalInvestment + interest), 203, true);

  title('02', 'Tu presupuesto mensual', 224);
  detailRow('Seguros y otros gastos mensuales', formatCurrency(data.monthlyExtras), 237);
  detailRow('Cuota hipotecaria + otros gastos', formatCurrency(data.monthlyPaymentWithExtras), 249, true);
  paragraph('Los seguros y otros gastos no amortizan el préstamo. Tampoco están incluidos en el total de compra y financiación.', 263, contentWidth, 9);

  // Page 2: enough space for all details and explanations, no orphan headings.
  doc.addPage();
  text('Los detalles de tu hipoteca', margin, 45, 22, palette.ink, true);
  title('03', 'Condiciones del préstamo', 63);
  detailRow('Tipo de interés nominal (TIN)', formatPercentage(data.tin), 77);
  detailRow('Tasa anual equivalente (TAE)', data.tae > 0 ? formatPercentage(data.tae) : 'No indicada', 90);
  detailRow('Fecha de inicio', displayDate(data.startDate), 103);
  detailRow('Plazo acordado', `${data.loanTerm} años`, 116);

  title('04', 'Gastos e impuestos de compra', 137);
  const costs = [
    ['Tasación', data.costs.appraisal],
    ['Notaría', data.costs.notary],
    ['Gestoría', data.costs.agency],
    ['Registro de la propiedad', data.costs.registry],
    [`ITP / IVA de referencia (${formatPercentage(data.costs.taxRate)})`, data.propertyPrice * data.costs.taxRate / 100],
  ] as const;
  costs.forEach(([label, value], index) => detailRow(label, formatCurrency(value), 151 + index * 12));
  detailRow('Total de gastos e impuestos', formatCurrency(totalInvestment - data.propertyPrice), 211, true);
  title('05', 'Cómo leer este informe', 234);
  paragraph('Simulación de una hipoteca a tipo fijo. Los resultados son orientativos y dependen de los datos introducidos; no constituyen una oferta bancaria.', 245, contentWidth, 9);
  paragraph('La cuota y la amortización incluyen solo capital e intereses. El presupuesto mensual añade los seguros y otros gastos que has indicado.', 261, contentWidth, 9);

  // Retain the existing 50-payment extract and explicitly identify its scope.
  doc.addPage();
  const rows = data.amortizationTable.slice(0, 50);
  if (rows.length > 0) {
    autoTable(doc, {
      startY: 53,
      margin: { top: 53, bottom: 22, left: margin, right: margin },
      head: [['N.º', 'Fecha', 'Cuota hipotecaria', 'Capital', 'Intereses', 'Capital pendiente']],
      body: rows.map(row => [String(row.month), displayDate(row.paymentDate), formatCurrency(row.payment), formatCurrency(row.principal), formatCurrency(row.interest), formatCurrency(row.remainingBalance)]),
      theme: 'plain',
      styles: { font: 'helvetica', fontSize: 8, textColor: palette.ink, cellPadding: { top: 0.5, bottom: 0.5, left: 1.5, right: 1.5 }, overflow: 'linebreak', lineWidth: 0 },
      headStyles: { fillColor: palette.ink, textColor: palette.paper, fontStyle: 'bold', cellPadding: 1.5, halign: 'right' },
      alternateRowStyles: { fillColor: palette.soft },
      columnStyles: { 0: { cellWidth: 10, halign: 'left' }, 1: { cellWidth: 25, halign: 'left' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' } },
      rowPageBreak: 'avoid',
      didDrawPage: () => {
        text('Así se devuelve el préstamo', margin, 39, 20, palette.ink, true);
        text(`Amortización · ${rows.length < data.amortizationTable.length ? 'Primeras' : ''} ${rows.length} cuotas de ${data.amortizationTable.length} · Sin seguros ni otros gastos`, margin, 47, 9, palette.muted);
      },
    });
  } else {
    text('Amortización pendiente', margin, 45, 22, palette.ink, true);
    paragraph('Completa los datos del préstamo en el simulador para generar el cuadro de amortización.', 60);
  }

  // Shared furniture is drawn last so automatic table pages get it too.
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    text('H', margin, 22, 19, palette.brand, true);
    text('Lab', margin + 5, 22, 19, palette.ink, true);
    text('HIPOTECALAB / SIMULACIÓN', margin + 24, 21, 8, palette.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(generatedOn, width - margin, 21, { align: 'right' });
    rule(28);
    rule(height - 17);
    text('HipotecaLab · Entiende tu hipoteca. Decide con confianza.', margin, height - 10, 8, palette.muted);
    doc.text(`${page} / ${pages}`, width - margin, height - 10, { align: 'right' });
  }
  return doc;
};

export const exportToPDF = async (data: SimulationData) => {
  const doc = await buildPDF(data);
  return saveFile(doc.output('blob'), `simulacion-hipotecaria-${new Date().toISOString().split('T')[0]}.pdf`);
};
