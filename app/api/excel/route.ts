import { pool } from '@/config/db'
import { NextResponse } from 'next/server';


// Get orders
export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        console.log(requestData)

        // Obtén los nombres de las columnas desde la primera fila
        const columns: string[] = requestData[0];

        // Obtén los datos desde las filas siguientes
        const dataRows: (string | number)[][] = requestData.slice(1);

        // Convierte los datos a objetos usando los nombres de las columnas
        const dataObjects = dataRows.map(row =>
            columns.reduce((acc, columnName, index) => {
                acc[columnName] = row[index];
                return acc;
            }, {} as Record<string, string | number>)
        );

        // Inserta los datos en la base de datos
        const result = await Promise.all(
            dataObjects.map(dataObject =>
                pool.query('INSERT INTO orders SET ?', dataObject)
            )
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error inserting data:', error);
    
        // Verificar si error no es nulo, es un objeto, y tiene la propiedad 'code' con valor 'ER_DUP_ENTRY'
        if (error?.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'El no_guia ya existe. No se permiten duplicados.' }, { status: 400 });
        }
    
        return NextResponse.json({ error: 'Error handling POST request' }, { status: 500 });
    }
    
}

