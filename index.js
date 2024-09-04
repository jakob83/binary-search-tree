class Node {
  constructor(data, leftTree, rightTree) {
    this.data = data;
    this.left = leftTree;
    this.right = rightTree;
  }
}

class Tree {
  constructor(array) {
    this.array = this.cleanArray(array);
    this.root = this.buildTree();
  }

  constructTree(array, start, end) {
    if (start > end) return null;
    const mid = Math.floor((start + end) / 2);
    const node = new Node(array[mid]);
    node.left = this.constructTree(array, start, mid - 1);
    node.right = this.constructTree(array, mid + 1, end);
    this.root = node;
    return node;
  }

  cleanArray(array) {
    let cleanArray = array;
    // sort array
    cleanArray.sort((a, b) => a - b);
    // remove duplicates
    for (let i = 0; i < cleanArray.length; i++) {
      if (cleanArray[i] === cleanArray[i + 1]) {
        cleanArray.splice(i, 1);
        i = i - 1;
      }
    }
    return cleanArray;
  }
  buildTree() {
    this.root = this.constructTree(this.array, 0, this.array.length - 1);
    return this.root;
  }

  insert(value) {
    let curr = this.root;
    while (curr) {
      if (value === curr.data) {
        return false;
      } else if (value < curr.data) {
        if (!curr.left) {
          curr.left = new Node(value, null, null);
          return true;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = new Node(value, null, null);
          return true;
        }
        curr = curr.right;
      }
    }
    return false;
  }
  remove(value) {
    let curr = this.root;
    while (curr) {
      if (value < curr.data) {
        // to remember the parent of the new initialized curr
        let headNode = curr;
        curr = curr.left;
        // check if the new curr exists
        if (curr) {
          if (curr.data === value) {
            // if curr is a leaf then just delete it
            if (!curr.left && !curr.right) {
              headNode.left = null;
            }
            // if curr has only one child set that child to be curr
            else if ((curr.right && !curr.left) || (!curr.right && curr.left)) {
              if (curr.right) {
                headNode.left = curr.right;
              } else {
                headNode.left = curr.left;
              }
            }
            // if curr has two children
            else {
              // search the next biggest element by going to the right subtree of curr and then always left, until there is no more
              let curr2 = curr.right;
              while (curr2.left) {
                curr2 = curr2.left;
              }
              let copy = curr2.data;
              this.remove(curr2.data);
              curr.data = copy;
            }
          }
        }
      } else {
        let headNode = curr;
        curr = curr.right;
        // check if the new curr exists
        if (curr) {
          if (curr.data === value) {
            // if curr is a leaf then just delete it
            if (!curr.left && !curr.right) {
              headNode.right = null;
            } else if (
              (curr.right && !curr.left) ||
              (!curr.right && curr.left)
            ) {
              if (curr.right) {
                headNode.right = curr.right;
              } else {
                headNode.right = curr.left;
              }
            } else {
              let curr2 = curr.right;
              while (curr2.left) {
                curr2 = curr2.left;
              }
              let copy = curr2.data;
              this.remove(curr2.data);
              curr.data = copy;
            }
          }
        }
      }
    }
  }

  prettyPrint(node, prefix = '', isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }
}
let tree = new Tree([
  2, 1, 1, 3, 5, 6, 8, 2, 10, 11, 12, 9, 13, 14, 1, 4, 5, 1, 2, 6, 4, 3, 7, 5,
]);
tree.insert(0);
tree.remove(8);
console.log(tree.prettyPrint(tree.root));
