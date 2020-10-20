import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from './models/hotel.model';
import { Voo } from './models/voo.model';
import { Iata } from './models/iata.model';

@Injectable({
	providedIn: 'root'
})
export class AppService {
	api = "https://5f637566363f0000162d8b16.mockapi.io/milhas321/api/v1/"
	constructor(
		public http: HttpClient
	) { }

	getHoteis(): Observable<Hotel[]> {
		return this.http.get<Hotel[]>(this.api + "hotels")
	}

	getVoos(): Observable<Voo[]> {
		return this.http.get<Voo[]>(this.api + "flights")
	}

	getIatas(): Observable<Iata[]> {
		return this.http.get<Iata[]>(this.api + "iataCodes")
	}

	getHoteisPorDestino(destino): Observable<Hotel[]> {
		return this.http.get<Hotel[]>(this.api + "hotels?iata=" + destino);
	}

	getVoosPorDataDestino(inboundDate, arrivalAirport): Observable<Voo[]> {
		console.log("inboundDate", inboundDate)
		console.log("arrivalAirport", arrivalAirport)
		let url = "flights?inboundDate=" + inboundDate + "&arrivalAirport=" + arrivalAirport;
		return this.http.get<Voo[]>(this.api + url);
	}
}
