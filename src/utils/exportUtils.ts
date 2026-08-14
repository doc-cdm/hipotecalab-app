// Dynamic export utilities to avoid loading heavy libs until needed
import { SimulationData } from '../types/simulation';
import { formatCurrency, formatPercentage } from './formatters';
import { calculateTotalInvestment } from './calculations';

export const exportToPDF = async (simulationData: SimulationData) => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF();

  // Metadata
  doc.setProperties({
    title: 'Simulación Hipotecaria',
    subject: 'Resumen y detalles de la simulación hipotecaria',
    creator: 'Balma Mortgage Playground',
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

  let yPos = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : 40;

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

  yPos = (doc as any).lastAutoTable.finalY + 8;

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

  yPos = (doc as any).lastAutoTable.finalY + 8;

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

  yPos = (doc as any).lastAutoTable.finalY + 8;

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

    yPos = (doc as any).lastAutoTable.finalY + 8;
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
  const wrapped = (doc as any).splitTextToSize
    ? (doc as any).splitTextToSize(notesText, pageWidth - marginLeft - marginRight)
    : notesText;
  // @ts-ignore splitTextToSize no tipado en tipos de jsPDF
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
        Math.min(((doc as any).lastAutoTable?.finalY || 270) + 8, pageHeight - 15)
      );
    }
  }

  // Footer: numeración de páginas
  const totalPages = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : 1;
  for (let i = 1; i <= totalPages; i++) {
    (doc as any).setPage(i);
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

export const exportToExcel = async (simulationData: SimulationData) => {
  const XLSX = await import('xlsx');

  const totalInvestment = calculateTotalInvestment(simulationData.propertyPrice, simulationData.costs);
  const requestedFinancing = totalInvestment - simulationData.initialContribution;
  const financingPercentage = (requestedFinancing / simulationData.propertyPrice) * 100;
  const totalInterestTIN = simulationData.amortizationTable.reduce((sum, row) => sum + row.interest, 0);
  const totalCost = totalInvestment + totalInterestTIN;

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['SIMULACIÓN HIPOTECARIA'],
    ['Fecha:', new Date().toLocaleDateString('es-ES')],
    [''],
    ['INFORMACIÓN DEL INMUEBLE'],
    ['Precio del inmueble:', simulationData.propertyPrice],
    ['Coste total de la inversión:', totalInvestment],
    ['Aportación inicial:', simulationData.initialContribution],
    ['Financiación solicitada:', requestedFinancing],
    ['Porcentaje financiado:', financingPercentage / 100],
    [''],
    ['CONDICIONES DEL PRÉSTAMO'],
    ['Plazo:', `${simulationData.loanTerm} años`],
    ['TIN:', simulationData.tin / 100],
    ['TAE:', simulationData.tae / 100],
    ['Fecha de inicio:', simulationData.startDate],
    [''],
    ['INFORMACIÓN DE CUOTAS'],
    ['Cuota mensual (sin extras):', simulationData.monthlyPayment],
    ['Cuota mensual (con extras):', simulationData.monthlyPaymentWithExtras],
    ['Coste total del préstamo:', totalCost],
    ['Intereses totales (TIN):', totalInterestTIN],
  ];

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Format currency and percentage columns
  const range = XLSX.utils.decode_range((summaryWs as any)['!ref'] || 'A1');
  for (let r = range.s.r; r <= range.e.r; r++) {
    const cellB = XLSX.utils.encode_cell({ r, c: 1 });
    const cell: any = (summaryWs as any)[cellB];
    if (cell && typeof cell.v === 'number') {
      const labelRow = summaryData[r] as any[] | undefined;
      const label = Array.isArray(labelRow) && labelRow[0] ? String(labelRow[0]).toLowerCase() : '';
      if (label.includes('precio') || label.includes('coste') || label.includes('aportación') || 
          label.includes('financiación') || label.includes('cuota') || label.includes('intereses')) {
        cell.z = '"€"#,##0.00';
      } else if (label.includes('porcentaje') || label.includes('tin') || label.includes('tae')) {
        cell.z = '0.00%';
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumen');

  // Costs sheet
  if (simulationData.costs && Object.keys(simulationData.costs).length > 0) {
    const costsData = [
      ['DESGLOSE DE COSTES'],
      [''],
      ['Concepto', 'Importe'],
      ['Notaría', simulationData.costs.notary || 0],
      ['Registro de la Propiedad', simulationData.costs.registry || 0],
      ['Gestoría', simulationData.costs.agency || 0],
      ['Tasación', simulationData.costs.appraisal || 0],
      ['ITP/IVA (%)', simulationData.costs.taxRate || 0],
    ];

    const costsWs = XLSX.utils.aoa_to_sheet(costsData);
    
    // Format currency columns
    const costsRange = XLSX.utils.decode_range((costsWs as any)['!ref'] || 'A1');
    for (let r = 3; r <= costsRange.e.r; r++) {
      const cellB = XLSX.utils.encode_cell({ r, c: 1 });
      const cell: any = (costsWs as any)[cellB];
      if (cell && typeof cell.v === 'number') {
        cell.z = '"€"#,##0.00';
      }
    }

    XLSX.utils.book_append_sheet(wb, costsWs, 'Costes');
  }

  // Amortization sheet
  if (simulationData.amortizationTable.length > 0) {
    const amortizationData = [
      ['TABLA DE AMORTIZACIÓN'],
      [''],
      ['Cuota', 'Fecha', 'Pago Total', 'Capital', 'Intereses', 'Saldo Pendiente'],
      ...simulationData.amortizationTable.map((row, index) => [
        index + 1,
        row.paymentDate,
        row.payment,
        row.principal,
        row.interest,
        row.remainingBalance
      ])
    ];

    const amortizationWs = XLSX.utils.aoa_to_sheet(amortizationData);
    
    // Format currency columns
    const amortRange = XLSX.utils.decode_range((amortizationWs as any)['!ref'] || 'A1');
    for (let r = 3; r <= amortRange.e.r; r++) {
      for (let c = 2; c <= 5; c++) { // Columns C through F
        const cellRef = XLSX.utils.encode_cell({ r, c });
        const cell: any = (amortizationWs as any)[cellRef];
        if (cell && typeof cell.v === 'number') {
          cell.z = '"€"#,##0.00';
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, amortizationWs, 'Amortización');
  }

  // Save the file
  XLSX.writeFile(wb, `simulacion-hipotecaria-${new Date().toISOString().split('T')[0]}.xlsx`);
};
