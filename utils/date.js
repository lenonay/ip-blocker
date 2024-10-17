export function Formater(fechaOriginal){
    //  Quitar corchetes
    const fechaSinCorchetes = fechaOriginal.replace(/[\[\]]/g, "");

    // Dividir fecha y hora
    const [fecha , ...horas] = fechaSinCorchetes.split(":");

    //  Diccionario de meses
    const meses = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    }

    // Crear la hora correctamente
    const hora = horas.join(":").slice(0, 8);

    // Dividir la fecha
    const [ dia, mesTexto, ano ] = fecha.split("/");
    // Cambiar el mes a número
    const mes = meses[mesTexto];
    // Crear la fecha
    const fechaISO = `${ano}-${mes}-${dia}T${hora}Z`;
    // Obtener el objeto Date
    const fechaDate = new Date(fechaISO);

    // Devolver en formato ISO
    return fechaDate.toISOString();
}