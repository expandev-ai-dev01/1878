/**
 * @summary
 * Retrieves all active categories for an account, ordered alphabetically by name.
 * Used to populate category selection dropdown in expense creation form.
 *
 * @procedure spCategoryList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @returns {ResultSet} List of categories with id and name
 *
 * @testScenarios
 * - Valid retrieval of all categories for account
 * - Empty result for account with no categories
 * - Validation failure for missing idAccount
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryList]
  @idAccount INTEGER
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

  /**
   * @rule {fn-category-list} Retrieve all active categories ordered alphabetically
   */
  /**
   * @output {CategoryList, n, n}
   * @column {INT} idCategory
   * - Description: Category identifier
   * @column {NVARCHAR} name
   * - Description: Category name
   */
  SELECT
    [cat].[idCategory],
    [cat].[name]
  FROM [functional].[category] [cat]
  WHERE [cat].[idAccount] = @idAccount
    AND [cat].[deleted] = 0
  ORDER BY [cat].[name];
END;
GO