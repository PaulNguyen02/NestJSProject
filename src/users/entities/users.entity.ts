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
    Pass: string;

    @Column()
    Roles: boolean;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column({ type: 'timestamp', nullable: true })
    resetPasswordExpires: Date | null;
}