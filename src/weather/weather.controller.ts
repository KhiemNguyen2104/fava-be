import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
    constructor(private weatherService: WeatherService) { }

    @Post('city')
    @ApiOperation({ summary: 'Create a new location for weather tracking' })
    @ApiQuery({ name: 'name', type: String, required: true, description: 'The name of the city', default: 'Ho Chi Minh' })
    async addLocation(@Query('name') name: string) {
        console.log(name)
        return await this.weatherService.addLocation(name);
    }

    @Delete('city')
    @ApiOperation({ summary: 'Deleta a location' })
    @ApiQuery({ name: 'name', type: String, required: true, description: 'The name of the city', default: 'Ho Chi Minh' })
    async removeLocation(@Query('name') name: string) {
        console.log(name)
        return await this.weatherService.removeLocation(name);
    }

    @Get('cities')
    @ApiOperation({ summary: 'Get the name of a specific location or all of locations' })
    @ApiQuery({ name: 'name', type: String, description: 'The name of the city (can be None)', default: 'Ho Chi Minh' })
    async getLocation(@Query('name') name?: string) {
        return await this.weatherService.getLocation(name);
    }

    @Get('forecast')
    @ApiOperation({ summary: 'Take the weather forecast' })
    @ApiQuery({ name: 'location', type: String, description: 'The name of the city you want to take the data', default: 'Ho Chi Minh', required: true })
    @ApiQuery({ name: 'time', description: 'The current time when you are taking the data', type: Date, required: true, default: new Date() })
    async getWeatherForecast(@Query('location') location: string, @Query('time') time: Date) {
        return await this.weatherService.getClimateData(location, time);
    }
}
