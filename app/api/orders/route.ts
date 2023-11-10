import { pool } from '@/config/db'
import { NextResponse } from 'next/server'


// Get orders
export async function GET(request: Request) {

    const [result] = await pool.query('SELECT * FROM orders')
    
    return NextResponse.json({ result  })

}

// Delete all orders
export async function DELETE(request: Request) {
    try {
        const deleteResult = await pool.query('DELETE FROM orders');

        return NextResponse.json({ success: true, message: 'Todos los datos han sido eliminados correctamente.' });
    } catch (error) {
        console.error('Error deleting data:', error);
        return NextResponse.json({ error: 'Error al eliminar datos.' }, { status: 500 });
    }
}
