import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
    @Get()
    findAll(@Query() paginationQuery){
        const {limit, offset} = paginationQuery;
        return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return `This action returns #${id} coffee.`
    }

    @Post()
    create(@Body() Body){
        return Body;
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body){
        return `this action updates #${id} coffee.`
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return `this action removes #${id} coffee.`
    }
}
