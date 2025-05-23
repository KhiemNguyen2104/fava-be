import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WeatherService {
    private WEATHERAPI_KEY = process.env.WEATHERAPI_KEY
    constructor(private prisma: PrismaService) {}

    async addLocation(location: string) {
        const loc = await this.prisma.weatherLocations.findUnique({
            where: {
                cityName: location
            }
        })

        if (loc) return;

        await this.prisma.weatherLocations.create({
            data: {
                cityName: location
            }
        })

        return
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

    
}
