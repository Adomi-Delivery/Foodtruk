import { pool } from "@/config/db";
import { NextResponse } from 'next/server'
import { RowDataPacket, FieldPacket } from 'mysql2';


// Get order by no_guia
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/'); // Dividir el pathname en partes
    const order = pathParts[pathParts.length - 1]; // Obtener el último elemento como el orderId
    const [result] = await pool.query('SELECT * FROM orders WHERE no_guia = ?', [order]) as [RowDataPacket[], FieldPacket[]];

    return NextResponse.json({ result: result[0] });
} catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

// edit status by id
export async function PUT(request: Request) {
 
    const { id, status } = await request.json();
  
    const result = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  
    console.log(result);
    return NextResponse.json({ result })
}

  
// delete order by id
export async function DELETE(request: Request) {
    const { id } = await request.json();
    
    const result = await pool.query ('DELETE FROM orders WHERE id = ?',[id])
    
    return NextResponse.json({ result })
}