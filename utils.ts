export const formatSmartText = (str: string): string => {
  if (!str) return "";
  // Logic: If the string is already fully uppercase (and has length > 1 to avoid annoyance while typing first letter), keep it.
  // Otherwise, apply Title Case.
  // We check length > 1 because typically user starts typing "L"... which is upper, then "Li" (mixed).
  // If they type "LI", it stays upper.
  
  if (str === str.toUpperCase() && str.length > 0) {
    return str;
  }
  
  return toTitleCase(str);
};

export const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str.toLowerCase().replace(/(?:^|\s|['"([{])+\S/g, (match) => match.toUpperCase());
};

const Unidades = (num: number) => {
  switch(num) {
    case 1: return "UN";
    case 2: return "DOS";
    case 3: return "TRES";
    case 4: return "CUATRO";
    case 5: return "CINCO";
    case 6: return "SEIS";
    case 7: return "SIETE";
    case 8: return "OCHO";
    case 9: return "NUEVE";
  }
  return "";
}

const Decenas = (num: number) => {
  let decena = Math.floor(num/10);
  let unidad = num - (decena * 10);

  switch(decena) {
    case 1:
      switch(unidad) {
        case 0: return "DIEZ";
        case 1: return "ONCE";
        case 2: return "DOCE";
        case 3: return "TRECE";
        case 4: return "CATORCE";
        case 5: return "QUINCE";
        default: return "DIECI" + Unidades(unidad);
      }
    case 2:
      switch(unidad) {
        case 0: return "VEINTE";
        default: return "VEINTI" + Unidades(unidad);
      }
    case 3: return "TREINTA" + (unidad > 0 ? " Y " + Unidades(unidad) : "");
    case 4: return "CUARENTA" + (unidad > 0 ? " Y " + Unidades(unidad) : "");
    case 5: return "CINCUENTA" + (unidad > 0 ? " Y " + Unidades(unidad) : "");
    case 6: return "SESENTA" + (unidad > 0 ? " Y " + Unidades(unidad) : "");
    case 7: return "SETENTA" + (unidad > 0 ? " Y " + Unidades(unidad) : "");
    case 8: return "OCHENTA" + (unidad > 0 ? " Y " + Unidades(unidad) : "");
    case 9: return "NOVENTA" + (unidad > 0 ? " Y " + Unidades(unidad) : "");
    case 0: return Unidades(unidad);
  }
  return "";
}

const Centenas = (num: number) => {
  let centenas = Math.floor(num / 100);
  let decenas = num - (centenas * 100);

  switch(centenas) {
    case 1:
      if (decenas > 0) return "CIENTO " + Decenas(decenas);
      return "CIEN";
    case 2: return "DOSCIENTOS " + Decenas(decenas);
    case 3: return "TRESCIENTOS " + Decenas(decenas);
    case 4: return "CUATROCIENTOS " + Decenas(decenas);
    case 5: return "QUINIENTOS " + Decenas(decenas);
    case 6: return "SEISCIENTOS " + Decenas(decenas);
    case 7: return "SETECIENTOS " + Decenas(decenas);
    case 8: return "OCHOCIENTOS " + Decenas(decenas);
    case 9: return "NOVECIENTOS " + Decenas(decenas);
  }
  return Decenas(decenas);
}

const Seccion = (num: number, divisor: number, strSingular: string, strPlural: string) => {
  let cientos = Math.floor(num / divisor)
  let resto = num - (cientos * divisor)

  let letras = "";

  if (cientos > 0) {
    if (cientos > 1) {
      letras = Centenas(cientos) + " " + strPlural;
    } else {
      letras = strSingular;
    }
  }

  if (resto > 0) {
    letras += "";
  }
  return letras;
}

const Miles = (num: number) => {
  let divisor = 1000;
  let cientos = Math.floor(num / divisor)
  let resto = num - (cientos * divisor)

  let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
  let strCentenas = Centenas(resto);

  if(strMiles === "")
    return strCentenas;

  return strMiles + " " + strCentenas;
}

const Millones = (num: number) => {
  let divisor = 1000000;
  let cientos = Math.floor(num / divisor)
  let resto = num - (cientos * divisor)

  let strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
  let strMiles = Miles(resto);

  if(strMillones === "")
    return strMiles;

  return strMillones + " " + strMiles;
}

export const numberToText = (num: number): string => {
  if (!num) return "";
  
  let data = {
    entero: Math.floor(num),
    decimal: Math.round((num - Math.floor(num)) * 100)
  };

  let letras = "";

  if (data.entero === 0)
    letras = "CERO";
  else if (data.entero <= 999999999)
    letras = Millones(data.entero);
  else
    letras = "NÚMERO DEMASIADO GRANDE";

  // Format Text
  // e.g., DOSCIENTOS CON 00/100
  let decimalStr = data.decimal < 10 ? "0" + data.decimal : data.decimal;
  return `${letras} CON ${decimalStr}/100`;
}