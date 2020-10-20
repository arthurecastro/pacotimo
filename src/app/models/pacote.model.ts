import { Voo } from './voo.model';
import { Hotel } from './hotel.model';
import { Iata } from './iata.model';

export class Pacote {
    hotel: Hotel;
    voo: Voo;
    preco: number;
    data: Date;
    imagem: String;
    cidade: String;
}