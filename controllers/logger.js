export function ProccessLog(content) {

    const data_structure = [];

    const entries = content.split("\n");

    entries.forEach(entry => {
        data_structure.push(entry.split(" "));
    });

    const sorted = data_structure.sort(SortIPAddress);

}

function SortIPAddress(a, b) {
    const ipA = Number(a[0].split("."));

    const ipB = Number(a[0].split("."));

    return ipA - ipB;
}