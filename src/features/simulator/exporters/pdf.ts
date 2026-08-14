import type { jsPDF as JsPdfDocument } from 'jspdf';
import type { SimulationData } from '../../../types/simulation';
import { calculateTotalInvestment } from '../../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

type AutoTableDocument = JsPdfDocument & {
  lastAutoTable?: { finalY?: number };
};

const getLastTableY = (doc: AutoTableDocument, fallback: number): number =>
  doc.lastAutoTable?.finalY ?? fallback;

export const exportToPDF = async (simulationData: SimulationData) => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF();

  // Metadata
  doc.setProperties({
    title: 'Simulación Hipotecaria',
    subject: 'Resumen y detalles de la simulación hipotecaria',
    creator: 'HipotecaLab',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 15;
  const marginRight = 15;

  const totalInvestment = calculateTotalInvestment(
    simulationData.propertyPrice,
    simulationData.costs
  );
  const requestedFinancing = totalInvestment - simulationData.initialContribution;
  const financingPercentage = (requestedFinancing / simulationData.propertyPrice) * 100;
  const totalInterestTIN = simulationData.amortizationTable.reduce(
    (sum, row) => sum + row.interest,
    0
  );
  const totalCost = totalInvestment + totalInterestTIN;
  const taxRate = simulationData.costs?.taxRate ?? 0;
  const estimatedTaxAmount = taxRate > 0 ? (simulationData.propertyPrice * taxRate) / 100 : 0;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(255, 87, 51);
  doc.text('Simulación Hipotecaria', marginLeft, 20);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`,
    pageWidth - marginRight,
    20,
    { align: 'right' }
  );

  // Helper for section titles
  const sectionTitle = (text: string, y: number) => {
    doc.setFontSize(14);
    doc.setTextColor(255, 87, 51);
    doc.text(text, marginLeft, y);
    doc.setTextColor(0, 0, 0);
  };

  // Resumen ejecutivo
  sectionTitle('Resumen ejecutivo', 32);
  autoTable(doc, {
    head: [['Métrica', 'Valor']],
    body: [
      ['Precio del inmueble', formatCurrency(simulationData.propertyPrice)],
      ['Coste total de la inversión', formatCurrency(totalInvestment)],
      ['Aportación inicial', formatCurrency(simulationData.initialContribution)],
      ['Financiación solicitada', formatCurrency(requestedFinancing)],
      ['Porcentaje financiado (LTV)', formatPercentage(financingPercentage)],
      ['Plazo', `${simulationData.loanTerm} años`],
      ['TIN', formatPercentage(simulationData.tin)],
      ['TAE', formatPercentage(simulationData.tae)],
      ['Cuota mensual (sin extras)', formatCurrency(simulationData.monthlyPayment)],
      ['Cuota mensual (con extras)', formatCurrency(simulationData.monthlyPaymentWithExtras)],
      ['Coste total real (inversión + intereses)', formatCurrency(totalCost)],
      ['Intereses totales (TIN)', formatCurrency(totalInterestTIN)],
    ],
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [255, 87, 51] },
    styles: { fontSize: 10 },
    margin: { left: marginLeft, right: marginRight },
    columnStyles: { 0: { cellWidth: 90 } },
  });

  const tableDoc = doc as AutoTableDocument;
  let yPos = getLastTableY(tableDoc, 32) + 8;

  // Información del Inmueble
  sectionTitle('Información del Inmueble', yPos);
  autoTable(doc, {
    head: [['Concepto', 'Detalle']],
    body: [
      ['Precio del inmueble', formatCurrency(simulationData.propertyPrice)],
      ['Coste total de la inversión', formatCurrency(totalInvestment)],
      ['Aportación inicial', formatCurrency(simulationData.initialContribution)],
      ['Financiación solicitada', formatCurrency(requestedFinancing)],
      ['Porcentaje financiado (LTV)', formatPercentage(financingPercentage)],
    ],
    startY: yPos + 6,
    theme: 'grid',
    headStyles: { fillColor: [255, 87, 51] },
    styles: { fontSize: 10 },
    margin: { left: marginLeft, right: marginRight },
    columnStyles: { 0: { cellWidth: 90 } },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  });

  yPos = getLastTableY(tableDoc, yPos) + 8;

  // Condiciones del Préstamo
  sectionTitle('Condiciones del Préstamo', yPos);
  autoTable(doc, {
    head: [['Concepto', 'Detalle']],
    body: [
      ['Plazo', `${simulationData.loanTerm} años`],
      ['TIN', formatPercentage(simulationData.tin)],
      ['TAE', formatPercentage(simulationData.tae)],
      ['Fecha de inicio', simulationData.startDate],
    ],
    startY: yPos + 6,
    theme: 'grid',
    headStyles: { fillColor: [255, 87, 51] },
    styles: { fontSize: 10 },
    margin: { left: marginLeft, right: marginRight },
    columnStyles: { 0: { cellWidth: 90 } },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  });

  yPos = getLastTableY(tableDoc, yPos) + 8;

  // Información de Cuotas
  sectionTitle('Información de Cuotas', yPos);
  autoTable(doc, {
    head: [['Concepto', 'Detalle']],
    body: [
      ['Cuota mensual (sin extras)', formatCurrency(simulationData.monthlyPayment)],
      ['Cuota mensual (con extras)', formatCurrency(simulationData.monthlyPaymentWithExtras)],
      ['Coste total real', formatCurrency(totalCost)],
      ['Intereses totales (TIN)', formatCurrency(totalInterestTIN)],
    ],
    startY: yPos + 6,
    theme: 'grid',
    headStyles: { fillColor: [255, 87, 51] },
    styles: { fontSize: 10 },
    margin: { left: marginLeft, right: marginRight },
    columnStyles: { 0: { cellWidth: 90 } },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  });

  yPos = getLastTableY(tableDoc, yPos) + 8;

  // Desglose de Costes (si existen)
  if (simulationData.costs && Object.keys(simulationData.costs).length > 0) {
    sectionTitle('Desglose de Costes', yPos);

    const costRows: Array<[string, string]> = [];
    const { notary = 0, registry = 0, agency = 0, appraisal = 0 } = simulationData.costs;

    if ((notary ?? 0) > 0) costRows.push(['Notaría', formatCurrency(notary)]);
    if ((registry ?? 0) > 0) costRows.push(['Registro de la Propiedad', formatCurrency(registry)]);
    if ((agency ?? 0) > 0) costRows.push(['Gestoría', formatCurrency(agency)]);
    if ((appraisal ?? 0) > 0) costRows.push(['Tasación', formatCurrency(appraisal)]);

    if (taxRate > 0) {
      costRows.push(['ITP/IVA (%)', `${taxRate}%`]);
      costRows.push(['Impuestos (estimación)', formatCurrency(estimatedTaxAmount)]);
    }

    autoTable(doc, {
      head: [['Concepto', 'Importe']],
      body: costRows,
      startY: yPos + 6,
      theme: 'grid',
      headStyles: { fillColor: [255, 87, 51] },
      styles: { fontSize: 10 },
      margin: { left: marginLeft, right: marginRight },
      columnStyles: { 0: { cellWidth: 90 } },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    yPos = getLastTableY(tableDoc, yPos) + 8;
  }

  // Notas / Aclaraciones
  sectionTitle('Notas', yPos);
  doc.setFontSize(9);
  doc.setTextColor(80);
  const notes = [
    '— Todos los cálculos son estimaciones y pueden variar según las condiciones finales del préstamo.',
    '— Las cuotas indicadas pueden variar si hay cambios en los tipos o en los costes asociados.',
  ];
  const notesText = notes
    .map((n) => n)
    .join('\n');
  const wrapped = doc.splitTextToSize(notesText, pageWidth - marginLeft - marginRight);
  doc.text(wrapped, marginLeft, yPos + 6);

  // Amortización (página nueva)
  doc.addPage();
  sectionTitle('Tabla de Amortización', 20);

  if (simulationData.amortizationTable.length > 0) {
    const amortizationData = simulationData.amortizationTable.slice(0, 50).map((row, index) => [
      (index + 1).toString(),
      row.paymentDate,
      formatCurrency(row.payment),
      formatCurrency(row.principal),
      formatCurrency(row.interest),
      formatCurrency(row.remainingBalance),
    ]);

    autoTable(doc, {
      head: [['Cuota', 'Fecha', 'Pago Total', 'Capital', 'Intereses', 'Saldo Pendiente']],
      body: amortizationData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [255, 87, 51] },
      styles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
    });

    if (simulationData.amortizationTable.length > 50) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Mostrando las primeras 50 cuotas de ${simulationData.amortizationTable.length} totales`,
        20,
        Math.min(getLastTableY(tableDoc, 270) + 8, pageHeight - 15)
      );
    }
  }

  // Footer: numeración de páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.text(`Página ${i} de ${totalPages}`,
      w - marginRight,
      h - 10,
      { align: 'right' }
    );
  }

  // Save the PDF
  doc.save(`simulacion-hipotecaria-${new Date().toISOString().split('T')[0]}.pdf`);
};

