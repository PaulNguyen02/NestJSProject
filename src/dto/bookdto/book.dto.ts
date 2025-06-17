import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
export class ImportBookDTO{
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    Title: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    Author: string;
    
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(1000)
    Price: number;
    
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    Stock: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    Images: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    IsDelete: boolean;

}

export class ExportBookDTO{

    @ApiProperty()
    @Expose({ name: 'BookId' })
    BookId: number;
    
    @ApiProperty()
    @Expose({ name: 'Title' })
    Title: string;
    
    @ApiProperty()
    @Expose({ name: 'Author' })
    Author: string;
    
    @ApiProperty()
    @Expose({ name: 'Price' })
    Price: number;
    
    @ApiProperty()
    @Expose({ name: 'Stock' })
    Stock: number;

    @ApiProperty()
    @Expose({ name: 'Images' })
    Images: string;

}