import {Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Books')
export class Books{
    @PrimaryGeneratedColumn()
    BookId: number;

    @Column()
    Title: string;

    @Column()
    Author: string;

    @Column()
    Price: number;

    @Column()
    Stock: number;

    @Column()
    Images: string;

    @Column()
    IsDelete: boolean;
}