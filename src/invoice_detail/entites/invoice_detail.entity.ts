import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('Invoice_Detail')
export class Invoice_Detail{
    @PrimaryGeneratedColumn()
    InvoiceDetailId: number;

    @Column()
    InvoiceId: number;

    @Column()
    BookId: number;

    @Column()
    Quantity: number;

    @Column()
    UnitPrice: number;
}