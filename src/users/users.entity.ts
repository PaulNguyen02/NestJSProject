import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('Users')
export class Users{
    @PrimaryGeneratedColumn()
    UserId: number;

    @Column()
    UserName: string;

    @Column()
    Fullname: string;

    @Column()
    Email: string;

    @Column()
    Phone: string;

    @Column()
    Roles: boolean;
}