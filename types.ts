export enum OperationType {
  COMPRA = 'COMPRA',
  ALQUILER = 'ALQUILER',
}

export enum ClientType {
  PERSONA = 'PERSONA',
  EMPRESA = 'EMPRESA',
}

export enum DocumentType {
  DNI = 'DNI',
  PASAPORTE = 'PASAPORTE',
  CE = 'CE', // Carnet de Extranjeria
  RUC = 'RUC',
}

export enum Currency {
  SOLES = 'S/',
  DOLARES = '$',
}

export enum MaritalStatus {
  SOLTERO = 'SOLTERO',
  CASADO = 'CASADO',
  DIVORCIADO = 'DIVORCIADO',
  VIUDO = 'VIUDO',
  CONVIVIENTE = 'CONVIVIENTE',
}

export enum DayType {
  CALENDARIOS = 'calendarios',
  UTILES = 'útiles',
}

export enum PropertyType {
  DEPARTAMENTO = 'DEPARTAMENTO',
  COCHERA = 'COCHERA',
  CASA = 'CASA',
  OFICINA = 'OFICINA',
  LOCAL_COMERCIAL = 'LOCAL COMERCIAL',
  LOCAL_INDUSTRIAL = 'LOCAL INDUSTRIAL',
  TERRENO = 'TERRENO',
  DEPOSITO = 'DEPÓSITO',
}

export interface Property {
  id: string;
  type: PropertyType;
  address: string;
  district: string;
  province: string;
  department: string;
  partida: string; // Registration number
}

export interface Agent {
  name: string;
  dni: string;
}

export interface ContractData {
  operationType: OperationType;
  clientType: ClientType;
  
  // Person Data
  clientName: string;
  clientDocType: DocumentType;
  clientDocNumber: string;
  clientMaritalStatus: MaritalStatus;
  
  // Company Data
  companyName: string;
  companyRuc: string;
  repName: string;
  repDocType: DocumentType;
  repDocNumber: string;
  repPartidaPoder: string; // Power of attorney entry
  repCargo: string;

  // Common Address
  clientAddress: string;
  clientDistrict: string;
  clientProvince: string;
  clientDepartment: string;

  // Transaction Details
  properties: Property[];
  totalAmount: number;
  totalAmountText: string; // Amount in words
  currency: Currency;
  
  reservationAmount: number;
  reservationAmountText: string; // Amount in words
  reservationCurrency: Currency;
  
  reservationDays: number;
  reservationDaysType: DayType;
  signingDate: string; // ISO Date string

  // Agent (Default from PDF but editable)
  agent: Agent;
}