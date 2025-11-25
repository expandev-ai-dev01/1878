/**
 * @summary
 * Creates a new custom category with name, icon, and color.
 * Validates uniqueness of category name within account and enforces
 * the limit of 15 custom categories per user.
 *
 * @procedure spCategoryCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier who is creating the category
 *
 * @param {NVARCHAR(30)} name
 *   - Required: Yes
 *   - Description: Category name (3-30 characters, no special chars except spaces and hyphens)
 *
 * @param {NVARCHAR(50)} icon
 *   - Required: Yes
 *   - Description: Icon identifier from system icon list
 *
 * @param {NVARCHAR(7)} color
 *   - Required: Yes
 *   - Description: Hexadecimal color code (e.g., #FF5733)
 *
 * @returns {INT} idCategory - Created category identifier
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Validation failure for duplicate category name
 * - Validation failure for name too short (< 3 chars)
 * - Validation failure for name too long (> 30 chars)
 * - Validation failure for invalid characters in name
 * - Validation failure when custom category limit (15) is reached
 * - Validation failure for missing required parameters
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
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

  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
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
   * @validation Validate category name uniqueness within account
   * @throw {categoryNameAlreadyExists}
   */
  IF EXISTS (
    SELECT *
    FROM [functional].[category] [cat]
    WHERE [cat].[idAccount] = @idAccount
      AND LOWER(LTRIM(RTRIM([cat].[name]))) = LOWER(LTRIM(RTRIM(@name)))
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'categoryNameAlreadyExists', 1;
  END;

  /**
   * @validation Validate custom category limit (15 per account)
   * @throw {customCategoryLimitReached}
   */
  DECLARE @customCategoryCount INTEGER;
  
  SELECT @customCategoryCount = COUNT(*)
  FROM [functional].[category] [cat]
  WHERE [cat].[idAccount] = @idAccount
    AND [cat].[type] = 'custom'
    AND [cat].[deleted] = 0;

  IF (@customCategoryCount >= 15)
  BEGIN
    ;THROW 51000, 'customCategoryLimitReached', 1;
  END;

  BEGIN TRY
    /**
     * @rule {fn-category-create} Create new custom category
     */
    BEGIN TRAN;

      INSERT INTO [functional].[category] (
        [idAccount],
        [name],
        [icon],
        [color],
        [type],
        [edited],
        [dateCreated],
        [dateModified]
      )
      VALUES (
        @idAccount,
        LTRIM(RTRIM(@name)),
        @icon,
        @color,
        'custom',
        0,
        GETUTCDATE(),
        GETUTCDATE()
      );

      /**
       * @output {CategoryCreated, 1, 1}
       * @column {INT} idCategory
       * - Description: Created category identifier
       */
      SELECT SCOPE_IDENTITY() AS [idCategory];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO