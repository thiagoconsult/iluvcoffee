import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entitie';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
    // private coffees: Coffee [] = [
    //     {
    //         id: 1,
    //         name: "Shipwreck Roast",
    //         brand: "Buddy Brew",
    //         flavors: ['Vanilla', 'Chocolate']
    //     }
    // ]

    // private countId = 1;

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeRepository: Repository<Coffee>,
    ){}

    // genId (){
    //     this.countId ++;
    //     return this.countId;
    // }

    getAll(){
        return this.coffeRepository.find()
        // if(this.coffees.length === 0){
        //     throw new NotFoundException(`No coffee found`)
        // }
        // return this.coffees;
    }

    async findOne(id: string){
        const coffee = await this.coffeRepository.findOne({where: {id: +id}})
        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return coffee
        // const coffee = this.coffees.find(item=> item.id === +id);
        // if(!coffee){
        //     throw new NotFoundException(`Coffee #${id} not found`);
        // }
        // return coffee;
    }

    create(createCoffeeDto: CreateCoffeeDto){
        const coffee = this.coffeRepository.create(createCoffeeDto)
        return this.coffeRepository.save(coffee);
        // createCoffeeDto.id = this.genId()
        // this.coffees.push(createCoffeeDto);
        // return createCoffeeDto;
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto){
        const coffee = await this.coffeRepository.preload({
            id: +id,
            ...updateCoffeeDto
        })
        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return this.coffeRepository.save(coffee);
        // const existingCoffee = this.findOne(id)
        // if(existingCoffee){
        //     //
        // }
    }

    async remove(id: string){
        const coffee = await this.findOne(id)
        return this.coffeRepository.remove(coffee);
    //     const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
    //     if(coffeeIndex >= 0){
    //         this.coffees.splice(coffeeIndex, 1)
    //         return {message: `Coffee deleted.`};
    //     }
    //     throw new NotFoundException(`Coffe #${id} not found`)
    }
}
