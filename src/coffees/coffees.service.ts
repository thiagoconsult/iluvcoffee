import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entitie';

@Injectable()
export class CoffeesService {
    private coffees: Coffee [] = [
        {
            id: 1,
            name: "Shipwreck Roast",
            brand: "Buddy Brew",
            flavors: ['Vanilla', 'Chocolate']
        }
    ]

    getAll(){
        if(this.coffees.length === 0){
            throw new NotFoundException(`No coffee found`)
        }
        return this.coffees;
    }

    findOne(id: string){
        const coffee = this.coffees.find(item=> item.id === +id);
        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }

    create(createCoffeeDto: any){
        return this.coffees.push(createCoffeeDto);
    }

    update(id: string, updateCoffeeDto: any){
        const existingCoffee = this.findOne(id)
        if(existingCoffee){
            //
        }
    }

    remove(id: string){
        const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
        if(coffeeIndex >= 0){
            this.coffees.splice(coffeeIndex, 1)
            return {message: `Coffee deleted.`};
        }
        throw new NotFoundException(`Coffe #${id} not found`)
    }
}
