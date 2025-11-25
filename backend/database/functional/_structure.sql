/**
 * @schema functional
 * Business logic schema for Porquinho expense tracking system
 */
CREATE SCHEMA [functional];
GO

/**
 * @table expense Stores user expense records with amount, date, description and category
 * @multitenancy true
 * @softDelete true
 * @alias exp
 */
CREATE TABLE [functional].[expense] (
  [idExpense] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [idCategory] INTEGER NOT NULL,
  [amount] NUMERIC(18, 6) NOT NULL,
  [expenseDate] DATE NOT NULL,
  [description] NVARCHAR(100) NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table category Expense categories with support for predefined and custom types
 * @multitenancy true
 * @softDelete true
 * @alias cat
 */
CREATE TABLE [functional].[category] (
  [idCategory] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [name] NVARCHAR(30) NOT NULL,
  [icon] NVARCHAR(50) NOT NULL,
  [color] NVARCHAR(7) NOT NULL,
  [type] VARCHAR(20) NOT NULL,
  [edited] BIT NOT NULL DEFAULT (0),
  [originalName] NVARCHAR(30) NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkExpense
 * @keyType Object
 */
ALTER TABLE [functional].[expense]
ADD CONSTRAINT [pkExpense] PRIMARY KEY CLUSTERED ([idExpense]);
GO

/**
 * @primaryKey pkCategory
 * @keyType Object
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [pkCategory] PRIMARY KEY CLUSTERED ([idCategory]);
GO

/**
 * @foreignKey fkExpense_Category Expense must belong to valid category
 * @target functional.category
 */
ALTER TABLE [functional].[expense]
ADD CONSTRAINT [fkExpense_Category] FOREIGN KEY ([idCategory])
REFERENCES [functional].[category]([idCategory]);
GO

/**
 * @check chkExpense_Amount Amount must be positive
 */
ALTER TABLE [functional].[expense]
ADD CONSTRAINT [chkExpense_Amount] CHECK ([amount] > 0);
GO

/**
 * @check chkCategory_Type Category type must be predefined or custom
 * @enum {predefined} System predefined category
 * @enum {custom} User created custom category
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [chkCategory_Type] CHECK ([type] IN ('predefined', 'custom'));
GO

/**
 * @index ixExpense_Account Account isolation index
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixExpense_Account]
ON [functional].[expense]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixExpense_Account_Date Search by account and date
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixExpense_Account_Date]
ON [functional].[expense]([idAccount], [expenseDate])
INCLUDE ([amount], [idCategory])
WHERE [deleted] = 0;
GO

/**
 * @index ixExpense_Account_Category Search by account and category
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixExpense_Account_Category]
ON [functional].[expense]([idAccount], [idCategory])
INCLUDE ([amount], [expenseDate])
WHERE [deleted] = 0;
GO

/**
 * @index ixCategory_Account Account isolation index
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account]
ON [functional].[category]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index uqCategory_Account_Name Unique category name per account
 * @type Search
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqCategory_Account_Name]
ON [functional].[category]([idAccount], [name])
WHERE [deleted] = 0;
GO

/**
 * @index ixCategory_Account_Type Search by account and type
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account_Type]
ON [functional].[category]([idAccount], [type])
INCLUDE ([name], [icon], [color])
WHERE [deleted] = 0;
GO