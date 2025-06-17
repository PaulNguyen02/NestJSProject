class Calculator{

    ReduceBook(stock: number, quantity: number): number{
        return stock - quantity;
    }

    BookTotal(quantity: number, unitprice: number ): number{
        return quantity * unitprice;
    }

}
export const calculator = new Calculator();