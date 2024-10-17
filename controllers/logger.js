import { MySQL } from "../models/RegisterToDB.js";

export async function ProccessLog(content) {

    // Inicializamos un array
    const data_structure = [];

    // Dividimos el log por lineas
    const entries = content.split("\n");

    // Por cada linea metemos a la estructura de datos un array con cada campo
    entries.forEach(entry => {
        data_structure.push(entry.split(" "));
    });

    // Ordenamos las IPs para que este todas juntas
    const sorted_data = data_structure.sort(SortIPAddress);

    // Validamos que las tablas estén correctas y vaciamos la de peticiones
    const Validate = await MySQL.Verify();

    if(Validate !== "Error"){
        for (const entry of sorted_data) {
            await MySQL.ProccessEntry(entry);
        }
    }


}

function SortIPAddress(a, b) {
    const ipA = Number(a[0].split("."));

    const ipB = Number(b[0].split("."));

    return ipA - ipB;
}