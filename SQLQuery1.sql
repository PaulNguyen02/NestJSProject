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
    Pass VARCHAR(255),
    ResetPasswordToken VARCHAR(255),
    ResetPasswordExpires DATETIME,
    Roles BIT
);


CREATE TABLE Books (
    BookID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200),
    Author NVARCHAR(100),
    Price DECIMAL(10, 2),
    Stock INT,
    Images VARCHAR(255),
    IsDelete BIT
);


CREATE TABLE Invoice (
    InvoiceID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    InvoiceDate DATETIME DEFAULT GETDATE(),
    Total DECIMAL(10,2),
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

INSERT INTO Users (UserName, FullName, Email, Phone, Pass ,Roles) VALUES
('VanA', N'Nguyễn Văn A', 'a@example.com', '0123456789','12345678',0),
('ThiB',N'Trần Thị B', 'b@example.com', '0987654321','12345678',0);

-- Th�m s�ch
INSERT INTO Books (Title, Author, Price, Stock, Images, IsDelete) VALUES
(N'Lập trình C++ cơ bản', N'Nguyễn Nhật', 120000, 10,'https://images.nxbbachkhoa.vn/Picture/2023/10/20/image-20231020183611259.jpg',0),
(N'Java t? A đến Z', N'Trần Minh', 150000, 5,'https://images.nxbxaydung.com.vn/Picture/2020/biasachnen-0616154230.png',0),
(N'Học Python trong 21 ngày', N'Võ Thanh', 180000,8,'https://cole.edu.vn/wp-content/uploads/2022/11/sach-hoc-lap-trinh-python.jpg',0);
