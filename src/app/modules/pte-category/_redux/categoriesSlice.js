import { createSlice } from "@reduxjs/toolkit";
import cloneDeep from "lodash/cloneDeep";

const initialCategoriesState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  // entities: null,
  entities: [{ id: 1, name: "PTE COURSE" }],
  categoryForEdit: undefined,
  lastError: null,
  categoryBookingList: null,
  level0: [],
  level1: [],
  level2: [],
  ////////////
  tree: [],
};
export const callTypes = {
  list: "list",
  action: "action",
};

var addChildren = function(tree, index, callback) {
  var fi = tree.findIndex((i) => i.id === index);
  if (fi !== -1) {
    callback(fi, tree);
    return tree;
  }
  for (let item of tree) {
    if (item.childs) {
      item.childs = addChildren(item.childs, index, callback);
    }
  }
  return tree;
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialCategoriesState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    // getcategoryById
    categoryFetched: (state, action) => {
      state.actionsLoading = false;
      state.packageForEdit = action.payload.packageForEdit;
      state.error = null;
    },

    treeChildsAdd: (state, action) => {
      state.listLoading = false;
      state.error = null;
      const { id, childs } = action.payload;
      if (id == 0) state.tree = childs;
      else {
        var tree = cloneDeep(state.tree);
        var newTree = addChildren(tree, id, (nodeIndex, tree) => {
          // add childs
          if (tree[nodeIndex].childs)
            tree[nodeIndex].childs = [...tree[nodeIndex].childs, ...childs];
          else tree[nodeIndex].childs = childs;
        });
        state.tree = newTree;
      }
    },

    treeChildAdd: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { id, child } = action.payload;
      if (id) {
        var tree = cloneDeep(state.tree);
        var newTree = addChildren(tree, id, (nodeIndex, tree) => {
          // add childs
          if (tree[nodeIndex].childs) tree[nodeIndex].childs.push(child);
          else tree[nodeIndex].childs = [child];
        });
        state.tree = newTree;
      } else {
        state.tree.push(child);
      }
    },

    treeChildUpdate: (state, action) => {
      const { id, name } = action.payload;
      var tree = cloneDeep(state.tree);
      var newTree = addChildren(tree, id, (nodeIndex, tree) => {
        // Edit some fields
        tree[nodeIndex].name = name;
      });
      state.tree = newTree;
    },
    treeChildDelete: (state, action) => {
      const { parentId, id } = action.payload;
      if (!parentId) {
        state.tree = state.tree.filter((n) => n.id !== id);
      } else {
        var tree = cloneDeep(state.tree);
        var newTree = addChildren(tree, parentId, (nodeIndex, tree) => {
          // Delete a child
          tree[nodeIndex].childs = tree[nodeIndex].childs.filter(
            (ch) => ch.id !== id // => id: nodeId
          );
        });
        state.tree = newTree;
      }
    },

    // findcategories
    categoriesFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      // state.entities = entities;
      // state.totalCount = totalCount;
    },

    categoriesFetchChilds: (state, action) => {
      const { entities, levelIndex } = action.payload;
      state.listLoading = false;
      state.error = null;
      switch (levelIndex) {
        case 0:
          state.level0 = entities;
          break;
        case 1:
          state.level1 = entities;
          break;
        case 2:
          state.level2 = entities;
          break;
      }
    },
    // findcategories
    categoryBookingListFetched: (state, action) => {
      const { entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.categoryBookingList = entities;
    },

    // createcategory
    categoryCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.category);
    },
    // updatecategory
    categoryUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.category.id) {
          return action.payload.category;
        }
        return entity;
      });
    },
    // deletecategory
    categoryDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deletecategories
    categoriesDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    resetLevel1: (state, action) => {
      state.level1 = [];
    },
    resetLevel2: (state, action) => {
      state.level2 = [];
    },
    resetTree: (state, action) => {
      state.tree = [];
    },

    // categoriesUpdateState
    categoriesStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map((entity) => {
        if (ids.findIndex((id) => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    },
  },
});
