import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "src/users/entities/users.entity";
import {Invoice_Detail} from 'src/invoicedetail/entites/invoicedetail.entity';
@Entity('Invoice')
export class Invoice{
    @PrimaryGeneratedColumn()
    InvoiceId: number;

    @Column()
    UserId: number;

    @Column()
    InvoiceDate: string;

    @OneToMany(() => Invoice_Detail, detail => detail.invoice, { cascade: true }) // 👈 cascade
    details: Invoice_Detail[];

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'UserId' })
    user: Users;
}