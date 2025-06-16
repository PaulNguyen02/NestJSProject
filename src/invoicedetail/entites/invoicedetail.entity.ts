import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { Invoice } from "src/invoice/entities/invoice.entity";
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

    @ManyToOne(() => Invoice, invoice => invoice.details)
    @JoinColumn({ name: 'InvoiceId' }) // 👈 gắn FK
    invoice: Invoice;
}