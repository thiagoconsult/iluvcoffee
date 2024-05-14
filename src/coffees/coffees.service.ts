import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { Coffee } from './entities/coffee.entitie';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entitie';
import { Event } from './entities/event-coffee.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination.query.dto';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        private readonly dataSource: DataSource
    ){}

    findAll(paginationQueryDto: PaginationQueryDto){
        const {limit, offset} = paginationQueryDto;
        return this.coffeRepository.find({
            relations: {flavors:true},
            skip: offset,
            take: limit
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

    async recommendCoffee(id: number){
        const coffee = await this.coffeRepository.findOne({where: {id:id}})
        if(!coffee) {
            throw new NotFoundException()
        }

        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            coffee.recommended++;

            const eventRecommended = new Event()
            eventRecommended.name = 'recommended_coffee';
            eventRecommended.type = 'coffee';
            eventRecommended.payload = {coffeeId: coffee.id}

            await queryRunner.manager.save(coffee)
            await queryRunner.manager.save(eventRecommended)

            await queryRunner.commitTransaction()
            return {message: 'It`s ok, tks'}
        } catch (error) {
            queryRunner.rollbackTransaction()
        } finally {
            queryRunner.release()
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor>{
        name = name.substring(0,1).toUpperCase() + name.substring(1, name.length).toLocaleLowerCase()
        const existingFlavor = await this.flavorRepository.findOne({where: {name}})
        if(existingFlavor){
            return existingFlavor
        }
        return this.flavorRepository.create({name})
    }
}
