import React, { useState } from 'react';
import { ContractData, OperationType, ClientType, DocumentType, Currency, MaritalStatus, DayType, PropertyType } from './types';
import { ContractForm } from './components/ContractForm';
import { ContractPreview } from './components/ContractPreview';
import { Printer, FileText, Download } from 'lucide-react';

const initialData: ContractData = {
  operationType: OperationType.COMPRA,
  clientType: ClientType.PERSONA,
  clientName: '',
  clientDocType: DocumentType.DNI,
  clientDocNumber: '',
  clientMaritalStatus: MaritalStatus.SOLTERO,
  companyName: '',
  companyRuc: '',
  repName: '',
  repDocType: DocumentType.DNI,
  repDocNumber: '',
  repPartidaPoder: '',
  repCargo: '',
  clientAddress: '',
  clientDistrict: '',
  clientProvince: 'Lima',
  clientDepartment: 'Lima',
  properties: [{ 
    id: '1', 
    type: PropertyType.DEPARTAMENTO, 
    address: '', 
    district: '', 
    province: 'Lima',
    department: 'Lima',
    partida: '' 
  }],
  totalAmount: 0,
  totalAmountText: 'CERO CON 00/100',
  currency: Currency.DOLARES,
  reservationAmount: 0,
  reservationAmountText: '',
  reservationCurrency: Currency.DOLARES,
  reservationDays: 45,
  reservationDaysType: DayType.CALENDARIOS,
  signingDate: new Date().toISOString().split('T')[0],
  agent: {
    name: 'Oscar Juan Russo Ceruti',
    dni: '07793282'
  }
};

function App() {
  const [data, setData] = useState<ContractData>(initialData);

  const handleDownloadPdf = () => {
    // Check if html2pdf is loaded
    // @ts-ignore
    if (typeof window.html2pdf === 'undefined') {
      alert('La librería de PDF aún se está cargando. Por favor intente en unos segundos o use la opción de imprimir.');
      window.print();
      return;
    }

    // We target the inner content DIV, not the padded paper wrapper
    const element = document.getElementById('contract-preview-content');
    
    // Standard A4 Margins: 25.4mm (1 inch)
    // The margin option here creates the whitespace on the PDF page.
    const opt = {
      margin: [25.4, 25.4, 25.4, 25.4], // Top, Left, Bottom, Right (mm)
      filename: `Contrato_Reserva_${data.operationType}_${data.clientName || 'Cliente'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, // Higher scale for sharper text
        useCORS: true,
        letterRendering: true,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
    };

    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      
      {/* Navbar - Stronger Colors */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg sticky top-0 z-50 print:hidden">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-2 rounded-xl border border-white/20 backdrop-blur-sm">
               <FileText size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">ContractGen Pro</h1>
              <p className="text-sm text-blue-200 font-medium">Generador de Contratos de Reserva</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-yellow-400 text-blue-900 px-6 py-2.5 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg active:scale-95 transform"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Descargar PDF</span>
          </button>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="flex-1 w-full max-w-[95%] mx-auto px-4 py-6 flex flex-col xl:flex-row gap-8 justify-center">
        
        {/* Left Column: Form (Hidden when printing) - Widened to 650px */}
        <div className="flex-1 xl:max-w-[650px] space-y-6 print:hidden h-fit">
          <div className="bg-blue-100 border-l-4 border-blue-600 rounded-r-lg p-4 text-blue-900 shadow-sm">
            <p className="font-semibold">Instrucciones:</p>
            <p className="text-sm mt-1">
              Complete los campos del formulario. El contrato se actualizará en tiempo real. 
              Verifique la fecha de firma antes de descargar.
            </p>
          </div>
          <ContractForm data={data} onChange={setData} />
        </div>

        {/* Right Column: Preview */}
        <div className="flex-1 flex justify-center bg-slate-200 p-8 rounded-xl border-2 border-dashed border-slate-300 overflow-auto xl:bg-transparent xl:border-none xl:p-0">
          <div className="print:w-full print:absolute print:top-0 print:left-0 print:m-0">
             {/* 
                 Paper Wrapper (Visual only for Screen): 
                 - Width: 210mm (A4)
                 - Padding: 25.4mm (1 inch) to simulate margins.
                 - Background: White
             */}
             <div 
                className="bg-white shadow-2xl border border-gray-300 mx-auto box-border"
                style={{ width: '210mm', minHeight: '297mm', padding: '25.4mm' }}
             >
               {/* 
                  Inner Content: This is what we capture for PDF.
                  It fills 100% of the area inside the padding (approx 160mm wide).
                  We do NOT put the ID on the wrapper, because we don't want to capture the wrapper's padding + PDF margins.
               */}
               <ContractPreview data={data} />
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;