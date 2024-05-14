import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.query.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) {}

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto){
        return this.coffeesService.findAll(paginationQuery)
    }

    @Get(':id')
    findOne(@Param('id') id: number){
        return this.coffeesService.findOne('' + id)
    }

    @Post()
    create(@Body() createCoffeDto: CreateCoffeeDto){
        console.log(createCoffeDto instanceof CreateCoffeeDto)
        return this.coffeesService.create(createCoffeDto)
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto){
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    remove(@Param('id') id: number){
        return this.coffeesService.remove('' + id)
    }

    @Post('/recommendCoffee')
    recommendCoffee(@Body() body:any) {
        return this.coffeesService.recommendCoffee(body.id)
    }
}
