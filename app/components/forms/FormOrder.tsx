'use client';
import React, { useState, useEffect } from 'react';
import { DataType, Result } from '@/app/components/things/type';

import axios from 'axios';
import dayjs from 'dayjs';

export default function FormOrder() {
    const [inputValue, setInputValue] = useState('');
    const [orderData, setOrderData] = useState<Result | null>(null);

    // ___________________________________________________________________________________________________________________
    // getorder by no_guia
    const handleButtonClick = async () => {
        try {
            const response = await axios.get<DataType>(`/api/orders/${inputValue}`);
            setOrderData(response.data.result);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    useEffect(() => {
        console.log(orderData);
    }, [orderData]);
    // ___________________________________________________________________________________________________________________

    // status number to text
    
    const statusText: { [key: number]: string } = {
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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">

    <>
        <div className="flex items-center mb-4">
            <img src="/images/banner1.jpg" alt="Logo" width="350" height="auto" />
            <div className="flex flex-col items-center ml-4">
                <p className="text-lg text-black">Consulta tu envío</p>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ingresa número de guía"
                    className="mb-2 text-black border border-black rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <button onClick={handleButtonClick} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Buscar
                </button>
            </div>
        </div>

        {orderData && (
            <div id="table_order" className="text-center">
                <table className="border border-black p-2 w-full">
                    <thead>
                        <tr>
                            <th colSpan={2} className="font-bold text-xl text-black" style={{ fontSize: '24px' }}>
                                # de Orden: {orderData?.no_guia}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th className="font-bold text-xl text-black">Cliente</th>
                            <td className="text-lg text-black">{orderData?.client}</td>
                        </tr>
                        <tr>
                            <th className="font-bold text-xl text-black">Descripción</th>
                            <td className="text-lg text-black">{orderData?.description}</td>
                        </tr>
                        <tr>
                            <th className="font-bold text-xl text-black">Fecha limite</th>
                            <td className="text-lg text-black">
                                {orderData ? dayjs(orderData.deadline).format('YYYY-MM-DD') : 'N/A'}
                            </td>
                        </tr>
                        <tr>
                            <th className="font-bold text-xl text-black">Estado</th>
                            <td className="text-lg text-black">
                                {orderData ? statusText[orderData.status] : 'N/A'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )}
    </>
</div>


    );
}
