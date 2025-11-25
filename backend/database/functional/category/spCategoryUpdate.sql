/**
 * @summary
 * Updates an existing category (predefined or custom) with new name, icon, and color.
 * Validates uniqueness of new name and marks predefined categories as edited when modified.
 *
 * @procedure spCategoryUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/category/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to update
 *
 * @param {NVARCHAR(30)} name
 *   - Required: Yes
 *   - Description: New category name (3-30 characters)
 *
 * @param {NVARCHAR(50)} icon
 *   - Required: Yes
 *   - Description: New icon identifier
 *
 * @param {NVARCHAR(7)} color
 *   - Required: Yes
 *   - Description: New hexadecimal color code
 *
 * @testScenarios
 * - Valid update of custom category
 * - Valid update of predefined category (marks as edited)
 * - Validation failure for non-existent category
 * - Validation failure for duplicate name
 * - Validation failure for invalid name format
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryUpdate]
  @idAccount INTEGER,
  @idCategory INTEGER,
  @name NVARCHAR(30),
  @icon NVARCHAR(50),
  @color NVARCHAR(7)
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

  IF (@name IS NULL OR LTRIM(RTRIM(@name)) = '')
  BEGIN
    ;THROW 51000, 'nameRequired', 1;
  END;

  IF (@icon IS NULL OR LTRIM(RTRIM(@icon)) = '')
  BEGIN
    ;THROW 51000, 'iconRequired', 1;
  END;

  IF (@color IS NULL OR LTRIM(RTRIM(@color)) = '')
  BEGIN
    ;THROW 51000, 'colorRequired', 1;
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
   * @validation Validate name length
   * @throw {nameTooShort, nameTooLong}
   */
  IF (LEN(LTRIM(RTRIM(@name))) < 3)
  BEGIN
    ;THROW 51000, 'nameTooShort', 1;
  END;

  IF (LEN(@name) > 30)
  BEGIN
    ;THROW 51000, 'nameTooLong', 1;
  END;

  /**
   * @validation Validate name contains only allowed characters
   * @throw {nameContainsInvalidCharacters}
   */
  IF (@name LIKE '%[^a-zA-Z0-9 -]%')
  BEGIN
    ;THROW 51000, 'nameContainsInvalidCharacters', 1;
  END;

  /**
   * @validation Validate name uniqueness (excluding current category)
   * @throw {categoryNameAlreadyExists}
   */
  IF EXISTS (
    SELECT *
    FROM [functional].[category] [cat]
    WHERE [cat].[idAccount] = @idAccount
      AND [cat].[idCategory] <> @idCategory
      AND LOWER(LTRIM(RTRIM([cat].[name]))) = LOWER(LTRIM(RTRIM(@name)))
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'categoryNameAlreadyExists', 1;
  END;

  BEGIN TRY
    /**
     * @rule {fn-category-update} Update category and mark predefined as edited
     */
    BEGIN TRAN;

      UPDATE [functional].[category]
      SET
        [name] = LTRIM(RTRIM(@name)),
        [icon] = @icon,
        [color] = @color,
        [edited] = CASE WHEN [type] = 'predefined' THEN 1 ELSE [edited] END,
        [dateModified] = GETUTCDATE()
      WHERE [idCategory] = @idCategory
        AND [idAccount] = @idAccount;

      /**
       * @output {CategoryUpdated, 1, 1}
       * @column {INT} idCategory
       * - Description: Updated category identifier
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