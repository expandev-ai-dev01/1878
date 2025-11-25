/**
 * @summary
 * Creates a new expense record with validation of amount, date, category,
 * and optional description. Validates that amount is positive and category exists.
 *
 * @procedure spExpenseCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/expense
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier who is creating the expense
 *
 * @param {NUMERIC(18,6)} amount
 *   - Required: Yes
 *   - Description: Expense amount (must be positive)
 *
 * @param {DATE} expenseDate
 *   - Required: Yes
 *   - Description: Date when expense occurred or will occur
 *
 * @param {NVARCHAR(100)} description
 *   - Required: No
 *   - Description: Optional description of the expense
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier for expense classification
 *
 * @returns {INT} idExpense - Created expense identifier
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Valid creation with optional description
 * - Validation failure for negative amount
 * - Validation failure for zero amount
 * - Validation failure for non-existent category
 * - Validation failure for missing required parameters
 */
CREATE OR ALTER PROCEDURE [functional].[spExpenseCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @amount NUMERIC(18, 6),
  @expenseDate DATE,
  @description NVARCHAR(100) = NULL,
  @idCategory INTEGER
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

  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF (@amount IS NULL)
  BEGIN
    ;THROW 51000, 'amountRequired', 1;
  END;

  IF (@expenseDate IS NULL)
  BEGIN
    ;THROW 51000, 'expenseDateRequired', 1;
  END;

  IF (@idCategory IS NULL)
  BEGIN
    ;THROW 51000, 'categoryRequired', 1;
  END;

  /**
   * @validation Validate amount is positive
   * @throw {amountMustBePositive}
   */
  IF (@amount <= 0)
  BEGIN
    ;THROW 51000, 'amountMustBePositive', 1;
  END;

  /**
   * @validation Validate description length
   * @throw {descriptionTooLong}
   */
  IF (LEN(@description) > 100)
  BEGIN
    ;THROW 51000, 'descriptionTooLong', 1;
  END;

  /**
   * @validation Validate category exists and belongs to account
   * @throw {categoryDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'categoryDoesntExist', 1;
  END;

  BEGIN TRY
    /**
     * @rule {fn-expense-create} Create new expense record
     */
    BEGIN TRAN;

      INSERT INTO [functional].[expense] (
        [idAccount],
        [idUser],
        [idCategory],
        [amount],
        [expenseDate],
        [description],
        [dateCreated],
        [dateModified]
      )
      VALUES (
        @idAccount,
        @idUser,
        @idCategory,
        @amount,
        @expenseDate,
        @description,
        GETUTCDATE(),
        GETUTCDATE()
      );

      /**
       * @output {ExpenseCreated, 1, 1}
       * @column {INT} idExpense
       * - Description: Created expense identifier
       */
      SELECT SCOPE_IDENTITY() AS [idExpense];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO