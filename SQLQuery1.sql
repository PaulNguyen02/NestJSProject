CREATE DATABASE BookStoreDB;
GO

USE BookStoreDB;
GO

-- B?ng ng??i d�ng
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    UserName VARCHAR(100), 
    FullName NVARCHAR(100),
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    Roles BIT
);

-- B?ng s�ch
CREATE TABLE Books (
    BookID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200),
    Author NVARCHAR(100),
    Price DECIMAL(10, 2),
    Stock INT,
    IsDelete BIT
);

-- B?ng h�a ??n
CREATE TABLE Invoice (
    InvoiceID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    InvoiceDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- B?ng chi ti?t h�a ??n
CREATE TABLE Invoice_Detail (
    InvoiceDetailID INT PRIMARY KEY IDENTITY(1,1),
    InvoiceID INT,
    BookID INT,
    Quantity INT,
    UnitPrice DECIMAL(10,2),
    FOREIGN KEY (InvoiceID) REFERENCES Invoice(InvoiceID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

INSERT INTO Users (UserName, FullName, Email, Phone, Roles) VALUES
('VanA', N'Nguyễn Văn A', 'a@example.com', '0123456789',0),
('ThiB',N'Trần Thị B', 'b@example.com', '0987654321',0);

-- Th�m s�ch
INSERT INTO Books (Title, Author, Price, Stock, IsDelete) VALUES
(N'Lập trình C++ cơ bản', N'Nguyễn Nhật', 120000, 10,0),
(N'Java t? A đến Z', N'Trần Minh', 150000, 5,0),
(N'Học Python trong 21 ngày', N'Võ Thanh', 180000,8,0);

-- T?o h�a ??n
INSERT INTO Invoice (UserID) VALUES
(1), -- Hóa đơn của Nguyễn Văn A
(2); -- Hóa đơn của Trần Thị B

-- Chi ti?t h�a ??n
INSERT INTO Invoice_Detail (InvoiceID, BookID, Quantity, UnitPrice) VALUES
(1, 1, 2, 120000), -- Mua 2 cu?n C++
(1, 3, 1, 180000), -- Mua 1 cu?n Python
(2, 2, 1, 150000); -- Mua 1 cu?n Java