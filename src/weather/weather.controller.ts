import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
    constructor(private weatherService: WeatherService) {}

    @Post()
    @ApiOperation({summary: 'Create a new location for weather tracking'})
    @ApiParam({name: 'name', type: String, required: true, description: 'The name of the city'})
    async addLocation(@Param('name') name: string) {
        return await this.weatherService.addLocation(name);
    }

    @Get()
    @ApiOperation({summary: 'Get the name of a specific location or all of locations'})
    @ApiParam({name: 'name', type: String, description: 'The name of the city (can be None)'})
    async getLocation(@Param('name') name?: string) {
        return await this.weatherService.getLocation(name);
    }
}
