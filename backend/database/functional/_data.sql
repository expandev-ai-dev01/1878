/**
 * @load category
 */
INSERT INTO [functional].[category]
([idAccount], [name], [icon], [color], [type], [edited], [originalName])
VALUES
(1, 'Alimentação', 'utensils', '#4CAF50', 'predefined', 0, 'Alimentação'),
(1, 'Transporte', 'car', '#2196F3', 'predefined', 0, 'Transporte'),
(1, 'Lazer', 'ticket', '#9C27B0', 'predefined', 0, 'Lazer'),
(1, 'Contas', 'document', '#F44336', 'predefined', 0, 'Contas'),
(1, 'Saúde', 'cross', '#E91E63', 'predefined', 0, 'Saúde'),
(1, 'Educação', 'book', '#FFC107', 'predefined', 0, 'Educação'),
(1, 'Compras', 'bag', '#795548', 'predefined', 0, 'Compras'),
(1, 'Outros', 'dots', '#9E9E9E', 'predefined', 0, 'Outros');
GO