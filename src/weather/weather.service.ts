import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForecastDto } from './dto';
import { Errors } from 'src/common';
import { AmadeusService } from 'src/amadeus/amadeus.service';

@Injectable()
export class WeatherService {
    private WEATHERAPI_KEY = process.env.WEATHERAPI_KEY
    private WEATHER_BASE_URL = `http://api.weatherapi.com/v1/forecast.json?key=${this.WEATHERAPI_KEY}`
    constructor(private prisma: PrismaService, private amadeusService: AmadeusService) { }

    async addLocation(location: string, userEmail: string) {
        const cityName = await this.amadeusService.searchCity(location)

        console.log("Data: ", cityName);

        const loc = await this.prisma.weatherLocations.findUnique({
            where: {
                cityName: cityName
            }
        })

        const rel = await this.prisma.hasLocation.findUnique({
            where: {
                userEmail_cityName: {
                    userEmail: userEmail,
                    cityName: cityName
                }
            }
        })

        if (loc && rel) return cityName

        if (!loc) {
            await this.prisma.weatherLocations.create({
                data: {
                    cityName: cityName
                }
            })
        }

        if (!rel) {
            await this.prisma.hasLocation.create({
                data: {
                    userEmail: userEmail,
                    cityName: cityName
                }
            })
        }

        return cityName
    }

    async removeLocation(location: string, userEmail: string) {
        const loc = await this.prisma.weatherLocations.findUnique({
            where: {
                cityName: location
            }
        })

        const rel = await this.prisma.hasLocation.findUnique({
            where: {
                userEmail_cityName: {
                    userEmail: userEmail,
                    cityName: location
                }
            }
        })

        if (!loc) throw new NotFoundException(Errors.CITY_NOT_FOUND)
        if (!rel) throw new NotFoundException(Errors.HAS_LOCATION_NOT_FOUND)

        await this.prisma.hasLocation.delete({
            where: {
                userEmail_cityName: {
                    userEmail: userEmail,
                    cityName: location
                }
            }
        })

        return location
    }

    async getLocation(userEmail: string, name: string | undefined) {
        if (name) {
            const city = await this.prisma.hasLocation.findUnique({
                where: {
                    userEmail_cityName: {
                        userEmail: userEmail,
                        cityName: name
                    }
                }
            })

            if (!city) { throw new NotFoundException(Errors.CITY_NOT_FOUND) }

            return city
        } else {
            const rel = await this.prisma.hasLocation.findMany({
                where: {
                    userEmail: userEmail
                }
            })

            if (rel.length == 0) { throw new NotFoundException(Errors.CITY_NOT_FOUND) }

            return rel.map((r) => r.cityName)
        }
    }

    async getClimateData(name: string, time: Date, userEmail: string): Promise<ForecastDto> {
        // const name = location.toLowerCase().replaceAll(' ', '')
        const l = await this.getLocation(name, userEmail)

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