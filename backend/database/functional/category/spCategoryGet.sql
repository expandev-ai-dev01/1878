/**
 * @summary
 * Retrieves detailed information for a specific category including all attributes.
 * Used for category editing and detail views.
 *
 * @procedure spCategoryGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/category/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to retrieve
 *
 * @testScenarios
 * - Valid retrieval of existing category
 * - Validation failure for non-existent category
 * - Validation failure for deleted category
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryGet]
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
   * @rule {fn-category-get} Retrieve category details
   */
  /**
   * @output {CategoryDetail, 1, n}
   * @column {INT} idCategory
   * - Description: Category identifier
   * @column {NVARCHAR} name
   * - Description: Category name
   * @column {NVARCHAR} icon
   * - Description: Icon identifier
   * @column {NVARCHAR} color
   * - Description: Hexadecimal color code
   * @column {NVARCHAR} type
   * - Description: Category type (predefined or custom)
   * @column {BIT} edited
   * - Description: Whether predefined category has been edited
   */
  SELECT
    [cat].[idCategory],
    [cat].[name],
    [cat].[icon],
    [cat].[color],
    [cat].[type],
    [cat].[edited]
  FROM [functional].[category] [cat]
  WHERE [cat].[idCategory] = @idCategory
    AND [cat].[idAccount] = @idAccount
    AND [cat].[deleted] = 0;
END;
GO