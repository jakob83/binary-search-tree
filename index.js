class Node {
  constructor(data, leftTree = null, rightTree = null) {
    this.data = data;
    this.left = leftTree;
    this.right = rightTree;
  }
}

class Tree {
  constructor(array) {
    this.array = this.cleanArray(array);
    this.root = this.buildTree(this.array);
  }

  constructTree(array, start, end) {
    if (!array || start > end) return null;
    const mid = Math.floor((start + end) / 2);
    const node = new Node(array[mid]);
    node.left = this.constructTree(array, start, mid - 1);
    node.right = this.constructTree(array, mid + 1, end);
    return node;
  }

  cleanArray(array) {
    if (!Array.isArray(array)) {
      return null;
    }
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
  buildTree(array) {
    if (!Array.isArray(array)) {
      return null;
    }
    this.root = this.constructTree(array, 0, array.length - 1);
    return this.root;
  }

  insert(value) {
    if (!this.root) {
      this.root = new Node(value, null, null);
      return true;
    }
    if (typeof value !== 'number') {
      return false;
    }
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
    if (!this.root) throw new Error('no root');
    let parent = this.root;
    let child = parent.left;
    if (value > parent.data) {
      child = parent.right;
    }
    if (parent.data === value) {
      child = parent;
      parent = null;
    }
    while (child) {
      if (child.data === value) {
        // if child is a leaf then just delete it
        if (!child.left && !child.right) {
          if (!parent) {
            this.root = null;
            return true;
          }
          if (parent.left === child) {
            parent.left = null;
          } else {
            parent.right = null;
          }
          return true;
        }
        // if child has only one child set that child to be child of child => confusing i know
        else if ((child.right && !child.left) || (!child.right && child.left)) {
          if (!parent) {
            if (child.right) {
              this.root = child.right;
            } else {
              this.root = child.left;
            }
            return true;
          }
          if (child.right) {
            parent.left = child.right;
          } else {
            parent.left = child.left;
          }
          return true;
        }
        // if child has two children
        else {
          // search the next biggest element by going to the right subtree of child and then always left, until there is no more
          let child2 = child.right;
          while (child2.left) {
            child2 = child2.left;
          }
          let copy = child2.data;
          this.remove(child2.data);
          child.data = copy;
          return true;
        }
      } else if (value > child.data) {
        parent = child;
        child = child.right;
      } else {
        parent = child;
        child = child.left;
      }
    }
  }

  removeRec(value, child = this.root, parent = null) {
    if (!child) return null;
    if (value === child.data) {
      if (!child.left || !child.right) {
        const newChild = child.right ? child.right : child.left;
        if (parent) {
          let dir = 'left';
          if (parent.right === child) dir = 'right';
          parent[dir] = newChild;
        } else {
          this.root = newChild;
        }
      } else {
        let sub = child.right;
        let subPar = child;
        while (sub.left) {
          subPar = sub;
          sub = sub.left;
        }
        child.data = sub.data;
        this.removeRec(sub.data, sub, subPar);
      }
      return value;
    } else if (value < child.data) {
      return this.removeRec(value, child.left, child);
    } else {
      return this.removeRec(value, child.right, child);
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
  find(value) {
    if (typeof value !== 'number') return null;
    let curr = this.root;
    while (curr) {
      if (curr.data === value) {
        return curr;
      } else if (curr.data > value) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
    return null;
  }
  levelOrder(callback) {
    if (!this.root) throw new Error('no root');
    if (!callback) throw new Error('No callback function provided');
    const queue = [this.root];
    while (queue.length > 0) {
      let curr = queue.shift();
      if (curr.left) {
        queue.push(curr.left);
      }
      if (curr.right) {
        queue.push(curr.right);
      }
      callback(curr);
    }
  }
  levelOrderRecursive(callback, queue = [this.root]) {
    if (typeof callback != 'function')
      throw new Error('No callback function provided');
    if (queue.length <= 0) {
      return;
    }
    let curr = queue.shift();
    if (curr.left) {
      queue.push(curr.left);
    }
    if (curr.right) {
      queue.push(curr.right);
    }
    callback(curr);
    this.levelOrderRecursive(callback, queue);
  }

  inOrder(node = this.root, callback) {
    if (typeof callback !== 'function')
      throw new Error('No callback function provided');
    if (node === null) return;
    this.inOrder(node.left, callback);
    callback(node);
    this.inOrder(node.right, callback);
  }
  preOrder(node = this.root, callback) {
    if (typeof callback !== 'function')
      throw new Error('No callback function provided');
    if (node === null) {
      return;
    }
    callback(node);
    this.preOrder(node.left, callback);
    this.preOrder(node.right, callback);
  }
  postOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error('No callback function provided');
    }
    if (node === null) {
      return;
    }
    this.preOrder(node.left, callback);
    this.preOrder(node.right, callback);
    callback(node);
  }
  height(node = this.root) {
    let queue = [node];
    let count = 0;
    while (queue.length > 0) {
      let newQueue = [];
      queue.forEach((node) => {
        if (node.left) {
          newQueue.push(node.left);
        }
        if (node.right) {
          newQueue.push(node.right);
        }
      });
      queue = newQueue;
      count += 1;
    }
    return count;
  }
  heightRec(node = this.root) {
    if (!node) return 0;
    return Math.max(
      this.heightRec(node.right) + 1,
      this.heightRec(node.left) + 1
    );
  }
  depth(node) {
    let curr = this.root;
    let count = 1;
    while (curr) {
      if (node.data === curr.data) return count;
      if (node.data > curr.data) {
        if (!curr.right) return null;
        curr = curr.right;
      } else {
        if (!curr.left) return null;
        curr = curr.left;
      }
      count += 1;
    }
  }
  isBalanced() {
    if (!this.root) return true;
    const leftHeight = this.height(this.root.left);
    const rightHeight = this.height(this.root.right);
    return leftHeight - rightHeight < 1 && leftHeight - rightHeight > -1;
  }
  rebalance() {
    if (!this.root) {
      return;
    }
    let array = [];
    this.inOrder(this.root, (node) => array.push(node.data));
    this.buildTree(array);
  }
}
