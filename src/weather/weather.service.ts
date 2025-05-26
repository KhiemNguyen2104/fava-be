import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForecastDto } from './dto';
import { Errors } from 'src/common';

@Injectable()
export class WeatherService {
    private WEATHERAPI_KEY = process.env.WEATHERAPI_KEY
    private WEATHER_BASE_URL = `http://api.weatherapi.com/v1/forecast.json?key=${this.WEATHERAPI_KEY}`
    constructor(private prisma: PrismaService) { }

    async addLocation(location: string) {
        const loc = await this.prisma.weatherLocations.findUnique({
            where: {
                cityName: location
            }
        })

        if (loc) return location;

        await this.prisma.weatherLocations.create({
            data: {
                cityName: location
            }
        })

        return location
    }

    async removeLocation(location: string) {
        const loc = await this.prisma.weatherLocations.findUnique({
            where: {
                cityName: location
            }
        })

        if (!loc) throw new ForbiddenException(Errors.CITY_NOT_FOUND)

        await this.prisma.weatherLocations.delete({
            where: {
                cityName: location
            }
        })

        return location
    }

    async getLocation(name: string | undefined) {
        if (name) {
            return await this.prisma.weatherLocations.findUnique({
                where: {
                    cityName: name
                }
            })
        } else {
            return await this.prisma.weatherLocations.findMany()
        }
    }

    async getClimateData(name: string, time: Date): Promise<ForecastDto> {
        // const name = location.toLowerCase().replaceAll(' ', '')
        const l = await this.getLocation(name)

        if (!l) throw new ForbiddenException(Errors.CITY_NOT_FOUND)

        const hour = new Date(time).getHours()
        const url = this.WEATHER_BASE_URL + `&q=${name}&hour=${hour}`

        console.log(`Location: ${name}`)
        console.log(`Hour: ${hour}`)

        const response = await axios.get(url)

        // console.log("Reponse: ", response.data)

        return response.data
    }

    // async getClimateData(name: string, time: Date) {
    //     // const name = location.toLowerCase().replaceAll(' ', '')
    //     const hour = new Date(time).getHours()
    //     const url = this.WEATHER_BASE_URL + `&q=${name}&hour=${hour}`

    //     console.log(`Location: ${name}`)
    //     console.log(`Hour: ${hour}`)

    //     // const response = await axios.get(url)

    //     // console.log("Reponse: ", response.data)

    //     // return response.data

    //     return 1
    // }

}