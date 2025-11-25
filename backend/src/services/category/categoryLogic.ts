/**
 * @summary
 * Category business logic implementation.
 * Handles all category operations with in-memory storage.
 *
 * @module services/category/categoryLogic
 */

import {
  CategoryListRequest,
  CategoryEntity,
  CategoryCreateRequest,
  CategoryGetRequest,
  CategoryUpdateRequest,
  CategoryDeleteRequest,
  CategoryRestoreRequest,
} from './categoryTypes';

const categories: CategoryEntity[] = [
  {
    idCategory: 1,
    idAccount: 1,
    name: 'Alimentação',
    icon: 'utensils',
    color: '#4CAF50',
    type: 'predefined',
    edited: false,
    originalName: 'Alimentação',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 2,
    idAccount: 1,
    name: 'Transporte',
    icon: 'car',
    color: '#2196F3',
    type: 'predefined',
    edited: false,
    originalName: 'Transporte',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 3,
    idAccount: 1,
    name: 'Lazer',
    icon: 'ticket',
    color: '#9C27B0',
    type: 'predefined',
    edited: false,
    originalName: 'Lazer',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 4,
    idAccount: 1,
    name: 'Contas',
    icon: 'document',
    color: '#F44336',
    type: 'predefined',
    edited: false,
    originalName: 'Contas',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 5,
    idAccount: 1,
    name: 'Saúde',
    icon: 'cross',
    color: '#E91E63',
    type: 'predefined',
    edited: false,
    originalName: 'Saúde',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 6,
    idAccount: 1,
    name: 'Educação',
    icon: 'book',
    color: '#FFC107',
    type: 'predefined',
    edited: false,
    originalName: 'Educação',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 7,
    idAccount: 1,
    name: 'Compras',
    icon: 'bag',
    color: '#795548',
    type: 'predefined',
    edited: false,
    originalName: 'Compras',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
  {
    idCategory: 8,
    idAccount: 1,
    name: 'Outros',
    icon: 'dots',
    color: '#9E9E9E',
    type: 'predefined',
    edited: false,
    originalName: 'Outros',
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  },
];

let nextId = 9;

export async function categoryList(params: CategoryListRequest): Promise<
  Array<{
    idCategory: number;
    name: string;
    icon: string;
    color: string;
    type: string;
    edited: boolean;
  }>
> {
  return categories
    .filter((cat) => cat.idAccount === params.idAccount && !cat.deleted)
    .map((cat) => ({
      idCategory: cat.idCategory,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      type: cat.type,
      edited: cat.edited,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function categoryCreate(
  params: CategoryCreateRequest
): Promise<{ idCategory: number }> {
  if (params.name.length < 3) {
    throw new Error('nameTooShort');
  }

  if (params.name.length > 30) {
    throw new Error('nameTooLong');
  }

  if (!/^[a-zA-Z0-9 -]+$/.test(params.name)) {
    throw new Error('nameContainsInvalidCharacters');
  }

  const nameExists = categories.some(
    (cat) =>
      cat.idAccount === params.idAccount &&
      cat.name.toLowerCase().trim() === params.name.toLowerCase().trim() &&
      !cat.deleted
  );

  if (nameExists) {
    throw new Error('categoryNameAlreadyExists');
  }

  const customCount = categories.filter(
    (cat) => cat.idAccount === params.idAccount && cat.type === 'custom' && !cat.deleted
  ).length;

  if (customCount >= 15) {
    throw new Error('customCategoryLimitReached');
  }

  const idCategory = nextId++;
  const now = new Date();

  const category: CategoryEntity = {
    idCategory,
    idAccount: params.idAccount,
    name: params.name.trim(),
    icon: params.icon,
    color: params.color,
    type: 'custom',
    edited: false,
    originalName: null,
    dateCreated: now,
    dateModified: now,
    deleted: false,
  };

  categories.push(category);

  return { idCategory };
}

export async function categoryGet(params: CategoryGetRequest): Promise<{
  idCategory: number;
  name: string;
  icon: string;
  color: string;
  type: string;
  edited: boolean;
}> {
  const category = categories.find(
    (cat) =>
      cat.idCategory === params.idCategory && cat.idAccount === params.idAccount && !cat.deleted
  );

  if (!category) {
    throw new Error('categoryDoesntExist');
  }

  return {
    idCategory: category.idCategory,
    name: category.name,
    icon: category.icon,
    color: category.color,
    type: category.type,
    edited: category.edited,
  };
}

export async function categoryUpdate(
  params: CategoryUpdateRequest
): Promise<{ idCategory: number }> {
  const category = categories.find(
    (cat) =>
      cat.idCategory === params.idCategory && cat.idAccount === params.idAccount && !cat.deleted
  );

  if (!category) {
    throw new Error('categoryDoesntExist');
  }

  if (params.name.length < 3) {
    throw new Error('nameTooShort');
  }

  if (params.name.length > 30) {
    throw new Error('nameTooLong');
  }

  if (!/^[a-zA-Z0-9 -]+$/.test(params.name)) {
    throw new Error('nameContainsInvalidCharacters');
  }

  const nameExists = categories.some(
    (cat) =>
      cat.idAccount === params.idAccount &&
      cat.idCategory !== params.idCategory &&
      cat.name.toLowerCase().trim() === params.name.toLowerCase().trim() &&
      !cat.deleted
  );

  if (nameExists) {
    throw new Error('categoryNameAlreadyExists');
  }

  category.name = params.name.trim();
  category.icon = params.icon;
  category.color = params.color;
  category.dateModified = new Date();

  if (category.type === 'predefined') {
    category.edited = true;
  }

  return { idCategory: category.idCategory };
}

export async function categoryDelete(
  params: CategoryDeleteRequest
): Promise<{ idCategory: number }> {
  const category = categories.find(
    (cat) =>
      cat.idCategory === params.idCategory && cat.idAccount === params.idAccount && !cat.deleted
  );

  if (!category) {
    throw new Error('categoryDoesntExist');
  }

  if (category.type === 'predefined') {
    throw new Error('cannotDeletePredefinedCategory');
  }

  const { getExpensesByCategory } = require('../expense/expenseLogic');
  const expenses = await getExpensesByCategory(params.idAccount, params.idCategory);

  if (expenses.length > 0) {
    if (!params.idSubstituteCategory) {
      throw new Error('substituteCategoryRequired');
    }

    const substituteCategory = categories.find(
      (cat) =>
        cat.idCategory === params.idSubstituteCategory &&
        cat.idAccount === params.idAccount &&
        cat.idCategory !== params.idCategory &&
        !cat.deleted
    );

    if (!substituteCategory) {
      throw new Error('substituteCategoryInvalid');
    }

    const { reassignExpenseCategory } = require('../expense/expenseLogic');
    await reassignExpenseCategory(params.idAccount, params.idCategory, params.idSubstituteCategory);
  }

  category.deleted = true;
  category.dateModified = new Date();

  return { idCategory: category.idCategory };
}

export async function categoryRestore(
  params: CategoryRestoreRequest
): Promise<{ idCategory: number }> {
  const category = categories.find(
    (cat) =>
      cat.idCategory === params.idCategory && cat.idAccount === params.idAccount && !cat.deleted
  );

  if (!category) {
    throw new Error('categoryDoesntExist');
  }

  if (category.type !== 'predefined') {
    throw new Error('cannotRestoreCustomCategory');
  }

  if (!category.edited) {
    throw new Error('categoryNotEdited');
  }

  const originalDefaults: { [key: string]: { icon: string; color: string } } = {
    Alimentação: { icon: 'utensils', color: '#4CAF50' },
    Transporte: { icon: 'car', color: '#2196F3' },
    Lazer: { icon: 'ticket', color: '#9C27B0' },
    Contas: { icon: 'document', color: '#F44336' },
    Saúde: { icon: 'cross', color: '#E91E63' },
    Educação: { icon: 'book', color: '#FFC107' },
    Compras: { icon: 'bag', color: '#795548' },
    Outros: { icon: 'dots', color: '#9E9E9E' },
  };

  const originalName = category.originalName || category.name;
  const defaults = originalDefaults[originalName];

  if (defaults) {
    category.name = originalName;
    category.icon = defaults.icon;
    category.color = defaults.color;
    category.edited = false;
    category.dateModified = new Date();
  }

  return { idCategory: category.idCategory };
}
