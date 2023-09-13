export interface FormularioViaje {
    name: string;
    surname: string;
    date_request: string;
    department: string;
    project_code: string;
    reason: string;
    departure_date: string;
    return_date: string;
    overnight: boolean;
    hotel: string;
    trip_origin: string;
    trip_destination: string;
    means_transport: string;
    if_car_km: number;
    amount: number;
}