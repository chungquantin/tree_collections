import crypto from "crypto";

const hash = (data: any) => {
	return crypto.createHash("sha256").update(data.toString()).digest("hex");
};

interface LeafNode {
	hash: string;
	left?: LeafNode;
	right?: LeafNode;
	isRoot: boolean;
}

class MerkleTree {
	nodes: LeafNode[];
	treeDepth: number;
	constructor() {
		this.nodes = [];
		this.treeDepth = 0;
	}

	public getTreeDepth(lengthOfNodes: number) {
		return Math.ceil(Math.log2(lengthOfNodes));
	}

	public createTree(dataList: any[]) {
		const hashDataList: string[] = dataList.map((data) => hash(data));
		const leafNodes: LeafNode[] = hashDataList.map<LeafNode>((hash, index) => ({
			hash,
			isRoot: hashDataList.length == 2,
		}));
		this.nodes = leafNodes;
		this._processLeaf(leafNodes);
	}

	public verify(leaf: any, proofs: LeafNode[]) {}

	public getProofs(leafHash: string, proofs: LeafNode[]): LeafNode[] {
		if (this.nodes.length == 0)
			throw new Error("Merkle Tree is not constructed");

		const foundLeaf: LeafNode | undefined = this.nodes.find(
			(node) => node.left?.hash === leafHash || node.right?.hash === leafHash
		);
		if (foundLeaf === undefined) return proofs;
		const proof =
			foundLeaf?.left?.hash === leafHash ? foundLeaf?.right : foundLeaf?.left;
		if (proof === undefined) return proofs;
		proofs.push(proof);
		return this.getProofs(foundLeaf.hash, proofs);
	}

	private _processLeaf(nodes: LeafNode[]) {
		if (nodes.length <= 1) return;
		let tempNodes: LeafNode[] = [];
		let curNodes: LeafNode[] = [];
		for (let index = 0; index < nodes.length; index++) {
			if (index % 2 == 0) {
				const leaf1 = nodes[index];
				const leaf2 = nodes[index + 1];
				if (leaf2 == undefined) tempNodes.push(leaf1);
				else {
					const computedHash: string = hash(leaf1.hash + leaf2.hash);
					const leafNode = {
						hash: computedHash,
						left: nodes[index],
						right: nodes[index + 1],
						isRoot: nodes.length == 2,
					};
					curNodes.push(leafNode);
				}
			}
		}

		this.nodes.push(...curNodes);
		this._processLeaf(curNodes.concat(tempNodes));
	}
}

function main() {
	const dataList = [1, 5, 4, 8, 19, 32, 13, 50, 12, 11];
	const merkleTree: MerkleTree = new MerkleTree();

	merkleTree.createTree(dataList);
	//console.log(merkleTree.nodes.reverse());
	const proofs = merkleTree.getProofs(hash(5), []);
	console.log(proofs);
	merkleTree.verify(5, []);
}

main();
