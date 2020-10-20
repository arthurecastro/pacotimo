import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Iata } from 'src/app/models/iata.model';
import { Voo } from 'src/app/models/voo.model';
import { Pacote } from '../../models/pacote.model';
import { Hotel } from 'src/app/models/hotel.model';
import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material';


import * as _moment from 'moment';

import {Moment} from 'moment';
// exports = moment
// index.ts file in our app
import * as moment from 'moment'
// const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
	selector: 'app-pacotes',
	templateUrl: './pacotes.component.html',
	styleUrls: ['./pacotes.component.css'],
	providers: [
		 // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
		provide: DateAdapter,
		useClass: MomentDateAdapter,
		deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
	  },
  
	  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
	],
})
export class PacotesComponent implements OnInit {
	pacote_form: FormGroup;
	iatas: Iata[] = [];
	pacote = new Pacote();
	exibirPacote: boolean = false;
	exibirErro: boolean = false;

	destino = new Iata();
	date = new FormControl(moment());

	constructor(
		public app_service: AppService,
		public formBuilder: FormBuilder,
		private ref: ChangeDetectorRef
	) {
		this.pacote_form = this.formBuilder.group({
			destino: ['', Validators.required],
			data: ['', Validators.required]
		})
	}

	ngOnInit() {
		this.buscarIatas();
	}

	buscarIatas() {
		this.app_service.getIatas().subscribe((retorno) => {
			this.iatas = retorno;
		})
	}

	buscarHoteisPorDestino() {
		this.app_service.getHoteisPorDestino(this.destino.id).subscribe((retorno) => {
			var menorPreco = new Hotel();
			for (let i in retorno) {
				if (retorno[i].pricePerNight < menorPreco.pricePerNight || menorPreco.pricePerNight == undefined) {
					menorPreco = retorno[i];
				}
			}
			this.pacote.hotel = menorPreco;
			this.pacote.imagem = this.destino.imageUrl;
			this.pacote.cidade = this.destino.city;
			this.exibirPacote = true;

		})
	}

	buscarVoosPorDataDestino() {
		this.exibirErro = false;
		let data = moment(this.date.value).unix();

		this.app_service.getVoosPorDataDestino(data, this.destino.id).subscribe((retorno) => {
			if (retorno.length > 0) {
				var menorPreco = new Voo();
				for (let i in retorno) {
					if (retorno[i].price < menorPreco.price || menorPreco.price == undefined) {
						menorPreco = retorno[i];
					}
				}
				this.pacote.voo = menorPreco;
				this.buscarHoteisPorDestino();
				this.converterNumberDate(this.pacote.voo.inboundDate);
			} else {
				this.exibirErro = true;
			}
		})
	}


	converterNumberDate(dataNumber: number) {
		this.pacote.data = new Date(dataNumber * 1000);
	}

	converterDateStringNumber(data: Date) {
		return new Date(data).getTime();
	}

	chosenYearHandler(normalizedYear: Moment) {
		const ctrlValue = this.date.value;
		ctrlValue.year(normalizedYear.year());
		this.date.setValue(ctrlValue);
	}

	chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
		const ctrlValue = this.date.value;
		ctrlValue.month(normalizedMonth.month());
		this.date.setValue(ctrlValue);
		datepicker.close();
	}
}
