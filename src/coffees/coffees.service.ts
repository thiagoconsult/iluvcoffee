import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entitie';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entitie';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>
    ){}

    getAll(){
        return this.coffeRepository.find({
            relations: {flavors:true}
        })
    }

    async findOne(id: string){
        const coffee = await this.coffeRepository.findOne({
            where: {id: +id},
            relations: {flavors: true}
        })
        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return coffee
    }

    async create(createCoffeeDto: CreateCoffeeDto){
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name=> this.preloadFlavorByName(name))
        ) 
        const coffee = this.coffeRepository.create({
            ...createCoffeeDto,
            flavors
        })
        return this.coffeRepository.save(coffee);
    }

    async update(id: number, updateCoffeeDto: UpdateCoffeeDto){
        const flavors = updateCoffeeDto.flavors && (await Promise.all(
            updateCoffeeDto.flavors.map(name=> this.preloadFlavorByName(name))
        ))
        const coffee = await this.coffeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        })
        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return this.coffeRepository.save(coffee);
    }

    async remove(id: string){
        const coffee = await this.findOne(id)
        return this.coffeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string){
        name = name.substring(0,1).toUpperCase() + name.substring(1, name.length).toLocaleLowerCase()
        const flavor = await this.flavorRepository.findOne({where: {name:name}})
        if(flavor){
            return flavor
        }
        return this.flavorRepository.save({name})
    }
}
