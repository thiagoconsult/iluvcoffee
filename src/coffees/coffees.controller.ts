import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) {}

    @Get()
    findAll(@Query() paginationQuery){
        // const {limit, offset} = paginationQuery;
        // return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`
        return this.coffeesService.getAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        // return `This action returns #${id} coffee.`
        return this.coffeesService.findOne(id)
    }

    @Post()
    create(@Body() createCoffeDto: CreateCoffeeDto){
        // return Body;
        return this.coffeesService.create(createCoffeDto)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto){
        // return `this action updates #${id} coffee.`
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        // return `this action removes #${id} coffee.`
        return this.coffeesService.remove(id)
    }
}
