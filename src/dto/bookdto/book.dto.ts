import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ImportBookDTO{
    
    @ApiProperty()
    Title: string;
    
    @ApiProperty()
    Author: string;
    
    @ApiProperty()
    Price: number;
    
    @ApiProperty()
    Stock: number;

    @ApiProperty()
    @Expose({ name: 'Images' })
    Images: string;

    @ApiProperty()
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