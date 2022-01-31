import crypto from "crypto";

const hash = (data: any) => {
	return crypto.createHash("sha256").update(data.toString()).digest("hex");
};

interface LeafNode {
	hash: string;
	left?: LeafNode;
	right?: LeafNode;
	level: number;
	isRoot: boolean;
}

class MerkleTree {
	nodes: LeafNode[];
	constructor() {
		this.nodes = [];
	}

	public createTree(dataList: any[]) {
		const hashDataList: string[] = dataList.map((data) => hash(data));
		const level = parseInt(`${dataList.length / 2}`) + (dataList.length % 2);
		const leafNodes: LeafNode[] = hashDataList.map<LeafNode>((hash) => ({
			hash,
			level,
			isRoot: hashDataList.length == 2,
		}));
		this.nodes = leafNodes;
		this._processLeaf(leafNodes);
	}

	private _processLeaf(nodes: LeafNode[]) {
		let tempNodes: LeafNode[] = [];
		for (let index = 0; index < nodes.length; index++) {
			if ((index + 1) % 2 == 0) {
				const leaf1 = nodes[index];
				const leaf2 = nodes[index + 1];

				const computedHash: string =
					leaf2 == undefined ? hash(leaf1) : hash(leaf1.hash + leaf2.hash);
				tempNodes.push({
					hash: computedHash,
					left: this.nodes[index],
					right: this.nodes[index + 1],
					level: nodes[index].level - 1,
					isRoot: nodes.length == 2,
				});
			}
		}
		this.nodes.push(...tempNodes);
	}
}

function main() {
	const dataList = [1, 5, 4, 8, 19, 32, 13, 10];
	const merkleTree: MerkleTree = new MerkleTree();

	merkleTree.createTree(dataList);
	console.log(merkleTree.nodes);
}

main();
