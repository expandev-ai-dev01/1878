/**
 * @summary
 * Restores a predefined category to its original name, icon, and color.
 * Only works for predefined categories that have been edited.
 *
 * @procedure spCategoryRestore
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/category/:id/restore
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to restore
 *
 * @testScenarios
 * - Valid restoration of edited predefined category
 * - Validation failure for non-predefined category
 * - Validation failure for non-edited category
 * - Validation failure for non-existent category
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryRestore]
  @idAccount INTEGER,
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
   * @validation Validate category is predefined
   * @throw {cannotRestoreCustomCategory}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[type] = 'predefined'
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'cannotRestoreCustomCategory', 1;
  END;

  /**
   * @validation Validate category has been edited
   * @throw {categoryNotEdited}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[edited] = 1
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'categoryNotEdited', 1;
  END;

  /**
   * @rule {fn-category-restore} Get original values based on category name pattern
   */
  DECLARE @originalName NVARCHAR(30);
  DECLARE @originalIcon NVARCHAR(50);
  DECLARE @originalColor NVARCHAR(7);

  SELECT @originalName = [cat].[originalName]
  FROM [functional].[category] [cat]
  WHERE [cat].[idCategory] = @idCategory
    AND [cat].[idAccount] = @idAccount;

  /**
   * @rule {fn-predefined-defaults} Map original predefined values
   */
  SELECT
    @originalName = CASE @originalName
      WHEN 'Alimentação' THEN 'Alimentação'
      WHEN 'Transporte' THEN 'Transporte'
      WHEN 'Lazer' THEN 'Lazer'
      WHEN 'Contas' THEN 'Contas'
      WHEN 'Saúde' THEN 'Saúde'
      WHEN 'Educação' THEN 'Educação'
      WHEN 'Compras' THEN 'Compras'
      WHEN 'Outros' THEN 'Outros'
    END,
    @originalIcon = CASE @originalName
      WHEN 'Alimentação' THEN 'utensils'
      WHEN 'Transporte' THEN 'car'
      WHEN 'Lazer' THEN 'ticket'
      WHEN 'Contas' THEN 'document'
      WHEN 'Saúde' THEN 'cross'
      WHEN 'Educação' THEN 'book'
      WHEN 'Compras' THEN 'bag'
      WHEN 'Outros' THEN 'dots'
    END,
    @originalColor = CASE @originalName
      WHEN 'Alimentação' THEN '#4CAF50'
      WHEN 'Transporte' THEN '#2196F3'
      WHEN 'Lazer' THEN '#9C27B0'
      WHEN 'Contas' THEN '#F44336'
      WHEN 'Saúde' THEN '#E91E63'
      WHEN 'Educação' THEN '#FFC107'
      WHEN 'Compras' THEN '#795548'
      WHEN 'Outros' THEN '#9E9E9E'
    END;

  BEGIN TRY
    /**
     * @rule {fn-category-restore-update} Restore category to original values
     */
    BEGIN TRAN;

      UPDATE [functional].[category]
      SET
        [name] = @originalName,
        [icon] = @originalIcon,
        [color] = @originalColor,
        [edited] = 0,
        [dateModified] = GETUTCDATE()
      WHERE [idCategory] = @idCategory
        AND [idAccount] = @idAccount;

      /**
       * @output {CategoryRestored, 1, 1}
       * @column {INT} idCategory
       * - Description: Restored category identifier
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