import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entitie";

@Entity()
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    // @Column('json', {nullable: true})
    @JoinTable()
    @ManyToMany(
        type => Flavor,
        flavor => flavor.coffees,
    )
    flavors: Flavor[];
}