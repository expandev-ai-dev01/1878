/**
 * @summary
 * Deletes a custom category and reassigns all associated expenses to a substitute category.
 * Prevents deletion of predefined categories and validates substitute category.
 *
 * @procedure spCategoryDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/category/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to delete
 *
 * @param {INT} idSubstituteCategory
 *   - Required: No
 *   - Description: Category to reassign expenses to (required if expenses exist)
 *
 * @testScenarios
 * - Valid deletion of custom category without expenses
 * - Valid deletion with expense reassignment
 * - Validation failure for predefined category deletion
 * - Validation failure for non-existent category
 * - Validation failure for missing substitute when expenses exist
 * - Validation failure for invalid substitute category
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryDelete]
  @idAccount INTEGER,
  @idCategory INTEGER,
  @idSubstituteCategory INTEGER = NULL
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

  IF (@idCategory IS NULL)
  BEGIN
    ;THROW 51000, 'idCategoryRequired', 1;
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

  /**
   * @validation Validate category is custom (not predefined)
   * @throw {cannotDeletePredefinedCategory}
   */
  IF EXISTS (
    SELECT *
    FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[type] = 'predefined'
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'cannotDeletePredefinedCategory', 1;
  END;

  /**
   * @validation Check if expenses exist for this category
   */
  DECLARE @hasExpenses BIT = 0;
  
  IF EXISTS (
    SELECT *
    FROM [functional].[expense] [exp]
    WHERE [exp].[idCategory] = @idCategory
      AND [exp].[idAccount] = @idAccount
      AND [exp].[deleted] = 0
  )
  BEGIN
    SET @hasExpenses = 1;
  END;

  /**
   * @validation Validate substitute category when expenses exist
   * @throw {substituteCategoryRequired, substituteCategoryInvalid}
   */
  IF (@hasExpenses = 1)
  BEGIN
    IF (@idSubstituteCategory IS NULL)
    BEGIN
      ;THROW 51000, 'substituteCategoryRequired', 1;
    END;

    IF NOT EXISTS (
      SELECT *
      FROM [functional].[category] [cat]
      WHERE [cat].[idCategory] = @idSubstituteCategory
        AND [cat].[idAccount] = @idAccount
        AND [cat].[idCategory] <> @idCategory
        AND [cat].[deleted] = 0
    )
    BEGIN
      ;THROW 51000, 'substituteCategoryInvalid', 1;
    END;
  END;

  BEGIN TRY
    /**
     * @rule {fn-category-delete} Delete category and reassign expenses
     */
    BEGIN TRAN;

      /**
       * @rule {fn-expense-reassign} Reassign expenses to substitute category if needed
       */
      IF (@hasExpenses = 1)
      BEGIN
        UPDATE [functional].[expense]
        SET
          [idCategory] = @idSubstituteCategory,
          [dateModified] = GETUTCDATE()
        WHERE [idCategory] = @idCategory
          AND [idAccount] = @idAccount
          AND [deleted] = 0;
      END;

      /**
       * @rule {fn-category-soft-delete} Soft delete the category
       */
      UPDATE [functional].[category]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idCategory] = @idCategory
        AND [idAccount] = @idAccount;

      /**
       * @output {CategoryDeleted, 1, 1}
       * @column {INT} idCategory
       * - Description: Deleted category identifier
       */
      SELECT @idCategory AS [idCategory];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO