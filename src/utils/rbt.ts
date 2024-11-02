enum Color {
    RED = 'RED',
    BLACK = 'BLACK',
}

class Node<T> {
    value: T;
    color: Color;
    left: Node<T> | null = null;
    right: Node<T> | null = null;
    parent: Node<T> | null = null;

    constructor(value: T, color: Color, parent: Node<T> | null = null) {
        this.value = value;
        this.color = color;
        this.parent = parent;
    }
}

export class RedBlackTree<T> {
    root: Node<T> | null = null;

    // Left rotation
    private rotateLeft(node: Node<T>): void {
        const rightChild = node.right;
        if (!rightChild) return;

        node.right = rightChild.left;
        if (rightChild.left) rightChild.left.parent = node;

        rightChild.parent = node.parent;
        if (!node.parent) {
            this.root = rightChild;
        } else if (node === node.parent.left) {
            node.parent.left = rightChild;
        } else {
            node.parent.right = rightChild;
        }

        rightChild.left = node;
        node.parent = rightChild;
    }

    // Right rotation
    private rotateRight(node: Node<T>): void {
        const leftChild = node.left;
        if (!leftChild) return;

        node.left = leftChild.right;
        if (leftChild.right) leftChild.right.parent = node;

        leftChild.parent = node.parent;
        if (!node.parent) {
            this.root = leftChild;
        } else if (node === node.parent.left) {
            node.parent.left = leftChild;
        } else {
            node.parent.right = leftChild;
        }

        leftChild.right = node;
        node.parent = leftChild;
    }

    // Insertion
    insert(value: T): void {
        const newNode = new Node(value, Color.RED);
        if (!this.root) {
            this.root = newNode;
            this.root.color = Color.BLACK;
            return;
        }

        let parent: Node<T> | null = null;
        let current: Node<T> | null = this.root;

        // Traverse to find the right place for the new node
        while (current) {
            parent = current;
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        newNode.parent = parent;
        if (parent) {
            if (value < parent.value) {
                parent.left = newNode;
            } else {
                parent.right = newNode;
            }
        }

        this.fixInsert(newNode);
    }

    // Balancing the tree after insertion
    private fixInsert(node: Node<T>): void {
        while (node.parent && node.parent.color === Color.RED) {
            const parent = node.parent;
            const grandParent = parent.parent;

            if (!grandParent) break;

            if (parent === grandParent.left) {
                const uncle = grandParent.right;
                if (uncle && uncle.color === Color.RED) {
                    // Case 1: Uncle is red
                    parent.color = Color.BLACK;
                    uncle.color = Color.BLACK;
                    grandParent.color = Color.RED;
                    node = grandParent;
                } else {
                    if (node === parent.right) {
                        // Case 2: Node is a right child
                        node = parent;
                        this.rotateLeft(node);
                    }
                    // Case 3: Node is a left child
                    parent.color = Color.BLACK;
                    grandParent.color = Color.RED;
                    this.rotateRight(grandParent);
                }
            } else {
                const uncle = grandParent.left;
                if (uncle && uncle.color === Color.RED) {
                    // Case 1: Uncle is red
                    parent.color = Color.BLACK;
                    uncle.color = Color.BLACK;
                    grandParent.color = Color.RED;
                    node = grandParent;
                } else {
                    if (node === parent.left) {
                        // Case 2: Node is a left child
                        node = parent;
                        this.rotateRight(node);
                    }
                    // Case 3: Node is a right child
                    parent.color = Color.BLACK;
                    grandParent.color = Color.RED;
                    this.rotateLeft(grandParent);
                }
            }
        }
        if (this.root) this.root.color = Color.BLACK;
    }

    // Deletion
    delete(value: T): void {
        // Find node to delete
        const nodeToDelete = this.findNode(value, this.root);
        if (!nodeToDelete) return;

        let replacementNode: Node<T> | null;
        let originalColor = nodeToDelete.color;

        if (!nodeToDelete.left) {
            replacementNode = nodeToDelete.right;
            this.transplant(nodeToDelete, nodeToDelete.right);
        } else if (!nodeToDelete.right) {
            replacementNode = nodeToDelete.left;
            this.transplant(nodeToDelete, nodeToDelete.left);
        } else {
            const minRightSubtree = this.getMinimum(nodeToDelete.right);
            originalColor = minRightSubtree.color;
            replacementNode = minRightSubtree.right;

            if (minRightSubtree.parent === nodeToDelete) {
                if (replacementNode) replacementNode.parent = minRightSubtree;
            } else {
                this.transplant(minRightSubtree, minRightSubtree.right);
                minRightSubtree.right = nodeToDelete.right;
                if (minRightSubtree.right)
                    minRightSubtree.right.parent = minRightSubtree;
            }

            this.transplant(nodeToDelete, minRightSubtree);
            minRightSubtree.left = nodeToDelete.left;
            if (minRightSubtree.left)
                minRightSubtree.left.parent = minRightSubtree;
            minRightSubtree.color = nodeToDelete.color;
        }

        if (originalColor === Color.BLACK) this.fixDelete(replacementNode);
    }

    // Helper method to find a node with a given value
    private findNode(value: T, node: Node<T> | null): Node<T> | null {
        while (node) {
            if (value < node.value) {
                node = node.left;
            } else if (value > node.value) {
                node = node.right;
            } else {
                return node;
            }
        }
        return null;
    }

    // Utility to replace one subtree as a child of its parent with another subtree
    private transplant(u: Node<T> | null, v: Node<T> | null): void {
        if (!u?.parent) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        if (v) v.parent = u?.parent ?? null;
    }

    // Balancing the tree after deletion
    private fixDelete(node: Node<T> | null): void {
        while (node !== this.root && node?.color === Color.BLACK) {
            if (node === node?.parent?.left) {
                let sibling = node.parent?.right;
                if (sibling?.color === Color.RED) {
                    sibling.color = Color.BLACK;
                    node.parent!.color = Color.RED;
                    this.rotateLeft(node.parent!);
                    sibling = node.parent?.right;
                }
                if (
                    sibling &&
                    sibling.left?.color === Color.BLACK &&
                    sibling.right?.color === Color.BLACK
                ) {
                    sibling.color = Color.RED;
                    node = node.parent!;
                } else {
                    if (sibling && sibling.right?.color === Color.BLACK) {
                        sibling.left!.color = Color.BLACK;
                        sibling.color = Color.RED;
                        this.rotateRight(sibling);
                        sibling = node.parent?.right;
                    }
                    if (sibling) {
                        sibling.color = node.parent!.color;
                        node.parent!.color = Color.BLACK;
                        sibling.right!.color = Color.BLACK;
                        this.rotateLeft(node.parent!);
                        node = this.root!;
                    }
                }
            } else {
                let sibling = node.parent?.left;
                if (sibling?.color === Color.RED) {
                    sibling.color = Color.BLACK;
                    node.parent!.color = Color.RED;
                    this.rotateRight(node.parent!);
                    sibling = node.parent?.left;
                }
                if (
                    sibling &&
                    sibling.left?.color === Color.BLACK &&
                    sibling.right?.color === Color.BLACK
                ) {
                    sibling.color = Color.RED;
                    node = node.parent!;
                } else {
                    if (sibling && sibling.right?.color === Color.BLACK) {
                        sibling.left!.color = Color.BLACK;
                        sibling.color = Color.RED;
                        this.rotateLeft(sibling);
                        sibling = node.parent?.left;
                    }
                    if (sibling) {
                        sibling.color = node.parent!.color;
                        node.parent!.color = Color.BLACK;
                        sibling.left!.color = Color.BLACK;
                        this.rotateRight(node.parent!);
                        node = this.root!;
                    }
                }
            }
        }
        if (node) node.color = Color.BLACK;
    }

    // Helper to find the minimum node starting from a given node
    getMinimum(node: Node<T> | null): Node<T> {
        while (node?.left) node = node.left;
        return node!;
    }

    // Helper to find the right-most node
    getMaximum(node: Node<T> | null = this.root): Node<T> | null {
        if (node === null) {
            return null;
        }

        while (node.right !== null) {
            node = node.right;
        }

        return node;
    }

    inOrder(node: Node<T> | null = this.root, result: T[] = []): T[] {
        if (node !== null) {
            this.inOrder(node.left, result);
            result.push(node.value);
            this.inOrder(node.right, result);
        }
        return result;
    }
}
