import React from 'react';
import { ContractData, ClientType, OperationType, Currency } from '../types';
import { toTitleCase } from '../utils';

interface ContractPreviewProps {
  data: ContractData;
}

export const ContractPreview: React.FC<ContractPreviewProps> = ({ data }) => {
  const isCompany = data.clientType === ClientType.EMPRESA;
  const isRent = data.operationType === OperationType.ALQUILER;
  
  // Singular/Plural Logic
  const multipleProperties = data.properties.length > 1;
  const propertyTerm = multipleProperties ? 'LOS INMUEBLES' : 'EL INMUEBLE';
  const propertyTermLower = multipleProperties ? 'los inmuebles' : 'el inmueble';
  
  // Client Terms
  let clientTerm = '';
  if (isRent) {
    clientTerm = isCompany ? 'LA ARRENDATARIA' : 'EL ARRENDATARIO';
  } else {
    clientTerm = isCompany ? 'LA COMPRADORA' : 'EL COMPRADOR';
  }

  // Formatting helpers
  const currencySymbol = (c: Currency) => c === Currency.DOLARES ? '$' : 'S/';
  const currencyName = (c: Currency) => c === Currency.DOLARES ? 'Dólares Americanos' : 'Soles';
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "___ de ________ del 20__";
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  // Styling
  // Reduced bottom margin (mb-3) to help fit on one page
  const pClass = "mb-3 text-justify leading-snug break-inside-avoid";

  return (
    <div 
      id="contract-preview-content"
      className="text-gray-900 w-full"
      // Added significant paddingRight (20px) to force text wrapping earlier
      // This prevents the "justified" text from touching the absolute edge of the PDF render area
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif', 
        fontSize: '10.5pt',
        paddingRight: '20px', 
        paddingLeft: '0px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 font-sans text-xs">
        <div className="text-gray-500 italic font-semibold">RE/MAX POWER EXPO</div>
        <div className="text-gray-500 italic font-semibold">ASESORÍA INMOBILIARIA MC S.A.C.</div>
      </div>

      <h1 className="text-center font-bold text-base mb-6 uppercase decoration-slate-900 underline underline-offset-4 break-inside-avoid font-sans">
        CONTRATO DE RESERVA DE {data.operationType}
      </h1>

      <div className={pClass}>
        <p>
          Mediante el presente documento, "contrato de reserva de {data.operationType.toLowerCase()}", suscrito de una parte por:
        </p>
        <ul className="list-disc ml-8 mt-1 space-y-1">
          <li>
            La empresa <strong>ASESORÍA INMOBILIARIA MC S.A.C.</strong> cuyo nombre comercial obedece al de <strong>RE/MAX POWER EXPO</strong>, 
            con Registro Único de Contribuyente N° 20605637401 y Registro Inmobiliario del Ministerio de Vivienda y Saneamiento Nº PJ-01853, 
            debidamente representada por su Gerenta General SCHARON CARLOTA CASTRO OBREGÓN identificada con DNI 43556818, según facultades debidamente 
            inscritas en Partida Electrónica N° 11953023 del Registro de Personas Jurídicas de Lima, con domicilio para efectos del presente contrato 
            en CALLE BREA Y PARIÑAS 102, OFICINA 1303, distrito de SANTIAGO DE SURCO, provincia y departamento de Lima, en adelante <strong>LA INMOBILIARIA</strong>.
          </li>
        </ul>
      </div>

      <div className={pClass}>
        <p>Y de la otra parte por:</p>
        <ul className="list-disc ml-8 mt-1">
          <li>
            {isCompany ? (
               <span>
                 La empresa <strong>{data.companyName}</strong>, identificada con RUC N° {data.companyRuc}, debidamente representada por 
                 el Sr./Sra. <strong>{data.repName}</strong>, identificado con {data.repDocType} N° {data.repDocNumber}, 
                 {data.repPartidaPoder && data.repPartidaPoder.trim() !== '' && (
                   <span>según facultades inscritas en la Partida N° {data.repPartidaPoder} del Registro de Personas Jurídicas, </span>
                 )}
                 en su calidad de {data.repCargo}, 
                 con domicilio en {data.clientAddress}, distrito de {data.clientDistrict}, provincia de {data.clientProvince}, departamento de {data.clientDepartment}.
               </span>
            ) : (
              <span>
                El Sr./Sra. <strong>{data.clientName}</strong>, identificado con {data.clientDocType} N° {data.clientDocNumber}, 
                estado civil <strong>{data.clientMaritalStatus}</strong>, con domicilio actual en {data.clientAddress}, distrito de {data.clientDistrict}, provincia de {data.clientProvince}, departamento de {data.clientDepartment}.
              </span>
            )}
            {' '}En adelante <strong>{clientTerm}</strong>.
          </li>
        </ul>
      </div>

      <p className="mb-4 break-inside-avoid text-justify">
        Se acuerda en formalizar el contrato de reserva de {data.operationType.toLowerCase()} de bien inmueble, en los términos y condiciones detallados a continuación:
      </p>

      {/* Clauses */}
      <div className="space-y-3">
        <p className={pClass}>
          <strong>PRIMERO: LA INMOBILIARIA</strong> es una empresa profesional dedicada a la prestación de servicios de gestión, promoción, asesoría, intermediación y corretaje inmobiliario, 
          debidamente inscrita en el Registro de Agentes Inmobiliarios del Ministerio de Vivienda, Construcción y Saneamiento, conforme a la Ley Nº 29080.
          <br /><br />
          <strong>LA INMOBILIARIA</strong> autoriza a su agente afiliado <strong>{data.agent.name}</strong> identificado con DNI N° {data.agent.dni} para que actúe en su representación, 
          realizando las negociaciones y coordinaciones pertinentes encaminadas a la formalización y perfeccionamiento de la {data.operationType.toLowerCase()} de {propertyTermLower} materia del presente documento de reserva.
        </p>

        <p className={pClass}>
          <strong>SEGUNDO: {clientTerm}</strong>, se {isCompany ? 'encuentra interesada' : 'encuentra interesado'} en {isRent ? 'alquilar' : 'comprar'} {propertyTermLower} cuya descripción y ubicación se detalla a continuación:
          <div className="mt-1 ml-4">
            {data.properties.map((prop, i) => {
              const registryText = prop.partida && prop.partida.trim() !== ''
                ? `Inscrito en la Partida Electrónica N° ${prop.partida} del Registro de Predios de ${toTitleCase(prop.province || 'Lima')}.` 
                : '';

              return (
                <div key={prop.id} className="mb-1">
                  - <strong>{prop.type}</strong> ubicado en {prop.address}, distrito de {prop.district}, provincia de {prop.province}, departamento de {prop.department}. {registryText}
                </div>
              );
            })}
          </div>
        </p>

        <p className={pClass}>
          <strong>TERCERO: {propertyTerm}</strong> {multipleProperties ? 'tienen' : 'tiene'} un precio establecido en la suma de <strong>{currencySymbol(data.currency)} {formatMoney(data.totalAmount)} ({data.totalAmountText || '__________________'} {currencyName(data.currency)})</strong>.
        </p>

        <p className={pClass}>
          <strong>CUARTO:</strong> Es voluntad de <strong>{clientTerm}</strong> reservar y por consecuencia retirar temporalmente del mercado inmobiliario 
          <strong> {propertyTerm}</strong> en cuestión, para lo cual entrega como respaldo de su intención de {data.operationType.toLowerCase()} a <strong>LA INMOBILIARIA</strong> la suma de 
          <strong> {currencySymbol(data.reservationCurrency)} {formatMoney(data.reservationAmount)} ({data.reservationAmountText || '__________________'} {currencyName(data.reservationCurrency)})</strong>.
        </p>

        <p className={pClass}>
          <strong>QUINTO: {propertyTerm}</strong> quedará reservado a favor de <strong>EL CLIENTE</strong> por un plazo de <strong>{data.reservationDays} {data.reservationDaysType}</strong>, contados desde la firma del presente contrato, 
          plazo en el cual se deberá realizar la formalización {isRent ? 'del contrato de arrendamiento' : 'de las arras, promesa de venta o minuta de compraventa definitiva'}.
        </p>

        <p className={pClass}>
          <strong>SEXTO:</strong> Ambas partes convienen que en el supuesto de no llegarse a concretar la {data.operationType.toLowerCase()} de <strong>{propertyTerm}</strong> por causas imputables al 
          {isRent ? ' arrendador' : ' vendedor/propietario/titular registral'}, documentación de la propiedad, el monto de reserva será devuelto íntegramente a <strong>{clientTerm}</strong>.
          <br /><br />
          En caso de no llegarse a concretar la {data.operationType.toLowerCase()} de <strong>{propertyTerm}</strong> por desistimiento expreso de <strong>{clientTerm}</strong>, 
          el monto de la reserva será retenido por concepto de penalidad por los perjuicios ocasionados al perder oportunidades de {isRent ? 'alquiler' : 'venta'} mientras se mantuvo reservado <strong>{propertyTerm}</strong>.
        </p>

        <p className={pClass}>
          <strong>SÉPTIMO:</strong> Se deja constancia que, de concretarse la operación de {data.operationType.toLowerCase()}, el monto de la reserva no formará parte del valor de {data.operationType.toLowerCase()} total de <strong>{propertyTerm}</strong>
           {data.operationType === OperationType.ALQUILER && ', la misma que será devuelta o aplicada al pago de garantía/adelanto según acuerdo en el contrato final'}.
        </p>

        <p className="mb-4 break-inside-avoid text-justify">
          Sin perjuicio de las notificaciones electrónicas, las partes son libres realizar las notificaciones por conducto notarial que estimen convenientes a los domicilios detallados en la introducción del presente documento.
        </p>

        <p className="mt-6 text-right break-inside-avoid">
          Lima, {formatDate(data.signingDate)}
        </p>

        {/* Signature Section */}
        <div className="break-inside-avoid">
           {/* Spacer for signatures - 3cm to fit on page */}
           <div style={{ height: '3cm' }}></div>
           
           <div className="grid grid-cols-2 gap-12 text-center font-sans text-sm">
            <div>
              <div className="border-t border-black pt-2 mx-4">
                <strong>{clientTerm}</strong><br/>
                {isCompany ? (
                  <>
                    {data.repName}<br/>
                    REP. DE {data.companyName}<br/>
                    {data.repDocType} {data.repDocNumber}
                  </>
                ) : (
                  <>
                    {data.clientName}<br/>
                    {data.clientDocType} {data.clientDocNumber}
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="border-t border-black pt-2 mx-4">
                <strong>EL AGENTE</strong><br/>
                {data.agent.name}<br/>
                DNI {data.agent.dni}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};