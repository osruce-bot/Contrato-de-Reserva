import React, { ChangeEvent } from 'react';
import { ContractData, OperationType, ClientType, DocumentType, Currency, MaritalStatus, Property, DayType, PropertyType } from '../types';
import { FormSection } from './FormSection';
import { User, Building, FileText, DollarSign, Calendar, Plus, Trash2, Briefcase } from 'lucide-react';
import { formatSmartText, numberToText, toTitleCase } from '../utils';

interface ContractFormProps {
  data: ContractData;
  onChange: (data: ContractData) => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({ data, onChange }) => {

  const updateField = (field: keyof ContractData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleTextChange = (field: keyof ContractData, value: string) => {
    // Uses smart formatting: 
    // If user types all caps, it stays all caps. 
    // If user types lowercase/mixed, it converts to Title Case.
    updateField(field, formatSmartText(value));
  };

  const handlePropertyChange = (id: string, field: keyof Property, value: string) => {
    // Added 'partida' to be formatted as well
    const textFields = ['address', 'district', 'province', 'department', 'partida'];
    const finalValue = textFields.includes(field) 
      ? formatSmartText(value) 
      : value;
      
    const updatedProperties = data.properties.map(p => 
      p.id === id ? { ...p, [field]: finalValue } : p
    );
    updateField('properties', updatedProperties);
  };

  const handleAmountChange = (field: 'totalAmount' | 'reservationAmount', value: string) => {
    const num = parseFloat(value);
    const textField = field === 'totalAmount' ? 'totalAmountText' : 'reservationAmountText';
    
    // Update number and automatically update text
    onChange({
      ...data,
      [field]: num,
      [textField]: formatSmartText(numberToText(num))
    });
  };

  const addProperty = () => {
    const newProperty: Property = {
      id: Math.random().toString(36).substr(2, 9),
      type: PropertyType.DEPARTAMENTO,
      address: '',
      district: '',
      province: 'Lima',
      department: 'Lima',
      partida: ''
    };
    updateField('properties', [...data.properties, newProperty]);
  };

  const removeProperty = (id: string) => {
    if (data.properties.length > 1) {
      updateField('properties', data.properties.filter(p => p.id !== id));
    }
  };

  // High visibility input styling
  const inputClass = "w-full rounded-lg border-2 border-slate-300 p-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm font-medium";
  const labelClass = "block text-sm font-bold text-slate-700 mb-1.5";

  return (
    <div className="space-y-8">
      
      {/* Configuration */}
      <FormSection title="Configuración de Operación" icon={<Briefcase size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Tipo de Operación</label>
            <select
              className={inputClass}
              value={data.operationType}
              onChange={(e) => updateField('operationType', e.target.value)}
            >
              <option value={OperationType.COMPRA}>Compra Venta</option>
              <option value={OperationType.ALQUILER}>Alquiler</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Tipo de Cliente</label>
            <div className="flex bg-slate-200 p-1.5 rounded-xl">
              <button
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${data.clientType === ClientType.PERSONA ? 'bg-white shadow text-blue-800' : 'text-slate-600 hover:text-slate-800'}`}
                onClick={() => updateField('clientType', ClientType.PERSONA)}
              >
                Persona
              </button>
              <button
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${data.clientType === ClientType.EMPRESA ? 'bg-white shadow text-blue-800' : 'text-slate-600 hover:text-slate-800'}`}
                onClick={() => updateField('clientType', ClientType.EMPRESA)}
              >
                Empresa
              </button>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Client Data */}
      <FormSection title={data.clientType === ClientType.PERSONA ? "Datos del Cliente" : "Datos de la Empresa"} icon={<User size={20} />}>
        {data.clientType === ClientType.PERSONA ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Nombre Completo</label>
              <input type="text" className={inputClass} 
                value={data.clientName} onChange={(e) => handleTextChange('clientName', e.target.value)} placeholder="Ej: Juan Pérez" />
            </div>
            <div>
              <label className={labelClass}>Tipo Documento</label>
              <select className={inputClass}
                value={data.clientDocType} onChange={(e) => updateField('clientDocType', e.target.value)}>
                <option value={DocumentType.DNI}>DNI</option>
                <option value={DocumentType.PASAPORTE}>Pasaporte</option>
                <option value={DocumentType.CE}>Carnet de Extranjería</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Nº Documento</label>
              <input type="text" className={inputClass}
                value={data.clientDocNumber} onChange={(e) => handleTextChange('clientDocNumber', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Estado Civil</label>
              <select className={inputClass}
                value={data.clientMaritalStatus} onChange={(e) => updateField('clientMaritalStatus', e.target.value)}>
                {Object.values(MaritalStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div className="md:col-span-2">
              <label className={labelClass}>Razón Social</label>
              <input type="text" className={inputClass}
                value={data.companyName} onChange={(e) => handleTextChange('companyName', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>RUC</label>
              <input type="text" className={inputClass}
                value={data.companyRuc} onChange={(e) => handleTextChange('companyRuc', e.target.value)} />
            </div>
            <div className="md:col-span-2 pt-4 border-t-2 border-slate-200">
              <h4 className="text-sm font-bold text-blue-800 mb-3 uppercase tracking-wider">Representante Legal</h4>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Nombre Completo Rep.</label>
              <input type="text" className={inputClass}
                value={data.repName} onChange={(e) => handleTextChange('repName', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Doc. Identidad Rep.</label>
              <select className={`${inputClass} mb-2`}
                value={data.repDocType} onChange={(e) => updateField('repDocType', e.target.value)}>
                <option value={DocumentType.DNI}>DNI</option>
                <option value={DocumentType.PASAPORTE}>Pasaporte</option>
                <option value={DocumentType.CE}>C.E.</option>
              </select>
              <input type="text" className={inputClass}
                placeholder="Número"
                value={data.repDocNumber} onChange={(e) => handleTextChange('repDocNumber', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Cargo y Poderes</label>
              <input type="text" placeholder="Cargo (Ej: Gerente General)" className={`${inputClass} mb-3`}
                value={data.repCargo} onChange={(e) => handleTextChange('repCargo', e.target.value)} />
               <input type="text" placeholder="Partida Vigencia Poder" className={inputClass}
                value={data.repPartidaPoder} onChange={(e) => handleTextChange('repPartidaPoder', e.target.value)} />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 pt-4 border-t-2 border-slate-200">
           <div className="md:col-span-2">
              <label className={labelClass}>Dirección Legal / Domicilio</label>
              <input type="text" className={inputClass} placeholder="Calle / Av / Jirón"
                value={data.clientAddress} onChange={(e) => handleTextChange('clientAddress', e.target.value)} />
            </div>
             <div>
              <label className={labelClass}>Distrito</label>
              <input type="text" placeholder="Ej: Miraflores" className={inputClass}
                value={data.clientDistrict} onChange={(e) => handleTextChange('clientDistrict', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Provincia</label>
              <input type="text" placeholder="Ej: Lima" className={inputClass}
                value={data.clientProvince} onChange={(e) => handleTextChange('clientProvince', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Departamento</label>
              <input type="text" placeholder="Ej: Lima" className={inputClass}
                value={data.clientDepartment} onChange={(e) => handleTextChange('clientDepartment', e.target.value)} />
            </div>
        </div>
      </FormSection>

      {/* Properties */}
      <FormSection title="Inmuebles" icon={<Building size={20} />}>
        {data.properties.map((prop, index) => (
          <div key={prop.id} className="bg-white p-5 rounded-xl border-2 border-slate-200 mb-4 relative group hover:border-blue-400 transition-colors">
            <h4 className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wide">Inmueble {index + 1}</h4>
            {data.properties.length > 1 && (
              <button 
                onClick={() => removeProperty(prop.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className={labelClass}>Tipo de Inmueble</label>
                <select
                  className={inputClass}
                  value={prop.type}
                  onChange={(e) => handlePropertyChange(prop.id, 'type', e.target.value)}
                >
                  {Object.values(PropertyType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                 <label className={labelClass}>Dirección</label>
                 <input 
                  type="text" 
                  placeholder="Dirección Completa (Calle, Mz, Lt...)" 
                  className={inputClass}
                  value={prop.address}
                  onChange={(e) => handlePropertyChange(prop.id, 'address', e.target.value)}
                />
              </div>
               <div>
                 <label className={labelClass}>Distrito</label>
                 <input 
                  type="text" 
                  placeholder="Distrito" 
                  className={inputClass}
                  value={prop.district}
                  onChange={(e) => handlePropertyChange(prop.id, 'district', e.target.value)}
                />
              </div>
              <div>
                 <label className={labelClass}>Provincia</label>
                 <input 
                  type="text" 
                  placeholder="Provincia" 
                  className={inputClass}
                  value={prop.province}
                  onChange={(e) => handlePropertyChange(prop.id, 'province', e.target.value)}
                />
              </div>
              <div>
                 <label className={labelClass}>Departamento</label>
                 <input 
                  type="text" 
                  placeholder="Departamento" 
                  className={inputClass}
                  value={prop.department}
                  onChange={(e) => handlePropertyChange(prop.id, 'department', e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                 <label className={labelClass}>Partida Registral</label>
                 <input 
                  type="text" 
                  placeholder="Nº Partida Electrónica" 
                  className={inputClass}
                  value={prop.partida}
                  onChange={(e) => handlePropertyChange(prop.id, 'partida', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <button 
          onClick={addProperty}
          className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-blue-400 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors font-bold"
        >
          <Plus size={20} /> Agregar Otro Inmueble
        </button>
      </FormSection>

      {/* Financials */}
      <FormSection title="Importes y Condiciones" icon={<DollarSign size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              Precio Total ({data.operationType === OperationType.COMPRA ? 'Venta' : 'Alquiler'})
            </label>
            <div className="flex gap-2">
              <select 
                className="w-28 rounded-lg border-2 border-slate-300 p-2.5 bg-slate-50 text-slate-900 font-bold focus:border-blue-600 outline-none"
                value={data.currency} onChange={(e) => updateField('currency', e.target.value)}
              >
                <option value={Currency.DOLARES}>USD $</option>
                <option value={Currency.SOLES}>S/</option>
              </select>
              <input type="number" className={inputClass}
                value={data.totalAmount || ''} onChange={(e) => handleAmountChange('totalAmount', e.target.value)} />
            </div>
             <input type="text" placeholder="Importe en letras" className="w-full mt-2 text-xs font-mono text-slate-500 bg-slate-100 p-2 rounded border border-slate-200"
                value={data.totalAmountText} readOnly />
          </div>

          <div>
            <label className={labelClass}>Monto de Reserva</label>
            <div className="flex gap-2">
              <select 
                className="w-28 rounded-lg border-2 border-slate-300 p-2.5 bg-slate-50 text-slate-900 font-bold focus:border-blue-600 outline-none"
                value={data.reservationCurrency} onChange={(e) => updateField('reservationCurrency', e.target.value)}
              >
                 <option value={Currency.DOLARES}>USD $</option>
                 <option value={Currency.SOLES}>S/</option>
              </select>
              <input type="number" className={inputClass}
                value={data.reservationAmount || ''} onChange={(e) => handleAmountChange('reservationAmount', e.target.value)} />
            </div>
            <input type="text" placeholder="Importe en letras" className="w-full mt-2 text-xs font-mono text-slate-500 bg-slate-100 p-2 rounded border border-slate-200"
                value={data.reservationAmountText} readOnly />
          </div>

          <div>
            <label className={labelClass}>Plazo de Reserva</label>
            <div className="flex gap-2">
              <input type="number" className={`${inputClass} w-24`}
                  value={data.reservationDays} onChange={(e) => updateField('reservationDays', parseInt(e.target.value))} />
              <select 
                className={inputClass}
                value={data.reservationDaysType} onChange={(e) => updateField('reservationDaysType', e.target.value)}
              >
                <option value={DayType.CALENDARIOS}>Días Calendarios</option>
                <option value={DayType.UTILES}>Días Útiles</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className={labelClass}>Fecha de Firma</label>
            <input type="date" className={inputClass}
                value={data.signingDate} onChange={(e) => updateField('signingDate', e.target.value)} />
          </div>
        </div>
      </FormSection>

       {/* Agent Data (Editable) */}
      <FormSection title="Datos del Agente" icon={<FileText size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
              <label className={labelClass}>Nombre Agente</label>
              <input type="text" className={inputClass}
                value={data.agent.name} onChange={(e) => updateField('agent', {...data.agent, name: formatSmartText(e.target.value)})} />
            </div>
             <div>
              <label className={labelClass}>DNI Agente</label>
              <input type="text" className={inputClass}
                value={data.agent.dni} onChange={(e) => updateField('agent', {...data.agent, dni: formatSmartText(e.target.value)})} />
            </div>
        </div>
      </FormSection>
    </div>
  );
};