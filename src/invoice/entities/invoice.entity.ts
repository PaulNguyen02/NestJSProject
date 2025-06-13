import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('Invoice')
export class Invoice{
    @PrimaryGeneratedColumn()
    InvoiceId: number;

    @Column()
    UserId: number;

    @Column()
    InvoiceDate: string;
}