import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { JwtPayLoad } from 'src/common/model';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
    constructor(private weatherService: WeatherService) { }

    @Post('city')
    @ApiOperation({ summary: 'Create a new location for weather tracking' })
    @ApiQuery({ name: 'name', type: String, required: true, description: 'The name of the city', default: 'Ho Chi Minh' })
    async addLocation(@Query('name') name: string, @GetUser() user: JwtPayLoad) {
        return await this.weatherService.addLocation(name, user.sub);
    }

    @Delete('city')
    @ApiOperation({ summary: 'Deleta a location' })
    @ApiQuery({ name: 'name', type: String, required: true, description: 'The name of the city', default: 'Ho Chi Minh' })
    async removeLocation(@Query('name') name: string, @GetUser() user: JwtPayLoad) {
        return await this.weatherService.removeLocation(name, user.sub);
    }

    @Get('cities')
    @ApiOperation({ summary: 'Get the name of a specific location or all of locations' })
    @ApiQuery({ name: 'name', type: String, required: false, description: 'The name of the city (can be None)', default: 'Ho Chi Minh' })
    async getLocation(@GetUser() user: JwtPayLoad, @Query('name') name?: string) {
        return await this.weatherService.getLocation(user.sub, name);
    }

    @Get()
    @ApiOperation({ summary: 'Get the current city of the user, if it does not exist, return null' })
    async getCurrentLocation(@GetUser() user: JwtPayLoad) {
        return await this.weatherService.getCurrentLocation(user.sub);
    }

    @Get('forecast')
    @ApiOperation({ summary: 'Take the weather forecast' })
    @ApiQuery({ name: 'location', type: String, description: 'The name of the city you want to take the data', default: 'Ho Chi Minh City', required: true })
    @ApiQuery({ name: 'time', description: 'The current time when you are taking the data', type: Date, required: true, default: new Date() })
    async getWeatherForecast(@Query('location') location: string, @Query('time') time: Date, @GetUser() user: JwtPayLoad) {
        return await this.weatherService.getClimateData(location, time, user.sub);
    }
}
