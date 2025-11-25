/**
 * @summary
 * Retrieves all expenses for a specific month grouped by category with totals.
 * Used for generating category-based expense charts and analysis.
 *
 * @procedure spExpenseListByMonth
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/expense-chart
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} year
 *   - Required: Yes
 *   - Description: Year for expense filtering
 *
 * @param {INT} month
 *   - Required: Yes
 *   - Description: Month for expense filtering (1-12)
 *
 * @testScenarios
 * - Valid retrieval with expenses in multiple categories
 * - Valid retrieval with no expenses (empty result)
 * - Valid retrieval with more than 10 categories
 * - Validation failure for invalid month (< 1 or > 12)
 * - Validation failure for missing required parameters
 */
CREATE OR ALTER PROCEDURE [functional].[spExpenseListByMonth]
  @idAccount INTEGER,
  @year INTEGER,
  @month INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameters
   * @throw {parameterRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@year IS NULL)
  BEGIN
    ;THROW 51000, 'yearRequired', 1;
  END;

  IF (@month IS NULL)
  BEGIN
    ;THROW 51000, 'monthRequired', 1;
  END;

  /**
   * @validation Validate month range
   * @throw {invalidMonth}
   */
  IF (@month < 1 OR @month > 12)
  BEGIN
    ;THROW 51000, 'invalidMonth', 1;
  END;

  /**
   * @rule {fn-expense-chart-data} Retrieve expenses grouped by category with totals
   */
  /**
   * @output {ExpensesByCategory, n, n}
   * @column {INT} idCategory
   * - Description: Category identifier
   * @column {NVARCHAR} categoryName
   * - Description: Category name
   * @column {NVARCHAR} categoryIcon
   * - Description: Category icon identifier
   * @column {NVARCHAR} categoryColor
   * - Description: Category hexadecimal color code
   * @column {NUMERIC} totalAmount
   * - Description: Total expense amount for category in the month
   * @column {INT} expenseCount
   * - Description: Number of expenses in category
   */
  SELECT
    [cat].[idCategory],
    [cat].[name] AS [categoryName],
    [cat].[icon] AS [categoryIcon],
    [cat].[color] AS [categoryColor],
    SUM([exp].[amount]) AS [totalAmount],
    COUNT([exp].[idExpense]) AS [expenseCount]
  FROM [functional].[category] [cat]
    JOIN [functional].[expense] [exp] ON ([exp].[idAccount] = [cat].[idAccount] AND [exp].[idCategory] = [cat].[idCategory])
  WHERE [cat].[idAccount] = @idAccount
    AND [cat].[deleted] = 0
    AND [exp].[deleted] = 0
    AND YEAR([exp].[expenseDate]) = @year
    AND MONTH([exp].[expenseDate]) = @month
  GROUP BY
    [cat].[idCategory],
    [cat].[name],
    [cat].[icon],
    [cat].[color]
  ORDER BY
    SUM([exp].[amount]) DESC;
END;
GO