import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class ForecastDto {
    @IsObject()
    @IsNotEmpty()
    current: {
        last_updated: string,
        temp_c: number,
        is_day: number,
        wind_mph: number,
        wind_degree: number,
        humidity: number,
        cloud: number,
        feelslike_c: number,
        uv: number,
        gust_mph: number
    }

    @IsObject()
    @IsNotEmpty()
    forecast: {
        forecastday: [{
            date: string,
            date_epoch: number,
            day: {
                maxtemp_c: number,
                mintemp_c: number,
                avgtemp_c: number,
                maxwind_mph: number,
                totalprecip_mm: number,
                avghumidity: number,
                daily_will_it_rain: number,
                daily_chance_of_rain: number,
                uv: number
            },
            hour: [{
                time: string,
                temp_c: number,
                is_day: number,
                wind_mph: number,
                humidity: number,
                cloud: number,
                feelslike_c: number,
                uv: number,
                gust_mph: number,
                will_it_rain: number,
                chance_of_rain: number,
                will_it_snow: number,
                chance_of_snow: number,
            }]
        }]
    }
}