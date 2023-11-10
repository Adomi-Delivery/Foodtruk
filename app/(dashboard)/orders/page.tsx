'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, Pagination  } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { order } from '@/app/components/things/type';

import * as XLSX from 'xlsx';
import axios from 'axios';
import Link from 'next/link';
import dayjs from 'dayjs';



export default function FormOrder() {

    // ___________________________________________________________________________________________________________________________
    const [orders, setOrders] = useState<order[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1); // Estado para controlar la página actual
    const itemsPerPage = 20;
  // ___________________________________________________________________________________________________________________________
  // Función para obtener los datos desde la API
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data.result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]); 
  // ___________________________________________________________________________________________________________________
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
  // ___________________________________________________________________________________________________________________
    // delete orders
    const DeleteOrder = async () => {
        try {
            const response = await axios.delete('/api/orders');
            fetchData();
            console.log(response.data);
        } catch (error) {
            console.error('Error al eliminar datos:', error);
        }
    }

  // ___________________________________________________________________________________________________________________
  // convert excel
    const insertDataIntoDB = (data: order[]) => {
        fetch('/api/excel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            // Manejar la respuesta del servidor (éxito o error)
            console.log('Datos importados con éxito:', result);
        })
        .catch(error => {
            // Manejar errores de la solicitud
            console.error('Error al importar datos:', error);
        });
        
    };


    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
    
        if (file) {
            const reader = new FileReader();
    
            reader.onload = async (event: ProgressEvent<FileReader>) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                
                // Asegurémonos de que sheet_to_json devuelva un array de tipo 'order'
                const importedData: order[] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as order[];
    
                // Aquí tendrás los datos importados en 'importedData'.
                // Ahora puedes enviarlos a la base de datos.
                await insertDataIntoDB(importedData);
                
                fetchData();
            };
    
            reader.readAsArrayBuffer(file);
        }
    };
    

    const importData = () => {
        // Puedes abrir un cuadro de diálogo para seleccionar el archivo
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls';
        input.onchange = (e) => handleFileUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
        input.click();
    };
    // ___________________________________________________________________________________________________________________

    // status number to text
    interface StatusMap {
        [key: number]: string;
    }

    const statusMap: StatusMap = {
        1: 'Recibido',
        2: 'En Transito País Origen',
        3: 'Revision de Aduanas',
        4: 'Novedad, reajuste',
        5: 'Novedad, cambio de modalidad',
        6: 'Novedad, otros',
        7: 'En transito país destino',
        8: 'Entregado',
    };
  
  // ___________________________________________________________________________________________________________________

  // action button satus

    const handleButtonClick = async (record: order) => {
        try {
            const id = record.id;
            const status = record.status + 1;
            const response = await axios.put(`/api/orders/${id}`, {status, id});
            console.log(response)
            fetchData();
        } catch (error) {
            console.error('Error al actualizar:', error);
        }
    };

  // ___________________________________________________________________________________________________________________

    const DeleteButton = async (record: order) => {
        try {
            console.log (record)
            const id = record.id;    
            const response = await axios.delete(`/api/orders/${id}`, {data: record});
            console.log(response)
            fetchData();

        } catch (error) {
            console.error(error)
        }
    };

  // Columns
    const columns: ColumnsType<order> = [
        {
            title: 'Número de Orden',
            dataIndex: 'no_guia',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Cliente',
            dataIndex: 'client',
        },
        {
            title: 'Descripcion',
            dataIndex: 'description',
        },
        {
            title: 'Ciu. Destino',
            dataIndex: 'destination_city',
        },
        {
            title: 'Dir. Destino',
            dataIndex: 'destination_address',
        },
        {
            title: 'Fecha limite',
            dataIndex: 'deadline',
            render: (deadline) => {
              // Formatear la fecha utilizando dayjs
              return dayjs(deadline).format('YYYY-MM-DD');
            },
          },
        {
            title: 'Estado',
            dataIndex: 'status',
            sorter: (a, b) => a.status - b.status,
            render: (status) => statusMap[status] || 'Desconocido',
        },
        // {
        //     title: 'Acciones',
        //     render: (_, record) => (
        //         <>
        //             {record.status !== 3 ? (
        //                 <>
        //                     <Button onClick={() => handleButtonClick(record)} className="mr-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Estado</Button>
        //                 </>
        //             ) : (
        //                 <span className="mr-1 bg-green-800  text-white font-bold py-2 px-4 rounded">Finalizado</span>
        //             )}
        //             <Button onClick={() => DeleteButton(record)} className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Borrar</Button>
        //         </>
        //     ),
        // }
    ];
  // ___________________________________________________________________________________________________________________
    const onChange: TableProps<order>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
  // ___________________________________________________________________________________________________________________
    return (
        <>
            <div className="flex justify-center">
                <button className="bg-green-500 text-black py-2 px-4 rounded" onClick={importData}>
                    Importar Ordenes
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={DeleteOrder}>
                    Eliminar Ordenes
                </button>
            </div>

            <Table 
                columns={columns} 
                dataSource={orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} 
                onChange={onChange} 
                pagination={false} 
            />
            <Pagination
                current={currentPage}
                onChange={handlePageChange}
                total={orders.length}
                pageSize={itemsPerPage} // Configura el tamaño de página
                style={{ marginTop: '16px', textAlign: 'center' }}
            />
        </>
    );
}