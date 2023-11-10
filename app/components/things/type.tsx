export interface Result{
    id: number;
    no_guia: number;
    client: string;
    status: number;
    description: string;
    destination_city: string;
    destination_address: string;
    deadline: number;
    otros: string;
    orderData: DataType | null;  
}

export interface DataType {
  result : Result
}

export interface order {
  id: number;
  no_guia: number;
  client: string;
  status: number;
  description: string;
  destination_city: string;
  destination_address: string;
  deadline: number;
  otros: string;
  orderData: DataType | null;  
}


